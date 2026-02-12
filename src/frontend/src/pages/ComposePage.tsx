import { useNavigate } from '@tanstack/react-router';
import PostComposer from '../components/posts/PostComposer';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ComposePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Please sign in to create a post.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSuccess = () => {
    navigate({ to: '/' });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Create Post</h1>
      </div>
      <PostComposer onSuccess={handleSuccess} />
    </div>
  );
}
