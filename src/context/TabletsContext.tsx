import React, { createContext, useContext, useState } from 'react';
import { splitRect } from '../utils/split';
import { Rect } from '../types';

type TabletsContextType = {
  tablets: Rect[];
  createTablet: (rect: Omit<Rect, 'id'>) => void;
  updateTablet: (id: string, patch: Partial<Rect>) => void;
  splitAt: (vx: number | null, hy: number | null) => void;
};

const TabletsContext = createContext<TabletsContextType | null>(null);

export const useTablets = () => {
  const ctx = useContext(TabletsContext);
  if (!ctx) throw new Error('useTablets must be used inside TabletsProvider');
  return ctx;
};

export const TabletsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tablets, setTablets] = useState<Rect[]>([]);

  const createTablet = (rect: Omit<Rect, 'id'>) => {
    const id = `t_${Date.now()}`;
    setTablets(prev => [...prev, { ...rect, id }]);
  };

  const updateTablet = (id: string, patch: Partial<Rect>) => {
    setTablets(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
  };

  const splitAt = (vx: number | null, hy: number | null) => {
    setTablets(prev => {
      return prev.flatMap(rect => {
        // Only apply split/move to the rectangle that contains the tap
        const isTapped =
          vx !== null &&
          hy !== null &&
          vx >= rect.x &&
          vx <= rect.x + rect.width &&
          hy >= rect.y &&
          hy <= rect.y + rect.height;

        if (!isTapped) return [rect]; // keep other rectangles unchanged

        // Apply splitRect (it will return 1 or multiple parts)
        const parts = splitRect(rect, vx, hy);

        // If unsplittable → nudge, else return all split parts
        return parts.length === 1 && parts[0].id.includes('_nudged')
          ? parts
          : parts;
      });
    });
  };

  return (
    <TabletsContext.Provider
      value={{ tablets, createTablet, updateTablet, splitAt }}
    >
      {children}
    </TabletsContext.Provider>
  );
};
