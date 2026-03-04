import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Droplets, Flame } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

export default function RitualItem({ title, subtitle, completed, type, streak, onToggle }) {
    return (
        <TouchableOpacity
            style={[styles.container, completed && styles.containerCompleted]}
            onPress={onToggle}
            activeOpacity={0.7}
        >
            <View style={styles.leftContent}>
                <View style={[styles.checkbox, completed && styles.checkboxCompleted]}>
                    {completed && <Check size={16} color={COLORS.card} strokeWidth={3} />}
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, completed && styles.textCompleted]}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
            </View>

            <View style={styles.rightContent}>
                {streak > 0 && (
                    <View style={styles.streakContainer}>
                        <Text style={styles.streakText}>{streak}</Text>
                        <Flame size={14} color={COLORS.textSecondary} fill={COLORS.textSecondary} />
                    </View>
                )}
                {type === 'water' && <Droplets size={16} color={COLORS.accent} />}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.card,
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    containerCompleted: {
        backgroundColor: '#F8FBF9', // Very light green bg when completed
        borderColor: 'transparent',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: COLORS.textprimary,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxCompleted: {
        backgroundColor: COLORS.textprimary,
        borderColor: COLORS.textprimary,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.textprimary,
        marginBottom: 4,
    },
    textCompleted: {
        color: COLORS.textSecondary,
        textDecorationLine: 'none', // Design doesn't show strikethrough, just muted
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    streakText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
});
