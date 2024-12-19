'use client';

import { NavLinks } from './nav-links';
import { SignOutButton } from './sign-out-button';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">AI Podcast</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <NavLinks />
      </div>

      <div className="mt-auto p-4 border-t border-border">
        <SignOutButton />
      </div>
    </aside>
  );
}