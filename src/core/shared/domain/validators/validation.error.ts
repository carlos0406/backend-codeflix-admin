import { FieldsErrors } from './validator-fields-interface';

export class ValidationError extends Error {}

export class EntityValidationError extends Error {
  constructor(
    public error: FieldsErrors[],
    message = 'Entity Validation Error',
  ) {
    super(message);
  }

  count() {
    return Object.keys(this.error).length;
  }
}

export abstract class BaseValidationError extends Error {
  constructor(
    public error: FieldsErrors[],
    message = 'Validation Error',
  ) {
    super(message);
  }

  count() {
    return Object.keys(this.error).length;
  }
}

export class LoadEntityError extends BaseValidationError {
  constructor(public error: FieldsErrors[]) {
    super(error, 'LoadEntityError');
    this.name = 'LoadEntityError';
  }
}
