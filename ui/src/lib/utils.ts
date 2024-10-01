import { IExtras } from "../components/ScorePannel/interfaces";

export const Colors = {
  success: "#4f803e",
  Brown: "#92541c",
  DarkBlue: "#213a62",
  warning: "#ffc107",
  info: "#0dcaf0",
  secondary: "#6c757d",
  dark: "#212529",
  Red: "#ca5b28",
  Violet: "#73319b",
};

export const fixFloat = (value: number, precision: number = 1) => {
  return Number(value.toFixed(precision));
};

export const getTotalExtras = (extras: IExtras) => {
  return extras.byes + extras.legByes + extras.noBalls + extras.wides;
};

export const addBallToOver = (currentOvers: number, isLegalDelivery: boolean) => {
  if (isLegalDelivery) {
    const fullOvers = Math.floor(currentOvers);
    const balls = Math.round((currentOvers - fullOvers) * 10);

    if (balls === 5) {
      return fixFloat(fullOvers + 1);
    } else {
      return fixFloat(fullOvers + (balls + 1) / 10);
    }
  }
  return currentOvers;
};
