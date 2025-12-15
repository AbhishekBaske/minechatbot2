import handleChatRequest from '../src/apiHandler.js'

export default async function handler(req, res) {
  return handleChatRequest(req, res)
}

