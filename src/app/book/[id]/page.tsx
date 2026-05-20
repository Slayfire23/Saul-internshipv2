import Link from "next/link";
import BookClient from "./BookClient";
import Sidebar from "@/components/Sidebar";
import { getBookById } from "@/lib/books";
import { Book } from "@/types/book";

export const dynamic = "force-dynamic";

type BookPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  let book: Book;

  try {
    book = await getBookById(id);
  } catch {
    return (
      <>
        <Sidebar />
        <main className="book-page with-sidebar">
          <div className="book-page__shell">
            <section className="book-page__state">
              <h1 className="book-page__state-title">We could not load this book.</h1>
              <p className="book-page__state-copy">
                Please go back to For You and try opening it again.
              </p>
              <Link className="book-page__state-link" href="/for-you">
                Back to For You
              </Link>
            </section>
          </div>
        </main>
      </>
    );
  }

  return <BookClient book={book} />;
}
