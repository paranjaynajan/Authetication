export interface I_userUpdate {
  id:string,
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
