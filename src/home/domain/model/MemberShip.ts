export class Membership {
    constructor(
      public id: string,
      public status: string,
      public type: string,
      public price: number,
      public expirationDate: string
    ) {}
}