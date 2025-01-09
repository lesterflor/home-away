import PropertyCard from '../card/PropertyCard';
import type { PropertyCardProps } from '@/utils/types';

export default function PropertiesList({
	properties
}: {
	properties: PropertyCardProps[];
}) {
	return (
		<section>
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
