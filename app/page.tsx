'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Clock3,
  Command,
  Filter,
  LayoutDashboard,
  ListFilter,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react'

type Status = 'Backlog' | 'In progress' | 'In review' | 'Done'
type Priority = 'Low' | 'Medium' | 'High'
type Task = { id: number; title: string; category: string; status: Status; priority: Priority; owner: string; due: string; description: string }
type Member = { initials: string; name: string; role: string; color: string }

const members: Member[] = [
  { initials: 'AM', name: 'Alex Morgan', role: 'Product lead', color: 'bg-[#e9dfd3]' },
  { initials: 'JP', name: 'Jordan Patel', role: 'Support ops', color: 'bg-[#dce6e0]' },
  { initials: 'SC', name: 'Sam Chen', role: 'Engineering', color: 'bg-[#e3e0ed]' },
  { initials: 'RK', name: 'Riley Kim', role: 'Design', color: 'bg-[#f1ded9]' },
]

const seedTasks: Task[] = [
  { id: 1, title: 'Audit top 50 contact drivers', category: 'Discovery', status: 'Done', priority: 'High', owner: 'JP', due: 'Mar 08', description: 'Review recent support conversations and identify the highest-volume reasons customers reach out.' },
  { id: 2, title: 'Map current help center gaps', category: 'Discovery', status: 'In review', priority: 'Medium', owner: 'RK', due: 'Mar 11', description: 'Compare top contact drivers against existing help center coverage and identify missing answers.' },
  { id: 3, title: 'Define MVP success metrics', category: 'Strategy', status: 'Done', priority: 'High', owner: 'AM', due: 'Mar 10', description: 'Set baseline and target metrics for self-serve resolution, deflection, and answer quality.' },
  { id: 4, title: 'Create support intent taxonomy', category: 'Strategy', status: 'In progress', priority: 'High', owner: 'AM', due: 'Mar 14', description: 'Create a shared taxonomy to make support themes measurable and actionable.' },
  { id: 5, title: 'Draft shipping & returns answers', category: 'Content', status: 'In progress', priority: 'Medium', owner: 'JP', due: 'Mar 15', description: 'Write clear, concise answers for the most common shipping and returns questions.' },
  { id: 6, title: 'Draft account & billing answers', category: 'Content', status: 'Backlog', priority: 'Medium', owner: 'RK', due: 'Mar 18', description: 'Create first drafts for common account access, refunds, and billing questions.' },
  { id: 7, title: 'Design answer feedback loop', category: 'Product', status: 'Backlog', priority: 'Low', owner: 'RK', due: 'Mar 20', description: 'Define how customers can rate answers and how the team will act on that feedback.' },
  { id: 8, title: 'Build first answer set', category: 'Engineering', status: 'Backlog', priority: 'High', owner: 'SC', due: 'Mar 22', description: 'Implement the first searchable answer set in the support workspace.' },
  { id: 9, title: 'Set up weekly review ritual', category: 'Operations', status: 'In progress', priority: 'Low', owner: 'AM', due: 'Mar 21', description: 'Create a lightweight weekly review to monitor performance and prioritize improvements.' },
  { id: 10, title: 'Instrument deflection events', category: 'Engineering', status: 'Backlog', priority: 'High', owner: 'SC', due: 'Mar 25', description: 'Track answer views, helpful votes, escalations, and self-serve resolution.' },
  { id: 11, title: 'Run internal pilot', category: 'Validation', status: 'Backlog', priority: 'Medium', owner: 'JP', due: 'Mar 27', description: 'Invite the support team to test the first workflow and capture friction points.' },
  { id: 12, title: 'Share MVP readout', category: 'Validation', status: 'Backlog', priority: 'Medium', owner: 'AM', due: 'Mar 31', description: 'Summarize pilot findings, learnings, and the recommendation for the next phase.' },
]

const statuses: Status[] = ['Backlog', 'In progress', 'In review', 'Done']
const statusTone: Record<Status, string> = { Backlog: 'status-backlog', 'In progress': 'status-progress', 'In review': 'status-review', Done: 'status-done' }
const priorityTone: Record<Priority, string> = { Low: 'priority-low', Medium: 'priority-medium', High: 'priority-high' }

export default function Page() {
  const [activeView, setActiveView] = useState('Dashboard')
  const [tasks, setTasks] = useState<Task[]>(seedTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | Status>('All')
  const [mobileNav, setMobileNav] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem('northstar-tasks')
    if (saved) setTasks(JSON.parse(saved))
  }, [])
  useEffect(() => window.localStorage.setItem('northstar-tasks', JSON.stringify(tasks)), [tasks])

  const filteredTasks = useMemo(() => tasks.filter((task) => (filter === 'All' || task.status === filter) && `${task.title} ${task.category} ${task.owner}`.toLowerCase().includes(search.toLowerCase())), [tasks, filter, search])
  const completed = tasks.filter((task) => task.status === 'Done').length
  const progress = Math.round((completed / tasks.length) * 100)

  function updateStatus(id: number, status: Status) { setTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task)) }
  function saveTask(task: Task) { setTasks((current) => current.some((item) => item.id === task.id) ? current.map((item) => item.id === task.id ? task : item) : [...current, task]); setEditingTask(null) }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Sparkles size={17} /></div><span>northstar</span><button className="icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button></div>
        <div className="workspace-switcher"><div className="workspace-avatar">N</div><div><strong>Northstar</strong><span>Workspace</span></div><ChevronDown size={15} /></div>
        <nav className="nav-section" aria-label="Primary navigation">
          <p className="eyebrow">Workspace</p>
          {([['Dashboard', LayoutDashboard], ['Project board', ClipboardList], ['Team charter', Users], ['Insights', BarChart3]] as const).map(([label, Icon]) => <button key={label} className={`nav-item ${activeView === label ? 'active' : ''}`} onClick={() => { setActiveView(label); setMobileNav(false) }}><Icon size={17} /><span>{label}</span>{label === 'Project board' && <span className="nav-count">12</span>}</button>)}
          <p className="eyebrow nav-gap">Manage</p>
          <button className="nav-item"><Settings2 size={17} /><span>Settings</span></button>
          <button className="nav-item"><CircleHelp size={17} /><span>Help center</span></button>
        </nav>
        <div className="sidebar-footer"><div className="avatar avatar-am">AM</div><div><strong>Alex Morgan</strong><span>Product lead</span></div><MoreHorizontal size={17} className="muted-icon" /></div>
      </aside>
      {mobileNav && <button className="mobile-overlay" onClick={() => setMobileNav(false)} aria-label="Close menu" />}
      <main className="main-content">
        <header className="topbar"><button className="icon-button menu-button" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumbs"><span>Northstar</span><span>/</span><strong>{activeView}</strong></div><div className="top-actions"><label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." aria-label="Search tasks" /><kbd><Command size={11} /> K</kbd></label><button className="icon-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="avatar avatar-am top-avatar">AM</div></div></header>
        {activeView === 'Dashboard' && <Dashboard progress={progress} completed={completed} tasks={tasks} setActiveView={setActiveView} onSelect={setSelectedTask} />}
        {activeView === 'Project board' && <Board tasks={filteredTasks} filter={filter} setFilter={setFilter} onSelect={setSelectedTask} onEdit={setEditingTask} onStatus={updateStatus} onNew={() => setEditingTask({ id: Date.now(), title: '', category: 'Discovery', status: 'Backlog', priority: 'Medium', owner: 'AM', due: 'Mar 31', description: '' })} />}
        {activeView === 'Team charter' && <Charter />}
        {activeView === 'Insights' && <Insights tasks={tasks} progress={progress} />}
      </main>
      {selectedTask && <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} onEdit={() => { setEditingTask(selectedTask); setSelectedTask(null) }} />}
      {editingTask && <TaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={saveTask} />}
    </div>
  )
}

function Dashboard({ progress, completed, tasks, setActiveView, onSelect }: { progress: number; completed: number; tasks: Task[]; setActiveView: (view: string) => void; onSelect: (task: Task) => void }) {
  const active = tasks.filter((task) => task.status === 'In progress' || task.status === 'In review')
  return <div className="page-wrap"><div className="page-heading"><div><p className="eyebrow accent">MONDAY, MARCH 10, 2025</p><h1>Good morning, Alex<span className="period">.</span></h1><p className="subheading">Here&apos;s the pulse on your team&apos;s work this week.</p></div><button className="primary-button" onClick={() => setActiveView('Project board')}><Plus size={17} /> Add task</button></div>
    <section className="stats-grid"><div className="stat-card"><div className="stat-icon lavender"><Target size={18} /></div><span className="stat-label">MVP progress</span><strong>{progress}%</strong><div className="progress-bar"><span style={{ width: `${progress}%` }} /></div><small>{completed} of {tasks.length} tasks complete</small></div><div className="stat-card"><div className="stat-icon mint"><Clock3 size={18} /></div><span className="stat-label">Active tasks</span><strong>{active.length}</strong><small className="stat-note">Across 4 workstreams</small><a onClick={() => setActiveView('Project board')}>View board <ArrowUpRight size={13} /></a></div><div className="stat-card"><div className="stat-icon peach"><CalendarDays size={18} /></div><span className="stat-label">Next milestone</span><strong className="milestone">Internal pilot</strong><small>Due Mar 27, 2025</small><a onClick={() => onSelect(tasks.find((task) => task.title === 'Run internal pilot')!)}>View milestone <ArrowUpRight size={13} /></a></div></section>
    <div className="content-grid"><section className="panel focus-panel"><div className="panel-heading"><div><h2>Team focus</h2><p>What&apos;s moving the MVP forward</p></div><button className="text-button" onClick={() => setActiveView('Project board')}>View all <ArrowUpRight size={14} /></button></div><div className="focus-list">{active.slice(0, 4).map((task) => <button className="focus-row" key={task.id} onClick={() => onSelect(task)}><span className={`task-dot ${statusTone[task.status]}`} /><span className="focus-title">{task.title}<small>{task.category}</small></span><span className="avatar small-avatar">{task.owner}</span><span className="due-date">{task.due}</span><ArrowUpRight size={14} className="row-arrow" /></button>)}</div></section><section className="panel charter-preview"><div className="panel-heading"><div><h2>Team charter</h2><p>The principles guiding our work</p></div><button className="icon-button"><MoreHorizontal size={17} /></button></div><blockquote>“Make it easy for customers to help themselves, and easy for the team to keep improving.”</blockquote><div className="charter-meta"><div className="avatar-stack">{members.slice(0, 3).map((member) => <div className={`avatar small-avatar ${member.color}`} key={member.initials}>{member.initials}</div>)}</div><span>4 collaborators</span><button className="text-button" onClick={() => setActiveView('Team charter')}>Open charter <ArrowUpRight size={14} /></button></div></section></div>
    <section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Latest updates from your workspace</p></div><button className="text-button">See all <ArrowUpRight size={14} /></button></div><div className="activity-list"><Activity icon={<Check size={14} />} title="Audit top 50 contact drivers" detail="was marked complete by Jordan Patel" time="2h ago" tone="green" /><Activity icon={<Sparkles size={14} />} title="MVP progress" detail="moved from 28% to 33% this week" time="Yesterday" tone="purple" /><Activity icon={<Users size={14} />} title="Riley Kim joined the workspace" detail="as a Design collaborator" time="Mar 7" tone="orange" /></div></section>
  </div>
}

function Activity({ icon, title, detail, time, tone }: { icon: React.ReactNode; title: string; detail: string; time: string; tone: string }) { return <div className="activity-row"><span className={`activity-icon ${tone}`}>{icon}</span><span><strong>{title}</strong> {detail}</span><time>{time}</time></div> }

function Board({ tasks, filter, setFilter, onSelect, onEdit, onStatus, onNew }: { tasks: Task[]; filter: 'All' | Status; setFilter: (filter: 'All' | Status) => void; onSelect: (task: Task) => void; onEdit: (task: Task) => void; onStatus: (id: number, status: Status) => void; onNew: () => void }) { return <div className="page-wrap"><div className="page-heading board-heading"><div><p className="eyebrow accent">PROJECT / MVP</p><h1>Project board<span className="period">.</span></h1><p className="subheading">Turn the strategy into steady, visible progress.</p></div><button className="primary-button" onClick={onNew}><Plus size={17} /> Add task</button></div><div className="board-toolbar"><div className="filter-pills">{(['All', ...statuses] as const).map((item) => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}{item !== 'All' && <span>{tasks.filter((task) => task.status === item).length}</span>}</button>)}</div><button className="secondary-button"><Filter size={15} /> Filters <ChevronDown size={14} /></button></div><div className="board-grid">{statuses.map((status) => <section className="board-column" key={status}><div className="column-heading"><div><span className={`column-dot ${statusTone[status]}`} /><h2>{status}</h2><span className="column-count">{tasks.filter((task) => task.status === status).length}</span></div><button className="icon-button"><MoreHorizontal size={17} /></button></div><div className="column-cards">{tasks.filter((task) => task.status === status).map((task) => <article className="task-card" key={task.id} onClick={() => onSelect(task)}><div className="task-card-top"><span className={`badge ${priorityTone[task.priority]}`}>{task.priority}</span><button className="card-more" onClick={(event) => { event.stopPropagation(); onEdit(task) }} aria-label={`Edit ${task.title}`}><MoreHorizontal size={15} /></button></div><h3>{task.title}</h3><p>{task.category}</p><div className="task-card-footer"><span className="avatar tiny-avatar">{task.owner}</span><span className="due-date">{task.due}</span><select value={task.status} onClick={(event) => event.stopPropagation()} onChange={(event) => onStatus(task.id, event.target.value as Status)} aria-label={`Change status for ${task.title}`}>{statuses.map((option) => <option key={option}>{option}</option>)}</select></div></article>)}<button className="add-column-task" onClick={onNew}><Plus size={15} /> Add task</button></div></section>)}</div></div> }

function Charter() { return <div className="page-wrap"><div className="page-heading"><div><p className="eyebrow accent">WORKSPACE / PEOPLE</p><h1>Team charter<span className="period">.</span></h1><p className="subheading">A shared agreement for how Northstar works together.</p></div><button className="secondary-button"><Settings2 size={15} /> Edit charter</button></div><div className="charter-layout"><section className="panel charter-hero"><span className="quote-mark">“</span><p>Make it easy for customers to help themselves, and easy for the team to keep improving.</p><span className="charter-caption">Our north star</span></section><section className="principles"><Principle title="Start with the customer" text="Every decision starts with a clear understanding of the customer problem." /><Principle title="Prefer clarity over cleverness" text="Useful answers should feel obvious, concise, and easy to act on." /><Principle title="Learn in the open" text="Share progress early, make evidence visible, and treat feedback as fuel." /></section></div><section className="panel members-panel"><div className="panel-heading"><div><h2>Collaborators</h2><p>People helping move the MVP forward</p></div><button className="secondary-button"><Plus size={15} /> Add member</button></div><div className="member-grid">{members.map((member) => <div className="member-card" key={member.initials}><div className={`avatar large-avatar ${member.color}`}>{member.initials}</div><div><strong>{member.name}</strong><span>{member.role}</span></div><MoreHorizontal size={17} className="muted-icon" /></div>)}</div></section></div> }
function Principle({ title, text }: { title: string; text: string }) { return <div className="principle"><span className="principle-check"><Check size={15} /></span><div><h3>{title}</h3><p>{text}</p></div></div> }
function Insights({ tasks, progress }: { tasks: Task[]; progress: number }) { const categories = [...new Set(tasks.map((task) => task.category))]; return <div className="page-wrap"><div className="page-heading"><div><p className="eyebrow accent">WORKSPACE / SIGNALS</p><h1>Insights<span className="period">.</span></h1><p className="subheading">A simple read on where the work is gaining momentum.</p></div></div><div className="insight-grid"><section className="panel insight-main"><div className="panel-heading"><div><h2>Delivery momentum</h2><p>Task completion over the current MVP cycle</p></div><span className="big-number">{progress}%</span></div><div className="bar-chart">{[22, 34, 29, 46, 52, 67, progress].map((value, index) => <div className="chart-bar-wrap" key={index}><div className="chart-bar" style={{ height: `${value}%` }} /><span>{['Mar 4', 'Mar 5', 'Mar 6', 'Mar 7', 'Mar 8', 'Mar 9', 'Today'][index]}</span></div>)}</div></section><section className="panel"><div className="panel-heading"><div><h2>Workstreams</h2><p>Task distribution by category</p></div></div><div className="workstream-list">{categories.map((category) => <div className="workstream" key={category}><div><strong>{category}</strong><span>{tasks.filter((task) => task.category === category).length} tasks</span></div><div className="mini-progress"><i style={{ width: `${Math.max(18, tasks.filter((task) => task.category === category && task.status === 'Done').length / Math.max(1, tasks.filter((task) => task.category === category).length) * 100)}%` }} /></div></div>)}</div></section></div></div> }

function TaskDetails({ task, onClose, onEdit }: { task: Task; onClose: () => void; onEdit: () => void }) { return <div className="drawer-backdrop"><aside className="task-drawer"><div className="drawer-header"><span className={`badge ${priorityTone[task.priority]}`}>{task.priority} priority</span><button className="icon-button" onClick={onClose} aria-label="Close task details"><X size={19} /></button></div><p className="eyebrow accent">{task.category}</p><h2>{task.title}</h2><p className="drawer-description">{task.description}</p><div className="detail-list"><div><span>Status</span><strong>{task.status}</strong></div><div><span>Owner</span><strong><span className="avatar tiny-avatar">{task.owner}</span>{members.find((member) => member.initials === task.owner)?.name}</strong></div><div><span>Due date</span><strong>{task.due}, 2025</strong></div></div><div className="drawer-actions"><button className="secondary-button" onClick={onEdit}>Edit task</button><button className="primary-button" onClick={onClose}>Done</button></div></aside></div> }

function TaskModal({ task, onClose, onSave }: { task: Task; onClose: () => void; onSave: (task: Task) => void }) { const [draft, setDraft] = useState(task); const update = (key: keyof Task, value: string) => setDraft((current) => ({ ...current, [key]: value })); return <div className="modal-backdrop"><form className="task-modal" onSubmit={(event) => { event.preventDefault(); if (draft.title.trim()) onSave(draft) }}><div className="modal-header"><div><p className="eyebrow accent">TASK DETAILS</p><h2>{task.title ? 'Edit task' : 'New task'}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button></div><label>Task name<input value={draft.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. Interview five customers" required /></label><label>Description<textarea value={draft.description} onChange={(event) => update('description', event.target.value)} placeholder="What needs to happen?" rows={3} /></label><div className="form-grid"><label>Workstream<select value={draft.category} onChange={(event) => update('category', event.target.value)}>{['Discovery', 'Strategy', 'Content', 'Product', 'Engineering', 'Operations', 'Validation'].map((item) => <option key={item}>{item}</option>)}</select></label><label>Owner<select value={draft.owner} onChange={(event) => update('owner', event.target.value)}>{members.map((member) => <option key={member.initials}>{member.initials}</option>)}</select></label><label>Priority<select value={draft.priority} onChange={(event) => update('priority', event.target.value)}>{['Low', 'Medium', 'High'].map((item) => <option key={item}>{item}</option>)}</select></label><label>Status<select value={draft.status} onChange={(event) => update('status', event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Check size={16} /> Save task</button></div></form></div> }
