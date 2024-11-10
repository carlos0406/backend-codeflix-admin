import { IUseCase } from '@core/shared/application/use-case.interface';
import { UpdateCastMemberInput } from './update-cast-member.input';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.entity';
import { NotFoundError } from '@core/shared/domain/errors/not-found-erros';

export class UpdateCastMemberUseCase
  implements IUseCase<UpdateCastMemberInput, updateCastMemberOutup>
{
  constructor(private readonly castMemberepo: ICastMemberRepository) {}
  async execute(input: UpdateCastMemberInput): Promise<updateCastMemberOutup> {
    const castMemberId = new CastMemberId(input.id);
    const castMember = await this.castMemberepo.findById(castMemberId);
    if (!castMember) {
      throw new NotFoundError(input.id, CastMember);
    }
    if (input.name) {
      castMember.changeName(input.name);
    }
    if (input.type) {
      castMember.changeType(input.type);
    }
    await this.castMemberepo.update(castMember);
    return CastMemberOutputMapper.toOutput(castMember);
  }
}

export type updateCastMemberOutup = CastMemberOutput;
