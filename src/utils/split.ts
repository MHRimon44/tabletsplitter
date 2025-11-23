import { Rect } from '../types';
import { PixelRatio } from 'react-native';

const dpToPx = (dp: number) => Math.round(dp * PixelRatio.get());

const MIN_PART_WIDTH_PX = dpToPx(20);
const MIN_PART_HEIGHT_PX = dpToPx(10);

export function splitRect(
  rect: Rect,
  vx: number | null,
  hy: number | null,
): Rect[] {
  const L = rect.x;
  const T = rect.y;
  const R = rect.x + rect.width;
  const B = rect.y + rect.height;

  const vInside = vx !== null && vx > L && vx < R;
  const hInside = hy !== null && hy > T && hy < B;

  if (!vInside && !hInside) return [rect];

  const validRect = (x: number, y: number, w: number, h: number) =>
    w >= MIN_PART_WIDTH_PX && h >= MIN_PART_HEIGHT_PX;

  if (vInside && hInside) {
    const wLeft = vx! - L;
    const wRight = R - vx!;
    const hTop = hy! - T;
    const hBottom = B - hy!;

    const candidates = [
      { x: L, y: T, width: wLeft, height: hTop },
      { x: vx!, y: T, width: wRight, height: hTop },
      { x: L, y: hy!, width: wLeft, height: hBottom },
      { x: vx!, y: hy!, width: wRight, height: hBottom },
    ];

    const valid = candidates.filter(c =>
      validRect(c.x, c.y, c.width, c.height),
    );
    if (valid.length === 4) {
      const out = valid.map((c, idx) => ({
        ...rect,
        id: `${rect.id}_${idx}`,
        x: c.x,
        y: c.y,
        width: c.width,
        height: c.height,
      }));
      return out;
    } else {
      if (wLeft >= MIN_PART_WIDTH_PX && wRight >= MIN_PART_WIDTH_PX) {
        return [
          {
            ...rect,
            id: `${rect.id}_L`,
            x: L,
            y: T,
            width: wLeft,
            height: rect.height,
          },
          {
            ...rect,
            id: `${rect.id}_R`,
            x: vx!,
            y: T,
            width: wRight,
            height: rect.height,
          },
        ];
      }
      if (hTop >= MIN_PART_HEIGHT_PX && hBottom >= MIN_PART_HEIGHT_PX) {
        return [
          {
            ...rect,
            id: `${rect.id}_T`,
            x: L,
            y: T,
            width: rect.width,
            height: hTop,
          },
          {
            ...rect,
            id: `${rect.id}_B`,
            x: L,
            y: hy!,
            width: rect.width,
            height: hBottom,
          },
        ];
      }
      return [rect];
    }
  }

  if (vInside) {
    const wLeft = vx! - L;
    const wRight = R - vx!;
    if (wLeft >= MIN_PART_WIDTH_PX && wRight >= MIN_PART_WIDTH_PX) {
      return [
        {
          ...rect,
          id: `${rect.id}_L`,
          x: L,
          y: T,
          width: wLeft,
          height: rect.height,
        },
        {
          ...rect,
          id: `${rect.id}_R`,
          x: vx!,
          y: T,
          width: wRight,
          height: rect.height,
        },
      ];
    } else {
      return [rect];
    }
  }

  if (hInside) {
    const hTop = hy! - T;
    const hBottom = B - hy!;
    if (hTop >= MIN_PART_HEIGHT_PX && hBottom >= MIN_PART_HEIGHT_PX) {
      return [
        {
          ...rect,
          id: `${rect.id}_T`,
          x: L,
          y: T,
          width: rect.width,
          height: hTop,
        },
        {
          ...rect,
          id: `${rect.id}_B`,
          x: L,
          y: hy!,
          width: rect.width,
          height: hBottom,
        },
      ];
    } else {
      return [rect];
    }
  }

  return [rect];
}
