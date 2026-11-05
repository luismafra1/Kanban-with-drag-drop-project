import type { SubmitEvent } from "react";
import { useEffect, useRef, useState } from "react";

type CardFormDialogProps = {
  columnTitle: string;
  onSubmit: (title: string, description?: string) => void;
  onClose: () => void;
};

export function CardFormDialog({
  columnTitle,
  onSubmit,
  onClose,
}: CardFormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim() === "") return; // Prevent submission if title is empty
    onSubmit(title, description);
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="card-form-title"
      className="m-auto backdrop:bg-black/50 flex flex-col items-center gap-3 p-4 rounded-sm bg-navy text-white w-2/3 h-1/2"
    >
      <h2 id="card-form-title" className="sm:text-xl font-bold flex-none">
        <strong>Add card to:</strong> {columnTitle}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex-auto flex flex-col gap-2 w-full bg-surface p-2 rounded-sm"
      >
        <label htmlFor="card-title" className="font-semibold text-navy">
          New Card Title:
        </label>
        <input
          id="card-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-auto p-1 rounded-sm text-navy bg-border border border-muted focus:outline-none focus:ring-2 focus:ring-accent-light"
        />
        <label htmlFor="card-description" className="font-semibold text-navy">
          Description:
        </label>
        <textarea
          id="card-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-auto p-1 rounded-sm text-navy bg-border h-3/10 border border-muted focus:outline-none focus:ring-2 focus:ring-accent-light"
        />
        <div className="flex justify-evenly gap-2 mt-20 font-bold p-1 rounded-sm">
          <button
            className="bg-border text-navy p-1 rounded-sm border border-muted w-3/10 hover:cursor-pointer hover:bg-accent-dark hover:text-white"
            type="button"
            onClick={() => dialogRef.current?.close()}
          >
            Cancel
          </button>
          <button
            className="bg-border text-navy p-1 rounded-sm border border-muted w-3/10 hover:cursor-pointer hover:bg-accent-dark hover:text-white"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
    </dialog>
  );
}
