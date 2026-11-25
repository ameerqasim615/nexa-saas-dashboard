"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowDownRight, ArrowUpRight, Bell, BriefcaseBusiness, ChartNoAxesCombined, ChevronDown, CircleHelp, Command, CreditCard, Layers3, LayoutDashboard, LogOut, Menu, MoreHorizontal, Plus, Search, Settings, ShieldCheck, Users, X, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AppUser } from "@/types";

type Admin = { id: string; email: string; name: string };
type Stats = { totalUsers: number; activeUsers: number; pendingUsers: number; monthlyRevenue: number; revenueChange: number; userChange: number };
const chartData = [
  { month: "Jan", revenue: 12400 }, { month: "Feb", revenue: 15100 }, { month: "Mar", revenue: 13900 }, { month: "Apr", revenue: 18200 },
  { month: "May", revenue: 16900 }, { month: "Jun", revenue: 21400 }, { month: "Jul", revenue: 19800 }, { month: "Aug", revenue: 24850 }
];
const initialStats: Stats = { totalUsers: 0, activeUsers: 0, pendingUsers: 0, monthlyRevenue: 24850, revenueChange: 12.8, userChange: 8.2 };

export default function Dashboard({ admin }: { admin: Admin }) {
  const router = useRouter();
  const [section, setSection] = useState("Overview");
  const [stats, setStats] = useState(initialStats);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ name: "", email: "", role: "Member" as AppUser["role"], status: "Active" as AppUser["status"] });

  async function loadData() {
    setLoading(true);
    try {
      const [dashboardRes, usersRes] = await Promise.all([fetch("/api/dashboard"), fetch("/api/users")]);
      if (dashboardRes.status === 401 || usersRes.status === 401) { router.push("/login"); return; }
      const dashboardData = await dashboardRes.json(); const usersData = await usersRes.json();
      if (!dashboardRes.ok) throw new Error(dashboardData.message);
      setStats(dashboardData.stats); setUsers(usersData.users || []);
    } catch (error) { notify(error instanceof Error ? error.message : "Unable to load data."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void loadData(); }, []);
  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(""), 3000); }
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); router.refresh(); }
  function openCreate() { setEditing(null); setForm({ name: "", email: "", role: "Member", status: "Active" }); setModal(true); }
  function openEdit(user: AppUser) { setEditing(user); setForm({ name: user.name, email: user.email, role: user.role, status: user.status }); setModal(true); }
  async function saveUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(editing ? `/api/users/${editing._id}` : "/api/users", { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    if (!response.ok) { notify(data.message || "Could not save user."); return; }
    setModal(false); notify(editing ? "User updated successfully." : "User created successfully."); await loadData();
  }
  async function deleteUser(user: AppUser) {
    if (!window.confirm(`Delete ${user.name}? This action cannot be undone.`)) return;
    const response = await fetch(`/api/users/${user._id}`, { method: "DELETE" }); const data = await response.json();
    if (!response.ok) { notify(data.message || "Could not delete user."); return; }
    notify("User deleted."); await loadData();
  }
  const filteredUsers = useMemo(() => users.filter(user => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())), [users, query]);
  const navItems = [{ label: "Overview", icon: LayoutDashboard }, { label: "Users", icon: Users }, { label: "Projects", icon: BriefcaseBusiness }, { label: "Analytics", icon: ChartNoAxesCombined }];
  const initials = admin.name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();

  return <div className="app-shell">
    {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark small"><Layers3 size={19}/></div><span>nexa<span className="brand-dot">.</span></span><button className="mobile-close" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-switch"><div className="workspace-icon">N</div><div><strong>Nexa Workspace</strong><span>Free plan</span></div><ChevronDown size={15}/></div>
      <p className="nav-label">WORKSPACE</p>
      <nav>{navItems.map(item => <button key={item.label} className={`nav-item ${section === item.label ? "active" : ""}`} onClick={() => { setSection(item.label); setMobileNav(false); }}><item.icon size={18}/><span>{item.label}</span>{item.label === "Users" && <span className="nav-count">{users.length}</span>}</button>)}</nav>
      <p className="nav-label nav-label-spaced">PREFERENCES</p>
      <nav><button className="nav-item" onClick={() => notify("Settings module coming soon.")}><Settings size={18}/><span>Settings</span></button><button className="nav-item" onClick={() => notify("Help center coming soon.")}><CircleHelp size={18}/><span>Help center</span></button></nav>
      <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-icon"><Zap size={16}/></div><strong>Upgrade your plan</strong><p>Get more insights and unlock advanced tools.</p><button onClick={() => notify("Plan management will be available soon.")}>Explore plans <ArrowUpRight size={14}/></button></div><button className="profile-mini" onClick={logout}><div className="avatar avatar-purple">{initials}</div><div><strong>{admin.name}</strong><span>{admin.email}</span></div><LogOut size={16}/></button></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{section}</strong></div></div><div className="topbar-actions"><div className="search-shortcut"><Search size={15}/><span>Search</span><kbd>⌘ K</kbd></div><button className="icon-button" aria-label="Notifications" onClick={() => notify("You're all caught up!")}><Bell size={18}/><i/></button><div className="topbar-avatar">{initials}</div></div></header>
      <div className="content-wrap">
        {section === "Overview" || section === "Analytics" ? <>
          <div className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h1>Good morning, {admin.name.split(" ")[0]} <span>✦</span></h1><p className="muted">Here's what's happening with your workspace today.</p></div><div className="heading-actions"><button className="secondary-btn" onClick={() => notify("Your report is being prepared.")}> <Activity size={16}/> Export report</button><button className="primary-btn" onClick={openCreate}><Plus size={17}/> Add user</button></div></div>
          <div className="date-chip"> <span className="live-dot"/> Live workspace data <span className="date-divider">·</span> Last 30 days <ChevronDown size={14}/></div>
          <section className="stats-grid">
            <StatCard title="Total users" value={stats.totalUsers.toLocaleString()} change={`+${stats.userChange}%`} note="vs. last month" icon={<Users size={18}/>} color="blue" />
            <StatCard title="Monthly revenue" value={`$${stats.monthlyRevenue.toLocaleString()}`} change={`+${stats.revenueChange}%`} note="vs. last month" icon={<CreditCard size={18}/>} color="violet" />
            <StatCard title="Active users" value={stats.activeUsers.toLocaleString()} change="Active" note="currently enabled" icon={<ShieldCheck size={18}/>} color="green" />
            <StatCard title="Pending users" value={stats.pendingUsers.toLocaleString()} change="Needs review" note="awaiting activation" icon={<Activity size={18}/>} color="orange" />
          </section>
          <section className="dashboard-grid"><div className="panel revenue-panel"><div className="panel-heading"><div><h2>Revenue overview</h2><p className="muted">Monthly revenue performance</p></div><button className="select-button" onClick={() => notify("Showing the last 8 months.")}>Last 8 months <ChevronDown size={14}/></button></div><div className="chart-summary"><strong>$24,850</strong><span className="positive"><ArrowUpRight size={15}/> 12.8%</span><span className="muted">vs. previous period</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6475ef" stopOpacity={0.2}/><stop offset="100%" stopColor="#6475ef" stopOpacity={0.01}/></linearGradient></defs><CartesianGrid stroke="#edf0f5" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9299aa", fontSize: 12 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#9299aa", fontSize: 11 }} tickFormatter={v=>`$${v/1000}k`}/><Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} contentStyle={{ border: "1px solid #edf0f5", borderRadius: 12, boxShadow: "0 8px 30px #1b255010" }}/><Area type="monotone" dataKey="revenue" stroke="#6676ed" strokeWidth={2.7} fill="url(#revenueFill)" activeDot={{ r: 5, strokeWidth: 3, stroke: "#fff" }}/></AreaChart></ResponsiveContainer></div></div>
            <div className="panel activity-panel"><div className="panel-heading"><div><h2>Workspace activity</h2><p className="muted">Your workspace at a glance</p></div><button className="more-button" onClick={() => notify("All activity is up to date.")}><MoreHorizontal size={19}/></button></div><div className="activity-score"><div className="score-ring"><div><strong>86</strong><span>/ 100</span></div></div><div><strong>Looking good!</strong><p className="muted">Your workspace is performing well this month.</p></div></div><div className="activity-metric"><div><span className="metric-bullet blue-bullet"/>User engagement</div><strong>84%</strong></div><div className="mini-progress"><span style={{width:"84%"}}/></div><div className="activity-metric"><div><span className="metric-bullet green-bullet"/>Team activity</div><strong>92%</strong></div><div className="mini-progress green-progress"><span style={{width:"92%"}}/></div><div className="activity-footer"><span><span className="live-dot"/> All systems operational</span><ArrowUpRight size={15}/></div></div></section>
          <section className="panel table-panel"><div className="panel-heading"><div><h2>Recent users</h2><p className="muted">A quick look at your newest members</p></div><button className="text-button" onClick={() => setSection("Users")}>View all users <ArrowUpRight size={15}/></button></div><UserTable users={users.slice(0,5)} onEdit={openEdit} onDelete={deleteUser}/></section>
        </> : section === "Users" ? <>
          <div className="page-heading"><div><p className="eyebrow">WORKSPACE</p><h1>Users</h1><p className="muted">Manage your workspace members and permissions.</p></div><button className="primary-btn" onClick={openCreate}><Plus size={17}/> Add user</button></div>
          <div className="panel table-panel users-page-panel"><div className="users-toolbar"><div><h2>All users <span className="count-pill">{users.length}</span></h2><p className="muted">Manage and organize your team members.</p></div><div className="table-search"><Search size={16}/><input placeholder="Search users..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div><UserTable users={filteredUsers} onEdit={openEdit} onDelete={deleteUser}/></div>
        </> : <ComingSoon title={section} />}
        <footer className="footer"><span>© 2025 Nexa, Inc. All rights reserved.</span><div><span>Privacy</span><span>Terms</span><span>Status <i className="live-dot"/></span></div></footer>
      </div>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false);}}><form className="user-modal" onSubmit={saveUser}><div className="modal-head"><div><p className="eyebrow">TEAM MANAGEMENT</p><h2>{editing ? "Edit user" : "Add a new user"}</h2></div><button type="button" className="icon-button" onClick={()=>setModal(false)}><X size={19}/></button></div><label>Full name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required minLength={2} placeholder="e.g. Alex Morgan"/></label><label>Email address<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required placeholder="alex@company.com"/></label><div className="form-row"><label>Role<select value={form.role} onChange={e=>setForm({...form,role:e.target.value as AppUser["role"]})}><option>Admin</option><option>Editor</option><option>Member</option></select></label><label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value as AppUser["status"]})}><option>Active</option><option>Pending</option><option>Inactive</option></select></label></div><div className="modal-actions"><button type="button" className="secondary-btn" onClick={()=>setModal(false)}>Cancel</button><button className="primary-btn">{editing ? "Save changes" : "Create user"}</button></div></form></div>}
    {toast && <div className="toast"><span className="toast-check">✓</span>{toast}</div>}
  </div>;
}

function StatCard({ title, value, change, note, icon, color }: { title:string; value:string; change:string; note:string; icon:React.ReactNode; color:string }) {
  return <div className="stat-card"><div className="stat-top"><span>{title}</span><span className={`stat-icon ${color}`}>{icon}</span></div><div className="stat-value">{value}</div><div className="stat-bottom"><span className={color === "orange" ? "neutral-change" : "positive-change"}>{color !== "orange" && <ArrowUpRight size={14} />}{change}</span><span>{note}</span></div></div>;
}
function UserTable({ users, onEdit, onDelete }: { users:AppUser[]; onEdit:(u:AppUser)=>void; onDelete:(u:AppUser)=>void }) {
  const colors = ["avatar-blue","avatar-pink","avatar-green","avatar-orange","avatar-purple"];
  if (!users.length) return <div className="empty-state"><Users size={26}/><strong>No users found</strong><span>Add a user or try another search.</span></div>;
  return <div className="table-scroll"><table><thead><tr><th>NAME</th><th>ROLE</th><th>STATUS</th><th>JOINED</th><th/></tr></thead><tbody>{users.map((user,index)=><tr key={user._id}><td><div className="user-cell"><div className={`avatar ${colors[index%colors.length]}`}>{user.name.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase()}</div><div><strong>{user.name}</strong><span>{user.email}</span></div></div></td><td><span className="role-text">{user.role}</span></td><td><span className={`status-pill ${user.status.toLowerCase()}`}><i/>{user.status}</span></td><td className="joined-cell">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "Recently"}</td><td><div className="row-actions"><button title="Edit user" onClick={()=>onEdit(user)}>Edit</button><button title="Delete user" onClick={()=>onDelete(user)}>Delete</button></div></td></tr>)}</tbody></table></div>;
}
function ComingSoon({title}:{title:string}) { return <div className="coming-soon"><div className="coming-icon"><Command size={25}/></div><p className="eyebrow">NEXA WORKSPACE</p><h1>{title}</h1><p className="muted">This section is part of the product roadmap. The dashboard and user management modules are ready to explore.</p></div>; }
