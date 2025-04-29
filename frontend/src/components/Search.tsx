import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce<string>(query, 500);

  useEffect(() => {
    // if (debouncedQuery === "") {
    onSearch(debouncedQuery);
    // }
  }, [onSearch, debouncedQuery]);

  return (
    <div className="flex items-center">
      <input
        type="search"
        placeholder="search by name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`transition-all duration-300 ease-in-out px-4 py-2 w-64 text-black border border-gray-300 rounded-md`}
      />
    </div>
  );
}
