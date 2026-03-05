import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Modal, Pressable, TextInput, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Plus } from 'lucide-react-native';

import { COLORS } from '../../constants/colors';

export default function AddItemModal({ isVisible, onClose, onAdd }) {
    const insets = useSafeAreaInsets();
    const [title, setTitle] = useState('');

    const handleAdd = () => {
        if (title.trim().length > 0) {
            onAdd(title.trim());
            setTitle('');
            onClose();
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
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
                            <Text style={styles.modalTitle}>Add New Habit</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X size={24} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Morning Meditation"
                                placeholderTextColor={COLORS.textSecondary}
                                value={title}
                                onChangeText={setTitle}
                                autoFocus={true}
                                onSubmitEditing={handleAdd}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.addButton, !title.trim() && styles.addButtonDisabled]}
                            onPress={handleAdd}
                            disabled={!title.trim()}
                        >
                            <Plus size={20} color="white" />
                            <Text style={styles.addButtonText}>Add Habit</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
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
    inputContainer: {
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#F5F9F8',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: COLORS.textprimary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 16,
        justifyContent: 'center',
    },
    addButtonDisabled: {
        backgroundColor: COLORS.textSecondary,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
