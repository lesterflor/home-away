import React from 'react';
import { LuUserRound } from 'react-icons/lu';
import { fetchProfileImage } from '@/utils/actions';

export default async function UserIcon() {
	const profileImage = await fetchProfileImage();

	if (profileImage) {
		return (
			<img
				src={profileImage}
				alt=''
				className='w-6 rounded-full h-6 object-cover'
			/>
		);
	}

	return <LuUserRound className='w-6 h-6 bg-primary rounded-full text-white' />;
}
