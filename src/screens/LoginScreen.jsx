import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { verificarUsuario } from '../services/flows';
import { C } from '../theme';

const ADMINS = {
  admin: { pass: 'Aubasa2026', nombre: 'Administrador', sector: 'Sistemas', rol: 'admin' },
  prode: { pass: 'Mundial2026', nombre: 'Organizador',  sector: 'Sistemas', rol: 'admin' },
};

export default function LoginScreen({ onLogin }) {
  const { setUsuario } = useApp();
  const [usuario, setU]  = useState('');
  const [pass, setP]     = useState('');
  const [loading, setL]  = useState(false);
  const [showReg, setReg] = useState(false);
  const [nombre, setN]   = useState('');
  const [apellido, setA] = useState('');
  const [sector, setSect] = useState('');

  const SECTORES = [
    'Sistemas','Técnicos IT','Técnicos','Comercial','Administración',
    'Tesorería','RRHH','Maestranza','Operaciones','Gerencia','Legales','Otro',
  ];

  const handleLogin = async () => {
    const u = usuario.trim().toLowerCase();
    const p = pass;
    if (!u || !p) { Alert.alert('Completá usuario y contraseña'); return; }
    setL(true);
    try {
      // 1. Admin local
      const adm = ADMINS[u];
      if (adm && p === adm.pass) {
        const usr = {
          email: u + '@aubasa.com.ar',
          nombre: adm.nombre, sector: adm.sector,
          inits: adm.nombre.slice(0,2).toUpperCase(),
          rol: 'admin', nuevo: false,
        };
        setUsuario(usr);
        onLogin(usr);
        return;
      }
      // 2. Intentar SP
      try {
        const emp = await verificarUsuario(u.includes('@') ? u : u + '@aubasa.com.ar');
        if (emp) {
          const usr = {
            email: (emp.Email||'').toLowerCase(),
            nombre: emp.Nombre || u,
            sector: emp.Sector || '',
            inits: (emp.Nombre || u).slice(0,2).toUpperCase(),
            rol: (emp.Rol||'user').toLowerCase(),
            nuevo: false,
          };
          setUsuario(usr);
          onLogin(usr);
          return;
        }
      } catch {}
      // 3. Demo
      const demoPass = ['aubasa','aubasa2026','demo','test'];
      if (['demo','test','prode'].includes(u) || demoPass.includes(p.toLowerCase())) {
        setReg(true);
        return;
      }
      Alert.alert('Usuario no encontrado', 'Usá tu cuenta corporativa o contactá al admin.');
    } finally {
      setL(false);
    }
  };

  const handleRegistro = () => {
    if (!nombre || !apellido) { Alert.alert('Ingresá nombre y apellido'); return; }
    if (!sector) { Alert.alert('Seleccioná tu sector'); return; }
    const u = usuario.trim().toLowerCase();
    const nom = apellido + ', ' + nombre;
    const usr = {
      email: u + '@aubasa.com.ar',
      nombre: nom, sector,
      inits: (apellido[0] + nombre[0]).toUpperCase(),
      rol: 'user', nuevo: false,
    };
    setUsuario(usr);
    onLogin(usr);
  };

  if (showReg) {
    return (
      <View style={s.regWrap}>
        <Text style={s.regTitle}>👋 ¡Bienvenido!</Text>
        <Text style={s.regSub}>Primera vez. Completá tu perfil.</Text>
        <TextInput style={s.input} placeholder="Nombre" value={nombre} onChangeText={setN} />
        <TextInput style={s.input} placeholder="Apellido" value={apellido} onChangeText={setA} />
        <Text style={s.sectLabel}>Sector</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {SECTORES.map(sec => (
            <TouchableOpacity
              key={sec}
              style={[s.sectChip, sector===sec && s.sectChipActive]}
              onPress={() => setSect(sec)}
            >
              <Text style={[s.sectChipTxt, sector===sec && s.sectChipTxtActive]}>{sec}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={s.btnMain} onPress={handleRegistro}>
          <Text style={s.btnMainTxt}>⚽ ¡Empezar a jugar!</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#00AEC3', '#ffffff', '#00AEC3']}
      locations={[0, 0.5, 1]}
      style={s.bg}
    >
      <View style={s.overlay} />
      <View style={s.card}>
        {/* Logo AUBASA */}
        <View style={s.logoWrap}>
          <Text style={s.logoText}>AUBASA</Text>
          <Text style={s.logoSub}>AUTOPISTAS DE BUENOS AIRES S.A.</Text>
        </View>

        <Text style={s.ball}>⚽</Text>
        <Text style={s.badge}>🇦🇷 Prode Mundial 2026</Text>
        <Text style={s.title}>TORNEO INTERNO</Text>
        <Text style={s.sub}>USA · CAN · MEX · Ingresá y cargá tus pronósticos</Text>

        <View style={s.divider} />

        <TextInput
          style={s.field}
          placeholder="Usuario"
          placeholderTextColor="rgba(255,255,255,.4)"
          value={usuario}
          onChangeText={setU}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={s.field}
          placeholder="Contraseña"
          placeholderTextColor="rgba(255,255,255,.4)"
          value={pass}
          onChangeText={setP}
          secureTextEntry
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity style={s.btnLogin} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnLoginTxt}>Ingresar</Text>
          }
        </TouchableOpacity>

        <Text style={s.hint}>
          Solo cuentas @aubasa.com.ar{'\n'}
          <Text style={{ fontWeight: '700', color: 'rgba(255,255,255,.65)' }}>
            Admin: Admin / Aubasa2026
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  bg:       { flex:1, justifyContent:'center', alignItems:'center' },
  overlay:  { ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(0,45,64,.58)' },
  card:     { width:'90%', maxWidth:400, backgroundColor:'rgba(255,255,255,.12)',
              borderWidth:1, borderColor:'rgba(255,255,255,.22)', borderRadius:20,
              padding:28, alignItems:'center',
              shadowColor:'#000', shadowOpacity:.35, shadowRadius:20, elevation:12 },
  logoWrap: { alignItems:'center', marginBottom:12 },
  logoText: { fontFamily:Platform.OS==='ios'?'System':'sans-serif-black',
              fontSize:36, fontWeight:'900', color:'#fff', letterSpacing:2 },
  logoSub:  { fontSize:9, color:'rgba(255,255,255,.6)', letterSpacing:2.5,
              textTransform:'uppercase', marginTop:2 },
  ball:     { fontSize:36, marginBottom:6 },
  badge:    { fontSize:11, color:'rgba(255,255,255,.8)', backgroundColor:'rgba(255,255,255,.14)',
              paddingHorizontal:14, paddingVertical:5, borderRadius:20,
              borderWidth:1, borderColor:'rgba(255,255,255,.2)', marginBottom:10 },
  title:    { fontSize:20, fontWeight:'800', color:'#fff', letterSpacing:1, marginBottom:3 },
  sub:      { fontSize:11, color:'rgba(255,255,255,.52)', marginBottom:16, textAlign:'center' },
  divider:  { width:'100%', height:1, backgroundColor:'rgba(255,255,255,.15)', marginBottom:14 },
  field:    { width:'100%', borderWidth:1, borderColor:'rgba(255,255,255,.18)',
              borderRadius:8, paddingHorizontal:12, paddingVertical:10,
              color:'#fff', fontSize:13, marginBottom:9,
              backgroundColor:'rgba(255,255,255,.08)' },
  btnLogin: { width:'100%', backgroundColor:'rgba(255,255,255,.2)', borderRadius:9,
              paddingVertical:12, alignItems:'center', marginTop:4 },
  btnLoginTxt:{ color:'#fff', fontSize:14, fontWeight:'700' },
  hint:     { fontSize:10, color:'rgba(255,255,255,.3)', marginTop:14, textAlign:'center' },
  // Registro
  regWrap:  { flex:1, backgroundColor:'#fff', padding:24, justifyContent:'center' },
  regTitle: { fontSize:22, fontWeight:'800', color:C.aubDarker, marginBottom:4 },
  regSub:   { fontSize:13, color:C.gray, marginBottom:20 },
  input:    { borderWidth:1.5, borderColor:C.grayBorder, borderRadius:8, padding:10,
              fontSize:13, marginBottom:12 },
  sectLabel:{ fontSize:11, fontWeight:'700', color:C.gray, marginBottom:8,
              textTransform:'uppercase', letterSpacing:.5 },
  sectChip: { paddingHorizontal:14, paddingVertical:7, borderRadius:20,
              borderWidth:1, borderColor:C.grayBorder, marginRight:8,
              backgroundColor:C.grayLight },
  sectChipActive:   { backgroundColor:C.aub, borderColor:C.aub },
  sectChipTxt:      { fontSize:12, color:C.grayDark },
  sectChipTxtActive:{ color:'#fff', fontWeight:'700' },
  btnMain:  { backgroundColor:C.aub, borderRadius:10, paddingVertical:13,
              alignItems:'center', marginTop:8 },
  btnMainTxt:{ color:'#fff', fontSize:15, fontWeight:'800' },
});
