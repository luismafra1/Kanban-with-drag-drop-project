import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import type { Card as CardData, Column as ColumnData } from "../types";
import { Card } from "./Card";

type ColumnProps = {
  column: ColumnData;
  cards: CardData[];
  onOpenCard: (cardId: string) => void;
  onOpenCreate?: () => void;
};

export function Column({
  column,
  cards,
  onOpenCard,
  onOpenCreate,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });
  return (
    <section
      ref={setNodeRef}
      aria-labelledby={`column-${column.id}`}
      className="bg-border flex flex-col p-2 h-3/10 sm:h-9/10 w-9/10 sm:w-3/10 border border-border rounded-sm gap-2"
    >
      <h2
        id={`column-${column.id}`}
        className="text-xl text-center font-bold border-b-2 border-accent-dark rounded-sm p-1 text-navy"
      >
        {column.title}
      </h2>
      <SortableContext items={cards.map((card) => card.id)}>
        <ul
          role="list"
          className="flex-auto flex sm:flex-col justify-start items-stretch sm:items-start rounded-sm gap-2 p-2 overflow-x-auto sm:overflow-y-auto"
        >
          {cards.map((card) => (
            <Card key={card.id} card={card} onOpen={onOpenCard} />
          ))}
        </ul>
      </SortableContext>

      {onOpenCreate && (
        <button
          type="button"
          onClick={onOpenCreate}
          className="bg-accent-dark text-navy rounded-sm p-1 hover:cursor-pointer font-semibold"
          aria-label={`Add card to ${column.title}`}
        >
          Add Card
        </button>
      )}
    </section>
  );
}
