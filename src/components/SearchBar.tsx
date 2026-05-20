"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { SearchResultsSkeleton } from "@/components/Skeletons";
import { Book } from "@/types/book";

const SEARCH_URL =
  "https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${SEARCH_URL}?search=${encodeURIComponent(trimmedSearch)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to search books.");
        }

        const books = await response.json();
        setResults(Array.isArray(books) ? books : []);
      } catch (searchError) {
        if (searchError instanceof DOMException && searchError.name === "AbortError") {
          return;
        }

        setResults([]);
        setError("No results found.");
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const nextSearch = event.target.value;

    setSearch(nextSearch);

    if (!nextSearch.trim()) {
      setResults([]);
      setIsLoading(false);
      setError("");
    }
  }

  const shouldShowDropdown = search.trim().length > 0;

  return (
    <div className="app-search">
      <div className="app-search__input-wrapper">
        <FiSearch />
        <input
          className="app-search__input"
          onChange={handleSearchChange}
          placeholder="Search for books"
          type="search"
          value={search}
        />
      </div>

      {shouldShowDropdown && (
        <div className="app-search__dropdown">
          {isLoading && <SearchResultsSkeleton />}
          {!isLoading && error && <div className="app-search__state">{error}</div>}
          {!isLoading && !error && results.length === 0 && (
            <div className="app-search__state">No books found.</div>
          )}
          {!isLoading &&
            !error &&
            results.map((book) => (
              <Link
                className="app-search__result"
                href={`/book/${book.id}`}
                key={book.id}
              >
                <Image
                  className="app-search__image"
                  src={book.imageLink}
                  alt={book.title}
                  width={44}
                  height={66}
                  unoptimized
                />
                <div className="app-search__result-copy">
                  <span className="app-search__title">{book.title}</span>
                  <span className="app-search__author">{book.author}</span>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
