import { LucideTent } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function Logo() {
	return (
		<Button
			size='icon'
			asChild>
			<Link href='/'>
				<LucideTent className='w-6 h-6' />
			</Link>
		</Button>
	);
}
