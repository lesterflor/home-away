import { fetchPropertyReviews } from '@/utils/actions';
import Title from '../properties/Title';
import ReviewCard from './ReviewCard';

export default async function PropertyReviews({
	propertyId
}: {
	propertyId: string;
}) {
	const reviews = await fetchPropertyReviews(propertyId);

	if (reviews.length < 1) {
		return null;
	}

	return (
		<div className='mt-8'>
			<Title text='Reviews' />
			<div className='grid md:grid-cols-2 gap-8 mt-4'>
				{reviews.map((rev) => {
					const { comment, rating } = rev;
					const { firstName, profileImage } = rev.profile;
					const reviewInfo = {
						comment,
						rating,
						name: firstName,
						image: profileImage
					};

					return (
						<ReviewCard
							key={rev.id}
							reviewInfo={reviewInfo}
						/>
					);
				})}
			</div>
		</div>
	);
}
