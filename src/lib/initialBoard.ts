import type { BoardState } from "../types";

export const initialBoard: BoardState = {
  cards: {
    c1: { id: "c1", title: "Study React" },
    c2: { id: "c2", title: "Fix footer" },
  },
  columns: {
    todo: { id: "todo", title: "To do", cardIds: ["c1", "c2"] },
    doing: { id: "doing", title: "Doing", cardIds: [] },
    done: { id: "done", title: "Done", cardIds: [] },
  },
  columnOrder: ["todo", "doing", "done"],
};
