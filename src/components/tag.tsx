import { Component, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { addClasses } from "../utils/form";
import { IPropsTag } from "../utils/types";

import InputComponent from "./input";
import SelectComponent from "./select";
import CheckboxComponent from "./checkbox";
import TextareaComponent from "./textarea";
import RadioComponent from "./radio";
import FileComponent from "./file";

export const FieldsTypes: any = {
  input: InputComponent,
  select: SelectComponent,
  checkbox: CheckboxComponent,
  textarea: TextareaComponent,
  radio: RadioComponent,
  file: FileComponent
};

const Tag: Component<IPropsTag> = ({ tag, classes, children }: IPropsTag) => {
  return (
    <Show when={tag} fallback={children}>
      <Dynamic component={tag ?? "div"} classList={addClasses(classes ? classes : [])}>
        {children}
      </Dynamic>
    </Show>
  );
};

export default Tag;
