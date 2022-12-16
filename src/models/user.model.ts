export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  tickets?: number;
  connectionid?: string;
}