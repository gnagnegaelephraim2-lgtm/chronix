import { createContext, type Dispatch } from 'react';
import type { StoreState, StoreAction } from './storeReducer';

export interface StoreContextValue {
  state: StoreState;
  dispatch: Dispatch<StoreAction>;
}

export const StoreContext = createContext<StoreContextValue | null>(null);
