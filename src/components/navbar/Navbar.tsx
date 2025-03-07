import React from 'react';
import Logo from '@/components/navbar/Logo';
import NavSearch from '@/components/navbar/NavSearch';
import DarkMode from '@/components/navbar/DarkMode';
import LinksDropdown from '@/components/navbar/LinksDropdown';

export default function Navbar() {
	return (
		<nav className='border-b'>
			<div className='container flex flex-col sm:flex-row  sm:justify-between sm:items-center flex-wrap gap-4 py-8'>
				<Logo />
				<NavSearch />
				<div className='flex gap-4 items-center '>
					<DarkMode />
					<LinksDropdown />
				</div>
			</div>
		</nav>
	);
}
