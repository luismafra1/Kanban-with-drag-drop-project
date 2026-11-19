import type { Card as CardData } from "../types";

type CardProps = {
  card: CardData;
  onOpen: (cardId: string) => void;
};

export function Card({ card, onOpen }: CardProps) {
  return (
    <li className="shrink-0 w-40 sm:w-full">
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => onOpen(card.id)}
        className="flex w-full flex-col items-center bg-white text-navy shadow-sm rounded-sm p-2 font-medium text-center wrap-break-word cursor-pointer"
      >
        <span className="text-lg font-bold">{card.title}</span>
        {card.description && (
          <span className="mt-1 text-sm font-normal text-left line-clamp-2 sm:line-clamp-3 text-muted">
            {card.description}
          </span>
        )}
      </button>
    </li>
  );
}
