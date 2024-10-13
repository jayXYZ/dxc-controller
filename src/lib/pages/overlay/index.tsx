import { useContext, useEffect } from "react";
import { DataContext } from "@/lib/contexts/DataContext";
import { useTimer } from "@/lib/hooks/useTimer.ts"

function Overlay() {
  const { data } = useContext(DataContext);
  const {
    totalSeconds,
    seconds,
    minutes,
    restart,
  } = useTimer({ expiryTimestamp: new Date(), autoStart: data?.timerIsRunning ?? false });

  const leadingZeroSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const leadingZeroMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const negativeTime = totalSeconds < 0;

  useEffect(() => {
    restart(new Date(data?.timerExpiry ?? ''), data?.timerIsRunning);
}, [data?.timerExpiry, data?.timerIsRunning, restart])

  return (
    <div className="text-[#fff]">
      <div className="h-[130px] absolute top-0 min-w-full">
        <div className="absolute left-[40px] text-[90px] text-center font-bold mt-[-5px]">
          {data?.p1life ?? 0}
        </div>

        <div className="absolute right-[61%]">
          <div className="text-[48px] text-right">
            {data?.p1name ?? "Player 1"}
          </div>
          <div className="mt-[-10px] flex justify-between">
            <span className="text-[36px] text-white/60">
              {data?.p1record ?? "0-0"}
            </span>
            <span className="text-[36px] text-[#C6AD65]">
              {data?.p1deck ?? "Deck 1"}
            </span>
          </div>
        </div>

        <div
          className={
            "absolute right-[58%] top-[30px] w-[20px] h-[20px] rounded-full outline outline-white outline-offset-4 " +
            ((data?.p1gameswon ?? 0) < 1 ? "" : "bg-white")
          }
        ></div>
        <div
          className={
            "absolute right-[58%] bottom-[30px] w-[20px] h-[20px] rounded-full outline outline-white outline-offset-4 " +
            ((data?.p1gameswon ?? 0) < 2 ? "" : "bg-white")
          }
        ></div>

        <div className={'absolute left-0 right-0 mt-auto mb-auto text-center text-[56px] pt-[20px] ' + (negativeTime ? 'text-red-500' : '')}>
          {negativeTime ? '-' : ''}{leadingZeroMinutes}:{leadingZeroSeconds}
        </div>

        <div
          className={
            "absolute left-[58%] top-[30px] w-[20px] h-[20px] rounded-full outline outline-white outline-offset-4 " +
            ((data?.p2gameswon ?? 0) < 1 ? "" : "bg-white")
          }
        ></div>
        <div
          className={
            "absolute left-[58%] bottom-[30px] w-[20px] h-[20px] rounded-full outline outline-white outline-offset-4 " +
            ((data?.p2gameswon ?? 0) < 2 ? "" : "bg-white")
          }
        ></div>

        <div className="absolute left-[61%]">
          <div className="text-[48px] text-left">
            {data?.p2name ?? "Player 2"}
          </div>
          <div className="mt-[-10px] flex justify-between">
            <span className="text-[36px] text-[#C6AD65]">
              {data?.p2deck ?? "Deck 2"}
            </span>
            <span className="text-[36px] text-white/60">
              {data?.p2record ?? "0-0"}
            </span>
          </div>
        </div>

        <div className="text-[90px] text-center font-bold absolute right-[40px] mt-[-5px]">
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
