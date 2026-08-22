import { useState } from "react";

import {
  useSupabaseAuth,
} from "../../context/SupabaseAuthContext";

export default function SupabaseAuthTest() {
  const {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  } = useSupabaseAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  async function handleSignup() {
    setMessage("");

    const { error } =
      await signUp(
        email,
        password,
        "Anu"
      );

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Supabase signup successful."
    );
  }

  async function handleLogin() {
    setMessage("");

    const { error } =
      await signIn(
        email,
        password
      );

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Supabase login successful."
    );
  }

  async function handleGoogle() {
    setMessage("");

    const { error } =
      await signInWithGoogle();

    if (error) {
      setMessage(error.message);
    }
  }

  async function handleLogout() {
    const { error } =
      await signOut();

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Logged out.");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <h1 className="text-2xl font-bold">
          Supabase Auth Test
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Temporary test screen — we will remove this later.
        </p>

        {user ? (
          <div className="mt-8 space-y-5">

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">
                Logged in as
              </p>

              <p className="mt-1 break-all font-medium">
                {user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold hover:bg-red-500"
            >
              Logout
            </button>

          </div>
        ) : (
          <div className="mt-8 space-y-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
            />

            <button
              type="button"
              onClick={handleSignup}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500"
            >
              Sign Up
            </button>

            <button
              type="button"
              onClick={handleLogin}
              className="w-full rounded-xl border border-slate-700 px-4 py-3 font-semibold hover:bg-slate-800"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleGoogle}
              className="w-full rounded-xl border border-slate-700 px-4 py-3 font-semibold hover:bg-slate-800"
            >
              Continue with Google
            </button>

          </div>
        )}

        {message && (
          <div className="mt-6 rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
            {message}
          </div>
        )}

      </div>
    </div>
  );
}