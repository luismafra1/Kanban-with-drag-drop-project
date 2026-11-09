import type { BoardState } from "../types";

export const initialBoard: BoardState = {
  cards: {},
  columns: {
    todo: {
      id: "todo",
      title: "To do",
      cardIds: [],
    },
    doing: { id: "doing", title: "Doing", cardIds: [] },
    done: { id: "done", title: "Done", cardIds: [] },
  },
  columnOrder: ["todo", "doing", "done"],
};
