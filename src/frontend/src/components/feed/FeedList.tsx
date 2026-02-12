import { Post } from '../../backend';
import PostCard from '../posts/PostCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FeedListProps {
  posts: Post[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function FeedList({ posts, isLoading, hasMore, onLoadMore }: FeedListProps) {
  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id.toString()} post={post} />
      ))}
      {hasMore && (
        <div className="flex justify-center py-4">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
