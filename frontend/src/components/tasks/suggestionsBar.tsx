import React from 'react';

interface SuggestionsBarProps {
	categories: string[];
	onCategorySelect: (category: string | null) => void;
}

const SuggestionsBar: React.FC<SuggestionsBarProps> = ({ categories, onCategorySelect }) => {
	return (
		<nav className="space-y-2">
			{categories.map((cat) => (
				<div
					key={cat}
					onClick={() => onCategorySelect(cat)}
					className="text-sm text-gray-700 hover:text-sky-600 hover:bg-gray-50 px-3 py-2 rounded-md cursor-pointer transition-colors"
				>
					{cat}
				</div>
			))}
		</nav>
	);
};

export default SuggestionsBar;
