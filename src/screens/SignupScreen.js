import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sprout, Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import { Svg, Path } from 'react-native-svg';
import useAuthStore from '../store/useAuthStore';
import apiClient from '../utils/apiClient';

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_WEBCLIENTID,
    scopes: ['profile', 'email'],
});

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const setUser = useAuthStore((state) => state.setUser);

    const syncUserWithBackend = async (firebaseUser) => {
        try {
            const idToken = await firebaseUser.getIdToken();
            console.log('ID Token retrieved, syncing with backend...');

            const userData = await apiClient.post('/auth/sync', { idToken });
            console.log('User Data:', userData);
            return userData;
        } catch (error) {
            console.error('Sync Error:', error);
            throw new Error(error.message || 'Sync failed');
        }
    };

    const handleSignup = async () => {
        if (!email.trim() || !password || !confirmPassword) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields' });
            return;
        }
        if (password !== confirmPassword) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const authInstance = getAuth();
            const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);

            // Sync with backend
            const userData = await syncUserWithBackend(userCredential.user);
            setUser(userData);

            Toast.show({ type: 'success', text1: 'Account Created', text2: `Signed in as @${userData.username}` });
        } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: 'Signup Failed', text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const googleSignInResult = await GoogleSignin.signIn();
            const { idToken, accessToken } = googleSignInResult.data;

            const googleCredential = GoogleAuthProvider.credential(idToken, accessToken);
            const authInstance = getAuth();
            const userCredential = await signInWithCredential(authInstance, googleCredential);

            // Sync with backend
            const userData = await syncUserWithBackend(userCredential.user);
            setUser(userData);

            Toast.show({ type: 'success', text1: 'Account Created', text2: `Signed in as @${userData.username}` });
        } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: 'Google Signup Failed', text2: error.message || 'An error occurred during Google sign up' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Sprout size={50} color={COLORS.primary} fill={COLORS.primary} />
                        </View>
                    </View>

                    <Text style={styles.title}>Start your flow.</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email address"
                            placeholderTextColor={COLORS.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.inputPassword}
                                placeholder="Password"
                                placeholderTextColor={COLORS.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20} color={COLORS.textSecondary} /> : <Eye size={20} color={COLORS.textSecondary} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputWrapper}>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.inputPassword}
                                placeholder="Confirm Password"
                                placeholderTextColor={COLORS.textSecondary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeOff size={20} color={COLORS.textSecondary} /> : <Eye size={20} color={COLORS.textSecondary} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>SIGN UP</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.googleButton]}
                        onPress={handleGoogleSignup}
                        disabled={loading}
                    >
                        <View style={styles.gLogoContainer}>
                            <Svg width="24" height="24" viewBox="0 0 24 24">
                                <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </Svg>
                        </View>
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.joinText}>Login.</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background },
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    logoContainer: { alignItems: 'center', marginBottom: 40 },
    logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F1EF', justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: COLORS.textprimary, textAlign: 'center', marginBottom: 40, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' },
    inputWrapper: { marginBottom: 16 },
    input: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, fontSize: 16, color: COLORS.textprimary },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16 },
    inputPassword: { flex: 1, paddingVertical: 16, paddingHorizontal: 20, fontSize: 16, color: COLORS.textprimary },
    eyeIcon: { padding: 16 },
    button: { paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginBottom: 16, flexDirection: 'row', justifyContent: 'center' },
    primaryButton: { backgroundColor: COLORS.textprimary, marginTop: 16, shadowColor: COLORS.textprimary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1.5 },
    googleButton: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    googleButtonText: { color: COLORS.textprimary, fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
    gLogoContainer: { marginRight: 10 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
    footerText: { color: COLORS.textSecondary, fontSize: 14 },
    joinText: { color: COLORS.textprimary, fontSize: 14, fontWeight: 'bold' }
});
