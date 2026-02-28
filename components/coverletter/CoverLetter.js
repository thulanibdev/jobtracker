'use client'
import { useState } from 'react'

export default function CoverLetter({ jobs }) {
  const [form, setForm] = useState({ jobTitle: '', company: '', jobDescription: '', yourBackground: '' })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const generate = async () => {
    if (!form.jobTitle || !form.company || !form.jobDescription) {
      setError('Please fill in the job title, company, and job description.')
      return
    }
    setLoading(true)
    setError('')
    setResult('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResult(data.letter)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const prefillFromJob = (job) => {
    setForm(p => ({ ...p, jobTitle: job.role, company: job.company }))
  }

  return (
    <div className="animate-fadeUp max-w-4xl mx-auto">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 bg-ai-pale rounded-xl flex items-center justify-center text-xl flex-shrink-0">✨</div>
        <div>
          <h2 className="font-display font-bold text-xl text-ink">AI Cover Letter Generator</h2>
          <p className="text-sm font-body text-ink-light">Paste a job description and get a tailored cover letter in seconds.</p>
        </div>
      </div>

      {/* Quick fill from existing job */}
      {jobs.length > 0 && (
        <div className="bg-ai-pale border border-ai/20 rounded-2xl p-4 mb-5">
          <p className="text-xs font-body font-semibold text-ai-text uppercase tracking-wide mb-2">Quick fill from your applications</p>
          <div className="flex gap-2 flex-wrap">
            {jobs.slice(0, 5).map(j => (
              <button key={j.id} onClick={() => prefillFromJob(j)}
                className="text-xs font-body bg-white border border-ai/20 text-ai-text px-3 py-1.5 rounded-full hover:bg-ai hover:text-white transition-all">
                {j.company} — {j.role}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input side */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Job Title *</label>
              <input value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder="Frontend Engineer Intern"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-bg" />
            </div>
            <div>
              <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Company *</label>
              <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Stripe"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-bg" />
            </div>
          </div>

          <div>
            <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Job Description *</label>
            <textarea value={form.jobDescription} onChange={e => set('jobDescription', e.target.value)}
              placeholder="Paste the full job description here..."
              rows={7} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-bg resize-none" />
          </div>

          <div>
            <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Your Background</label>
            <textarea value={form.yourBackground} onChange={e => set('yourBackground', e.target.value)}
              placeholder="Briefly describe your experience, skills, and what makes you a great fit..."
              rows={3} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-bg resize-none" />
          </div>

          {error && (
            <div className="bg-rejected-pale border border-rejected/20 text-rejected-text text-sm font-body rounded-xl p-3">
              {error}
            </div>
          )}

          <button onClick={generate} disabled={loading}
            className="w-full py-3 rounded-xl font-display font-bold text-sm bg-ai text-white hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
            ) : (
              <><span>✨</span> Generate Cover Letter</>
            )}
          </button>
        </div>

        {/* Output side */}
        <div className="bg-white border border-border rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-ink">Generated Letter</h3>
            {result && (
              <button onClick={copy} className={`text-xs font-body px-3 py-1.5 rounded-full border transition-all ${copied ? 'bg-offer-pale text-offer-text border-offer/20' : 'border-border text-ink-light hover:border-ai hover:text-ai'}`}>
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            )}
          </div>
          {loading ? (
            <div className="flex-1 space-y-3">
              {[100, 90, 95, 85, 92].map((w, i) => (
                <div key={i} className="h-4 skeleton rounded" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : result ? (
            <div className="flex-1 overflow-y-auto">
              <p className="text-sm font-body text-ink leading-relaxed whitespace-pre-wrap">{result}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-ink-light text-center">
              <div className="text-5xl mb-3">✍️</div>
              <p className="font-body text-sm">Your cover letter will appear here</p>
              <p className="text-xs mt-1">Fill in the form and click generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
