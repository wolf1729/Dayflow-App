import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Sprout, Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

                    <Text style={styles.title}>Resume your flow.</Text>

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
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ?
                                    <EyeOff size={20} color={COLORS.textSecondary} /> :
                                    <Eye size={20} color={COLORS.textSecondary} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.forgotContainer}>
                        <TouchableOpacity>
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.replace('Main')}
                    >
                        <Text style={styles.buttonText}>ENTER</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity>
                            <Text style={styles.joinText}>Join.</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F1EF', // Slightly darker circle bg
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textprimary,
        textAlign: 'center',
        marginBottom: 40,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    },
    inputWrapper: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        color: COLORS.textprimary,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
    },
    inputPassword: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        color: COLORS.textprimary,
    },
    eyeIcon: {
        padding: 16,
    },
    forgotContainer: {
        alignItems: 'flex-end',
        marginBottom: 32,
    },
    forgotPasswordText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    button: {
        backgroundColor: 'transparent',
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: COLORS.textprimary,
        alignItems: 'center',
        marginBottom: 40,
    },
    buttonText: {
        color: COLORS.textprimary,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    joinText: {
        color: COLORS.textprimary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
