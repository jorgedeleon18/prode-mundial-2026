// ── MI HISTORIAL ──
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { TODOS, estaFinalizado, fechaCorta, calcPts } from '../data/fixture';
import { fn } from '../data/paises';
import { C } from '../theme';

export function HistorialScreen() {
  const { pronos, totalPts } = useApp();
  const conProno = TODOS.filter(p => pronos[p.id] !== undefined);

  if (!conProno.length) {
    return (
      <View style={s.empty}>
        <Text style={s.emptyIco}>🎯</Text>
        <Text style={s.emptyTxt}>Todavía no cargaste ningún pronóstico</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:C.bg }} contentContainerStyle={{ padding:12, gap:8 }}>
      <View style={s.statsRow}>
        <View style={s.sc}><Text style={s.scLbl}>Mis puntos</Text><Text style={[s.scVal,{color:C.aub}]}>{totalPts()}</Text><Text style={s.scSub}>acumulados</Text></View>
        <View style={s.sc}><Text style={s.scLbl}>Pronósticos</Text><Text style={[s.scVal,{color:C.verde}]}>{conProno.length}</Text><Text style={s.scSub}>cargados</Text></View>
      </View>
      {conProno.map(p => {
        const pr = pronos[p.id];
        const fin = estaFinalizado(p);
        let pts = null;
        if (fin && pr?.gL !== undefined && pr?.gL !== '') pts = calcPts(p, pr);
        return (
          <View key={p.id} style={s.row}>
            <View style={{ flex:1 }}>
              <Text style={s.rowTitle}>{fn(p.l)} vs {fn(p.v)}</Text>
              <Text style={s.rowSub}>{p.grupo} · {fechaCorta(p.fecha)} · {fin?'Real: '+p.gl+'–'+p.gv:'No jugado aún'}</Text>
              {pts && <Text style={[s.ptsBadge, pts.pts===5?{color:'#ca8a04'}:pts.pts===0?{color:C.gray}:{color:C.verde}]}>+{pts.pts} pts · {pts.lbl}</Text>}
            </View>
            <Text style={s.pronoVal}>{pr.gL!==''?pr.gL:'?'}–{pr.gV!==''?pr.gV:'?'}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

// ── POSICIONES ──
export function PosicionesScreen() {
  const { usuario } = useApp();
  const [rank, setRank] = React.useState([
    {Email:'jorge@aubasa.com.ar',Nombre:'García, Jorge',Sector:'Sistemas',Puntos:47,Exactos:4},
    {Email:'maria@aubasa.com.ar',Nombre:'López, María',Sector:'RRHH',Puntos:41,Exactos:3},
    {Email:'carlos@aubasa.com.ar',Nombre:'Pérez, Carlos',Sector:'Técnicos',Puntos:38,Exactos:2},
    {Email:'ana@aubasa.com.ar',Nombre:'Rodríguez, Ana',Sector:'Comercial',Puntos:35,Exactos:3},
    {Email:'luis@aubasa.com.ar',Nombre:'Fernández, Luis',Sector:'Tesorería',Puntos:29,Exactos:1},
  ]);

  React.useEffect(() => {
    const { leerRanking } = require('../services/flows');
    leerRanking().then(setRank).catch(() => {});
  }, []);

  const med = ['🥇','🥈','🥉'];

  return (
    <ScrollView style={{ flex:1, backgroundColor:C.bg }} contentContainerStyle={{ padding:12 }}>
      <View style={s.card}>
        <View style={s.cardHead}>
          <Text style={s.cardHeadTxt}>🏆 Tabla de posiciones</Text>
          <Text style={s.cardHeadSub}>Desempate por más resultados exactos</Text>
        </View>
        {rank.map((p, i) => {
          const yo = (p.Email||'').toLowerCase() === usuario?.email;
          return (
            <View key={i} style={[s.rankRow, yo && s.rankRowYo]}>
              <Text style={s.rankNum}>{i<3?med[i]:`${i+1}`}</Text>
              <View style={[s.avatar, yo && {backgroundColor:C.verde}]}>
                <Text style={s.avatarTxt}>{(p.Nombre||'??').slice(0,2).toUpperCase()}</Text>
              </View>
              <View style={{ flex:1 }}>
                <Text style={[s.rankNom, yo && {color:C.aub}]}>{p.Nombre}{yo?' (vos)':''}</Text>
                <Text style={s.rankSect}>{p.Sector} · {p.Exactos||0} exactos</Text>
              </View>
              <Text style={s.rankPts}>{p.Puntos||0}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ── FIXTURE ──
export function FixtureScreen() {
  const { GRUPOS } = require('../data/fixture');
  const { fn, fechaCorta } = require('../data/paises');
  const { GCOL } = require('../theme');

  return (
    <ScrollView style={{ flex:1, backgroundColor:C.bg }} contentContainerStyle={{ padding:12, gap:10 }}>
      <View style={[s.infoBanner]}>
        <Text style={s.infoTxt}>⚽ 48 equipos · 12 grupos (A–L) · 104 partidos · Inicio: 11 jun 2026 · Horarios ARG (UTC-3)</Text>
      </View>
      {Object.entries(GRUPOS).map(([g, data]) => {
        const gc = GCOL[g] || ['#022D40','#024560'];
        return (
          <View key={g} style={s.card}>
            <View style={[s.cardHead, {backgroundColor:gc[0]}]}>
              <Text style={s.cardHeadTxt}>Grupo {g}</Text>
              <Text style={s.cardHeadSub2}>{data.equipos.map(e=>fn(e)).join(' · ')}</Text>
            </View>
            {data.partidos.map(p => (
              <View key={p.id} style={s.fxRow}>
                <Text style={s.fxFecha}>{fechaCorta(p.fecha)} ⏰{p.hora}</Text>
                <Text style={s.fxL} numberOfLines={1}>{fn(p.l)}</Text>
                <Text style={s.fxVs}>{p.gl!==undefined?`${p.gl}–${p.gv}`:'vs'}</Text>
                <Text style={s.fxV} numberOfLines={1}>{fn(p.v)}</Text>
                <Text style={s.fxCiudad} numberOfLines={1}>📍{p.ciudad}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

// ── REGLAS ──
export function ReglasScreen() {
  const PTS = [
    {val:'5', lbl:'Resultado exacto', desc:'Acertás el marcador final (ej: 2-1 y sale 2-1)'},
    {val:'3', lbl:'Ganador + diferencia', desc:'Acertás quién gana y la diferencia exacta de goles'},
    {val:'1', lbl:'Solo el ganador', desc:'Acertás quién gana o que es empate, sin el marcador'},
    {val:'0', lbl:'Nada', desc:'El resultado no coincide con tu pronóstico'},
  ];
  const BONUS = [
    {val:'+10', lbl:'🏆 Campeón', desc:'Acertás el equipo campeón del mundo'},
    {val:'+5', lbl:'🥈 Finalista', desc:'Acertás el subcampeón'},
    {val:'+5', lbl:'⚽ Goleador', desc:'Acertás el máximo goleador del torneo'},
  ];
  const REGLAS = [
    {color:C.aub, txt:'⏰ Cierre automático: cada partido cierra a las 23:59 del día anterior. Después no se puede modificar.'},
    {color:C.verde, txt:'✏️ Podés editar tu pronóstico cuantas veces quieras antes del cierre.'},
    {color:'#ca8a04', txt:'🤝 Para pronosticar empate, ingresá el mismo número de goles para ambos equipos.'},
    {color:C.rojo, txt:'🔒 Si no pronosticaste antes del cierre, ese partido da 0 puntos. Sin excepciones.'},
    {color:'#9333ea', txt:'🏅 Desempate: si dos participantes tienen los mismos puntos, gana quien tenga más resultados exactos.'},
  ];
  return (
    <ScrollView style={{ flex:1, backgroundColor:C.bg }} contentContainerStyle={{ padding:12, gap:12 }}>
      <View style={s.card}>
        <Text style={s.secTitle}>📊 Sistema de puntaje</Text>
        {PTS.map(p => (
          <View key={p.val} style={s.ptsRow}>
            <Text style={s.ptsVal}>{p.val}</Text>
            <View style={{ flex:1 }}>
              <Text style={s.ptsLbl}>{p.lbl}</Text>
              <Text style={s.ptsDesc}>{p.desc}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={s.card}>
        <Text style={s.secTitle}>🌟 Bonus</Text>
        {BONUS.map(b => (
          <View key={b.val} style={s.ptsRow}>
            <Text style={[s.ptsVal, {color:'#ca8a04'}]}>{b.val}</Text>
            <View style={{ flex:1 }}>
              <Text style={s.ptsLbl}>{b.lbl}</Text>
              <Text style={s.ptsDesc}>{b.desc}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={s.card}>
        <Text style={s.secTitle}>📋 Reglas importantes</Text>
        {REGLAS.map((r, i) => (
          <View key={i} style={[s.reglaRow, {borderLeftColor:r.color}]}>
            <Text style={s.reglaTxt}>{r.txt}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  empty:      { flex:1, alignItems:'center', justifyContent:'center' },
  emptyIco:   { fontSize:44, marginBottom:10 },
  emptyTxt:   { fontSize:14, color:C.gray },
  statsRow:   { flexDirection:'row', gap:10, marginBottom:4 },
  sc:         { flex:1, backgroundColor:C.white, borderRadius:9, padding:12,
                borderWidth:1, borderColor:C.grayBorder },
  scLbl:      { fontSize:9, fontWeight:'700', color:C.gray, textTransform:'uppercase', marginBottom:3 },
  scVal:      { fontSize:24, fontWeight:'800' },
  scSub:      { fontSize:9, color:C.gray, marginTop:2 },
  row:        { backgroundColor:C.white, borderRadius:8, borderWidth:1,
                borderColor:C.grayBorder, padding:11, flexDirection:'row', alignItems:'center', gap:8 },
  rowTitle:   { fontSize:12, fontWeight:'700', color:C.grayDark },
  rowSub:     { fontSize:9, color:C.gray, marginTop:2 },
  ptsBadge:   { fontSize:10, fontWeight:'700', marginTop:3 },
  pronoVal:   { fontSize:18, fontWeight:'800', color:C.aub, minWidth:50, textAlign:'right' },
  card:       { backgroundColor:C.white, borderRadius:10, borderWidth:1,
                borderColor:C.grayBorder, overflow:'hidden' },
  cardHead:   { backgroundColor:'#022D40', padding:12 },
  cardHeadTxt:{ color:'#fff', fontWeight:'700', fontSize:13 },
  cardHeadSub:{ color:'rgba(255,255,255,.55)', fontSize:10, marginTop:2 },
  cardHeadSub2:{ color:'rgba(255,255,255,.6)', fontSize:10, marginTop:2 },
  rankRow:    { flexDirection:'row', alignItems:'center', padding:10,
                borderBottomWidth:1, borderColor:C.grayBorder, gap:8 },
  rankRowYo:  { backgroundColor:'rgba(0,174,195,.06)' },
  rankNum:    { width:30, fontSize:16, textAlign:'center' },
  avatar:     { width:28, height:28, borderRadius:14, backgroundColor:C.aub,
                alignItems:'center', justifyContent:'center' },
  avatarTxt:  { color:'#fff', fontSize:10, fontWeight:'700' },
  rankNom:    { fontSize:12, fontWeight:'600', color:C.grayDark },
  rankSect:   { fontSize:9, color:C.gray, marginTop:1 },
  rankPts:    { fontSize:16, fontWeight:'800', color:C.aub },
  fxRow:      { flexDirection:'row', alignItems:'center', padding:8,
                borderBottomWidth:1, borderColor:C.grayBorder, gap:6 },
  fxFecha:    { fontSize:9, color:C.gray, width:90 },
  fxL:        { flex:1, fontSize:11, fontWeight:'600', color:C.grayDark, textAlign:'right' },
  fxVs:       { fontSize:10, color:C.gray, width:36, textAlign:'center' },
  fxV:        { flex:1, fontSize:11, fontWeight:'600', color:C.grayDark },
  fxCiudad:   { fontSize:9, color:C.gray, width:70 },
  infoBanner: { backgroundColor:C.white, borderRadius:9, borderWidth:1,
                borderColor:C.grayBorder, padding:12 },
  infoTxt:    { fontSize:11, color:C.gray },
  secTitle:   { fontSize:13, fontWeight:'700', color:C.grayDark, padding:14,
                borderBottomWidth:1, borderColor:C.grayBorder },
  ptsRow:     { flexDirection:'row', alignItems:'flex-start', padding:12, gap:10,
                borderBottomWidth:1, borderColor:C.grayBorder },
  ptsVal:     { fontSize:22, fontWeight:'800', color:C.aub, width:36 },
  ptsLbl:     { fontSize:12, fontWeight:'600', color:C.grayDark },
  ptsDesc:    { fontSize:10, color:C.gray, marginTop:2 },
  reglaRow:   { borderLeftWidth:3, marginHorizontal:12, marginBottom:8,
                paddingLeft:10, paddingVertical:6, backgroundColor:C.grayLight, borderRadius:4 },
  reglaTxt:   { fontSize:11, color:C.grayDark, lineHeight:16 },
});
