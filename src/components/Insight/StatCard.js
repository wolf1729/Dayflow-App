import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');

const StatCard = ({ label, value, unit, icon: Icon }) => {
    return (
        <View style={styles.statCard}>
            <View style={styles.statHeader}>
                <Text style={styles.statLabel}>{label}</Text>
                {Icon && <Icon size={16} color={COLORS.textSecondary} />}
            </View>
            <View style={styles.statValueContainer}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statUnit}>{unit}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default StatCard;
