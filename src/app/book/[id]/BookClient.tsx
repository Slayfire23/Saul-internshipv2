"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { FiBookOpen, FiHeadphones, FiPlus } from "react-icons/fi";
import AuthModal, { AuthMode } from "@/components/AuthModal";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/firebase";
import { LIBRARY_KEY, saveBookToStorage, toSavedBook } from "@/lib/library";
import { SUBSCRIPTION_KEY, LocalSubscription } from "@/lib/subscription";
import { Book } from "@/types/book";

type BookClientProps = {
  book: Book;
};

export default function BookClient({ book }: BookClientProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [libraryMessage, setLibraryMessage] = useState("");
  const [isSubscribed] = useState(() => getStoredSubscription().active);

  const ratingLabel = useMemo(
    () => `${book.averageRating.toFixed(1)} (${book.totalRating} ratings)`,
    [book.averageRating, book.totalRating]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  function requireAuth() {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  }

  function handleReadOrListen() {
    if (!user) {
      requireAuth();
      return;
    }

    if (book.subscriptionRequired && !isSubscribed) {
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${book.id}`);
  }

  function handleAddToLibrary() {
    if (!user) {
      requireAuth();
      return;
    }

    saveBookToStorage(LIBRARY_KEY, toSavedBook(book));
    setLibraryMessage("Added to My Library");
  }

  return (
    <>
      <Sidebar />
      <main className="book-page with-sidebar">
        <div className="book-page__shell">
          <SearchBar />

          <section className="book-detail">
            <div className="book-detail__image-wrapper">
              <Image
                className="book-detail__image"
                src={book.imageLink}
                alt={book.title}
                width={260}
                height={390}
                priority
                unoptimized
              />
              {book.subscriptionRequired && (
                <span className="book-detail__pill">Premium</span>
              )}
            </div>

            <div className="book-detail__content">
              <h1 className="book-detail__title">{book.title}</h1>
              <p className="book-detail__subtitle">{book.subTitle}</p>
              <p className="book-detail__author">By {book.author}</p>

              <div className="book-detail__stats">
                <span>{ratingLabel}</span>
                <span>{book.type}</span>
                <span>{formatKeyIdeas(book.keyIdeas)} key ideas</span>
              </div>

              <div className="book-detail__actions">
                <button
                  className="book-detail__primary"
                  onClick={handleReadOrListen}
                  type="button"
                >
                  <FiBookOpen />
                  Read
                </button>
                <button
                  className="book-detail__primary book-detail__primary--secondary"
                  onClick={handleReadOrListen}
                  type="button"
                >
                  <FiHeadphones />
                  Listen
                </button>
                <button
                  className="book-detail__library"
                  onClick={handleAddToLibrary}
                  type="button"
                >
                  <FiPlus />
                  Add title to My Library
                </button>
              </div>

              {libraryMessage && (
                <p className="book-detail__message">{libraryMessage}</p>
              )}
            </div>
          </section>

          <section className="book-page__section">
            <h2 className="book-page__section-title">What&apos;s it about?</h2>
            <p className="book-page__copy">{book.bookDescription}</p>
          </section>

          <section className="book-page__section">
            <h2 className="book-page__section-title">About the author</h2>
            <p className="book-page__copy">{book.authorDescription}</p>
          </section>

          <section className="book-page__section">
            <h2 className="book-page__section-title">Key ideas</h2>
            {Array.isArray(book.keyIdeas) ? (
              <ul className="book-page__ideas">
                {book.keyIdeas.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ul>
            ) : (
              <p className="book-page__copy">
                This summary includes {book.keyIdeas} key ideas.
              </p>
            )}
          </section>

          {book.tags.length > 0 && (
            <section className="book-page__section">
              <h2 className="book-page__section-title">Tags</h2>
              <div className="book-page__tags">
                {book.tags.map((tag) => (
                  <span className="book-page__tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </section>
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

function getStoredSubscription(): LocalSubscription {
  try {
    const storedSubscription = localStorage.getItem(SUBSCRIPTION_KEY);

    if (!storedSubscription) {
      return {
        active: false,
        plan: "unknown",
        startedAt: "",
      };
    }

    return JSON.parse(storedSubscription);
  } catch {
    return {
      active: false,
      plan: "unknown",
      startedAt: "",
    };
  }
}

function formatKeyIdeas(keyIdeas: Book["keyIdeas"]) {
  return Array.isArray(keyIdeas) ? keyIdeas.length : keyIdeas;
}
