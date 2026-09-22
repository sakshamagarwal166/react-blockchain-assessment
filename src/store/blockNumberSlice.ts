import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface NetworkState {
  blockNumber: number | null;
  loading: boolean;
  error: string | null;
}

interface BlockNumberState {
  sepolia: NetworkState;
  mainnet: NetworkState;
}

const initialNetworkState: NetworkState = {
  blockNumber: null,
  loading: true,
  error: null,
};

const initialState: BlockNumberState = {
  sepolia: { ...initialNetworkState },
  mainnet: { ...initialNetworkState },
};

const blockNumberSlice = createSlice({
  name: "blockNumber",
  initialState,
  reducers: {
    setSepoliaBlockNumber(state, action: PayloadAction<number>) {
      state.sepolia.blockNumber = action.payload;
      state.sepolia.loading = false;
      state.sepolia.error = null;
    },
    setSepoliaError(state, action: PayloadAction<string>) {
      state.sepolia.loading = false;
      state.sepolia.error = action.payload;
    },
    setMainnetBlockNumber(state, action: PayloadAction<number>) {
      state.mainnet.blockNumber = action.payload;
      state.mainnet.loading = false;
      state.mainnet.error = null;
    },
    setMainnetError(state, action: PayloadAction<string>) {
      state.mainnet.loading = false;
      state.mainnet.error = action.payload;
    },
  },
});

export const {
  setSepoliaBlockNumber,
  setSepoliaError,
  setMainnetBlockNumber,
  setMainnetError,
} = blockNumberSlice.actions;

export default blockNumberSlice.reducer;
