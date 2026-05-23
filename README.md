# Prode AUBASA 2026 — React Native + Expo

## Stack
- React Native + Expo SDK
- Expo EAS Build (APK Android + iOS)
- SharePoint / Power Automate (backend)
- AsyncStorage (persistencia local)

## Estructura
```
src/
  screens/
    LoginScreen.jsx       ← login + registro primera vez
    PronosticosScreen.jsx ← grupos A-L, cards, botón guardar por grupo
    BonusScreen.jsx       ← campeón, finalista, goleador
    OtrasScreens.jsx      ← Historial, Posiciones, Fixture, Reglas
  data/
    fixture.js            ← 72 partidos oficiales FIFA 2026
    paises.js             ← banderas, nombres ES, códigos ISO
  services/
    flows.js              ← 6 flows Power Automate SP
  context/
    AppContext.jsx        ← estado global (usuario, pronos, bonus)
  theme/
    index.js              ← colores AUBASA + grupos
App.jsx                   ← navegación principal por tabs
app.json                  ← config Expo (package name, splash, etc.)
```

## Instalación

```bash
npm install
npm install @react-native-picker/picker
npm install expo-linear-gradient
npx expo install expo-status-bar
```

## Correr en desarrollo

```bash
npx expo start
```
Escanear QR con Expo Go en el celular.

## Generar APK Android (Expo EAS)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

El APK se descarga desde expo.dev cuando termina el build (~10 min).

## Generar para iOS (necesita Mac + Xcode)

```bash
eas build --platform ios
```
Requiere cuenta Apple Developer ($99/año).

## Conectar SharePoint

En `src/services/flows.js` reemplazar:
```js
const FL = 'https://TU_FLOW_BASE_URL/';
```
Con la URL base de los flows de Power Automate.

### 6 Flows necesarios:
| Variable | Acción |
|----------|--------|
| FU  | Verificar usuario en ProdeParticipantes |
| FP  | Leer pronósticos del usuario |
| FG  | Guardar pronóstico (POST/PATCH) |
| FR  | Leer ranking general |
| FRR | Guardar resultado real (admin) |
| FREG| Registrar usuario nuevo |

### 3 Listas SharePoint:
- `ProdeParticipantes`: Email, Nombre, Sector, Rol, Activo, Puntos_Total, Exactos
- `ProdePronosticos`: Email, Partido_ID, Goles_Local, Goles_Visit, Puntos_Obtenidos
- `ProdeResultados`: Partido_ID, GL_Real, GV_Real

## Credenciales de prueba
- Admin: `Admin` / `Aubasa2026`
- Demo:  cualquier usuario con contraseña `aubasa`

## Deployer en Netlify (versión web)
```bash
npx expo export --platform web
# Subir la carpeta dist/ a Netlify
```
