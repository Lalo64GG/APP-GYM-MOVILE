export class User {
  constructor(
    public id: string,
    public name: string,
    public lastName: string,
    public email: string,
    public phone: string,
    public sex: string,
    public age: number,
    public photo: string,
    public membershipStatus: boolean,
    public entrada: string,
    public salida: string,
    public token?: string
  ) {}
}
