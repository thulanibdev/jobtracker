'use client'
import { calcStats, STATUSES, formatDate } from '@/lib/data'

const colorMap = {
  applied: 'bg-applied-pale text-applied-text border-applied/20',
  interview: 'bg-interview-pale text-interview-text border-interview/20',
  offer: 'bg-offer-pale text-offer-text border-offer/20',
  rejected: 'bg-rejected-pale text-rejected-text border-rejected/20',
}
const dotMap = {
  applied: 'bg-applied', interview: 'bg-interview', offer: 'bg-offer', rejected: 'bg-rejected'
}

export default function Stats({ jobs }) {
  const { total, byStatus, responseRate, offerRate } = calcStats(jobs)

  // Recent activity (last 5)
  const recent = [...jobs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  // Weekly applications (last 8 weeks)
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (7 - i) * 7)
    const start = new Date(d); start.setDate(start.getDate() - 7)
    const count = jobs.filter(j => {
      const jd = new Date(j.date)
      return jd >= start && jd < d
    }).length
    return { label: `W${i + 1}`, count }
  })
  const maxWeek = Math.max(...weeks.map(w => w.count), 1)

  return (
    <div className="space-y-6 animate-fadeUp">
      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATUSES.map((s, i) => (
          <div key={s.id} className={`rounded-2xl border p-5 animate-fadeUp ${colorMap[s.id]}`} style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both', opacity: 0 }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-display text-3xl font-bold">{byStatus[s.id]}</div>
            <div className="text-sm font-body font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key metrics */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-display font-bold text-ink text-lg mb-5">Key Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-body text-ink-light">Response Rate</span>
                <span className="text-sm font-body font-semibold text-ink">{responseRate}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-applied rounded-full transition-all duration-700" style={{ width: `${responseRate}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-body text-ink-light">Interview → Offer</span>
                <span className="text-sm font-body font-semibold text-ink">{offerRate}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-offer rounded-full transition-all duration-700" style={{ width: `${offerRate}%` }} /></div>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex justify-between">
                <span className="text-sm font-body text-ink-light">Total Applications</span>
                <span className="font-display font-bold text-ink text-xl">{total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly activity chart */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-display font-bold text-ink text-lg mb-4">Weekly Activity</h3>
          <div className="flex items-end gap-2 h-24">
            {weeks.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-applied/20 rounded-t-sm transition-all duration-500 hover:bg-applied/40"
                  style={{ height: `${(w.count / maxWeek) * 80}px`, minHeight: w.count > 0 ? '4px' : '0' }} />
                <span className="text-xs text-ink-light font-body">{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-display font-bold text-ink text-lg mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recent.length === 0 && <p className="text-sm font-body text-ink-light text-center py-4">No applications yet.</p>}
            {recent.map(j => (
              <div key={j.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotMap[j.status]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-ink truncate">{j.company}</p>
                  <p className="text-xs font-body text-ink-light truncate">{j.role}</p>
                </div>
                <span className="text-xs font-body text-ink-light flex-shrink-0">{formatDate(j.date)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
