import { io } from "socket.io-client";
import { getToken } from "../../shared/store";
import type { Task } from "./api";

export type TaskStatusChangedEvent = {
  id: string;
  status: Task["status"];
  timestamp: string;
};

export type TaskDeletedEvent = {
  id: string;
  timestamp: string;
};

export function connectTasksSocket() {
  const token = getToken();

  if (!token) return null;

  return io(import.meta.env.VITE_API_URL, {
    auth: { token },
    transports: ["websocket"],
  });
}
