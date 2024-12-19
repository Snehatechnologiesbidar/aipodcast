import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EmailFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EmailForm({
  email,
  password,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit
}: EmailFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        disabled={isLoading}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        disabled={isLoading}
        required
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Continue'}
      </Button>
    </form>
  );
}