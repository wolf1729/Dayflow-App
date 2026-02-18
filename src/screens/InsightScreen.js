import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Calendar, Flame, CheckCircle2 } from 'lucide-react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

// Mock chart component
const WeeklyFlowChart = () => {
    const chartWidth = width - 48;
    const chartHeight = 150;
    // A smooth bezier curve path for visualization
    const d = `M0,150 C50,140 80,100 120,100 S180,60 220,60 S280,120 320,130 S380,20 420,40`;

    return (
        <View style={styles.chartContainer}>
            <Svg width={chartWidth} height={chartHeight}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={COLORS.primary} stopOpacity="0.2" />
                        <Stop offset="1" stopColor={COLORS.primary} stopOpacity="0" />
                    </LinearGradient>
                </Defs>
                <Path
                    d={d + ` L${width},150 L0,150 Z`}
                    fill="url(#grad)"
                />
                <Path
                    d={d}
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    fill="none"
                />
                {/* Data points */}
                <Circle cx="120" cy="100" r="4" fill="white" stroke={COLORS.primary} strokeWidth={2} />
                <Circle cx="220" cy="60" r="4" fill="white" stroke={COLORS.primary} strokeWidth={2} />
                <Circle cx="320" cy="130" r="4" fill="white" stroke={COLORS.primary} strokeWidth={2} />
            </Svg>
        </View>
    );
};

export default function InsightScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Reflection</Text>
                    <View style={styles.calendarIcon}>
                        <Calendar size={20} color={COLORS.textprimary} />
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>GROWTH PROGRESS</Text>
                </View>

                <Text style={styles.chartTitle}>Weekly Flow</Text>
                <Text style={styles.chartSubtitle}>+12% VS LAST WEEK</Text>

                <WeeklyFlowChart />

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statLabel}>CURRENT {'\n'}STREAK</Text>
                            <Flame size={16} color={COLORS.textSecondary} />
                        </View>
                        <View style={styles.statValueContainer}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statUnit}>Days</Text>
                        </View>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statLabel}>COMPLETION</Text>
                            <CheckCircle2 size={16} color={COLORS.textSecondary} />
                        </View>
                        <View style={styles.statValueContainer}>
                            <Text style={styles.statValue}>85</Text>
                            <Text style={styles.statUnit}>%</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>CONSISTENCY</Text>
                    <Text style={styles.dateLabel}>OCTOBER 2023</Text>
                </View>

                {/* Mock Calendar Grid */}
                <View style={styles.calendarGrid}>
                    <View style={styles.calendarRow}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <Text key={i} style={styles.calendarDayLabel}>{d}</Text>
                        ))}
                    </View>
                    {/* Just a sample row of dates */}
                    <View style={styles.calendarRow}>
                        {[1, 2, 3, 4, 5, 6, 7].map((d, i) => (
                            <View key={i} style={[styles.calendarDay, d === 5 && styles.calendarDayActive]}>
                                <Text style={[styles.dayText, d === 5 && styles.dayTextActive]}>{d}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.calendarRow}>
                        {[8, 9, 10, 11, 12, 13, 14].map((d, i) => (
                            <View key={i} style={[styles.calendarDay, d === 12 && styles.calendarDayActive]}>
                                <Text style={[styles.dayText, d === 12 && styles.dayTextActive]}>{d}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.insightCard}>
                    <View style={styles.insightIcon}>
                        <Text>🌿</Text>
                    </View>
                    <View style={styles.insightContent}>
                        <Text style={styles.insightTitle}>Morning Rituals</Text>
                        <Text style={styles.insightText}>
                            Your flow is strongest before 9 AM. You've completed 92% of your morning rituals this month.
                        </Text>
                    </View>
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
    chartContainer: {
        height: 150,
        justifyContent: 'center',
        marginBottom: 32,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    statCard: {
        backgroundColor: COLORS.card,
        width: (width - 60) / 2,
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        letterSpacing: 1,
        lineHeight: 14,
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.textprimary,
        marginRight: 4,
    },
    statUnit: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    dateLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    calendarGrid: {
        marginBottom: 32,
    },
    calendarRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    calendarDayLabel: {
        width: 30,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
    },
    calendarDay: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarDayActive: {
        borderWidth: 1,
        borderColor: COLORS.textprimary,
    },
    dayText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    dayTextActive: {
        color: COLORS.textprimary,
        fontWeight: '600',
    },
    insightCard: {
        backgroundColor: '#EFF6F4',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    insightIcon: {
        marginRight: 16,
    },
    insightContent: {
        flex: 1,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textprimary,
        marginBottom: 8,
    },
    insightText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
});
