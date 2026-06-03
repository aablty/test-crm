import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";
import { setToken } from "../../../shared/store";
import { parseAxiosMessage } from "../../../shared/utils";
import { apiRegister } from "../api";

export function SignUp() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiRegister(form.email.trim(), form.password);
      if (!response?.access_token) {
        setError("Сервер не вернул access token");
        return;
      }

      setToken(response.access_token);
      void navigate("/tasks", { replace: true });
    } catch (error) {
      setError(parseAxiosMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-xl flex-col items-center">
        <h1 className="mb-4 text-xl font-semibold text-slate-900">
          Регистрация
        </h1>

        <form onSubmit={submit} className="flex w-full max-w-xs flex-col gap-3">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Эл. почта
          </label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />

          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Пароль
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Введите пароль"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
          />

          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700"
          >
            Повторите пароль
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((p) => ({ ...p, confirmPassword: e.target.value }))
            }
          />

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button type="submit" className="min-h-9 w-full" disabled={submitting}>
            Зарегистрироваться
          </Button>
        </form>

        <Link
          to="/login"
          className="mt-4 inline-flex text-sm text-slate-700 underline-offset-4 hover:underline"
        >
          Войти в аккаунт
        </Link>
      </div>
    </main>
  );
}
