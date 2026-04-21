import crypto from "crypto";
import { ENCRYPTION_SECRET_KEY } from "../../config";
import { BadRequestError } from "../exceptions";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

const KEY = Buffer.from(ENCRYPTION_SECRET_KEY as string);
export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH as unknown as number);

  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY), iv);

  let encrypted = cipher.update(plaintext);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(data: string): string {
  const [iv, encryptedText] = data.split(":") || ([] as string[]);

  if (!iv || !encryptedText) {
    throw new BadRequestError("Invalid encryption parts!");
  }
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(KEY),
    Buffer.from(iv, "hex"),
  );

  if (!encryptedText) {
    throw new Error("Encrypted text is missing");
  }

  let decrypted = decipher.update(Buffer.from(encryptedText, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
