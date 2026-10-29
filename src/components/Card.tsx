import type { Card as CardData } from "../types";

type CardProps = {
  card: CardData;
};

export function Card({ card }: CardProps) {
  return (
    <li className="shrink-0 bg-white text-navy shadow-sm rounded-sm w-40 sm:w-full p-2 font-medium text-center wrap-break-word">
      <h3 className="text-lg font-bold">{card.title}</h3>
      {card.description && (
        <p className="mt-1 text-sm font-normal text-left line-clamp-2 sm:line-clamp-3 text-muted">
          {card.description}
        </p>
      )}
    </li>
  );
}
