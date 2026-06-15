export const FILL_TIMECARD_MESSAGE = "FILL_TIMECARD" as const;
export const GET_PAY_PERIOD_MESSAGE = "GET_PAY_PERIOD" as const;

export type FillTimecardPayload = {
  startDate: string;
  endDate: string;
  projectCode: string;
};

export type FillTimecardMessage = {
  type: typeof FILL_TIMECARD_MESSAGE;
  payload: FillTimecardPayload;
};

export type FillTimecardResult = { ok: true } | { ok: false; error: string };

export type GetPayPeriodMessage = {
  type: typeof GET_PAY_PERIOD_MESSAGE;
};

export type GetPayPeriodResult =
  | { ok: true; startDate: string; endDate: string }
  | { ok: false; error: string };

export function isFillTimecardMessage(
  value: unknown,
): value is FillTimecardMessage {
  if (!value || typeof value !== "object") return false;

  const message = value as Partial<FillTimecardMessage>;
  const payload = message.payload as Partial<FillTimecardPayload> | undefined;

  return (
    message.type === FILL_TIMECARD_MESSAGE &&
    typeof payload?.startDate === "string" &&
    typeof payload.endDate === "string" &&
    typeof payload.projectCode === "string"
  );
}

export function isGetPayPeriodMessage(
  value: unknown,
): value is GetPayPeriodMessage {
  return (
    !!value &&
    typeof value === "object" &&
    (value as Partial<GetPayPeriodMessage>).type === GET_PAY_PERIOD_MESSAGE
  );
}
