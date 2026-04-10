export type SignInFormType = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type SignUpFormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordFormType = {
  email: string;
};
