import { TColumn } from "./types";

export const generateID = (length: number = 10): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


export function getRandomNumber(max: number) {
  return Math.floor(Math.random() * max);
}