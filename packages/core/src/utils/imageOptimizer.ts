/**
 * Optimizes image URLs using wsrv.nl (formerly images.weserv.nl)
 * Zero-config image transformation & caching service.
 *
 * @param url - Original image URL
 * @param width - Target width for resizing (optional)
 * @returns Optimized image URL
 */
export const optimizeImage = (url: string | null | undefined, width?: number): string => {
  if (!url) return ''

  // Skip optimization for local assets, data URIs, or already optimized URLs
  if (
    url.startsWith('/') ||
    url.startsWith('data:') ||
    url.includes('wsrv.nl') ||
    url.includes('localhost') ||
    url.includes('127.0.0.1')
  ) {
    return url
  }

  try {
    // Check if valid URL
    new URL(url)

    // Encode the original URL
    const encodedUrl = encodeURIComponent(url.replace(/^https?:\/\//, ''))
    const protocol = url.startsWith('https') ? 'ssl:' : 'url' // wsrv format: //wsrv.nl/?url=ssl:example.com/img.jpg

    // Construct common parameters
    // output=webp: Convert to modern format
    // q=80: Quality 80 (balanced)
    // f_auto: redundant for wsrv but kept for conceptual alignment with Cloudinary, wsrv uses 'output'
    // w: width if provided
    let optimizeUrl = `https://wsrv.nl/?url=${url}&output=webp&q=80&n=-1`

    if (width) {
      optimizeUrl += `&w=${width}`
    }

    return optimizeUrl
  } catch (e) {
    // If invalid URL, return original
    return url
  }
}
