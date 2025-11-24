import { Rect } from '../types';
import { PixelRatio } from 'react-native';

const dpToPx = (dp: number) => Math.round(dp * PixelRatio.get());

const MIN_PART_WIDTH_PX = dpToPx(20);
const MIN_PART_HEIGHT_PX = dpToPx(10);
const NUDGE = dpToPx(10); // how much to move unsplittable rect

// Move only this rectangle
function nudgeRect(rect: Rect): Rect {
  return {
    ...rect,
    x: rect.x + NUDGE,
    y: rect.y + NUDGE,
    id: `${rect.id}_nudged`,
  };
}

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

  const canSplit = (w: number, h: number) =>
    w >= MIN_PART_WIDTH_PX && h >= MIN_PART_HEIGHT_PX;

  // Tap outside rectangle → no change
  if (!vInside && !hInside) return [rect];

  // CROSS SPLIT
  if (vInside && hInside) {
    const wLeft = vx! - L;
    const wRight = R - vx!;
    const hTop = hy! - T;
    const hBottom = B - hy!;

    const allValid =
      canSplit(wLeft, hTop) &&
      canSplit(wRight, hTop) &&
      canSplit(wLeft, hBottom) &&
      canSplit(wRight, hBottom);

    if (allValid) {
      return [
        { ...rect, id: `${rect.id}_0`, x: L, y: T, width: wLeft, height: hTop },
        {
          ...rect,
          id: `${rect.id}_1`,
          x: vx!,
          y: T,
          width: wRight,
          height: hTop,
        },
        {
          ...rect,
          id: `${rect.id}_2`,
          x: L,
          y: hy!,
          width: wLeft,
          height: hBottom,
        },
        {
          ...rect,
          id: `${rect.id}_3`,
          x: vx!,
          y: hy!,
          width: wRight,
          height: hBottom,
        },
      ];
    }

    // Can split vertically only
    if (canSplit(wLeft, rect.height) && canSplit(wRight, rect.height)) {
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

    // Can split horizontally only
    if (canSplit(rect.width, hTop) && canSplit(rect.width, hBottom)) {
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

    // Cannot split → just move this rectangle
    return [nudgeRect(rect)];
  }

  // VERTICAL SPLIT
  if (vInside) {
    const wLeft = vx! - L;
    const wRight = R - vx!;
    if (canSplit(wLeft, rect.height) && canSplit(wRight, rect.height)) {
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
    return [nudgeRect(rect)];
  }

  // HORIZONTAL SPLIT
  if (hInside) {
    const hTop = hy! - T;
    const hBottom = B - hy!;
    if (canSplit(rect.width, hTop) && canSplit(rect.width, hBottom)) {
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
    return [nudgeRect(rect)];
  }

  // Fallback → move this rectangle only
  return [nudgeRect(rect)];
}
