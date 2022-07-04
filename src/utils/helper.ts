import { IField } from "./types";

export function isRequired(field: IField): boolean {
  if (field.rules) {
    if (field.rules.length > 0) {
      return true;
    }
  }
  return false;
}
