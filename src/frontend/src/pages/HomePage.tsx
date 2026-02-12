import { useState } from 'react';
import { useFeed } from '../hooks/useQueries';
import FeedList from '../components/feed/FeedList';
import EmptyFeedState from '../components/empty/EmptyFeedState';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const { data: posts, isLoading } = useFeed(limit, offset);

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const showEmptyState = !isLoading && (!posts || posts.length === 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Home</h1>
        <p className="text-muted-foreground">
          {identity ? 'Your personalized feed' : 'Explore public posts'}
        </p>
      </div>

      {showEmptyState ? (
        <EmptyFeedState />
      ) : (
        <FeedList
          posts={posts || []}
          isLoading={isLoading}
          hasMore={posts && posts.length >= limit}
          onLoadMore={handleLoadMore}
        />
      )}
    </div>
  );
}
