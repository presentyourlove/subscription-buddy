/**
 * Get logo URL for common services
 * @param {string} title - Service title
 * @returns {string|null} - URL of the logo or null
 */
/**
 * Get logo URL based on service name
 * @param {string} title - Service name (e.g. "Netflix")
 * @returns {string|null} - URL to logo image or null if not found
 */
export const getServiceLogo = (title) => {
  if (!title) return null
  const t = title.toLowerCase()
  if (t.includes('netflix'))
    return 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'
  if (t.includes('spotify'))
    return 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg'
  if (t.includes('youtube'))
    return 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg'
  if (t.includes('disney'))
    return 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg'
  if (t.includes('apple') || t.includes('icloud'))
    return 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  if (t.includes('nintendo') || t.includes('switch'))
    return 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg'
  if (t.includes('chatgpt') || t.includes('openai'))
    return 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'
  return null
}
