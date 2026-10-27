import { Board } from "./components/Board";
import { initialBoard } from "./lib/initialBoard";

function App() {
  return (
    <main className="bg-accent h-screen content-center">
      <Board board={initialBoard} />
    </main>
  );
}

export default App;
