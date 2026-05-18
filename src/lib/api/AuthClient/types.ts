import type { RegisterDto, SessionDto } from "@sito/dashboard-app";

export type PeriodCalendarRegisterDto = RegisterDto<{
  name?: string;
  username?: string;
  redirectTo?: string;
}>;

export type PeriodCalendarSignUpResult =
  | {
      status: "authenticated";
      session: SessionDto;
    }
  | {
      status: "confirmation_required";
      email: string;
    };
