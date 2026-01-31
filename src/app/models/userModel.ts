export interface User {
  id?: string;
  name: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface authResponse{
token:string;
user:User;

}