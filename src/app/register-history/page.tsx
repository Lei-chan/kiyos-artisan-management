"use client";
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { nanoid } from "nanoid";
import PMessage from "../Components/PMessage";
import {
  DisplayMessageData,
  FormState,
  Group,
  HistoryContent,
  HistoryData,
  ImageData,
  RegisterHistoryData,
  SentenceData,
} from "../lib/definitions";
import { getHistoryForDate } from "../lib/dal";
import { registerHistory } from "../actions/registerHistory";
import { wait } from "../lib/helper";
import Image from "next/image";

export default function RegisterHistory() {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center text-center pt-3 pb-7 gap-5">
      <h1 className="text-xl text-amber-700">Historyの追加・編集ページ</h1>
      <RegisterForm type="kiyos" />
      <RegisterForm type="amavin" />
    </div>
  );
}

function RegisterForm({ type }: { type: "kiyos" | "amavin" }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [historyData, setHistoryData] = useState<HistoryData>();
  const [contentKey, setContentKey] = useState([{ id: nanoid() }]);
  const [messageData, setMessageData] = useState<
    DisplayMessageData | undefined
  >();

  const [state, action, isPending] = useActionState<
    FormState,
    RegisterHistoryData
  >(registerHistory, undefined);

  function handleChangeYear(type: "forward" | "back") {
    setYear((prev) => (type === "forward" ? prev + 1 : prev - 1));
  }

  function handleChangeMonth(type: "forward" | "back") {
    if (type === "forward") setMonth((prev) => (prev === 12 ? 1 : prev + 1));

    if (type === "back") setMonth((prev) => (prev === 1 ? 12 : prev - 1));
  }

  function handleClickAddContent() {
    setContentKey((prev) => [...prev, { id: nanoid() }]);
  }

  function handleClickDeleteContent(index: number) {
    setContentKey((prev) => prev.toSpliced(index, 1));
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    startTransition(() =>
      action({ type, data: { formData: formData, year, month } }),
    );
  }

  // fetch exsisting history for the date
  useEffect(() => {
    const fetchHistoryData = async () => {
      const data = await getHistoryForDate(type, year, month);
      if (!data) {
        setMessageData({
          type: "error",
          message: "データの受信に失敗しました。後ほどもう一度お試し下さい🙇‍♂️",
        });
        return;
      }

      // if no data => do nothing
      if (Object.keys(data).length === 0) return;

      setHistoryData(data);
      setContentKey(
        data.contents.map((_: HistoryContent) => {
          return { id: nanoid() };
        }),
      );
    };

    fetchHistoryData();
  }, [type, year, month]);

  useEffect(() => {
    if (!state?.message) return;

    const displaySuccessMessage = async () => {
      if (!state.message) return;

      setMessageData({ type: "success", message: state.message });
      await wait();
      setMessageData(undefined);
    };

    displaySuccessMessage();
  }, [state?.message]);

  return (
    <form
      className={`w-[90%] h-fit bg-blue-900/20 rounded shadow-md shadow-black/20 flex flex-col items-center gap-2 pt-3 pb-5 ${type === "amavin" ? "mt-5" : ""}`}
      onSubmit={handleSubmit}
    >
      {messageData && (
        <PMessage type={messageData.type} message={messageData.message} />
      )}
      {state?.error && <PMessage type="error" message={state.error.message} />}
      {isPending && (
        <PMessage type="pending" message="この月のHistoryを更新中..." />
      )}
      <h3 className="mb-2 text-purple-800">
        {type === "kiyos" ? "Kiyos Celler" : "Artisan Mariage Vineyards"}
      </h3>
      <DateSelect
        type="year"
        curYearOrMonth={year}
        onClickChangeDate={handleChangeYear}
      />
      <DateSelect
        type="month"
        curYearOrMonth={month}
        onClickChangeDate={handleChangeMonth}
      />
      {contentKey.map((data, i) => (
        <Content
          key={data.id}
          index={i}
          content={historyData?.contents[i]}
          onClickDelete={() => handleClickDeleteContent(i)}
        />
      ))}
      <button
        type="button"
        className="w-fit bg-orange-400 text-white px-1 text-sm rounded transition-all duration-150 hover:-translate-y-px mt-5"
        onClick={handleClickAddContent}
      >
        + 出来事を追加
      </button>
      <button
        type="submit"
        className="w-fit bg-purple-700 text-white py-1 px-4 rounded-full mt-4 leading-tight transition-all duration-150 hover:bg-purple-500 hover:-translate-y-1"
      >
        この月のHistoryを
        <br />
        登録する
      </button>
    </form>
  );
}

function DateSelect({
  type,
  curYearOrMonth,
  onClickChangeDate,
}: {
  type: "year" | "month";
  curYearOrMonth: number;
  onClickChangeDate: (type: "forward" | "back") => void;
}) {
  const btnArrowClassName =
    " w-4.5 aspect-square bg-[url('/arrow.svg')] bg-center bg-no-repeat bg-contain";
  const btnLeftArrowClassName = `${btnArrowClassName} rotate-180`;
  return (
    <div className="flex flex-row gap-4">
      <div className="bg-white py-0.5 px-1 rounded-sm flex flex-row gap-3 text-sm">
        <button
          type="button"
          className={btnLeftArrowClassName}
          onClick={() => onClickChangeDate("back")}
        ></button>
        <p>{curYearOrMonth}</p>
        <button
          type="button"
          className={btnArrowClassName}
          onClick={() => onClickChangeDate("forward")}
        ></button>
      </div>
      <p>{type === "year" ? "年" : "月"}</p>
    </div>
  );
}

function Content({
  index,
  content,
  onClickDelete,
}: {
  index: number;
  content: HistoryContent | undefined;
  onClickDelete: () => void;
}) {
  const [imageKey, setImageKey] = useState([{ id: nanoid() }]);

  function handleClickAddImage() {
    setImageKey((prev) => [...prev, { id: nanoid() }]);
  }

  function handleClickDeleteImage(i: number) {
    setImageKey((prev) => prev.toSpliced(i, 1));
  }

  useEffect(() => {
    if (!content) return;

    const assignImageKey = () =>
      setImageKey(
        content.images.map((_) => {
          return { id: nanoid() };
        }),
      );
    assignImageKey();
  }, [content]);

  return (
    <div className="relative w-[90%] h-fit mt-2 flex flex-col gap-2 items-center">
      <button
        type="button"
        className="absolute text-2xl right-3 -top-1"
        onClick={onClickDelete}
      >
        ×
      </button>
      <h3>🍇出来事 {index + 1}</h3>
      {imageKey.map((data, i) => (
        <ImageSelect
          key={data.id}
          i={i}
          contentIndex={index}
          image={content?.images[i]}
          onClickDelete={() => handleClickDeleteImage(i)}
        />
      ))}
      <button
        type="button"
        className="w-fit bg-orange-400 text-white px-1 text-[13px] rounded mb-3"
        onClick={handleClickAddImage}
      >
        + 画像を追加
      </button>
      <Sentence type="ja" sentence={content?.sentence} />
      <Sentence type="en" sentence={content?.sentence} />
    </div>
  );
}

function ImageSelect({
  i,
  contentIndex,
  image,
  onClickDelete,
}: {
  i: number;
  contentIndex: number;
  image: ImageData | undefined;
  onClickDelete: () => void;
}) {
  const inputClassName = "w-[70%] px-1 mt-1";
  const [curImageUrl, setCurImageUrl] = useState("");

  const convertBufferToUrl = (buffer: Buffer) => {
    const nodeJsBuffer = Buffer.from(buffer);
    const blob = new Blob([nodeJsBuffer]);
    return URL.createObjectURL(blob);
  };

  // const [imageNameJa, setImageNameJa] = useState(image?.name.ja || "");
  // const [imageNameEn, setImageNameEn] = useState(image?.name.en || "");

  // function handleChangeName(
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   type: "ja" | "en",
  // ) {
  //   const value = e.currentTarget.value;

  //   if (type === "ja") setImageNameJa(value);

  //   if (type === "en") setImageNameEn(value);
  // }
  function handleChangeImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (!files) return;

    const url = URL.createObjectURL(files[0]);
    setCurImageUrl(url);
  }

  useEffect(() => {
    if (!image) return;

    const displayImage = () => {
      setCurImageUrl(convertBufferToUrl(image.buffer));
    };
    displayImage();
  }, [image]);

  return (
    <div className="text-sm">
      <p>画像 {i + 1}</p>
      <div className="relative w-full flex flex-col items-center justify-center">
        {curImageUrl && (
          <Image
            src={curImageUrl}
            alt={`画像 ${i + 1}`}
            width={500}
            height={300}
            className="w-[70%]"
          ></Image>
        )}
        {!image ? (
          <input
            name={`image${contentIndex + 1}`}
            type="file"
            accept="image/*"
            className={inputClassName}
            onChange={handleChangeImage}
          ></input>
        ) : (
          <p className={inputClassName}>{image.name}</p>
        )}
        {/* <input
          name={`image${contentIndex + 1}NameJa`}
          type="text"
          placeholder="画像の名前（日本語）"
          value={imageNameJa}
          className={inputClassName}
          onChange={(e) => handleChangeName(e, "ja")}
        ></input>
        <input
          name={`image${i + 1}NameEn`}
          type="text"
          placeholder="画像の名前（英語）"
          value={imageNameEn}
          className={inputClassName}
          onChange={(e) => handleChangeName(e, "en")}
        ></input> */}
        <button
          type="button"
          className="absolute w-4.5 aspect-square bg-[url('/trash.svg')] bg-center bg-no-repeat bg-contain right-[5%]"
          onClick={onClickDelete}
        ></button>
      </div>
    </div>
  );
}

function Sentence({
  type,
  sentence,
}: {
  type: "ja" | "en";
  sentence: SentenceData | undefined;
}) {
  const [curSentence, setCurSentence] = useState("");

  function handleChangeSentence(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCurSentence(e.currentTarget.value);
  }

  useEffect(() => {
    if (!sentence) return;

    const assignSentence = () => setCurSentence(sentence[type].join("/n"));
    assignSentence();
  }, [sentence, type]);

  return (
    <div className="w-full">
      <p className="text-sm">内容文（{type === "ja" ? "日本語" : "英語"}）</p>
      <textarea
        name={`sentence${type === "ja" ? "Ja" : "En"}`}
        placeholder={`${type === "ja" ? "日本語" : "英語"}の内容文`}
        value={curSentence}
        className="w-[80%] aspect-3/2 mt-1 p-1"
        onChange={handleChangeSentence}
      ></textarea>
    </div>
  );
}
