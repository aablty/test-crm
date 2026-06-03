import { AxiosError } from "axios";

export const parseAxiosMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  }
  return "Неизвестная ошибка";
};
