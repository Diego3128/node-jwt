import { genSalt, hash, compare } from "bcryptjs";

export const bcryptAdapter = {
  hashPassword: async (password: string): Promise<string> => {
    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);
    return passwordHash;
  },
  checkPassword: async (password: string, hash: string): Promise<boolean> => {
    return await compare(password, hash);
  },
};