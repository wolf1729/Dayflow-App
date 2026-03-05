import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Droplets, Flame, Minus, Plus } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

export default function RitualItem({
    title,
    subtitle,
    completed,
    type,
    streak,
    onToggle,
    isCounter,
    count = 0,
    unit,
    onIncrement,
    onDecrement
}) {
    if (isCounter) {
        return (
            <View style={styles.container}>
                <View style={styles.leftContent}>
                    <View style={styles.countCircle}>
                        <Text style={styles.countText}>{count}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>{unit || 'units'}</Text>
                    </View>
                </View>

                <View style={styles.counterControls}>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={onDecrement}
                        activeOpacity={0.6}
                    >
                        <Minus size={18} color={COLORS.textprimary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.controlButton, styles.incrementButton]}
                        onPress={onIncrement}
                        activeOpacity={0.6}
                    >
                        <Plus size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

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
        padding: 16, // Slightly reduced padding for better fit with controls
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
    countCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F9F8',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textprimary,
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
    counterControls: {
        flexDirection: 'row',
        gap: 8,
    },
    controlButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#F5F9F8',
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    incrementButton: {
        backgroundColor: COLORS.textprimary,
        borderColor: COLORS.textprimary,
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
