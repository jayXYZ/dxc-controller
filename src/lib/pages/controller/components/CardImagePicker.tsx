import React, { useContext, useState } from "react";
import LiveSearch from "./LiveSearch";
import { DataContext } from "@/lib/contexts/DataContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Scry from "scryfall-sdk";
import { socket } from "@/lib/utils/utils";

function CardImagePicker() {
  const { data, setData } = useContext(DataContext);
  const [input, setInput] = useState<string>("");
  const [cardlist, setCardlist] = useState<string[]>([]);
  const [prints, setPrints] = useState<Scry.Card[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  async function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    if (e.target.value.length > 2) {
      setCardlist(await Scry.Cards.autoCompleteName(e.target.value));
    }
  }

  async function handleSearchClick(item: string) {
    setInput(item);
    const res = await Scry.Cards.byName(item);
    const printings = await res.getPrints();
    setPrints(printings);
    setCardlist([]);
    // fetch og printing first
    const ogprinting = printings.findIndex((x) => !x.reprint);
    setSelectedIndex(ogprinting);
    setData((prevState) => ({
      ...prevState!,
      cardimage: printings[ogprinting]?.image_uris?.png ?? "",
    }));
    socket.emit("update_data", {
      ...data,
      cardimage: printings[ogprinting]?.image_uris?.png ?? "",
    });
  }

  function handlePrintSelect(value: string) {
    setSelectedIndex(parseInt(value));
    setData((prevState) => ({
      ...prevState!,
      cardimage: prints[parseInt(value)]?.image_uris?.png ?? "",
    }));
    socket.emit("update_data", {
      ...data,
      cardimage: prints[parseInt(value)]?.image_uris?.png ?? "",
    });
  }

  return (
    <Card className="">
      <CardHeader>
        <LiveSearch
          results={cardlist}
          value={input}
          renderItem={(item) => <div>{String(item)}</div>}
          onChange={handleSearchChange}
          onSelect={(item) => handleSearchClick(String(item))}
        />
      </CardHeader>
      <CardContent>
        <img
          src={data?.cardimage}
          className="object-contain min-h-0 max-h-[60vh]"
        />
      </CardContent>
      <CardFooter>
        <Select
          value={selectedIndex.toString()}
          onValueChange={handlePrintSelect}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a printing" />
          </SelectTrigger>
          <SelectContent>
            {prints.map((item, index) => {
              return (
                <SelectItem
                  key={index}
                  value={index.toString()}
                  className="cursor-pointer"
                >
                  {item.set_name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
}

export default CardImagePicker;
