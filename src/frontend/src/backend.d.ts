import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Post {
    id: PostId;
    content: string;
    author: Principal;
    likes: bigint;
    timestamp: bigint;
    replies: bigint;
    replyTo?: PostId;
    reposts: bigint;
}
export interface UserProfile {
    bio: string;
    displayName: string;
    followersCount: bigint;
    handle: string;
    followingCount: bigint;
    avatar?: string;
}
export type PostId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(content: string, replyTo: PostId | null): Promise<PostId>;
    createProfile(handle: string, displayName: string, bio: string, avatar: string | null): Promise<void>;
    follow(user: Principal): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeed(limit: bigint, offset: bigint): Promise<Array<Post>>;
    getFollowers(user: Principal): Promise<Array<Principal>>;
    getFollowing(user: Principal): Promise<Array<Principal>>;
    getPost(id: PostId): Promise<Post>;
    getProfile(user: Principal): Promise<UserProfile>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    likePost(postId: PostId): Promise<void>;
    repost(postId: PostId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchPosts(queryText: string): Promise<Array<Post>>;
    searchUsers(queryText: string): Promise<Array<UserProfile>>;
    updateProfile(displayName: string, bio: string, avatar: string | null): Promise<void>;
}
