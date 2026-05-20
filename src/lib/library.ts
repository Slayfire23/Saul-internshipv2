import { Book } from "@/types/book";

export const LIBRARY_KEY = "summarist-library";
export const FINISHED_BOOKS_KEY = "summarist-finished-books";

export type SavedBook = Pick<
  Book,
  | "id"
  | "author"
  | "title"
  | "subTitle"
  | "imageLink"
  | "subscriptionRequired"
  | "averageRating"
  | "totalRating"
>;

export function getStoredBooks(storageKey: string): SavedBook[] {
  try {
    const storedBooks = localStorage.getItem(storageKey);
    return storedBooks ? JSON.parse(storedBooks) : [];
  } catch {
    return [];
  }
}

export function saveBookToStorage(storageKey: string, book: SavedBook) {
  const storedBooks = getStoredBooks(storageKey);
  const nextBooks = [
    book,
    ...storedBooks.filter((storedBook) => storedBook.id !== book.id),
  ];

  localStorage.setItem(storageKey, JSON.stringify(nextBooks));
}

export function toSavedBook(book: Book): SavedBook {
  return {
    id: book.id,
    author: book.author,
    title: book.title,
    subTitle: book.subTitle,
    imageLink: book.imageLink,
    subscriptionRequired: book.subscriptionRequired,
    averageRating: book.averageRating,
    totalRating: book.totalRating,
  };
}
