import { useParams } from '@tanstack/react-router';
import { useGetUserProfile, useFeed } from '../hooks/useQueries';
import ProfileHeader from '../components/profile/ProfileHeader';
import FeedList from '../components/feed/FeedList';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function ProfilePage() {
  const { principal } = useParams({ from: '/profile/$principal' });
  const { data: profile, isLoading: profileLoading } = useGetUserProfile(principal);
  const { data: posts, isLoading: postsLoading } = useFeed(20, 0);

  if (profileLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Profile not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userPosts = posts?.filter((post) => post.author.toString() === principal) || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProfileHeader profile={profile} principal={principal} />
      <div>
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {userPosts.length === 0 && !postsLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No posts yet.</p>
            </CardContent>
          </Card>
        ) : (
          <FeedList posts={userPosts} isLoading={postsLoading} />
        )}
      </div>
    </div>
  );
}
