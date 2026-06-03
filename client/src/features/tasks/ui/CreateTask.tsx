import React, { useRef, useState } from "react";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";
import Textarea from "../../../shared/ui/Textarea";
import { parseAxiosMessage } from "../../../shared/utils";
import type { Task } from "../api";
import { apiCreateTask } from "../api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (task: Task) => void;
};

export default function CreateTask({ open, onClose, onCreated }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => {
    setFormError("");
    onClose();
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFormError("");

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFormError("Название обязательно");
      return;
    }

    setSubmitting(true);
    try {
      const task = await apiCreateTask({
        title: trimmedTitle,
        description: description.trim(),
      });
      onCreated(task);
      setTitle("");
      setDescription("");
      close();
    } catch (err) {
      setFormError(parseAxiosMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={close}
      className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md border border-slate-200 p-0 shadow-lg"
    >
      <form onSubmit={submit} className="flex flex-col gap-3 p-4">
        <h3 className="text-base font-semibold text-slate-900">
          Создать задачу
        </h3>

        <label className="text-sm font-medium text-slate-700">Название</label>
        <Input
          value={title}
          maxLength={255}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="text-sm font-medium text-slate-700">Описание</label>
        <Textarea
          value={description}
          maxLength={1000}
          onChange={(e) => setDescription(e.target.value)}
        />

        {formError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" onClick={close} variant="secondary">
            Отмена
          </Button>
          <Button type="submit" disabled={submitting}>
            Создать
          </Button>
        </div>
      </form>
    </dialog>
  );
}
