import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

interface Props<T> {
  results?: T[];
  renderItem(item: T): JSX.Element;
  onChange?: React.ChangeEventHandler;
  onSelect?: (item: T) => void;
  value?: string;
}

const LiveSearch = <T extends string>({
  results = [],
  renderItem,
  value,
  onChange,
  onSelect,
}: Props<T>): JSX.Element => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const resultContainer = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");

  const handleSelection = (selectedIndex: number) => {
    const selectedItem = results[selectedIndex];
    if (!selectedItem) return resetSearchComplete();
    onSelect?.(selectedItem);
    resetSearchComplete();
  };

  const resetSearchComplete = useCallback(() => {
    setFocusedIndex(-1);
    setShowResults(false);
  }, []);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const { key } = e;
    let nextIndexCount = 0;

    // move down
    if (key === "ArrowDown" || key === "Tab") {
      e.preventDefault();
      nextIndexCount = (focusedIndex + 1) % results.length;
    }

    // move up
    if (key === "ArrowUp") {
      nextIndexCount = (focusedIndex + results.length - 1) % results.length;
    }

    // hide search results
    if (key === "Escape") {
      resetSearchComplete();
    }

    // select the current item
    if (key === "Enter") {
      e.preventDefault();
      handleSelection(focusedIndex);
    }

    setFocusedIndex(nextIndexCount);
  };

  type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
  const handleChange: changeHandler = (e) => {
    setDefaultValue(e.target.value);
    onChange?.(e);
  };

  useEffect(() => {
    if (!resultContainer.current) return;

    resultContainer.current.scrollIntoView({
      block: "center",
    });
  }, [focusedIndex]);

  useEffect(() => {
    if (results.length > 0 && !showResults) setShowResults(true);

    if (results.length <= 0) setShowResults(false);
  }, [results]);

  useEffect(() => {
    if (value) setDefaultValue(value);
  }, [value]);

  return (
    <div className="flex items-center justify-center">
      <div
        tabIndex={1}
        onBlur={resetSearchComplete}
        onKeyDown={handleKeyDown}
        className="relative w-full"
      >
        <Input
          value={defaultValue}
          onChange={handleChange}
          type="text"
          className="transition w-full"
          placeholder="Enter a card name..."
        />

        {/* Search Results Container */}
        {showResults && (
          <div className="absolute mt-1 w-full p-2 shadow-lg bg-black rounded-bl rounded-br max-h-56 overflow-y-auto">
            {results.map((item, index) => {
              return (
                <div
                  key={index}
                  onMouseDown={() => handleSelection(index)}
                  ref={index === focusedIndex ? resultContainer : null}
                  style={{
                    backgroundColor:
                      index === focusedIndex ? "rgba(255, 255, 255, 0.2)" : "",
                  }}
                  className="cursor-pointer hover:bg-white hover:bg-opacity-20 p-2"
                >
                  {renderItem(item)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSearch;
