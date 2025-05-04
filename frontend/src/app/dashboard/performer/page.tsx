import React from 'react';
import Layout from '@/components/layout/layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select';
import { FilterIcon, MapPin, Search } from 'lucide-react';
import SuggestionsBar from '@/components/tasks/suggestionsBar';
import TaskFilters from '@/components/tasks/taskFilters';
import PerformerTaskCard from '@/components/tasks/performerTaskCard';

const categories = [
	'Caregiving',
	'Creative & DIY',
	'Education',
	'Errands',
	'Home & Garden',
	'Labor',
	'Pet Care',
	'Repairs',
	'Transport',
];

const tasks = {
	Labor: [
		{ title: 'Unload Uhaul', duration: '3hr', rate: '$20/hr', avatar: '🧑‍🦱' },
		{ title: 'Build Bunk Bed', duration: '2hr', rate: '$25/hr', avatar: '👩' },
		{ title: 'Pull Weeds', duration: '1hr', rate: '$20/hr', avatar: '👴' },
	],
	'Pet Care': [
    	{ title: 'Walk Two Dogs', duration: '1hr', rate: '$22/hr', avatar: '👦' },
    	{ title: 'Cat Sit', duration: '4hr', rate: '$15/hr', avatar: '👩🏽' },
    	{ title: 'Take Dog To The Dog Park', duration: '3hr', rate: '$20/hr', avatar: '🧑‍🦱' },
  	],
};

const PerformerDashboardPage = () => {
	return (
		<Layout>
    		<div className="flex min-h-screen mt-4">

				<SuggestionsBar categories={categories} />

    			<main className="flex-1 p-6 space-y-6">
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

    	    		<section className="mt-12">
    	    	    	<h2 className="text-2xl font-bold mb-6">Task Suggestions</h2>
    	    	    	{Object.entries(tasks).map(([category, items]) => (
    	    	    		<div key={category} className="mb-6">
    	    	    	    	<h3 className="text-lg font-semibold mb-2">{category}</h3>
    	    	    	    	<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    	    	    	      		{items.map((task, index) => (
										<PerformerTaskCard key={index} task={task}/>
    	    	    	      		))}
    	    	    	    	</div>
    	    	    		</div>
    	    	    	))}
    	    	  	</section>
    	    	</main>
    		</div>
    	</Layout>
	);
};

export default PerformerDashboardPage;
