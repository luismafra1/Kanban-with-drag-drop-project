import type { BoardState } from "../types";

export const initialBoard: BoardState = {
  cards: {
    c1: {
      id: "c1",
      title: "Study React",
      description: "Read the docs and build a small project.",
    },
    c2: {
      id: "c2",
      title: "Update third-party dependencies",
      description: "asdasdasdasdaddasdasdasdasdasdasdasdasdasdasdasdasdasdasd",
    },
    c3: {
      id: "c3",
      title: "Write documentation",
      description: "Document the new API endpoints.",
    },
    c4: {
      id: "c4",
      title: "Refactor code",
      description: "Refactor the user authentication module.",
    },
    c5: {
      id: "c5",
      title: "Update dependencies",
      description: "Update all npm dependencies to their latest versions.",
    },
    c6: {
      id: "c6",
      title: "Fix bug",
    },
    c7: {
      id: "c7",
      title: "Add new feature",
      description: "Implement the new feature request.",
    },
    c8: {
      id: "c8",
      title: "Optimize performance",
    },
    c9: {
      id: "c9",
      title: "Testing",
      description: "Write tests for the new functionality.",
    },
    c10: {
      id: "c10",
      title: "Foo Bar",
      description: "This is a sample card for testing purposes.",
    },
  },
  columns: {
    todo: {
      id: "todo",
      title: "To do",
      cardIds: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10"],
    },
    doing: { id: "doing", title: "Doing", cardIds: [] },
    done: { id: "done", title: "Done", cardIds: [] },
  },
  columnOrder: ["todo", "doing", "done"],
};
