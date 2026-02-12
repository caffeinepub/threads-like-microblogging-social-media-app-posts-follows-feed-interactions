import { Post, UserProfile } from '../../backend';
import { useGetUserProfile } from '../../hooks/useQueries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import PostActions from './PostActions';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const { data: authorProfile } = useGetUserProfile(post.author.toString());

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: `/profile/${post.author.toString()}` });
  };

  const handlePostClick = () => {
    navigate({ to: `/post/${post.id.toString()}` });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handlePostClick}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 cursor-pointer" onClick={handleProfileClick}>
            <AvatarImage src={authorProfile?.avatar || '/assets/generated/avatar-placeholder.dim_256x256.png'} />
            <AvatarFallback>{authorProfile ? getInitials(authorProfile.displayName) : '??'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={handleProfileClick}
                className="font-semibold hover:underline text-sm"
              >
                {authorProfile?.displayName || 'Loading...'}
              </button>
              <span className="text-muted-foreground text-sm">
                @{authorProfile?.handle || '...'}
              </span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm">
                {formatTimestamp(post.timestamp)}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap break-words mb-3">{post.content}</p>
            <PostActions post={post} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
