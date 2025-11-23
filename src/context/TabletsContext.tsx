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
      let next: Rect[] = [];
      prev.forEach(rect => {
        const parts = splitRect(rect, vx, hy);
        parts.forEach((p, idx) => {
          next.push({
            ...p,
            id: `${rect.id}_${Date.now()}_${idx}`,
            color: rect.color,
            radius: rect.radius,
          });
        });
      });
      return next;
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
