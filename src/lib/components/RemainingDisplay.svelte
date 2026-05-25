<script lang="ts">
	import { goodColor, badColor } from '$lib/categories';
	import { formatMoney, formatOrdinal } from '$lib/budget';

	type Props = {
		amountRemaining: number;
		daysRemaining: number;
		payDate: number;
		onTapPayDate: () => void;
	};

	const { amountRemaining, daysRemaining, payDate, onTapPayDate }: Props = $props();
	const color = $derived(amountRemaining < 0 ? badColor : goodColor);
</script>

<button class="remaining" style:color onclick={onTapPayDate}>
	<span class="amount">${formatMoney(amountRemaining)}</span>
	<span class="label">{daysRemaining} days until the {formatOrdinal(payDate)}</span>
</button>

<style>
	.remaining {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font-family: inherit;
		font-weight: inherit;
		text-align: right;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
		width: 100%;
		min-width: 0;
		container-type: inline-size;
	}

	.amount {
		font-size: clamp(2rem, 18cqi, 4.5rem);
		line-height: 1;
		max-width: 100%;
		overflow: hidden;
	}

	.label {
		font-size: 12px;
		font-weight: bold;
	}
</style>
