import { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { addClasses } from "../utils/form";
import { IPropsTag } from "../utils/types";

import Input from "../components/input";
import Select from "../components/select";
import Checkbox from "../components/checkbox";

export const FieldsTypes: any = {
  input: Input,
  select: Select,
  checkbox: Checkbox
};

const Tag: Component<IPropsTag> = ({ tag, classes, children }: IPropsTag) => {
  return (
    <Dynamic component={tag ?? "div"} classList={addClasses(classes ? classes : [])}>
      {children}
    </Dynamic>
  );
};

export default Tag;
