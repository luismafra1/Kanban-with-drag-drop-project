import { Board } from "./components/Board";
import { initialBoard } from "./lib/initialBoard";

function App() {
  return (
    <main className="bg-navy h-dvh content-center">
      <h1 className="sr-only">Kanban Board</h1>
      <Board board={initialBoard} />
    </main>
  );
}

export default App;
