import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

const CalendarGrid = () => {
    return (
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
    );
};

const styles = StyleSheet.create({
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
});

export default CalendarGrid;
