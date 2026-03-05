import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

const InsightCard = ({ icon, title, text }) => {
    return (
        <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
                <Text>{icon}</Text>
            </View>
            <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{title}</Text>
                <Text style={styles.insightText}>{text}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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

export default InsightCard;
