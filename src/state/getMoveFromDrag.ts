import type { BoardState, Column, MoveCardInput } from "../types";

export function getMoveFromDrag(
  board: BoardState,
  activeId: string,
  overId: string,
): MoveCardInput | null {
  if (activeId === overId) return null;

  const sourceColumnArr = Object.values(board.columns).filter((col) =>
    col.cardIds.includes(activeId),
  );

  const sourceColumn = sourceColumnArr[0];

  if (!sourceColumn) return null;

  let destination: Column | undefined;
  let destinationArr: Column[] | undefined;
  let destinationIndex: number;

  if (overId in board.columns) {
    destination = board.columns[overId];
    if (!destination) return null;
    destinationIndex =
      sourceColumn === destination
        ? destination.cardIds.length - 1
        : destination.cardIds.length;
  } else {
    destinationArr = Object.values(board.columns).filter((col) =>
      col.cardIds.includes(overId),
    );
    destination = destinationArr[0];
    if (!destination) return null;
    destinationIndex = destination.cardIds.indexOf(overId);
  }

  if (
    sourceColumn === destination &&
    sourceColumn.cardIds.indexOf(activeId) === destinationIndex
  ) {
    return null;
  }

  return {
    sourceColumnId: sourceColumn.id,
    destinationColumnId: destination?.id,
    cardId: activeId,
    destinationIndex: destinationIndex,
  };
}
