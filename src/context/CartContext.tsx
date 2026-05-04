import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartLine } from "../types";

type CartState = {
  pickupDate: string | null;
  lines: CartLine[];
};

type Action =
  | { type: "SET_PICKUP_DATE"; iso: string | null }
  | { type: "ADD_ITEM"; itemId: string; quantity: number }
  | { type: "SET_LINE_QTY"; itemId: string; quantity: number }
  | { type: "REMOVE_LINE"; itemId: string }
  | { type: "CLEAR" };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "SET_PICKUP_DATE": {
      if (action.iso === null) {
        return { pickupDate: null, lines: [] };
      }
      const dateChanged =
        state.pickupDate !== null &&
        state.pickupDate !== action.iso &&
        state.lines.length > 0;
      return {
        pickupDate: action.iso,
        lines: dateChanged ? [] : state.lines,
      };
    }
    case "ADD_ITEM": {
      const existing = state.lines.find((l) => l.itemId === action.itemId);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.itemId === action.itemId
              ? { ...l, quantity: l.quantity + action.quantity }
              : l,
          ),
        };
      }
      return {
        ...state,
        lines: [...state.lines, { itemId: action.itemId, quantity: action.quantity }],
      };
    }
    case "SET_LINE_QTY": {
      const q = Math.max(0, Math.floor(action.quantity));
      if (q === 0) {
        return {
          ...state,
          lines: state.lines.filter((l) => l.itemId !== action.itemId),
        };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.itemId === action.itemId ? { ...l, quantity: q } : l,
        ),
      };
    }
    case "REMOVE_LINE":
      return {
        ...state,
        lines: state.lines.filter((l) => l.itemId !== action.itemId),
      };
    case "CLEAR":
      return { pickupDate: null, lines: [] };
  }
}

type CartContextValue = {
  pickupDate: string | null;
  lines: CartLine[];
  setPickupDate: (iso: string | null) => void;
  addItem: (itemId: string, quantity?: number) => void;
  setLineQuantity: (itemId: string, quantity: number) => void;
  removeLine: (itemId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    pickupDate: null,
    lines: [],
  } satisfies CartState);

  const setPickupDate = useCallback((iso: string | null) => {
    dispatch({ type: "SET_PICKUP_DATE", iso });
  }, []);

  const addItem = useCallback((itemId: string, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", itemId, quantity });
  }, []);

  const setLineQuantity = useCallback((itemId: string, quantity: number) => {
    dispatch({ type: "SET_LINE_QTY", itemId, quantity });
  }, []);

  const removeLine = useCallback((itemId: string) => {
    dispatch({ type: "REMOVE_LINE", itemId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const value = useMemo(
    () => ({
      pickupDate: state.pickupDate,
      lines: state.lines,
      setPickupDate,
      addItem,
      setLineQuantity,
      removeLine,
      clearCart,
    }),
    [
      state.pickupDate,
      state.lines,
      setPickupDate,
      addItem,
      setLineQuantity,
      removeLine,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
