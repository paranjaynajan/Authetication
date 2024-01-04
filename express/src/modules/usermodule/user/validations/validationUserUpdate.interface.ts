export interface I_userUpdate {
  name: string;
  phone: string;
  lastname: string,
  fathersname: string,
  address: {
    city: string,
    state: string,
    pin: string,
  };
  age: string,
  dob: Date,
  adharnumber:string,
  // image: string;
}
export interface I_userUpdateAdhar extends Omit<I_userUpdate,'adharnumber'&'dob'&'age'>{}