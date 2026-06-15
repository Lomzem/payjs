import { fillTimecard } from "$lib/automation/fill-timecard";
import { parsePaychexPayPeriod } from "$lib/dates";
import {
  isFillTimecardMessage,
  isGetPayPeriodMessage,
  type FillTimecardResult,
  type GetPayPeriodResult,
} from "$lib/messages";

export default defineContentScript({
  matches: ["https://myapps.paychex.com/*"],
  main() {
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (isGetPayPeriodMessage(message)) {
        try {
          sendResponse({ ok: true, ...getPayPeriod() } satisfies GetPayPeriodResult);
        } catch (error) {
          sendResponse({
            ok: false,
            error:
              error instanceof Error
                ? error.message
                : "Could not read pay period.",
          } satisfies GetPayPeriodResult);
        }

        return false;
      }

      if (!isFillTimecardMessage(message)) return false;

      fillTimecard(message.payload)
        .then(() => sendResponse({ ok: true } satisfies FillTimecardResult))
        .catch((error) => {
          console.error("[payjs] Fill failed", error);
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : "Fill failed.",
          } satisfies FillTimecardResult);
        });

      return true;
    });
  },
});

function getPayPeriod() {
  const dateContainer = document.querySelector(
    '[data-payxautoid="paychex.app.time.employee.daterange.dates"]',
  );
  const spans = dateContainer?.querySelectorAll("span");
  const startLabel = spans?.[0]?.textContent?.trim();
  const endLabel = spans?.[2]?.textContent?.trim();

  if (!startLabel || !endLabel) {
    throw new Error("Could not read pay period from Paychex.");
  }

  return parsePaychexPayPeriod(startLabel, endLabel);
}
