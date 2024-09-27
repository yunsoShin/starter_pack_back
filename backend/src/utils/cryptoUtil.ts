import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (
  payload: any,
  secret: string,
  expiresIn: string = "1h"
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string): any => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
