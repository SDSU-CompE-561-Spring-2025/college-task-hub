import React from 'react';

interface RoleSelectorProps {
	role: null | 'performer' | 'poster';
	setRole: React.Dispatch<React.SetStateAction<null | 'performer' | 'poster'>>;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ role, setRole }) => {
	return (
		<div className="flex justify-center">
			<div className="flex bg-gray-100 rounded-full items-center h-10">
				<button
					onClick={() => {
						setRole('performer');
						localStorage.setItem('user_role', 'performer');
					}}
					className={`px-4 py-2 cursor-pointer rounded-full transition ${
						role === 'performer' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-300'
					}`}
				>
					Do Tasks
				</button>
				<button
					onClick={() => {
						setRole('poster');
						localStorage.setItem('user_role', 'poster');
					}}
					className={`px-4 py-2 cursor-pointer rounded-full transition ${
						role === 'poster' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-300'
					}`}
				>
					Post Tasks
				</button>
			</div>
		</div>
	);
};

export default RoleSelector;
