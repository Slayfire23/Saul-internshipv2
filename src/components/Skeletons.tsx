import Sidebar from "@/components/Sidebar";

export function PageSkeleton({
  variant,
}: {
  variant: "for-you" | "book" | "player";
}) {
  return (
    <>
      <Sidebar />
      <main className={`${getPageClassName(variant)} with-sidebar`}>
        <div className={`${getPageClassName(variant)}__shell`}>
          <SkeletonSearchBar />
          {variant === "for-you" && <ForYouSkeleton />}
          {variant === "book" && <BookSkeleton />}
          {variant === "player" && <PlayerSkeleton />}
        </div>
      </main>
    </>
  );
}

export function SettingsSkeleton() {
  return (
    <section className="settings-page__grid">
      <article className="settings-page__card">
        <div className="skeleton skeleton-eyebrow" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line skeleton-line--wide" />
      </article>
      <article className="settings-page__card">
        <div className="skeleton skeleton-eyebrow" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-pill" />
      </article>
    </section>
  );
}

export function SearchResultsSkeleton() {
  return (
    <>
      {[0, 1, 2].map((item) => (
        <div className="app-search__result" key={item}>
          <div className="skeleton app-search__image" />
          <div className="app-search__result-copy">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line--short" />
          </div>
        </div>
      ))}
    </>
  );
}

function ForYouSkeleton() {
  return (
    <>
      <section className="for-you__hero">
        <div className="skeleton skeleton-title skeleton-title--large" />
        <div className="skeleton skeleton-line skeleton-line--wide" />
      </section>
      <section className="for-you__section">
        <div className="selected-book skeleton-card">
          <div>
            <div className="skeleton skeleton-eyebrow" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line skeleton-line--wide" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line--short" />
          </div>
          <div className="skeleton skeleton-cover" />
        </div>
      </section>
      <BookGridSkeleton />
      <BookGridSkeleton />
    </>
  );
}

function SkeletonSearchBar() {
  return (
    <div className="app-search">
      <div className="app-search__input-wrapper">
        <div className="skeleton skeleton-search-icon" />
        <div className="skeleton skeleton-line skeleton-line--wide" />
      </div>
    </div>
  );
}

function BookGridSkeleton() {
  return (
    <section className="for-you__section">
      <div className="skeleton skeleton-section-title" />
      <div className="for-you__grid">
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

function BookSkeleton() {
  return (
    <>
      <section className="book-detail">
        <div className="skeleton skeleton-detail-cover" />
        <div>
          <div className="skeleton skeleton-line skeleton-line--short" />
          <div className="skeleton skeleton-title skeleton-title--large" />
          <div className="skeleton skeleton-line skeleton-line--wide" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton-row">
            <div className="skeleton skeleton-pill" />
            <div className="skeleton skeleton-pill" />
            <div className="skeleton skeleton-pill" />
          </div>
          <div className="skeleton-row">
            <div className="skeleton skeleton-button" />
            <div className="skeleton skeleton-button" />
            <div className="skeleton skeleton-button skeleton-button--wide" />
          </div>
        </div>
      </section>
      <TextSectionSkeleton />
      <TextSectionSkeleton />
    </>
  );
}

function PlayerSkeleton() {
  return (
    <>
      <section className="player-page__hero">
        <div className="skeleton skeleton-eyebrow" />
        <div className="skeleton skeleton-title skeleton-title--large" />
        <div className="skeleton skeleton-line skeleton-line--short" />
      </section>
      <section className="audio-player">
        <div className="skeleton-row skeleton-row--center">
          <div className="skeleton skeleton-circle" />
          <div className="skeleton skeleton-circle skeleton-circle--large" />
          <div className="skeleton skeleton-circle" />
        </div>
        <div className="skeleton skeleton-line skeleton-line--full" />
      </section>
      <TextSectionSkeleton />
    </>
  );
}

function TextSectionSkeleton() {
  return (
    <section className="book-page__section">
      <div className="skeleton skeleton-section-title" />
      <div className="skeleton skeleton-line skeleton-line--full" />
      <div className="skeleton skeleton-line skeleton-line--full" />
      <div className="skeleton skeleton-line skeleton-line--wide" />
    </section>
  );
}

function getPageClassName(variant: "for-you" | "book" | "player") {
  if (variant === "book") {
    return "book-page";
  }

  if (variant === "player") {
    return "player-page";
  }

  return "for-you";
}
