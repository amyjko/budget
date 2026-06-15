<script lang="ts">
	import type { History } from '$lib/types';
	import { categoryColors } from '$lib/categories';
	import { formatMoney, categoryTotals } from '$lib/budget';

	type Props = { history: History };
	const { history }: Props = $props();

	const totals = $derived(categoryTotals(history));
	const sum = $derived(totals.reduce((s, t) => s + t.total, 0));
</script>

{#if sum > 0}
	<div class="totals">
		{#each totals as { category, total } (category)}
			<div
				class="seg"
				style:width="{(100 * total) / sum}%"
				style:background-color={categoryColors[category]}
			>
				<span class="seg-label">${formatMoney(total)}</span>
			</div>
		{/each}
	</div>
{/if}

<style>
	.totals {
		display: flex;
		width: 100%;
		height: 3rem;
		gap: 2px;
		flex-shrink: 0;
	}

	.seg {
		position: relative;
		border-radius: 25px;
		min-width: 2px;
		container-type: size;
		overflow: visible;
	}

	.seg-label {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: max(9px, 30cqh);
		line-height: 1;
		font-weight: bold;
		white-space: nowrap;
		pointer-events: none;
		display: none;
	}

	@container (min-width: 40px) {
		.seg-label {
			display: block;
		}
	}
</style>
