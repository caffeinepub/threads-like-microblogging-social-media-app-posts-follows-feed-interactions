import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useSearchUsers, useSearchPosts, useFeed } from '../hooks/useQueries';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import SearchResults from '../components/search/SearchResults';
import FeedList from '../components/feed/FeedList';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  const { data: users, isLoading: usersLoading } = useSearchUsers(debouncedQuery);
  const { data: posts, isLoading: postsLoading } = useSearchPosts(debouncedQuery);
  const { data: feedPosts, isLoading: feedLoading } = useFeed(20, 0);

  const showSearchResults = debouncedQuery.length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Explore</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users and posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {showSearchResults ? (
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-6">
            <SearchResults users={users} isLoading={usersLoading} />
          </TabsContent>
          <TabsContent value="posts" className="mt-6">
            <SearchResults posts={posts} isLoading={postsLoading} />
          </TabsContent>
        </Tabs>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
          <FeedList posts={feedPosts || []} isLoading={feedLoading} />
        </div>
      )}
    </div>
  );
}
