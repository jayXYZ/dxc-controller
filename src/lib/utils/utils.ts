import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import io from "socket.io-client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const socket = io("wss://test.duresscrew.box.ca");
