import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GripVertical, Pencil, Archive, Trash2 } from 'lucide-react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { COLORS } from '../../constants/colors';

export default function HabitItem({ item, onArchive, onDelete }) {
    const renderRightActions = (progress, dragX) => {
        return (
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtnArchive} onPress={() => {
                    console.log('Archive', item.id);
                    if (onArchive) onArchive(item.id);
                }}>
                    <Archive size={20} color="white" />
                    <Text style={styles.actionText}>ARCHIVE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnDelete} onPress={() => {
                    console.log('Delete', item.id);
                    if (onDelete) onDelete(item.id);
                }}>
                    <Trash2 size={20} color="white" />
                    <Text style={styles.actionText}>DELETE</Text>
                </TouchableOpacity>
            </View>
        );
    };

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
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 24,
        backgroundColor: '#F5F9F8',
    },
    habitTitle: {
        fontSize: 16,
        color: COLORS.textprimary,
        marginLeft: 16,
        flex: 1,
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
        backgroundColor: '#D9534F',
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
});
