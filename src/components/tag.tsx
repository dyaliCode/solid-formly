import { Component, lazy, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { addClasses } from "../utils/form";
import { IPropsTag } from "../utils/types";

const InputComponent = lazy(() => import("./input"));
const SelectComponent = lazy(() => import("./select"));
const CheckboxComponent = lazy(() => import("./checkbox"));
const TextareaComponent = lazy(() => import("./textarea"));
const RadioComponent = lazy(() => import("./radio"));
const FileComponent = lazy(() => import("./file"));

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
