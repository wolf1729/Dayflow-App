import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Pencil } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

import HabitItem from '../components/Cultivate/HabitItem';
import AddItemModal from '../components/Modal/AddItemModal';
import useAuthStore from '../store/useAuthStore';
import ritualService from '../services/ritualService';

export default function CultivateScreen({ navigation }) {
    const { user } = useAuthStore();
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
                id: r.name, // Use name as ID for consistency with backend patches
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
        fetchRituals();
    }, [fetchRituals]);

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

                <View style={styles.listHeader}>
                    <Text style={styles.listHeaderTitle}>Morning Rituals</Text>
                    <Pencil size={16} color={COLORS.textSecondary} />
                </View>

                {loading ? (
                    <View style={styles.center}>
                        <Text style={styles.infoText}>Loading rituals...</Text>
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
                    <FlatList
                        data={habits}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
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
