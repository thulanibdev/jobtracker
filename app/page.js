'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { SEED_JOBS, exportCSV } from '@/lib/data'

const Kanban = dynamic(() => import('@/components/kanban/Kanban'), { ssr: false })
const Stats = dynamic(() => import('@/components/stats/Stats'), { ssr: false })
const CoverLetter = dynamic(() => import('@/components/coverletter/CoverLetter'), { ssr: false })
const JobModal = dynamic(() => import('@/components/modal/JobModal'), { ssr: false })

const TABS = [
  { id: 'board', label: 'Board', icon: '🗂️' },
  { id: 'stats', label: 'Analytics', icon: '📊' },
  { id: 'ai', label: 'AI Cover Letter', icon: '✨' },
]

export default function Home() {
  const [jobs, setJobs, loaded] = useLocalStorage('jobtracker-jobs', SEED_JOBS)
  const [activeTab, setActiveTab] = useState('board')
  const [modalJob, setModalJob] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const openNew = () => { setModalJob(null); setShowModal(true) }
  const openEdit = (job) => { setModalJob(job); setShowModal(true) }

  const saveJob = (job) => {
    setJobs(prev => {
      const exists = prev.find(j => j.id === job.id)
      return exists ? prev.map(j => j.id === job.id ? job : j) : [job, ...prev]
    })
  }

  const deleteJob = (id) => setJobs(prev => prev.filter(j => j.id !== id))
  const changeStatus = (id, status) => setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j))

  const filteredJobs = search
    ? jobs.filter(j => j.company.toLowerCase().includes(search.toLowerCase()) || j.role.toLowerCase().includes(search.toLowerCase()))
    : jobs

  const pending = jobs.filter(j => j.status === 'interview').length

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-applied rounded-xl flex items-center justify-center text-white font-display font-bold">J</div>
            <div>
              <h1 className="font-display font-bold text-lg text-ink leading-none">JobTracker AI</h1>
              <p className="text-xs font-body text-ink-light">{jobs.length} applications tracked</p>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xs">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search companies..."
              className="w-full border border-border rounded-xl px-4 py-2 text-sm font-body text-ink bg-bg" />
          </div>

          <div className="flex items-center gap-2">
            {pending > 0 && (
              <span className="hidden md:flex items-center gap-1.5 text-xs font-body bg-interview-pale text-interview-text border border-interview/20 px-3 py-1.5 rounded-full animate-pulse-soft">
                🎤 {pending} interview{pending > 1 ? 's' : ''} pending
              </span>
            )}
            <button onClick={() => exportCSV(jobs)} className="hidden md:flex px-3 py-2 rounded-xl text-sm font-body border border-border text-ink-light hover:border-applied hover:text-applied transition-colors">
              📥 Export
            </button>
            <button onClick={openNew} className="px-4 py-2 rounded-xl text-sm font-display font-bold bg-applied text-white hover:opacity-90 transition-opacity">
              + Add Job
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-1 pb-3">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all ${
                activeTab === tab.id ? 'bg-applied text-white' : 'text-ink-light hover:text-ink hover:bg-gray-100'
              }`}>
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.id === 'ai' && <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full hidden sm:inline">NEW</span>}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {!loaded ? (
          <div className="text-center py-20 text-ink-light font-body">Loading...</div>
        ) : (
          <>
            {activeTab === 'board' && <Kanban jobs={filteredJobs} onEdit={openEdit} onDelete={deleteJob} onStatusChange={changeStatus} />}
            {activeTab === 'stats' && <Stats jobs={jobs} />}
            {activeTab === 'ai' && <CoverLetter jobs={jobs} />}
          </>
        )}
      </main>

      {showModal && <JobModal job={modalJob} onSave={saveJob} onClose={() => setShowModal(false)} />}
    </div>
  )
}
