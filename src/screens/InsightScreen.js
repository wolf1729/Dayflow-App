import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Flame, CheckCircle2 } from 'lucide-react-native';

import { COLORS } from '../constants/colors';
import WeeklyFlowChart from '../components/Insight/WeeklyFlowChart';
import StatCard from '../components/Insight/StatCard';
import CalendarGrid from '../components/Insight/CalendarGrid';
import InsightCard from '../components/Insight/InsightCard';

export default function InsightScreen() {
    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
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
                    <StatCard label="CURRENT {'\n'}STREAK" value="12" unit="Days" icon={Flame} />
                    <StatCard label="COMPLETION" value="85" unit="%" icon={CheckCircle2} />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>CONSISTENCY</Text>
                    <Text style={styles.dateLabel}>OCTOBER 2023</Text>
                </View>

                <CalendarGrid />

                <InsightCard
                    icon="🌿"
                    title="Morning Rituals"
                    text="Your flow is strongest before 9 AM. You've completed 92% of your morning rituals this month."
                />

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
});
