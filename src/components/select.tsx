import { Component, createSignal, For, JSX, onMount, Show } from "solid-js";
import { addClasses } from "../utils/form";
import { isRequired } from "../utils/helper";
import { IPropsField } from "../utils/types";

const Input: Component<IPropsField> = ({
  form_name,
  field,
  changeValue,
}: IPropsField) => {
  const [multiple, setMultiple] = createSignal<boolean>(false);

  onMount(() => {
    if (field.extra) {
      const _multiple = field.extra.multiple ? field.extra.multiple : false;
      setMultiple(_multiple);
    }
  });

  const onInput: JSX.EventHandler<HTMLSelectElement, Event> = async (
    event: any
  ) => {
    const data = {
      form_name,
      field_name: field.name,
      value: parseInt(event.currentTarget.value),
    };
    changeValue(data);
  };

  const checkSelected = (
    is_multiple: any,
    option_value: any,
    field_value: any
  ): boolean => {
    if (is_multiple()) {
      if (field_value && field_value.length) {
        const res = field_value.indexOf(option_value) != -1;
        return res;
      } else if (field.value && field.value.length) {
        const res = field.value.indexOf(option_value) != -1;
        return res;
      }
      return false;
    }
    return option_value === field_value;
  };

  return (
    <>
      <label for={field.attributes.id}>{field.attributes.label ?? ""}</label>
      <select
        name={field.name}
        id={field.attributes.id}
        classList={addClasses(
          field.attributes.classes ? field.attributes.classes : []
        )}
        required={isRequired(field)}
        disabled={field.attributes.disabled}
        multiple={multiple()}
        onChange={onInput}
      >
        <Show when={field.extra.options && field.extra.options.length}>
          <For each={field.extra.options}>
            {(option: any) => (
              <option
                value={option.value}
                selected={checkSelected(multiple, option.value, field.value)}
              >
                {option.title}
              </option>
            )}
          </For>
        </Show>
      </select>
    </>
  );
};

export default Input;
