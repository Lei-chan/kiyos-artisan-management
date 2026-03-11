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
