import { useDndContext, useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import type { Card as CardData, Column as ColumnData } from "../types";
import { Card } from "./Card";

type ColumnProps = {
  column: ColumnData;
  cards: CardData[];
  onOpenCard: (cardId: string) => void;
};

export function Column({ column, cards, onOpenCard }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const { active, over } = useDndContext();
  const isTarget =
    active != null &&
    over !== null &&
    (over.id === column.id || cards.some((card) => card.id === over.id));
  return (
    <section
      ref={setNodeRef}
      aria-labelledby={`column-${column.id}`}
      className={`bg-border flex flex-col p-2 flex-1 min-h-0 min-w-0 border border-border rounded-sm gap-2 ${isTarget ? "ring-2 ring-accent-dark bg-accent-light/40" : ""}`}
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
    </section>
  );
}
