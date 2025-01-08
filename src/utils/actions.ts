'use server';

import db from './db';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
//import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { profileSchema, validateWithZodSchema } from '@/utils/schema';
import { revalidatePath } from 'next/cache';

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

const renderError = (error: unknown): { message: string } => {
	console.log(error);
	return {
		message: error instanceof Error ? error.message : 'An error occured'
	};
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

		const validatedFields = validateWithZodSchema(profileSchema, rawData);

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
		return renderError(err);
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
	const user = await getAuthUser();

	try {
		const rawData = Object.fromEntries(formData);

		const validatedFields = validateWithZodSchema(profileSchema, rawData);

		await db.profile.update({
			where: {
				clerkId: user.id
			},
			data: validatedFields
		});

		revalidatePath('/profile');

		return {
			message: 'Profile updated successfully'
		};
	} catch (err: unknown) {
		return renderError(err);
	}
};

export const updateProfileImageAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string }> => {
	return { message: 'Profile image updated successfully' };
};
