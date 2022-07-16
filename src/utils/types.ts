import { JSX } from "solid-js";

export interface IFormProps {
  form_name: string;
  fields: IField[];
  btnSubmit?: IBtnSubmit;
  btnReset?: IBtnReset;
  onSubmit: Function;
  inputSubmit?: ISubmit;
  real?: boolean;
}

export interface IForm extends IFormProps {
  values: any;
  valid: boolean;
}

const _number: number = 0;

export type RulesList =
  | "required"
  | `min:${typeof _number}`
  | `max:${typeof _number}`
  | "email"
  | "between"
  | "file"
  | "equal"
  | "url"
  | { name: string; fnc: () => Promise<boolean> };

export interface IField {
  type: "input" | "date" | "textarea" | "select" | "checkbox" | "radio" | "file";
  name: string;
  value?: any;
  attributes: Attributes;
  description?: Description;
  prefix?: IPrefix;
  rules?: RulesList[];
  messages?: any;
  extra?: any;
  preprocess?: Function; // for now
  validation?: any;
  file?: any;
}

export interface IPropsField {
  form_name: string;
  field: IField;
  changeValue: Function;
}

export interface Attributes {
  id: string;
  type?: "text" | "password" | "email" | "number" | "tel" | "range";
  label?: string;
  classes?: string[];
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  min?: number;
  max?: number;
  step?: number;
  autocomplete?: string;
  rows?: number;
  cols?: number;
}

export interface Description {
  tag: string;
  classes?: string[];
  text: string;
}

export interface IPrefix {
  tag: string;
  classes?: string[];
}

export interface IPropsTag {
  tag: string;
  classes?: string[] | null;
  children: JSX.Element;
}

export interface IValue {
  form_name: string;
  values: any;
}

export interface ISubmit {
  type: string;
  text: string;
  classes: string[];
}

export interface IBtnSubmit {
  text?: string;
  classes?: string[];
}

export interface IBtnReset {
  text?: string;
  classes?: string[];
}
