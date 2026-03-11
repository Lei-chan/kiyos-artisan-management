"use client";
import { useState } from "react";

export default function LoginAddForm({
  type,
  action,
}: {
  type: "login" | "add";
  action: (formData: FormData) => void;
}) {
  const inputWrapperClassname = "relative w-[60%] flex flex-row items-center";
  const inputClassname = "px-2";

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  function handleTogglePassword() {
    setIsPasswordVisible(!isPasswordVisible);
  }

  function handleToggleKey() {
    setIsKeyVisible(!isKeyVisible);
  }

  return (
    <form
      action={action}
      className={`w-[90%] h-fit shadow-lg shadow-black/20 rounded-lg py-6 flex flex-col gap-4 items-center ${type === "login" ? "bg-amber-300" : "bg-orange-300"}`}
    >
      <h3 className="text-lg">
        {type === "login" ? "ログイン" : "管理者追加"}
      </h3>
      <input
        name="username"
        type="text"
        placeholder="ユーザーネーム"
        className={`${inputWrapperClassname} ${inputClassname}`}
      ></input>
      <div className={inputWrapperClassname}>
        <input
          name="password"
          type={isPasswordVisible ? "text" : "password"}
          placeholder="パスワード"
          className={`${inputClassname} w-full`}
        ></input>
        <button
          type="button"
          className={`absolute w-5.5 aspect-square bg-contain bg-center bg-no-repeat right-1 ${isPasswordVisible ? 'bg-[url("/eye-off.svg")]' : 'bg-[url("/eye.svg")]'}`}
          onClick={handleTogglePassword}
        ></button>
      </div>
      {type === "add" && (
        <div className={inputWrapperClassname}>
          <input
            name="key"
            type={isKeyVisible ? "text" : "password"}
            placeholder="key"
            className={`${inputClassname} w-full`}
          ></input>
          <button
            type="button"
            className={`absolute w-5.5 aspect-square bg-contain bg-center bg-no-repeat right-1 ${isKeyVisible ? 'bg-[url("/eye-off.svg")]' : 'bg-[url("/eye.svg")]'}`}
            onClick={handleToggleKey}
          ></button>
        </div>
      )}
      <button
        type="submit"
        className="w-fit bg-orange-500 px-1 rounded text-white"
      >
        OK
      </button>
    </form>
  );
}
