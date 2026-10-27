import type { Card as CardData } from "../types";

type CardProps = {
  card: CardData;
};

export function Card({ card }: CardProps) {
  return (
    <div className="bg-gray-400 rounded-sm w-auto h-4/5 sm:h-auto sm:w-4/5 p-2 font-medium text-center">
      <h3>{card.title}</h3>
      {card.description && <p>{card.description}</p>}
    </div>
  );
}
