/* Admin Dashboard JS
   - Sample data to simulate backend
   - Charts (Chart.js)
   - Table rendering, filters, bulk actions
   - Activity feed, AI summary generation (simulated)
   - Role management (simulated)
*/

// ---------- Sample Data ----------
const sampleDocs = [
  { id:1, student:"Dharnika Arumugam", roll:"22CSE045", dept:"CSE", type:"Internship Certificate", date:"2025-10-02", status:"pending", priority:"medium", size:"256KB" },
  { id:2, student:"Asha R.", roll:"22CSE012", dept:"CSE", type:"12th Marksheet", date:"2025-09-29", status:"approved", priority:"low", size:"120KB" },
  { id:3, student:"Kiran V", roll:"21ECE033", dept:"ECE", type:"Workshop Certificate", date:"2025-09-30", status:"declined", priority:"low", size:"180KB" },
  { id:4, student:"Meera S", roll:"22CSE078", dept:"CSE", type:"Internship Certificate", date:"2025-10-01", status:"pending", priority:"high", size:"512KB" },
  { id:5, student:"Rahul P", roll:"21ME011", dept:"ME", type:"Internship Certificate", date:"2025-09-20", status:"pending", priority:"high", size:"420KB" },
  { id:6, student:"Sana K", roll:"22CSE098", dept:"CSE", type:"Certification of Participation", date:"2025-09-28", status:"approved", priority:"low", size:"88KB" },
  { id:7, student:"Vikram D", roll:"22ECE045", dept:"ECE", type:"12th Marksheet", date:"2025-09-10", status:"pending", priority:"medium", size:"210KB" },
  { id:8, student:"Anita L", roll:"23IT012", dept:"IT", type:"Internship Certificate", date:"2025-09-05", status:"approved", priority:"low", size:"330KB" },
  { id:9, student:"Rohit Sharma", roll:"22CSE034", dept:"CSE", type:"10th Marksheet", date:"2025-09-12", status:"approved", priority:"low", size:"145KB" },
  { id:10, student:"Priya N", roll:"21ECE067", dept:"ECE", type:"Workshop Certificate", date:"2025-09-15", status:"declined", priority:"low", size:"275KB" },
  { id:11, student:"Naveen Raj", roll:"23ME019", dept:"ME", type:"Internship Certificate", date:"2025-09-22", status:"pending", priority:"medium", size:"315KB" },
  { id:12, student:"Keerthi B", roll:"23CSE059", dept:"CSE", type:"Certification of Excellence", date:"2025-09-18", status:"approved", priority:"low", size:"195KB" },
  { id:13, student:"Harini S", roll:"21IT078", dept:"IT", type:"12th Marksheet", date:"2025-09-21", status:"approved", priority:"low", size:"160KB" },
  { id:14, student:"Vishal K", roll:"22EEE024", dept:"EEE", type:"Internship Certificate", date:"2025-09-25", status:"pending", priority:"medium", size:"400KB" },
  { id:15, student:"Lavanya M", roll:"23CSE023", dept:"CSE", type:"Hackathon Participation Certificate", date:"2025-09-19", status:"approved", priority:"low", size:"220KB" },
  { id:16, student:"Ajay R", roll:"22ECE059", dept:"ECE", type:"Workshop Certificate", date:"2025-09-27", status:"pending", priority:"medium", size:"180KB" },
  { id:17, student:"Sneha L", roll:"23ME021", dept:"ME", type:"Internship Certificate", date:"2025-09-28", status:"approved", priority:"low", size:"490KB" },
  { id:18, student:"Karthik A", roll:"23CSE014", dept:"CSE", type:"Certification of Merit", date:"2025-09-16", status:"approved", priority:"low", size:"130KB" },
  { id:19, student:"Deepika R", roll:"22IT045", dept:"IT", type:"10th Marksheet", date:"2025-09-13", status:"pending", priority:"high", size:"155KB" },
  { id:20, student:"Balaji P", roll:"22EEE031", dept:"EEE", type:"Internship Certificate", date:"2025-09-09", status:"declined", priority:"medium", size:"370KB" }
];
 
const sampleFaculty = [
  { id:1, name:"Prof. A. Verifier", dept:"CSE", reviewed:120, avgTime:1.2 },
  { id:2, name:"Prof. B. Mentor", dept:"ECE", reviewed:90, avgTime:2.4 },
  { id:3, name:"Prof. C. Guide", dept:"ME", reviewed:45, avgTime:3.1 }
];

// activity log
let activityLog = [];

// ---------- DOM refs ----------
const cardTotal = document.getElementById('cardTotal');
const cardPending = document.getElementById('cardPending');
const cardApproved = document.getElementById('cardApproved');
const cardDeclined = document.getElementById('cardDeclined');

const approvalDoughnutCtx = document.getElementById('approvalDoughnut').getContext('2d');
const deptBarCtx = document.getElementById('deptBar').getContext('2d');
const trendLineCtx = document.getElementById('trendLine').getContext('2d');

const adminTbody = document.getElementById('adminTbody');
const deptFilter = document.getElementById('deptFilter');
const statusFilter = document.getElementById('statusFilter');
const adminSelectAll = document.getElementById('adminSelectAll');

const activityFeed = document.getElementById('activityFeed');
const aiSummary = document.getElementById('aiSummary');
const insAvgTime = document.getElementById('insAvgTime');
const insActiveDepts = document.getElementById('insActiveDepts');
const insActiveFac = document.getElementById('insActiveFac');

const genReportBtn = document.getElementById('genReportBtn');
const exportAllCSV = document.getElementById('exportAllCSV');
const notifyAll = document.getElementById('notifyAll');
const globalSearch = document.getElementById('globalSearch');

const openRoleMgmt = document.getElementById('openRoleMgmt');
const roleModal = document.getElementById('roleModal');
const closeRoleModal = document.getElementById('closeRoleModal');
const newUserName = document.getElementById('newUserName');
const newUserEmail = document.getElementById('newUserEmail');
const newUserRole = document.getElementById('newUserRole');
const addUserBtn = document.getElementById('addUserBtn');
const roleList = document.getElementById('roleList');

const adminToast = document.getElementById('adminToast');

let docs = JSON.parse(JSON.stringify(sampleDocs));
let faculties = JSON.parse(JSON.stringify(sampleFaculty));

let doughnutChart=null, barChart=null, lineChart=null;

// ---------- Utilities ----------
function showToast(msg, timeout=2400){
  adminToast.textContent = msg;
  adminToast.style.display = 'block';
  setTimeout(()=>{ adminToast.style.display = 'none'; }, timeout);
}

function calcSummary(){
  const total = docs.length;
  const pending = docs.filter(d=>d.status==='pending').length;
  const approved = docs.filter(d=>d.status==='approved').length;
  const declined = docs.filter(d=>d.status==='declined').length;
  cardTotal.textContent = total;
  cardPending.textContent = pending;
  cardApproved.textContent = approved;
  cardDeclined.textContent = declined;

  insAvgTime.textContent = ${(faculties.reduce((s,f)=>s+f.avgTime,0)/faculties.length).toFixed(1)} days;
  insActiveDepts.textContent = [...new Set(docs.map(d=>d.dept))].length;
  insActiveFac.textContent = faculties.length;
}

// ---------- Charts ----------
function renderCharts(){
  const counts = {
    approved: docs.filter(d=>d.status==='approved').length,
    pending: docs.filter(d=>d.status==='pending').length,
    declined: docs.filter(d=>d.status==='declined').length
  };

  // Doughnut
  const doughConfig = {
    type:'doughnut',
    data:{
      labels:['Approved','Pending','Declined'],
      datasets:[{ data:[counts.approved, counts.pending, counts.declined], backgroundColor:['#10b981','#f59e0b','#ef4444'] }]
    },
    options:{cutout:'60%'}
  };
  if(doughnutChart) doughnutChart.destroy();
  doughnutChart = new Chart(approvalDoughnutCtx, doughConfig);

  // Dept bar
  const deptCounts = {};
  docs.forEach(d=> deptCounts[d.dept] = (deptCounts[d.dept]||0)+1 );
  const barConfig = {
    type:'bar',
    data:{ labels:Object.keys(deptCounts), datasets:[{label:'Uploads', data:Object.values(deptCounts), backgroundColor:'#2563eb'}] },
    options:{plugins:{legend:{display:false}}}
  };
  if(barChart) barChart.destroy();
  barChart = new Chart(deptBarCtx, barConfig);

  // Trend line (mocked last 12 weeks)
  const labels = Array.from({length:12},(_,i)=>W-${12-i});
  const trendData = labels.map((_,i)=> Math.floor(8 + Math.random()*20) );
  const lineConfig = {
    type:'line',
    data:{ labels, datasets:[{ label:'Uploads', data:trendData, fill:true, borderColor:'#4f46e5', tension:0.3, backgroundColor:'rgba(79,70,229,0.08)' }] },
    options:{plugins:{legend:{display:false}}}
  };
  if(lineChart) lineChart.destroy();
  lineChart = new Chart(trendLineCtx, lineConfig);
}

// ---------- Table Rendering ----------
function populateDeptFilter(){
  const depts = [...new Set(docs.map(d=>d.dept))].sort();
  deptFilter.innerHTML = '<option value="all">All Departments</option>';
  depts.forEach(dept=>{
    const opt = document.createElement('option'); opt.value=dept; opt.textContent=dept; deptFilter.appendChild(opt);
  });
}

function renderTable(){
  const q = globalSearch.value.trim().toLowerCase();
  const dept = deptFilter.value;
  const status = statusFilter.value;
  adminTbody.innerHTML = '';
  let filtered = docs.filter(d=>{
    if(dept !== 'all' && d.dept !== dept) return false;
    if(status !== 'all' && d.status !== status) return false;
    if(q && !(d.student.toLowerCase().includes(q) || d.roll.toLowerCase().includes(q) || d.type.toLowerCase().includes(q))) return false;
    return true;
  });

  filtered.forEach((d,i)=>{
    const tr = document.createElement('tr');
    if(d.priority === 'high') tr.classList.add('high-priority');
    tr.innerHTML = `
      <td><input class="rowCheck" data-id="${d.id}" type="checkbox"></td>
      <td>${i+1}</td>
      <td>${d.student}</td>
      <td>${d.roll}</td>
      <td>${d.dept}</td>
      <td><span class="badge ${d.type.toLowerCase().includes('marks')? 'badge-marks' : d.type.toLowerCase().includes('intern')? 'badge-internship':'badge-cert'}">${d.type}</span></td>
      <td>${d.date}</td>
      <td><span class="status-pill status-${d.status}">${capitalize(d.status)}</span></td>
      <td class="text-center"><span class="priority-tag ${d.priority}">${d.priority.toUpperCase()}</span></td>
      <td class="text-center">
         <div class="actions">
           <button class="btn-view view-btn" data-id="${d.id}">View</button>
           <button class="btn-action approve admin-approve" data-id="${d.id}">Approve</button>
           <button class="btn-action decline admin-decline" data-id="${d.id}">Decline</button>
         </div>
      </td>`;
    adminTbody.appendChild(tr);
  });

  // attach handlers
  document.querySelectorAll('.admin-approve').forEach(b=> b.addEventListener('click', e=> {
    const id = +e.currentTarget.dataset.id; changeStatus(id,'approved');
  }));
  document.querySelectorAll('.admin-decline').forEach(b=> b.addEventListener('click', e=> {
    const id = +e.currentTarget.dataset.id; changeStatus(id,'declined');
  }));
  document.querySelectorAll('.view-btn').forEach(b=> b.addEventListener('click', e=>{
    const id = +e.currentTarget.dataset.id; openViewDialog(id);
  }));
}

// ---------- Status change ----------
function changeStatus(id, status){
  const doc = docs.find(d=>d.id===id);
  if(!doc) return;
  doc.status = status;
  pushActivity(${status.toUpperCase()}: ${doc.student} — ${doc.type});
  renderTable();
  calcSummary();
  renderCharts();
  showToast(Marked ${doc.student} as ${status});
}

// ---------- Bulk actions ----------
document.getElementById('bulkApproveAdmin').addEventListener('click', ()=>{
  const selected = Array.from(document.querySelectorAll('.rowCheck:checked')).map(cb=>+cb.dataset.id);
  if(selected.length===0) { showToast('Select rows first'); return; }
  selected.forEach(id=> { const d = docs.find(x=>x.id===id); if(d) d.status='approved'; });
  pushActivity(Bulk approved ${selected.length} document(s));
  renderTable(); calcSummary(); renderCharts(); showToast('Bulk approve complete');
});

document.getElementById('bulkDeclineAdmin').addEventListener('click', ()=>{
  const selected = Array.from(document.querySelectorAll('.rowCheck:checked')).map(cb=>+cb.dataset.id);
  if(selected.length===0) { showToast('Select rows first'); return; }
  selected.forEach(id=> { const d = docs.find(x=>x.id===id); if(d) d.status='declined'; });
  pushActivity(Bulk declined ${selected.length} document(s));
  renderTable(); calcSummary(); renderCharts(); showToast('Bulk decline complete');
});

adminSelectAll.addEventListener('change', (e)=> {
  document.querySelectorAll('.rowCheck').forEach(cb => cb.checked = e.target.checked);
});

// ---------- Activity Feed ----------
function pushActivity(text){
  const entry = { text, time: new Date().toLocaleString() };
  activityLog.unshift(entry);
  if(activityLog.length>50) activityLog.pop();
  renderActivity();
}

function renderActivity(){
  activityFeed.innerHTML = '';
  activityLog.forEach(a=>{
    const div = document.createElement('div');
    div.className = 'activity-item';
    div.innerHTML = <div style="font-weight:700">${a.text}</div><div style="font-size:12px;color:#6b7280">${a.time}</div>;
    activityFeed.appendChild(div);
  });
}

// ---------- AI Summary (simulated) ----------
function generateAISummary(){
  const total = docs.length;
  const pending = docs.filter(d=>d.status==='pending').length;
  const approved = docs.filter(d=>d.status==='approved').length;
  const declined = docs.filter(d=>d.status==='declined').length;
  const mostActiveDept = Object.entries(docs.reduce((acc,d)=>{acc[d.dept]=(acc[d.dept]||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1])[0];
  const text = This month, ${total} certificates were uploaded. ${approved} were verified and approved, ${declined} were declined and ${pending} are pending review. The most active department is ${mostActiveDept ? mostActiveDept[0] : 'N/A'}. Faculty response efficiency improved by ${Math.floor(5 + Math.random()*12)}% compared to last month.;
  aiSummary.textContent = text;
}

// ---------- Report generation / Export ----------
exportAllCSV.addEventListener('click', ()=> {
  const csvRows = [
    ['S.No','Student','Roll','Dept','Type','Uploaded','Status','Priority','Size'],
    ...docs.map((d,i)=>[i+1, d.student, d.roll, d.dept, d.type, d.date, d.status, d.priority, d.size])
  ];
  const csv = csvRows.map(r => r.map(c=>"${String(c).replace(/"/g,'""')}").join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = smart_hub_all_${new Date().toISOString().slice(0,10)}.csv; a.click();
  showToast('CSV download started');
});

genReportBtn.addEventListener('click', ()=> {
  // Simulate PDF by opening a printable view
  const printArea = document.getElementById('printArea');
  printArea.style.display='block';
  printArea.innerHTML = `<h2>Institution Report (${new Date().toLocaleDateString()})</h2>
      <p>Total uploads: ${docs.length}</p>
      <p>Approved: ${docs.filter(d=>d.status==='approved').length} | Pending: ${docs.filter(d=>d.status==='pending').length} | Declined: ${docs.filter(d=>d.status==='declined').length}</p>
      <hr>
      <h3>Department breakdown</h3>
      <ul>${Object.entries(docs.reduce((acc,d)=>{acc[d.dept]=(acc[d.dept]||0)+1;return acc;},{})).map(([k,v])=><li>${k}: ${v}</li>).join('')}</ul>
      <p style="margin-top:12px">(This is a simulated report. Use a proper backend to produce formatted PDF.)</p>`;
  window.print();
  printArea.style.display='none';
});

// ---------- Role Management (simulated) ----------
openRoleMgmt.addEventListener('click', ()=> { roleModal.style.display='flex'; renderRoleList(); });
closeRoleModal.addEventListener('click', ()=> roleModal.style.display='none');
addUserBtn.addEventListener('click', ()=> {
  const name = newUserName.value.trim(), email = newUserEmail.value.trim(), role = newUserRole.value;
  if(!name || !email) { showToast('Provide name & email'); return; }
  const entry = document.createElement('div');
  entry.style.padding='8px 6px'; entry.style.borderBottom='1px solid #eef2f7';
  entry.innerHTML = <strong>${name}</strong> — ${email} <span style="float:right;font-weight:700;color:#111827">${role}</span>;
  roleList.prepend(entry);
  newUserName.value=''; newUserEmail.value='';
  showToast('User added (simulated)');
});

// render roles (initial)
function renderRoleList(){
  roleList.innerHTML = '';
  const items = [
    {name:'Prof. A. Verifier', email:'a.verifier@college.edu', role:'faculty'},
    {name:'Prof. B. Mentor', email:'b.mentor@college.edu', role:'faculty'},
    {name:'Admin One', email:'admin@college.edu', role:'admin'}
  ];
  items.forEach(it=>{
    const div = document.createElement('div');
    div.style.padding='8px 6px'; div.style.borderBottom='1px solid #eef2f7';
    div.innerHTML = <strong>${it.name}</strong> — ${it.email} <span style="float:right;font-weight:700;color:#111827">${it.role}</span>;
    roleList.appendChild(div);
  });
}

// ---------- View dialog (simulated) ----------
function openViewDialog(id){
  const d = docs.find(x=>x.id===id);
  if(!d) return;
  // quick prompt modal simulated by window.confirm for brevity
  const action = confirm(Preview: ${d.student}\nType: ${d.type}\n\nApprove this document? (Cancel to keep));
  if(action) changeStatus(id,'approved');
}

// ---------- Notifications & Announcements ----------
notifyAll.addEventListener('click', ()=> {
  const msg = prompt('Enter announcement message to send to all faculty & students:', 'Please clear pending verifications by Oct 10.');
  if(msg) { pushActivity(Announcement sent: ${msg}); showToast('Announcement queued (simulated)'); }
});

// ---------- Helpers ----------
function capitalize(s){ if(!s) return ''; return s.charAt(0).toUpperCase()+s.slice(1); }

// ---------- Filters & events ----------
deptFilter.addEventListener('change', ()=> renderTable());
statusFilter.addEventListener('change', ()=> renderTable());
globalSearch.addEventListener('input', ()=> renderTable());

// ---------- Init ----------
function init(){
  populateDeptFilter();
  renderTable();
  calcSummary();
  renderCharts();
  generateAISummary();
  pushActivity('Dashboard loaded');

  // highlight overdue pending (simulate): mark pending older than 14 days
  const now = new Date();
  docs.forEach(d=>{
    const dd = new Date(d.date);
    if(d.status==='pending' && ((now - dd)/(1000*60*60*24) > 14)) {
      d.priority='high';
      pushActivity(Overdue pending: ${d.student} (${d.dept}));
    }
  });
  renderTable();
}

// run
init();