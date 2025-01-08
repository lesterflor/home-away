import React from 'react';
import FormInput from '@/components/form/formInput';
import FormContainer from '@/components/form/FormContainer';
import SubmitButton from '@/components/form/Buttons';
import { updateProfileAction, fetchProfile } from '@/utils/actions';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
	const profile = await fetchProfile();

	if (!profile) {
		redirect('/');
	}

	return (
		<section>
			<h1 className='text-2xl font-semibold mb-8 capitalize'>User Profile</h1>
			<div className='border p-8 rounded-md'>
				{/* image input container */}
				<FormContainer action={updateProfileAction}>
					<div className='grid md:grid-cols-2 gap-4 mt-4'>
						<FormInput
							type='text'
							name='firstName'
							label='first name'
							defaultValue={profile.firstName}
						/>
						<FormInput
							type='text'
							name='lastName'
							label='last name'
							defaultValue={profile.lastName}
						/>
						<FormInput
							type='text'
							name='username'
							label='username'
							defaultValue={profile.username}
						/>
					</div>

					<SubmitButton
						text='Update Profile'
						className='mt-8'
					/>
				</FormContainer>
			</div>
		</section>
	);
}
