import { UI_STRINGS } from "../../constants/uiStrings";

export type Login = {
  userName: string;
  password: string;
};

export enum LoginFields {
  USER_NAME = "userName",
  PASSWORD = "password",
}

export const LogInFieldsHebNames: Record<LoginFields, string> = {
  [LoginFields.USER_NAME]: UI_STRINGS.auth.userName,
  [LoginFields.PASSWORD]: UI_STRINGS.auth.password,
};

export enum SignUpFields {
  USER_NAME = "userName",
  FIRST_NAME = "firstName",
  LAST_NAME = "lastName",
  ADDRESS = "address",
  PHONE = "phone",
  EMAIL = "email",
  PASSWORD = "password",
  TZ = "tz",
}

export const SignUpFieldsHebNames: Record<SignUpFields, string> = {
  [SignUpFields.USER_NAME]: UI_STRINGS.auth.userName,
  [SignUpFields.FIRST_NAME]: UI_STRINGS.auth.firstName,
  [SignUpFields.LAST_NAME]: UI_STRINGS.auth.lastName,
  [SignUpFields.ADDRESS]: UI_STRINGS.auth.address,
  [SignUpFields.PHONE]: UI_STRINGS.auth.phone,
  [SignUpFields.EMAIL]: UI_STRINGS.auth.email,
  [SignUpFields.PASSWORD]: UI_STRINGS.auth.password,
  [SignUpFields.TZ]: UI_STRINGS.auth.tz,
};

export type Signup = {
  userName: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password: String;
  tz: string;
};
