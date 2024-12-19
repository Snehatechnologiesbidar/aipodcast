'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSignOut } from '@/hooks/use-sign-out';

export function SignOutButton() {
  const { signOut, isLoading } = useSignOut();

  return (
    <Button
      
      className="w-full justify-start gap-3 hover:bg-accent hover:text-accent-foreground"
      onClick={signOut}
      disabled={isLoading}
    >
      <LogOut className="w-5 h-5" />
      <span>Sign Out</span>
    </Button>
  );
}