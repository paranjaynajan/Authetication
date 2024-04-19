export interface I_user{
    name:string,
    password:string,
    email:string,
    phone:string,
    image?:string,
    role:string,
}
export interface I_changePassword{
    password:string
    id:string,
    token:string
}
