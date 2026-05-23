import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';

import { AppProvider, useApp } from './src/context/AppContext';
import LoginScreen from './src/screens/LoginScreen';
import PronosticosScreen from './src/screens/PronosticosScreen';
import BonusScreen from './src/screens/BonusScreen';
import { HistorialScreen, PosicionesScreen, FixtureScreen, ReglasScreen } from './src/screens/OtrasScreens';
import { C } from './src/theme';

const Tab = createBottomTabNavigator();

function TabIcon({ name, color, size }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function MainTabs() {
  const { usuario, darkMode } = useApp();
  const esAdmin = usuario?.rol === 'admin';

  const tabStyle = {
    tabBarActiveTintColor: C.aub,
    tabBarInactiveTintColor: C.gray,
    tabBarStyle: {
      backgroundColor: darkMode ? C.sbBg : C.white,
      borderTopColor: C.grayBorder,
      paddingBottom: 4,
      height: 58,
    },
    tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
    headerStyle: {
      backgroundColor: darkMode ? C.sbBg : C.white,
      shadowColor: 'transparent',
      elevation: 0,
      borderBottomWidth: 1,
      borderBottomColor: C.grayBorder,
    },
    headerTintColor: darkMode ? C.white : C.grayDark,
    headerTitleStyle: { fontWeight: '700', fontSize: 16 },
  };

  return (
    <Tab.Navigator screenOptions={tabStyle}>
      <Tab.Screen name="Pronósticos" component={PronosticosScreen}
        options={{ tabBarIcon: p => <TabIcon name="football" {...p} />,
                   headerTitle: 'Mis pronósticos',
                   headerSubtitle: 'Fase de grupos — Mundial 2026' }} />
      <Tab.Screen name="Bonus" component={BonusScreen}
        options={{ tabBarIcon: p => <TabIcon name="star" {...p} />,
                   headerTitle: 'Bonus torneo' }} />
      <Tab.Screen name="Historial" component={HistorialScreen}
        options={{ tabBarIcon: p => <TabIcon name="list" {...p} />,
                   headerTitle: 'Mi historial' }} />
      <Tab.Screen name="Tabla" component={PosicionesScreen}
        options={{ tabBarIcon: p => <TabIcon name="trophy" {...p} />,
                   headerTitle: 'Tabla general' }} />
      <Tab.Screen name="Fixture" component={FixtureScreen}
        options={{ tabBarIcon: p => <TabIcon name="calendar" {...p} />,
                   headerTitle: 'Fixture oficial' }} />
      <Tab.Screen name="Reglas" component={ReglasScreen}
        options={{ tabBarIcon: p => <TabIcon name="book" {...p} />,
                   headerTitle: 'Reglas' }} />
    </Tab.Navigator>
  );
}

function AppInner() {
  const { loading } = useApp();
  const [loggedIn, setLoggedIn] = useState(false);

  if (loading) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:C.aub }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <MainTabs />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
