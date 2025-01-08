'use server';

import db from './db';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
//import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { profileSchema } from '@/utils/schema';

const getAuthUser = async () => {
	const user = await currentUser();

	if (!user) {
		throw new Error('You must logged in to access this route');
	}

	if (!user.privateMetadata.hasProfile) {
		redirect('/profile/create');
	}

	return user;
};

export const createProfileAction = async (
	prevState: any,
	formData: FormData
) => {
	try {
		const user = await currentUser();

		if (!user) {
			throw new Error('Please log in to create profile');
		}

		const rawData = Object.fromEntries(formData);

		const validatedFields = profileSchema.parse(rawData);

		await db.profile.create({
			data: {
				clerkId: user?.id,
				email: user.emailAddresses[0].emailAddress,
				profileImage: user.imageUrl ?? '',
				...validatedFields
			}
		});

		await clerkClient.users.updateUserMetadata(user.id, {
			privateMetadata: {
				hasProfile: true
			}
		});
	} catch (err) {
		return {
			message: err instanceof Error ? err.message : 'An error occured'
		};
	}

	redirect('/');
};

export const fetchProfileImage = async () => {
	const user = await currentUser();
	if (!user) return null;

	const profile = await db.profile.findUnique({
		where: {
			clerkId: user.id
		},
		select: {
			profileImage: true
		}
	});
	return profile?.profileImage;
};

export const fetchProfile = async () => {
	const user = await getAuthUser();
	const profile = await db.profile.findUnique({
		where: {
			clerkId: user.id
		}
	});

	if (!profile) {
		redirect('/profile/create');
	}

	return profile;
};

export const updateProfileAction = async (
	prevState: any,
	formData: FormData
): Promise<{
	message: string;
}> => {
	return {
		message: 'updated profile action'
	};
};
