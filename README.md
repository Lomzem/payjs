# Paychex Timecard Filler

Small browser extension for filling Paychex timecard rows from a date range and project code.

## Setup

Clone the repo:

```bash
git clone https://github.com/Lomzem/payjs.git
cd payjs
```

Requires [`npm`](https://nodejs.org/en/download/) or [`bun`](https://bun.com/docs/installation) (if you're cool 😎).

```sh
npm install
```

## Build and Installation

```sh
npm run build
```

Load the generated development extension from `.output/`:

- Chrome: open `chrome://extensions`, enable Developer mode, click `Load unpacked`, and select `.output/chrome-mv3`.
- Firefox: open `about:debugging#/runtime/this-firefox`, click `Load Temporary Add-on`, and select the manifest file in `.output/firefox-mv2`.

## Usage

1. Open Paychex at `myapps.paychex.com`.
2. Go to the correct timecard pay period.
3. Open the extension popup.
4. Confirm or adjust the start date and end date, then enter the project code.
5. Click `Fill`.
6. Manually verify the timecard before submitting.

When the popup opens, it reads the currently selected Paychex pay period from the timecard page and defaults the start and end dates to that full range. The date pickers only allow dates inside that active pay period; dates before or after it are disabled and cannot be submitted.

## Assumptions

- Weekends are skipped.
- Hours are hardcoded to `8`.
- One project code is used per run.
- Missing date rows are skipped.
- The user is already on the correct Paychex pay period before opening the popup.
- The selected fill range must stay within the currently selected Paychex pay period.

## Troubleshooting

- Make sure the Paychex page is fully loaded.
- Make sure the active tab is on `https://myapps.paychex.com/`.
- Check the page DevTools console for `[payjs]` logs.
