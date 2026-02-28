export const STATUSES = [
  { id: 'applied', label: 'Applied', icon: '📤', color: 'applied', count_label: 'Applications' },
  { id: 'interview', label: 'Interview', icon: '🎤', color: 'interview', count_label: 'Interviews' },
  { id: 'offer', label: 'Offer', icon: '🎉', color: 'offer', count_label: 'Offers' },
  { id: 'rejected', label: 'Rejected', icon: '❌', color: 'rejected', count_label: 'Rejected' },
]

export const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote']
export const SOURCES = ['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'GitHub Jobs', 'AngelList', 'Other']

export const SEED_JOBS = [
  { id: 1, company: 'Stripe', role: 'Frontend Engineer Intern', status: 'interview', type: 'Internship', source: 'LinkedIn', date: new Date(Date.now() - 86400000 * 5).toISOString().slice(0,10), salary: '$45/hr', url: 'https://stripe.com/jobs', notes: 'Spoke to recruiter Sarah. Technical interview next week.', tags: ['React', 'TypeScript'] },
  { id: 2, company: 'Vercel', role: 'Software Engineer Intern', status: 'applied', type: 'Internship', source: 'Company Website', date: new Date(Date.now() - 86400000 * 3).toISOString().slice(0,10), salary: '$40/hr', url: '', notes: 'Applied via website. Used custom cover letter.', tags: ['Next.js', 'Node.js'] },
  { id: 3, company: 'Figma', role: 'Product Engineer Intern', status: 'applied', type: 'Internship', source: 'Referral', date: new Date(Date.now() - 86400000 * 1).toISOString().slice(0,10), salary: '$50/hr', url: '', notes: 'Referred by @friend. Strong match for design systems work.', tags: ['React', 'CSS'] },
  { id: 4, company: 'Meta', role: 'Frontend Intern', status: 'rejected', type: 'Internship', source: 'LinkedIn', date: new Date(Date.now() - 86400000 * 10).toISOString().slice(0,10), salary: '$55/hr', url: '', notes: 'Got rejected after OA. Need to practice more DSA.', tags: ['React', 'GraphQL'] },
]

export const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function calcStats(jobs) {
  const total = jobs.length
  const byStatus = {}
  STATUSES.forEach(s => { byStatus[s.id] = jobs.filter(j => j.status === s.id).length })
  const responseRate = total > 0 ? Math.round(((byStatus.interview + byStatus.offer) / total) * 100) : 0
  const offerRate = (byStatus.interview + byStatus.offer) > 0 ? Math.round((byStatus.offer / (byStatus.interview + byStatus.offer)) * 100) : 0
  return { total, byStatus, responseRate, offerRate }
}

export function exportCSV(jobs) {
  const rows = [['Company', 'Role', 'Status', 'Type', 'Date Applied', 'Salary', 'Source', 'Notes']]
  jobs.forEach(j => rows.push([j.company, j.role, j.status, j.type, j.date, j.salary, j.source, j.notes]))
  const csv = rows.map(r => r.map(v => `"${v || ''}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'job-applications.csv'; a.click()
}
