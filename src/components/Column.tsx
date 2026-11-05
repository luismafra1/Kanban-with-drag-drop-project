import { useState } from "react";
import type {
  AddCardHandler,
  Card as CardData,
  Column as ColumnData,
} from "../types";
import { Card } from "./Card";
import { CardFormDialog } from "./CardFormDialog";

type ColumnProps = {
  column: ColumnData;
  cards: CardData[];
  onAddCard: AddCardHandler;
};

export function Column({ column, cards, onAddCard }: ColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);

  return (
    <section
      aria-labelledby={`column-${column.id}`}
      className="bg-border flex flex-col p-2 h-3/10 sm:h-9/10 w-9/10 sm:w-3/10 border border-border rounded-sm gap-2"
    >
      <h2
        id={`column-${column.id}`}
        className="text-xl text-center font-bold border-b-2 border-accent-dark rounded-sm p-1 text-navy"
      >
        {column.title}
      </h2>
      <ul
        role="list"
        className="flex-auto flex sm:flex-col justify-start items-stretch sm:items-start rounded-sm gap-2 p-2 overflow-x-auto sm:overflow-y-auto"
      >
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setIsAddingCard(true)}
        className="bg-accent-dark text-navy rounded-sm p-1 hover:cursor-pointer font-semibold"
        aria-label={`Add card to ${column.title}`}
      >
        Add Card
      </button>
      {isAddingCard && (
        <CardFormDialog
          columnTitle={column.title}
          onSubmit={(title, description) =>
            onAddCard(column.id, title, description)
          }
          onClose={() => setIsAddingCard(false)}
        />
      )}
    </section>
  );
}
