import { sendQuery, getModalUrl } from './modalClient.js'

export async function handleChatRequest(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { query } = req.body || {}

    if (!query) {
      return res.status(400).json({ error: 'Query is required' })
    }

    const data = await sendQuery(query)

    // Normalize response to ensure frontend always receives an `answer` string
    let answer
    if (typeof data === 'string') answer = data
    else if (data && typeof data === 'object') {
      if (typeof data.answer === 'string') answer = data.answer
      else if (data.answer && typeof data.answer.text === 'string') answer = data.answer.text
      else if (typeof data.raw === 'string') answer = data.raw
      else answer = JSON.stringify(data).slice(0, 1000)
    } else {
      answer = String(data)
    }

    return res.status(200).json({ answer, modal: getModalUrl(), raw: data })
  } catch (error) {
    console.error('Chat handler error:', error)
    if (!res.headersSent) {
      return res.status(502).json({ error: 'Failed to get response from chatbot', details: error.message })
    }
  }
}

export default handleChatRequest
