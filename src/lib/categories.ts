import type { Category } from './types';

export const categoryColors: Record<Category, string> = {
	eat: '#A30000',
	groc: '#004777',
	misc: '#FF7700',
	health: '#EFD28D',
	fun: '#00AFB5',
	inc: '#000000'
};

export const categoryLabels: Record<Category, string> = {
	eat: 'eat',
	groc: 'groc',
	misc: 'misc',
	health: 'health',
	fun: 'fun',
	inc: 'inc'
};

export const categories: Category[] = Object.keys(categoryColors) as Category[];

export const goodColor = '#00AFB5';
export const badColor = '#A30000';

export function nextCategory(current: Category): Category {
	const i = categories.indexOf(current);
	return categories[(i + 1) % categories.length];
}
