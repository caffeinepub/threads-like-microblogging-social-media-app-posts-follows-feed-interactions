import { ReactNode } from 'react';
import AppNav from './AppNav';
import BottomTabNav from './BottomTabNav';
import AuthButton from '../auth/AuthButton';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <img src="/assets/generated/josh-logo.dim_512x512.png" alt="Josh logo" className="h-8 w-8" />
              <span className="text-xl font-bold">Josh</span>
            </a>
            <AppNav />
          </div>
          <AuthButton />
        </div>
      </header>
      <main className="container py-6 pb-24 md:pb-6">
        {children}
      </main>
      <footer className="border-t py-6 mt-12 mb-16 md:mb-0">
        <div className="container flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
      <BottomTabNav />
      <ProfileSetupDialog />
    </div>
  );
}
