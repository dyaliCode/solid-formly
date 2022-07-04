import { Component, JSX } from "solid-js";
import { addClasses } from "../utils/form";
import { isRequired } from "../utils/helper";
import { IPropsField } from "../utils/types";

const Input: Component<IPropsField> = ({
  form_name,
  field,
  changeValue,
}: IPropsField) => {
  const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = async (
    event: any
  ): Promise<void> => {
    const value: any =
      field.attributes.type === "number"
        ? parseInt(event.currentTarget.value)
        : event.currentTarget.value;
    const data = {
      form_name,
      field_name: field.name,
      value,
    };
    changeValue(data);
  };

  return (
    <input
      type={field.attributes.type}
      name={field.name}
      value={field.value ?? null}
      id={field.attributes.id ? field.attributes.id : field.name}
      classList={addClasses(
        field.attributes.classes ? field.attributes.classes : []
      )}
      placeholder={field.attributes.placeholder}
      required={isRequired(field)}
      disabled={field.attributes.disabled}
      readonly={field.attributes.readonly}
      min={field.attributes.min}
      max={field.attributes.max}
      step={field.attributes.step}
      autocomplete={field.attributes.autocomplete}
      onInput={onInput}
    />
  );
};

export default Input;
