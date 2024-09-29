import React from "react";

export type Data = {
  id: string;
  p1name: string;
  p1deck: string;
  p1life: number;
  p1record: string;
  p1gameswon: number;
  p2name: string;
  p2deck: string;
  p2life: number;
  p2record: string;
  p2gameswon: number;
  event: string;
  format: string;
  commentators: string;
  cardimage: string;
  timerExpiry: Date;
  timerIsRunning: boolean;
};

export const DataContext = React.createContext<{
  data: Data | null;
  setData: React.Dispatch<React.SetStateAction<Data | null>>;
}>({
  data: null,
  setData: () => {},
});
