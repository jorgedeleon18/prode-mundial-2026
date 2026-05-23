import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator, Image,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { GRUPOS, TODOS, estaAbierto, estaFinalizado, calcPts, fechaCorta, cierreStr } from '../data/fixture';
import { fn, flagUrl } from '../data/paises';
import { guardarProno } from '../services/flows';
import { C, GCOL } from '../theme';

function Bandera({ pais, size=38 }) {
  const url = flagUrl(pais, 80);
  const [err, setErr] = useState(false);
  if (!url || err) return <Text style={{ fontSize: size*0.75 }}>🌍</Text>;
  return <Image source={{ uri: url }} style={{ width:size, height:size, borderRadius:size/2 }} onError={() => setErr(true)} />;
}

function PartidoCard({ partido, prono, onChangeGoles }) {
  const fin = estaFinalizado(partido);
  const ab  = estaAbierto(partido);
  const cerrado = !ab && !fin;
  const gc = GCOL[partido.id[0]] || ['#022D40','#024560'];

  let pts = null;
  if (fin && prono?.gL !== undefined && prono?.gL !== '') {
    pts = calcPts(partido, prono);
  }

  return (
    <View style={s.card}>
      {/* Header */}
      <View style={[s.cardHead, { backgroundColor: gc[0] }]}>
        <Text style={s.cardHeadGrp}>Grupo {partido.id[0]}</Text>
        <Text style={s.cardHeadFecha}>⏰ {partido.hora}  {fechaCorta(partido.fecha)}</Text>
        <Text style={s.cardHeadCiudad}>📍 {partido.ciudad}</Text>
      </View>

      {/* Equipos */}
      <View style={s.matchRow}>
        <View style={s.team}>
          <Bandera pais={partido.l} />
          <Text style={s.teamName} numberOfLines={1}>{fn(partido.l)}</Text>
        </View>

        <View style={s.vs}>
          {fin ? (
            <View style={s.scoreWrap}>
              <Text style={s.scoreBox}>{partido.gl}</Text>
              <Text style={s.scoreSep}>–</Text>
              <Text style={s.scoreBox}>{partido.gv}</Text>
            </View>
          ) : (
            <Text style={s.vsText}>VS</Text>
          )}
          <View style={[s.badge,
            fin ? s.badgeFin : cerrado ? s.badgeCerr : s.badgePend]}>
            <Text style={[s.badgeTxt,
              fin ? s.badgeFinTxt : cerrado ? s.badgeCerrTxt : s.badgePendTxt]}>
              {fin ? '✓ Finalizado' : cerrado ? '⛔ Cerrado' : '⏳ Abierto'}
            </Text>
          </View>
        </View>

        <View style={[s.team, s.teamRight]}>
          <Bandera pais={partido.v} />
          <Text style={s.teamName} numberOfLines={1}>{fn(partido.v)}</Text>
        </View>
      </View>

      {/* Pronóstico */}
      <View style={s.pronoRow}>
        <Text style={s.pronoLbl}>Resultado:</Text>
        <TextInput
          style={[s.golesInput, (cerrado||fin) && s.inputDis]}
          keyboardType="numeric"
          maxLength={2}
          editable={!cerrado && !fin}
          value={prono?.gL?.toString() ?? ''}
          onChangeText={v => onChangeGoles(partido.id, 'gL', v)}
          placeholder="–"
          placeholderTextColor={C.gray}
        />
        <Text style={s.guion}>–</Text>
        <TextInput
          style={[s.golesInput, (cerrado||fin) && s.inputDis]}
          keyboardType="numeric"
          maxLength={2}
          editable={!cerrado && !fin}
          value={prono?.gV?.toString() ?? ''}
          onChangeText={v => onChangeGoles(partido.id, 'gV', v)}
          placeholder="–"
          placeholderTextColor={C.gray}
        />
        {cerrado && !fin && (
          <Text style={s.cierreMsg} numberOfLines={1}>
            ⛔ {cierreStr(partido)}
          </Text>
        )}
        {fin && prono?.gL !== undefined && prono?.gL !== '' && (
          <Text style={s.miProde}>Tu prode: {prono.gL}–{prono.gV}</Text>
        )}
      </View>

      {/* Puntos obtenidos */}
      {pts && (
        <View style={[s.ptsBadge, pts.pts===5 ? s.ptsBadge5 : pts.pts===3 ? s.ptsBadge3 : pts.pts===1 ? s.ptsBadge1 : s.ptsBadge0]}>
          <Text style={s.ptsBadgeTxt}>+{pts.pts} pts · {pts.lbl}</Text>
        </View>
      )}
    </View>
  );
}

export default function PronosticosScreen() {
  const { pronos, setPronos, usuario } = useApp();
  const [grupoActivo, setGrupo] = useState('A');
  const [guardando, setGuardando] = useState(false);

  const grupo = GRUPOS[grupoActivo];
  const gc = GCOL[grupoActivo] || ['#022D40','#024560'];

  const handleGoles = (id, campo, valor) => {
    setPronos(prev => ({
      ...prev,
      [id]: { ...(prev[id]||{}), [campo]: valor === '' ? '' : parseInt(valor)||0 },
    }));
  };

  const partAbiertos = grupo.partidos.filter(p => estaAbierto(p) && !estaFinalizado(p));
  const completados  = partAbiertos.filter(p => {
    const pr = pronos[p.id];
    return pr?.gL !== undefined && pr?.gL !== '' && pr?.gV !== undefined && pr?.gV !== '';
  });

  const handleGuardarGrupo = async () => {
    if (completados.length === 0) {
      Alert.alert('Sin datos', 'Completá al menos un partido antes de guardar.');
      return;
    }
    setGuardando(true);
    let ok = true;
    for (const p of completados) {
      const pr = pronos[p.id];
      try {
        await guardarProno(usuario.email, p.id, pr.gL, pr.gV, pr.spId || null);
      } catch {
        ok = false;
      }
    }
    setGuardando(false);
    if (ok) {
      Alert.alert('✅ Guardado', `${completados.length} pronóstico(s) del Grupo ${grupoActivo} guardados.`);
    } else {
      Alert.alert('Guardado localmente', 'Sin conexión — se guardará cuando haya red.');
    }
  };

  return (
    <View style={{ flex:1, backgroundColor: C.bg }}>
      {/* Tabs grupos */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={s.tabsScroll} contentContainerStyle={s.tabsContent}
      >
        {Object.keys(GRUPOS).map(g => (
          <TouchableOpacity
            key={g}
            style={[s.tab, grupoActivo===g && { backgroundColor: GCOL[g][0], borderColor: GCOL[g][0] }]}
            onPress={() => setGrupo(g)}
          >
            <Text style={[s.tabTxt, grupoActivo===g && s.tabTxtActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={s.scroll}>
        {grupo.partidos.map(p => (
          <PartidoCard
            key={p.id}
            partido={p}
            prono={pronos[p.id]}
            onChangeGoles={handleGoles}
          />
        ))}

        {/* Botón guardar grupo */}
        {partAbiertos.length > 0 && (
          <View style={s.guardarWrap}>
            {/* Progress dots */}
            <View style={s.progressRow}>
              <Text style={s.progressLbl}>Partidos completados</Text>
              <View style={s.dotsRow}>
                {partAbiertos.map(p => {
                  const pr = pronos[p.id];
                  const ok = pr?.gL !== undefined && pr?.gL !== '' && pr?.gV !== undefined && pr?.gV !== '';
                  return <View key={p.id} style={[s.dot, ok && s.dotOk]} />;
                })}
              </View>
              <Text style={s.progressCount}>{completados.length}/{partAbiertos.length}</Text>
            </View>

            <TouchableOpacity
              style={[s.btnGuardar, completados.length === 0 && s.btnGuardarDis,
                completados.length === partAbiertos.length && completados.length > 0 && s.btnGuardarFull]}
              onPress={handleGuardarGrupo}
              disabled={guardando || completados.length === 0}
            >
              {guardando
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.btnGuardarTxt}>
                    {completados.length === partAbiertos.length && completados.length > 0
                      ? `✅ Guardar Grupo ${grupoActivo} completo`
                      : `⚽ Guardar Grupo ${grupoActivo} (${completados.length}/${partAbiertos.length})`
                    }
                  </Text>
              }
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  tabsScroll:   { maxHeight:52, backgroundColor:C.white, borderBottomWidth:1, borderColor:C.grayBorder },
  tabsContent:  { paddingHorizontal:12, paddingVertical:8, gap:6, flexDirection:'row' },
  tab:          { paddingHorizontal:14, paddingVertical:6, borderRadius:18,
                  borderWidth:1, borderColor:C.grayBorder, backgroundColor:C.white },
  tabTxt:       { fontSize:12, fontWeight:'700', color:C.grayDark },
  tabTxtActive: { color:'#fff' },
  scroll:       { padding:12, gap:10 },
  card:         { backgroundColor:C.white, borderRadius:10, borderWidth:1,
                  borderColor:C.grayBorder, overflow:'hidden',
                  shadowColor:'#000', shadowOpacity:.06, shadowRadius:6, elevation:2 },
  cardHead:     { flexDirection:'row', alignItems:'center', padding:8, gap:8 },
  cardHeadGrp:  { color:'#fff', fontWeight:'800', fontSize:11 },
  cardHeadFecha:{ color:'rgba(255,255,255,.9)', fontWeight:'700', fontSize:10, flex:1 },
  cardHeadCiudad:{ color:'rgba(255,255,255,.55)', fontSize:9 },
  matchRow:     { flexDirection:'row', alignItems:'center', paddingHorizontal:14,
                  paddingVertical:12 },
  team:         { flex:1, alignItems:'center', gap:5 },
  teamRight:    { alignItems:'center' },
  teamName:     { fontSize:12, fontWeight:'700', color:C.grayDark, textAlign:'center' },
  vs:           { alignItems:'center', gap:4, paddingHorizontal:8, minWidth:90 },
  vsText:       { fontSize:10, fontWeight:'800', color:C.gray, letterSpacing:2 },
  scoreWrap:    { flexDirection:'row', alignItems:'center', gap:4 },
  scoreBox:     { fontSize:20, fontWeight:'800', color:C.grayDark,
                  backgroundColor:C.grayLight, borderRadius:6, width:34, height:34,
                  textAlign:'center', lineHeight:34 },
  scoreSep:     { fontSize:16, fontWeight:'800', color:C.gray },
  badge:        { paddingHorizontal:8, paddingVertical:2, borderRadius:8 },
  badgePend:    { backgroundColor:C.amberLight },
  badgeCerr:    { backgroundColor:C.rojoLight },
  badgeFin:     { backgroundColor:C.aubLight },
  badgeTxt:     { fontSize:8, fontWeight:'700', textTransform:'uppercase' },
  badgePendTxt: { color:C.amberDark },
  badgeCerrTxt: { color:C.rojoDark },
  badgeFinTxt:  { color:C.aubDarker },
  pronoRow:     { flexDirection:'row', alignItems:'center', paddingHorizontal:14,
                  paddingBottom:10, gap:7, borderTopWidth:1, borderColor:C.grayBorder,
                  paddingTop:8, flexWrap:'wrap' },
  pronoLbl:     { fontSize:9, fontWeight:'700', color:C.gray, textTransform:'uppercase' },
  golesInput:   { width:38, height:30, borderWidth:1.5, borderColor:C.grayBorder,
                  borderRadius:6, textAlign:'center', fontSize:14, fontWeight:'700',
                  color:C.grayDark },
  inputDis:     { opacity:.38, backgroundColor:C.grayLight },
  guion:        { fontSize:14, fontWeight:'800', color:C.gray },
  cierreMsg:    { flex:1, fontSize:9, color:C.rojoDark, fontWeight:'600' },
  miProde:      { flex:1, fontSize:10, color:C.gray },
  ptsBadge:     { margin:10, marginTop:0, paddingHorizontal:10, paddingVertical:4,
                  borderRadius:8, alignSelf:'flex-start' },
  ptsBadge5:    { backgroundColor:C.oroLight },
  ptsBadge3:    { backgroundColor:C.verdeLight },
  ptsBadge1:    { backgroundColor:C.aubLight },
  ptsBadge0:    { backgroundColor:C.grayLight },
  ptsBadgeTxt:  { fontSize:10, fontWeight:'700', color:C.grayDark },
  guardarWrap:  { marginTop:8, gap:10 },
  progressRow:  { flexDirection:'row', alignItems:'center', backgroundColor:C.white,
                  borderRadius:9, borderWidth:1, borderColor:C.grayBorder,
                  padding:12, gap:10 },
  progressLbl:  { fontSize:11, color:C.gray, fontWeight:'600', flex:1 },
  dotsRow:      { flexDirection:'row', gap:5 },
  dot:          { width:10, height:10, borderRadius:5, backgroundColor:C.grayBorder },
  dotOk:        { backgroundColor:C.verde },
  progressCount:{ fontSize:13, fontWeight:'800', color:C.aub },
  btnGuardar:   { borderRadius:12, paddingVertical:15, alignItems:'center',
                  backgroundColor:C.aub,
                  shadowColor:C.aub, shadowOpacity:.4, shadowRadius:10, elevation:5 },
  btnGuardarDis:{ backgroundColor:C.grayBorder, shadowOpacity:0, elevation:0 },
  btnGuardarFull:{ backgroundColor:C.verde },
  btnGuardarTxt:{ color:'#fff', fontSize:14, fontWeight:'800', letterSpacing:.3 },
});
