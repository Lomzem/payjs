<script lang="ts">
  import type { HTMLLabelAttributes } from "svelte/elements";
  import { cn } from "$lib/utils";

  let { class: className, ...rest }: HTMLLabelAttributes = $props();
</script>

<label class={cn("text-sm font-medium leading-none", className)} {...rest}>
  {@render rest.children?.()}
</label>
