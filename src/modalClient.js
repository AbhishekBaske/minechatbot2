// Shared Modal API client
const MODAL_API_URL = process.env.MODAL_API_URL || 'https://abhishekbaske--coal-mines-chatbot-api.modal.run'

export async function sendQuery(query) {
  if (!query) throw new Error('Query is required')

  const id = process.env.MODAL_TOKEN_ID
  const secret = process.env.MODAL_TOKEN_SECRET
  if (!id || !secret) throw new Error('Missing Modal credentials')

  const auth = Buffer.from(`${id}:${secret}`).toString('base64')

  const res = await fetch(MODAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({ query }),
  })

  const text = await res.text()
  const contentType = res.headers.get?.('content-type') || ''

  if (!res.ok) {
    throw new Error(`Modal API error: ${res.status} ${text}`)
  }

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text)
    } catch (e) {
      throw new Error('Invalid JSON from Modal: ' + text.substring(0, 200))
    }
  }

  return { raw: text }
}

export function getModalUrl() {
  return MODAL_API_URL
}
