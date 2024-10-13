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

function PlayerForm() {
  const { data } = useContext(DataContext);
  const [inputs, setInputs] = useState({
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    socket.emit("update_data", { ...data, ...inputs });
  };

  return (
    <Card>
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
