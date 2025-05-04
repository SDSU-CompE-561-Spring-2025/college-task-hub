'use client';

import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FilterIcon } from 'lucide-react';


export default function TaskFilters() { 
    return (
        <div className="flex items-center gap-4">
            <Select>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Radius" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="5">5 miles</SelectItem>
                    <SelectItem value="10">10 miles</SelectItem>
                    <SelectItem value="20">20 miles</SelectItem>
                    <SelectItem value="50">50 miles</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-[120px]">
                    <FilterIcon className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">Price, high to low</SelectItem>
                    <SelectItem value="2">Price, low to high</SelectItem>
                    <SelectItem value="3">Date, newest</SelectItem>
                    <SelectItem value="4">Date, oldest</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}


