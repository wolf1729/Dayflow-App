import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { UserCircle } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import RitualItem from '../components/RitualItem';

export default function GardenScreen() {
    const [rituals, setRituals] = useState([
        { id: 1, title: 'Morning Meditation', subtitle: '15 mins • Mindfulness', completed: false, streak: 12 },
        { id: 2, title: 'Hydrate', subtitle: 'Drink 500ml water', completed: false, streak: 0, type: 'water' },
    ]);

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
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerSubtitle}>{dayName.toUpperCase()}</Text>
                        <Text style={styles.headerTitle}>{monthName} {dayNumber}</Text>
                    </View>
                    <UserCircle size={40} color={COLORS.textSecondary} strokeWidth={1} />
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
});
