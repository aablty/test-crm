import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";
import { setToken } from "../../../shared/store";
import { parseAxiosMessage } from "../../../shared/utils";
import { apiLogin } from "../api";

export function LogIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await apiLogin(form.email, form.password);
      if (response?.access_token) {
        setToken(response.access_token);
        navigate("/tasks", { replace: true });
      }
    } catch (error) {
      setError(parseAxiosMessage(error));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col items-center w-full max-w-xl">
        <h1 className="mb-4 text-xl font-semibold text-slate-900">Вход</h1>

        <form onSubmit={submit} className="flex flex-col gap-3 w-full max-w-xs">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Эл. почта
          </label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            autoComplete="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
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
            autoComplete="current-password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full min-h-9">
            Войти
          </Button>
        </form>

        <Link
          to="/signup"
          className="mt-4 inline-flex text-sm text-slate-700 underline-offset-4 hover:underline"
        >
          Зарегистрироваться
        </Link>
      </div>
    </main>
  );
}
