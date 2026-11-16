import { test, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { POST } from '../app/api/generate/route.js'
const originalFetch = globalThis.fetch
const originalKey = process.env.ANTHROPIC_API_KEY
afterEach(() => { globalThis.fetch = originalFetch; if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY; else process.env.ANTHROPIC_API_KEY = originalKey })
const details = { jobTitle: 'Intern', company: 'Example', jobDescription: 'Build web applications', yourBackground: 'First-year student' }
const request = body => new Request('http://localhost/api/generate', { method: 'POST', body: JSON.stringify(body) })
test('bad input is rejected before a vendor call', async () => {
  globalThis.fetch = async () => { throw new Error('must not call provider') }
  for (const body of [null, [], { ...details, company: 123 }, { ...details, jobTitle: '   ' }, { ...details, jobDescription: 'a'.repeat(20001) }]) assert.equal((await POST(request(body))).status, 400)
})
test('provider errors never look like a successful empty letter', async () => {
  process.env.ANTHROPIC_API_KEY = 'test-only'
  for (const [response, status] of [[Response.json({ error: 'invalid key' }, { status: 401 }), 502], [Response.json({}, { status: 429 }), 429], [Response.json({ content: [] }), 502]]) {
    globalThis.fetch = async () => response
    assert.equal((await POST(request(details))).status, status)
  }
})
test('a successful text response is returned; missing configuration gives 503', async () => {
  process.env.ANTHROPIC_API_KEY = 'test-only'
  globalThis.fetch = async () => Response.json({ content: [{ type: 'text', text: 'Dear team,' }, { type: 'text', text: 'Thank you.' }] })
  assert.deepEqual(await (await POST(request(details))).json(), { letter: 'Dear team,\nThank you.' })
  delete process.env.ANTHROPIC_API_KEY
  assert.equal((await POST(request(details))).status, 503)
})
