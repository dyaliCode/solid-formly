import { Component, createSignal, For, JSX, onMount } from "solid-js";
import { addClasses, dispatchValues } from "../utils/form";
import { isRequired } from "../utils/helper";
import { IField, IPropsField } from "../utils/types";

const Radio: Component<IPropsField> = ({ form_name, field, changeValue }: IPropsField) => {
  const [items, setItems] = createSignal<any[]>([]);

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
      value
    };
    changeValue(data);
  };

  onMount(() => {
    if (field.extra) {
      if (field.extra.items.length > 0) {
        setItems(field.extra.items);
        field.extra.items.map((item: any) => {
          let _val = null;
          if (item.checked) {
            _val = item.value;
          }
          dispatchValues(form_name, field.name, _val, changeValue);
          return item;
        });
      }
    }
  });

  return (
    <For each={field.extra.items}>
      {(item: any) => (
        <div class={field.extra.aligne === "inline" ? "form-check-inline" : "form-check"}>
          <input
            type={field.type}
            classList={addClasses(field.attributes.classes ? field.attributes.classes : [])}
            id={item.id}
            name={field.name}
            value={item.value}
            checked={item.value ? item.checked : false}
            onInput={onInput}
          />
          <span>{item.title}</span>
        </div>
      )}
    </For>
  );
};

export default Radio;
