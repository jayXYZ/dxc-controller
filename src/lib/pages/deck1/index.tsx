import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/lib/contexts/DataContext";
import * as Scry from "scryfall-sdk";

// Cache for card data
const cardCache: { [key: string]: Scry.Card } = {};

interface ParsedCard {
  count: number;
  name: string;
  imageUrl?: string;
  type_line: string;
}

interface ParsedDecklist {
  mainboard: ParsedCard[];
  sideboard: ParsedCard[];
}

const Deck1 = () => {
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
              if (name === "Plains" || name === "Island" || name === "Swamp" || name === "Mountain" || name === "Forest") {
                card = await Scry.Cards.byName(name, "LEB")
              } else {
                const searchQuery = `"${name}" not:reprint legal:premodern`;
                const query = await Scry.Cards.search(searchQuery).cancelAfterPage().waitForAll();
                card = query[0];
                cardCache[name] = card;
              }
            }

            array.push({
              count: parseInt(count),
              name,
              imageUrl: card.image_uris?.png || card.card_faces?.[0].image_uris?.png,
              type_line: card.type_line
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

    return { mainboard: sortList(mainboard), sideboard: sortList(sideboard) };
  };

  const getTypeOrder = (type_line: string): number => {
    if (type_line.includes('Creature')) return 1;
    if (type_line.includes('Instant')) return 2;
    if (type_line.includes('Sorcery')) return 3;
    if (type_line.includes('Enchantment')) return 4;
    if (type_line.includes('Artifact')) return 5;
    if (type_line.includes('Basic')) return 7;
    if (type_line.includes('Land')) return 6;
    return 8;
  };

  const sortList = (cards: ParsedCard[]) => {
    // Group cards by name and sum their counts
    const cardsByName = cards.reduce((acc, card) => {
      if (!acc[card.name]) {
        acc[card.name] = card;
      }
      return acc;
    }, {} as { [key: string]: ParsedCard });

    // Convert back to array and sort by type, then by count, then alphabetically
    const sortedCards = Object.values(cardsByName).sort((a, b) => {
      const typeOrderA = getTypeOrder(a.type_line);
      const typeOrderB = getTypeOrder(b.type_line);
      
      // First sort by type
      if (typeOrderA !== typeOrderB) {
        return typeOrderA - typeOrderB;
      }
      
      // Then sort by count (descending)
      if (a.count !== b.count) {
        return b.count - a.count;
      }
      
      // Finally sort alphabetically
      return a.name.localeCompare(b.name);
    });

    return sortedCards;
  };

  useEffect(() => {
    const fetchDeckData = async () => {
      if (!data.p1decklist) {
        console.log("No deck to display");
        setParsedDecklist(null);
        return;
      }

      try {
        const parsed = await parseDecklist(data.p1decklist);
        console.log("Parsed decklist:", parsed);
        setParsedDecklist(parsed);
      } catch (error) {
        console.error("Error parsing decklist:", error);
      }
    };

    fetchDeckData();
  }, [data.p1decklist]);

  if (!parsedDecklist) {
    console.log("Rendering null - no parsed decklist");
    return null;
  }

  return (
    <div className="w-[1920px] h-[1080px] bg-black text-white p-4 overflow-hidden">
      <div className="h-full">
        <div className="mx-2">
          <span className="text-[48px] font-bold">{data.p1name}</span>
          <span className="text-[36px] font-thin px-2 text-[#C6AD65]">{data.p1deck}</span>
        </div>
        
        <div className="flex gap-4 h-[calc(1080px-100px)]">
          <div className="flex-1 h-full">
            <div 
              className="grid gap-2 justify-items-center h-full" 
              style={{
                gridTemplateColumns: `repeat(${
                  (parsedDecklist.mainboard.length >= 22 && parsedDecklist.mainboard.length <= 24) || 
                  parsedDecklist.mainboard.length > 28 ? 8 : 7
                }, 1fr)`,
                gridTemplateRows: `repeat(${parsedDecklist.mainboard.length > 24 ? 4 : 3}, 1fr)`,
                gridAutoRows: '1fr'
              }}
            >
              {parsedDecklist.mainboard.map((card, index) => (
                <div key={`${card.name}-${index}`} className="relative w-full h-full">
                  <img 
                    src={card.imageUrl} 
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 bg-black bg-opacity-75 px-3 py-1 text-white font-bold text-2xl rounded">
                    {card.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {parsedDecklist.sideboard.length > 0 && (
            <div className="w-[200px]">
              <div className="flex flex-col">
                {parsedDecklist.sideboard.reduce((acc, card) => {
                  const startIndex = acc.length;
                  return [
                    ...acc,
                    ...Array(card.count).fill(null).map((_, i) => (
                      <div 
                        key={`sb-${card.name}-${startIndex + i}`} 
                        className="relative first:mt-0 -mt-[115%]"
                        style={{ zIndex: startIndex + i }}
                      >
                        <img 
                          src={card.imageUrl} 
                          alt={card.name}
                          className="w-full h-auto"
                        />
                      </div>
                    ))
                  ];
                }, [] as JSX.Element[])}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deck1; 