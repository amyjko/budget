import type { Category, History } from './types';
import {
	amountRemaining,
	daysInBillingMonth,
	daysRemaining,
	netToday,
	perDay,
	totalIncome
} from './budget';
import { loadHistory, loadPayDate, saveHistory, savePayDate } from './storage';

function createBudgetStore() {
	let history = $state<History>(loadHistory());
	let payDate = $state<number>(loadPayDate());
	let today = $state<Date>(new Date());

	$effect.root(() => {
		$effect(() => saveHistory(history));
		$effect(() => savePayDate(payDate));

		// Re-evaluate "today" once a minute so derived values stay current if the
		// app is left open across midnight.
		const interval = setInterval(() => {
			today = new Date();
		}, 60_000);
		return () => clearInterval(interval);
	});

	const remaining = $derived(amountRemaining(history));
	const left = $derived(daysRemaining(today, payDate));
	const inMonth = $derived(daysInBillingMonth(today, payDate));
	const income = $derived(totalIncome(history));
	const net = $derived(netToday(history, today, payDate));
	const perDayAmount = $derived(perDay(history, today, payDate));

	return {
		get history() {
			return history;
		},
		get payDate() {
			return payDate;
		},
		get today() {
			return today;
		},
		get amountRemaining() {
			return remaining;
		},
		get daysRemaining() {
			return left;
		},
		get daysInMonth() {
			return inMonth;
		},
		get totalIncome() {
			return income;
		},
		get net() {
			return net;
		},
		get perDay() {
			return perDayAmount;
		},
		addEntry(category: Category, amount: number) {
			history = [...history, { day: today.getDate(), category, amount }];
		},
		undo() {
			history = history.slice(0, -1);
		},
		reset() {
			history = [];
		},
		incrementPayDate() {
			payDate = payDate === 28 ? 1 : payDate + 1;
		}
	};
}

export const budget = createBudgetStore();
