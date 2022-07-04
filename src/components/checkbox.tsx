import { Component, createSignal, For, JSX, onMount } from "solid-js";
import { addClasses, dispatchValues } from "../utils/form";
import { IPropsField } from "../utils/types";

const Checkbox: Component<IPropsField> = ({
  form_name,
  field,
  changeValue,
}: IPropsField) => {
  const [_values, _setValues] = createSignal<any>([]);

  const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = async (
    event: any
  ): Promise<void> => {
    if (field.extra.items.length > 0) {
      field.extra.items.map((item: any) => {
        if (event.target.name === item.name) {
          if (event.target.checked) {
            _setValues([..._values(), item.value]);
          } else {
            _setValues((vals: any) => {
              return vals.filter((val: any) => val !== item.value);
            });
          }
        }
      });

      dispatchValues(form_name, field.name, _values(), changeValue);
    }
  };

  onMount(() => {
    if (field.extra.items.length > 0) {
      let vls: any = [];
      field.extra.items.map((item: any) => {
        if (item.checked) {
          vls = [...vls, item.value];
        }
        return item;
      });

      _setValues(vls);

      dispatchValues(form_name, field.name, vls, changeValue);
    }
  });

  return (
    <For each={field.extra.items}>
      {(item: any) => (
        <>
          <input
            type={field.type}
            id={field.attributes.id ? field.attributes.id : field.name}
            classList={addClasses(
              field.attributes.classes ? field.attributes.classes : []
            )}
            value={item.value}
            name={item.name}
            checked={item.value ? item.checked : false}
            onInput={onInput}
          />
          <span>{item.title}</span>
        </>
      )}
    </For>
  );
};

export default Checkbox;
