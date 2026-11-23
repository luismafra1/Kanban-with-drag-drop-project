import type { BoardState, MoveCardInput } from "../types";

export function getMoveFromDrag(
  board: BoardState,
  activeId: string,
  overId: string,
): MoveCardInput | null {
  if (activeId === overId) return null;

  const columns = Object.values(board.columns);
  const source = columns.find((col) => col.cardIds.includes(activeId));
  if (!source) return null;

  const overColumn = columns.find((col) => col.id === overId);
  const destination =
    overColumn ?? columns.find((col) => col.cardIds.includes(overId));
  if (!destination) return null;

  const destinationIndex = overColumn
    ? destination.cardIds.length - (source.id === destination.id ? 1 : 0)
    : destination.cardIds.indexOf(overId);

  if (
    source.id === destination.id &&
    source.cardIds.indexOf(activeId) === destinationIndex
  ) {
    return null;
  }

  return {
    sourceColumnId: source.id,
    destinationColumnId: destination.id,
    cardId: activeId,
    destinationIndex,
  };
}
