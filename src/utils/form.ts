import { isServer } from "solid-js/web";
import { formStore, valueStore } from "./stores";
import { IField, IForm } from "./types";

const { forms }: any = formStore;
const { values }: any = valueStore;

export async function preprocessField(
  field: IField,
  fields: IField[],
  values: any
): Promise<IField> {
  const fnc = field.preprocess;
  field = await fnc?.call(null, field, fields, values);
  return field;
}

export function getForm(form_name: string, formsServer: any): IForm {
  if (isServer) {
    return formsServer ? JSON.parse(formsServer ?? "") : null;
  } else {
    const _form: IForm = forms.find((form: IForm) => form.form_name === form_name);
    return _form;
  }
}

export function getValues(form_name: string): any {
  const _form: IForm = forms.find((form: IForm) => form.form_name === form_name);
  return _form?.values;
}

export function isValid(form_name: string): any {
  const _form: IForm = forms.find((form: IForm) => form.form_name === form_name);
  return _form?.valid ? true : false;
}

export function addClasses(classes: string[]):
  | {
      [k: string]: boolean | undefined;
    }
  | undefined {
  if (!classes.length) return;
  let lst: any = {};
  classes.map((cls: string) => (lst[cls] = true));

  return lst;
}

export function dispatchValues(
  form_name: string,
  field_name: string,
  value: any,
  changeValue: Function
): void {
  const data = {
    form_name,
    field_name,
    value
  };
  changeValue(data);
}
