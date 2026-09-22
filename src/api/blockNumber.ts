const BASE_URL = "/api/ethereum";

interface BlockNumberResponse {
  status: boolean;
  data: { block_number: number };
  error: string;
}

export async function fetchLatestBlockNumber(
  network: "sepolia" | "mainnet"
): Promise<number> {
  const response = await fetch(`${BASE_URL}/${network}/block/number/latest`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${network} block number: ${response.status}`);
  }
  const json: BlockNumberResponse = await response.json();
  if (!json.status) {
    throw new Error(json.error || `API error for ${network}`);
  }
  return json.data.block_number;
}
