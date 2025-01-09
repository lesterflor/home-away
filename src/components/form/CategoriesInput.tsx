import { Label } from '@/components/ui/label';
import { categories } from '@/utils/categories';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

const name = 'category';

export default function CategoriesInput({
	defaultValue
}: {
	defaultValue?: string;
}) {
	return (
		<div className='mb-2'>
			<Label
				htmlFor={name}
				className='capitalize'>
				Categories
			</Label>
			<Select
				defaultValue={defaultValue || categories[0].label}
				name={name}
				required>
				<SelectTrigger id={name}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{categories.map((cat) => {
						return (
							<SelectItem
								key={cat.label}
								value={cat.label}>
								<span className='flex items-center gap-2'>
									<cat.icon /> {cat.label}
								</span>
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}
