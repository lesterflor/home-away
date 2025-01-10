'use server';

import db from './db';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
//import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
	createReviewSchema,
	imageSchema,
	profileSchema,
	propertySchema,
	validateWithZodSchema
} from '@/utils/schema';
import { revalidatePath } from 'next/cache';
import { uploadImage } from './supabase';

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
	const user = await getAuthUser();
	try {
		const image = formData.get('image') as File;

		const validatedFields = validateWithZodSchema(imageSchema, { image });

		const fullPath = await uploadImage(validatedFields.image);

		await db.profile.update({
			where: {
				clerkId: user.id
			},
			data: {
				profileImage: fullPath
			}
		});

		revalidatePath('/profile');

		return { message: 'Profile image updated successfully' };
	} catch (error) {
		return renderError(error);
	}
};

export const createPropertyAction = async (
	prevState: any,
	formData: FormData
): Promise<{ message: string }> => {
	const user = await getAuthUser();
	try {
		const rawData = Object.fromEntries(formData);
		const file = formData.get('image') as File;

		const validatedFields = validateWithZodSchema(propertySchema, rawData);

		const validatedFile = validateWithZodSchema(imageSchema, { image: file });

		const fullPath = await uploadImage(validatedFile.image);

		await db.property.create({
			data: {
				...validatedFields,
				image: fullPath,
				profileId: user.id
			}
		});
	} catch (error) {
		return renderError(error);
	}
	redirect('/');
};

export const fetchProperties = async ({
	search = '',
	category
}: {
	search?: string;
	category?: string;
}) => {
	const properties = await db.property.findMany({
		where: {
			category,
			OR: [
				{ name: { contains: search, mode: 'insensitive' } },
				{ tagline: { contains: search, mode: 'insensitive' } }
			]
		},
		select: {
			id: true,
			name: true,
			tagline: true,
			country: true,
			image: true,
			price: true
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return properties;
};

export const fetchFavoriteId = async ({
	propertyId
}: {
	propertyId: string;
}) => {
	const user = await getAuthUser();

	const favorite = await db.favorite.findFirst({
		where: {
			propertyId,
			profileId: user.id
		},
		select: {
			id: true
		}
	});

	return favorite?.id || null;
};

export const toggleFavoriteAction = async (prevState: {
	propertyId: string;
	favoriteId: string | null;
	pathname: string;
}) => {
	const user = await getAuthUser();

	const { propertyId, favoriteId, pathname } = prevState;

	try {
		if (favoriteId) {
			await db.favorite.delete({
				where: {
					id: favoriteId
				}
			});
		} else {
			await db.favorite.create({
				data: {
					propertyId,
					profileId: user.id
				}
			});
		}

		revalidatePath(pathname);

		return {
			message: favoriteId ? 'Removed from favorites' : 'Added to favorites'
		};
	} catch (error: unknown) {
		renderError(error);
	}

	return { message: 'toggle favorite' };
};

export const fetchFavorites = async () => {
	const user = await getAuthUser();

	const favorites = await db.favorite.findMany({
		where: {
			profileId: user.id
		},
		select: {
			property: {
				select: {
					id: true,
					name: true,
					tagline: true,
					country: true,
					image: true,
					price: true
				}
			}
		}
	});

	return favorites.map((item) => {
		return item.property;
	});
};

export const fetchPropertyDetails = async (id: string) => {
	return await db.property.findUnique({
		where: {
			id
		},
		include: {
			profile: true
		}
	});
};

export const createReviewAction = async (
	prevState: any,
	formData: FormData
) => {
	const user = await getAuthUser();

	console.log('formData', formData);

	try {
		const rawData = Object.fromEntries(formData);

		const validatedFields = validateWithZodSchema(createReviewSchema, rawData);

		console.log('rawData', rawData);

		await db.review.create({
			data: {
				profileId: user.id,
				...validatedFields
			}
		});

		revalidatePath(`/properties/${validatedFields.propertyId}`);

		return { message: 'Review Submitted Successfully' };
	} catch (error: unknown) {
		return renderError(error);
	}
};

export const fetchPropertyReviews = async (propertyId: string) => {
	const reviews = await db.review.findMany({
		where: {
			propertyId
		},
		select: {
			id: true,
			rating: true,
			comment: true,
			profile: {
				select: {
					firstName: true,
					profileImage: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return reviews;
};

export const fetchPropertyReviewsByUser = async () => {
	const user = await getAuthUser();

	const reviews = await db.review.findMany({
		where: {
			profileId: user.id
		},
		select: {
			id: true,
			rating: true,
			comment: true,
			property: {
				select: {
					name: true,
					image: true
				}
			}
		}
	});

	return reviews;
};

export const deleteReviewAction = async (prevState: { reviewId: string }) => {
	const { reviewId } = prevState;
	const user = await getAuthUser();

	try {
		await db.review.delete({
			where: {
				profileId: user.id,
				id: reviewId
			}
		});

		revalidatePath('/reviews');
		return { message: 'Review Deleted Successfully' };
	} catch (err: unknown) {
		return renderError(err);
	}
};

export const findExistingReview = async (
	userId: string,
	propertyId: string
) => {
	const review = await db.review.findFirst({
		where: {
			id: userId,
			propertyId
		}
	});

	return review;
};
