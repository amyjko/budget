import type { Category, Entry, History } from './types';
import { categories } from './categories';

const HISTORY_KEY = 'history';
const PAYDATE_KEY = 'paydate';
const DEFAULT_PAYDATE = 25;

type LegacyTuple = [number, Category, number];

function isLegacyTuple(value: unknown): value is LegacyTuple {
	return (
		Array.isArray(value) &&
		value.length === 3 &&
		typeof value[0] === 'number' &&
		typeof value[1] === 'string' &&
		categories.includes(value[1] as Category) &&
		typeof value[2] === 'number'
	);
}

function isEntry(value: unknown): value is Entry {
	if (typeof value !== 'object' || value === null) return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.day === 'number' &&
		typeof v.category === 'string' &&
		categories.includes(v.category as Category) &&
		typeof v.amount === 'number'
	);
}

export function loadHistory(): History {
	if (typeof localStorage === 'undefined') return [];
	const raw = localStorage.getItem(HISTORY_KEY);
	if (!raw) return [];

	try {
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];

		const history: History = [];
		for (const item of parsed) {
			if (isEntry(item)) {
				history.push(item);
			} else if (isLegacyTuple(item)) {
				history.push({ day: item[0], category: item[1], amount: item[2] });
			}
		}
		return history;
	} catch {
		return [];
	}
}

export function saveHistory(history: History): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function loadPayDate(): number {
	if (typeof localStorage === 'undefined') return DEFAULT_PAYDATE;
	const raw = localStorage.getItem(PAYDATE_KEY);
	if (!raw) return DEFAULT_PAYDATE;
	const n = Number.parseInt(raw, 10);
	return Number.isFinite(n) && n >= 1 && n <= 28 ? n : DEFAULT_PAYDATE;
}

export function savePayDate(payDate: number): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(PAYDATE_KEY, payDate.toString());
}
