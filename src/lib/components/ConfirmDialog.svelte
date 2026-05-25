<script lang="ts">
	import { goodColor, badColor } from '$lib/categories';

	type Props = {
		visible: boolean;
		onKeep: () => void;
		onUndo: () => void;
		onReset: () => void;
	};

	const { visible, onKeep, onUndo, onReset }: Props = $props();
</script>

{#if visible}
	<div class="confirm">
		<button class="button" style:color={badColor} onclick={onKeep}>keep</button>
		<button class="button" onclick={onUndo}>undo</button>
		<button class="button" style:color={goodColor} onclick={onReset}>reset</button>
	</div>
{/if}

<style>
	.confirm {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1em;
		width: 100%;
		height: 100%;
	}

	.button {
		background: none;
		border: none;
		color: white;
		font-family: inherit;
		font-weight: inherit;
		font-size: clamp(2.5rem, 11.25vw, 3.75rem);
		padding: 0;
		margin: 0;
		cursor: pointer;
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
	}

	.button:active {
		opacity: 0.5;
	}
</style>
