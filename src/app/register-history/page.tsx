"use client";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

export default function RegisterHistory() {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center text-center py-3 gap-5">
      <h1 className="text-xl text-amber-700">Historyの追加・編集ページ</h1>
      <RegisterForm type="kiyos" />
      <RegisterForm type="amavin" />
    </div>
  );
}

function RegisterForm({ type }: { type: "kiyos" | "amavin" }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [contentKey, setContentKey] = useState([{ id: nanoid() }]);

  function handleClickAddContent() {
    setContentKey((prev) => [...prev, { id: nanoid() }]);
  }

  function handleClickDeleteContent(index: number) {
    setContentKey((prev) => prev.toSpliced(index, 1));
  }

  return (
    <form className="w-[90%] h-fit bg-blue-900/10 rounded shadow-md shadow-black/20 flex flex-col items-center gap-2 py-3">
      <h3>{type === "kiyos" ? "Kiyos Celler" : "Artisan Mariage Vineyards"}</h3>
      <DateSelect type="year" curYearOrMonth={year} />
      <DateSelect type="month" curYearOrMonth={month} />
      {contentKey.map((data, i) => (
        <Content
          key={data.id}
          i={i}
          onClickDelete={() => handleClickDeleteContent(i)}
        />
      ))}
      <button
        className="w-fit bg-orange-400 text-white px-1 text-sm rounded transition-all duration-150 hover:-translate-y-px mt-5"
        onClick={handleClickAddContent}
      >
        + 出来事を追加
      </button>
    </form>
  );
}

function DateSelect({
  type,
  curYearOrMonth,
}: {
  type: "year" | "month";
  curYearOrMonth: number;
}) {
  const btnArrowClassName =
    " w-4.5 aspect-square bg-[url('/arrow.svg')] bg-center bg-no-repeat bg-contain";
  const btnLeftArrowClassName = `${btnArrowClassName} rotate-180`;
  return (
    <div className="flex flex-row gap-4">
      <div className="bg-white py-0.5 px-1 rounded-sm flex flex-row gap-3">
        <button className={btnLeftArrowClassName}></button>
        <p>{curYearOrMonth}</p>
        <button className={btnArrowClassName}></button>
      </div>
      <p>{type === "year" ? "年" : "月"}</p>
    </div>
  );
}

function Content({
  i,
  onClickDelete,
}: {
  i: number;
  onClickDelete: () => void;
}) {
  const [imageKey, setImageKey] = useState([{ id: nanoid() }]);

  return (
    <div className="relative w-[90%] h-fit mt-2">
      <button
        className="absolute text-2xl right-3 -top-1"
        onClick={onClickDelete}
      >
        ×
      </button>
      <h3>出来事 {i + 1}</h3>
      {imageKey.map((data, i) => (
        <ImageSelect key={data.id} i={i} />
      ))}
      <p>内容文（日本語）</p>
      <textarea></textarea>
      <p>内容文（英語）</p>
      <textarea></textarea>
    </div>
  );
}

function ImageSelect({ i }: { i: number }) {
  const inputClassName = "w-[70%] px-1 mt-1";
  return (
    <div className="text-sm mt-2">
      <p>画像 {i + 1}</p>
      <input
        name={`image${i + 1}`}
        type="file"
        accept="image/*"
        className={inputClassName}
      ></input>
      <input
        name={`image${i + 1}NameJa`}
        type="text"
        placeholder="画像の名前（日本語）"
        className={inputClassName}
      ></input>
      <input
        name={`image${i + 1}NameEn`}
        type="text"
        placeholder="画像の名前（英語）"
        className={inputClassName}
      ></input>
    </div>
  );
}
