import { Book } from "@/types/book";

const BOOKS_URL = "https://us-central1-summaristt.cloudfunctions.net/getBooks";
const BOOK_URL = "https://us-central1-summaristt.cloudfunctions.net/getBook";

export async function getBooksByStatus(status: Book["status"]) {
  const response = await fetch(`${BOOKS_URL}?status=${status}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${status} books`);
  }

  return response.json();
}

export async function getBookById(id: string): Promise<Book> {
  const response = await fetch(`${BOOK_URL}?id=${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch book ${id}`);
  }

  return response.json();
}
