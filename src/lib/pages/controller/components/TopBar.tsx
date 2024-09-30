import { ModeToggle } from "./mode-toggle";

function TopBar({ connected }: { connected: boolean }) {
  return (
    <div className="absolute top-0 w-full flex justify-between items-center">
      <ModeToggle />
      <div className="flex items-center">
        {connected ? "Connected" : "Disconnected"}
        <div
          className={
            "rounded-full h-[10px] w-[10px] mx-2 " +
            (connected ? "bg-green-500" : "bg-red-500")
          }
        ></div>
      </div>
    </div>
  );
}

export default TopBar;
