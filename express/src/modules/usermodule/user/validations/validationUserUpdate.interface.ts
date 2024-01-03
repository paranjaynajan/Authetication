export interface I_userUpdate {
  id:string;
  lastname: string;
  fathername: string;
  address: {
    city: string;
    state: string;
    pin: string;
  };
  age: string;
  dob: Date;
  image: string;
}
