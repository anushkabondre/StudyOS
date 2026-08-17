import {
  useState,
  type FormEvent,
} from "react";

import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
} from "lucide-react";

import { useAuthContext } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    login,
    loginWithGoogle,
  } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      setError(getFirebaseError(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    try {
      await loginWithGoogle();

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      setError(getFirebaseError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[90vh] max-w-md items-center justify-center">

        <div className="w-full">

          <Link
            to="/"
            className="mb-10 block text-center text-2xl font-bold"
          >
            StudyOS
          </Link>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">

            <div className="mb-8">
              <h1 className="text-3xl font-bold">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Sign in to continue to StudyOS.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 pl-11 pr-4 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="••••••••"
                    required
                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950 pl-11 pr-12 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-xs text-slate-600">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              Continue with Google
            </button>

            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Create one
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

function getFirebaseError(error: any) {
  switch (error?.code) {
    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/user-not-found":
      return "No account exists with this email.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";

    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";

    default:
      return "Unable to sign in. Please try again.";
  }
}