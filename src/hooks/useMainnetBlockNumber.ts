import { useEffect } from "react";
import { fetchLatestBlockNumber } from "../api/blockNumber";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setMainnetBlockNumber,
  setMainnetError,
} from "../store/blockNumberSlice";

const POLLING_INTERVAL = 30_000;

export function useMainnetBlockNumber() {
  const dispatch = useAppDispatch();
  const mainnet = useAppSelector((state) => state.blockNumber.mainnet);

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const block = await fetchLatestBlockNumber("mainnet");
        if (active) dispatch(setMainnetBlockNumber(block));
      } catch (error) {
        if (active) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          dispatch(setMainnetError(message));
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

  return mainnet;
}
