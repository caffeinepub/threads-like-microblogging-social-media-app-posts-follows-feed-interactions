import { useFollowUser, useGetFollowing } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';
import AuthRequired from '../auth/AuthRequired';

interface FollowButtonProps {
  principal: string;
}

export default function FollowButton({ principal }: FollowButtonProps) {
  const { identity } = useInternetIdentity();
  const followUser = useFollowUser();
  const { data: following } = useGetFollowing(identity?.getPrincipal().toString());

  const isFollowing = following?.some((p) => p.toString() === principal) || false;

  const handleFollow = async () => {
    try {
      await followUser.mutateAsync(Principal.fromText(principal));
      toast.success(isFollowing ? 'Unfollowed user' : 'Followed user!');
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  return (
    <AuthRequired fallback={<Button variant="outline" size="sm" disabled>Follow</Button>}>
      <Button
        variant={isFollowing ? 'outline' : 'default'}
        size="sm"
        onClick={handleFollow}
        disabled={followUser.isPending}
      >
        {followUser.isPending ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
      </Button>
    </AuthRequired>
  );
}
