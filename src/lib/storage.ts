import type { BoardState } from "../types";
const STORAGE_KEY = "kanban:board";
const STORAGE_VERSION = 1; // Versioning for future changes in board structure

type StoredData = {
  version: number;
  board: BoardState;
};

export function loadBoard(): BoardState | null {
  try {
    const storedBoard = localStorage.getItem(STORAGE_KEY);
    if (storedBoard) {
      const parsedBoard: unknown = JSON.parse(storedBoard);
      if (
        isStoredData(parsedBoard) &&
        parsedBoard.version === STORAGE_VERSION
      ) {
        return parsedBoard.board;
      }
      console.warn(
        "Saved board ignored: unknown format or version mismatch. Expected version:",
        STORAGE_VERSION,
      );
    }
  } catch (error) {
    console.error("Failed to parse board state from localStorage:", error);
  }
  return null;
}

export function saveBoard(board: BoardState): void {
  try {
    const serializedBoard = JSON.stringify({ version: STORAGE_VERSION, board });
    localStorage.setItem(STORAGE_KEY, serializedBoard);
  } catch (error) {
    console.error("Failed to save board state to localStorage:", error);
  }
}

// auxiliary function to check if a value is a Record<string, unknown>
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// type guard to check if an object is a valid BoardState
function isBoardState(obj: unknown): obj is BoardState {
  if (!isRecord(obj)) return false;

  const { cards, columns, columnOrder } = obj;
  if (!isRecord(cards) || !isRecord(columns) || !Array.isArray(columnOrder)) {
    return false;
  }

  if (!columnOrder.every((id) => typeof id === "string" && id in columns)) {
    return false;
  }

  const cardsOk = Object.values(cards).every(
    (card) =>
      isRecord(card) &&
      typeof card.id === "string" &&
      typeof card.title === "string",
  );
  if (!cardsOk) return false;

  return Object.values(columns).every((column) => {
    if (!isRecord(column) || !Array.isArray(column.cardIds)) return false;
    return column.cardIds.every((id) => typeof id === "string" && id in cards);
  });
}

// type guard to check if an object is a valid StoredData
function isStoredData(obj: unknown): obj is StoredData {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  const storedData = obj as StoredData;
  return (
    typeof storedData.version === "number" && isBoardState(storedData.board)
  );
}
