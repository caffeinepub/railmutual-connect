import { useState, useEffect } from 'react';
import { useGetMatches, useSearchProfiles } from '../hooks/useQueries';
import MatchCard from '../components/MatchCard';
import type { Profile } from '../backend';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Filter, X, RefreshCw, Train } from 'lucide-react';

const RAILWAY_ZONES = [
  'All Zones',
  'Central Railway',
  'Eastern Railway',
  'East Central Railway',
  'East Coast Railway',
  'Northern Railway',
  'North Central Railway',
  'Northeast Frontier Railway',
  'North Eastern Railway',
  'North Western Railway',
  'Southern Railway',
  'South Central Railway',
  'South Eastern Railway',
  'South East Central Railway',
  'South Western Railway',
  'Western Railway',
  'West Central Railway',
  'Metro Railway Kolkata',
];

interface Filters {
  zone: string;
  division: string;
  location: string;
  designation: string;
}

const EMPTY_FILTERS: Filters = {
  zone: '',
  division: '',
  location: '',
  designation: '',
};

export default function MatchesPage() {
  const { data: mutualMatches, isLoading: matchesLoading, refetch } = useGetMatches();
  const searchProfiles = useSearchProfiles();

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchResults, setSearchResults] = useState<Profile[] | null>(null);
  const [activeTab, setActiveTab] = useState<'matches' | 'search'>('matches');

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    setIsFiltering(true);
    try {
      const results = await searchProfiles.mutateAsync({
        zone: filters.zone || undefined,
        division: filters.division || undefined,
        location: filters.location || undefined,
        designation: filters.designation || undefined,
      });
      setSearchResults(results);
      setActiveTab('search');
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsFiltering(false);
    }
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchResults(null);
    setActiveTab('matches');
  };

  const displayedProfiles = activeTab === 'search' && searchResults !== null
    ? searchResults
    : mutualMatches || [];

  const isLoading = matchesLoading || isFiltering;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-foreground text-2xl sm:text-3xl">
          {activeTab === 'matches' ? 'Mutual Matches' : 'Search Results'}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {activeTab === 'matches'
            ? 'Employees who want to swap postings with you'
            : `Found ${displayedProfiles.length} profile${displayedProfiles.length !== 1 ? 's' : ''} matching your filters`}
        </p>
      </div>

      {/* Filters Panel */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-primary-600" />
          <h2 className="font-semibold text-foreground text-sm">Search & Filter Profiles</h2>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
              Filters Active
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Zone Filter */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Railway Zone
            </Label>
            <Select
              value={filters.zone || 'all'}
              onValueChange={val => handleFilterChange('zone', val === 'all' ? '' : val)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="All Zones" />
              </SelectTrigger>
              <SelectContent>
                {RAILWAY_ZONES.map(zone => (
                  <SelectItem key={zone} value={zone === 'All Zones' ? 'all' : zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Division Filter */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Division
            </Label>
            <Input
              value={filters.division}
              onChange={e => handleFilterChange('division', e.target.value)}
              placeholder="e.g. Mumbai, Delhi"
              className="h-9 text-sm"
            />
          </div>

          {/* Location Filter */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Location
            </Label>
            <Input
              value={filters.location}
              onChange={e => handleFilterChange('location', e.target.value)}
              placeholder="e.g. Mumbai CST"
              className="h-9 text-sm"
            />
          </div>

          {/* Designation Filter */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Designation
            </Label>
            <Input
              value={filters.designation}
              onChange={e => handleFilterChange('designation', e.target.value)}
              placeholder="e.g. Station Master"
              className="h-9 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSearch}
            disabled={isFiltering}
            className="bg-primary-700 hover:bg-primary-800 text-white border-0 gap-2 h-9"
            size="sm"
          >
            {isFiltering ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            Search Profiles
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="gap-1.5 h-9 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'matches'
              ? 'bg-primary-700 text-white'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          Mutual Matches
          {mutualMatches && mutualMatches.length > 0 && (
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-medium ${
              activeTab === 'matches' ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {mutualMatches.length}
            </span>
          )}
        </button>
        {searchResults !== null && (
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-primary-700 text-white'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="w-4 h-4" />
            Search Results
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-medium ${
              activeTab === 'search' ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {searchResults.length}
            </span>
          </button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : displayedProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayedProfiles.map((profile, idx) => (
            <MatchCard key={profile.userId.toString() + idx} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
            <Train className="w-8 h-8 text-primary-300" />
          </div>
          <h3 className="font-display font-semibold text-foreground text-lg mb-2">
            {activeTab === 'search' ? 'No profiles found' : 'No mutual matches yet'}
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            {activeTab === 'search'
              ? 'Try adjusting your search filters to find more profiles.'
              : 'No matches found. Make sure your current and desired posting locations are filled in your profile. Check back later as more employees join!'}
          </p>
          {activeTab === 'search' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="mt-4 gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
