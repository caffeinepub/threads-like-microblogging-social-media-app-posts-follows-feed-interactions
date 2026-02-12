import { UserProfile, Post } from '../../backend';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import PostCard from '../posts/PostCard';

interface SearchResultsProps {
  users?: UserProfile[];
  posts?: Post[];
  isLoading?: boolean;
}

export default function SearchResults({ users, posts, isLoading }: SearchResultsProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return <p className="text-center text-muted-foreground py-8">Searching...</p>;
  }

  const hasResults = (users && users.length > 0) || (posts && posts.length > 0);

  if (!hasResults) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No results found. Try a different search term.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {users && users.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Users</h3>
          <div className="space-y-2">
            {users.map((user, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => navigate({ to: `/profile/${user.handle}` })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || '/assets/generated/avatar-placeholder.dim_256x256.png'} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.displayName}</p>
                      <p className="text-sm text-muted-foreground">@{user.handle}</p>
                      {user.bio && <p className="text-sm mt-1">{user.bio}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {posts && posts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Posts</h3>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id.toString()} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
