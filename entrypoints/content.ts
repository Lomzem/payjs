import { fillTimecard } from "$lib/automation/fill-timecard";
import { isFillTimecardMessage, type FillTimecardResult } from "$lib/messages";

export default defineContentScript({
  matches: ["https://myapps.paychex.com/*"],
  main() {
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
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
