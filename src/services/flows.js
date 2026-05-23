// ══════ CONFIG FLOWS SHAREPOINT ══════
// Reemplazar con URLs reales de Power Automate
const FL = 'https://TU_FLOW_BASE_URL/';
const SIG = 'triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=';

const FLOWS = {
  usuarios:   FL + 'FU/'   + SIG + 'S1',
  pronos:     FL + 'FP/'   + SIG + 'S2',
  guardar:    FL + 'FG/'   + SIG + 'S3',
  ranking:    FL + 'FR/'   + SIG + 'S4',
  resultado:  FL + 'FRR/'  + SIG + 'S5',
  registrar:  FL + 'FREG/' + SIG + 'S6',
};

const SP_LISTO = !FLOWS.usuarios.includes('TU_FLOW');

const postFlow = async (url, body, timeoutMs = 4000) => {
  if (!SP_LISTO) throw new Error('SP no configurado');
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    clearTimeout(tid);
    return await res.json();
  } catch (e) {
    clearTimeout(tid);
    throw e;
  }
};

// ── Usuarios ──
export const verificarUsuario = async (email) => {
  const d = await postFlow(FLOWS.usuarios, { email });
  return (d.value || []).find(e => (e.Email||'').toLowerCase() === email.toLowerCase());
};

export const registrarUsuario = async (email, nombre, sector) => {
  return postFlow(FLOWS.registrar, { email, nombre, sector, activo: 'Si' });
};

// ── Pronósticos ──
export const leerPronos = async (email) => {
  const d = await postFlow(FLOWS.pronos, { email });
  return d.value || [];
};

export const guardarProno = async (email, partidoId, gL, gV, spId = null) => {
  return postFlow(FLOWS.guardar, {
    email, Partido_ID: partidoId,
    Goles_Local: gL, Goles_Visit: gV,
    sp_id: spId,
  });
};

export const guardarBonus = async (email, bonus) => {
  return postFlow(FLOWS.guardar, { email, tipo: 'bonus', ...bonus });
};

// ── Ranking ──
export const leerRanking = async () => {
  const d = await postFlow(FLOWS.ranking, {});
  return (d.value || []).sort((a, b) => (b.Puntos||0) - (a.Puntos||0));
};

// ── Admin ──
export const guardarResultado = async (partidoId, gl, gv) => {
  return postFlow(FLOWS.resultado, {
    Partido_ID: partidoId, GL_Real: gl, GV_Real: gv,
  });
};

export { SP_LISTO };
