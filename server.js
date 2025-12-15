import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

import handleChatRequest from './src/apiHandler.js'

// Handle chat API with shared handler (includes CORS, OPTIONS and normalized response)
app.all('/api/chat', handleChatRequest)


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', modal: getModalUrl() })
})

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`)
})
