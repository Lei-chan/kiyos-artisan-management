"use client";
import { useEffect, useState } from "react";
import { Group, NewsData } from "../lib/definitions";

export default function RegisterNews() {
  const [news, setNews] = useState<NewsData[]>([
    {
      date: "2025-10-07",
      type: "both",
      content: {
        title: {
          en: "OO is released!",
          ja: "OOがリリースされました！",
        },
        sentence: {
          en: ["OO is released!", "Please check the link out!"],
          ja: ["OOがリリースされました！", "リンクからご確認ください！"],
        },
        link: "sssss",
      },
      lastModifiedUserId: "",
    },
  ]);
  const [isNewFormOpen, setIsNewFormOpen] = useState(false);

  function handleToggleNewFormOpen() {
    setIsNewFormOpen(!isNewFormOpen);
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center text-center pt-3 sm:pt-4 md:pt-5 lg:pt-6 xl:pt-7 2xl:pt-8 pb-7 gap-7">
      <h1 className="text-xl text-amber-700">お知らせの登録・編集ページ</h1>
      <div className="w-[18rem] flex flex-col items-center bg-yellow-100 rounded shadow-md shadow-black/20 py-3 mb-3">
        <h3 className="text-lg text-orange-600">登録済みのお知らせ</h3>
        <ul className="w-[90%] my-2 flex flex-col items-center bg-white rounded">
          {news ? (
            news.map((n, i) => <Form key={i} type="exist" news={n} />)
          ) : (
            <p>登録済みのお知らせはありません</p>
          )}
        </ul>
      </div>
      {isNewFormOpen ? (
        <div className="w-[18rem]">
          <Form type="new" />
        </div>
      ) : (
        <button
          className="bg-yellow-500 hover:bg-yellow-400 transition-all duration-150 text-white p-1.5 shadow shadow-black/20 rounded leading-tight"
          onClick={handleToggleNewFormOpen}
        >
          新しくお知らせを
          <br />
          登録する
        </button>
      )}
    </div>
  );
}

function Form({ type, news }: { type: "exist" | "new"; news?: NewsData }) {
  const smallHeaderClassName = "text-amber-700";
  const sectionClassName = "w-[90%] flex flex-col items-center gap-2";
  const [data, setData] = useState<NewsData>({
    date: "",
    type: "kiyos",
    content: {
      title: {
        en: "",
        ja: "",
      },
      sentence: {
        en: [],
        ja: [],
      },
      link: "",
    },
    lastModifiedUserId: "",
  });
  const [isOpen, setIsOpen] = useState(type === "exist" ? false : true);

  useEffect(() => {
    const assignNews = () =>
      !news
        ? setData({
            date: "",
            type: "kiyos",
            content: {
              title: {
                en: "",
                ja: "",
              },
              sentence: {
                en: [],
                ja: [],
              },
              link: "",
            },
            lastModifiedUserId: "",
          })
        : setData(news);
    assignNews();
    console.log(new Date().toISOString());
  }, [news]);

  function handleToggleOpen() {
    setIsOpen(!isOpen);
  }

  function handleChangeDate(e: React.ChangeEvent<HTMLInputElement>) {
    const curTarget = e.currentTarget;

    setData({ ...data, date: curTarget.value });
  }

  function handleChangeCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const curTarget = e.currentTarget;
    if (!curTarget.checked) return;

    setData({ ...data, type: curTarget.name as Group | "both" });
  }

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const curTarget = e.currentTarget;

    setData((prev) => {
      const newData = { ...prev };
      newData.content.title[curTarget.name.includes("Ja") ? "ja" : "en"] =
        curTarget.value;
      return newData;
    });
  }

  function handleChangeTextarea(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const curTarget = e.currentTarget;

    setData((prev) => {
      const newData = { ...prev };
      newData.content.sentence[curTarget.name.includes("Ja") ? "ja" : "en"] =
        curTarget.value.split("\n");
      return newData;
    });
  }

  function handleChangeLink(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    setData((prev) => {
      const newData = { ...prev };
      newData.content.link = value;
      return newData;
    });
  }

  return isOpen ? (
    <form
      className={`relative w-full flex flex-col items-center gap-4 py-6 rounded ${type === "new" ? "bg-blue-900/20 shadow-md shadow-black/20" : ""}`}
    >
      {type === "exist" && (
        <button
          className="absolute w-5 h-5 text-lg rounded-full bg-orange-500 hover:bg-orange-400 text-white flex flex-col justify-center right-1 top-1"
          onClick={handleToggleOpen}
        >
          ×
        </button>
      )}
      <label>
        <span className={smallHeaderClassName}>日付 </span>{" "}
        <input
          name="date"
          type="date"
          value={data.date}
          onChange={handleChangeDate}
        ></input>
      </label>
      <div className={sectionClassName}>
        <h4 className={smallHeaderClassName}>お知らせの種類</h4>
        <div className="flex flex-row justify-center gap-3">
          <Checkbox
            type="kiyos"
            checkedType={data.type}
            onChangeInput={handleChangeCheckbox}
          />
          <Checkbox
            type="amavin"
            checkedType={data.type}
            onChangeInput={handleChangeCheckbox}
          />
          <Checkbox
            type="both"
            checkedType={data.type}
            onChangeInput={handleChangeCheckbox}
          />
        </div>
      </div>
      <Title
        type="ja"
        title={data.content.title}
        sectionClassName={sectionClassName}
        smallHeaderClassName={smallHeaderClassName}
        onChangeInput={handleChangeTitle}
      />
      <Title
        type="en"
        title={data.content.title}
        sectionClassName={sectionClassName}
        smallHeaderClassName={smallHeaderClassName}
        onChangeInput={handleChangeTitle}
      />
      <Sentence
        type="ja"
        sentence={data.content.sentence}
        sectionClassName={sectionClassName}
        smallHeaderClassName={smallHeaderClassName}
        onChangeTextarea={handleChangeTextarea}
      />
      <Sentence
        type="en"
        sentence={data.content.sentence}
        sectionClassName={sectionClassName}
        smallHeaderClassName={smallHeaderClassName}
        onChangeTextarea={handleChangeTextarea}
      />
      <div className={sectionClassName}>
        <h4 className={smallHeaderClassName}>添付したいリンク</h4>
        <input
          name="link"
          type="url"
          value={data.content.link}
          placeholder="URL"
          onChange={handleChangeLink}
        ></input>
      </div>
      <button className="w-fit bg-purple-600 hover:bg-purple-500 transition-all duration-150 hover:-translate-y-0.5 text-white px-1 rounded mt-2">
        登録する
      </button>
    </form>
  ) : (
    <li
      className="w-full cursor-pointer p-3 border-b-2 last:border-0 border-black/20"
      onClick={handleToggleOpen}
    >
      <p>{news?.date}</p>
      <p className="overflow-hidden text-ellipsis whitespace-nowrap">
        <span
          className={`mr-2 rounded text-white py-0.5 px-1 text-sm ${news?.type === "kiyos" ? "bg-yellow-500" : news?.type === "amavin" ? "bg-pink-500" : "bg-amber-600"}`}
        >
          {news?.type === "both" ? "共通" : news?.type}
        </span>
        {news?.content?.title.ja}
      </p>
    </li>
  );
}

function Checkbox({
  type,
  checkedType,
  onChangeInput,
}: {
  type: Group | "both";
  checkedType: Group | "both";
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  console.log(checkedType);
  return (
    <label>
      {type === "both" ? "両方" : type.at(0)?.toUpperCase() + type.slice(1)}{" "}
      <input
        name={type}
        type="checkbox"
        checked={type === checkedType}
        className=""
        onChange={onChangeInput}
      ></input>
    </label>
  );
}

function Title({
  type,
  title,
  sectionClassName,
  smallHeaderClassName,
  onChangeInput,
}: {
  type: "ja" | "en";
  title: { en: string; ja: string };
  sectionClassName: string;
  smallHeaderClassName: string;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const language = type === "ja" ? "日本語" : "英語";
  return (
    <div className={sectionClassName}>
      <p className={smallHeaderClassName}>{language}の題名</p>
      <input
        name={`title${type === "ja" ? "Ja" : "En"}`}
        type="text"
        value={title[type]}
        placeholder={`題名（${language}）`}
        onChange={onChangeInput}
      ></input>
    </div>
  );
}

function Sentence({
  type,
  sentence,
  sectionClassName,
  smallHeaderClassName,
  onChangeTextarea,
}: {
  type: "ja" | "en";
  sentence: { en: string[]; ja: string[] };
  sectionClassName: string;
  smallHeaderClassName: string;
  onChangeTextarea: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  const language = type === "ja" ? "日本語" : "英語";
  return (
    <div className={sectionClassName}>
      <p className={smallHeaderClassName}>{language}の内容文</p>
      <textarea
        name={`sentence${type === "ja" ? "Ja" : "En"}`}
        value={sentence[type].join("\n")}
        placeholder={`内容（${language}）`}
        className="w-[80%] aspect-2/1"
        onChange={onChangeTextarea}
      ></textarea>
    </div>
  );
}
