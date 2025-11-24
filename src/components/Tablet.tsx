import React from 'react';
import { StyleSheet } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { Rect } from '../types';
import { useTablets } from '../context/TabletsContext';

export default function TabletView({ rect }: { rect: Rect }) {
  const { updateTablet } = useTablets();

  const translateX = useSharedValue(rect.x);
  const translateY = useSharedValue(rect.y);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { translationX, translationY, state } = event.nativeEvent;

    if (state === 2) {
      translateX.value = rect.x + translationX;
      translateY.value = rect.y + translationY;
    }

    if (state === 5) {
      const finalX = rect.x + translationX;
      const finalY = rect.y + translationY;

      translateX.value = withTiming(finalX, { duration: 120 });
      translateY.value = withTiming(finalY, { duration: 120 });

      runOnJS(updateTablet)(rect.id, { x: finalX, y: finalY });
    }
  };

  return (
    <PanGestureHandler onHandlerStateChange={onGestureEvent}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: rect.width,
            height: rect.height,
            borderRadius: rect.radius,
            backgroundColor: rect.color,
          },
        ]}
      />
    </PanGestureHandler>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = StyleSheet.create({
  tablet: {},
});
