import { SepoliaBlock } from "./components/SepoliaBlock";
import { MainnetBlock } from "./components/MainnetBlock";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Ethereum Block Monitor</h1>
      <div className="block-grid">
        <SepoliaBlock />
        <MainnetBlock />
      </div>
    </div>
  );
}

export default App;
