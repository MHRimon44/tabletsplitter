/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import { View, StyleSheet, PixelRatio, Text } from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import TabletView from '../components/Tablet';
import { useTablets } from '../context/TabletsContext';
import { randomColor } from '../utils/colors';

export default function Canvas() {
  const { tablets, createTablet, splitAt } = useTablets();
  const [sizeWarning, setSizeWarning] = useState<{
    x: number;
    y: number;
    visible: boolean;
  } | null>(null);

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

    if (drawing.w < MIN_W || drawing.h < MIN_H) {
      setSizeWarning({
        x: drawing.x + drawing.w / 2,
        y: drawing.y,
        visible: true,
      });

      // hide after 1.5s
      setTimeout(() => {
        setSizeWarning(null);
      }, 1500);

      setDrawing(null);
      startRef.current = null;
      return;
    }

    createTablet({
      x: drawing.x,
      y: drawing.y,
      width: drawing.w,
      height: drawing.h,
      radius: Math.min(12, drawing.h / 4),
      color: randomColor(),
    });

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
          {tablets.length === 0 && !drawing && (
            <View style={styles.hintContainer}>
              <View style={styles.hintBubble}>
                <View style={{ marginBottom: 6 }}>
                  <Text style={styles.hintText}>
                    Press & drag to create a tablet
                  </Text>
                </View>
                <Text style={[styles.hintText, { opacity: 0.6 }]}>
                  Tap once to split tablets
                </Text>
              </View>
            </View>
          )}
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
          {sizeWarning?.visible && (
            <View
              style={[
                styles.warningBubble,
                { left: sizeWarning.x - 80, top: sizeWarning.y - 40 },
              ]}
            >
              <Text style={styles.warningText}>
                Minimum size is 40 × 20 dpi
              </Text>
            </View>
          )}
        </View>
      </PanGestureHandler>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  rubber: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#333',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 6,
  },
  hintContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  hintBubble: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  hintText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
  },
  warningBubble: {
    position: 'absolute',
    backgroundColor: '#ffefef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffb3b3',
    width: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  warningText: {
    fontSize: 12,
    color: '#cc0000',
    textAlign: 'center',
  },
});
