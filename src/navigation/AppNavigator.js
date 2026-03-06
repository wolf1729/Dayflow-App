import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import TabNavigator from './TabNavigator';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';
import useAuthStore from '../store/useAuthStore';
import auth from '@react-native-firebase/auth';
import { useEffect } from 'react';

const Stack = createStackNavigator();

export default function AppNavigator() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasHydrated = useAuthStore((state) => state._hasHydrated);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
            if (!firebaseUser && isAuthenticated) {
                // Firebase says no user, but store says authenticated
                logout();
            }
        });
        return unsubscribe;
    }, [isAuthenticated, logout]);

    if (!hasHydrated) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={COLORS.primary} size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer fallback={<View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={COLORS.primary} /></View>}>
            <Stack.Navigator
                initialRouteName={isAuthenticated ? "Main" : "Login"}
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: COLORS.background }
                }}
            >
                {isAuthenticated ? (
                    <Stack.Screen name="Main" component={TabNavigator} />
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
