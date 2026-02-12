import { useParams } from '@tanstack/react-router';
import { useGetPost, useFeed } from '../hooks/useQueries';
import PostCard from '../components/posts/PostCard';
import PostComposer from '../components/posts/PostComposer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Separator } from '@/components/ui/separator';

export default function PostDetailPage() {
  const { postId } = useParams({ from: '/post/$postId' });
  const { identity } = useInternetIdentity();
  const { data: post, isLoading: postLoading } = useGetPost(postId);
  const { data: allPosts } = useFeed(100, 0);

  if (postLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Post not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const replies = allPosts?.filter((p) => p.replyTo?.toString() === postId) || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PostCard post={post} />

      {identity && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Reply to this post</h3>
          <PostComposer replyTo={post.id} placeholder="Write your reply..." />
        </div>
      )}

      {replies.length > 0 && (
        <div>
          <Separator className="my-6" />
          <h3 className="text-lg font-semibold mb-4">Replies ({replies.length})</h3>
          <div className="space-y-4">
            {replies.map((reply) => (
              <PostCard key={reply.id.toString()} post={reply} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
