import { describe, expect, it } from "vitest";
import type { BoardState } from "../types";
import { getMoveFromDrag } from "./getMoveFromDrag";

const board: BoardState = {
  cards: {
    c1: { id: "c1", title: "A" },
    c2: { id: "c2", title: "B" },
    c3: { id: "c3", title: "C" },
    c4: { id: "c4", title: "D" },
  },
  columns: {
    todo: { id: "todo", title: "To do", cardIds: ["c1", "c2", "c3"] },
    doing: { id: "doing", title: "Doing", cardIds: ["c4"] },
    done: { id: "done", title: "Done", cardIds: [] },
  },
  columnOrder: ["todo", "doing", "done"],
};

describe("getMoveFromDrag", () => {
  it("moves down inside the same column when dropped over a card", () => {
    expect(getMoveFromDrag(board, "c1", "c3")).toEqual({
      sourceColumnId: "todo",
      destinationColumnId: "todo",
      cardId: "c1",
      destinationIndex: 2,
    });
  });

  it("moves up inside the same column when dropped over a card", () => {
    expect(getMoveFromDrag(board, "c3", "c1")).toEqual({
      sourceColumnId: "todo",
      destinationColumnId: "todo",
      cardId: "c3",
      destinationIndex: 0,
    });
  });

  it("returns null when dropped over itself", () => {
    expect(getMoveFromDrag(board, "c1", "c1")).toBeNull();
  });

  it("inserts before the card it was dropped over, in another column", () => {
    expect(getMoveFromDrag(board, "c1", "c4")).toEqual({
      sourceColumnId: "todo",
      destinationColumnId: "doing",
      cardId: "c1",
      destinationIndex: 0,
    });
  });

  it("moves to an empty column", () => {
    expect(getMoveFromDrag(board, "c1", "done")).toEqual({
      sourceColumnId: "todo",
      destinationColumnId: "done",
      cardId: "c1",
      destinationIndex: 0,
    });
  });

  it("moves to the end of another column when dropped on the column", () => {
    expect(getMoveFromDrag(board, "c1", "doing")).toEqual({
      sourceColumnId: "todo",
      destinationColumnId: "doing",
      cardId: "c1",
      destinationIndex: 1,
    });
  });

  it("moves to the end of its own column when dropped on the column", () => {
    expect(getMoveFromDrag(board, "c1", "todo")).toEqual({
      sourceColumnId: "todo",
      destinationColumnId: "todo",
      cardId: "c1",
      destinationIndex: 2,
    });
  });

  it("returns null when the card is already at the end of its own column", () => {
    expect(getMoveFromDrag(board, "c3", "todo")).toBeNull();
  });

  it("returns null for unknown ids", () => {
    expect(getMoveFromDrag(board, "nope", "c1")).toBeNull();
    expect(getMoveFromDrag(board, "c1", "nope")).toBeNull();
  });
});
