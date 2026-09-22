import { useMainnetBlockNumber } from "../hooks/useMainnetBlockNumber";

export function MainnetBlock() {
  const { blockNumber, loading, error } = useMainnetBlockNumber();

  return (
    <div className="block-card">
      <h2>Ethereum Mainnet</h2>
      <p className="block-label">Latest Block Number</p>
      {loading && <p className="block-value">Loading...</p>}
      {error && <p className="block-error">{error}</p>}
      {!loading && !error && (
        <p className="block-value">{blockNumber?.toLocaleString()}</p>
      )}
      <p className="block-interval">Polling every 30s</p>
    </div>
  );
}
