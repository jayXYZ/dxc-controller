import { useContext, useEffect } from "react";
import { DataContext } from "@/lib/contexts/DataContext";
import { useTimer } from "@/lib/hooks/useTimer.ts";

function Overlay() {
  const { data } = useContext(DataContext);
  const { totalSeconds, seconds, minutes, restart } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: data?.timerIsRunning ?? false,
  });

  const leadingZeroSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const leadingZeroMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const negativeTime = totalSeconds < 0;

  useEffect(() => {
    restart(new Date(data?.timerExpiry ?? ""), data?.timerIsRunning);
  }, [data?.timerExpiry, data?.timerIsRunning, restart]);

  return (
    <div className="text-[#fff]">
      <div className="h-[130px] absolute top-0 min-w-full">
        <div className="absolute left-[40px] text-[100px] text-center font-bold mt-[-20px]">
          {data?.p1life ?? 0}
        </div>

        <div className="absolute right-[61%]">
          <div className="text-[48px] text-right">
            {data?.p1name ?? "Player 1"}
          </div>
          <div className="mt-[-16px] text-right">
            <span className="text-[36px] text-white/60 mr-[24px]">
              {data?.p1record ?? "0-0"}
            </span>
            <span className="text-[36px] text-[#C6AD65]">
              {data?.p1deck ?? "Deck 2"}
            </span>
          </div>
        </div>

        <div
          className={
            "absolute left-[778px] top-[7px] w-[54px] h-[50px] [clip-path:polygon(29px_50px,0px_0px,25px_0px,54px_50px)] " +
            ((data?.p1gameswon ?? 0) < 1 ? "" : "bg-[#E0DDDD]")
          }
        ></div>
        <div
          className={
            "absolute left-[811px] top-[63px] w-[54px] h-[50px] [clip-path:polygon(29px_50px,0px_0px,25px_0px,54px_50px)] " +
            ((data?.p1gameswon ?? 0) < 2 ? "" : "bg-[#E0DDDD]")
          }
        ></div>

        <div className="absolute left-0 right-0 text-center text-[24px] pt-[8px]">
          Best of 3
        </div>
        <div
          className={
            "absolute left-0 right-0 mt-auto mb-auto text-center font-bold text-[60px] pt-[28px] " +
            (negativeTime ? "text-red-500" : "")
          }
        >
          {negativeTime ? "-" : ""}
          {leadingZeroMinutes}:{leadingZeroSeconds}
        </div>

        <div
          className={
            "absolute left-[1087px] top-[7px] w-[54px] h-[50px] [clip-path:polygon(0px_50px,29px_0px,54px_0px,25px_50px)] " +
            ((data?.p2gameswon ?? 0) < 1 ? "" : "bg-[#E0DDDD]")
          }
        ></div>
        <div
          className={
            "absolute left-[1055px] top-[63px] w-[54px] h-[50px] [clip-path:polygon(0px_50px,29px_0px,54px_0px,25px_50px)] " +
            ((data?.p2gameswon ?? 0) < 2 ? "" : "bg-[#E0DDDD]")
          }
        ></div>

        <div className="absolute left-[61%]">
          <div className="text-[48px] text-left">
            {data?.p2name ?? "Player 2"}
          </div>
          <div className="mt-[-16px]">
            <span className="text-[36px] text-[#C6AD65]">
              {data?.p2deck ?? "Deck 2"}
            </span>
            <span className="text-[36px] text-white/60 ml-[24px]">
              {data?.p2record ?? "0-0"}
            </span>
          </div>
        </div>

        <div className="text-[100px] text-center font-bold absolute right-[40px] mt-[-20px]">
          {data?.p2life ?? 0}
        </div>
      </div>

      <div className="h-[60px] absolute bottom-0 min-w-full">
        <div className="absolute left-[20px] bottom-[15px] text-[32px]">
          Commentators: {data?.commentators ?? "N/A"}
        </div>
        <div className="absolute right-[20px] bottom-[15px] text-[32px] text-right">
          {data?.round ?? "N/A"} | {data?.format ?? "N/A"} |{" "}
          {data?.event ?? "N/A"}
        </div>
      </div>
    </div>
  );
}

export default Overlay;
