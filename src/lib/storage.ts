export type TimecardSettings = {
  startDate: string;
  endDate: string;
  projectCode: string;
};

const defaults: TimecardSettings = {
  startDate: "",
  endDate: "",
  projectCode: "",
};

export async function getTimecardSettings(): Promise<TimecardSettings> {
  const stored = await browser.storage.local.get(defaults);

  return {
    startDate: String(stored.startDate ?? ""),
    endDate: String(stored.endDate ?? ""),
    projectCode: String(stored.projectCode ?? ""),
  };
}

export async function setTimecardSettings(settings: TimecardSettings) {
  await browser.storage.local.set(settings);
}
