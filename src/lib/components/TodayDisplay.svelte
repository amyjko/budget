<script lang="ts">
	import { goodColor, badColor } from '$lib/categories';
	import { formatMoney } from '$lib/budget';

	type Props = {
		net: number;
	};

	const { net }: Props = $props();
	const color = $derived(net < 0 ? badColor : goodColor);
</script>

<div class="today">
	<span class="amount" style:color>${formatMoney(net)}</span>
	<span class="label">today</span>
</div>

<style>
	.today {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
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
		color: white;
	}
</style>
