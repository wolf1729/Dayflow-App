import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { UserCircle } from 'lucide-react-native';

import { COLORS } from '../constants/colors';
import { ActivityIndicator } from 'react-native';
import RitualItem from '../components/RitualItem';
import ProfileModal from '../components/Modal/ProfileModal';
import useAuthStore from '../store/useAuthStore';
import ritualService from '../services/ritualService';

export default function GardenScreen() {
    const [isProfileModalVisible, setProfileModalVisible] = useState(false);
    const isFocused = useIsFocused();

    const [rituals, setRituals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const user = useAuthStore(state => state.user);

    const fetchRituals = useCallback(async () => {
        if (!user || !user.uid) return;
        setIsLoading(true);
        try {
            const data = await ritualService.getRituals(user.uid);

            // Get today's date string in YYYY-MM-DD format for completion checking
            const todayStr = new Date().toISOString().split('T')[0];

            const activeRituals = data.activeRitual || [];

            const allRituals = [];

            activeRituals.forEach(r => {
                // Check if completedOn contains today's date prefix
                const isCompletedToday = (r.completedOn || []).some(
                    timestamp => timestamp && timestamp.startsWith(todayStr)
                );

                allRituals.push({
                    id: r.ritual_id,
                    title: r.name,
                    subtitle: r.group,
                    group: r.group, // Used for grouping
                    completed: isCompletedToday,
                    isCounter: r.isCounter,
                    unit: r.unit,
                    count: r.countLogs ? (r.countLogs[todayStr] || 0) : 0,
                    type: r.unit && r.unit.toLowerCase().includes('water') ? 'water' : 'default',
                    streak: 0 // Mock streak for now
                });
            });

            setRituals(allRituals);
        } catch (error) {
            console.error('Failed to load rituals for garden:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isFocused) {
            fetchRituals();
        }
    }, [fetchRituals, isFocused]);


    const toggleRitual = async (id) => {
        const item = rituals.find(r => r.id === id);
        if (item && item.completed) return; // Prevent unmarking

        // Optimistic update
        setRituals(items => items.map(item => item.id === id ? { ...item, completed: true } : item));

        if (user && user.uid) {
            try {
                const timestamp = new Date().toISOString();
                await ritualService.completeRitual(user.uid, id, timestamp);
            } catch (error) {
                console.error('Failed to complete ritual:', error);
                // Revert on error
                setRituals(items => items.map(item => item.id === id ? { ...item, completed: false } : item));
            }
        }
    };

    const handleIncrement = async (id) => {
        let newCount = 0;
        let isCompleteNow = false;
        let targetCount = 0;
        let skipUpdate = false;

        setRituals(items => items.map(item => {
            if (item.id === id) {
                targetCount = parseFloat(item.unit) || 0;

                // Prevent incrementing beyond target
                if (targetCount > 0 && (item.count || 0) >= targetCount) {
                    skipUpdate = true;
                    return item;
                }

                newCount = (item.count || 0) + 1;
                if (!item.completed && targetCount > 0 && newCount >= targetCount) {
                    isCompleteNow = true;
                }
                return { ...item, count: newCount, completed: item.completed || isCompleteNow };
            }
            return item;
        }));

        if (skipUpdate) return;

        if (user && user.uid) {
            try {
                const todayStr = new Date().toISOString().split('T')[0];
                await ritualService.logRitualCount(user.uid, id, todayStr, newCount);

                if (isCompleteNow) {
                    const timestamp = new Date().toISOString();
                    await ritualService.completeRitual(user.uid, id, timestamp);
                }
            } catch (error) {
                console.error('Failed to log count or auto-complete:', error);
            }
        }
    };

    const handleDecrement = async (id) => {
        let newCount = 0;

        setRituals(items => items.map(item => {
            if (item.id === id) {
                newCount = Math.max(0, (item.count || 0) - 1);
                return { ...item, count: newCount };
            }
            return item;
        }));

        if (user && user.uid) {
            try {
                const todayStr = new Date().toISOString().split('T')[0];
                await ritualService.logRitualCount(user.uid, id, todayStr, newCount);
            } catch (error) {
                console.error('Failed to log count decrement:', error);
            }
        }
    };

    // Date formatting
    const date = new Date();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNumber = date.getDate();
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });

    // Dynamic calendar strip data
    const ObjectDaysOffsets = [-3, -2, -1, 0, 1];
    const weekDays = ObjectDaysOffsets.map((offset) => {
        const d = new Date();
        d.setDate(date.getDate() + offset);
        return {
            day: offset === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: d.getDate(),
            current: offset === 0,
        };
    });

    // Group habits by their 'group' field
    const ritualSections = rituals.reduce((acc, ritual) => {
        const groupName = ritual.group || 'General';
        const section = acc.find(s => s.title === groupName);
        if (section) {
            section.data.push(ritual);
        } else {
            acc.push({ title: groupName, data: [ritual] });
        }
        return acc;
    }, []);

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

                {isLoading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={[styles.infoText, { marginTop: 16 }]}>Loading your garden...</Text>
                    </View>
                ) : (
                    <>
                        {ritualSections.length === 0 ? (
                            <Text style={styles.emptyText}>No reading items found.</Text>
                        ) : (
                            ritualSections.map((section, index) => (
                                <View key={`section-${index}`}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
                                        <View style={styles.separator} />
                                    </View>
                                    <View style={styles.listContainer}>
                                        {section.data.map(item => (
                                            <RitualItem
                                                key={item.id}
                                                {...item}
                                                onToggle={() => toggleRitual(item.id)}
                                                onIncrement={() => handleIncrement(item.id)}
                                                onDecrement={() => handleDecrement(item.id)}
                                            />
                                        ))}
                                    </View>
                                </View>
                            ))
                        )}
                    </>
                )}

            </ScrollView>

            {/* Profile Modal */}
            <ProfileModal
                isVisible={isProfileModalVisible}
                onClose={() => setProfileModalVisible(false)}
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    infoText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 16,
    }
});
