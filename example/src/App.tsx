import { Component, createSignal, Show } from "solid-js";
import { IValue, IField, Formly } from "../../src";

const App: Component = () => {
  const form_name = "my_form";
  const fields: IField[] = [
    {
      type: "input",
      name: "firstname",
      value: "",
      attributes: {
        type: "text",
        label: "Username",
        id: "firstname",
        classes: ["form-control"],
        placeholder: "Tap your first name"
      },
      rules: ["required", "min:6"],
      messages: {
        required: "Firstname field is required!",
        min: "First name field must have more that 6 caracters!"
      }
    },
    {
      prefix: {
        tag: "div",
        classes: ["custom-form-group"]
      },
      type: "input",
      name: "lastname",
      value: "",
      attributes: {
        type: "text",
        id: "lastname",
        placeholder: "Tap your lastname",
        classes: ["form-control"]
      },
      description: {
        tag: "span",
        classes: ["custom-class-desc"],
        text: "Custom text for description"
      }
    },
    {
      type: "input",
      name: "email",
      value: "",
      attributes: {
        type: "email",
        id: "email",
        placeholder: "Tap your email"
      },
      rules: ["required", "email"]
    },
    {
      type: "select",
      name: "city",
      value: 1,
      attributes: {
        type: "select",
        id: "city",
        label: "City"
      },
      rules: ["required"],
      extra: {
        options: [
          {
            value: null,
            title: "All"
          },
          {
            value: 1,
            title: "Agadir"
          },
          {
            value: 2,
            title: "Casablanca"
          }
        ]
      }
    }
  ];

  const [values, setValues] = createSignal<IValue>();

  const onSubmit = (data: IValue) => {
    console.log("data", data);
    setValues(data.values);
  };

  return (
    <div class="container">
      <Show when={values()}>
        <pre>
          <code>{JSON.stringify(values(), null, 2)}</code>
        </pre>
      </Show>
      <Formly form_name={form_name} fields={fields} onSubmit={onSubmit} />
    </div>
  );
};

export default App;
