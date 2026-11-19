import { useEffect, useReducer } from "react";
import { Board } from "./components/Board";
import { initialBoard } from "./lib/initialBoard";
import { loadBoard, saveBoard } from "./lib/storage";
import { boardReducer } from "./state/boardReducer";
import type {
  AddCardHandler,
  Card,
  DeleteCardHandler,
  MoveCardHandler,
  UpdateCardHandler,
} from "./types";

function App() {
  const [board, dispatch] = useReducer(
    boardReducer,
    initialBoard,
    (initial) => {
      const loadedBoard = loadBoard();
      return loadedBoard ?? initial;
    },
  );

  useEffect(() => {
    saveBoard(board);
  }, [board]);

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

  const handleDeleteCard: DeleteCardHandler = (cardId) => {
    dispatch({
      type: "DELETE_CARD",
      payload: { cardId },
    });
  };

  const handleUpdateCard: UpdateCardHandler = (cardId, title, description) => {
    dispatch({
      type: "UPDATE_CARD",
      payload: {
        cardId,
        title: title.trim(),
        description: (description ?? "").trim(),
      },
    });
  };

  const handleMoveCard: MoveCardHandler = (move) => {
    dispatch({
      type: "MOVE_CARD",
      payload: move,
    });
  };

  return (
    <main className="bg-navy h-dvh content-center">
      <h1 className="sr-only">Kanban Board</h1>
      <Board
        board={board}
        onAddCard={handleAddCard}
        onDeleteCard={handleDeleteCard}
        onUpdateCard={handleUpdateCard}
        onMoveCard={handleMoveCard}
      />
    </main>
  );
}

export default App;
