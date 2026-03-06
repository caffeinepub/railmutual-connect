import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  MapPin,
  RefreshCw,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useActor } from "../hooks/useActor";
import {
  useGetCallerUserProfile,
  useGetDashboardStats,
} from "../hooks/useQueries";

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useGetCallerUserProfile();

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetDashboardStats();

  const isLoading = profileLoading || statsLoading;

  const handleDeleteProfile = async () => {
    if (!actor || !profile) return;
    setIsDeleting(true);
    try {
      // Reset all profile fields to empty strings (simulate delete)
      const resetProfile = {
        ...profile,
        fullName: "",
        department: "",
        designation: "",
        railwayZone: "",
        division: "",
        currentPostingLocation: "",
        desiredPostingLocation: "",
        contactVisible: false,
        email: undefined,
        phone: undefined,
      };
      await actor.saveCallerUserProfile(resetProfile);
      await queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      setDeleteDialogOpen(false);
      navigate({ to: "/profile" });
    } catch (err) {
      console.error("Failed to reset profile:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefetch = () => {
    refetchProfile();
    refetchStats();
  };

  // Show error state if both fail
  if (!isLoading && (profileError || statsError)) {
    const errMsg =
      profileError instanceof Error
        ? profileError.message
        : statsError instanceof Error
          ? statsError.message
          : "Failed to load dashboard data";

    const isUnauthorized =
      errMsg.includes("Unauthorized") || errMsg.includes("not found");

    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
        <Alert variant="destructive" className="text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isUnauthorized
              ? "Your session may have expired. Please log out and log in again."
              : errMsg}
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={handleRefetch} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  const completionPct = stats?.profileCompletionPercentage ?? 0;
  const matchCount = stats?.matchCount ?? 0;
  const displayName = profile?.fullName || "Railway Employee";
  const zone = profile?.railwayZone || "";
  const currentPosting = profile?.currentPostingLocation || "";
  const desiredPosting = profile?.desiredPostingLocation || "";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Greeting */}
      <div className="space-y-1">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold font-poppins text-foreground">
              Welcome, {displayName}!
            </h1>
            {zone && (
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {zone}
                {currentPosting && ` · ${currentPosting}`}
              </p>
            )}
          </>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Profile Completion */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-3 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground text-sm">
                Profile Completion
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <span className="text-2xl font-bold text-primary">
                {completionPct}%
              </span>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-2 w-full rounded-full" />
          ) : (
            <Progress value={completionPct} className="h-2" />
          )}
          {!isLoading && completionPct < 100 && (
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-primary"
              onClick={() => navigate({ to: "/profile" })}
            >
              Complete your profile <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>

        {/* Match Count */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-3 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <span className="font-semibold text-foreground text-sm">
                Mutual Matches
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-8" />
            ) : (
              <span className="text-2xl font-bold text-accent">
                {matchCount}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isLoading
              ? "Loading…"
              : matchCount === 0
                ? "No mutual matches yet. Complete your profile to find matches."
                : `${matchCount} employee${matchCount !== 1 ? "s" : ""} want to swap to your location.`}
          </p>
          {!isLoading && (
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-accent"
              onClick={() => navigate({ to: "/matches" })}
            >
              View matches <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-card">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => navigate({ to: "/profile" })}
          >
            <UserCheck className="w-4 h-4 text-primary" />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => navigate({ to: "/matches" })}
          >
            <Users className="w-4 h-4 text-accent" />
            View Matches
          </Button>
          <Button
            data-ocid="admin.delete_profile_button"
            variant="outline"
            className="justify-start gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
            Delete Profile
          </Button>
        </div>
      </div>

      {/* Delete Profile Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently reset all your profile data including your
              posting locations and transfer preferences. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.delete_profile_cancel_button"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.delete_profile_confirm_button"
              onClick={handleDeleteProfile}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete Profile"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Profile Summary */}
      {!isLoading && profile && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-card">
          <h2 className="font-semibold text-foreground">Profile Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              { label: "Designation", value: profile.designation },
              { label: "Department", value: profile.department },
              { label: "Railway Zone", value: profile.railwayZone },
              { label: "Division", value: profile.division },
              {
                label: "Current Posting",
                value: profile.currentPostingLocation,
              },
              {
                label: "Desired Posting",
                value: profile.desiredPostingLocation,
              },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-0.5">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium text-foreground">
                  {value || (
                    <span className="text-muted-foreground italic">
                      Not set
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posting Swap Banner */}
      {!isLoading && currentPosting && desiredPosting && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 flex items-center gap-4">
          <MapPin className="w-8 h-8 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Transfer Request Active
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="font-medium text-foreground">
                {currentPosting}
              </span>
              {" → "}
              <span className="font-medium text-primary">{desiredPosting}</span>
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => navigate({ to: "/matches" })}
            className="flex-shrink-0"
          >
            Find Matches
          </Button>
        </div>
      )}
    </div>
  );
}
