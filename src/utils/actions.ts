'use server';

import { profileSchema } from '@/utils/schema';

export const createProfileAction = async (
	prevState: any,
	formData: FormData
) => {
	try {
		const rawData = Object.fromEntries(formData);

		const validatedFields = profileSchema.parse(rawData);

		// const result = profileSchema.safeParse(rawData);

		// if (!result.success) {
		// 	return {
		// 		errors: result.error.flatten().fieldErrors
		// 	};
		// }

		console.log(validatedFields);
		return {
			message: 'profile created'
		};
	} catch (err) {
		console.log(err);
		return { message: 'there was an error' };
	}
};
