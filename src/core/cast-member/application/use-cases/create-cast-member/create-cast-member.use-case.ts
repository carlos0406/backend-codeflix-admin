import { IUseCase } from '@core/shared/application/use-case.interface';
import { CastMemberInput } from './create-cast-member.input';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';

export type CreateCastMemberOutput = CastMemberOutput;
export class CreateCastMemberUseCase
  implements IUseCase<CastMemberInput, CreateCastMemberOutput>
{
  constructor(private readonly castMemberRepo: ICastMemberRepository) {}
  async execute(input: CastMemberInput): Promise<CastMemberOutput> {
    const entity = CastMember.create(input);
    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    await this.castMemberRepo.insert(entity);
    return CastMemberOutputMapper.toOutput(entity);
  }
}
