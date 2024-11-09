import { useContext } from "react";
import { DataContext } from "@/lib/contexts/DataContext";
import { useTimer } from "@/lib/hooks/useTimer.ts";
import { Button } from "@/components/ui/button";
import { socket } from "@/lib/utils/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

function Timer() {
  const { data } = useContext(DataContext);
  const { totalSeconds, seconds, minutes, isRunning, pause, resume, restart } =
    useTimer({ expiryTimestamp: data?.timerExpiry, autoStart: false });

  const leadingZeroSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const leadingZeroMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const negativeTime = totalSeconds < 0;

  const handlePause = () => {
    pause();
    socket.emit("update_data", { timerIsRunning: false });
    // setData((prev) => ({...prev!, timerIsRunning: false}));
  };

  const handleResume = () => {
    const time = new Date();
    time.setMilliseconds(time.getMilliseconds() + totalSeconds * 1000);
    resume();
    // setData((prev) => ({...prev!, timerIsRunning: true, timerExpiry: time}));
    socket.emit("update_data", { timerIsRunning: true, timerExpiry: time });
  };

  const handleReset = () => {
    const time = new Date();
    time.setMilliseconds(time.getMilliseconds() + 3000000 + 6700); // Add offset variable?
    restart(time, false);
    // setData((prev) => ({...prev!, timerIsRunning: false, timerExpiry: time}));
    socket.emit("update_data", { timerIsRunning: false, timerExpiry: time });
  };

  return (
    <Card className="min-h-full">
      <CardHeader>
        <CardTitle>Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <h4 className={negativeTime ? "text-red-500" : ""}>
          {negativeTime ? "-" : ""}
          {leadingZeroMinutes}:{leadingZeroSeconds}
        </h4>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {isRunning ? (
          <Button onClick={handlePause} className="w-full ">
            Pause
          </Button>
        ) : (
          <Button onClick={handleResume} className="w-full">
            Resume
          </Button>
        )}
        <Button onClick={handleReset} className="w-full">
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Timer;
