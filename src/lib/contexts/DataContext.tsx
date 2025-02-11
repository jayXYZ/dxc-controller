import React from "react";

export type Data = {
  id?: string;
  p1name?: string;
  p1deck?: string;
  p1decklist?: string;
  p1life?: number;
  p1record?: string;
  p1gameswon?: number | null;
  p2name?: string;
  p2deck?: string;
  p2decklist?: string;
  p2life?: number;
  p2record?: string;
  p2gameswon?: number | null;
  event?: string;
  format?: string;
  commentators?: string;
  round?: string;
  cardimage?: string;
  timerExpiry?: Date;
  timerIsRunning?: boolean;
  deckviewstate?: "p1" | "p2" | null;
};

export const DataContext = React.createContext<{
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
}>({
  data: {},
  setData: () => {},
});
