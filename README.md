<p>
  <img src="https://assets.solidjs.com/banner?project=Formly&type=package" alt="Solid Formly" />
</p>

> Solid Formly by [@kamalkech](https://github.com/kamalkech).

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
import { createSignal, Show } from "solid-js";
import { Formly, IValue, IField } from "solid-formly";

const form_name = "formly_usage";
const fields: IField[] = [
  {
    type: "input",
    name: "firstname",
    attributes: {
      type: "text",
      id: "firstname",
      classes: ["form-control"],
      placeholder: "Tap your first name"
    },
    rules: ["required", "min:3", "max:10"],
    messages: {
      required: "The firstname is required",
      min: "Your firstname is too short min=3",
      max: "Your firstname is too long max=10"
    }
  },
  {
    type: "input",
    name: "password",
    attributes: {
      type: "password",
      id: "password",
      classes: ["form-control"],
      placeholder: "Tap your first name"
    },
    rules: ["required", "min:6", "max:10"],
    messages: {
      required: "The password is required",
      min: "Your password is too short min=6",
      max: "Your password is too long max=10"
    }
  }
];

const App = () => {
  const [values, setValues] = createSignal<any>(null);

  const onSubmit = (data: IValue) => {
    setValues(data);
  };

  return (
    <>
      <Show when={values()}>
        <pre>
          <code>{JSON.stringify(values(), null, 2)}</code>
        </pre>
      </Show>
      <Formly
        form_name={props.form_name}
        fields={props.fields}
        onSubmit={onSubmit}
        btnSubmit={{
          text: "Send"
        }}
        btnReset={{
          text: "Reset",
          classes: ["outline", "btn-primary"]
        }}
        real={true}
      />
    </>
  );
};

export default App;
```
