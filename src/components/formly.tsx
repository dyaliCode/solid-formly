import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  mergeProps,
  Show
} from "solid-js";
import { formStore } from "../utils/stores";
import { addClasses, getForm, preprocessField } from "../utils/form";
import { produce } from "solid-js/store";
import { validate } from "../utils/validation";
import Message from "./message";
import { IField, IForm, IFormProps } from "../utils/types";
import Tag, { FieldsTypes } from "./tag";
import { Dynamic } from "solid-js/web";
import { isFieldDuplicated } from "../utils/helper";

const Formly: Component<IFormProps> = (props: IFormProps) => {
  const propsMerged: IFormProps = mergeProps(
    { btnSubmit: { text: "Submit", classes: [] }, btnReset: { text: "Reset", classes: [] } },
    props
  );
  let _form;
  const { forms, setForms } = formStore;
  const [isDuplicate, setIsDuplicate] = createSignal<boolean>(false);

  // Start createResource.
  const [formsServer] = createResource(
    () => {
      return { fields: props.fields, form_name: props.form_name, onSubmit: props.onSubmit };
    },
    async _props => {
      let _values: any = {};

      const fields = await Promise.all(
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

      const dirty = fields.find((field: IField) => {
        if (field.validation) {
          return field.validation.dirty === true;
        }
      });

      const _currentForm: IForm = {
        fields: fields,
        form_name: _props.form_name,
        onSubmit: _props.onSubmit,
        values: _values,
        valid: dirty ? false : true
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

  // Start createEffect.
  createEffect(() => {
    let _currentForm: IForm = formsServer() ? JSON.parse(formsServer() ?? "") : null;

    // Check duplicated fields.
    setIsDuplicate(isFieldDuplicated(props.fields));

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
        if (field.rules) {
          _currentForm.fields.map((_field: IField) => {
            if (field.name === _field.name) {
              _field.rules = field.rules;
            }
            return _field;
          });
        }
        return field;
      });

      const form_exist = forms.find(form => form.form_name === props.form_name);

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
  // End createEffect.

  // On change value.
  const onChangeValue = async (data: any) => {
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

          if (field.validation.dirty) {
            form.valid = false;
          }

          // Return field.
          return field;
        });

        const dirty = form.fields.find((field: IField) => {
          if (field.validation) {
            return field.validation.dirty === true;
          }
        });

        form.valid = dirty ? false : true;

        return form;
      })
    );
  };

  // On submit.
  const onSubmit = (e: any) => {
    e.preventDefault();
    dispatchDataForm();
  };

  // On Reset.
  const onReset = (e: any) => {
    setForms(
      form => form.form_name === props.form_name,
      produce(form => {
        form.fields.map(async field => {
          field.value = null;
          // Validation field.
          field = await validate(field);
          return field;
        });
        form.values = {};
        return form;
      })
    );
  };

  // Displach data current form.
  const dispatchDataForm = () => {
    const form: IForm | undefined = forms.find((form: IForm) => form.form_name === props.form_name);
    props.onSubmit(form?.values ? { values: form.values, valid: form.valid } : null);
  };

  // Get current form.
  const getCurrentForm = (): IForm => {
    return getForm(props.form_name, formsServer());
  };

  return (
    <>
      <pre>
        <code>{JSON.stringify(getCurrentForm(), null, 2)}</code>
      </pre>
      <Show
        when={!isDuplicate()}
        fallback={
          <p>
            Error! Detect duplicate fields, make sure you put unique name and id for each field{" "}
          </p>
        }
      >
        <form onSubmit={onSubmit} ref={_form} onReset={e => onReset(e)}>
          <Show when={getCurrentForm()}>
            <For each={getCurrentForm()?.fields}>
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
          <button
            classList={addClasses(props.btnSubmit?.classes ? props.btnSubmit?.classes : [])}
            type="submit"
          >
            {propsMerged.btnSubmit?.text ? propsMerged.btnSubmit?.text : "Submit"}
          </button>
          <button
            classList={addClasses(props.btnReset?.classes ? props.btnReset?.classes : [])}
            type="reset"
          >
            {propsMerged.btnReset?.text ? propsMerged.btnReset?.text : "Reset"}
          </button>
        </form>
      </Show>
    </>
  );
};

export default Formly;
