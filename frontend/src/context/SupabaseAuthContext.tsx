import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import { supabase } from "../supabase/supabase";

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;

  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{
    error: Error | null;
  }>;

  signIn: (
    email: string,
    password: string
  ) => Promise<{
    error: Error | null;
  }>;

  signInWithGoogle: () => Promise<{
    error: Error | null;
  }>;

  signOut: () => Promise<{
    error: Error | null;
  }>;
}

const SupabaseAuthContext =
  createContext<SupabaseAuthContextType | null>(
    null
  );

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const {
      data: subscription,
    } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log(
  "SUPABASE AUTH EVENT:",
  event,
  currentSession?.user?.email ?? null
);
        if (!mounted) {
          return;
        }

        setSession(currentSession);
        setUser(
          currentSession?.user ?? null
        );

        if (
          event === "INITIAL_SESSION" ||
          event === "SIGNED_IN" ||
          event === "SIGNED_OUT"
        ) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signUp(
    email: string,
    password: string,
    name: string
  ) {
    const { error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

    return {
      error: error
        ? new Error(error.message)
        : null,
    };
  }

  async function signIn(
    email: string,
    password: string
  ) {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    return {
      error: error
        ? new Error(error.message)
        : null,
    };
  }

  async function signInWithGoogle() {
    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            `${window.location.origin}/dashboard`,
        },
      });

    return {
      error: error
        ? new Error(error.message)
        : null,
    };
  }

  async function signOut() {
    const { error } =
      await supabase.auth.signOut();

    return {
      error: error
        ? new Error(error.message)
        : null,
    };
  }

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context =
    useContext(SupabaseAuthContext);

  if (!context) {
    throw new Error(
      "useSupabaseAuth must be used inside SupabaseAuthProvider"
    );
  }

  return context;
}