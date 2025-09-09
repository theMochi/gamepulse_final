'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Command } from 'lucide-react';
import { compact, starsFromTotal } from '@/lib/score';

interface SearchResult {
  id: number;
  name: string;
  cover?: { image_id: string };
  first_release_date?: number;
  total_rating?: number;
  total_rating_count?: number;
  platforms?: { abbreviation?: string }[];
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const metaK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      const slash = e.key === '/';
      if (metaK || slash) { 
        e.preventDefault(); 
        setOpen(true); 
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!q) { 
      setResults([]); 
      return; 
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/igdb/search?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        setResults(json.items ?? []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-3 w-[22rem] lg:w-[28rem] rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-600 hover:border-neutral-400 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left truncate">Search games…</span>
        <kbd className="px-1.5 py-0.5 rounded border text-xs text-neutral-500">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setOpen(false)}>
          <div className="mx-auto mt-24 max-w-2xl" onClick={(e)=>e.stopPropagation()}>
            <div className="rounded-xl bg-white shadow-2xl">
              <div className="border-b p-3">
                <input
                  autoFocus
                  value={q}
                  onChange={(e)=>setQ(e.target.value)}
                  placeholder="Type to search games…"
                  className="w-full outline-none text-base"
                />
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {loading && <div className="p-4 text-sm text-neutral-500">Searching…</div>}
                {!loading && results.length === 0 && q && (
                  <div className="p-4 text-sm text-neutral-500">No results.</div>
                )}
                <ul className="divide-y">
                  {results.map((g: SearchResult)=>(
                    <li key={g.id}>
                      <Link 
                        href={`/game/${g.id}`} 
                        className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {g.cover?.image_id ? (
                          <Image
                            alt=""
                            className="h-12 w-9 rounded-md object-cover"
                            src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${g.cover.image_id}.jpg`}
                            width={36}
                            height={48}
                          />
                        ) : <div className="h-12 w-9 rounded-md bg-neutral-200" />}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{g.name}</div>
                          <div className="text-xs text-neutral-500 flex items-center gap-2">
                            <span>{g.first_release_date ? new Date(g.first_release_date*1000).getFullYear() : '—'}</span>
                            <span>•</span>
                            <span>{Math.round(g.total_rating ?? 0)} ({compact(g.total_rating_count)})</span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
