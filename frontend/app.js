const API = window.FITCONTROL_CONFIG.API_URL.replace(/\/$/, "");
const state = { alunos: [], professores: [], planos: [], pagamentos: [], editing: null, entity: null };
const $ = (id) => document.getElementById(id);
const money = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const date = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR") : "—";
const safe = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[char]));

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Erro ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function notify(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(item => item.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(item => item.classList.toggle("active", item.dataset.page === page));
  $(`${page}-page`).classList.add("active");
  $("page-title").textContent = ({ dashboard: "Visão geral", alunos: "Alunos", professores: "Professores", planos: "Planos", pagamentos: "Pagamentos" })[page];
  if (page !== "dashboard") loadAll();
}

async function loadAll() {
  try {
    const [alunos, professores, planos, pagamentos] = await Promise.all([
      request("/alunos"), request("/professores"), request("/planos"), request("/pagamentos")
    ]);
    Object.assign(state, { alunos, professores, planos, pagamentos });
    renderAll();
  } catch (error) {
    notify(`Não foi possível carregar os dados: ${error.message}`);
  }
}

async function loadDashboard() {
  try {
    const data = await request("/dashboard");
    Object.entries(data).forEach(([key, value]) => { if ($(key)) $(key).textContent = value; });
  } catch (error) {
    notify("API indisponível. Confira o backend e a conexão com o banco.");
  }
}

function renderAll() {
  renderAlunos(); renderProfessores(); renderPlanos(); renderPagamentos();
}

function renderAlunos() {
  const term = ($("alunos-search")?.value || "").toLowerCase();
  const rows = state.alunos.filter(a => `${a.nome} ${a.cpf}`.toLowerCase().includes(term));
  $("alunos-count").textContent = `${rows.length} registro(s)`;
  $("alunos-table").innerHTML = rows.length ? rows.map(a => `<tr>
    <td><span class="person-cell">${safe(a.nome)}</span><span class="sub-cell">${safe(a.idade ?? "—")} anos</span></td>
    <td>${safe(a.cpf)}</td><td>${safe(a.telefone || "—")}</td><td>${safe(a.plano?.nome || "Sem plano")}</td>
    <td><span class="pill ${a.status === "ATIVO" ? "" : "inactive"}">${safe(a.status || "ATIVO")}</span></td>
    <td><button class="action-btn" data-edit="aluno" data-id="${a.id}">Editar</button><button class="action-btn" data-delete="aluno" data-id="${a.id}">Excluir</button></td>
  </tr>`).join("") : `<tr><td colspan="6" class="empty">Nenhum aluno cadastrado.</td></tr>`;
}

function renderProfessores() {
  const term = ($("professores-search")?.value || "").toLowerCase();
  const rows = state.professores.filter(p => `${p.nome} ${p.cpf}`.toLowerCase().includes(term));
  $("professores-table").innerHTML = rows.length ? rows.map(p => `<tr>
    <td class="person-cell">${safe(p.nome)}</td><td>${safe(p.cpf)}</td><td>${safe(p.telefone || "—")}</td>
    <td>${safe(p.cref || "—")}</td><td>${safe(p.especialidade || "—")}</td>
    <td><button class="action-btn" data-edit="professor" data-id="${p.id}">Editar</button><button class="action-btn" data-delete="professor" data-id="${p.id}">Excluir</button></td>
  </tr>`).join("") : `<tr><td colspan="6" class="empty">Nenhum professor cadastrado.</td></tr>`;
}

function renderPlanos() {
  $("planos-grid").innerHTML = state.planos.length ? state.planos.map(p => `<article class="plan-card">
    <span class="panel-kicker">PLANO FITCONTROL</span><h3>${safe(p.nome)}</h3><div class="plan-price">${money(p.valor)}</div>
    <p>${p.duracaoMeses} ${p.duracaoMeses === 1 ? "mês" : "meses"} de acesso</p>
    <div class="plan-actions"><button class="action-btn" data-edit="plano" data-id="${p.id}">Editar</button><button class="action-btn" data-delete="plano" data-id="${p.id}">Excluir</button></div>
  </article>`).join("") : `<div class="panel empty">Cadastre o primeiro plano.</div>`;
}

function renderPagamentos() {
  $("pagamentos-table").innerHTML = state.pagamentos.length ? state.pagamentos.map(p => `<tr>
    <td class="person-cell">${safe(p.aluno?.nome || "Aluno")}</td><td>${money(p.valor)}</td><td>${date(p.vencimento)}</td>
    <td><span class="pill ${p.status === "PAGO" ? "" : "pending"}">${safe(p.status)}</span></td>
    <td><button class="action-btn" data-edit="pagamento" data-id="${p.id}">Editar</button><button class="action-btn" data-delete="pagamento" data-id="${p.id}">Excluir</button></td>
  </tr>`).join("") : `<tr><td colspan="5" class="empty">Nenhum pagamento registrado.</td></tr>`;
}

const fields = {
  aluno: [
    ["nome","Nome completo","text",true],["cpf","CPF","text",true],["telefone","Telefone","tel"],["idade","Idade","number"],["endereco","Endereço","text",false,true],
    ["planoId","Plano contratado","select",false,false,"planos"],["dataMatricula","Data de matrícula","date"],["status","Status","select",false,false,"status"]
  ],
  professor: [
    ["nome","Nome completo","text",true],["cpf","CPF","text",true],["telefone","Telefone","tel"],["idade","Idade","number"],["cref","CREF","text"],["especialidade","Especialidade","text"],["horarioTrabalho","Horário de trabalho","text"]
  ],
  plano: [["nome","Nome do plano","text",true],["valor","Valor (R$)","number",true],["duracaoMeses","Duração em meses","number",true]],
  pagamento: [["alunoId","Aluno","select",true,false,"alunos"],["valor","Valor (R$)","number",true],["vencimento","Data de vencimento","date",true],["status","Status","select",true,false,"pagamentoStatus"]]
};

function openForm(entity, item = null) {
  state.entity = entity;
  state.editing = item?.id ?? null;
  const labels = { aluno: "aluno", professor: "professor", plano: "plano", pagamento: "pagamento" };
  $("modal-title").textContent = `${item ? "Editar" : "Cadastrar"} ${labels[entity]}`;
  $("form-fields").innerHTML = fields[entity].map(([name,label,type,required,full,source]) => {
    let control;
    if (type === "select") {
      let options = [];
      if (source === "planos") options = state.planos.map(p => [p.id,p.nome]);
      if (source === "alunos") options = state.alunos.map(a => [a.id,a.nome]);
      if (source === "status") options = [["ATIVO","Ativo"],["INATIVO","Inativo"]];
      if (source === "pagamentoStatus") options = [["PENDENTE","Pendente"],["PAGO","Pago"],["ATRASADO","Atrasado"]];
      control = `<select id="field-${name}" ${required ? "required" : ""}><option value="">Selecione</option>${options.map(([v,t]) => `<option value="${v}">${safe(t)}</option>`).join("")}</select>`;
    } else {
      control = `<input id="field-${name}" type="${type}" ${required ? "required" : ""} ${type === "number" && name === "idade" ? 'min="1" max="110"' : ""} ${type === "number" && name !== "idade" ? 'min="0" step="0.01"' : ""}>`;
    }
    return `<div class="field ${full ? "full" : ""}"><label for="field-${name}">${label}</label>${control}</div>`;
  }).join("");
  if (item) {
    fields[entity].forEach(([name]) => {
      const value = name === "planoId" ? item.plano?.id : name === "alunoId" ? item.aluno?.id : item[name];
      if (value !== undefined && value !== null) $(`field-${name}`).value = value;
    });
  }
  $("modal-backdrop").classList.add("open");
}

function closeForm() { $("modal-backdrop").classList.remove("open"); $("entity-form").reset(); }

async function saveForm(event) {
  event.preventDefault();
  const entity = state.entity;
  const payload = {};
  fields[entity].forEach(([name]) => {
    const value = $(`field-${name}`).value;
    if (name === "planoId" && value) payload.plano = { id: Number(value) };
    else if (name === "alunoId" && value) payload.aluno = { id: Number(value) };
    else if (name === "idade" || name === "duracaoMeses") payload[name] = value ? Number(value) : null;
    else if (name === "valor") payload[name] = value ? Number(value) : 0;
    else payload[name] = value || null;
  });
  const endpoint = ({ aluno: "alunos", professor: "professores", plano: "planos", pagamento: "pagamentos" })[entity];
  try {
    await request(`/${endpoint}${state.editing ? `/${state.editing}` : ""}`, {
      method: state.editing ? "PUT" : "POST", body: JSON.stringify(payload)
    });
    closeForm(); await loadAll(); await loadDashboard(); notify("Dados salvos com sucesso.");
  } catch (error) { notify(`Erro ao salvar: ${error.message}`); }
}

async function deleteItem(entity, id) {
  if (!confirm("Tem certeza de que deseja excluir este registro?")) return;
  const endpoint = ({ aluno: "alunos", professor: "professores", plano: "planos", pagamento: "pagamentos" })[entity];
  try {
    await request(`/${endpoint}/${id}`, { method: "DELETE" });
    await loadAll(); await loadDashboard(); notify("Registro excluído.");
  } catch (error) { notify(`Não foi possível excluir: ${error.message}`); }
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-page]");
  if (nav) showPage(nav.dataset.page);
  const action = event.target.closest("[data-action]");
  if (action) {
    const map = { "new-student":"aluno", "new-professor":"professor", "new-plano":"plano", "new-pagamento":"pagamento" };
    if (action.dataset.action === "new-student") showPage("alunos");
    openForm(map[action.dataset.action]);
  }
  const edit = event.target.closest("[data-edit]");
  if (edit) {
    const collection = ({ aluno:"alunos", professor:"professores", plano:"planos", pagamento:"pagamentos" })[edit.dataset.edit];
    openForm(edit.dataset.edit, state[collection].find(item => item.id === Number(edit.dataset.id)));
  }
  const remove = event.target.closest("[data-delete]");
  if (remove) deleteItem(remove.dataset.delete, Number(remove.dataset.id));
});

$("entity-form").addEventListener("submit", saveForm);
$("modal-close").addEventListener("click", closeForm);
$("modal-cancel").addEventListener("click", closeForm);
$("modal-backdrop").addEventListener("click", event => { if (event.target === $("modal-backdrop")) closeForm(); });
$("alunos-search").addEventListener("input", renderAlunos);
$("professores-search").addEventListener("input", renderProfessores);
$("today").textContent = new Date().toLocaleDateString("pt-BR", { weekday:"long", day:"2-digit", month:"long", year:"numeric" });
loadDashboard();
loadAll();
