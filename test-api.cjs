const handler = require('./api/chat.js');

const mockReq = {
  method: 'POST',
  body: { query: 'What are the duties of a manager?' }
};

const mockRes = {
  headersSent: false,
  headers: {},
  setHeader(k, v) {
    this.headers[k] = v;
  },
  status(c) {
    this.statusCode = c;
    return this;
  },
  json(d) {
    console.log('SUCCESS - Response:');
    console.log(JSON.stringify(d, null, 2));
  },
  end() {}
};

process.env.MODAL_TOKEN_ID = 'ak-6sB9F9JzK4WWd7OHD8TnDe';
process.env.MODAL_TOKEN_SECRET = 'as-Xrhf5wua9jkEGoaA3kOD6K';

console.log('Testing API handler...');
handler(mockReq, mockRes).catch(e => {
  console.error('FAILED - Error:', e.message);
  console.error(e.stack);
});
