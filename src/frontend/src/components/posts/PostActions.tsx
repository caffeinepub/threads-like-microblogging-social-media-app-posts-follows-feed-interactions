import { Post } from '../../backend';
import { useLikePost, useRepost } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Heart, Repeat2, MessageCircle } from 'lucide-react';
import AuthRequired from '../auth/AuthRequired';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

interface PostActionsProps {
  post: Post;
}

export default function PostActions({ post }: PostActionsProps) {
  const navigate = useNavigate();
  const likePost = useLikePost();
  const repostMutation = useRepost();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await likePost.mutateAsync(post.id);
      toast.success('Post liked!');
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleRepost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await repostMutation.mutateAsync(post.id);
      toast.success('Post reposted!');
    } catch (error) {
      toast.error('Failed to repost');
    }
  };

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: `/post/${post.id.toString()}` });
  };

  return (
    <div className="flex items-center gap-4">
      <AuthRequired
        fallback={
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" disabled>
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.replies.toString()}</span>
          </Button>
        }
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReply}
          className="gap-1 text-muted-foreground hover:text-primary"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{post.replies.toString()}</span>
        </Button>
      </AuthRequired>

      <AuthRequired
        fallback={
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" disabled>
            <Repeat2 className="h-4 w-4" />
            <span className="text-xs">{post.reposts.toString()}</span>
          </Button>
        }
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRepost}
          disabled={repostMutation.isPending}
          className="gap-1 text-muted-foreground hover:text-green-600"
        >
          <Repeat2 className="h-4 w-4" />
          <span className="text-xs">{post.reposts.toString()}</span>
        </Button>
      </AuthRequired>

      <AuthRequired
        fallback={
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" disabled>
            <Heart className="h-4 w-4" />
            <span className="text-xs">{post.likes.toString()}</span>
          </Button>
        }
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={likePost.isPending}
          className="gap-1 text-muted-foreground hover:text-red-600"
        >
          <Heart className="h-4 w-4" />
          <span className="text-xs">{post.likes.toString()}</span>
        </Button>
      </AuthRequired>
    </div>
  );
}
