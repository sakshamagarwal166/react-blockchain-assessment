import { useSepoliaBlock } from "../context/SepoliaBlockProvider";

export function SepoliaBlock() {
  const { blockNumber, loading, error } = useSepoliaBlock();

  return (
    <div className="block-card">
      <h2>Sepolia Testnet</h2>
      <p className="block-label">Latest Block Number</p>
      {loading && <p className="block-value">Loading...</p>}
      {error && <p className="block-error">{error}</p>}
      {!loading && !error && (
        <p className="block-value">{blockNumber?.toLocaleString()}</p>
      )}
      <p className="block-interval">Polling every 60s</p>
    </div>
  );
}
