import { useReducer } from "react";
import { Board } from "./components/Board";
import { initialBoard } from "./lib/initialBoard";
import { boardReducer } from "./state/boardReducer";
import type { AddCardHandler, Card } from "./types";

function App() {
  const [board, dispatch] = useReducer(boardReducer, initialBoard);

  const handleAddCard: AddCardHandler = (columnId, title, description) => {
    const card: Card = { id: crypto.randomUUID(), title: title.trim() };

    const trimmedDescription = description?.trim();
    if (trimmedDescription) {
      card.description = trimmedDescription;
    }
    dispatch({
      type: "ADD_CARD",
      payload: { columnId, card },
    });
  };

  return (
    <main className="bg-navy h-dvh content-center">
      <h1 className="sr-only">Kanban Board</h1>
      <Board board={board} onAddCard={handleAddCard} />
    </main>
  );
}

export default App;
