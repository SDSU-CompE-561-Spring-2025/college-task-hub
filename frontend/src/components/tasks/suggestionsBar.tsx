import React from 'react';

interface SuggestionsBarProps {
	categories: string[];
	onCategorySelect: (category: string | null) => void;
}

const SuggestionsBar: React.FC<SuggestionsBarProps> = ({ categories, onCategorySelect }) => {
	return (
		<aside className="w-50 p-4 mb-4 space-y-6 bg-white border-r">
			<h2 className="font-semibold text-2xl">Suggestions</h2>
			<nav className="space-y-12">
				{categories.map((cat) => (
					<div
						key={cat}
						onClick={() => onCategorySelect(cat)} // ✅ this is the missing part
						className="text-sm text-gray-700 hover:underline cursor-pointer"
					>
						{cat}
					</div>
				))}
			</nav>
		</aside>
	);
};

export default SuggestionsBar;
