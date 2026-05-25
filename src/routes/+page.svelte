<script lang="ts">
	import { budget } from '$lib/state.svelte';
	import { nextCategory } from '$lib/categories';
	import type { Category } from '$lib/types';
	import AmountInput from '$lib/components/AmountInput.svelte';
	import CategoryButton from '$lib/components/CategoryButton.svelte';
	import Chart from '$lib/components/Chart.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import Keypad from '$lib/components/Keypad.svelte';
	import RemainingDisplay from '$lib/components/RemainingDisplay.svelte';
	import TodayDisplay from '$lib/components/TodayDisplay.svelte';

	let amount = $state('');
	let sign = $state<'+' | '-'>('-');
	let category = $state<Category>('eat');
	let confirmVisible = $state(false);

	function appendDigit(d: number) {
		if (amount.length >= 4) return;
		if (amount === '' && d === 0) return;
		amount = amount + d;
	}

	function deleteLastDigit() {
		if (amount.length > 0) amount = amount.slice(0, -1);
	}

	function toggleSign() {
		sign = sign === '+' ? '-' : '+';
	}

	function commit() {
		if (amount === '') return;
		const n = Number.parseInt(amount, 10);
		budget.addEntry(category, sign === '-' ? -n : n);
		amount = '';
		sign = '-';
	}
</script>

<main>
	<header class="top">
		<TodayDisplay net={budget.net} />
		<RemainingDisplay
			amountRemaining={budget.amountRemaining}
			daysRemaining={budget.daysRemaining}
			payDate={budget.payDate}
			onTapPayDate={() => budget.incrementPayDate()}
		/>
	</header>

	<section class="chart-area">
		{#if confirmVisible}
			<ConfirmDialog
				visible={confirmVisible}
				onKeep={() => (confirmVisible = false)}
				onUndo={() => {
					budget.undo();
					confirmVisible = false;
				}}
				onReset={() => {
					budget.reset();
					confirmVisible = false;
				}}
			/>
		{:else}
			<Chart history={budget.history} onTap={() => (confirmVisible = true)} />
		{/if}
	</section>

	<section class="entry-row">
		<CategoryButton {category} onCycle={() => (category = nextCategory(category))} />
		<AmountInput {amount} {sign} onEnter={commit} />
	</section>

	<section class="keypad">
		<Keypad {sign} onDigit={appendDigit} onSign={toggleSign} onDelete={deleteLastDigit} />
	</section>
</main>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		background-color: #000;
		color: white;
		font-family: -apple-system, 'Helvetica Neue', sans-serif;
		font-weight: 100;
		height: 100%;
		width: 100%;
		overscroll-behavior: none;
		-webkit-user-select: none;
		user-select: none;
	}

	:global(body) {
		min-height: 100vh;
		min-height: 100dvh;
	}

	main {
		--padding: 20px;
		display: grid;
		grid-template-rows: auto 1fr auto auto;
		height: 100vh;
		height: 100dvh;
		padding: max(env(safe-area-inset-top), var(--padding))
			max(env(safe-area-inset-right), var(--padding))
			max(env(safe-area-inset-bottom), var(--padding))
			max(env(safe-area-inset-left), var(--padding));
		box-sizing: border-box;
		gap: var(--padding);
	}

	.top {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: flex-start;
		gap: var(--padding);
	}

	.chart-area {
		min-height: 60px;
	}

	.entry-row {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: var(--padding);
	}

	.keypad {
		height: 40vh;
		min-height: 0;
	}
</style>
