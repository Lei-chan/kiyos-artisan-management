"use client";
import { useActionState, useState } from "react";
import PMessage from "./Components/PMessage";
import { FormState } from "./lib/definitions";
import { login } from "./actions/login";
import Link from "next/link";
import LoginAddForm from "./Components/LoginAddForm";

export default function Home() {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    login,
    undefined,
  );

  return (
    <div className="w-screen h-screen text-center py-2 flex flex-col items-center justify-center gap-3">
      <h1 className="text-2xl">
        Kiyos Celler ＆ Artisan Mariage Vineyards
        <br />
        管理者ページ
      </h1>
      {isPending && <PMessage type="pending" message="認証しています..." />}
      {state?.error && <PMessage type="error" message={state.error.message} />}
      {state?.message && <PMessage type="success" message={state.message} />}
      <LoginAddForm type="login" action={action} />
    </div>
  );
}
