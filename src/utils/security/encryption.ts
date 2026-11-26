import crypto from "node:crypto";
import { AppError } from "../error.handle";
// import { errRes } from "../error,handle";

const secretKey = Buffer.from("f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,");
export const encryption = (data: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
  let cipherText = cipher.update(data, "utf-8", "hex");
  cipherText += cipher.final("hex");

  return `${iv.toString("hex")}:${cipherText}`;
};

export const decryption = (encryptedValue: string) => {
  const [iv, cipherText] = encryptedValue.split(":");
  if (!iv || !cipherText) {
    throw new AppError("in-valid encrypted value");

    // errRes({msg:"in-valid encrypted value"})
  }
  const binaryIv = Buffer.from(iv, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, binaryIv);
  let plainText = decipher.update(cipherText, "hex", "utf-8");
  plainText += decipher.final("utf-8");

  return plainText;
};
