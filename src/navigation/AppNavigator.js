import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer fallback={<View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={COLORS.primary} /></View>}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: COLORS.background }
                }}
                initialRouteName="Login"
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Main" component={TabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
