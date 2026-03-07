import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Flame, CheckCircle2 } from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

import { COLORS } from '../constants/colors';
import useAuthStore from '../store/useAuthStore';
import ritualService from '../services/ritualService';
import StatCard from '../components/Insight/StatCard';

const screenWidth = Dimensions.get('window').width;

const getDatesSince = (startDateIso) => {
    const dates = [];
    const labels = [];
    const start = new Date(startDateIso);
    start.setHours(0, 0, 0, 0); // start of day

    const now = new Date();
    now.setHours(23, 59, 59, 999); // end of today

    // Calculate days difference (include today)
    const diffTime = Math.abs(now - start);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const daysToShow = diffDays;

    for (let i = daysToShow - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
        // Default label
        labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    // If we have more than 7 days, sparse the labels so they don't overlap
    if (dates.length > 7) {
        const sparseLabels = labels.map((lbl, idx) => {
            if (idx === 0) return dates[0].slice(5); // Show first date (MM-DD)
            if (idx === labels.length - 1) return 'Today';
            if (idx === Math.floor(labels.length / 2)) return dates[idx].slice(5); // Middle date
            return ''; // Empty label for others
        });
        return { dates, labels: sparseLabels, totalDays: daysToShow };
    }

    return { dates, labels, totalDays: daysToShow };
};

export default function InsightScreen() {
    const isFocused = useIsFocused();
    const user = useAuthStore(state => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [insights, setInsights] = useState({
        overallCompletionHistory: {},
        dailyStreak: [],
        counterHabitsHistory: []
    });
    const [multiCounterInsights, setMultiCounterInsights] = useState({
        counterHabitsHistory: []
    });
    const [totalActiveRituals, setTotalActiveRituals] = useState(0);

    const fetchInsights = useCallback(async () => {
        if (!user || !user.uid) return;
        setIsLoading(true);
        try {
            const [data, counterData, rituals] = await Promise.all([
                ritualService.getInsights(user.uid),
                ritualService.getCounterInsights(user.uid),
                ritualService.getRituals(user.uid)
            ]);
            setInsights(data);
            setMultiCounterInsights(counterData);
            setTotalActiveRituals(rituals?.activeRitual?.length || 0);
        } catch (error) {
            console.error('Failed to load insights:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isFocused) fetchInsights();
    }, [fetchInsights, isFocused]);

    // Fallback if createdAt is missing
    const fallbackStart = new Date();
    // Default to just today if missing

    const startDate = user?.createdAt ? user.createdAt : fallbackStart.toISOString();
    const { dates, labels, totalDays } = getDatesSince(startDate);

    // Data for Overall Flow
    const overallData = dates.map(date => insights.overallCompletionHistory[date] || 0);

    // Calculate current streak
    let currentStreak = 0;
    const sortedStreaks = [...(insights.dailyStreak || [])].sort().reverse();
    for (let i = 0; i < sortedStreaks.length; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        if (sortedStreaks[i] === d.toISOString().split('T')[0]) {
            currentStreak++;
        } else {
            break;
        }
    }

    // Calculate today's completion percentage
    const todayIso = new Date().toISOString().split('T')[0];
    const todayCompleted = insights.overallCompletionHistory[todayIso] || 0;
    const completionPercentage = totalActiveRituals > 0 ? Math.round((todayCompleted / totalActiveRituals) * 100) : 0;

    const chartConfig = {
        backgroundGradientFrom: COLORS.card,
        backgroundGradientFromOpacity: 0.8,
        backgroundGradientTo: COLORS.background,
        backgroundGradientToOpacity: 0.8,
        fillShadowGradient: COLORS.primary,
        fillShadowGradientOpacity: 0.3,
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green primary
        labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`, // Slate secondary
        strokeWidth: 3, // Thicker line for a bolder look
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: COLORS.card, // White/Card border around the dot
            fill: COLORS.primary // Colored center
        },
        propsForLabels: {
            fontSize: 10,
            fontWeight: '600',
        }
    };

    // Calculate max value for Overall data to determine segments
    const maxOverallValue = Math.max(...(overallData.length ? overallData : [0]), 1);
    const overallSegments = Math.min(maxOverallValue, 5); // Don't create more segments than the max integer value to prevent fractional labels

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Reflection</Text>
                </View>

                {isLoading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 40 }} />
                ) : (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>GROWTH PROGRESS</Text>
                        </View>

                        <Text style={styles.chartTitle}>Overall Flow</Text>

                        <View style={styles.chartContainer}>
                            <LineChart
                                data={{
                                    labels: labels,
                                    datasets: [{ data: overallData.length ? overallData : Array(totalDays).fill(0) }]
                                }}
                                width={screenWidth - 48} // Padding 24 on each side
                                height={220}
                                chartConfig={chartConfig}
                                formatYLabel={(yValue) => Math.round(parseFloat(yValue)).toString()}
                                fromZero={true}
                                segments={overallSegments}
                                paddingLeft={-20}
                                bezier
                                style={styles.chartStyle}
                            />
                        </View>

                        {/* MULTI-LINE CHART FOR COUNTERS */}
                        {multiCounterInsights.counterHabitsHistory && multiCounterInsights.counterHabitsHistory.length > 0 && Array.isArray(multiCounterInsights.counterHabitsHistory) ? (
                            (() => {
                                // Calculate max value for Counters chart across all datasets
                                let maxCounterValue = 1;
                                const counterDatasets = multiCounterInsights.counterHabitsHistory.map((counter, idx) => {
                                    const counterData = dates.map(date => counter.history[date] || 0);
                                    const localMax = Math.max(...counterData);
                                    if (localMax > maxCounterValue) maxCounterValue = localMax;

                                    const colors = [
                                        (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,   // Blue
                                        (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,    // Red
                                        (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,   // Yellow/Orange
                                        (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,   // Emerald
                                        (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,   // Purple
                                        (opacity = 1) => `rgba(236, 72, 153, ${opacity})`    // Pink
                                    ];
                                    return {
                                        data: counterData.length ? counterData : Array(totalDays).fill(0),
                                        color: colors[idx % colors.length]
                                    };
                                });

                                const counterSegments = Math.min(maxCounterValue, 5);

                                return (
                                    <>
                                        <Text style={styles.chartTitle}>Active Counter Rituals</Text>
                                        <View style={styles.chartContainer}>
                                            <LineChart
                                                data={{
                                                    labels: labels,
                                                    legend: multiCounterInsights.counterHabitsHistory.map(c => c.name),
                                                    datasets: counterDatasets
                                                }}
                                                width={screenWidth - 48}
                                                height={260}
                                                chartConfig={{
                                                    ...chartConfig,
                                                    color: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                                                }}
                                                formatYLabel={(yValue) => Math.round(parseFloat(yValue)).toString()}
                                                fromZero={true}
                                                segments={counterSegments}
                                                paddingLeft={"-20"}
                                                bezier
                                                style={styles.chartStyle}
                                            />
                                        </View>
                                    </>
                                );
                            })()
                        ) : null}

                        <View style={styles.statsRow}>
                            <StatCard label="CURRENT STREAK" value={currentStreak.toString()} unit="Days" icon={Flame} />
                            <StatCard label="COMPLETION" value={completionPercentage.toString()} unit="%" icon={CheckCircle2} />
                        </View>
                    </>
                )}

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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textprimary,
    },
    calendarIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.textSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
        letterSpacing: 1,
        fontWeight: '600',
    },
    chartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textprimary,
        marginBottom: 4,
    },
    chartSubtitle: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        marginTop: -24, // Hacky positioning to match design
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    dateLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    chartStyle: {
        borderRadius: 16,
    }
});
