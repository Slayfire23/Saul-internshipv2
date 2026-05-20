import ForYouClient from "./ForYouClient";
import { getBooksByStatus } from "@/lib/books";
import { Book } from "@/types/book";

export const dynamic = "force-dynamic";

export default async function ForYouPage() {
  let selectedBook: Book | null = null;
  let recommendedBooks: Book[] = [];
  let suggestedBooks: Book[] = [];
  let error = "";

  try {
    const [selectedResponse, recommendedResponse, suggestedResponse] = await Promise.all([
      getBooksByStatus("selected") as Promise<Book | Book[]>,
      getBooksByStatus("recommended") as Promise<Book[]>,
      getBooksByStatus("suggested") as Promise<Book[]>,
    ]);

    selectedBook = Array.isArray(selectedResponse)
      ? selectedResponse[0] ?? null
      : selectedResponse;
    recommendedBooks = recommendedResponse;
    suggestedBooks = suggestedResponse;
  } catch {
    error = "We could not load your books right now. Please try again.";
  }

  return (
    <ForYouClient
      selectedBook={selectedBook}
      recommendedBooks={recommendedBooks}
      suggestedBooks={suggestedBooks}
      error={error}
    />
  );
}
