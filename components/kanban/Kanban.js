'use client'
import { useState } from 'react'
import { STATUSES, formatDate } from '@/lib/data'

const colorMap = {
  applied: { header: 'bg-applied-pale border-applied/30', dot: 'bg-applied', badge: 'bg-applied text-white', card: 'hover:border-applied/40' },
  interview: { header: 'bg-interview-pale border-interview/30', dot: 'bg-interview', badge: 'bg-interview text-white', card: 'hover:border-interview/40' },
  offer: { header: 'bg-offer-pale border-offer/30', dot: 'bg-offer', badge: 'bg-offer text-white', card: 'hover:border-offer/40' },
  rejected: { header: 'bg-rejected-pale border-rejected/30', dot: 'bg-rejected', badge: 'bg-rejected text-white', card: 'hover:border-rejected/40' },
}

function JobCard({ job, onEdit, onDelete, onDragStart }) {
  const c = colorMap[job.status]
  return (
    <div
      draggable
      onDragStart={() => onDragStart(job.id)}
      onClick={() => onEdit(job)}
      className={`bg-white border border-border rounded-2xl p-4 cursor-grab active:cursor-grabbing transition-all animate-fadeUp ${c.card} group`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-sm text-ink truncate">{job.company}</h4>
          <p className="text-xs font-body text-ink-light truncate mt-0.5">{job.role}</p>
        </div>
        <button onClick={e => { e.stopPropagation(); onDelete(job.id) }}
          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-ink-light hover:bg-rejected-pale hover:text-rejected transition-all ml-2 flex-shrink-0">
          ✕
        </button>
      </div>

      {job.tags?.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-2">
          {job.tags.slice(0, 3).map(t => (
            <span key={t} className="text-xs font-body bg-bg px-1.5 py-0.5 rounded text-ink-light">{t}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        <span className="text-xs font-body text-ink-light">{formatDate(job.date)}</span>
        <div className="flex items-center gap-2">
          {job.salary && <span className="text-xs font-body text-ink-light">{job.salary}</span>}
          <span className="text-xs font-body bg-bg px-1.5 py-0.5 rounded text-ink-light">{job.source}</span>
        </div>
      </div>
    </div>
  )
}

export default function Kanban({ jobs, onEdit, onDelete, onStatusChange }) {
  const [dragging, setDragging] = useState(null)
  const [dragOver, setDragOver] = useState(null)

  const handleDrop = (status) => {
    if (dragging) {
      onStatusChange(dragging, status)
      setDragging(null)
      setDragOver(null)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {STATUSES.map(status => {
        const c = colorMap[status.id]
        const col = jobs.filter(j => j.status === status.id)
        return (
          <div
            key={status.id}
            onDragOver={e => { e.preventDefault(); setDragOver(status.id) }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => handleDrop(status.id)}
            className={`rounded-2xl border-2 transition-all min-h-64 flex flex-col ${dragOver === status.id ? 'drag-over' : 'border-transparent bg-gray-50/50'}`}
          >
            {/* Column header */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-xl border mb-3 mx-1 mt-1 ${c.header}`}>
              <div className="flex items-center gap-2">
                <span>{status.icon}</span>
                <span className="font-display font-bold text-sm text-ink">{status.label}</span>
              </div>
              <span className={`text-xs font-body font-bold w-6 h-6 rounded-full flex items-center justify-center ${c.badge}`}>
                {col.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 px-1 space-y-2 pb-2">
              {col.length === 0 && (
                <div className="text-center py-8 text-ink-light/50 text-xs font-body">
                  Drop here
                </div>
              )}
              {col.map((job, i) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={setDragging}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
