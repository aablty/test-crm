import Button from "../../../shared/ui/Button";
import type { Task } from "../api";

type Props = {
  task: Task;
  onNext: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
};

const statusLabels: Record<Task["status"], string> = {
  TODO: "К выполнению",
  IN_PROGRESS: "В процессе",
  DONE: "Готово",
};

const statusClasses: Record<Task["status"], string> = {
  TODO: "border-slate-300 bg-slate-50 text-slate-700",
  IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700",
  DONE: "border-green-200 bg-green-50 text-green-700",
};

export default function TaskItem({ task, onNext, onEdit, onDelete }: Props) {
  const createdAt = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(task.createdAt));

  return (
    <article className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {task.title}
          </h3>
          <span
            className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${statusClasses[task.status]}`}
          >
            {statusLabels[task.status]}
          </span>
        </div>
        {task.description && (
          <p className="mt-1 whitespace-pre-wrap break-all text-sm text-slate-600">
            {task.description}
          </p>
        )}
        <p className="mt-2 text-xs text-slate-400">Создана: {createdAt}</p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
        <Button
          onClick={() => onNext(task)}
          disabled={task.status === "DONE"}
          variant="secondary"
        >
          Далее
        </Button>
        <Button onClick={() => onEdit(task)} variant="secondary">
          Изменить
        </Button>
        <Button onClick={() => onDelete(task.id)} variant="danger">
          Удалить
        </Button>
      </div>
    </article>
  );
}
