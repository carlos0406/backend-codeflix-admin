import { CastMemberType } from '@core/cast-member/domain/cast-member-type-enum';
import { IsEnum, IsNotEmpty, IsString, validateSync } from 'class-validator';

export type CastMemberInputConstructorProps = {
  name: string;
  type: CastMemberType;
};

export class CastMemberInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(CastMemberType)
  type: CastMemberType;

  constructor(props: CastMemberInputConstructorProps) {
    if (!props) return;
    this.name = props.name;
    this.type = props.type;
  }
}

export class ValidateCastMemberInput {
  static validate(input: CastMemberInput) {
    return validateSync(input);
  }
}
