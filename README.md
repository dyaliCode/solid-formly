<p>
  <img src="https://assets.solidjs.com/banner?project=Formly&type=package" alt="Solid Formly" />
</p>

> Solid Formly
> by [@kamalkech](https://github.com/kamalkech).

# Solid Fromly [![npm Version](https://img.shields.io/npm/v/solid-formly.svg?style=flat-square)](https://www.npmjs.org/package/solid-formly)

## Features

- ⚡️ Generate dynamic and reactive forms.
- 😍 Easy to extend with custom field type, custom validation.

## Documentation

soon...

## Installation

```sh
> npm i solid-formly
```

## Usage for solidjs & solid-start

```jsx
import { Component, createSignal, Show } from "solid-js";
import { IValue, IField, Formly } from "solid-formly";

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
```
