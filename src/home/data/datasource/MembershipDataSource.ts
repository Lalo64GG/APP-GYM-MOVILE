import { MembershipModel } from "../model/MembershipModel";

export class MembershipRemoteDataSource {
  async fetchMembership(): Promise<MembershipModel> {
    const response = await fetch("https://api.example.com/api/membership");
    return response.json();
  }
}
