import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface AuthRequiredProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthRequired({ children, fallback }: AuthRequiredProps) {
  const { identity, login } = useInternetIdentity();

  if (!identity) {
    return (
      fallback || (
        <Button variant="ghost" size="sm" onClick={login} className="gap-2">
          <LogIn className="h-4 w-4" />
          Sign in to interact
        </Button>
      )
    );
  }

  return <>{children}</>;
}
