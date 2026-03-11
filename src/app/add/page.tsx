"use client";
import { useActionState } from "react";
import LoginAddForm from "../Components/LoginAddForm";
import add from "../actions/add";
import { FormState } from "../lib/definitions";
import PMessage from "../Components/PMessage";

export default function Add() {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    add,
    undefined,
  );

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-2">
      {isPending && <PMessage type="pending" message="追加しています..." />}
      {state?.error && <PMessage type="error" message={state.error.message} />}
      {state?.message && <PMessage type="success" message={state.message} />}
      <LoginAddForm type="add" action={action} />
    </div>
  );
}
