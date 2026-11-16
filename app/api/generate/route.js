export async function POST(req) {
  let input
  try { input = await req.json() }
  catch { return Response.json({ error: 'Please submit a valid request.' }, { status: 400 }) }

  const fields = { jobTitle: 200, company: 200, jobDescription: 20000, yourBackground: 10000 }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return Response.json({ error: 'Please submit your job details.' }, { status: 400 })
  }
  for (const [name, limit] of Object.entries(fields)) {
    const value = input[name] ?? ''
    if (typeof value !== 'string' || value.length > limit || (name !== 'yourBackground' && !value.trim())) {
      return Response.json({ error: `Please check ${name} (maximum ${limit} characters).` }, { status: 400 })
    }
  }
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'Cover-letter generation is not configured. You can still use the application tracker.' }, { status: 503 })
  }

  const { jobTitle, company, jobDescription, yourBackground = '' } = input
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', max_tokens: 1024,
        messages: [{ role: 'user', content: `Write a professional cover letter of 3–4 paragraphs and under 350 words. Return only the letter. Do not invent experience.\nJob title: ${jobTitle}\nCompany: ${company}\nJob description: ${jobDescription}\nApplicant background: ${yourBackground}` }],
      }),
    })
    if (!response.ok) {
      return Response.json({ error: response.status === 429 ? 'The writing service is busy. Please try again shortly.' : 'The writing service could not complete your request. Please try again.' }, { status: response.status === 429 ? 429 : 502 })
    }
    const data = await response.json()
    const letter = Array.isArray(data.content) ? data.content.filter(block => block.type === 'text' && typeof block.text === 'string').map(block => block.text).join('\n').trim() : ''
    if (!letter) return Response.json({ error: 'The writing service returned no letter. Please try again.' }, { status: 502 })
    return Response.json({ letter })
  } catch {
    return Response.json({ error: controller.signal.aborted ? 'The writing service timed out. Please try again.' : 'Could not connect to the writing service. Please try again.' }, { status: controller.signal.aborted ? 504 : 502 })
  } finally { clearTimeout(timeout) }
}
