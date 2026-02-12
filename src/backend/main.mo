import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Data Models
  public type PostId = Nat;

  public type UserProfile = {
    handle : Text;
    displayName : Text;
    bio : Text;
    avatar : ?Text;
    followersCount : Nat;
    followingCount : Nat;
  };

  public type Post = {
    id : PostId;
    author : Principal;
    content : Text;
    timestamp : Int;
    replyTo : ?PostId;
    likes : Nat;
    reposts : Nat;
    replies : Nat;
  };

  // State
  var nextPostId : Nat = 0;
  let posts = Map.empty<PostId, Post>();
  let profiles = Map.empty<Principal, UserProfile>();
  let following = Map.empty<Principal, Set.Set<Principal>>();
  let likes = Map.empty<PostId, Set.Set<Principal>>();
  let reposts = Map.empty<PostId, Set.Set<Principal>>();

  // Include Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Required profile management functions for frontend
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  // Profile management (additional convenience methods)
  public shared ({ caller }) func createProfile(handle : Text, displayName : Text, bio : Text, avatar : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    assert handle.size() > 0 and displayName.size() > 0;
    if (profiles.containsKey(caller)) { Runtime.trap("Profile already exists") };
    let profile : UserProfile = {
      handle;
      displayName;
      bio;
      avatar;
      followersCount = 0;
      followingCount = 0;
    };
    profiles.add(caller, profile);
  };

  public shared ({ caller }) func updateProfile(displayName : Text, bio : Text, avatar : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    let existing = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) { profile };
    };
    let updated = { existing with displayName; bio; avatar };
    profiles.add(caller, updated);
  };

  public query ({ caller }) func getProfile(user : Principal) : async UserProfile {
    // Public access - no authentication required
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  // Post management
  public shared ({ caller }) func createPost(content : Text, replyTo : ?PostId) : async PostId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    let postId = nextPostId;
    nextPostId += 1;
    let post : Post = {
      id = postId;
      author = caller;
      content;
      timestamp = 0;
      replyTo;
      likes = 0;
      reposts = 0;
      replies = 0;
    };
    posts.add(postId, post);
    postId;
  };

  public query ({ caller }) func getPost(id : PostId) : async Post {
    // Public access - no authentication required
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) { post };
    };
  };

  public query ({ caller }) func getFeed(limit : Nat, offset : Nat) : async [Post] {
    // Public access - no authentication required (limited public feed)
    let allPosts = posts.values().toArray();
    let sortedPosts = allPosts.sort(
      func(a, b) {
        Int.compare(b.timestamp, a.timestamp);
      }
    );
    let end = Nat.min(offset + limit, sortedPosts.size());
    if (offset >= sortedPosts.size()) { return [] };
    let resultSize = end - offset;
    Array.tabulate(
      resultSize,
      func(i) {
        sortedPosts[offset + i];
      },
    );
  };

  // Social interactions
  public shared ({ caller }) func follow(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can follow others");
    };
    if (caller == user) { Runtime.trap("Cannot follow yourself") };
    switch (following.get(caller)) {
      case (null) {
        let newFollowers = Set.empty<Principal>();
        following.add(caller, newFollowers);
      };
      case (_) {};
    };
    let followers = switch (following.get(caller)) {
      case (null) { Set.empty<Principal>() };
      case (?set) { set };
    };
    followers.add(user);
  };

  public shared ({ caller }) func likePost(postId : PostId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like posts");
    };
    if (not posts.containsKey(postId)) { Runtime.trap("Post does not exist") };
    switch (likes.get(postId)) {
      case (null) {
        let newLikes = Set.empty<Principal>();
        likes.add(postId, newLikes);
      };
      case (_) {};
    };
    let _ = switch (likes.get(postId)) {
      case (null) { Runtime.trap("Internal error: Like state missing") };
      case (?set) { set };
    };
  };

  public shared ({ caller }) func repost(postId : PostId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can repost");
    };
    if (not posts.containsKey(postId)) { Runtime.trap("Post does not exist") };
    switch (reposts.get(postId)) {
      case (null) {
        let newReposts = Set.empty<Principal>();
        reposts.add(postId, newReposts);
      };
      case (_) {};
    };
    let _ = switch (reposts.get(postId)) {
      case (null) { Runtime.trap("Internal error: Repost state missing") };
      case (?set) { set };
    };
  };

  public query ({ caller }) func getFollowers(user : Principal) : async [Principal] {
    // Public access - no authentication required
    switch (following.get(user)) {
      case (null) { [] };
      case (?set) { set.values().toArray() };
    };
  };

  public query ({ caller }) func getFollowing(user : Principal) : async [Principal] {
    // Public access - no authentication required
    switch (following.get(user)) {
      case (null) { [] };
      case (?set) { set.values().toArray() };
    };
  };

  public query ({ caller }) func searchUsers(queryText : Text) : async [UserProfile] {
    // Public access - no authentication required
    let lowerQuery = queryText.toLower();
    let filtered = profiles.values().toArray().filter(
      func(profile) {
        profile.handle.toLower().contains(#text lowerQuery) or profile.displayName.toLower().contains(#text lowerQuery);
      }
    );
    filtered;
  };

  public query ({ caller }) func searchPosts(queryText : Text) : async [Post] {
    // Public access - no authentication required
    let lowerQuery = queryText.toLower();
    let filtered = posts.values().toArray().filter(
      func(post) {
        post.content.toLower().contains(#text lowerQuery);
      }
    );
    filtered;
  };
};
