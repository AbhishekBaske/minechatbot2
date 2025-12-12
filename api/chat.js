export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { query } = req.body

    if (!query) {
      return res.status(400).json({ error: 'Query is required' })
    }

    const tokenId = process.env.MODAL_TOKEN_ID
    const tokenSecret = process.env.MODAL_TOKEN_SECRET

    if (!tokenId || !tokenSecret) {
      console.error('Missing Modal credentials')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    // Create Basic Auth header
    const auth = Buffer.from(`${tokenId}:${tokenSecret}`).toString('base64')

    const response = await fetch('https://abhishekbaske--coal-mines-chatbot-web.modal.run/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({ query })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Modal API error:', response.status, errorText)
      return res.status(response.status).json({ 
        error: 'Failed to get response from chatbot',
        details: errorText 
      })
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}
