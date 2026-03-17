"use client";
import { useState } from "react";
import {
  MIN_EACH_PASSWORD,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "../lib/config";

export default function LoginAddForm({
  type,
  action,
}: {
  type: "login" | "add";
  action: (formData: FormData) => void;
}) {
  const pClassName = "w-[60%] text-sm text-black/70";
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
      className={`w-[18rem] h-fit shadow-lg shadow-black/20 rounded-lg py-6 flex flex-col gap-4 items-center ${type === "add" ? "sm:w-[20rem] md:w-[22rem]" : "sm:w-[320px]"} ${type === "login" ? "bg-amber-300" : "bg-orange-300"}`}
    >
      <h3 className="text-lg">
        {type === "login" ? "ログイン" : "管理者追加"}
      </h3>
      {type === "add" && (
        <p className={pClassName}>
          {MIN_USERNAME_LENGTH}文字以上で登録してください
        </p>
      )}
      <input
        name="username"
        type="text"
        placeholder="ユーザーネーム"
        className={`${inputWrapperClassname} ${inputClassname}`}
      ></input>
      {type === "add" && (
        <p className={pClassName}>
          {MIN_PASSWORD_LENGTH}文字以上、大文字、小文字、数字、記号をそれぞれ
          {MIN_EACH_PASSWORD}文字以上で登録してください
        </p>
      )}
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
