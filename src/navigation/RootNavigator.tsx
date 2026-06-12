import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/Home/HomeScreen';
import DownloadsQueueScreen from '../screens/Downloads/DownloadsQueueScreen';
import HistoryScreen from '../screens/History/HistoryScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import { Text, Platform, StatusBar } from 'react-native';

export type RootTabParamList = {
  Home: undefined;
  Downloads: undefined;
  History: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const RootNavigator = () => {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: 'bold',
            marginTop: 2,
          },
          tabBarIcon: ({ color, size }) => {
            let icon = '⌂';
            if (route.name === 'Downloads') icon = '⬇';
            else if (route.name === 'History') icon = '📂';
            else if (route.name === 'Settings') icon = '⚙';
            
            // Text-based icons with shadow glow on active state
            return (
              <Text 
                style={[
                  { fontSize: size + 2, color },
                  color === colors.primary && {
                    textShadowColor: colors.primary,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 6,
                  }
                ]}
              >
                {icon}
              </Text>
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Downloads" component={DownloadsQueueScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
