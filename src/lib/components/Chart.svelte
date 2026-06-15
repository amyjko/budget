<script lang="ts">
	import type { History } from '$lib/types';
	import { categoryColors } from '$lib/categories';
	import { formatMoney, formatMonthDay, maxSpendingBar, nonIncomeEntries } from '$lib/budget';

	type Props = {
		history: History;
		today: Date;
		payDate: number;
		onTap: () => void;
	};

	const { history, today, payDate, onTap }: Props = $props();

	const entries = $derived(nonIncomeEntries(history));
	const max = $derived(maxSpendingBar(history));
	const widthPct = $derived(entries.length > 0 ? Math.min(10, 90 / entries.length) : 10);
	const dateLabels = $derived(
		entries.map((entry, i) =>
			i === 0 || entry.day !== entries[i - 1].day ? formatMonthDay(entry.day, today, payDate) : ''
		)
	);
</script>

<button class="chart" onclick={onTap} aria-label="Show entry actions">
	{#if entries.length === 0}
		<span class="empty">no purchases</span>
	{:else}
		{#each entries as entry, i (i)}
			<div class="bar-col" style:width="calc({widthPct}% - 2px)">
				<div class="bar-area">
					<div
						class="bar"
						style:background-color={categoryColors[entry.category]}
						style:height="{max > 0 ? (100 * Math.abs(entry.amount)) / max : 0}%"
					>
						<span class="bar-label">${formatMoney(Math.abs(entry.amount))}</span>
					</div>
				</div>
				<span class="date-label">{dateLabels[i]}</span>
			</div>
		{/each}
	{/if}
</button>

<style>
	.chart {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: flex-end;
		gap: 2px;
		cursor: pointer;
		font-family: inherit;
		color: inherit;
		overflow: visible;
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
	}

	.bar-col {
		height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
		min-width: 2px;
		overflow: visible;
		container-type: inline-size;
	}

	.bar-area {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		overflow: visible;
	}

	.date-label {
		height: 3rem;
		align-self: center;
		margin-top: 4px;
		writing-mode: vertical-rl;
		text-orientation: mixed;
		font-size: max(9px, 30cqw);
		line-height: 1;
		color: white;
		white-space: nowrap;
		overflow: visible;
	}

	.bar {
		width: 100%;
		border-radius: 25px;
		min-height: 4px;
		position: relative;
		container-type: size;
		overflow: visible;
	}

	.bar-label {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		writing-mode: vertical-rl;
		text-orientation: mixed;
		color: white;
		font-size: max(9px, 30cqw);
		line-height: 1;
		font-weight: bold;
		white-space: nowrap;
		pointer-events: none;
		bottom: calc(100% + var(--padding));
	}

	@container (min-height: 60px) {
		.bar-label {
			bottom: auto;
			top: var(--padding);
		}
	}

	.empty {
		font-size: clamp(1.5rem, 6vw, 2rem);
		color: white;
		margin: auto;
	}
</style>
