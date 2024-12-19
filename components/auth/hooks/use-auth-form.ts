'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmail, signUpWithEmail } from '@/lib/firebase/services/auth';
import { useToast } from '@/components/ui/use-toast';

export function useAuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/create-podcast';
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      router.replace(redirectTo);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Authentication failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLogin,
    email,
    password,
    isLoading,
    setIsLogin,
    setEmail,
    setPassword,
    handleSubmit
  };
}