import React from 'react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
	return (
		<div>
			<h1>Home</h1>
			<Button
				variant='outline'
				size='lg'
				className='capitalize m-8'>
				Click Me
			</Button>
		</div>
	);
}
