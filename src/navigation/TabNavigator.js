import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Sprout, BarChart2, List } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GardenScreen from '../screens/GardenScreen';
import InsightScreen from '../screens/InsightScreen';
import CultivateScreen from '../screens/CultivateScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.background,
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 60 + insets.bottom,
                    paddingBottom: 10 + insets.bottom,
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="Garden"
                component={GardenScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Sprout color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Insight"
                component={InsightScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Cultivate"
                component={CultivateScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
}
