import * as z from "zod";
import {
  MIN_EACH_PASSWORD,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "../config";

const Manager = z.object({
  username: z
    .string()
    .trim()
    .min(MIN_USERNAME_LENGTH, {
      error: `Username should be more than ${MIN_USERNAME_LENGTH} characters long`,
    }),
  password: z
    .string()
    .trim()
    .min(MIN_PASSWORD_LENGTH, {
      error: `Password must be more than ${MIN_PASSWORD_LENGTH} characters long`,
    })
    .regex(/[a-z]/, {
      error: `Please contain at least ${MIN_EACH_PASSWORD} lowercase letter`,
    })
    .regex(/[A-Z]/, {
      error: `Please contain at least ${MIN_EACH_PASSWORD} uppercase letter`,
    })
    .regex(/[0-9]/, {
      error: `Please contain at least ${MIN_EACH_PASSWORD} digit`,
    })
    .regex(/[^a-zA-Z0-9\s]/, {
      error: `Please contain at least ${MIN_EACH_PASSWORD} special character`,
    }),
  isAllowedToAdd: z.boolean(),
});

export default Manager;
