import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as path from 'path'
import * as sharp from 'sharp'
import * as fs from 'fs-extra'
import * as os from 'os'

// Ensure sharp is available (it might fail in some environments without native deps)
// Deployment environment (GCP) usually handles this, but local emulation needs compatible binaries.

export const optimizeImage = functions.storage.object().onFinalize(async (object) => {
    const filePath = object.name
    if (!filePath) return null

    // Exit if this is triggered on a file that is not an image.
    if (!filePath.match(/\.(jpg|jpeg|png)$/i)) {
        console.log('This is not an image.')
        return null
    }

    // Exit if this is already a thumbnail.
    if (filePath.includes('_320w') || filePath.includes('_640w') || filePath.includes('_1024w') || filePath.includes('_1920w')) {
        console.log('Already optimized.')
        return null
    }

    const bucket = admin.storage().bucket(object.bucket)
    const fileName = path.basename(filePath)
    const workingDir = path.join(os.tmpdir(), 'thumbs')
    const tempFilePath = path.join(workingDir, fileName)

    // 1. Ensure temp directory exists
    await fs.ensureDir(workingDir)

    // 2. Download source file
    await bucket.file(filePath).download({ destination: tempFilePath })
    console.log('Image downloaded locally to', tempFilePath)

    // 3. Generate sizes and formats
    const sizes = [320, 640, 1024, 1920]
    const formats = ['webp', 'avif']

    const uploadPromises = sizes.flatMap(size => {
        return formats.map(async format => {
            const extension = format
            const thumbFileName = `${fileName.replace(/\.(jpg|jpeg|png)$/i, '')}_${size}w.${extension}`
            const thumbFilePath = path.join(workingDir, thumbFileName)
            const destination = path.join(path.dirname(filePath), thumbFileName)

            // Resize and convert
            await sharp(tempFilePath)
                .resize(size, null, { withoutEnlargement: true })
                .toFormat(format as keyof sharp.FormatEnum, { quality: 85 })
                .toFile(thumbFilePath)

            // Upload to Storage
            await bucket.upload(thumbFilePath, {
                destination: destination,
                metadata: {
                    contentType: `image/${format}`,
                    cacheControl: 'public, max-age=31536000, immutable' // Long cache for immutable assets
                }
            })

            // Clean up local temp file
            return fs.unlink(thumbFilePath)
        })
    })

    await Promise.all(uploadPromises)

    // 4. Cleanup source temp file
    await fs.unlink(tempFilePath)

    console.log('Image optimization finished.')
    return null
})
