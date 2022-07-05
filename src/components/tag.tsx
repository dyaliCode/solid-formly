import { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { addClasses } from "../utils/form";
import { IPropsTag } from "../utils/types";

import Input from "./input";
import Select from "./select";
import Checkbox from "./checkbox";
import Textarea from "./textarea";
import Radio from "./radio";

export const FieldsTypes: any = {
  input: Input,
  select: Select,
  checkbox: Checkbox,
  textarea: Textarea,
  radio: Radio
};

const Tag: Component<IPropsTag> = ({ tag, classes, children }: IPropsTag) => {
  return (
    <Dynamic component={tag ?? "div"} classList={addClasses(classes ? classes : [])}>
      {children}
    </Dynamic>
  );
};

export default Tag;
