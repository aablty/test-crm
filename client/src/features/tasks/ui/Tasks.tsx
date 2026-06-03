import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseAxiosMessage } from "../../../shared/utils";
import { apiDeleteTask, apiFetchTasks, apiUpdateTask, type Task } from "../api";
import CreateTask from "./CreateTask";
import TaskItem from "./TaskItem";
import UpdateTask from "./UpdateTask";
import Button from "../../../shared/ui/Button";
import { clearToken } from "../../../shared/store";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    const loadTasks = async () => {
      try {
        const data = await apiFetchTasks();
        if (!ignore) setTasks(data);
      } catch (error) {
        if (!ignore) setError(parseAxiosMessage(error));
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void loadTasks();

    return () => {
      ignore = true;
    };
  }, []);

  const handleNext = async (task: Task) => {
    const next =
      task.status === "TODO"
        ? "IN_PROGRESS"
        : task.status === "IN_PROGRESS"
          ? "DONE"
          : "DONE";

    try {
      const updated = await apiUpdateTask(task.id, { status: next });
      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? updated : item)),
      );
    } catch (error) {
      setError(parseAxiosMessage(error));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      setError(parseAxiosMessage(error));
    }
  };

  const handleOpenEdit = (task: Task) => {
    setEditing(task);
    setShowUpdate(true);
  };

  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 flex gap-2 items-center">
              Задачи
              <Button onClick={() => setShowCreate(true)}>Добавить</Button>
            </h1>
            <p className="text-sm text-slate-500">Всего: {tasks.length}</p>
          </div>
          <Button onClick={handleLogout} variant="danger">
            Выйти
          </Button>
        </div>

        {error && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-slate-500">Загрузка задач...</p>
        ) : tasks.length === 0 ? (
          <p className="rounded-md border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">
            Задач пока нет
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onNext={handleNext}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <CreateTask
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={(task) => setTasks((prev) => [task, ...prev])}
        />
        <UpdateTask
          open={showUpdate}
          task={editing}
          onClose={() => {
            setShowUpdate(false);
            setEditing(null);
          }}
          onUpdated={(task) => {
            setTasks((prev) =>
              prev.map((item) => (item.id === task.id ? task : item)),
            );
            setShowUpdate(false);
            setEditing(null);
          }}
        />
      </div>
    </main>
  );
}
