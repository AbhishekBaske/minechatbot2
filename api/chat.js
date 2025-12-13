const https = require('https');

function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const reqOptions = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'POST',
      headers: options.headers || {},
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          data: data,
          json: () => {
            try {
              return JSON.parse(data);
            } catch (e) {
              throw new Error('Invalid JSON: ' + data.substring(0, 100));
            }
          }
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

module.exports = async function handler(req, res) {
  // Set Content-Type for all responses
  res.setHeader('Content-Type', 'application/json')
  
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
    const body = JSON.stringify({ query })

    const response = await makeRequest('https://abhishekbaske--coal-mines-chatbot2-web.modal.run/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Content-Length': Buffer.byteLength(body)
      },
      body: body
    })

    if (!response.ok) {
      console.error('Modal API error:', response.status, response.data)
      return res.status(response.status).json({ 
        error: 'Failed to get response from chatbot',
        details: response.data 
      })
    }

    const contentType = response.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      const data = response.json()
      res.status(200).json(data)
    } else {
      console.error('Non-JSON response:', response.data)
      return res.status(500).json({ 
        error: 'Invalid response from chatbot',
        details: 'Expected JSON but received: ' + response.data.substring(0, 100)
      })
    }
  } catch (error) {
    console.error('Server error:', error)
    
    // Ensure we always send JSON
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json')
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message || 'Unknown error'
      })
    }
  }
}
