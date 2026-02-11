import { useCallback, useState } from 'react';

export type UseCategoryItemOpts = {
  id?: string | number;
  initialQty?: number | string;
  onAdd?: (id: number | string | undefined, qty?: number) => void;
};

export const useCategoryItem = ({ id, initialQty = 0, onAdd }: UseCategoryItemOpts) => {
  const [count, setCount] = useState<number>(() => Number(initialQty) || 0);

  const inc = useCallback(() => setCount((c) => c + 1), []);
  const dec = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setCount(Number.isFinite(v) ? Math.max(0, v) : 0);
  }, []);
  const handleAdd = useCallback(() => {
    onAdd?.(id, count || 1);
  }, [onAdd, id, count]);

  return { count, setCount, inc, dec, onChange, handleAdd } as const;
};

export default useCategoryItem;
