import { MembershipModel } from "../model/MembershipModel";
import { MembershipRemoteDataSource } from "../datasource/MembershipDataSource";

export class MembershipRepositoryImpl {
  private remoteDataSource = new MembershipRemoteDataSource();

  async getMembership(): Promise<MembershipModel> {
    const membershipModel = await this.remoteDataSource.fetchMembership();
    return {
      id: membershipModel.id,
      status: membershipModel.status,
      type: membershipModel.type,
      price: membershipModel.price,
      expirationDate: membershipModel.expirationDate,
    };
  }
}
