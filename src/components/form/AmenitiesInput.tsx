'use client';
import { useState } from 'react';
import { amenities, Amenity } from '@/utils/amenities';
import { Checkbox } from '@/components/ui/checkbox';

export default function AmenitiesInput({
	defaultValue
}: {
	defaultValue?: Amenity[];
}) {
	const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>(
		defaultValue || amenities
	);

	const handleChange = (amenity: Amenity) => {
		setSelectedAmenities((prev) => {
			return prev.map((a) => {
				if (a.name === amenity.name) {
					return { ...a, selected: !a.selected };
				}
				return a;
			});
		});
	};

	return (
		<section>
			<input
				type='hidden'
				name='amenities'
				value={JSON.stringify(selectedAmenities)}
			/>
			<div className='grid grid-cols-2 gap-4'>
				{selectedAmenities.map((a) => {
					return (
						<div
							key={a.name}
							className='flex items-center space-x-2'>
							<Checkbox
								id={a.name}
								checked={a.selected}
								onCheckedChange={() => handleChange(a)}
							/>
							<label
								htmlFor={a.name}
								className='text-sm font-medium leading-none capitalize flex
                                gap-x-2 items-center'>
								{a.name}
								<a.icon className='w-4 h-4' />
							</label>
						</div>
					);
				})}
			</div>
		</section>
	);
}
