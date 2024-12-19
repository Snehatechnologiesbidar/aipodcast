'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Mic2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/discover', icon: Compass, label: 'Discover' },
  { href: '/create-podcast', icon: Mic2, label: 'Create Podcast' }
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 px-2">
      {links.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isActive && 'bg-accent text-accent-foreground'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}