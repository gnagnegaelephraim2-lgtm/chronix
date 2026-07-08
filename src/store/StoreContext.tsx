import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { rootReducer, loadInitialRootState, emptyBusinessState, STORAGE_KEY, type StoreAction } from './storeReducer';
import { StoreContext } from './storeContextCore';
import { useSession } from '../hooks/useSession';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [root, rootDispatch] = useReducer(rootReducer, undefined, loadInitialRootState);
  const { session } = useSession();

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
  }, [root]);

  const businessId = session?.businessId;
  const state = (businessId && root.businesses[businessId]) || emptyBusinessState();

  const dispatch = useCallback(
    (action: StoreAction) => {
      if (!businessId) return;
      rootDispatch({ type: 'SCOPED', businessId, action });
    },
    [businessId]
  );

  const value = useMemo(() => ({ state, dispatch, root, rootDispatch }), [state, dispatch, root]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
