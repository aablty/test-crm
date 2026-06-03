import React, { useEffect, useRef, useState } from "react";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";
import Textarea from "../../../shared/ui/Textarea";
import { parseAxiosMessage } from "../../../shared/utils";
import { apiUpdateTask, type Task } from "../api";

type Props = {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdated: (t: Task) => void;
};

export default function UpdateTask({
  open,
  task,
  onClose,
  onUpdated,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => {
    setFormError("");
    onClose();
  };

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task) return;
    setFormError("");

    const formData = new FormData(e.currentTarget);
    const trimmedTitle = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!trimmedTitle) {
      setFormError("Название обязательно");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await apiUpdateTask(task.id, {
        title: trimmedTitle,
        description,
      });
      onUpdated(updated);
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
      <form
        key={task?.id ?? "empty"}
        onSubmit={submit}
        className="flex flex-col gap-3 p-4"
      >
        <h3 className="text-base font-semibold text-slate-900">
          Редактировать задачу
        </h3>

        <label className="text-sm font-medium text-slate-700">Название</label>
        <Input
          name="title"
          defaultValue={task?.title ?? ""}
          maxLength={255}
        />

        <label className="text-sm font-medium text-slate-700">Описание</label>
        <Textarea
          name="description"
          defaultValue={task?.description ?? ""}
          maxLength={1000}
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
            Сохранить
          </Button>
        </div>
      </form>
    </dialog>
  );
}
