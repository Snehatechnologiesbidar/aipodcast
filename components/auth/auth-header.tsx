interface AuthHeaderProps {
  isLogin: boolean;
}

export function AuthHeader({ isLogin }: AuthHeaderProps) {
  return (
    <>
      <h1 className="text-2xl font-bold text-center">
        {isLogin ? 'Login' : 'Create Account'}
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        {isLogin
          ? 'Welcome back! Please login to your account.'
          : 'Create a new account to get started.'}
      </p>
    </>
  );
}