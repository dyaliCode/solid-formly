import { Component, createSignal, For, JSX, onMount, Show } from "solid-js";
import { produce } from "solid-js/store";
import { valueStore } from "../utils";
import { addClasses, dispatchValues } from "../utils/form";
import { IPropsField, IValue } from "../utils/types";

const Checkbox: Component<IPropsField> = ({ form_name, field, changeValue }: IPropsField) => {
  // const [_values, _setValues] = createSignal<any>([]);
  const { values, setValues } = valueStore;

  const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = async (
    event: any
  ): Promise<void> => {
    let _values: any[] = [];
    const item_val = event.target.value;

    setValues(
      (value: any) => value.form_name === form_name,
      produce((value: any) => {
        let val_field = value.values[field.name] ?? [];
        if (event.target.checked) {
          val_field = [...val_field, item_val];
        } else {
          val_field = val_field.filter((val: any) => {
            if (val !== item_val) {
              return val;
            }
          });
        }

        _values = val_field;
        return value;
      })
    );

    dispatchValues(form_name, field.name, _values, changeValue);
  };

  onMount(() => {
    if (field.extra.items.length > 0) {
      let _values: any = [];
      field.extra.items.map((item: any) => {
        if (item.checked) {
          _values = [..._values, item.value];
        }
        return item;
      });

      dispatchValues(form_name, field.name, _values, changeValue);
    }
  });

  return (
    <For each={field.extra.items}>
      {(item: any) => (
        <>
          <input
            type={field.type}
            id={field.attributes.id ? field.attributes.id : field.name}
            classList={addClasses(field.attributes.classes ? field.attributes.classes : [])}
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
