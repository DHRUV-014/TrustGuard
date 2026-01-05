import { useState } from "react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import { loginWithGoogle } from "./firebase";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const u = await loginWithGoogle();
    setUser(u);
  };

  return !user ? (
    <LandingPage onLogin={handleLogin} />
  ) : (
    <Dashboard user={user} />
  );
}