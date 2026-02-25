// --- Updated Code niche se copy karein ---

let db = JSON.parse(localStorage.getItem("ems_db")) || {
  e: [],
  d: ["Management", "IT", "Finance"],
  l: [],
  a: [],
};
let config = JSON.parse(localStorage.getItem("ems_config")) || {
  org: "A1 EMS",
  cur: "₹",
  addr: "Main City Hub, Sector 12, Rampur, UP",
};
let selId = null;
let ch1, ch2;
let activeEmpTab = "ALL";

function doLogin() {
  if (document.getElementById("p").value === "123") {
    sessionStorage.setItem("auth", "1");
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    initSettings();
    render();
  } else alert("PIN is 123");
}

function initSettings() {
  document.getElementById("set-org").value = config.org;
  document.getElementById("set-cur").value = config.cur;
  document.getElementById("set-addr").value = config.addr;
  document
    .querySelectorAll(".org-name-display")
    .forEach((el) => (el.innerText = config.org));
}

function saveSettings() {
  config = {
    org: document.getElementById("set-org").value,
    cur: document.getElementById("set-cur").value,
    addr: document.getElementById("set-addr").value,
  };
  localStorage.setItem("ems_config", JSON.stringify(config));
  initSettings();
  alert("Branding Updated!");
}

function go(v) {
  ["dash", "emp", "dept", "leave", "sal", "att", "rep", "set"].forEach((x) => {
    document.getElementById("view-" + x).classList.toggle("hidden", x !== v);
    document.getElementById("m-" + x).classList.toggle("active-link", x === v);
    document.getElementById('sidebar').classList.add('-translate-x-full');
  });
  document.getElementById("title").innerText = v;
  if (v === "rep") drawRep();
  render();
}

function showEmpMod(id = null) {
  const s = document.getElementById("f-d");
  s.innerHTML = "";
  db.d.forEach((d) => (s.innerHTML += `<option value="${d}">${d}</option>`));
  if (id) {
    const e = db.e.find((x) => x.id === id);
    document.getElementById("f-id").value = e.id;
    document.getElementById("f-n").value = e.name;
    document.getElementById("f-d").value = e.dept;
    document.getElementById("f-s").value = e.salary;
  } else {
    document.getElementById("f-id").value = "";
    document.getElementById("f-n").value = "";
    document.getElementById("f-s").value = "";
  }
  document.getElementById("mod-emp").classList.remove("hidden");
}

function saveEmp() {
  const id = document.getElementById("f-id").value,
    n = document.getElementById("f-n").value,
    d = document.getElementById("f-d").value,
    s = Number(document.getElementById("f-s").value);
  if (!n || !s) return;
  if (id) {
    const i = db.e.findIndex((x) => x.id == id);
    db.e[i] = { ...db.e[i], name: n, dept: d, salary: s };
  } else {
    db.e.push({
      id: Date.now(),
      empID: "KH" + Math.floor(100 + Math.random() * 900),
      name: n,
      dept: d,
      salary: s,
    });
  }
  localStorage.setItem("ems_db", JSON.stringify(db));
  document.getElementById("mod-emp").classList.add("hidden");
  render();
}

function showLeaveMod() {
  const s = document.getElementById("l-emp");
  s.innerHTML = "";
  db.e.forEach(
    (e) => (s.innerHTML += `<option value="${e.id}">${e.name}</option>`),
  );
  document.getElementById("mod-leave").classList.remove("hidden");
}

function saveLeave() {
  const eid = parseInt(document.getElementById("l-emp").value),
    r = document.getElementById("l-reason").value,
    d = document.getElementById("l-date").value;
  if (!r || !d) return;
  db.l.push({ id: Date.now(), eid, reason: r, date: d, status: "pending" });
  localStorage.setItem("ems_db", JSON.stringify(db));
  document.getElementById("mod-leave").classList.add("hidden");
  render();
}

function updateLeave(id, st) {
  const idx = db.l.findIndex((x) => x.id === id);
  db.l[idx].status = st;
  localStorage.setItem("ems_db", JSON.stringify(db));
  render();
}

function saveDept() {
  const n = document.getElementById("new-dept-name").value;
  if (n) {
    db.d.push(n);
    document.getElementById("new-dept-name").value = "";
    localStorage.setItem("ems_db", JSON.stringify(db));
    render();
  }
}

// FIXED: Ab ye function pehle dikhayega (Print nahi karega seedha)
// ... (Puraane functions waise hi rahenge) ...

function printSlip(id) {
    const e = db.e.find((x) => x.id === id);
    if(!e) return;
    
    const m = new Date().getMonth();
    const y = new Date().getFullYear();

    // Calculation Logic
    const leaves = db.l.filter(l => l.eid === id && l.status === "approved" && new Date(l.date).getMonth() === m).length;
    const absents = db.a.filter(a => a.id === id && a.status === "absent" && new Date(a.date).getMonth() === m).length;

    const l_ded = leaves > 2 ? (leaves - 2) * 500 : 0;
    const a_ded = absents * 1000;
    const net = e.salary - l_ded - a_ded;

    // HTML Elements mein data bharna
    document.getElementById("print-name").innerText = e.name;
    document.getElementById("print-id").innerText = e.empID;
    document.getElementById("print-addr-display").innerText = config.addr;
    document.getElementById("print-month-year").innerText = new Date().toLocaleString("default", { month: "long", year: "numeric" });
    document.getElementById("print-basic").innerText = config.cur + e.salary.toLocaleString();
    document.getElementById("print-l-ded").innerText = "- " + config.cur + l_ded.toLocaleString();
    document.getElementById("print-a-ded").innerText = "- " + config.cur + a_ded.toLocaleString();
    document.getElementById("print-net").innerText = config.cur + net.toLocaleString();
    document.getElementById("print-deduction-summary").innerText = `L: ${leaves} | A: ${absents}`;
    document.getElementById("current-date").innerText = new Date().toLocaleDateString();

    // Modal Show Karna (Print Preview)
    document.getElementById("slip-print-section").classList.remove("hidden");

     
}

function Print() {
  
    const printSection = document.getElementById('slip-print-section');
    
    // 1. Pehle section se 'hidden' class hatao
    printSection.classList.remove('hidden');
    
    // 2. Thoda delay do taaki browser render kar le
    setTimeout(() => {
        window.print();
    }, 500);
}

// ... (Baaki render aur mark functions waise hi rahenge) ...

function openMark(id) {
  selId = id;
  document.getElementById("mod-att").classList.remove("hidden");
}
function mark(st) {
  db.a.push({
    date: new Date().toISOString().split("T")[0],
    id: selId,
    status: st,
  });
  localStorage.setItem("ems_db", JSON.stringify(db));
  document.getElementById("mod-att").classList.add("hidden");
  render();
}

function drawRep() {
  const box = document.getElementById("rep-data-container"),
    pick = document.getElementById("rep-date").value;
  box.innerHTML = "";
  const grp = db.a.reduce((acc, c) => {
    if (pick && c.date !== pick) return acc;
    if (!acc[c.date]) acc[c.date] = [];
    acc[c.date].push(c);
    return acc;
  }, {});

  Object.keys(grp)
    .sort()
    .reverse()
    .forEach((date) => {
      let h = `<div class="report-card p-8">
                    <div class="flex justify-between items-center border-b pb-4 mb-6">
                        <h4 class="font-black text-slate-800 uppercase tracking-tighter">Day Log: ${date}</h4>
                        <span class="bg-teal-50 text-teal-600 px-4 py-1 rounded-full text-[10px] font-black">${grp[date].length} Logs</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`;
      grp[date].forEach((r) => {
        const emp = db.e.find((x) => x.id === r.id);
        if (emp)
          h += `<div class="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                        <div><p class="font-bold text-sm">${emp.name}</p><p class="text-[10px] text-slate-400 font-black">${emp.empID}</p></div>
                        <span class="status-${r.status} font-black text-[10px] uppercase">${r.status}</span>
                    </div>`;
      });
      box.innerHTML += h + `</div></div>`;
    });
}

function render() {
  const eL = document.getElementById("emp-list"),
    sL = document.getElementById("sal-list"),
    aL = document.getElementById("att-mark-list"),
    dL = document.getElementById("dept-list"),
    lL = document.getElementById("leave-list"),
    tabs = document.getElementById("dept-tabs-container");
  const search = document.getElementById("emp-search").value.toLowerCase();
  const today = new Date().toISOString().split("T")[0];
  const m = new Date().getMonth();

  eL.innerHTML = "";
  sL.innerHTML = "";
  aL.innerHTML = "";
  dL.innerHTML = "";
  lL.innerHTML = "";
  tabs.innerHTML = "";
  let tS = 0,
    deptCounts = {},
    lToday = 0;

  tabs.innerHTML = `<button onclick="activeEmpTab='ALL';render()" class="tab-btn ${activeEmpTab === "ALL" ? "active" : ""}">All</button>`;
  db.d.forEach(
    (d) =>
      (tabs.innerHTML += `<button onclick="activeEmpTab='${d}';render()" class="tab-btn px-4 py-2 border rounded-xl text-xs font-black ${activeEmpTab === d ? "bg-teal-600 text-white" : "bg-white"}">${d}</button>`),
  );

  db.e.forEach((e) => {
    if (
      (activeEmpTab === "ALL" || e.dept === activeEmpTab) &&
      e.name.toLowerCase().includes(search)
    ) {
      tS += e.salary;
      deptCounts[e.dept] = (deptCounts[e.dept] || 0) + 1;
      eL.innerHTML += `<tr><td class="p-6"><div><p class="font-bold">${e.name}</p><p class="text-[10px] text-slate-400 font-black">${e.empID}</p></div></td><td class="p-6"><span class="bg-teal-50 text-teal-600 px-3 py-1 rounded-lg text-xs font-black">${e.dept}</span></td><td class="p-6 font-black">${config.cur}${e.salary.toLocaleString()}</td><td class="p-6 text-center"><button onclick="showEmpMod(${e.id})" class="text-blue-500 mx-2"><i class="fas fa-edit"></i></button><button onclick="db.e=db.e.filter(x=>x.id!==${e.id});localStorage.setItem('ems_db',JSON.stringify(db));render()" class="text-red-400 mx-2"><i class="fas fa-trash"></i></button></td></tr>`;

      const lCount = db.l.filter(
        (l) =>
          l.eid === e.id &&
          l.status === "approved" &&
          new Date(l.date).getMonth() === m,
      ).length;
      const aCount = db.a.filter(
        (a) =>
          a.id === e.id &&
          a.status === "absent" &&
          new Date(a.date).getMonth() === m,
      ).length;
      const totalDed = (lCount > 2 ? (lCount - 2) * 500 : 0) + aCount * 1000;

      sL.innerHTML += `<tr><td class="p-6 font-bold">${e.name}</td><td class="p-6 font-black text-emerald-600">${config.cur}${e.salary.toLocaleString()}</td><td class="p-6"><span class="text-xs font-black text-red-500">-${config.cur}${totalDed.toLocaleString()}</span></td><td class="p-6 text-center"><button onclick="printSlip(${e.id})" class="bg-teal-600 text-white p-2 px-4 rounded-xl text-[10px] font-black">PAYSLIP</button></td></tr>`;

      const att = db.a.find((a) => a.id === e.id && a.date === today);
      const st = att ? att.status : "unmarked";
      aL.innerHTML += `<tr><td class="p-6 font-bold">${e.name}</td><td class="p-6 text-slate-400 font-bold">${e.empID}</td><td class="p-6 text-center">${st === "unmarked" ? `<button onclick="openMark(${e.id})" class="bg-teal-50 text-teal-600 px-4 py-2 rounded-xl text-xs font-black">MARK NOW</button>` : `<span class="status-${st} uppercase text-xs">${st}</span>`}</td></tr>`;
    }
  });

  db.l.forEach((l) => {
    const emp = db.e.find((x) => x.id === l.eid);
    if (l.date === today && l.status === "approved") lToday++;
    if (emp) {
      lL.innerHTML += `<tr>
                <td class="p-6">
                    <div>
                        <p class="font-bold text-slate-800">${emp.name}</p>
                        <p class="text-[11px] font-black text-teal-600 uppercase tracking-wider">${emp.empID} — ${emp.dept}</p>
                        <p class="text-[10px] text-slate-400 font-bold mt-1"><i class="far fa-calendar-alt mr-1"></i>${l.date}</p>
                    </div>
                </td>
                <td class="p-6 text-sm font-bold text-slate-500">${l.reason}</td>
                <td class="p-6 text-center">
                    <span class="status-${l.status} uppercase text-[10px] font-black px-3 py-1 rounded-full">${l.status}</span>
                </td>
                <td class="p-6 text-center">
                    ${
                      l.status === "pending"
                        ? `
                        <button onclick="updateLeave(${l.id},'approved')" class="text-emerald-500 mx-2 hover:scale-110 transition-transform"><i class="fas fa-check-circle text-lg"></i></button>
                        <button onclick="updateLeave(${l.id},'rejected')" class="text-red-400 mx-2 hover:scale-110 transition-transform"><i class="fas fa-times-circle text-lg"></i></button>
                    `
                        : `<i class="fas fa-check-double text-slate-200"></i>`
                    }
                </td>
            </tr>`;
    }
  });

  db.d.forEach((d, idx) => {
    dL.innerHTML += `<div class="bg-white p-8 rounded-[2rem] border shadow-sm text-center relative"><button onclick="db.d.splice(${idx},1);localStorage.setItem('ems_db',JSON.stringify(db));render()" class="absolute top-4 right-4 text-slate-200 hover:text-red-500"><i class="fas fa-times-circle"></i></button><h3 class="text-xl font-black">${d}</h3></div>`;
  });

  document.getElementById("stat-s").innerText = db.e.length;
  document.getElementById("stat-l").innerText = lToday;
  document.getElementById("stat-b").innerText =
    `${config.cur}${tS.toLocaleString()}`;
  if (typeof updateCharts === "function")
    updateCharts(Object.keys(deptCounts), Object.values(deptCounts));
}

function updateCharts(l, c) {
  if (ch1) ch1.destroy();
  if (ch2) ch2.destroy();
  const o = {
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };
  ch1 = new Chart(document.getElementById("c1"), {
    type: "doughnut",
    data: {
      labels: l,
      datasets: [
        {
          data: c,
          backgroundColor: ["#0d9488", "#3b82f6", "#8b5cf6", "#f59e0b"],
        },
      ],
    },
    options: o,
  });
  ch2 = new Chart(document.getElementById("c2"), {
    type: "bar",
    data: {
      labels: l,
      datasets: [
        {
          label: "Staff",
          data: c,
          backgroundColor: "#0d9488",
          borderRadius: 12,
        },
      ],
    },
    options: o,
  });
}

window.onload = () => {
  if (sessionStorage.getItem("auth") === "1") {
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    initSettings();
    render();
  }
};

function logout() {
  sessionStorage.removeItem("auth");
  location.reload();

}
