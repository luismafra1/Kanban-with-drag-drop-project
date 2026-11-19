import type { SubmitEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { MoveColumnOption } from "../types";

type CardFormDialogProps = {
  heading: string;
  submitLabel: string;
  initialTitle?: string;
  initialDescription?: string;
  onSubmit: (title: string, description: string) => void;
  onDelete?: () => void;
  onClose: () => void;
  moveColumns?: MoveColumnOption[];
  currentColumnId?: string;
  currentPosition?: number;
  onMove?: (destinationColumnId: string, destinationIndex: number) => void;
};

export function CardFormDialog({
  heading,
  submitLabel,
  initialTitle = "",
  initialDescription = "",
  onSubmit,
  onDelete,
  onClose,
  moveColumns,
  currentColumnId,
  currentPosition,
  onMove,
}: CardFormDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState("");
  const [destinationColumnId, setDestinationColumnId] = useState(
    currentColumnId ?? "",
  );
  const [position, setPosition] = useState<number | null>(null); //null = fim da coluna
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim() === "") {
      setTitle("");
      setError("Title is required");
      titleInputRef.current?.focus();
      return;
    }
    onSubmit(title, description);
    dialogRef.current?.close();
  };

  const destination = moveColumns?.find(
    (column) => column.id === destinationColumnId,
  );

  const slots = destination
    ? destination.cardCount + (destinationColumnId === currentColumnId ? 0 : 1)
    : 0;

  const defaultPosition =
    destinationColumnId === currentColumnId
      ? (currentPosition ?? 0)
      : slots - 1;

  const selectedPosition = position ?? defaultPosition;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="card-form-title"
      className="m-auto backdrop:bg-black/50 open:flex flex-col items-center gap-3 p-4 rounded-sm bg-navy text-white max-h-[90dvh] w-[min(90vw,32rem)]"
    >
      <h2 id="card-form-title" className="sm:text-xl font-bold flex-none">
        {heading}
      </h2>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex-auto flex flex-col gap-2 w-full bg-surface p-2 rounded-sm overflow-y-auto"
      >
        <label htmlFor="card-title" className="font-semibold text-navy">
          Title:
        </label>
        <input
          ref={titleInputRef}
          id="card-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          required
          className="w-auto p-1 rounded-sm text-navy bg-border border border-muted focus:outline-none focus:ring-2 focus:ring-accent-dark"
          aria-invalid={error !== ""}
          aria-describedby={error ? "card-title-error" : undefined}
          maxLength={80}
        />
        {error && (
          <p
            id="card-title-error"
            role="alert"
            className="text-red-700 text-sm"
          >
            {error}
          </p>
        )}
        <label htmlFor="card-description" className="font-semibold text-navy">
          Description:
        </label>
        <textarea
          id="card-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-auto p-1 rounded-sm text-navy bg-border min-h-24 flex-auto resize-none border border-muted focus:outline-none focus:ring-2 focus:ring-accent-dark"
          maxLength={300}
        />
        {onMove && moveColumns && (
          <fieldset className="flex flex-col gap-2 border-t border-muted pt-2">
            <legend className="font-semibold text-navy">Move card</legend>

            <label htmlFor="destination-column" className="text-navy">
              Column:
            </label>
            <select
              id="destination-column"
              value={destinationColumnId}
              onChange={(e) => {
                setDestinationColumnId(e.target.value);
                setPosition(null);
              }}
              className="p-1 rounded-sm text-navy bg-border border border-muted focus:outline-none focus:ring-2 focus:ring-accent-dark"
            >
              {moveColumns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>

            <label htmlFor="destination-position" className="text-navy">
              Position:
            </label>
            <select
              id="destination-position"
              value={selectedPosition}
              onChange={(e) => setPosition(Number(e.target.value))}
              className="p-1 rounded-sm text-navy bg-border border border-muted focus:outline-none focus:ring-2 focus:ring-accent-dark"
            >
              {Array.from({ length: slots }, (_, index) => (
                <option key={index} value={index}>
                  {index + 1}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                onMove(destinationColumnId, selectedPosition);
                dialogRef.current?.close();
              }}
              className="bg-accent-dark text-navy p-1 rounded-sm font-semibold cursor-pointer"
            >
              Move Card
            </button>
          </fieldset>
        )}
        <div className="flex justify-evenly gap-2 mt-auto pt-4 font-bold p-1 rounded-sm">
          <button
            className="bg-border text-navy p-1 rounded-sm border border-muted w-3/10 hover:cursor-pointer hover:bg-accent-light hover:text-navy"
            type="button"
            onClick={() => dialogRef.current?.close()}
          >
            Cancel
          </button>
          {onDelete && (
            <button
              className="bg-red-700 text-white p-1 rounded-sm w-3/10 hover:cursor-pointer hover:bg-red-800"
              type="button"
              onClick={onDelete}
            >
              Delete
            </button>
          )}
          <button
            className="bg-border text-navy p-1 rounded-sm border border-muted w-3/10 hover:cursor-pointer hover:bg-accent-light hover:text-navy"
            type="submit"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
}
