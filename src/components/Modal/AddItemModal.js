import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Modal, Pressable, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Plus, Hash } from 'lucide-react-native';

import { COLORS } from '../../constants/colors';

export default function AddItemModal({ isVisible, onClose, onAdd, existingCategories = [] }) {
    const insets = useSafeAreaInsets();
    const [title, setTitle] = useState('');
    const [isCounter, setIsCounter] = useState(false);
    const [unit, setUnit] = useState('');
    const [group, setGroup] = useState('Health');
    const [customGroup, setCustomGroup] = useState('');
    const [showCustomGroup, setShowCustomGroup] = useState(false);

    const defaultCategories = ['Health', 'Mindfulness', 'Productivity', 'Growth'];
    const allCategories = [...new Set([...defaultCategories, ...existingCategories])];

    const handleAdd = () => {
        if (title.trim().length > 0) {
            const finalGroup = showCustomGroup ? (customGroup.trim() || 'General') : group;
            onAdd({
                title: title.trim(),
                isCounter,
                unit: isCounter ? unit.trim() : null,
                group: finalGroup
            });
            setTitle('');
            setIsCounter(false);
            setUnit('');
            setGroup('Health');
            setCustomGroup('');
            setShowCustomGroup(false);
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

                        <View style={styles.sectionLabelContainer}>
                            <Text style={styles.sectionLabel}>CATEGORY</Text>
                        </View>

                        <View style={styles.categoryContainer}>
                            {allCategories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        group === cat && !showCustomGroup && styles.categoryChipActive
                                    ]}
                                    onPress={() => {
                                        setGroup(cat);
                                        setShowCustomGroup(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        group === cat && !showCustomGroup && styles.categoryTextActive
                                    ]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={[styles.categoryChip, styles.newCategoryChip, showCustomGroup && styles.categoryChipActive]}
                                onPress={() => setShowCustomGroup(true)}
                            >
                                <Plus size={14} color={showCustomGroup ? 'white' : COLORS.textprimary} />
                                <Text style={[styles.categoryText, showCustomGroup && styles.categoryTextActive, { marginLeft: 4 }]}>New</Text>
                            </TouchableOpacity>
                        </View>

                        {showCustomGroup && (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter custom category..."
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={customGroup}
                                    onChangeText={setCustomGroup}
                                    onSubmitEditing={handleAdd}
                                />
                            </View>
                        )}

                        <View style={styles.sectionLabelContainer}>
                            <Text style={styles.sectionLabel}>TYPE</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.counterToggleContainer}
                            onPress={() => setIsCounter(!isCounter)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.checkbox, isCounter && styles.checkboxActive]}>
                                {isCounter && <Hash size={14} color={COLORS.card} />}
                            </View>
                            <Text style={styles.counterToggleText}>Track with numbers (e.g. glasses, pushups)</Text>
                        </TouchableOpacity>

                        {isCounter && (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Unit (e.g. glasses, pages, lbs)"
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={unit}
                                    onChangeText={setUnit}
                                    onSubmitEditing={handleAdd}
                                />
                            </View>
                        )}

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
    counterToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.border,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: COLORS.textprimary,
        borderColor: COLORS.textprimary,
    },
    counterToggleText: {
        fontSize: 14,
        color: COLORS.textprimary,
    },
    sectionLabelContainer: {
        marginBottom: 12,
        marginTop: 8,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textSecondary,
        letterSpacing: 1,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F9F8',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    newCategoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    categoryChipActive: {
        backgroundColor: COLORS.textprimary,
        borderColor: COLORS.textprimary,
    },
    categoryText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    categoryTextActive: {
        color: 'white',
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
