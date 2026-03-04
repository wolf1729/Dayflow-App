import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserCircle, LogOut, X, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut, deleteUser } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';

import { COLORS } from '../../constants/colors';

export default function ProfileModal({ isVisible, onClose }) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const executeLogout = async () => {
        try {
            const authInstance = getAuth();
            await signOut(authInstance);

            if (GoogleSignin.hasPreviousSignIn()) {
                await GoogleSignin.signOut();
            }

            onClose();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to log out' });
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

            onClose();
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
                Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete account. Please try again later.' });
            }
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable
                    style={[
                        styles.modalContent,
                        { paddingBottom: Math.max(insets.bottom + 24, Platform.OS === 'ios' ? 40 : 24) }
                    ]}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Profile</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
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
    );
}

const styles = StyleSheet.create({
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
