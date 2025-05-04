import React from 'react';
import Layout from '@/components/layout/layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import SuggestionsBar from '@/components/tasks/suggestionsBar';
import PerformerTaskCard from '@/components/tasks/performerTaskCard';
import SearchBar from '@/components/tasks/taskSearchBar';
import TaskSuggestions from '@/components/tasks/taskSuggestions';

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

					<SearchBar />
					<TaskSuggestions tasks={tasks} />
					
    	    	</main>
    		</div>
    	</Layout>
	);
};

export default PerformerDashboardPage;
