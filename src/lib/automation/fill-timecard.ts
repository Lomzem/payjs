import { formatPaychexDateLabel, getWeekdayIsoDates } from "$lib/dates";
import type { FillTimecardPayload } from "$lib/messages";
import { waitForCondition, waitForElement, waitForStableDom } from "./wait";

const HOURS_PER_DAY = "8";

export async function fillTimecard(payload: FillTimecardPayload) {
  console.info("[payjs] Starting timecard fill", {
    startDate: payload.startDate,
    endDate: payload.endDate,
    projectCode: payload.projectCode,
  });

  clickButtonByText("Edit");
  await waitForStableDom();

  const dates = getWeekdayIsoDates(payload.startDate, payload.endDate);

  for (const isoDate of dates) {
    const label = formatPaychexDateLabel(isoDate);
    const filled = await fillDate(label, payload.projectCode);

    if (filled) {
      console.info("[payjs] Filled date", label);
    } else {
      console.warn("[payjs] Skipped missing date", label);
    }
  }

  console.info("[payjs] Finished timecard fill");
}

async function fillDate(dateLabel: string, projectCode: string) {
  const dateCell = await findDateCell(dateLabel);
  if (!dateCell) return false;

  const dateRow = dateCell.parentElement;
  if (!dateRow) throw new Error(`Could not find row for ${dateLabel}`);

  const hoursInput = dateRow.querySelector<HTMLInputElement>(
    ".timesheet-duration-col input",
  );
  if (!hoursInput)
    throw new Error(`Could not find hours input for ${dateLabel}`);

  setInputValue(hoursInput, HOURS_PER_DAY);
  hoursInput.dispatchEvent(new Event("blur", { bubbles: true }));

  const orgButton = dateRow.querySelector<HTMLButtonElement>(
    ".timesheet-org-header-col button",
  );
  if (!orgButton)
    throw new Error(`Could not find project selector for ${dateLabel}`);

  orgButton.click();

  const jobCostButton = await waitForElement<HTMLElement>(
    "div#jc-option-selector",
  );
  jobCostButton.click();

  const inputFieldContainer = await waitForElement<HTMLElement>(
    "div.input-field-container",
  );
  const inputField =
    inputFieldContainer.querySelector<HTMLInputElement>("input");
  if (!inputField) throw new Error("Could not find project code search input");

  setInputValue(inputField, projectCode);
  await waitForStableDom();

  const job = await waitForCondition(() =>
    Array.from(
      document.querySelectorAll<HTMLElement>("div.option-list-item"),
    ).find((element) => element.innerText.includes(projectCode)),
  ).catch(() => undefined);

  if (!job) throw new Error(`Could not find project code ${projectCode}`);

  await waitForStableDom();
  job.click();

  const saveButton = await waitForCondition(() =>
    Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(
      (element) => element.innerText.includes("Save"),
    ),
  );

  await waitForStableDom();
  saveButton.click();
  await waitForStableDom();

  return true;
}

async function findDateCell(dateLabel: string) {
  return waitForCondition(
    () =>
      Array.from(document.querySelectorAll<HTMLTableCellElement>("td")).find(
        (cell) =>
          cell.textContent?.includes(dateLabel) &&
          Array.from(cell.classList).some((name) => name.includes("wide")),
      ),
    1_000,
  ).catch(() => undefined);
}

function clickButtonByText(text: string) {
  const button = Array.from(
    document.querySelectorAll<HTMLButtonElement>("button"),
  ).find((element) => element.innerText.trim().includes(text));

  button?.click();
}

function setInputValue(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}
