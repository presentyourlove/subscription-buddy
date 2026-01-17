/**
 * CryptoService.ts
 * Implements Hybrid Encryption: RSA-OAEP (Key Exchange) + AES-GCM (Message Encryption)
 */

export class CryptoService {
  private static readonly RSA_ALGO = {
    name: 'RSA-OAEP',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256'
  }

  private static readonly AES_ALGO = 'AES-GCM'
  private static readonly KEY_FORMAT_PUB = 'spki'
  private static readonly KEY_FORMAT_PRIV = 'pkcs8'

  /**
   * Generate RSA Key Pair
   * Private key stays in IndexedDB, Public key goes to Firestore
   */
  async generateKeyPair(): Promise<CryptoKeyPair> {
    return window.crypto.subtle.generateKey(CryptoService.RSA_ALGO, true, ['encrypt', 'decrypt'])
  }

  /**
   * Export Key to base64 string
   */
  async exportKey(key: CryptoKey): Promise<string> {
    const format =
      key.type === 'public' ? CryptoService.KEY_FORMAT_PUB : CryptoService.KEY_FORMAT_PRIV
    const exported = await window.crypto.subtle.exportKey(format, key)
    return this.ab2str(exported)
  }

  /**
   * Import Key from base64 string
   */
  async importKey(keyStr: string, type: 'public' | 'private'): Promise<CryptoKey> {
    const binaryDer = this.str2ab(keyStr)
    const format = type === 'public' ? CryptoService.KEY_FORMAT_PUB : CryptoService.KEY_FORMAT_PRIV
    const usage: KeyUsage[] = type === 'public' ? ['encrypt'] : ['decrypt']
    return window.crypto.subtle.importKey(format, binaryDer, CryptoService.RSA_ALGO, true, usage)
  }

  /**
   * Encrypt a message for multiple recipients (Hybrid Encryption)
   */
  async encryptMessage(
    text: string,
    recipientPublicKeys: CryptoKey[]
  ): Promise<{
    cipherText: string
    encryptedKeys: string[] // Ordered matching recipientPublicKeys
    iv: string
  }> {
    // 1. Generate AES Session Key
    const sessionKey = await window.crypto.subtle.generateKey(
      { name: CryptoService.AES_ALGO, length: 256 },
      true,
      ['encrypt']
    )

    // 2. Encrypt Message with AES
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encodedText = new TextEncoder().encode(text)
    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: CryptoService.AES_ALGO, iv },
      sessionKey,
      encodedText
    )

    // 3. Encrypt AES Key with each Recipient's RSA Public Key
    const rawSessionKey = await window.crypto.subtle.exportKey('raw', sessionKey)
    const encryptedKeys: string[] = []

    for (const pubKey of recipientPublicKeys) {
      const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        pubKey,
        rawSessionKey
      )
      encryptedKeys.push(this.ab2str(encryptedKeyBuffer))
    }

    return {
      cipherText: this.ab2str(encryptedContent),
      encryptedKeys,
      iv: this.ab2str(iv)
    }
  }

  /**
   * Decrypt a message
   */
  async decryptMessage(
    cipherText: string,
    encryptedKey: string,
    iv: string,
    privateKey: CryptoKey
  ): Promise<string> {
    // 1. Decrypt AES Key using RSA Private Key
    const encryptedKeyBuffer = this.str2ab(encryptedKey)
    const rawSessionKey = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encryptedKeyBuffer
    )

    // 2. Import AES Key
    const sessionKey = await window.crypto.subtle.importKey(
      'raw',
      rawSessionKey,
      { name: CryptoService.AES_ALGO },
      false,
      ['decrypt']
    )

    // 3. Decrypt Message Content
    const ivBuffer = this.str2ab(iv)
    const encryptedContentBuffer = this.str2ab(cipherText)
    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: CryptoService.AES_ALGO, iv: ivBuffer },
      sessionKey,
      encryptedContentBuffer
    )

    return new TextDecoder().decode(decryptedContent)
  }

  // --- Helpers ---
  private ab2str(buf: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
  }

  private str2ab(str: string): ArrayBuffer {
    const binaryString = atob(str)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }
}

export const cryptoService = new CryptoService()
