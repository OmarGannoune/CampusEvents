import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/spacing';

type SkeletonCardProps = {
  style?: ViewStyle;
};

export function SkeletonCard({ style }: SkeletonCardProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, style, { opacity }]} accessibilityRole="summary" />
  );
}

const styles = StyleSheet.create({
  card: {
    height: 90,
    borderRadius: Radius.lg,
    backgroundColor: Colors.purpleLight,
  },
});
