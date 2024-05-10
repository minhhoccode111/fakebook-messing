import { z } from "zod";

export const ContentFormData = z
  .object({
    content: z
      .string({ required_error: "Content is required." })
      .min(1)
      .max(10000, "Content must be at max 10000 characters long."),
  })
  .refine((data) => data.content.trim().length > 0, {
    message: "Content is required. ",
    path: ["content"],
  });

export const UserInfoFormData = z
  .object({
    fullname: z.string().min(1).max(50),
    bio: z.string().min(1).max(250),
    avatarLink: z.string().url(),
    dateOfBirth: z.date(),
    status: z.string(),
  })
  .refine((data) => data.fullname.trim().length > 0, {
    message: "Fullname is required",
    path: ["fullname"],
  });

export const LoginFormData = z.object({
  username: z
    .string({ required_error: "Username is required." })
    .email("Username must be a valid email address.")
    .min(8, "Username must be at least 8 characters long."),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters long.")
    .max(32, "Password must be at max 32 characters long.")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/,
      {
        message:
          "Password must contain at least: 1 uppercase, 1 lowercase, 1 digit, 1 special character.",
      },
    ),
});

export const SignupFormDataSchema = LoginFormData.extend({
  fullname: z
    .string({ required_error: "Fullname is required." })
    .min(1, "Fullname is required.")
    .max(50, "Fullname must be at max 50 characters long."),
  confirmPassword: z.string({
    required_error: "Confirm password is required.",
  }),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password does not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.fullname.trim().length > 0, {
    message: "Fullname is required",
    path: ["fullname"],
  });
