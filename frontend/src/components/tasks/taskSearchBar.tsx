import React from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';
import TaskFilters from '@/components/tasks/taskFilters';

const SearchBar = () => {
    return (
        <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center border rounded-lg px-4 py-2 w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input placeholder='Try "Grocery Pickup"' className="border-none shadow-none p-0" />
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    92115
                </div>
                <TaskFilters />
            </div>
        </div>
    );
}

export default SearchBar;