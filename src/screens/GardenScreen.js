import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserCircle, LogOut, X, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut, deleteUser } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { COLORS } from '../constants/colors';
import RitualItem from '../components/RitualItem';

export default function GardenScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [isProfileModalVisible, setProfileModalVisible] = useState(false);

    const [rituals, setRituals] = useState([
        { id: 1, title: 'Morning Meditation', subtitle: '15 mins • Mindfulness', completed: false, streak: 12 },
        { id: 2, title: 'Hydrate', subtitle: 'Drink 500ml water', completed: false, streak: 0, type: 'water' },
    ]);

    const executeLogout = async () => {
        try {
            const authInstance = getAuth();
            await signOut(authInstance);

            if (GoogleSignin.hasPreviousSignIn()) {
                await GoogleSignin.signOut();
            }

            setProfileModalVisible(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to log out");
        }
    };

    const confirmDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to permanently delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: executeDeleteAccount
                }
            ]
        );
    };

    const executeDeleteAccount = async () => {
        try {
            const authInstance = getAuth();
            const user = authInstance.currentUser;
            if (!user) {
                return;
            }

            // Optional: You could delete user-specific data from Firestore/RTDB here.

            await deleteUser(user);

            if (GoogleSignin.hasPreviousSignIn()) {
                await GoogleSignin.signOut();
            }

            setProfileModalVisible(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                    "Error",
                    "For security reasons, you must log in again before deleting your account.",
                    [
                        {
                            text: "Log Out to Re-authenticate",
                            onPress: executeLogout
                        },
                        { text: "Cancel", style: "cancel" }
                    ]
                );
            } else {
                Alert.alert("Error", "Failed to delete account. Please try again later.");
            }
        }
    };

    const [focusItems, setFocusItems] = useState([
        { id: 3, title: 'Deep Work', subtitle: '2 hours • No phone', completed: false, streak: 5 },
        { id: 4, title: 'Read 30 Pages', subtitle: 'Atomic Habits', completed: true, streak: 24 },
        { id: 5, title: 'Journaling', subtitle: 'Gratitude log', completed: true, streak: 8 },
    ]);

    const toggleRitual = (id) => {
        setRituals(items => items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    };

    const toggleFocus = (id) => {
        setFocusItems(items => items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    };

    // Date formatting (mocked for now to match design or dynamic)
    const date = new Date();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNumber = date.getDate();
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });

    // Mock calendar strip data
    const weekDays = [
        { day: 'Mon', date: 21, current: false },
        { day: 'Tue', date: 22, current: false },
        { day: 'Wed', date: 23, current: false },
        { day: 'Today', date: 24, current: true }, // Hardcoded matching the design for effect, but logic could be dynamic
        { day: 'Fri', date: 25, current: false },
    ];

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerSubtitle}>{dayName.toUpperCase()}</Text>
                        <Text style={styles.headerTitle}>{monthName} {dayNumber}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
                        <UserCircle size={40} color={COLORS.textSecondary} strokeWidth={1} />
                    </TouchableOpacity>
                </View>

                {/* Date Strip Mockup */}
                <View style={styles.dateStrip}>
                    {weekDays.map((d, index) => (
                        <View key={index} style={[styles.dateItem, d.current && styles.dateItemActive]}>
                            <Text style={[styles.stripDay, d.current && styles.stripDayActive]}>{d.day}</Text>
                            <Text style={[styles.stripDate, d.current && styles.stripDateActive]}>{d.date}</Text>
                            {d.current && <View style={styles.activeDot} />}
                        </View>
                    ))}
                </View>

                {/* Morning Rituals */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>MORNING RITUALS</Text>
                    <View style={styles.separator} />
                </View>

                <View style={styles.listContainer}>
                    {rituals.map(item => (
                        <RitualItem
                            key={item.id}
                            {...item}
                            onToggle={() => toggleRitual(item.id)}
                        />
                    ))}
                </View>

                {/* Focus & Growth */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>FOCUS & GROWTH</Text>
                    <View style={styles.separator} />
                </View>

                <View style={styles.listContainer}>
                    {focusItems.map(item => (
                        <RitualItem
                            key={item.id}
                            {...item}
                            onToggle={() => toggleFocus(item.id)}
                        />
                    ))}
                </View>

            </ScrollView>

            {/* Profile Modal */}
            <Modal
                visible={isProfileModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setProfileModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setProfileModalVisible(false)}>
                    <Pressable
                        style={[
                            styles.modalContent,
                            { paddingBottom: Math.max(insets.bottom + 24, Platform.OS === 'ios' ? 40 : 24) }
                        ]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Profile</Text>
                            <TouchableOpacity onPress={() => setProfileModalVisible(false)} style={styles.closeButton}>
                                <X size={24} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profileInfoContainer}>
                            <UserCircle size={64} color={COLORS.primary} strokeWidth={1.5} />
                            <Text style={styles.profileName}>Dayflow User</Text>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.logoutButton} onPress={executeLogout}>
                                <LogOut size={20} color="#FF3B30" />
                                <Text style={styles.logoutButtonText}>Log out</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.deleteButton} onPress={confirmDeleteAccount}>
                                <Trash2 size={20} color="#FF3B30" />
                                <Text style={styles.deleteButtonText}>Delete account</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        padding: 24,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.textprimary,
    },
    dateStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    dateItem: {
        alignItems: 'center',
        paddingVertical: 12,
        width: 60, // Fixed width for alignment
    },
    dateItemActive: {
        backgroundColor: COLORS.card,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: COLORS.textprimary,
    },
    stripDay: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    stripDayActive: {
        color: COLORS.textprimary,
        fontWeight: '600',
    },
    stripDate: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
    },
    stripDateActive: {
        color: COLORS.textprimary,
    },
    activeDot: {
        width: 4,
        height: 4,
        marginTop: 4,
        borderRadius: 2,
        backgroundColor: COLORS.textprimary,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
        letterSpacing: 1,
        fontWeight: '600',
        marginRight: 16,
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0EBE9',
    },
    listContainer: {
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textprimary,
    },
    closeButton: {
        padding: 4,
    },
    profileInfoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    profileName: {
        marginTop: 12,
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textprimary,
    },
    modalActions: {
        gap: 12, // Space between action buttons
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F0',
        padding: 16,
        borderRadius: 16,
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    deleteButtonText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
