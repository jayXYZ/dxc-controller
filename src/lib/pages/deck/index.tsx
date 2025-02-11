import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/lib/contexts/DataContext";
import * as Scry from "scryfall-sdk";

// Cache for card data
const cardCache: { [key: string]: Scry.Card } = {};

interface ParsedCard {
  count: number;
  name: string;
  imageUrl?: string;
}

interface ParsedDecklist {
  mainboard: ParsedCard[];
  sideboard: ParsedCard[];
}

const DeckDisplay = () => {
  const { data } = useContext(DataContext);
  const [parsedDecklist, setParsedDecklist] = useState<ParsedDecklist | null>(null);

  const parseDecklist = async (decklist: string) => {
    console.log("Parsing decklist:", decklist);
    const [mainboardStr, sideboardStr] = decklist.split("\nSIDEBOARD:\n");
    const mainboard: ParsedCard[] = [];
    const sideboard: ParsedCard[] = [];

    const processSection = async (section: string, array: ParsedCard[]) => {
      const lines = section.trim().split("\n");
      for (const line of lines) {
        const match = line.match(/^(\d+)\s+(.+)$/);
        if (match) {
          const [, count, name] = match;
          let card: Scry.Card;
          
          try {
            if (cardCache[name]) {
              card = cardCache[name];
            } else {
              card = await Scry.Cards.byName(name);
              cardCache[name] = card;
            }

            array.push({
              count: parseInt(count),
              name,
              imageUrl: card.image_uris?.png || card.card_faces?.[0].image_uris?.png
            });
          } catch (error) {
            console.error(`Error processing card ${name}:`, error);
          }
        }
      }
    };

    await processSection(mainboardStr, mainboard);
    if (sideboardStr) {
      await processSection(sideboardStr, sideboard);
    }

    return { mainboard, sideboard };
  };

  useEffect(() => {
    const fetchDeckData = async () => {
      console.log("Current data state:", {
        deckviewstate: data.deckviewstate,
        p1decklist: data.p1decklist,
        p2decklist: data.p2decklist
      });

      if (!data.deckviewstate || !data[`${data.deckviewstate}decklist`]) {
        console.log("No deck to display");
        setParsedDecklist(null);
        return;
      }

      const decklist = data[`${data.deckviewstate}decklist`];
      console.log("Selected decklist:", decklist);
      
      if (typeof decklist === 'string') {
        try {
          const parsed = await parseDecklist(decklist);
          console.log("Parsed decklist:", parsed);
          setParsedDecklist(parsed);
        } catch (error) {
          console.error("Error parsing decklist:", error);
        }
      } else {
        console.log("Decklist is not a string:", typeof decklist);
      }
    };

    fetchDeckData();
  }, [data.deckviewstate, data.p1decklist, data.p2decklist]);

  if (!data.deckviewstate || !parsedDecklist) {
    console.log("Rendering null - no deck view state or parsed decklist");
    return null;
  }

  const playerName = data[`${data.deckviewstate}name`];
  const deckName = data[`${data.deckviewstate}deck`];

  return (
    <div className="w-[1920px] h-[1080px] bg-black text-white p-4 overflow-hidden">
      <div className="h-full">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold">{playerName}</h1>
          <h2 className="text-xl">{deckName}</h2>
        </div>
        
        <div className="flex gap-4 h-[calc(1080px-120px)]">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Main Deck</h3>
            <div className="grid grid-cols-8 gap-1 auto-rows-max">
              {parsedDecklist.mainboard.map((card, index) => (
                <div key={`${card.name}-${index}`} className="relative">
                  <img 
                    src={card.imageUrl} 
                    alt={card.name}
                    className="w-full h-auto"
                  />
                  <div className="absolute top-0 left-0 bg-black bg-opacity-75 px-2 py-0.5 my-10 text-white font-bold text-sm">
                    {card.count}x
                  </div>
                </div>
              ))}
            </div>
          </div>

          {parsedDecklist.sideboard.length > 0 && (
            <div className="w-[250px]">
              <h3 className="text-lg font-bold mb-2">Sideboard</h3>
              <div className="flex flex-col">
                {parsedDecklist.sideboard.map((card, index) => (
                  <div 
                    key={`sb-${card.name}-${index}`} 
                    className="relative first:mt-0 -mt-[110%]"
                    style={{ zIndex: index }}
                  >
                    <img 
                      src={card.imageUrl} 
                      alt={card.name}
                      className="w-full h-auto"
                    />
                    <div className="absolute top-0 left-0 bg-black bg-opacity-75 px-2 py-0.5 my-10 text-white font-bold text-sm">
                      {card.count}x
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckDisplay; 