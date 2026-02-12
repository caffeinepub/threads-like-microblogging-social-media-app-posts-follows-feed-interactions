import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { PenSquare, Search } from 'lucide-react';

export default function EmptyFeedState() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <img
          src="/assets/generated/empty-feed-illustration.dim_1200x600.png"
          alt="Empty feed"
          className="mx-auto mb-6 max-w-md w-full opacity-80"
        />
        <h2 className="text-2xl font-bold mb-2">Your feed is empty</h2>
        <p className="text-muted-foreground mb-6">
          Start by creating your first post or search for users to follow!
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate({ to: '/compose' })} className="gap-2">
            <PenSquare className="h-4 w-4" />
            Create Post
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/explore' })} className="gap-2">
            <Search className="h-4 w-4" />
            Explore Users
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
