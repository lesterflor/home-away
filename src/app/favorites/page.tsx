import EmptyList from '@/components/home/EmptyList';
import PropertiesList from '@/components/home/PropertiesList';
import { fetchFavorites } from '@/utils/actions';
import React from 'react';

export default async function FavoritesPage() {
	const favorites = await fetchFavorites();

	if (!favorites.length) {
		return <EmptyList />;
	}

	return <PropertiesList properties={favorites} />;
}
