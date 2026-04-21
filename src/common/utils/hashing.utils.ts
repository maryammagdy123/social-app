import pkg from "bcrypt";
export async function hash(
  plaintext: string | Buffer<ArrayBufferLike>,
): Promise<string> {
  //(dataToBeHashed,saltRounds)
  return await pkg.hash(plaintext, 14);
}

export async function compare(
  plaintext: string | Buffer<ArrayBufferLike>,
  hashedValue: string,
): Promise<boolean> {
  return await pkg.compare(plaintext, hashedValue);
}
