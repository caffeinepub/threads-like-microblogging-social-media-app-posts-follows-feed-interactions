import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Search, PenSquare, User } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { cn } from '@/lib/utils';

export default function BottomTabNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity, login } = useInternetIdentity();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/', icon: Home, label: 'Home', authRequired: false },
    { path: '/explore', icon: Search, label: 'Explore', authRequired: false },
    { path: '/compose', icon: PenSquare, label: 'Compose', authRequired: true },
    {
      path: identity ? `/profile/${identity.getPrincipal().toString()}` : '/profile/me',
      icon: User,
      label: 'Profile',
      authRequired: true,
    },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.authRequired && !identity) {
      login();
      return;
    }
    navigate({ to: item.path });
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          const disabled = item.authRequired && !identity;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              disabled={disabled && false}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[64px] touch-manipulation',
                active
                  ? 'text-primary bg-primary/10'
                  : disabled
                  ? 'text-muted-foreground/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className={cn('h-5 w-5', active && 'fill-current')} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
