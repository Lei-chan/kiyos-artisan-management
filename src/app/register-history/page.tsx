"use client";
import React, {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { nanoid } from "nanoid";
import PMessage from "../Components/PMessage";
import {
  DisplayMessageData,
  FormState,
  HistoryContent,
  HistoryData,
  ImageData,
  RegisterHistoryData,
  SentenceData,
} from "../lib/definitions";
import { getHistoryForDate } from "../lib/dal";
import { createUpdateHistory } from "../actions/registerHistory";
import {
  convertDatabaseImagesToFiles,
  getContentsFromData,
  wait,
} from "../lib/helper";
import Image from "next/image";

export default function RegisterHistory() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center text-center pt-3 sm:pt-4 md:pt-5 lg:pt-6 xl:pt-7 2xl:pt-8 pb-7 gap-5">
      <h1 className="text-xl text-amber-700">Historyの追加・編集ページ</h1>
      <RegisterForm type="kiyos" />
      <RegisterForm type="amavin" />
    </div>
  );
}

// fix the issue that already exsisted images are not reflected when update history
function RegisterForm({ type }: { type: "kiyos" | "amavin" }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [historyData, setHistoryData] = useState<HistoryData>();
  const [images, setImages] = useState<(File | undefined)[][]>([[]]);
  const [contentKey, setContentKey] = useState([{ id: nanoid() }]);
  const [messageData, setMessageData] = useState<
    DisplayMessageData | undefined
  >();
  // // use refreshKey to updateUI
  const [refreshKey, setRefreshKey] = useState(0);

  const [state, action, isPending] = useActionState<
    FormState,
    RegisterHistoryData
  >(createUpdateHistory, undefined);
  const lastModifiedState = useRef<FormState>(null);

  function handleChangeYear(type: "forward" | "back") {
    setYear((prev) => (type === "forward" ? prev + 1 : prev - 1));
  }

  function handleChangeMonth(type: "forward" | "back") {
    if (type === "forward") setMonth((prev) => (prev === 12 ? 1 : prev + 1));

    if (type === "back") setMonth((prev) => (prev === 1 ? 12 : prev - 1));
  }

  function handleClickAddContent() {
    setContentKey((prev) => [...prev, { id: nanoid() }]);
    setImages((prev) => [...prev, []]);
  }

  function handleClickDeleteContent(index: number) {
    setContentKey((prev) => prev.toSpliced(index, 1));
    setImages((prev) => prev.toSpliced(index, 1));
  }

  function handleAddImage(contentIndex: number) {
    setImages((prev) => {
      const newImages = [...prev];
      newImages[contentIndex] = [...newImages[contentIndex], undefined];
      return newImages;
    });
  }

  function handleDeleteImage(contentIndex: number, imageIndex: number) {
    setImages((prev) => {
      const newImages = [...prev];
      newImages[contentIndex] = newImages[contentIndex].toSpliced(
        imageIndex,
        1,
      );
      return newImages;
    });
  }

  function handleChangeImage(
    contentIndex: number,
    imageIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = e.currentTarget.files;
    if (!files) return;

    setImages((prev) => {
      const newImages = [...prev];
      newImages[contentIndex][imageIndex] = files[0];
      return newImages;
    });
  }

  function increaseRefreshKey() {
    setRefreshKey((prev) => prev + 1);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);

      const contents = await getContentsFromData(formData, images);

      startTransition(() =>
        // action({ type, data: { formData: formData, year, month } }),
        action({
          type,
          data: {
            _id: historyData ? historyData._id : "",
            contents,
            year,
            month,
          },
        }),
      );
    } catch (err) {
      console.error("Error", err);
      setMessageData({
        type: "error",
        message: "データの送信に失敗しました。後ほどもう一度お試し下さい🙇‍♂️",
      });
    }
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

      // if no data => set undefined
      if (Object.keys(data).length === 0) {
        setHistoryData(undefined);
        setContentKey([{ id: nanoid() }]);
        setImages([[]]);
        return;
      }

      setHistoryData(data);
      setContentKey(
        data.contents.map((_: HistoryContent) => {
          return { id: nanoid() };
        }),
      );

      // set images converting database image data {name: string; buffer: Buffer} to File
      const contentsImages = data.contents.map(
        (con: HistoryContent) => con.images,
      );
      const contentsImagesToDisplay = contentsImages.map((imgs: ImageData[]) =>
        convertDatabaseImagesToFiles(imgs),
      );
      setImages(data.contents.map((con: HistoryContent) => con.images));

      setImages(contentsImagesToDisplay);
    };
    fetchHistoryData();
  }, [type, year, month, refreshKey]);

  useEffect(() => {
    if (!state?.message) return;

    const displaySuccessMessage = async () => {
      if (!state.message) return;

      setMessageData({ type: "success", message: state.message });
      await wait();
      setMessageData(undefined);

      increaseRefreshKey();
    };

    displaySuccessMessage();
  }, [state]);

  return (
    <form
      className={`w-[18rem] sm:w-[20rem] md:w-[24rem] lg:w-[26rem] xl:w-[30rem] 2xl:w-[34rem] h-fit bg-blue-900/20 rounded shadow-md shadow-black/20 flex flex-col items-center gap-2 pt-3 pb-5 ${type === "amavin" ? "mt-5" : ""}`}
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
          images={images[i]}
          onClickDelete={() => handleClickDeleteContent(i)}
          onClickAddImage={handleAddImage}
          onClickDeleteImage={handleDeleteImage}
          onChangeImage={handleChangeImage}
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
  images,
  onClickDelete,
  onClickAddImage,
  onClickDeleteImage,
  onChangeImage,
}: {
  index: number;
  content: HistoryContent | undefined;
  images: (File | undefined)[];
  onClickDelete: () => void;
  onClickAddImage: (contentIndex: number) => void;
  onClickDeleteImage: (contentIndex: number, imageIndex: number) => void;
  onChangeImage: (
    contentIndex: number,
    imageIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  // const [imageKey, setImageKey] = useState<{ id: string }[]>([]);
  // const [images, setImages] = useState(content?.images || []);

  // function handleClickAddImage() {
  //   setImageKey((prev) => [...prev, { id: nanoid() }]);
  // }

  // function handleClickDeleteImage(i: number) {
  //   setImageKey((prev) => prev.toSpliced(i, 1));

  //   // if there're content images, remove the deleted one
  //   if (images.length) setImages((prev) => prev.toSpliced(i, 1));
  // }

  // useEffect(() => {
  //   const assignImageKeyAndImages = () => {
  //     setImageKey(
  //       content
  //         ? content.images.map((_) => {
  //             return { id: nanoid() };
  //           })
  //         : [{ id: nanoid() }],
  //     );
  //     setImages(content?.images || []);
  //   };
  //   assignImageKeyAndImages();
  // }, [content]);

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
      {/* {imageKey.map((data, i) => (
        <ImageSelect
          key={data.id}
          i={i}
          contentIndex={index}
          image={images[i]}
          onClickDelete={() => handleClickDeleteImage(i)}
        />
      ))} */}
      {images.map((data, i) => (
        <ImageSelect
          key={i}
          i={i}
          contentIndex={index}
          image={data}
          onClickDelete={onClickDeleteImage}
          onChangeImage={onChangeImage}
        />
      ))}
      <button
        type="button"
        className="w-fit bg-orange-400 text-white px-1 text-[13px] rounded mb-3"
        onClick={() => onClickAddImage(index)}
      >
        + 画像を追加
      </button>
      <Sentence type="ja" index={index} sentence={content?.sentence} />
      <Sentence type="en" index={index} sentence={content?.sentence} />
    </div>
  );
}

function ImageSelect({
  i,
  contentIndex,
  image,
  onClickDelete,
  onChangeImage,
}: {
  i: number;
  contentIndex: number;
  // image: ImageData | undefined;
  image: File | undefined;
  onClickDelete: (contentIndex: number, imageIndex: number) => void;
  onChangeImage: (
    contentIndex: number,
    imageIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  const inputClassName = "w-[70%] px-1 mt-1";
  const [curImageUrl, setCurImageUrl] = useState("");

  function handleChangeImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (!files) return;

    const url = URL.createObjectURL(files[0]);
    setCurImageUrl(url);
  }

  useEffect(() => {
    const displayImage = () => {
      setCurImageUrl(image ? URL.createObjectURL(image) : "");
      // setCurImageUrl(image ? convertBufferToUrl(image.buffer) : "");
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
            // onChange={handleChangeImage}
            onChange={(e) => onChangeImage(contentIndex, i, e)}
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
          // onClick={onClickDelete}
          onClick={() => onClickDelete(contentIndex, i)}
        ></button>
      </div>
    </div>
  );
}

function Sentence({
  type,
  index,
  sentence,
}: {
  type: "ja" | "en";
  index: number;
  sentence: SentenceData | undefined;
}) {
  const [curSentence, setCurSentence] = useState("");

  function handleChangeSentence(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCurSentence(e.currentTarget.value);
  }

  useEffect(() => {
    const assignSentence = () =>
      setCurSentence(sentence ? sentence[type].join("/n") : "");
    assignSentence();
  }, [sentence, type]);

  return (
    <div className="w-full">
      <p className="text-sm">
        内容文 {index + 1}（{type === "ja" ? "日本語" : "英語"}）
      </p>
      <textarea
        name={`sentence${type === "ja" ? "Ja" : "En"}${index + 1}`}
        placeholder={`${type === "ja" ? "日本語" : "英語"}の内容文`}
        value={curSentence}
        className="w-[80%] aspect-3/2 mt-1 p-1"
        onChange={handleChangeSentence}
      ></textarea>
    </div>
  );
}
