import crypto from "crypto";

export const encryptPassword = (password: string) => {
  if (!password) return "";
  try {
    return crypto
      .createHmac("sha1", process.env.PASSWORD_HASH as string)
      .update(password)
      .digest("hex");
  } catch (err) {
    return "";
  }
};
