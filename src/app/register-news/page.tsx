"use client";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { FormState, Group, NewsData } from "../lib/definitions";
import { createUpdateNews, deleteNews } from "../actions/registerNews";
import PMessage from "../Components/PMessage";
import { getNews } from "../lib/dal";
import { wait } from "../lib/helper";
import { nanoid } from "nanoid";

export default function RegisterNews() {
  const [news, setNews] = useState<NewsData[]>();
  const [isNewFormOpen, setIsNewFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [refresKey, setRefreshKey] = useState(0);

  function handleToggleNewFormOpen() {
    setIsNewFormOpen(!isNewFormOpen);
  }

  function handleIncreaseRefreshKey() {
    setRefreshKey((prev) => prev + 1);
  }

  useEffect(() => {
    const assignNewsAndResetPage = async () => {
      setMessage("ロード中...");
      const newsData = await getNews();
      if (!newsData) {
        setMessage(
          "サーバーエラーが発生しました。後ほどもう一度お試し下さい🙇‍♂️",
        );
        return;
      }

      setMessage("");
      setIsNewFormOpen(false);
      setNews(newsData);
    };

    assignNewsAndResetPage();
  }, [refresKey]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center text-center pt-3 sm:pt-4 md:pt-5 lg:pt-6 xl:pt-7 2xl:pt-8 pb-7 gap-7">
      <h1 className="text-xl text-amber-700">お知らせの登録・編集ページ</h1>
      <div className="w-[18rem] flex flex-col items-center bg-yellow-100 rounded shadow-md shadow-black/20 py-3 mb-3">
        <h3 className="text-lg text-orange-600">登録済みのお知らせ</h3>
        <div className="w-[90%] my-2">
          {message && <p>{message}</p>}
          {news && news.length === 0 && <p>登録済みのお知らせはありません</p>}
          {news && news.length > 0 && (
            <ul className="flex flex-col items-center bg-white rounded">
              {news.map((n) => (
                <Form
                  key={nanoid()}
                  type="exist"
                  news={n}
                  updateUI={handleIncreaseRefreshKey}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
      {isNewFormOpen ? (
        <div className="w-[18rem]">
          <Form
            type="new"
            onClickClose={handleToggleNewFormOpen}
            updateUI={handleIncreaseRefreshKey}
          />
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

function Form({
  type,
  news,
  onClickClose,
  updateUI,
}: {
  type: "exist" | "new";
  news?: NewsData;
  onClickClose?: () => void;
  updateUI: () => void;
}) {
  const smallHeaderClassName = "text-amber-700";
  const sectionClassName = "w-[90%] flex flex-col items-center gap-2";
  const btnClassName =
    "w-fit transition-all duration-150 hover:-translate-y-0.5 text-white p-1 rounded leading-tight";

  const formRef = useRef<HTMLFormElement>(null);
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
  });
  const [isOpen, setIsOpen] = useState(type === "exist" ? false : true);
  const [successMessage, setSuccessMessage] = useState("");

  const [createUpdateState, createUpdateAction, createUpdateIsPending] =
    useActionState<FormState, NewsData>(createUpdateNews, undefined);
  const lastHandledCreateUpdateState = useRef<FormState>(null);

  const [deleteState, deleteAction, deleteIsPending] = useActionState<
    FormState,
    string
  >(deleteNews, undefined);
  const lastHandledDeleteState = useRef<FormState>(null);

  function scrollToTopOfForm() {
    const ref = formRef.current;
    if (!ref) return;

    ref.scrollIntoView({ behavior: "smooth" });
  }

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
          })
        : setData(news);
    assignNews();
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

  function handleDelete() {
    if (type === "new") return;
    scrollToTopOfForm();
    startTransition(() => deleteAction(data._id || ""));
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    scrollToTopOfForm();
    startTransition(() => createUpdateAction(data));
  }

  useEffect(() => {
    if (!createUpdateState?.message) return;
    if (lastHandledCreateUpdateState.current === createUpdateState) return;

    lastHandledCreateUpdateState.current = createUpdateState;

    const displayMessageAndUpdateUI = async () => {
      if (!createUpdateState?.message) return;
      setSuccessMessage(createUpdateState.message);
      await wait();
      setSuccessMessage("");
      updateUI();
    };

    displayMessageAndUpdateUI();
  }, [createUpdateState, updateUI]);

  useEffect(() => {
    if (!deleteState?.message) return;
    if (lastHandledDeleteState.current === deleteState) return;

    lastHandledDeleteState.current = deleteState;

    const displayMessageAndUpdateUI = async () => {
      if (!deleteState?.message) return;
      setSuccessMessage(deleteState.message);
      await wait();
      setSuccessMessage("");
      updateUI();
    };

    displayMessageAndUpdateUI();
  }, [deleteState, updateUI]);

  return isOpen ? (
    <form
      ref={formRef}
      className={`relative w-full flex flex-col items-center gap-4 py-6 rounded scroll-m-6 ${type === "new" ? "bg-blue-900/20 shadow-md shadow-black/20" : ""}`}
      onSubmit={handleSubmit}
    >
      {createUpdateIsPending && (
        <PMessage type="pending" message="登録しています..." />
      )}
      {deleteIsPending && (
        <PMessage type="pending" message="削除しています..." />
      )}
      {(createUpdateState?.error || deleteState?.error) && (
        <PMessage
          type="error"
          message={
            createUpdateState?.error?.message ||
            deleteState?.error?.message ||
            ""
          }
        />
      )}
      {successMessage && <PMessage type="success" message={successMessage} />}

      <button
        className="absolute w-5 h-5 text-lg rounded-full bg-orange-500 hover:bg-orange-400 text-white flex flex-col justify-center items-center right-1 top-1"
        onClick={type === "exist" ? handleToggleOpen : onClickClose}
      >
        ×
      </button>
      <label>
        <span className={smallHeaderClassName}>日付 </span>{" "}
        <input
          name="date"
          type="date"
          placeholder="日付を選択"
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
      <div className="flex flex-row mt-2 gap-2">
        {type === "exist" && (
          <button
            type="button"
            className={`${btnClassName} bg-orange-500 hover:bg-orange-400`}
            onClick={handleDelete}
          >
            このお知らせを
            <br />
            削除
          </button>
        )}
        <button
          type="submit"
          className={`${btnClassName} bg-purple-600 hover:bg-purple-500`}
        >
          登録する
        </button>
      </div>
    </form>
  ) : (
    <li
      className="w-full cursor-pointer p-3 border-b last:border-0 border-black/20 hover:bg-black/10"
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
