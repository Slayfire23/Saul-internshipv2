"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { Book } from "@/types/book";

type ForYouClientProps = {
  selectedBook: Book | null;
  recommendedBooks: Book[];
  suggestedBooks: Book[];
  error?: string;
};

function BookPill({ book }: { book: Book }) {
  if (!book.subscriptionRequired) {
    return null;
  }

  return <span className="book-card__pill">Premium</span>;
}

function BookRating({ book }: { book: Book }) {
  return (
    <div className="book-card__rating">
      <span>{book.averageRating.toFixed(1)}</span>
      <span>({book.totalRating} ratings)</span>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <Link className="book-card" href={`/book/${book.id}`}>
      <div className="book-card__image-wrapper">
        <Image
          className="book-card__image"
          src={book.imageLink}
          alt={book.title}
          width={180}
          height={270}
          unoptimized
        />
        <BookPill book={book} />
      </div>
      <div className="book-card__body">
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
        <p className="book-card__subtitle">{book.subTitle}</p>
        <BookRating book={book} />
      </div>
    </Link>
  );
}

function SelectedBook({ book }: { book: Book }) {
  return (
    <Link className="selected-book" href={`/book/${book.id}`}>
      <div className="selected-book__content">
        <span className="selected-book__eyebrow">Selected just for you</span>
        <h2 className="selected-book__title">{book.title}</h2>
        <p className="selected-book__subtitle">{book.subTitle}</p>
        <p className="selected-book__description">{book.bookDescription}</p>
        <div className="selected-book__meta">
          <span>{book.author}</span>
          <BookRating book={book} />
        </div>
      </div>
      <div className="selected-book__image-wrapper">
        <Image
          className="selected-book__image"
          src={book.imageLink}
          alt={book.title}
          width={170}
          height={255}
          unoptimized
        />
        <BookPill book={book} />
      </div>
    </Link>
  );
}

function BookSection({ title, books }: { title: string; books: Book[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  function scrollBooks(direction: "left" | "right") {
    sliderRef.current?.scrollBy({
      behavior: "smooth",
      left: direction === "left" ? -320 : 320,
    });
  }

  return (
    <section className="for-you__section">
      <div className="for-you__section-header">
        <h2 className="for-you__section-title">{title}</h2>
        <div className="for-you__swiper-controls">
          <button
            aria-label={`Previous ${title}`}
            className="for-you__swiper-button"
            onClick={() => scrollBooks("left")}
            type="button"
          >
            <FiChevronLeft />
          </button>
          <button
            aria-label={`Next ${title}`}
            className="for-you__swiper-button"
            onClick={() => scrollBooks("right")}
            type="button"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="for-you__grid" ref={sliderRef}>
        {books.map((book) => (
          <BookCard book={book} key={book.id} />
        ))}
      </div>
    </section>
  );
}

export default function ForYouClient({
  selectedBook,
  recommendedBooks,
  suggestedBooks,
  error,
}: ForYouClientProps) {
  return (
    <>
      <Sidebar />
      <main className="for-you with-sidebar">
        <div className="for-you__shell">
        <SearchBar />

        <section className="for-you__hero">
          <h1 className="for-you__title">For You</h1>
          <p className="for-you__subtitle">
            Hand-picked books and summaries to keep your next idea close.
          </p>
        </section>

        {error && <div className="for-you__state for-you__state--error">{error}</div>}
        {!error && (
          <>
            {selectedBook && (
              <section className="for-you__section">
                <SelectedBook book={selectedBook} />
              </section>
            )}
            <BookSection title="Recommended Books" books={recommendedBooks} />
            <BookSection title="Suggested Books" books={suggestedBooks} />
          </>
        )}
        </div>
      </main>
    </>
  );
}
