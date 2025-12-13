import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
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

    const response = await fetch('https://abhishekbaske--coal-mines-chatbot2-web.modal.run/chat', {
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

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      res.json(data)
    } else {
      const text = await response.text()
      console.error('Non-JSON response:', text)
      return res.status(500).json({ 
        error: 'Invalid response from chatbot',
        details: 'Expected JSON but received: ' + text.substring(0, 100)
      })
    }
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
})

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`)
})
