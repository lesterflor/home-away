import { fetchStats } from '@/utils/actions';
import StatsCard from './StatsCard';

export default async function StatsContainer() {
	const {
		usersCount = 0,
		propertiesCount = 0,
		bookingsCount = 0
	} = await fetchStats();

	return (
		<div className='mt-8 grid md:grid-cols-2 gap-4 lg:grid-cols-3'>
			<StatsCard
				title='users'
				value={usersCount}
			/>
			<StatsCard
				title='properties'
				value={propertiesCount}
			/>
			<StatsCard
				title='bookings'
				value={bookingsCount}
			/>
		</div>
	);
}
