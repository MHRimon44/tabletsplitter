import React, { useRef, useState } from 'react';
import { View, StyleSheet, PixelRatio } from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import TabletView from '../components/Tablet';
import { useTablets } from '../context/TabletsContext';
import { randomColor } from '../utils/colors';

export default function Canvas() {
  const { tablets, createTablet, splitAt } = useTablets();
  const [drawing, setDrawing] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const pointOnTablet = (x: number, y: number) => {
    return tablets.some(
      t => x >= t.x && x <= t.x + t.width && y >= t.y && y <= t.y + t.height,
    );
  };

  const onPanStart = (evt: any) => {
    const { x, y } = evt.nativeEvent;
    if (pointOnTablet(x, y)) {
      startRef.current = null;
      return;
    }
    startRef.current = { x, y };
    setDrawing({ x, y, w: 0, h: 0 });
  };

  const onPanActive = (evt: any) => {
    if (!startRef.current) return;
    const { x, y } = evt.nativeEvent;
    const sx = startRef.current.x;
    const sy = startRef.current.y;
    const left = Math.min(sx, x);
    const top = Math.min(sy, y);
    const w = Math.abs(x - sx);
    const h = Math.abs(y - sy);
    setDrawing({ x: left, y: top, w, h });
  };

  const onPanEnd = () => {
    if (!drawing) return;
    const MIN_W = 40 * PixelRatio.get();
    const MIN_H = 20 * PixelRatio.get();
    if (drawing.w >= MIN_W && drawing.h >= MIN_H) {
      createTablet({
        x: drawing.x,
        y: drawing.y,
        width: drawing.w,
        height: drawing.h,
        radius: Math.min(12, drawing.h / 4),
        color: randomColor(),
      });
    }
    setDrawing(null);
    startRef.current = null;
  };

  const onTap = (evt: any) => {
    const { x, y } = evt.nativeEvent;
    // show lines briefly: pass vx,hy to splitAt
    splitAt(x, y);
  };

  return (
    <TapGestureHandler onActivated={onTap}>
      <PanGestureHandler
        onBegan={onPanStart}
        onGestureEvent={onPanActive}
        onEnded={onPanEnd}
      >
        <View style={styles.container}>
          {tablets.map(t => (
            <TabletView key={t.id} rect={t} />
          ))}
          {drawing && (
            <View
              style={[
                styles.rubber,
                {
                  left: drawing.x,
                  top: drawing.y,
                  width: drawing.w,
                  height: drawing.h,
                },
              ]}
            />
          )}
        </View>
      </PanGestureHandler>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  rubber: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#333',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 6,
  },
});
