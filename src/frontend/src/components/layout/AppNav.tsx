import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Search, PenSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function AppNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Search, label: 'Explore' },
    { path: '/compose', icon: PenSquare, label: 'Compose', authRequired: true },
    {
      path: identity ? `/profile/${identity.getPrincipal().toString()}` : '/profile/me',
      icon: User,
      label: 'Profile',
      authRequired: true,
    },
  ];

  return (
    <nav className="hidden md:flex items-center gap-2">
      {navItems.map((item) => {
        if (item.authRequired && !identity) return null;
        const isActive = currentPath === item.path;
        return (
          <Button
            key={item.path}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate({ to: item.path })}
            className="gap-2"
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden lg:inline">{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
}
