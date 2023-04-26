import { createContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import supabase from "../../../config/supabase";

export const AuthContext = createContext(null);

export default function AuthProvider() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   setSession(session);
    // });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session) {
        navigate("/");
      } else {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        session: session,
        onLogin: handleLogin,
        onLogout: handleLogout,
      }}
    >
      <Outlet />
    </AuthContext.Provider>
  );
}
