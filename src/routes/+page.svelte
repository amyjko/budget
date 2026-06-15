<script lang="ts">
	import { budget } from '$lib/state.svelte';
	import { nextCategory } from '$lib/categories';
	import type { Category } from '$lib/types';
	import AmountInput from '$lib/components/AmountInput.svelte';
	import CategoryButton from '$lib/components/CategoryButton.svelte';
	import Chart from '$lib/components/Chart.svelte';
	import CategoryTotals from '$lib/components/CategoryTotals.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import Keypad from '$lib/components/Keypad.svelte';
	import RemainingDisplay from '$lib/components/RemainingDisplay.svelte';
	import TodayDisplay from '$lib/components/TodayDisplay.svelte';

	let amount = $state('');
	let sign = $state<'+' | '-'>('-');
	let category = $state<Category>('eat');
	let confirmVisible = $state(false);
	let pendingReload = $state(false);

	$effect(() => {
		if (pendingReload && amount === '') location.reload();
	});

	$effect(() => {
		if (!('serviceWorker' in navigator)) return;

		const onControllerChange = () => (pendingReload = true);
		const checkForUpdate = async () => {
			const reg = await navigator.serviceWorker.getRegistration();
			await reg?.update();
		};
		const onVisibility = () => {
			if (!document.hidden) checkForUpdate();
		};

		if (navigator.serviceWorker.controller) {
			navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
		}
		document.addEventListener('visibilitychange', onVisibility);
		checkForUpdate();

		return () => {
			navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
			document.removeEventListener('visibilitychange', onVisibility);
		};
	});

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
			<Chart
				history={budget.history}
				today={budget.today}
				payDate={budget.payDate}
				onTap={() => (confirmVisible = true)}
			/>
			<CategoryTotals history={budget.history} />
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

	/* In an installed PWA there's no browser chrome, so dvh can resolve short of
	   the physical screen on iOS and leave a black gap below the keypad. vh is
	   stable and equals the full screen in standalone mode. */
	@media (display-mode: standalone) {
		main {
			height: 100vh;
		}
	}

	.top {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: flex-start;
		gap: var(--padding);
	}

	.chart-area {
		min-height: 60px;
		display: flex;
		flex-direction: column;
		gap: var(--padding);
	}

	.chart-area :global(.chart) {
		flex: 1;
		min-height: 0;
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

	@media (orientation: landscape) {
		main {
			grid-template-rows: auto 1fr;
			grid-template-columns: 1fr 1fr;
			grid-template-areas:
				'top entry'
				'chart keypad';
		}

		.top {
			grid-area: top;
		}

		.chart-area {
			grid-area: chart;
		}

		.entry-row {
			grid-area: entry;
		}

		.keypad {
			grid-area: keypad;
			height: auto;
		}
	}
</style>
