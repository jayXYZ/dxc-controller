import { DataContext } from "@/lib/contexts/DataContext";
import { useContext } from "react";

function Card() {
  const { data } = useContext(DataContext);

  return <img src={data?.cardimage ?? ""} />;
}

export default Card;
