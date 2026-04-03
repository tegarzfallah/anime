import Link from 'next/link';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/70 bg-bg/80 backdrop-blur-xl">
      <div className="container-page flex items-center justify-between py-3">
        <Link href="/" className="text-lg font-black tracking-tight text-white">
          ANIME<span className="text-amber-400">TSU</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm text-zinc-300">
          <Link href="/" className="rounded-md px-3 py-2 transition hover:bg-zinc-800/70 hover:text-white">
            Home
          </Link>
          <Link href="/search" className="rounded-md px-3 py-2 transition hover:bg-zinc-800/70 hover:text-white">
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
};
