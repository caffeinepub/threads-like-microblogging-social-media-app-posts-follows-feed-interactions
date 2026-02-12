import { UserProfile } from '../../backend';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import FollowButton from './FollowButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

interface ProfileHeaderProps {
  profile: UserProfile;
  principal: string;
}

export default function ProfileHeader({ profile, principal }: ProfileHeaderProps) {
  const { identity } = useInternetIdentity();
  const isOwnProfile = identity?.getPrincipal().toString() === principal;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar || '/assets/generated/avatar-placeholder.dim_256x256.png'} />
            <AvatarFallback className="text-2xl">{getInitials(profile.displayName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                <p className="text-muted-foreground">@{profile.handle}</p>
              </div>
              {!isOwnProfile && <FollowButton principal={principal} />}
            </div>
            {profile.bio && <p className="text-sm mb-3">{profile.bio}</p>}
            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-semibold">{profile.followingCount.toString()}</span>{' '}
                <span className="text-muted-foreground">Following</span>
              </div>
              <div>
                <span className="font-semibold">{profile.followersCount.toString()}</span>{' '}
                <span className="text-muted-foreground">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
