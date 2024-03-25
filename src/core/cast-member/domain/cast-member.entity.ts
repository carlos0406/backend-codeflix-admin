import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { ValueObject } from '../../shared/domain/value-object';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { CastMemberFakeBuilder } from './cast-member-fake.builder';
import { CastMemberValidatorFactory } from './cast-member.validator';
import { CastMemberType } from './cast-member-type-enum';

export class CastMemberId extends Uuid {}

export type CastmemberConstructorProps = {
  cast_member_id?: Uuid;
  name: string;
  type: CastMemberType;
  created_at?: Date;
};

export type CastMemberCreateCommand = {
  name: string;
  type: CastMemberType;
};

export class CastMember extends AggregateRoot {
  cast_member_id: CastMemberId;
  name: string;
  type: CastMemberType;
  created_at: Date;

  constructor(props: CastmemberConstructorProps) {
    super();
    this.cast_member_id = props.cast_member_id ?? new CastMemberId();
    this.name = props.name;
    this.type = props.type;
    this.created_at = props.created_at ?? new Date();
  }

  get entity_id(): ValueObject {
    return this.cast_member_id;
  }

  static create(props: CastMemberCreateCommand): CastMember {
    const castMember = new CastMember(props);
    castMember.validate(['name']);
    return castMember;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  changeType(type: CastMemberType): void {
    this.type = type;
    this.validate(['type']);
  }

  validate(fields?: string[]) {
    const validator = CastMemberValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return CastMemberFakeBuilder;
  }

  toJSON() {
    return {
      cast_member_id: this.cast_member_id.id,
      name: this.name,
      created_at: this.created_at,
      type: this.type,
    };
  }
}
