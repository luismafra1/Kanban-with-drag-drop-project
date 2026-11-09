import type { BoardState } from "../types";
const STORAGE_KEY = "kanban:board";

export function loadBoard(): BoardState | null {
  const storedBoard = localStorage.getItem(STORAGE_KEY);
  if (storedBoard) {
    try {
      const parsedBoard = JSON.parse(storedBoard);
      if (isBoardState(parsedBoard)) {
        return parsedBoard;
      } else {
        console.error("Invalid board state structure in localStorage.");
        return null;
      }
    } catch (error) {
      console.error("Failed to parse board state from localStorage:", error);
      return null;
    }
  }
  return null;
}

export function saveBoard(board: BoardState): void {
  try {
    const serializedBoard = JSON.stringify(board);
    localStorage.setItem(STORAGE_KEY, serializedBoard);
  } catch (error) {
    console.error("Failed to save board state to localStorage:", error);
  }
}

// type guard to check if an object is a valid BoardState
function isBoardState(obj: unknown): obj is BoardState {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  const boardState = obj as BoardState;
  return (
    typeof boardState.cards === "object" &&
    boardState.cards !== null &&
    typeof boardState.columns === "object" &&
    boardState.columns !== null &&
    Array.isArray(boardState.columnOrder)
  );
}

// Claude suggested improvements:
// 1. Use a versioning system for the stored board state to handle future changes in structure.
