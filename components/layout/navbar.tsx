import Link from 'next/link';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-800/70 bg-bg/80 backdrop-blur">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          AniStream
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-300">
          <Link href="/">Home</Link>
          <Link href="/search">Search</Link>
        </nav>
      </div>
    </header>
  );
};
