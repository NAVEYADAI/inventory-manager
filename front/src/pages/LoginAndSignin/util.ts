export type Login = {
  userName: string;
  password: string;
};

export enum LoginFields {
  USER_NAME = "userName",
  PASSWORD = "password",
}

export const LogInFieldsHebNames: Record<LoginFields, string> = {
  [LoginFields.USER_NAME]: "שם משתמש",
  [LoginFields.PASSWORD]: "סיסמא",
};

export enum SignUpFields {
  USER_NAME = "userName",
  FIRST_NAME = "firstName",
  LAST_NAME = "lastName",
  ADDRESS = "address",
  PHONE = "phone",
  EMAIL = "email",
  PASSWORD = "password",
}

export const SignUpFieldsHebNames: Record<SignUpFields, string> = {
  [SignUpFields.USER_NAME]: "שם משתמש",
  [SignUpFields.FIRST_NAME]: "שם פרטי",
  [SignUpFields.LAST_NAME]: "שם משפחה",
  [SignUpFields.ADDRESS]: "כתובת",
  [SignUpFields.PHONE]: "טלפון",
  [SignUpFields.EMAIL]: "כתובת מייל",
  [SignUpFields.PASSWORD]: "סיסמא",
};

export type Signup = {
  userName: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password: String;
};
