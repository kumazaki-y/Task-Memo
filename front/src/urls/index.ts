const DEFAULT_API_BASE_URL =
  process.env.PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
//   vercelの環境変数を参照し、指定がない場合はデフォルトのURLを使用

export const GUEST_SIGN_IN = `${DEFAULT_API_BASE_URL}/auth/guest_sign_in`;
export const USER_LOGIN = `${DEFAULT_API_BASE_URL}/auth/sign_in`;
export const USER_REGISTER = `${DEFAULT_API_BASE_URL}/auth`;
export const USER_LOGOUT = `${DEFAULT_API_BASE_URL}/auth/sign_out`;
export const USER_SESSIONS = `${DEFAULT_API_BASE_URL}/auth/sessions`;
export const PASSWORD_RESET_REQUEST_URL = `${DEFAULT_API_BASE_URL}/auth/password`;
export const BOARDS_API = `${DEFAULT_API_BASE_URL}/boards`;
