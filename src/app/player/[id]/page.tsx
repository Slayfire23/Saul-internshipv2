import Link from "next/link";
import PlayerClient from "./PlayerClient";
import Sidebar from "@/components/Sidebar";
import { getBookById } from "@/lib/books";
import { Book } from "@/types/book";

export const dynamic = "force-dynamic";

type PlayerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  let book: Book;

  try {
    book = await getBookById(id);
  } catch {
    return (
      <>
        <Sidebar />
        <main className="player-page with-sidebar">
          <div className="player-page__shell">
            <section className="player-page__state">
              <h1 className="player-page__state-title">
                We could not load this player.
              </h1>
              <p className="player-page__state-copy">
                Please go back to For You and try opening the book again.
              </p>
              <Link className="player-page__state-link" href="/for-you">
                Back to For You
              </Link>
            </section>
          </div>
        </main>
      </>
    );
  }

  return <PlayerClient book={book} />;
}
