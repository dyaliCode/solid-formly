import { IField } from "./types";

export function isRequired(field: IField): boolean {
  if (field.rules) {
    if (field.rules.length > 0) {
      return true;
    }
  }
  return false;
}

export function isFieldDuplicated(fields: IField[]): boolean {
  let seen: any = {};
  return fields.some(function (currentObject: any) {
    if (
      seen.hasOwnProperty(currentObject.name) ||
      seen.hasOwnProperty(currentObject.attributes.id)
    ) {
      // Current name or id is already seen
      return true;
    }

    // Current name and id is being seen for the first time
    return (seen[currentObject.name] = false), (seen[currentObject.attributes.id] = false);
  });
}
