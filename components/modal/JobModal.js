'use client'
import { useState, useEffect } from 'react'
import { STATUSES, JOB_TYPES, SOURCES } from '@/lib/data'

export default function JobModal({ job, onSave, onClose }) {
  const [form, setForm] = useState({
    company: '', role: '', status: 'applied', type: 'Internship',
    source: 'LinkedIn', date: new Date().toISOString().slice(0, 10),
    salary: '', url: '', notes: '', tags: [],
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (job) setForm({ ...form, ...job, tags: job.tags || [] })
  }, [job])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t])
    setTagInput('')
  }

  const removeTag = (t) => set('tags', form.tags.filter(x => x !== t))

  const submit = () => {
    if (!form.company.trim() || !form.role.trim()) return
    onSave({ ...form, id: job?.id || Date.now() })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-ink">{job ? 'Edit Application' : 'New Application'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-ink-light hover:text-ink transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Company *</label>
              <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="e.g. Stripe" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-bg" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Role *</label>
              <input value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Frontend Engineer Intern" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-bg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-body text-ink bg-bg">
                {STATUSES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Date Applied</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-body text-ink bg-bg" />
            </div>
            <div>
              <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Job Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-body text-ink bg-bg">
                {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Source</label>
              <select value={form.source} onChange={e => set('source', e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-body text-ink bg-bg">
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Salary / Pay</label>
              <input value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="e.g. $45/hr" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-body text-ink bg-bg" />
            </div>
            <div>
              <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Job URL</label>
              <input value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://..." className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-body text-ink bg-bg" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Skills / Tags</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {form.tags.map(t => (
                <span key={t} className="bg-applied-pale text-applied-text text-xs font-body px-2 py-1 rounded-full flex items-center gap-1">
                  {t} <button onClick={() => removeTag(t)} className="hover:text-rejected">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add a skill tag..." className="flex-1 border border-border rounded-xl px-3 py-2 text-sm font-body text-ink bg-bg" />
              <button onClick={addTag} className="px-3 py-2 rounded-xl bg-applied text-white text-sm font-body">Add</button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-body font-semibold text-ink-light uppercase tracking-wide block mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Recruiter name, interview notes, follow-up actions..." rows={3} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-body text-ink bg-bg resize-none" />
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-body text-ink-light border border-border hover:border-ink transition-colors">Cancel</button>
          <button onClick={submit} className="px-6 py-2.5 rounded-xl text-sm font-body font-semibold bg-applied text-white hover:opacity-90 transition-opacity">
            {job ? 'Save Changes' : 'Add Application'}
          </button>
        </div>
      </div>
    </div>
  )
}
