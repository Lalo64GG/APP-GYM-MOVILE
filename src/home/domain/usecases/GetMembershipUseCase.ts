import { Membership } from "../model/MemberShip";
import { MembershipRepositoryImpl } from "../../data/repository/MembershipRepository";

export class GetMembershipUseCase {
  private repository = new MembershipRepositoryImpl();

  async execute(): Promise<Membership> {
    return await this.repository.getMembership();
  }
}
