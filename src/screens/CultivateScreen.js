import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, GripVertical, Pencil, Archive, Trash2 } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export default function CultivateScreen({ navigation }) {
    const [habits, setHabits] = useState([
        { id: 1, title: 'Morning Meditation', active: true },
        { id: 2, title: 'Drink 2L Water', active: true },
        { id: 3, title: 'No Screen Time > 9PM', active: true },
        { id: 4, title: 'Evening Stretch', active: true },
        { id: 5, title: 'Journaling', active: true },
    ]);

    const renderRightActions = (progress, dragX) => {
        return (
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtnArchive} onPress={() => console.log('Archive')}>
                    <Archive size={20} color="white" />
                    <Text style={styles.actionText}>ARCHIVE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnDelete} onPress={() => console.log('Delete')}>
                    <Trash2 size={20} color="white" />
                    <Text style={styles.actionText}>DELETE</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderItem = ({ item }) => {
        return (
            <Swipeable renderRightActions={renderRightActions}>
                <View style={styles.row}>
                    <GripVertical size={20} color={COLORS.textSecondary} />
                    <Text style={styles.habitTitle}>{item.title}</Text>
                    <TouchableOpacity>
                        <Pencil size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                </View>
            </Swipeable>
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
                    <TouchableOpacity>
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 24,
        backgroundColor: '#F5F9F8', // Slightly different shade or just background
    },

    habitTitle: {
        fontSize: 16,
        color: COLORS.textprimary,
        marginLeft: 16,
        flex: 1,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.border,
        marginLeft: 24,
    },
    actions: {
        flexDirection: 'row',
        height: '100%',
    },
    actionBtnArchive: {
        backgroundColor: '#6B8E85',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    actionBtnDelete: {
        backgroundColor: '#D9534F', // Muted red
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    actionText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 4,
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
