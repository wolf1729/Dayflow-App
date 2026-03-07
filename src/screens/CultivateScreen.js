import { View, Text, StyleSheet, SectionList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

import HabitItem from '../components/Cultivate/HabitItem';
import AddItemModal from '../components/Modal/AddItemModal';
import useAuthStore from '../store/useAuthStore';
import ritualService from '../services/ritualService';

export default function CultivateScreen({ navigation }) {
    const { user } = useAuthStore();
    const isFocused = useIsFocused();
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalVisible, setAddModalVisible] = useState(false);

    const fetchRituals = useCallback(async () => {
        if (!user || !user.uid) return;
        setLoading(true);
        try {
            const data = await ritualService.getRituals(user.uid);
            // Backend returns RitualModel with activeRitual, archivedRitual, deletedRitual
            // Map activeRitual to the format used in the UI
            const activeRituals = (data.activeRitual || []).map((r, index) => ({
                id: r.ritual_id, // Use unique ritual_id from backend
                title: r.name,
                isCounter: r.isCounter,
                unit: r.unit,
                group: r.group,
                active: true
            }));
            setHabits(activeRituals);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch rituals:', err);
            setError('Could not load rituals. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isFocused) {
            fetchRituals();
        }
    }, [fetchRituals, isFocused]);

    const handleAddHabit = async (habitData) => {
        if (!user || !user.uid) return;
        try {
            await ritualService.createRitual(user.uid, habitData);
            // Refresh the list after adding
            fetchRituals();
        } catch (err) {
            console.error('Failed to add ritual:', err);
            alert('Failed to add habit. Please try again.');
        }
    };

    const handleArchiveHabit = async (id) => {
        if (!user || !user.uid) return;
        try {
            await ritualService.archiveRitual(user.uid, id); // id is name
            setHabits(habits.filter(habit => habit.id !== id));
        } catch (err) {
            console.error('Failed to archive ritual:', err);
            alert('Failed to archive habit.');
        }
    };

    const handleDeleteHabit = async (id) => {
        if (!user || !user.uid) return;
        try {
            await ritualService.deleteRitual(user.uid, id); // id is name
            setHabits(habits.filter(habit => habit.id !== id));
        } catch (err) {
            console.error('Failed to delete ritual:', err);
            alert('Failed to delete habit.');
        }
    };

    const renderItem = ({ item }) => {
        return (
            <HabitItem
                item={item}
                onArchive={handleArchiveHabit}
                onDelete={handleDeleteHabit}
            />
        );
    };

    const existingCategories = [...new Set(habits.map(h => h.group).filter(Boolean))];

    // Group habits by their 'group' field
    const habitSections = habits.reduce((acc, habit) => {
        const groupName = habit.group || 'General';
        const section = acc.find(s => s.title === groupName);
        if (section) {
            section.data.push(habit);
        } else {
            acc.push({ title: groupName, data: [habit] });
        }
        return acc;
    }, []);

    const handleDeleteGroup = (groupName) => {
        if (!user || !user.uid) return;

        Alert.alert(
            "Delete Group",
            `Are you sure you want to delete all rituals in the "${groupName}" group?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await ritualService.deleteGroupRituals(user.uid, groupName);
                            // Refresh list
                            fetchRituals();
                        } catch (err) {
                            console.error('Failed to delete group:', err);
                            alert('Failed to delete group.');
                        }
                    }
                }
            ]
        );
    };

    const renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>
                        {habits.filter(h => h.group === title || (!h.group && title === 'General')).length}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.deleteGroupBtn}
                onPress={() => handleDeleteGroup(title)}
            >
                <Trash2 size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color={COLORS.textprimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Cultivate</Text>
                    <TouchableOpacity onPress={() => setAddModalVisible(true)}>
                        <Plus size={24} color={COLORS.textprimary} />
                    </TouchableOpacity>
                </View>


                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={[styles.infoText, { marginTop: 16 }]}>Loading rituals...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.center}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchRituals}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : habits.length === 0 ? (
                    <View style={styles.center}>
                        <Text style={styles.infoText}>No active rituals yet.{'\n'}Tap + to start cultivating!</Text>
                    </View>
                ) : (
                    <SectionList
                        sections={habitSections}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        renderSectionHeader={renderSectionHeader}
                        contentContainerStyle={styles.list}
                        stickySectionHeadersEnabled={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                )}

                <View style={styles.footer}>
                    <View style={styles.dragHandle} />
                    <Text style={styles.footerText}>
                        Drag to reorder your daily flow.{'\n'}Swipe left to archive or delete.
                    </Text>
                </View>

            </View>

            <AddItemModal
                isVisible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                onAdd={handleAddHabit}
                existingCategories={existingCategories}
            />
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
        paddingHorizontal: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textprimary,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    listHeaderTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.textprimary,
    },
    sectionHeader: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: COLORS.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textSecondary,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginRight: 8,
    },
    sectionBadge: {
        backgroundColor: '#F0F5F4',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    sectionBadgeText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteGroupBtn: {
        padding: 4,
    },
    list: {
        backgroundColor: COLORS.background,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.border,
        marginLeft: 24,
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
        paddingHorizontal: 40,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0EBE9',
        borderRadius: 2,
        marginBottom: 16,
    },
    footerText: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontSize: 14,
        lineHeight: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    infoText: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontSize: 16,
        lineHeight: 24,
    },
    errorText: {
        textAlign: 'center',
        color: '#D9534F',
        fontSize: 14,
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
