import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/styles/theme';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Adicionar estilos para garantir scroll correto na web
      const style = document.createElement('style');
      style.textContent = `
        html, body, #root {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        #root > div {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        /* Força scroll em FlatList */
        [data-virtualized-list="true"] {
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f5f5f5;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <NativeBaseProvider
      theme={theme}
      colorModeManager={{
        get: async () => {
          try {
            if (Platform.OS === 'web') {
              const val = window.localStorage.getItem('@color-mode');
              return val === 'dark' ? 'dark' : 'light';
            } else {
              const val = await AsyncStorage.getItem('@color-mode');
              return val === 'dark' ? 'dark' : 'light';
            }
          } catch {
            return 'light';
          }
        },
        set: async (value: 'light' | 'dark') => {
          try {
            if (Platform.OS === 'web') {
              window.localStorage.setItem('@color-mode', value);
            } else {
              await AsyncStorage.setItem('@color-mode', value);
            }
          } catch {}
        },
      }}
    >
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}
