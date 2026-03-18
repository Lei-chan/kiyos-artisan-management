export interface MyError extends Error {
  status?: number;
}

export type FormState =
  | {
      error?: { message: string; status: number };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export type HistoryData = {
  _id?: string;
  year: number;
  month: number;
  contents: HistoryContent[];
  lastModifiedUserId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type HistoryContent = {
  images: ImageData[] | [];
  sentence: SentenceData;
};

export type SentenceData = { en: string[]; ja: string[] };

export type ImageData = { buffer: Buffer; name: string };

export type Group = "kiyos" | "amavin";

export type RegisterHistoryImage = { arrayBuffer: ArrayBuffer; name: string };

export type RegisterHistoryContent = {
  images: RegisterHistoryImage[];
  sentence: SentenceData;
};

export type RegisterHistoryData = {
  type: Group;
  data: {
    _id?: string;
    contents: RegisterHistoryContent[];
    year: number;
    month: number;
  };
};

export type NewsData = {
  _id?: string;
  date: string;
  type: Group | "both";
  content: {
    title: { en: string; ja: string };
    sentence: { en: string[]; ja: string[] };
    link: string;
  };
  lastModifiedUserId?: string;
};

export type DisplayMessageData = {
  type: "error" | "pending" | "success";
  message: string;
};
