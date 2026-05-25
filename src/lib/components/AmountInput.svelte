<script lang="ts">
	import { goodColor, badColor } from '$lib/categories';
	import { formatMoney } from '$lib/budget';

	type Props = {
		amount: string;
		sign: '+' | '-';
		onEnter: () => void;
	};

	const { amount, sign, onEnter }: Props = $props();
	const color = $derived(amount === '' ? 'white' : sign === '-' ? badColor : goodColor);
	const signChar = $derived(sign === '+' ? '+' : '−');
	const display = $derived(amount === '' ? '0' : formatMoney(Number.parseInt(amount, 10)));
</script>

<button class="amount-input" style:color onclick={onEnter}>
	{amount === '' ? '' : signChar}${display}
</button>

<style>
	.amount-input {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font-family: inherit;
		font-weight: inherit;
		font-size: clamp(2rem, 22cqi, 5rem);
		text-align: right;
		cursor: pointer;
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
		width: 100%;
		min-width: 0;
		container-type: inline-size;
		overflow: hidden;
	}
</style>
