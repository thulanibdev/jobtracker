export async function POST(req) {
  try {
    const { jobTitle, company, jobDescription, yourBackground } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not set. Add it to your .env.local file.' }, { status: 500 })
    }

    const prompt = `Write a compelling, professional cover letter for the following:

Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription}
Applicant Background: ${yourBackground}

Requirements:
- 3-4 paragraphs, professional yet personable tone
- Open with a strong hook that mentions the specific role and company
- Middle paragraphs: connect the applicant's background to the job requirements
- Close with enthusiasm and a clear call to action
- Do NOT use generic phrases like "I am writing to express my interest"
- Make it sound human and specific, not templated
- Keep it under 350 words

Return only the cover letter text, no subject line or date.`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await res.json()
    const text = data.content?.[0]?.text || ''
    return Response.json({ letter: text })
  } catch (err) {
    return Response.json({ error: 'Failed to generate cover letter.' }, { status: 500 })
  }
}
