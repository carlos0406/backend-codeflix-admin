import { IsEnum, MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Notification } from '../../shared/domain/validators/notification';
import { CastMember } from './cast-member.entity';
import { CastMemberType } from './cast-member-type-enum';

export class CastMemberRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  @IsEnum(CastMemberType, { groups: ['type'] })
  type: CastMemberType;
  constructor(entity: CastMember) {
    Object.assign(this, entity);
  }
}

export class CategoryValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ['name', 'type'];
    return super.validate(notification, new CastMemberRules(data), newFields);
  }
}

export class CastMemberValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
