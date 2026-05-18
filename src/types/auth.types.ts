export interface SignUpDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}
