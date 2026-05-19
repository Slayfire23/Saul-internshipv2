import { Book } from "@/types/book";

const BASE_URL = "https://us-central1-summaristt.cloudfunctions.net/getBooks";

export async function getBooksByStatus(status: Book["status"]) {
  const response = await fetch(`${BASE_URL}?status=${status}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${status} books`);
  }

  return response.json();
}