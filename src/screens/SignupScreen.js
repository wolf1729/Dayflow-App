import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sprout, Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: '333700671123-s0udhprotaekpq7s5koq87tr374d3k21.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
});

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email.trim() || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const authInstance = getAuth();
            await createUserWithEmailAndPassword(authInstance, email, password);
        } catch (error) {
            console.error(error);
            Alert.alert("Signup Failed", error.message);
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
            await signInWithCredential(authInstance, googleCredential);

            // navigation.replace('Main');
        } catch (error) {
            console.error(error);
            Alert.alert("Google Signup Failed", "An error occurred during Google sign up");
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
                        style={[styles.button, { marginTop: 16 }]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color={COLORS.textprimary} /> : <Text style={styles.buttonText}>SIGN UP</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.googleButton]}
                        onPress={handleGoogleSignup}
                        disabled={loading}
                    >
                        <Text style={[styles.buttonText, { color: COLORS.white }]}>SIGN UP WITH GOOGLE</Text>
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
    button: { backgroundColor: 'transparent', paddingVertical: 16, borderRadius: 30, borderWidth: 1.5, borderColor: COLORS.textprimary, alignItems: 'center', marginBottom: 16 },
    googleButton: { backgroundColor: '#4285F4', borderColor: '#4285F4' },
    buttonText: { color: COLORS.textprimary, fontSize: 16, fontWeight: 'bold', letterSpacing: 1.5 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
    footerText: { color: COLORS.textSecondary, fontSize: 14 },
    joinText: { color: COLORS.textprimary, fontSize: 14, fontWeight: 'bold' }
});
