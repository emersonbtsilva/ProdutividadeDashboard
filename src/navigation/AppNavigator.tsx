import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import LoginScreen from '../screens/LoginScreen';
import { colors, typography } from '../styles/global';
import { useAuth } from '../context/AuthContext';
import { Pressable, Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  const { signOut } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tarefas') {
            iconName = focused ? 'list' : 'list-outline';
          }
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
        headerRight: () => (
          <Pressable onPress={signOut} style={{ paddingHorizontal: 12 }}>
            <Ionicons name="log-out-outline" size={22} color={colors.surface} />
          </Pressable>
        ),
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
  );
}

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
