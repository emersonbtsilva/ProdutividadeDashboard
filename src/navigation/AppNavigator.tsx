import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Certifique-se de ter o @expo/vector-icons instalado

import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import { colors, typography } from '../styles/global';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Tarefas') {
              iconName = focused ? 'list' : 'list-outline';
            }

            // Você pode retornar qualquer componente aqui!
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.surface,
          headerTitleStyle: {
            ...typography.h2,
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Painel de Produtividade' }}
        />
        <Tab.Screen 
          name="Tarefas" 
          component={TasksScreen} 
          options={{ title: 'Gerenciador de Tarefas' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
