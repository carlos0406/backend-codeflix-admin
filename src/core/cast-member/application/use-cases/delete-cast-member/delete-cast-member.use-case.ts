import { CastMemberId } from '@core/cast-member/domain/cast-member.entity';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';

export class DeleteCastMemberUseCase
  implements IUseCase<DeleteCastMemberInput, DeleteCastMemberOutput>
{
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: DeleteCastMemberInput): Promise<DeleteCastMemberOutput> {
    const uuid = new CastMemberId(input.id);
    await this.castMemberRepo.delete(uuid);
  }
}

export type DeleteCastMemberInput = {
  id: string;
};

type DeleteCastMemberOutput = void;
