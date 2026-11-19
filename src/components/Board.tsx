import { useState } from "react";
import type {
  AddCardHandler,
  BoardState,
  Card as CardData,
  DeleteCardHandler,
  DialogState,
  MoveCardHandler,
  MoveColumnOption,
  UpdateCardHandler,
} from "../types";
import { CardFormDialog } from "./CardFormDialog";
import { Column } from "./Column";

type BoardProps = {
  board: BoardState;
  onAddCard: AddCardHandler;
  onDeleteCard: DeleteCardHandler;
  onUpdateCard: UpdateCardHandler;
  onMoveCard: MoveCardHandler;
};

export function Board({
  board,
  onAddCard,
  onDeleteCard,
  onUpdateCard,
  onMoveCard,
}: BoardProps) {
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const closeDialog = () => setDialogState(null);

  const dialogColumn =
    dialogState?.mode === "create"
      ? board.columns[dialogState.columnId]
      : undefined;

  const dialogCard =
    dialogState?.mode === "edit" ? board.cards[dialogState.cardId] : undefined;

  const dialogCardColumnId = dialogCard
    ? board.columnOrder.find((columnId) =>
        board.columns[columnId]?.cardIds.includes(dialogCard.id),
      )
    : undefined;

  const moveColumns: MoveColumnOption[] = board.columnOrder.flatMap(
    (columnId) => {
      const column = board.columns[columnId];
      return column
        ? [
            {
              id: column.id,
              title: column.title,
              cardCount: column.cardIds.length,
            },
          ]
        : [];
    },
  );

  const dialogCardIndex =
    dialogCard && dialogCardColumnId
      ? (board.columns[dialogCardColumnId]?.cardIds.indexOf(dialogCard.id) ?? 0)
      : 0;

  return (
    <div className="size-9/10 mx-auto bg-surface flex flex-col sm:flex-row justify-evenly items-center border border-border rounded-sm">
      {board.columnOrder.map((columnId, index) => {
        const column = board.columns[columnId];
        if (!column) return null;
        const cards = column.cardIds
          .map((cardId) => board.cards[cardId])
          .filter((card): card is CardData => card !== undefined);
        return (
          <Column
            key={column.id}
            column={column}
            cards={cards}
            onOpenCard={(cardId) => setDialogState({ mode: "edit", cardId })}
            onOpenCreate={
              index === 0
                ? () => setDialogState({ mode: "create", columnId: column.id })
                : undefined
            }
          />
        );
      })}

      {dialogColumn && (
        <CardFormDialog
          key={`create-${dialogColumn.id}`}
          heading={`Add card to: ${dialogColumn.title}`}
          submitLabel="Add card"
          onSubmit={(title, description) => {
            onAddCard(dialogColumn.id, title, description);
          }}
          onClose={closeDialog}
        />
      )}

      {dialogCard && dialogCardColumnId && (
        <CardFormDialog
          key={`edit-${dialogCard.id}`}
          heading={`Edit card: ${dialogCard.title}`}
          submitLabel="Update card"
          initialTitle={dialogCard.title}
          initialDescription={dialogCard.description ?? ""}
          onSubmit={(title, description) => {
            onUpdateCard(dialogCard.id, title, description);
          }}
          onDelete={() => {
            onDeleteCard(dialogCard.id);
            closeDialog();
          }}
          onClose={closeDialog}
          moveColumns={moveColumns}
          currentColumnId={dialogCardColumnId}
          currentPosition={dialogCardIndex}
          onMove={(destinationColumnId, destinationIndex) => {
            onMoveCard({
              sourceColumnId: dialogCardColumnId,
              destinationColumnId,
              cardId: dialogCard.id,
              destinationIndex,
            });
          }}
        />
      )}
    </div>
  );
}
