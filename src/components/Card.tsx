import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card as CardData } from "../types";

type CardProps = {
  card: CardData;
  onOpen: (cardId: string) => void;
};

export function Card({ card, onOpen }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`shrink-0 w-40 sm:w-full flex items-stretch gap-1 ${isDragging ? "opacity-50" : ""}`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={`Drag card ${card.title}`}
        className="touch-none cursor-grab px-1 text-muted"
      >
        ⠿
      </button>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => onOpen(card.id)}
        className="flex min-w-0 flex-1 flex-col items-center bg-white text-navy shadow-sm rounded-sm p-2 font-medium text-center wrap-break-word cursor-pointer"
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

export function CardPreview({ card }: { card: CardData }) {
  return (
    <div className="flex h-full w-full cursor-grabbing flex-col items-center bg-white text-navy shadow-lg rounded-sm p-2 font-medium text-center wrap-break-word">
      <span className="text-lg font-bold">{card.title}</span>
      {card.description && (
        <span className="mt-1 text-sm font-normal text-left line-clamp-2 text-muted">
          {card.description}
        </span>
      )}
    </div>
  );
}
