import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Pencil } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

import HabitItem from '../components/Cultivate/HabitItem';
import AddItemModal from '../components/Modal/AddItemModal';

export default function CultivateScreen({ navigation }) {
    const [habits, setHabits] = useState([
        { id: 1, title: 'Morning Meditation', active: true },
        { id: 2, title: 'Drink 2L Water', active: true },
        { id: 3, title: 'No Screen Time > 9PM', active: true },
        { id: 4, title: 'Evening Stretch', active: true },
        { id: 5, title: 'Journaling', active: true },
    ]);
    const [isAddModalVisible, setAddModalVisible] = useState(false);

    const handleAddHabit = (title) => {
        const newHabit = {
            id: Date.now(), // Generate a simple unique ID
            title: title,
            active: true
        };
        setHabits([...habits, newHabit]);
    };

    const handleArchiveHabit = (id) => {
        // Handle archive logic here
        setHabits(habits.filter(habit => habit.id !== id));
    };

    const handleDeleteHabit = (id) => {
        // Handle delete logic here
        setHabits(habits.filter(habit => habit.id !== id));
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

                <FlatList
                    data={habits}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />

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
});
