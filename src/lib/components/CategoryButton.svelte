<script lang="ts">
	import type { Category } from '$lib/types';
	import { categoryColors, categoryLabels } from '$lib/categories';

	type Props = {
		category: Category;
		onCycle: () => void;
	};

	const { category, onCycle }: Props = $props();
</script>

<button class="category" style:background-color={categoryColors[category]} onclick={onCycle}>
	{categoryLabels[category]}
</button>

<style>
	.category {
		border: none;
		color: white;
		font-family: inherit;
		font-weight: inherit;
		font-size: clamp(1.875rem, 8.75vw, 3.125rem);
		padding: 0.25em 0.5em;
		border-radius: 25px;
		text-align: center;
		cursor: pointer;
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
		min-width: 33%;
	}

	.category:active {
		opacity: 0.7;
	}
</style>
