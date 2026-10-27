import type { Card as CardData, Column as ColumnData } from "../types";
import { Card } from "./Card";

type ColumnProps = {
  column: ColumnData;
  cards: CardData[];
};

export function Column({ column, cards }: ColumnProps) {
  return (
    <div className="bg-gray-200 flex flex-col p-2 h-3/10 sm:h-9/10 w-9/10 sm:w-1/4 outline-1 outline-purple-300 rounded-sm gap-2">
      <h2 className="text-xl text-center font-bold bg-yellow-300 rounded-sm p-1">
        {column.title}
      </h2>
      <div className="flex-auto bg-green-900 flex sm:flex-col justify-start items-center rounded-sm gap-2 pl-2 sm:pt-2 sm:px-2">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
