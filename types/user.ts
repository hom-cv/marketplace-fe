export interface User {
  id: string | number;
  username: string;
  email_address: string;
  first_name: string;
  last_name: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
}
