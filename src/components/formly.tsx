import { Component, createEffect, createResource, For, Show, untrack } from "solid-js";
import { formStore, valueStore } from "../utils/stores";
import { getForm, preprocessField } from "../utils/form";
import { produce } from "solid-js/store";
import { validate } from "../utils/validation";
import Message from "./message";
import { IField, IForm, IValue } from "../utils/types";
import Tag, { FieldsTypes } from "./tag";
import { Dynamic, isServer } from "solid-js/web";

const Formly: Component<IForm> = (props: IForm) => {
  let _form;
  const { forms, setForms } = formStore;

  // Start createResource.
  const [_data] = createResource(
    () => {
      return { fields: props.fields, form_name: props.form_name, onSubmit: props.onSubmit };
    },
    async _props => {
      let _values: any = {};
      const __fields = await Promise.all(
        _props.fields.map(async field => {
          // Set Values.
          _values[`${field.name}`] = field.value;
          // Preprocess field.
          if (field.preprocess) {
            field = await preprocessField(field, _props.fields, _values);
            _values[`${field.name}`] = field.value;
          }
          // Validation field.
          field = await validate(field);
          // Return Field.
          return field;
        })
      );

      const _currentForm: IForm = {
        fields: __fields,
        form_name: _props.form_name,
        onSubmit: _props.onSubmit,
        values: _values
      };

      const form_exist: IForm | undefined = forms.find(
        (form: IForm) => form.form_name === props.form_name
      );
      if (!form_exist) {
        setForms((forms: IForm[]) => [...forms, _currentForm]);
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
      }

      return JSON.stringify(_currentForm);
    },
    { deferStream: true }
  );
  // End createResource.

  createEffect(() => {
    let _currentForm: IForm = _data() ? JSON.parse(_data() ?? "") : null;

    if (_currentForm) {
      props.fields.map((field: IField) => {
        if (field.preprocess) {
          _currentForm.fields.map((_field: IField) => {
            if (field.name === _field.name) {
              _field.preprocess = field.preprocess;
            }
            return _field;
          });
        }
        return field;
      });
      const form_exist = forms.find(form => form.form_name === props.form_name);
      // const form_exist = untrack(() => {
      //   return forms.find(form => form.form_name === props.form_name);
      // });

      if (!form_exist) {
        setForms((forms: IForm[]) => [...forms, _currentForm]);
      } else {
        setForms(
          form => form.form_name === props.form_name,
          produce(form => {
            form.fields = _currentForm.fields;
            form.form_name = _currentForm.form_name;
            form.onSubmit = _currentForm.onSubmit;
            return form;
          })
        );
      }
    }
  });

  // On change value
  const onChangeValue = async (data: any) => {
    const _form = _data() ? JSON.parse(_data() ?? "") : null;

    // Set forms.
    setForms(
      form => form.form_name === props.form_name,
      produce(form => {
        form.fields.map(async (field: IField) => {
          if (field.name === data.field_name) {
            form.values["touched"] = field.name;
            field.value = data.value;
            form.values[data.field_name] = data.value;
          }

          // Preprocess field.
          if (field.preprocess) {
            field = await preprocessField(field, form.fields, form.values);
            form.values[field.name] = field.value;
          }
          // Validation field.
          field = await validate(field);
          // Return field.
          return field;
        });
        return _form;
      })
    );
  };

  // On submit
  const onSubmit = (e: any) => {
    e.preventDefault();
    const form: IForm | undefined = forms.find((form: IForm) => form.form_name === props.form_name);
    props.onSubmit((form && form?.values) ?? null);
  };

  const onReset = (e: any) => {
    setForms(
      form => form.form_name === props.form_name,
      produce(form => {
        form.fields.map(async field => {
          field.value = null;
          // Validation field.
          field = await validate(field);
          // Set Values.
          // setValues(
          //   value => value.form_name === props.form_name,
          //   produce(value => {
          //     value.values[`${field.name}`] = field.value;
          //     return value;
          //   })
          // );
          return field;
        });
        return form;
      })
    );
  };

  const _getForm = (): any => {
    if (isServer) {
      return _data() ? JSON.parse(_data() ?? "") : null;
    } else {
      const _form = getForm(props.form_name);
      return _form;
    }
  };

  return (
    <form onSubmit={onSubmit} ref={_form} onReset={e => onReset(e)}>
      <h2>Form: {props.form_name}</h2>
      <pre>
        <code>{JSON.stringify(_getForm(), null, 2)}</code>
      </pre>
      <Show when={_getForm()}>
        <For each={_getForm()?.fields}>
          {(field: IField) => (
            // Tag
            <Tag
              tag={field.prefix ? field.prefix.tag : ""}
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
                  {error => (
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
