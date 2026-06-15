<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import {
    CalendarDate,
    DateFormatter,
    getLocalTimeZone,
    type DateValue,
  } from "@internationalized/date";
  import { Button } from "$components/ui/button";
  import { Calendar } from "$components/ui/calendar";
  import { Label } from "$components/ui/label";
  import * as Popover from "$components/ui/popover";
  import { cn } from "$lib/utils";

  type Props = {
    id: string;
    label: string;
    value: string;
  };

  let { id, label, value = $bindable() }: Props = $props();

  const formatter = new DateFormatter("en-US", { dateStyle: "medium" });
  let open = $state(false);
  let calendarValue = $state<DateValue | undefined>(fromIsoDate(value));

  $effect(() => {
    const nextValue = fromIsoDate(value);
    if (nextValue?.toString() !== calendarValue?.toString()) {
      calendarValue = nextValue;
    }
  });

  function selectDate(selected: DateValue | undefined) {
    calendarValue = selected;
    value = selected?.toString() ?? "";
    open = false;
  }

  function fromIsoDate(isoDate: string) {
    const [year, month, day] = isoDate.split("-").map(Number);
    if (!year || !month || !day) return undefined;
    return new CalendarDate(year, month, day);
  }
</script>

<div class="space-y-1.5">
  <Label for={id}>{label}</Label>
  <Popover.Root bind:open>
    <Popover.Trigger {id}>
      {#snippet child({ props })}
        <Button
          {...props}
          variant="outline"
          class={cn(
            "h-10 w-full cursor-pointer justify-start text-left font-normal",
            !calendarValue && "text-muted-foreground",
          )}
        >
          <CalendarIcon class="mr-2 size-4" />
          {calendarValue
            ? formatter.format(calendarValue.toDate(getLocalTimeZone()))
            : "Select date"}
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <Calendar
        bind:value={calendarValue}
        type="single"
        initialFocus
        captionLayout="dropdown"
        onValueChange={selectDate}
      />
    </Popover.Content>
  </Popover.Root>
</div>
