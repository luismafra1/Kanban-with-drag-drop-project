import type {
  Announcements,
  CollisionDetection,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { getMoveFromDrag } from "../state/getMoveFromDrag";
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
import { CardPreview } from "./Card";
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
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const pendingFocusId = useRef<string | null>(null);
  const activeCard = activeCardId ? board.cards[activeCardId] : undefined;

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const collisionDetection: CollisionDetection = (args) => {
    const pointerHits = pointerWithin(args);
    const hits = pointerHits.length > 0 ? pointerHits : rectIntersection(args);
    const first = hits[0];
    if (!first) return [];

    const column = board.columns[String(first.id)];
    if (column && column.cardIds.length > 0) {
      const insideColumn = closestCenter({
        ...args,
        droppableContainers: args.droppableContainers.filter((container) =>
          column.cardIds.includes(String(container.id)),
        ),
      });
      if (insideColumn.length > 0) return insideColumn;
    }
    return hits;
  };

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveCardId(null);
    if (!over) return;
    const move = getMoveFromDrag(board, String(active.id), String(over.id));
    if (move) {
      pendingFocusId.current = String(active.id);
      onMoveCard(move);
    }
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveCardId(String(active.id));
  }

  const nameOf = (id: UniqueIdentifier) =>
    board.cards[String(id)]?.title ??
    board.columns[String(id)]?.title ??
    "item";

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up card ${nameOf(active.id)}`,
    onDragOver: ({ active, over }) =>
      over ? `Card ${nameOf(active.id)} is over ${nameOf(over.id)}` : undefined,
    onDragEnd: ({ active, over }) => {
      const move = over
        ? getMoveFromDrag(board, String(active.id), String(over.id))
        : null;
      const column = move ? board.columns[move.destinationColumnId] : undefined;
      return move && column
        ? `Card ${nameOf(active.id)} moved to ${column.title}, position ${move.destinationIndex + 1}.`
        : `Card ${nameOf(active.id)} was dropped and stayed in place`;
    },
    onDragCancel: ({ active }) =>
      `Dragging cancelled. Card ${nameOf(active.id)} was not moved.`,
  };

  useEffect(() => {
    if (!pendingFocusId.current) return;
    document
      .querySelector<HTMLElement>(`[data-handle="${pendingFocusId.current}"]`)
      ?.focus();
    pendingFocusId.current = null;
  }, [board]);

  const firstColumnId = board.columnOrder[0];
  const firstColumn = firstColumnId ? board.columns[firstColumnId] : undefined;

  return (
    <div className="size-9/10 mx-auto bg-surface flex flex-col border border-border rounded-sm">
      <div className="flex-1 min-h-0 flex flex-col sm:flex-row gap-2 p-2">
        <DndContext
          accessibility={{ announcements }}
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveCardId(null)}
        >
          {board.columnOrder.map((columnId) => {
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
                onOpenCard={(cardId) =>
                  setDialogState({ mode: "edit", cardId })
                }
              />
            );
          })}
          <DragOverlay dropAnimation={null}>
            {activeCard ? <CardPreview card={activeCard} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {firstColumn && (
        <div className="flex justify-center p-2">
          <button
            type="button"
            onClick={() =>
              setDialogState({ mode: "create", columnId: firstColumn.id })
            }
            aria-label={`Add card to ${firstColumn.title}`}
            className="bg-accent-dark text-navy rounded-sm px-6 py-1 font-semibold cursor-pointer"
          >
            Add Card
          </button>
        </div>
      )}

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
