import * as React from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';

import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import type { Station, StationSearchResponse } from '@/types';
import { searchStation } from '@/api';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchProps {
    selectedResult?: Station;
    onSelectResult: (station: Station) => void;
}

export function AsyncQueryCombobox({ selectedResult, onSelectResult }: SearchProps) {
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSelectResult = (station: Station) => {
        onSelectResult(station);

        // OPTIONAL: reset the search query upon selection
        // setSearchQuery('');
    };

    return (
        <Command
            shouldFilter={false}
            className="h-auto rounded-lg border border-b-0 shadow-md"
        >
            <CommandInput
                value={searchQuery}
                onValueChange={setSearchQuery}
                placeholder="Search the station"
            />

            <SearchResults
                query={searchQuery}
                selectedResult={selectedResult}
                onSelectResult={handleSelectResult}
            />
        </Command>
    );
}

interface SearchResultsProps {
    query: string;
    selectedResult: SearchProps['selectedResult'];
    onSelectResult: SearchProps['onSelectResult'];
}

function SearchResults({
                           query,
                           selectedResult,
                           onSelectResult,
                       }: SearchResultsProps) {
    const [debouncedSearchQuery] = useDebounce(query, 500);

    const enabled = !!debouncedSearchQuery;

    const {
        data,
        isLoading: isLoadingOrig,
        isError,
    } = useQuery<StationSearchResponse>({
        queryKey: ['search', debouncedSearchQuery],
        queryFn: () => searchStation(debouncedSearchQuery),
        enabled,
    });

    // To get around this https://github.com/TanStack/query/issues/3584
    const isLoading = enabled && isLoadingOrig;

    if (!enabled) return null;

    return (
        <CommandList>
            {/* TODO: these should have proper loading aria */}
            {isLoading && <div className="p-4 text-sm">Searching...</div>}
            {!isError && !isLoading && !data?.stations.length && (
                <div className="p-4 text-sm">No products found</div>
            )}
            {isError && <div className="p-4 text-sm">Something went wrong</div>}

            {data?.stations.map(({ stationId, stationName }) => {
                return (
                    <CommandItem
                        key={stationId}
                        onSelect={() => onSelectResult({ stationId, stationName })}
                        value={stationName}
                    >
                        <Check
                            className={cn(
                                'mr-2 h-4 w-4',
                                selectedResult?.stationId === stationId ? 'opacity-100' : 'opacity-0'
                            )}
                        />
                        {stationName}
                    </CommandItem>
                );
            })}
        </CommandList>
    );
}
