import { describe, expect, it } from "vitest";
import type { BoardState } from "../types";
import { boardReducer } from "./boardReducer";

const state: BoardState = {
  cards: {
    c1: { id: "c1", title: "A" },
    c2: { id: "c2", title: "B" },
    c3: { id: "c3", title: "C" },
    c4: { id: "c4", title: "D", description: "Original description" },
  },
  columns: {
    todo: { id: "todo", title: "To do", cardIds: ["c1", "c2", "c3"] },
    doing: { id: "doing", title: "Doing", cardIds: ["c4"] },
    done: { id: "done", title: "Done", cardIds: [] },
  },
  columnOrder: ["todo", "doing", "done"],
};

// Cada card deve aparecer em exatamente uma coluna, e nenhuma coluna
// pode apontar para um card que não existe.
function expectConsistent(s: BoardState) {
  const ids = s.columnOrder.flatMap((id) => s.columns[id]?.cardIds ?? []);
  expect(new Set(ids).size).toBe(ids.length);
  expect([...ids].sort()).toEqual(Object.keys(s.cards).sort());
}

function move(cardId: string, from: string, to: string, index: number) {
  return boardReducer(state, {
    type: "MOVE_CARD",
    payload: {
      sourceColumnId: from,
      destinationColumnId: to,
      cardId,
      destinationIndex: index,
    },
  });
}

describe("ADD_CARD", () => {
  it("adds the card to cards and to the end of the column", () => {
    const card = { id: "c5", title: "E" };
    const next = boardReducer(state, {
      type: "ADD_CARD",
      payload: { columnId: "doing", card },
    });

    expect(next.cards.c5).toEqual(card);
    expect(next.columns.doing?.cardIds).toEqual(["c4", "c5"]);
    expectConsistent(next);
  });

  it("returns the same state when the column does not exist", () => {
    const next = boardReducer(state, {
      type: "ADD_CARD",
      payload: { columnId: "nope", card: { id: "c5", title: "E" } },
    });

    expect(next).toBe(state);
  });
});

describe("DELETE_CARD", () => {
  it("removes the card from cards and from every column", () => {
    const next = boardReducer(state, {
      type: "DELETE_CARD",
      payload: { cardId: "c1" },
    });

    expect(next.cards.c1).toBeUndefined();
    expect(next.columns.todo?.cardIds).toEqual(["c2", "c3"]);
    expectConsistent(next);
  });

  it("does not mutate the original state", () => {
    const copy = structuredClone(state);
    boardReducer(state, { type: "DELETE_CARD", payload: { cardId: "c1" } });
    expect(state).toEqual(copy);
  });

  it("returns the same state when the card does not exist", () => {
    const next = boardReducer(state, {
      type: "DELETE_CARD",
      payload: { cardId: "nope" },
    });

    expect(next).toBe(state);
  });
});

describe("UPDATE_CARD", () => {
  it("updates the title and keeps the description", () => {
    const next = boardReducer(state, {
      type: "UPDATE_CARD",
      payload: { cardId: "c4", title: "New title" },
    });

    expect(next.cards.c4).toEqual({
      id: "c4",
      title: "New title",
      description: "Original description",
    });
  });

  it("updates the description and keeps the title", () => {
    const next = boardReducer(state, {
      type: "UPDATE_CARD",
      payload: { cardId: "c1", description: "Now it has one" },
    });

    expect(next.cards.c1).toEqual({
      id: "c1",
      title: "A",
      description: "Now it has one",
    });
  });

  it("clears the description when an empty string is sent", () => {
    const next = boardReducer(state, {
      type: "UPDATE_CARD",
      payload: { cardId: "c4", description: "" },
    });

    expect(next.cards.c4?.description).toBe("");
  });

  it("returns the same state when the card does not exist", () => {
    const next = boardReducer(state, {
      type: "UPDATE_CARD",
      payload: { cardId: "nope", title: "X" },
    });

    expect(next).toBe(state);
  });
});

describe("MOVE_CARD", () => {
  it("reorders a card down inside the same column", () => {
    const next = move("c1", "todo", "todo", 2);

    expect(next.columns.todo?.cardIds).toEqual(["c2", "c3", "c1"]);
    expectConsistent(next);
  });

  it("reorders a card up inside the same column", () => {
    const next = move("c3", "todo", "todo", 0);

    expect(next.columns.todo?.cardIds).toEqual(["c3", "c1", "c2"]);
    expectConsistent(next);
  });

  it("keeps the order when moved to its own position", () => {
    const next = move("c2", "todo", "todo", 1);

    expect(next.columns.todo?.cardIds).toEqual(["c1", "c2", "c3"]);
    expectConsistent(next);
  });

  it("moves a card to an empty column", () => {
    const next = move("c1", "todo", "done", 0);

    expect(next.columns.todo?.cardIds).toEqual(["c2", "c3"]);
    expect(next.columns.done?.cardIds).toEqual(["c1"]);
    expectConsistent(next);
  });

  it("moves a card to another column, at the start", () => {
    const next = move("c1", "todo", "doing", 0);

    expect(next.columns.doing?.cardIds).toEqual(["c1", "c4"]);
    expectConsistent(next);
  });

  it("moves a card to another column, at the end", () => {
    const next = move("c1", "todo", "doing", 1);

    expect(next.columns.doing?.cardIds).toEqual(["c4", "c1"]);
    expectConsistent(next);
  });

  it("moves a card to another column, in the middle", () => {
    const next = move("c4", "doing", "todo", 1);

    expect(next.columns.todo?.cardIds).toEqual(["c1", "c4", "c2", "c3"]);
    expect(next.columns.doing?.cardIds).toEqual([]);
    expectConsistent(next);
  });

  it("clamps an index that is too large to the end of the list", () => {
    const next = move("c1", "todo", "todo", 99);

    expect(next.columns.todo?.cardIds).toEqual(["c2", "c3", "c1"]);
    expectConsistent(next);
  });

  it("clamps a negative index to the start of the list", () => {
    const next = move("c3", "todo", "todo", -5);

    expect(next.columns.todo?.cardIds).toEqual(["c3", "c1", "c2"]);
    expectConsistent(next);
  });

  it("returns the same state when the card does not exist", () => {
    expect(move("nope", "todo", "done", 0)).toBe(state);
  });

  it("returns the same state when a column does not exist", () => {
    expect(move("c1", "todo", "nope", 0)).toBe(state);
    expect(move("c1", "nope", "done", 0)).toBe(state);
  });

  it("returns the same state when the card is not in the source column", () => {
    expect(move("c1", "doing", "done", 0)).toBe(state);
  });

  it("does not mutate the original state", () => {
    const copy = structuredClone(state);
    move("c1", "todo", "doing", 0);
    expect(state).toEqual(copy);
  });
});
