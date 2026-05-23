import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useApp } from '../context/AppContext';
import { guardarBonus } from '../services/flows';
import { SELECCIONES } from '../data/paises';
import { C } from '../theme';

export default function BonusScreen() {
  const { bonus, setBonus, pronos, usuario } = useApp();
  const locked = Object.keys(pronos).length > 0;
  const [guardando, setG] = useState(false);

  const handleGuardar = async () => {
    if (!bonus.cam || !bonus.fin) {
      Alert.alert('Completá campeón y finalista antes de guardar.');
      return;
    }
    setG(true);
    try {
      await guardarBonus(usuario.email, bonus);
      Alert.alert('✅ Bonus guardados', 'Tus predicciones bonus fueron guardadas.');
    } catch {
      Alert.alert('Guardado localmente', 'Sin conexión — se sincronizará luego.');
    }
    setG(false);
  };

  const BonusItem = ({ icon, pts, titulo, desc, campo, esTexto }) => (
    <View style={s.bi}>
      <View style={s.biPts}>
        <Text style={s.biPtsNum}>+{pts}</Text>
        <Text style={s.biPtsSub}>pts</Text>
      </View>
      <View style={{ flex:1 }}>
        <Text style={s.biTitle}>{icon} {titulo}</Text>
        <Text style={s.biDesc}>{desc}</Text>
        {locked && <View style={s.lockedBadge}><Text style={s.lockedTxt}>🔒 Cerrado</Text></View>}
      </View>
      {esTexto ? (
        <TextInput
          style={[s.input, locked && s.inputDis]}
          placeholder="Nombre del jugador..."
          placeholderTextColor={C.gray}
          editable={!locked}
          value={bonus[campo]}
          onChangeText={v => setBonus(prev => ({ ...prev, [campo]: v }))}
        />
      ) : (
        <View style={[s.pickerWrap, locked && s.inputDis]}>
          <Picker
            selectedValue={bonus[campo]}
            enabled={!locked}
            onValueChange={v => setBonus(prev => ({ ...prev, [campo]: v }))}
            style={s.picker}
          >
            <Picker.Item label="— Seleccioná —" value="" />
            {SELECCIONES.map(sel => (
              <Picker.Item key={sel} label={sel} value={sel} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={{ flex:1, backgroundColor:C.bg }} contentContainerStyle={s.scroll}>
      <View style={s.card}>
        <View style={s.header}>
          <Text style={s.headerTitle}>🌟 Predicciones bonus</Text>
          <Text style={s.headerSub}>Se cierran al inicio del torneo · No se pueden cambiar</Text>
        </View>

        <BonusItem icon="🏆" pts={10} titulo="Campeón del Mundial"
          desc="¿Qué selección levantará la copa?" campo="cam" />
        <BonusItem icon="🥈" pts={5} titulo="Selección finalista"
          desc="¿Quién llegará a la final pero no ganará?" campo="fin" />
        <BonusItem icon="⚽" pts={5} titulo="Goleador del torneo"
          desc="¿Quién marcará más goles en todo el Mundial?" campo="gol" esTexto />

        {!locked && (
          <TouchableOpacity style={s.btnGuardar} onPress={handleGuardar} disabled={guardando}>
            {guardando
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnTxt}>💾 Guardar predicciones bonus</Text>
            }
          </TouchableOpacity>
        )}
      </View>

      <View style={s.nota}>
        <Text style={s.notaTxt}>
          ⚠️ Las predicciones bonus deben hacerse <Text style={{fontWeight:'700'}}>antes del primer partido</Text> (11 de junio de 2026). Una vez que empieza el torneo se bloquean automáticamente. Los puntos bonus se suman al ranking general al finalizar el torneo.
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll:     { padding:14, gap:12 },
  card:       { backgroundColor:C.white, borderRadius:12, borderWidth:1,
                borderColor:C.grayBorder, overflow:'hidden' },
  header:     { backgroundColor:'#ca8a04', padding:14 },
  headerTitle:{ color:'#fff', fontSize:14, fontWeight:'700' },
  headerSub:  { color:'rgba(255,255,255,.7)', fontSize:10, marginTop:2 },
  bi:         { padding:14, borderBottomWidth:1, borderColor:C.grayBorder, gap:8 },
  biPts:      { alignItems:'center', width:42 },
  biPtsNum:   { fontSize:22, fontWeight:'800', color:'#ca8a04' },
  biPtsSub:   { fontSize:8, color:C.gray, fontWeight:'600' },
  biTitle:    { fontSize:13, fontWeight:'600', color:C.grayDark },
  biDesc:     { fontSize:10, color:C.gray, marginTop:2 },
  lockedBadge:{ backgroundColor:C.rojoLight, borderRadius:5, paddingHorizontal:7,
                paddingVertical:2, alignSelf:'flex-start', marginTop:4 },
  lockedTxt:  { fontSize:9, color:C.rojoDark, fontWeight:'700' },
  input:      { borderWidth:1.5, borderColor:C.grayBorder, borderRadius:7,
                paddingHorizontal:10, paddingVertical:8, fontSize:12,
                color:C.grayDark, marginTop:6 },
  inputDis:   { opacity:.4, backgroundColor:C.grayLight },
  pickerWrap: { borderWidth:1.5, borderColor:C.grayBorder, borderRadius:7,
                marginTop:6, overflow:'hidden' },
  picker:     { height:44 },
  btnGuardar: { margin:14, backgroundColor:C.aub, borderRadius:10,
                paddingVertical:13, alignItems:'center' },
  btnTxt:     { color:'#fff', fontSize:13, fontWeight:'800' },
  nota:       { backgroundColor:C.white, borderRadius:10, borderWidth:1,
                borderColor:C.grayBorder, padding:14 },
  notaTxt:    { fontSize:12, color:C.gray, lineHeight:18 },
});
