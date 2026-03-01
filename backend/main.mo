import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Mix in the prefabricated authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Profile = {
    userId : Principal;
    fullName : Text;
    department : Text;
    designation : Text;
    railwayZone : Text;
    division : Text;
    currentPostingLocation : Text;
    desiredPostingLocation : Text;
    contactVisible : Bool;
    email : ?Text;
    phone : ?Text;
    createdAt : Time.Time;
  };

  type SearchFilters = {
    zone : ?Text;
    division : ?Text;
    location : ?Text;
    designation : ?Text;
  };

  type DashboardStats = {
    profileCompletionPercentage : Nat;
    matchCount : Nat;
  };

  let profiles = Map.empty<Principal, Profile>();

  // Masks contact info based on contactVisible setting
  func applyContactVisibility(profile : Profile) : Profile {
    if (profile.contactVisible) {
      profile;
    } else {
      {
        profile with
        email = null;
        phone = null;
      };
    };
  };

  // registerOrLogin: Open to any authenticated (non-anonymous) caller.
  // No longer calls AccessControl.initialize for user role assignment.
  public shared ({ caller }) func registerOrLogin() : async Profile {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous principals cannot register");
    };

    switch (profiles.get(caller)) {
      case (?profile) {
        profile;
      };
      case (null) {
        let newProfile : Profile = {
          userId = caller;
          fullName = "";
          department = "Indian Railways";
          designation = "";
          railwayZone = "";
          division = "";
          currentPostingLocation = "";
          desiredPostingLocation = "";
          contactVisible = false;
          email = null;
          phone = null;
          createdAt = Time.now();
        };
        profiles.add(caller, newProfile);
        newProfile;
      };
    };
  };

  // getMyProfile: Only authenticated users can fetch their own profile
  public query ({ caller }) func getMyProfile() : async Profile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  // getCallerUserProfile: Required by frontend — returns caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?Profile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    profiles.get(caller);
  };

  // getUserProfile: Caller can view their own profile; admins can view any profile
  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (profiles.get(user)) {
      case (null) { null };
      case (?profile) { ?applyContactVisibility(profile) };
    };
  };

  // saveCallerUserProfile: Required by frontend — saves/updates caller's profile
  public shared ({ caller }) func saveCallerUserProfile(profile : Profile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    // Ensure the profile's userId matches the caller to prevent spoofing
    let sanitized : Profile = {
      profile with
      userId = caller;
    };
    profiles.add(caller, sanitized);
  };

  // updateProfile: Only authenticated users can update their own profile
  public shared ({ caller }) func updateProfile(
    fullName : Text,
    department : Text,
    designation : Text,
    railwayZone : Text,
    division : Text,
    currentPostingLocation : Text,
    desiredPostingLocation : Text,
    contactVisible : Bool,
    email : ?Text,
    phone : ?Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update their profile");
    };
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?existingProfile) {
        let updatedProfile : Profile = {
          existingProfile with
          fullName;
          department;
          designation;
          railwayZone;
          division;
          currentPostingLocation;
          desiredPostingLocation;
          contactVisible;
          email;
          phone;
        };
        profiles.add(caller, updatedProfile);
      };
    };
  };

  // getMatches: Only authenticated users can retrieve their mutual matches
  public query ({ caller }) func getMatches() : async [Profile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view matches");
    };
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Caller profile not found") };
      case (?myProfile) {
        let matchingProfiles = profiles.values().filter(
          func(profile : Profile) : Bool {
            profile.userId != caller and
            profile.currentPostingLocation == myProfile.desiredPostingLocation and
            profile.desiredPostingLocation == myProfile.currentPostingLocation;
          }
        );
        let matchingArray = matchingProfiles.toArray();
        matchingArray.map<Profile, Profile>(applyContactVisibility);
      };
    };
  };

  // searchProfiles: Only authenticated users can search profiles
  public query ({ caller }) func searchProfiles(filters : SearchFilters) : async [Profile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can search profiles");
    };
    let filtered = profiles.values().filter(
      func(profile : Profile) : Bool {
        profile.userId != caller and
        (switch (filters.zone) {
          case (null) { true };
          case (?zone) { profile.railwayZone == zone };
        }) and
        (switch (filters.division) {
          case (null) { true };
          case (?div) { profile.division == div };
        }) and
        (switch (filters.location) {
          case (null) { true };
          case (?loc) { profile.currentPostingLocation == loc };
        }) and
        (switch (filters.designation) {
          case (null) { true };
          case (?des) { profile.designation == des };
        });
      }
    );
    let filteredArray = filtered.toArray();
    filteredArray.map<Profile, Profile>(applyContactVisibility);
  };

  // getDashboardStats: Only authenticated users can view their dashboard stats
  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view dashboard stats");
    };
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?myProfile) {
        let totalFields = 8;
        var filledFields = 0;

        if (myProfile.fullName != "") { filledFields += 1 };
        if (myProfile.designation != "") { filledFields += 1 };
        if (myProfile.railwayZone != "") { filledFields += 1 };
        if (myProfile.division != "") { filledFields += 1 };
        if (myProfile.currentPostingLocation != "") { filledFields += 1 };
        if (myProfile.desiredPostingLocation != "") { filledFields += 1 };
        if (myProfile.email != null) { filledFields += 1 };
        if (myProfile.phone != null) { filledFields += 1 };

        let profileCompletionPercentage = (filledFields * 100) / totalFields;

        let matches = profiles.values().filter(
          func(profile : Profile) : Bool {
            profile.userId != caller and
            profile.currentPostingLocation == myProfile.desiredPostingLocation and
            profile.desiredPostingLocation == myProfile.currentPostingLocation;
          }
        );

        {
          profileCompletionPercentage;
          matchCount = matches.size();
        };
      };
    };
  };
};
