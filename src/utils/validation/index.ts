import { IField } from "../types";
import * as CoreRules from "./rules/index";
const _coreRules: any = CoreRules;

/**
 * Validate field by rule.
 * @param {configs field} field
 */
export function validate(_field: IField): IField {
  let { value, rules } = _field;

  let valid = true;
  let rule;
  let errors: any[] = [];
  let validation: any;

  if (rules) {
    rules.map((validator: any) => {
      // For file type.
      if (validator === "file") {
        if (value) {
          Object.keys(value).map((i) => {
            Object.keys(_field.file).map((r) => {
              valid = _coreRules[r].call(null, value[i], _field.file[r]);
              if (!valid) {
                errors = [...errors, r];
              }
            });
          });
        }
      } else {
        // For custom rule.
        if (typeof validator === "function") {
          valid = validator.call();
          rule = validator.name;
        } else {
          const args = validator.split(/:/g);
          rule = args.shift();
          valid = _coreRules[rule].call(null, value, args);
        }
        if (!valid) {
          errors = [...errors, rule];
        }
      }
    });
    validation = { errors, dirty: errors.length > 0 };
  } else {
    validation = { errors, dirty: false };
  }

  _field.validation = validation;

  return _field;
}
