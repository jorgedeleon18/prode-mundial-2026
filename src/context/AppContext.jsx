import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

// Storage universal: localStorage en web, AsyncStorage en móvil
const storage = {
  getItem: async (key) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    const AS = require('@react-native-async-storage/async-storage').default;
    return AS.getItem(key);
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    const AS = require('@react-native-async-storage/async-storage').default;
    return AS.setItem(key, value);
  },
};

const AppCtx = createContext(null);

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario]     = useState(null);
  const [pronos, setPronos]       = useState({});
  const [bonus, setBonus]         = useState({ cam: '', fin: '', gol: '' });
  const [darkMode, setDarkMode]   = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    storage.getItem('darkMode').then(v => {
      if (v === '1') setDarkMode(true);
      setLoading(false);
    });
  }, []);

  const toggleDark = async () => {
    const next = !darkMode;
    setDarkMode(next);
    await storage.setItem('darkMode', next ? '1' : '0');
  };

  const totalPts = () =>
    Object.values(pronos).reduce((a, p) => a + (p.pts || 0), 0);

  const logout = async () => {
    setUsuario(null);
    setPronos({});
    setBonus({ cam: '', fin: '', gol: '' });
  };

  return (
    <AppCtx.Provider value={{
      usuario, setUsuario,
      pronos, setPronos,
      bonus, setBonus,
      darkMode, toggleDark,
      totalPts, logout, loading,
    }}>
      {children}
    </AppCtx.Provider>
  );
};

export const useApp = () => useContext(AppCtx);
