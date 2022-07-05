import { Component, JSX } from "solid-js";
import { addClasses } from "../utils/form";
import { isRequired } from "../utils/helper";
import { IPropsField } from "../utils/types";

const Textarea: Component<IPropsField> = ({ form_name, field, changeValue }: IPropsField) => {
  const onInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = async (
    event: any
  ): Promise<void> => {
    const value: any = event.currentTarget.value;
    const data = {
      form_name,
      field_name: field.name,
      value
    };
    changeValue(data);
  };

  return (
    <textarea
      name={field.name}
      classList={addClasses(field.attributes.classes ? field.attributes.classes : [])}
      value={field.value}
      placeholder={field.attributes.placeholder}
      required={isRequired(field)}
      disabled={field.attributes.disabled}
      readonly={field.attributes.readonly}
      rows={field.attributes.rows}
      cols={field.attributes.cols}
      onInput={onInput}
    />
  );
};

export default Textarea;
