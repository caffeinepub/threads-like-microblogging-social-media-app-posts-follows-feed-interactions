import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { Post, UserProfile, PostId } from '../backend';

// Query Keys
export const queryKeys = {
  currentUserProfile: ['currentUserProfile'],
  userProfile: (principal: string) => ['userProfile', principal],
  post: (postId: string) => ['post', postId],
  feed: (limit: number, offset: number) => ['feed', limit, offset],
  userPosts: (principal: string) => ['userPosts', principal],
  followers: (principal: string) => ['followers', principal],
  following: (principal: string) => ['following', principal],
  searchUsers: (query: string) => ['searchUsers', query],
  searchPosts: (query: string) => ['searchPosts', query],
  postReplies: (postId: string) => ['postReplies', postId],
};

// Current User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: queryKeys.currentUserProfile,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUserProfile });
    },
  });
}

// User Profile
export function useGetUserProfile(principal: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile>({
    queryKey: queryKeys.userProfile(principal || ''),
    queryFn: async () => {
      if (!actor || !principal) throw new Error('Actor or principal not available');
      return actor.getProfile(Principal.fromText(principal));
    },
    enabled: !!actor && !actorFetching && !!principal,
  });
}

// Feed
export function useFeed(limit: number = 20, offset: number = 0) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: queryKeys.feed(limit, offset),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeed(BigInt(limit), BigInt(offset));
    },
    enabled: !!actor && !actorFetching,
  });
}

// Post
export function useGetPost(postId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post>({
    queryKey: queryKeys.post(postId || ''),
    queryFn: async () => {
      if (!actor || !postId) throw new Error('Actor or postId not available');
      return actor.getPost(BigInt(postId));
    },
    enabled: !!actor && !actorFetching && !!postId,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, replyTo }: { content: string; replyTo?: PostId }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(content, replyTo !== undefined ? replyTo : null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['postReplies'] });
    },
  });
}

// Social Interactions
export function useFollowUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.follow(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUserProfile });
    },
  });
}

export function useLikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: PostId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });
}

export function useRepost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: PostId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.repost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });
}

// Search
export function useSearchUsers(query: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: queryKeys.searchUsers(query),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchUsers(query);
    },
    enabled: !!actor && !actorFetching && query.length > 0,
  });
}

export function useSearchPosts(query: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: queryKeys.searchPosts(query),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchPosts(query);
    },
    enabled: !!actor && !actorFetching && query.length > 0,
  });
}

// Followers/Following
export function useGetFollowers(principal: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: queryKeys.followers(principal || ''),
    queryFn: async () => {
      if (!actor || !principal) throw new Error('Actor or principal not available');
      return actor.getFollowers(Principal.fromText(principal));
    },
    enabled: !!actor && !actorFetching && !!principal,
  });
}

export function useGetFollowing(principal: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: queryKeys.following(principal || ''),
    queryFn: async () => {
      if (!actor || !principal) throw new Error('Actor or principal not available');
      return actor.getFollowing(Principal.fromText(principal));
    },
    enabled: !!actor && !actorFetching && !!principal,
  });
}
