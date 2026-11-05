import type { SubmitEvent } from "react";
import { useEffect, useRef, useState } from "react";

type CardFormDialogProps = {
  columnTitle: string;
  onSubmit: (title: string, description: string) => void;
  onClose: () => void;
};

export function CardFormDialog({
  columnTitle,
  onSubmit,
  onClose,
}: CardFormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
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

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="card-form-title"
      className="m-auto backdrop:bg-black/50 open:flex flex-col items-center gap-3 p-4 rounded-sm bg-navy text-white max-h-[90dvh] w-[min(90vw,32rem)]"
    >
      <h2 id="card-form-title" className="sm:text-xl font-bold flex-none">
        <strong>Add card to:</strong> {columnTitle}
      </h2>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex-auto flex flex-col gap-2 w-full bg-surface p-2 rounded-sm overflow-y-auto"
      >
        <label htmlFor="card-title" className="font-semibold text-navy">
          New Card Title:
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
        <div className="flex justify-evenly gap-2 mt-auto pt-4 font-bold p-1 rounded-sm">
          <button
            className="bg-border text-navy p-1 rounded-sm border border-muted w-3/10 hover:cursor-pointer hover:bg-accent-light hover:text-navy"
            type="button"
            onClick={() => dialogRef.current?.close()}
          >
            Cancel
          </button>
          <button
            className="bg-border text-navy p-1 rounded-sm border border-muted w-3/10 hover:cursor-pointer hover:bg-accent-light hover:text-navy"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
    </dialog>
  );
}
