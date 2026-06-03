import { Routes, Route, Navigate } from "react-router-dom";
import { useToken } from "./shared/store";
import { LogIn, SignUp } from "./features/auth/ui";
import Tasks from "./features/tasks/ui/Tasks";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/tasks"
          element={ProtectedRoute({ children: <Tasks /> })}
        />
      </Routes>
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
