import { useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { reducer, loadInitialState, STORAGE_KEY } from './storeReducer';
import { StoreContext } from './storeContextCore';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
