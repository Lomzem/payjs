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

## Development

```sh
npm run dev
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
4. Choose start date, end date, and project code.
5. Click `Fill`.
6. Manually verify the timecard before submitting.

## Assumptions

- Weekends are skipped.
- Hours are hardcoded to `8`.
- One project code is used per run.
- Missing date rows are skipped.
- The user is already on the correct pay period.

## Troubleshooting

- Make sure the Paychex page is fully loaded.
- Make sure the active tab is on `https://myapps.paychex.com/`.
- Check the page DevTools console for `[payjs]` logs.
