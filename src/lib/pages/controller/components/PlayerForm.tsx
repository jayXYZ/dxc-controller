import React, { useContext, useState } from "react";
import { socket } from "@/lib/utils/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataContext } from "@/lib/contexts/DataContext";
import { RefreshCcw, X } from "lucide-react";

const initialState = {
  p1name: "",
  p1deck: "",
  p1record: "",
  p1gameswon: null,
  p2name: "",
  p2deck: "",
  p2record: "",
  p2gameswon: null,
  round: "",
  commentators: "",
  event: "",
};

function PlayerForm() {
  const { data } = useContext(DataContext);
  const [inputs, setInputs] = useState<{
    p1name: string;
    p1deck: string;
    p1record: string;
    p1gameswon: number | null;
    p2name: string;
    p2deck: string;
    p2record: string;
    p2gameswon: number | null;
    round: string;
    commentators: string;
    event: string;
  }>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    socket.emit("update_data", { ...data, ...inputs });
  };

  const handleSync = () => {
    setInputs({
      p1name: data.p1name || "",
      p1deck: data.p1deck || "",
      p1record: data.p1record || "",
      p1gameswon: data.p1gameswon ?? null,
      p2name: data.p2name || "",
      p2deck: data.p2deck || "",
      p2record: data.p2record || "",
      p2gameswon: data.p2gameswon ?? null,
      round: data.round || "",
      commentators: data.commentators || "",
      event: data.event || "",
    });
  };

  const handleClear = () => {
    setInputs(initialState);
  };

  return (
    <Card className="relative">
      <div className="absolute right-0">
        <Button variant="ghost" size="icon" onClick={handleSync}>
          <RefreshCcw />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleClear}>
          <X />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row">
          <div>
            <CardHeader>
              <CardTitle>Player 1</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Name"
                  value={inputs.p1name}
                  onChange={handleChange}
                  name="p1name"
                />
                <Input
                  placeholder="Deck"
                  value={inputs.p1deck}
                  onChange={handleChange}
                  name="p1deck"
                />
                <div className="flex flex-row gap-2">
                  <Input
                    placeholder="Record"
                    value={inputs.p1record}
                    onChange={handleChange}
                    name="p1record"
                  />
                  <Input
                    placeholder="Games Won"
                    value={inputs.p1gameswon ?? ""}
                    onChange={handleChange}
                    name="p1gameswon"
                    type="number"
                  />
                </div>
              </div>
            </CardContent>
          </div>
          <div>
            <CardHeader>
              <CardTitle>Player 2</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Name"
                  value={inputs.p2name}
                  onChange={handleChange}
                  name="p2name"
                />
                <Input
                  placeholder="Deck"
                  value={inputs.p2deck}
                  onChange={handleChange}
                  name="p2deck"
                />
                <div className="flex flex-row gap-2">
                  <Input
                    placeholder="Record"
                    value={inputs.p2record}
                    onChange={handleChange}
                    name="p2record"
                  />
                  <Input
                    placeholder="Games Won"
                    value={inputs.p2gameswon ?? ""}
                    onChange={handleChange}
                    name="p2gameswon"
                    type="number"
                  />
                </div>
              </div>
            </CardContent>
          </div>
        </div>
        <CardContent>
          <div className="flex flex-row gap-2">
            <Input
              placeholder="Event Name"
              value={inputs.event}
              onChange={handleChange}
              name="event"
            />
            <Input
              placeholder="Commentators"
              value={inputs.commentators}
              onChange={handleChange}
              name="commentators"
            />
            <Input
              placeholder="Round"
              value={inputs.round}
              onChange={handleChange}
              name="round"
            />
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PlayerForm;
