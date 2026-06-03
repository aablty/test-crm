import { apiClient } from "../../shared/apiClient";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  authorId?: string;
  createdAt: string;
  updatedAt: string;
}

export async function apiFetchTasks(): Promise<Task[]> {
  const response = await apiClient.get("/tasks");
  return response.data;
}

export async function apiCreateTask(payload: {
  title: string;
  description?: string;
}) {
  const response = await apiClient.post("/tasks", payload);
  return response.data;
}

export async function apiUpdateTask(id: string, payload: Partial<Task>) {
  const response = await apiClient.patch(`/tasks/${id}`, payload);
  return response.data;
}

export async function apiDeleteTask(id: string) {
  const response = await apiClient.delete(`/tasks/${id}`);
  return response.data;
}
