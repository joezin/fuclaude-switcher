// Generate a random string of specified length
export function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Generate fuclaude URL
export function generateFuclaudeUrl(sessionKey) {
  const randomPrefix = generateRandomString(4);
  return `${randomPrefix}.fuclaude.oaifree.com/login_token?session_key=${sessionKey}`;
}

// Copy text to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
} 