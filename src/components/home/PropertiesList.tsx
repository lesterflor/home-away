import PropertyCard from '../card/PropertyCard';
import type { PropertyCardProps } from '@/utils/types';

export default function PropertiesList({
	properties
}: {
	properties: PropertyCardProps[];
}) {
	return (
		<section className='mt-4 gap-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
			{properties.map((item) => {
				return (
					<PropertyCard
						key={item.id}
						property={item}
					/>
				);
			})}
		</section>
	);
}
