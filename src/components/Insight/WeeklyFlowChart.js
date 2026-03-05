import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');

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
                    d={d + ` L${chartWidth},150 L0,150 Z`}
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

const styles = StyleSheet.create({
    chartContainer: {
        height: 150,
        justifyContent: 'center',
        marginBottom: 32,
    },
});

export default WeeklyFlowChart;
