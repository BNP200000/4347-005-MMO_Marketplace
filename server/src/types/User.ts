export type User = {
  user_id: string;
  username: string;
  email: string;
  password: string;
  account_type: string;
  has_free_chat: boolean;
  has_safe_chat: boolean;
  has_safe_server_access: boolean;
};
