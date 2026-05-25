<script lang="ts">
	type Props = {
		sign: '+' | '-';
		onDigit: (d: number) => void;
		onSign: () => void;
		onDelete: () => void;
	};

	const { sign, onDigit, onSign, onDelete }: Props = $props();

	const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<div class="keypad">
	{#each digits as d (d)}
		<button class="key" onclick={() => onDigit(d)}>
			<!-- nbsp around digits prevents iOS from auto-linking long runs as phone numbers -->
			{' '}{d}{' '}
		</button>
	{/each}
	<button class="key" onclick={onSign}>{sign === '+' ? '+' : '−'}</button>
	<button class="key" onclick={() => onDigit(0)}>{' '}0{' '}</button>
	<button class="key" onclick={onDelete}>del</button>
</div>

<style>
	.keypad {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(4, 1fr);
		width: 100%;
		height: 100%;
	}

	.key {
		background: none;
		border: none;
		color: white;
		font-family: inherit;
		font-weight: inherit;
		font-size: clamp(2.5rem, 11.25vw, 3.75rem);
		padding: 0;
		margin: 0;
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
		cursor: pointer;
	}

	.key:active {
		opacity: 0.5;
	}
</style>
