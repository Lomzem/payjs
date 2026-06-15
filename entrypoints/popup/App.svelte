<script lang="ts">
  import { onMount } from "svelte";
  import DatePickerField from "$components/date-picker-field.svelte";
  import { Button } from "$components/ui/button";
  import { Input } from "$components/ui/input";
  import { Label } from "$components/ui/label";
  import { compareIsoDates, isIsoDate } from "$lib/dates";
  import {
    FILL_TIMECARD_MESSAGE,
    type FillTimecardResult,
  } from "$lib/messages";
  import { getTimecardSettings, setTimecardSettings } from "$lib/storage";

  let startDate = $state("");
  let endDate = $state("");
  let projectCode = $state("");
  let status = $state<"idle" | "filling" | "complete" | "error">("idle");
  let errorMessage = $state("");
  let isPaychexTab = $state(false);

  const validationError = $derived(
    validateForm(startDate, endDate, projectCode),
  );
  const canFill = $derived(
    isPaychexTab && !validationError && status !== "filling",
  );

  onMount(async () => {
    const settings = await getTimecardSettings();
    startDate = settings.startDate;
    endDate = settings.endDate;
    projectCode = settings.projectCode;
    isPaychexTab = await activeTabIsPaychex();
  });

  async function fill() {
    const currentError = validateForm(startDate, endDate, projectCode);
    if (currentError) {
      status = "error";
      errorMessage = currentError;
      return;
    }

    status = "filling";
    errorMessage = "";

    const settings = {
      startDate,
      endDate,
      projectCode: projectCode.trim(),
    };

    await setTimecardSettings(settings);

    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab.id) throw new Error("Open Paychex and try again.");

      const result = (await browser.tabs.sendMessage(tab.id, {
        type: FILL_TIMECARD_MESSAGE,
        payload: settings,
      })) as FillTimecardResult;

      if (!result?.ok) {
        throw new Error(result?.error || "Fill failed.");
      }

      status = "complete";
    } catch (error) {
      status = "error";
      errorMessage =
        error instanceof Error ? error.message : "Open Paychex and try again.";
    }
  }

  async function activeTabIsPaychex() {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab.url?.startsWith("https://myapps.paychex.com/") ?? false;
  }

  function validateForm(start: string, end: string, code: string) {
    if (!isIsoDate(start)) return "Choose a start date.";
    if (!isIsoDate(end)) return "Choose an end date.";
    if (compareIsoDates(end, start) < 0)
      return "End date must be after start date.";
    if (!code.trim()) return "Enter a project code.";
    return "";
  }
</script>

<main class="w-80 space-y-4 p-4">
  <div class="space-y-1">
    <h1 class="text-base font-semibold">Paychex Timecard</h1>
    <p class="text-xs text-muted-foreground">
      Fill weekdays with 8 hours for one project code.
    </p>
  </div>

  <form
    class="space-y-3"
    onsubmit={(event) => {
      event.preventDefault();
      fill();
    }}
  >
    <DatePickerField
      id="start-date"
      label="Start date"
      bind:value={startDate}
    />

    <DatePickerField id="end-date" label="End date" bind:value={endDate} />

    <div class="space-y-1.5">
      <Label for="project-code">Project code</Label>
      <Input
        id="project-code"
        bind:value={projectCode}
        placeholder="5177"
        autocomplete="off"
      />
    </div>

    {#if !isPaychexTab}
      <p class="text-sm text-destructive">Open Paychex and try again.</p>
    {:else if validationError && status !== "filling"}
      <p class="text-sm text-muted-foreground">{validationError}</p>
    {:else if status === "complete"}
      <p class="text-sm text-muted-foreground">Complete.</p>
    {:else if status === "error"}
      <p class="text-sm text-destructive">{errorMessage}</p>
    {/if}

    <Button class="w-full cursor-pointer" type="submit" disabled={!canFill}>
      {status === "filling" ? "Filling..." : "Fill"}
    </Button>
  </form>
</main>
