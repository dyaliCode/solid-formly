import { Component, For, onMount, Show } from "solid-js";
import { formStore, valueStore } from "../utils/stores";
import { getForm, preprocessField } from "../utils/form";
import { produce } from "solid-js/store";
import { validate } from "../utils/validation";
import Message from "./message";
import { IField, IForm, IValue } from "../utils/types";
import Tag, { FieldsTypes } from "./tag";
import { Dynamic } from "solid-js/web";

const Formly: Component<IForm> = (props: IForm) => {
  let _form;
  const { forms, setForms }: any = formStore;
  const { values, setValues }: any = valueStore;

  // Init
  onMount(async () => {
    let form_values = { form_name: props.form_name, values: {}, touched: null };
    let _values: any = {};

    await Promise.all(
      props.fields.map(async (field: any) => {
        _values[`${field.name}`] = field.value ?? null;
        return field.value;
      })
    );

    const _fields = await Promise.all(
      props.fields.map(async (field: any) => {
        // Preprocess field.
        if (field.preprocess) {
          field = await preprocessField(field, props.fields, _values);
          _values[`${field.name}`] = field.value;
        }

        // Validation field.
        field = await validate(field);

        return field;
      })
    );

    form_values.values = _values;

    const _currentForm = {
      fields: _fields,
      form_name: props.form_name
    };

    let formsUpdated: any = [];

    if (forms.length) {
      formsUpdated = forms.map((form: any) => {
        if (form.form_name === props.form_name) {
          form = _currentForm;
        }

        return form;
      });
    } else {
      formsUpdated.push(_currentForm);
    }
    setForms([...forms, _currentForm]);

    setValues([...values, { form_name: props.form_name, values: _values }]);
  });

  // On change value
  const onChangeValue = async (data: any) => {
    let _values: any = {};
    // Set forms.
    setForms(
      (form: any) => form.form_name === props.form_name,
      produce((form: any) => {
        form.fields.map(async (field: any) => {
          if (field.name === data.field_name) {
            _values["touched"] = field.name;
            field.value = data.value;
          }

          _values[`${field.name}`] = field.value;

          // Preprocess field.
          if (field.preprocess) {
            field = await preprocessField(field, form.fields, _values);
            _values[`${field.name}`] = field.value;
          }

          // Validation field.
          field = await validate(field);

          // Set Values.
          setValues(
            (value: any) => value.form_name === props.form_name,
            produce((value: any) => {
              value.values[`${field.name}`] = field.value;
              return value;
            })
          );
          return field;
        });
        return form;
      })
    );

    // Set Values.
    // setValues(
    //   (value: any) => value.form_name === props.form_name,
    //   produce((value: any) => {
    //     value.values[`${data.field_name}`] = data.value;
    //     return value;
    //   })
    // );
  };

  // On submit
  const onSubmit = (e: any) => {
    e.preventDefault();
    const _v = values.find((v: IValue) => v.form_name === props.form_name);
    props.onSubmit(_v);
  };

  const onReset = (e: any) => {
    e.preventDefault();
    setValues(
      (value: any) => value.form_name === props.form_name,
      produce((value: any) => {
        value.values = {};
        props.onSubmit(value);
        return value;
      })
    );
  };

  return (
    <form onSubmit={onSubmit} ref={_form} onReset={onReset}>
      <Show when={getForm(props.form_name)}>
        <For each={getForm(props.form_name).fields}>
          {(field: IField) => (
            <Tag
              tag={field.prefix ? field.prefix.tag : "div"}
              classes={field.prefix ? (field.prefix.classes ? field.prefix.classes : []) : []}
            >
              <Dynamic
                component={FieldsTypes[field.type]}
                form_name={props.form_name}
                field={field}
                changeValue={onChangeValue}
                name={field.name}
              />
              <Show when={field.validation && field.validation.errors.length}>
                <For each={field.validation.errors}>
                  {(error: any) => (
                    <Message error={error} messages={field.messages ? field.messages : []} />
                  )}
                </For>
              </Show>
            </Tag>
          )}
        </For>
      </Show>
      <button class="btn btn-primary" type="submit">
        Submit
      </button>
      <button class="btn btn-primary" type="reset">
        Reset
      </button>
    </form>
  );
};

export default Formly;
