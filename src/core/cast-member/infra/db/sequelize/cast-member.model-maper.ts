import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.entity';
import { CastMemberModel } from './cast-member.model';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';

export class CastMemberModelMapper {
  static toEntity(model: CastMemberModel) {
    const { cast_member_id: id, ...otherData } = model.toJSON();

    const castMember = new CastMember({
      ...otherData,
      cast_member_id: new CastMemberId(id),
    });

    castMember.validate();

    const notification = castMember.notification;

    if (notification.hasErrors()) {
      throw new EntityValidationError(notification.toJSON());
    }

    return castMember;
  }

  static toModel(entity: CastMember): CastMemberModel {
    return CastMemberModel.build({
      cast_member_id: entity.cast_member_id.id,
      name: entity.name,
      type: entity.type,
      created_at: entity.created_at,
    });
  }
}
