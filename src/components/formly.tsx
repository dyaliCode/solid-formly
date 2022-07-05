import { Component, For, JSX, onMount, Show } from "solid-js";
import { formStore, valueStore } from "../utils/stores";
import { getForm, preprocessField } from "../utils/form";
import { produce } from "solid-js/store";
import { validate } from "../utils/validation";
import Message from "./message";
import { IField, IForm, IValue } from "../utils/types";
import Tag, { FieldsTypes } from "./tag";
import { Dynamic } from "solid-js/web";

const Formly: Component<IForm> = (props: IForm) => {
  let _form: any;
  const { forms, setForms }: any = formStore;
  const { values, setValues }: any = valueStore;

  // Init
  onMount(async () => {
    let _values: any = {};

    await Promise.all(
      props.fields.map(async (field: any) => {
        // Set Values.
        _values[`${field.name}`] = field.value;
        // Preprocess field.
        if (field.preprocess) {
          field = await preprocessField(field, props.fields, _values);
          _values[`${field.name}`] = field.value;
        }
        // Validation field.
        field = await validate(field);
        // Return Field.
        return field;
      })
    );

    const _currentForm: IForm = {
      fields: props.fields,
      form_name: props.form_name,
      onSubmit: props.onSubmit
    };

    const form_exist: IForm = forms.find((form: IForm) => form.form_name === props.form_name);
    if (!form_exist) {
      setForms([...forms, _currentForm]);
      setValues([...values, { form_name: _currentForm.form_name, values: _values }]);
    } else {
      setForms(
        (form: IForm) => form.form_name === props.form_name,
        produce((form: IForm) => {
          form.fields = _currentForm.fields;
          form.form_name = _currentForm.form_name;
          form.onSubmit = _currentForm.onSubmit;
          return form;
        })
      );
      setValues(
        (value: IValue) => value.form_name === props.form_name,
        produce((value: IValue) => {
          value.values = _values;
          value.form_name = _currentForm.form_name;
          return value;
        })
      );
    }
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
          // Return field.
          return field;
        });
        return form;
      })
    );
  };

  // On submit
  const onSubmit = (e: any) => {
    e.preventDefault();
    const _v = values.find((v: IValue) => v.form_name === props.form_name);
    props.onSubmit(_v);
  };

  const onReset = (e: any) => {
    setForms(
      (form: any) => form.form_name === props.form_name,
      produce((form: any) => {
        form.fields.map(async (field: any) => {
          field.value = null;

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
  };

  return (
    <form onSubmit={onSubmit} ref={_form} onReset={(e: any) => onReset(e)}>
      <Show when={getForm(props.form_name)}>
        <For each={getForm(props.form_name).fields}>
          {(field: IField) => (
            // Tag
            <Tag
              tag={field.prefix ? field.prefix.tag : "div"}
              classes={field.prefix ? (field.prefix.classes ? field.prefix.classes : []) : []}
            >
              {/* Label */}
              <Show when={field.attributes}>
                <Show when={field.attributes.label}>
                  <label for={field.attributes.id} class="label">
                    {field.attributes.label}
                  </label>
                </Show>
              </Show>
              {/* Field */}
              <Dynamic
                component={FieldsTypes[field.type]}
                form_name={props.form_name}
                field={field}
                changeValue={onChangeValue}
                name={field.name}
              />
              {/* Messafe error */}
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
