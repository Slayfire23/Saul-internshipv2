"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AuthModal, { AuthMode } from "@/components/AuthModal";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/firebase";
import {
  FINISHED_BOOKS_KEY,
  getStoredBooks,
  LIBRARY_KEY,
  SavedBook,
} from "@/lib/library";

export default function LibraryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<SavedBook[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);

      if (currentUser) {
        setSavedBooks(getStoredBooks(LIBRARY_KEY));
        setFinishedBooks(getStoredBooks(FINISHED_BOOKS_KEY));
      }
    });

    return unsubscribe;
  }, []);

  function openAuthModal() {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  }

  return (
    <>
      <Sidebar />
      <main className="library-page with-sidebar">
        <div className="library-page__shell">
          <SearchBar />

          <section className="library-page__hero">
            <h1 className="library-page__title">My Library</h1>
            <p className="library-page__subtitle">
              Saved books and completed listens live here.
            </p>
          </section>

          {!isAuthReady && <LibrarySkeleton />}

          {isAuthReady && !user && (
            <section className="library-page__logged-out">
              <div className="library-page__image-wrapper">
                <Image
                  className="library-page__image"
                  src="/assets/login.png"
                  alt="Login to view library"
                  width={300}
                  height={300}
                  priority
                />
              </div>
              <div>
                <h2 className="library-page__section-title">
                  Log in to view your library
                </h2>
                <p className="library-page__copy">
                  Books you add from the book page and books you finish in the
                  player will appear here.
                </p>
                <button
                  className="library-page__primary"
                  onClick={openAuthModal}
                  type="button"
                >
                  Login
                </button>
              </div>
            </section>
          )}

          {isAuthReady && user && (
            <>
              <LibrarySection
                books={savedBooks}
                emptyMessage="Books you add with Add title to My Library will appear here."
                title="Saved Books"
              />
              <LibrarySection
                books={finishedBooks}
                emptyMessage="Books will appear here after you listen all the way to the end."
                title="Finished Books"
              />
            </>
          )}
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onModeChange={setAuthMode}
        successRedirectUrl={null}
      />
    </>
  );
}

function LibrarySection({
  books,
  emptyMessage,
  title,
}: {
  books: SavedBook[];
  emptyMessage: string;
  title: string;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);

  function scrollBooks(direction: "left" | "right") {
    sliderRef.current?.scrollBy({
      behavior: "smooth",
      left: direction === "left" ? -320 : 320,
    });
  }

  return (
    <section className="library-page__section">
      <div className="library-page__section-header">
        <h2 className="library-page__section-title">{title}</h2>
        {books.length > 0 && (
          <div className="library-page__swiper-controls">
            <button
              aria-label={`Previous ${title}`}
              className="library-page__swiper-button"
              onClick={() => scrollBooks("left")}
              type="button"
            >
              <FiChevronLeft />
            </button>
            <button
              aria-label={`Next ${title}`}
              className="library-page__swiper-button"
              onClick={() => scrollBooks("right")}
              type="button"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
      {books.length > 0 ? (
        <div className="library-page__grid" ref={sliderRef}>
          {books.map((book) => (
            <LibraryBookCard book={book} key={book.id} />
          ))}
        </div>
      ) : (
        <p className="library-page__empty">{emptyMessage}</p>
      )}
    </section>
  );
}

function LibraryBookCard({ book }: { book: SavedBook }) {
  return (
    <Link className="book-card library-book-card" href={`/book/${book.id}`}>
      <div className="book-card__image-wrapper">
        <Image
          className="book-card__image"
          src={book.imageLink}
          alt={book.title}
          width={180}
          height={270}
          unoptimized
        />
        {book.subscriptionRequired && (
          <span className="book-card__pill">Premium</span>
        )}
      </div>
      <div className="book-card__body">
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
        <p className="book-card__subtitle">{book.subTitle}</p>
        <div className="book-card__rating">
          <span>{book.averageRating.toFixed(1)}</span>
          <span>({book.totalRating} ratings)</span>
        </div>
      </div>
    </Link>
  );
}

function LibrarySkeleton() {
  return (
    <section className="library-page__section">
      <div className="skeleton skeleton-section-title" />
      <div className="library-page__grid">
        {[0, 1, 2, 3].map((item) => (
          <div className="book-card" key={item}>
            <div className="skeleton skeleton-book-cover" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line--short" />
          </div>
        ))}
      </div>
    </section>
  );
}
