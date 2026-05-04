import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartLine } from '../types';

interface CartContextValue {
  /** Catering / pickup date for the entire cart (YYYY-MM-DD). */
  cateringDate: string | null;
  setCateringDate: (iso: string | null) => void;
  lines: CartLine[];
  /** Optional `forDate` scopes the add when the cart date is not set yet or must match the menu date. */
  addLine: (itemId: string, quantity?: number, forDate?: string) => void;
  setLineQuantity: (itemId: string, cateringDate: string, quantity: number) => void;
  removeLine: (itemId: string, cateringDate: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = 'homespun-kitchen-cart';

function loadInitial(): { cateringDate: string | null; lines: CartLine[] } {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { cateringDate: null, lines: [] };
    const parsed = JSON.parse(raw) as { cateringDate?: string | null; lines?: CartLine[] };
    const lines = Array.isArray(parsed.lines) ? parsed.lines : [];
    return {
      cateringDate: parsed.cateringDate ?? lines[0]?.cateringDate ?? null,
      lines,
    };
  } catch {
    return { cateringDate: null, lines: [] };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const initial = loadInitial();
  const [cateringDate, setCateringDateState] = useState<string | null>(initial.cateringDate);
  const [lines, setLines] = useState<CartLine[]>(initial.lines);

  const persist = useCallback((nextDate: string | null, nextLines: CartLine[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify({ cateringDate: nextDate, lines: nextLines }));
  }, []);

  const setCateringDate = useCallback(
    (iso: string | null) => {
      setCateringDateState(iso);
      if (iso === null) {
        setLines([]);
        persist(null, []);
      } else {
        setLines((prev) => {
          const cleared = prev.filter((l) => l.cateringDate === iso);
          persist(iso, cleared);
          return cleared;
        });
      }
    },
    [persist],
  );

  const addLine = useCallback(
    (itemId: string, quantity = 1, forDate?: string) => {
      const target = forDate ?? cateringDate;
      if (!target) return;
      setCateringDateState(target);
      setLines((prev) => {
        const scoped = prev.filter((l) => l.cateringDate === target);
        const existing = scoped.find((l) => l.itemId === itemId);
        let next: CartLine[];
        if (existing) {
          const merged = scoped.map((l) =>
            l.itemId === itemId ? { ...l, quantity: l.quantity + quantity } : l,
          );
          next = merged;
        } else {
          next = [...scoped, { itemId, cateringDate: target, quantity }];
        }
        persist(target, next);
        return next;
      });
    },
    [cateringDate, persist],
  );

  const setLineQuantity = useCallback(
    (itemId: string, date: string, quantity: number) => {
      setLines((prev) => {
        const next =
          quantity <= 0
            ? prev.filter((l) => !(l.itemId === itemId && l.cateringDate === date))
            : prev.map((l) =>
                l.itemId === itemId && l.cateringDate === date ? { ...l, quantity } : l,
              );
        persist(cateringDate, next);
        return next;
      });
    },
    [cateringDate, persist],
  );

  const removeLine = useCallback(
    (itemId: string, date: string) => {
      setLines((prev) => {
        const next = prev.filter((l) => !(l.itemId === itemId && l.cateringDate === date));
        persist(cateringDate, next);
        return next;
      });
    },
    [cateringDate, persist],
  );

  const clearCart = useCallback(() => {
    setLines([]);
    persist(cateringDate, []);
  }, [cateringDate, persist]);

  const cartCount = useMemo(() => lines.reduce((s, l) => s + l.quantity, 0), [lines]);

  const value = useMemo(
    () => ({
      cateringDate,
      setCateringDate,
      lines,
      addLine,
      setLineQuantity,
      removeLine,
      clearCart,
      cartCount,
    }),
    [cateringDate, setCateringDate, lines, addLine, setLineQuantity, removeLine, clearCart, cartCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
