import { Component, createSignal, For, JSX, onMount, Show } from "solid-js";
import { addClasses, isRequired, IPropsField } from "../utils";

const Input: Component<IPropsField> = ({ form_name, field, changeValue }: IPropsField) => {
  const [multiple, setMultiple] = createSignal<boolean>(false);

  onMount(() => {
    if (field.extra) {
      const _multiple = field.extra.multiple ? field.extra.multiple : false;
      setMultiple(_multiple);
    }
  });

  const onInput: JSX.EventHandler<HTMLSelectElement, Event> = async (event: any) => {
    let value;
    if (multiple()) {
      let values: any = [];
      const selectedOptions = event.currentTarget.selectedOptions;
      for (let i = 0; i < selectedOptions.length; i++) {
        const value_item = selectedOptions[i].value;
        values = [...values, value_item];
      }
      value = values;
    } else {
      value = event.target.value;
    }

    const data = {
      form_name,
      field_name: field.name,
      value: value
    };
    changeValue(data);
  };

  const checkSelected = (is_multiple: any, option_value: any, field_value: any): boolean => {
    if (is_multiple) {
      if (field_value && field_value.length) {
        const res = field_value.indexOf(option_value) != -1;
        console.log("res1", res);
        return res;
      } else if (field.value && field.value.length) {
        const res = field.value.indexOf(option_value) != -1;
        console.log("res2", res);
        return res;
      }
      return false;
    }
    return option_value === field_value;
  };

  return (
    <select
      name={field.name}
      id={field.attributes.id}
      classList={addClasses(field.attributes.classes ? field.attributes.classes : [])}
      required={isRequired(field)}
      disabled={field.attributes.disabled}
      multiple={multiple()}
      onInput={onInput}
    >
      <Show when={field.extra.options && field.extra.options.length}>
        <For each={field.extra.options}>
          {(option: any) => (
            <option
              value={option.value}
              // selected={checkSelected(field.extra.multiple ?? false, option.value, field.value)}
            >
              {option.title}
            </option>
          )}
        </For>
      </Show>
    </select>
  );
};

export default Input;
