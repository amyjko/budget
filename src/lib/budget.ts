import type { Entry, History } from './types';

export function formatMoney(n: number): string {
	return n.toLocaleString('en-US');
}

export function formatOrdinal(n: number): string {
	const mod100 = n % 100;
	if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
	switch (n % 10) {
		case 1:
			return `${n}st`;
		case 2:
			return `${n}nd`;
		case 3:
			return `${n}rd`;
		default:
			return `${n}th`;
	}
}

export function formatDay(day: number, today: Date = new Date()): string {
	const d = today.getDate();
	if (day === d) return 'today';
	if (day === d - 1) return 'yesterday';
	return formatOrdinal(day);
}

export function daysInBillingMonth(today: Date, payDate: number): number {
	const ref = new Date(today);
	if (ref.getDate() >= payDate) {
		ref.setMonth(ref.getMonth() + 1);
	}
	return new Date(ref.getFullYear(), ref.getMonth(), 0).getDate();
}

export function daysRemaining(today: Date, payDate: number): number {
	const date = today.getDate();
	const inMonth = daysInBillingMonth(today, payDate);
	return date < payDate ? payDate - date - 1 : inMonth - date + payDate;
}

export function amountRemaining(history: History): number {
	return history.reduce((sum, e) => sum + e.amount, 0);
}

export function totalIncome(history: History): number {
	return history.filter((e) => e.category === 'inc').reduce((sum, e) => sum + e.amount, 0);
}

export function netToday(history: History, today: Date, payDate: number): number {
	const left = daysRemaining(today, payDate);
	const inMonth = daysInBillingMonth(today, payDate);
	const income = totalIncome(history);
	return Math.floor(amountRemaining(history) - (income / inMonth) * left);
}

export function perDay(history: History, today: Date, payDate: number): number {
	const left = daysRemaining(today, payDate);
	if (left <= 0) return amountRemaining(history);
	return Math.floor(amountRemaining(history) / left);
}

export function maxSpendingBar(history: History): number {
	let max = 0;
	for (const e of history) {
		if (e.category !== 'inc') max = Math.max(Math.abs(e.amount), max);
	}
	return max;
}

export function nonIncomeEntries(history: History): Entry[] {
	return history.filter((e) => e.category !== 'inc');
}
