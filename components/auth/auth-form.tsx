'use client';

import { useAuthForm } from './hooks/use-auth-form';
import { useSocialAuth } from './hooks/use-social-auth';
import { AuthHeader } from './auth-header';
import { EmailForm } from './email-form';
import { SocialButtons } from './social-buttons';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AuthForm() {
  const {
    isLogin,
    email,
    password,
    isLoading: formLoading,
    setIsLogin,
    setEmail,
    setPassword,
    handleSubmit
  } = useAuthForm();

  const {
    isLoading: socialLoading,
    handleGoogleSignIn,
    handleGithubSignIn
  } = useSocialAuth();

  const isLoading = formLoading || socialLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <AuthHeader isLogin={isLogin} />
        </CardHeader>

        <CardContent>
          <EmailForm
            email={email}
            password={password}
            isLoading={isLoading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <SocialButtons
            isLoading={isLoading}
            onGoogleClick={handleGoogleSignIn}
            onGithubClick={handleGithubSignIn}
          />
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
            disabled={isLoading}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}