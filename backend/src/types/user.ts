export type NewUser = {
    username: string;
    email: string;
    password: string;
  };
  
  export type User = {
    id: number;
    username: string;
    email: string;
    created_at: string;
  };

  export type UserWithPassword = User & {
    password: string;
  };