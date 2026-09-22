import { createContext, useContext, useEffect, type ReactNode } from "react";
import { fetchLatestBlockNumber } from "../api/blockNumber";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setSepoliaBlockNumber,
  setSepoliaError,
} from "../store/blockNumberSlice";

const POLLING_INTERVAL = 60_000;

interface SepoliaBlockContextValue {
  blockNumber: number | null;
  loading: boolean;
  error: string | null;
}

const SepoliaBlockContext = createContext<SepoliaBlockContextValue | null>(null);

export function SepoliaBlockProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const sepolia = useAppSelector((state) => state.blockNumber.sepolia);

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const block = await fetchLatestBlockNumber("sepolia");
        if (active) dispatch(setSepoliaBlockNumber(block));
      } catch (error) {
        if (active) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          dispatch(setSepoliaError(message));
        }
      }
    }

    poll();
    const id = setInterval(poll, POLLING_INTERVAL);

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [dispatch]);

  return (
    <SepoliaBlockContext.Provider value={sepolia}>
      {children}
    </SepoliaBlockContext.Provider>
  );
}

export function useSepoliaBlock(): SepoliaBlockContextValue {
  const context = useContext(SepoliaBlockContext);
  if (context === null) {
    throw new Error("useSepoliaBlock must be used within SepoliaBlockProvider");
  }
  return context;
}
