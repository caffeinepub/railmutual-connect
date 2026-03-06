import type { Profile } from "@/backend";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowLeftRight,
  Briefcase,
  ChevronRight,
  Download,
  Eye,
  GitCompare,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Search,
  Settings,
  Shield,
  Train,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  ADMIN_EMAIL,
  useAdminAllProfiles,
  useAdminMatches,
} from "../hooks/useAdminQueries";
import { useGetCallerUserProfile } from "../hooks/useQueries";

type AdminTab = "dashboard" | "users" | "matches" | "settings";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ns: bigint): string {
  try {
    const ms = Number(ns / 1_000_000n);
    if (!ms || ms < 0) return "—";
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function exportToCsv(profiles: Profile[], filename = "railmutual-users.csv") {
  const headers = [
    "Full Name",
    "Email",
    "Designation",
    "Department",
    "Railway Zone",
    "Division",
    "Current Posting",
    "Desired Posting",
    "Contact Visible",
    "Registered",
  ];

  const rows = profiles.map((p) => [
    p.fullName,
    p.email ?? "",
    p.designation,
    p.department,
    p.railwayZone,
    p.division,
    p.currentPostingLocation,
    p.desiredPostingLocation,
    p.contactVisible ? "Yes" : "No",
    formatDate(p.createdAt),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function clientFilter(profiles: Profile[], query: string): Profile[] {
  if (!query.trim()) return profiles;
  const q = query.toLowerCase().trim();
  return profiles.filter(
    (p) =>
      p.fullName.toLowerCase().includes(q) ||
      (p.email ?? "").toLowerCase().includes(q) ||
      p.designation.toLowerCase().includes(q) ||
      p.currentPostingLocation.toLowerCase().includes(q) ||
      p.desiredPostingLocation.toLowerCase().includes(q) ||
      p.railwayZone.toLowerCase().includes(q) ||
      p.division.toLowerCase().includes(q),
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: "blue" | "orange" | "green" | "gray";
  "data-ocid"?: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent = "blue",
  "data-ocid": ocid,
}: StatCardProps) {
  const accentClasses = {
    blue: "bg-primary/10 text-primary",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-emerald-100 text-emerald-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <Card data-ocid={ocid} className="border-border shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${accentClasses[accent]}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── User Detail Modal ────────────────────────────────────────────────────────

interface UserDetailModalProps {
  profile: Profile | null;
  onClose: () => void;
}

function UserDetailModal({ profile, onClose }: UserDetailModalProps) {
  if (!profile) return null;

  const fields = [
    {
      label: "Full Name",
      value: profile.fullName,
      icon: <UserCheck className="w-3.5 h-3.5" />,
    },
    {
      label: "Email",
      value: profile.email ?? "—",
      icon: <Mail className="w-3.5 h-3.5" />,
    },
    {
      label: "Department",
      value: profile.department,
      icon: <Briefcase className="w-3.5 h-3.5" />,
    },
    {
      label: "Designation",
      value: profile.designation,
      icon: <Briefcase className="w-3.5 h-3.5" />,
    },
    {
      label: "Railway Zone",
      value: profile.railwayZone,
      icon: <Train className="w-3.5 h-3.5" />,
    },
    {
      label: "Division",
      value: profile.division,
      icon: <MapPin className="w-3.5 h-3.5" />,
    },
    {
      label: "Current Posting",
      value: profile.currentPostingLocation,
      icon: <MapPin className="w-3.5 h-3.5 text-destructive" />,
    },
    {
      label: "Desired Posting",
      value: profile.desiredPostingLocation,
      icon: <MapPin className="w-3.5 h-3.5 text-primary" />,
    },
    {
      label: "Registered On",
      value: formatDate(profile.createdAt),
      icon: <Activity className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <Dialog open={!!profile} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            User Profile Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {/* Avatar row */}
          <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {profile.fullName?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {profile.fullName}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile.designation}
              </p>
            </div>
            <Badge
              variant={profile.contactVisible ? "default" : "secondary"}
              className="ml-auto text-xs"
            >
              {profile.contactVisible ? "Contact Visible" : "Private"}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map(({ label, value, icon }) => (
              <div key={label} className="space-y-0.5">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {icon}
                  {label}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {value || (
                    <span className="text-muted-foreground italic text-xs">
                      Not set
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Transfer arrow */}
          {profile.currentPostingLocation && profile.desiredPostingLocation && (
            <>
              <Separator />
              <div className="flex items-center justify-center gap-3 py-2 bg-primary/5 rounded-lg px-4">
                <span className="text-sm font-medium text-foreground">
                  {profile.currentPostingLocation}
                </span>
                <ArrowLeftRight className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-primary">
                  {profile.desiredPostingLocation}
                </span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Dashboard Section ────────────────────────────────────────────────────────

interface DashboardSectionProps {
  profiles: Profile[];
  matches: Profile[];
  profilesLoading: boolean;
  matchesLoading: boolean;
}

function DashboardSection({
  profiles,
  matches,
  profilesLoading,
  matchesLoading,
}: DashboardSectionProps) {
  const isLoading = profilesLoading || matchesLoading;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Platform Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Key metrics for RailMutual Connect
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          (["s1", "s2", "s3", "s4"] as const).map((k) => (
            <Card key={k} className="border-border">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              data-ocid="admin.stats.users_card"
              title="Total Users"
              value={profiles.length}
              subtitle="Registered profiles"
              icon={<Users className="w-5 h-5" />}
              accent="blue"
            />
            <StatCard
              data-ocid="admin.stats.matches_card"
              title="Your Matches"
              value={matches.length}
              subtitle="Based on your profile"
              icon={<ArrowLeftRight className="w-5 h-5" />}
              accent="orange"
            />
            <StatCard
              title="New Today"
              value="—"
              subtitle="Not tracked yet"
              icon={<TrendingUp className="w-5 h-5" />}
              accent="green"
            />
            <StatCard
              title="Platform Status"
              value="Active"
              subtitle="All systems operational"
              icon={<Activity className="w-5 h-5" />}
              accent="gray"
            />
          </>
        )}
      </div>

      {/* Quick profile breakdown */}
      {!profilesLoading && profiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Top Zones</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const zoneCounts: Record<string, number> = {};
                for (const p of profiles) {
                  if (p.railwayZone) {
                    zoneCounts[p.railwayZone] =
                      (zoneCounts[p.railwayZone] ?? 0) + 1;
                  }
                }
                const sorted = Object.entries(zoneCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5);
                if (sorted.length === 0) {
                  return (
                    <p className="text-sm text-muted-foreground italic">
                      No zone data available
                    </p>
                  );
                }
                return (
                  <div className="space-y-2">
                    {sorted.map(([zone, count]) => (
                      <div
                        key={zone}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-foreground">
                          {zone || "Unknown"}
                        </span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Top Designations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const desCounts: Record<string, number> = {};
                for (const p of profiles) {
                  if (p.designation) {
                    desCounts[p.designation] =
                      (desCounts[p.designation] ?? 0) + 1;
                  }
                }
                const sorted = Object.entries(desCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5);
                if (sorted.length === 0) {
                  return (
                    <p className="text-sm text-muted-foreground italic">
                      No designation data available
                    </p>
                  );
                }
                return (
                  <div className="space-y-2">
                    {sorted.map(([des, count]) => (
                      <div
                        key={des}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-foreground truncate max-w-[200px]">
                          {des || "Unknown"}
                        </span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Users Section ────────────────────────────────────────────────────────────

interface UsersSectionProps {
  profiles: Profile[];
  isLoading: boolean;
}

function UsersSection({ profiles, isLoading }: UsersSectionProps) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  const filtered = useMemo(
    () => clientFilter(profiles, search),
    [profiles, search],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            User Management
          </h2>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading users…"
              : `${filtered.length} of ${profiles.length} users`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            data-ocid="admin.export_csv_button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => exportToCsv(filtered)}
            disabled={isLoading || filtered.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="admin.user_search_input"
          type="search"
          placeholder="Search by name, email, location, zone, designation…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {(["u1", "u2", "u3", "u4", "u5"] as const).map((k) => (
            <Skeleton key={k} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="admin.users_empty_state"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <Users className="w-12 h-12 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-foreground">No users found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {search
              ? "Try a different search term."
              : "No profiles in the system yet."}
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold text-foreground">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden md:table-cell">
                    Designation
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden lg:table-cell">
                    Zone
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden lg:table-cell">
                    Division
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Current
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden sm:table-cell">
                    Desired
                  </TableHead>
                  <TableHead className="font-semibold text-foreground hidden xl:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="text-right font-semibold text-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((profile, index) => (
                  <TableRow
                    key={profile.userId.toString()}
                    data-ocid={`admin.user.row.${index + 1}`}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                          {profile.fullName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="font-medium text-foreground text-sm truncate max-w-[120px]">
                          {profile.fullName || "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {profile.designation || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {profile.railwayZone || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {profile.division || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {profile.currentPostingLocation || "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-primary">
                      {profile.desiredPostingLocation || "—"}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                      {profile.email || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        data-ocid={`admin.user.view_button.${index + 1}`}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedUser(profile)}
                        title="View profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* User detail modal */}
      <UserDetailModal
        profile={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}

// ─── Matches Section ─────────────────────────────────────────────────────────

interface MatchesSectionProps {
  matches: Profile[];
  isLoading: boolean;
  adminProfile: Profile | null;
}

function MatchesSection({
  matches,
  isLoading,
  adminProfile,
}: MatchesSectionProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Mutual Matches Monitor
        </h2>
        <p className="text-sm text-muted-foreground">
          Matches based on admin profile postings
        </p>
      </div>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-xs">
          Showing matches based on admin profile. Full platform-wide match
          monitoring requires extended backend support.
        </AlertDescription>
      </Alert>

      {adminProfile && (
        <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="font-medium text-foreground">
            {adminProfile.currentPostingLocation || "—"}
          </span>
          <ArrowLeftRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="font-medium text-primary">
            {adminProfile.desiredPostingLocation || "—"}
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["m1", "m2", "m3", "m4"] as const).map((k) => (
            <Skeleton key={k} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div
          data-ocid="admin.matches_empty_state"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <GitCompare className="w-12 h-12 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-foreground">
            No matches found
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Complete admin profile with current and desired postings to see
            matches.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match, index) => (
            <Card
              key={match.userId.toString()}
              data-ocid={`admin.match.card.${index + 1}`}
              className="border-border hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {match.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">
                      {match.fullName || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {match.designation}
                      {match.railwayZone ? ` · ${match.railwayZone}` : ""}
                    </p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="text-center flex-1">
                    <p className="text-muted-foreground mb-0.5">From</p>
                    <p className="font-medium text-foreground truncate">
                      {match.currentPostingLocation || "—"}
                    </p>
                  </div>
                  <ArrowLeftRight className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <div className="text-center flex-1">
                    <p className="text-muted-foreground mb-0.5">To</p>
                    <p className="font-medium text-primary truncate">
                      {match.desiredPostingLocation || "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Settings Section ─────────────────────────────────────────────────────────

interface SettingsSectionProps {
  adminProfile: Profile | null;
}

function SettingsSection({ adminProfile }: SettingsSectionProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Admin Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Platform configuration and admin account info
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Admin Account
          </CardTitle>
          <CardDescription>Your administrative account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">
              {adminProfile?.email ?? ADMIN_EMAIL}
            </span>
            <Badge className="ml-auto text-xs">Admin</Badge>
          </div>
          {adminProfile?.fullName && (
            <div className="flex items-center gap-2 text-sm">
              <UserCheck className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{adminProfile.fullName}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Platform Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Platform Name</span>
            <span className="font-medium text-foreground">
              RailMutual Connect
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Purpose</span>
            <span className="font-medium text-foreground">
              Mutual Transfer Matching
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Target Users</span>
            <span className="font-medium text-foreground">
              Indian Railways Employees
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Authentication</span>
            <span className="font-medium text-foreground">
              Internet Identity
            </span>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-xs">
          This platform facilitates connections only. Official mutual transfers
          are governed by Indian Railways rules and policies.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// ─── Admin Page (main) ────────────────────────────────────────────────────────

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const navigate = useNavigate();

  const { data: allProfiles = [], isLoading: profilesLoading } =
    useAdminAllProfiles();
  const { data: adminMatches = [], isLoading: matchesLoading } =
    useAdminMatches();

  // Access is already guaranteed by AdminLayout in App.tsx (hasAdminSession check)
  // We still try to load the current profile for display purposes, but don't block on it
  const { data: currentProfile } = useGetCallerUserProfile();

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    navigate({ to: "/admin-login" });
  };

  const navItems: Array<{
    tab: AdminTab;
    label: string;
    icon: React.ReactNode;
    ocid: string;
  }> = [
    {
      tab: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      ocid: "admin.dashboard_tab",
    },
    {
      tab: "users",
      label: "Users",
      icon: <Users className="w-4 h-4" />,
      ocid: "admin.users_tab",
    },
    {
      tab: "matches",
      label: "Matches",
      icon: <ArrowLeftRight className="w-4 h-4" />,
      ocid: "admin.matches_tab",
    },
    {
      tab: "settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
      ocid: "admin.settings_tab",
    },
  ];

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-background">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-card flex-shrink-0">
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Admin Portal</p>
              <p className="text-xs text-muted-foreground">
                RailMutual Connect
              </p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-3 space-y-1">
          {navItems.map(({ tab, label, icon, ocid }) => (
            <button
              type="button"
              key={tab}
              data-ocid={ocid}
              onClick={() => handleTabChange(tab)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {icon}
              {label}
              {activeTab === tab && (
                <ChevronRight className="w-3 h-3 ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-3 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground truncate">
            {currentProfile?.email ?? ADMIN_EMAIL}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Admin
            </Badge>
            <button
              type="button"
              onClick={handleLogout}
              className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
              title="Log out of admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ tab, label, icon, ocid }) => (
            <button
              type="button"
              key={tab}
              data-ocid={ocid}
              onClick={() => handleTabChange(tab)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md transition-colors min-w-[56px] ${
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {icon}
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {/* Page header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-foreground capitalize">
                {activeTab === "dashboard"
                  ? "Platform Overview"
                  : activeTab === "users"
                    ? "User Management"
                    : activeTab === "matches"
                      ? "Matches Monitor"
                      : "Settings"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs hidden sm:flex items-center gap-1"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live
              </Badge>
              <Button
                data-ocid="admin.logout_button"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "dashboard" && (
            <DashboardSection
              profiles={allProfiles}
              matches={adminMatches}
              profilesLoading={profilesLoading}
              matchesLoading={matchesLoading}
            />
          )}
          {activeTab === "users" && (
            <UsersSection profiles={allProfiles} isLoading={profilesLoading} />
          )}
          {activeTab === "matches" && (
            <MatchesSection
              matches={adminMatches}
              isLoading={matchesLoading}
              adminProfile={currentProfile ?? null}
            />
          )}
          {activeTab === "settings" && (
            <SettingsSection adminProfile={currentProfile ?? null} />
          )}
        </div>
      </main>
    </div>
  );
}
