(async () => {
  try {
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'inundation in mines' })
    })
    console.log('status', res.status)
    const json = await res.json()
    console.log('body', json)

    if (!json || typeof json.answer !== 'string') {
      throw new Error('Invalid response shape, expected { answer: string }')
    }
    console.log('answer sample:', json.answer.slice(0, 200))
  } catch (e) {
    console.error('error', e)
  }
})()
