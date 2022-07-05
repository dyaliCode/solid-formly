import { JSX } from "solid-js";

export interface IForm {
  form_name: string;
  fields: IField[];
  onSubmit: Function;
  inputSubmit?: ISubmit;
}

export interface IField {
  type: string;
  name: string;
  value?: any;
  attributes: Attributes;
  description?: Description;
  prefix?: IPrefix;
  rules?: string[];
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
  type: string;
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
