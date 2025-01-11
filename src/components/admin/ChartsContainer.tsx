import { fetchChartsData } from '@/utils/actions';
import React from 'react';
import Chart from './Chart';

export default async function ChartsContainer() {
	const bookings = await fetchChartsData();

	if (!bookings.length) {
		return null;
	}

	return <Chart data={bookings} />;
}
