import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppCtx = createContext(null);

export const AppProvider = ({ children }) => {
  const [usuario, setUsuario]     = useState(null);
  const [pronos, setPronos]       = useState({});
  const [bonus, setBonus]         = useState({ cam: '', fin: '', gol: '' });
  const [darkMode, setDarkMode]   = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('darkMode').then(v => {
      if (v === '1') setDarkMode(true);
      setLoading(false);
    });
  }, []);

  const toggleDark = async () => {
    const next = !darkMode;
    setDarkMode(next);
    await AsyncStorage.setItem('darkMode', next ? '1' : '0');
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
