import { Component, createSignal, Show } from "solid-js";
import { Formly, IValue, IField } from "../../src/";

const App: Component = () => {
  const form_name = "my_form";
  const fields: IField[] = [
    {
      type: "radio", // required
      name: "name-field-radio", // required
      attributes: {
        type: "radio", // required
        id: "id-field-radio", // required
        classes: ["form-check-input"], // optional
        disabled: false, // optional,
        label: "Radio Inline"
      },
      extra: {
        items: [
          {
            id: "radio1",
            value: 1,
            title: "radio 1"
          },
          {
            id: "radio2",
            value: 2,
            title: "radio 2",
            checked: true
          }
        ],
        aligne: "inline"
      }
    },
    {
      type: "radio", // required
      name: "name-field-radio2", // required
      attributes: {
        type: "radio", // required
        id: "id-field-radio2", // required
        classes: ["form-check-input"], // optional
        disabled: false, // optional,
        label: "Radio Default"
      },
      extra: {
        items: [
          {
            id: "radio3",
            value: 3,
            title: "radio 3"
          },
          {
            // checked: true,
            id: "radio4",
            value: 4,
            title: "radio 4"
          }
        ],
        aligne: "default"
      }
    }
  ];

  const [values, setValues] = createSignal<IValue>();

  const onSubmit = (data: IValue) => {
    console.log("data", data);
    setValues(data.values);
  };

  const onSubmit2 = (data: IValue) => {
    console.log("data2", data);
    setValues(data.values);
  };

  return (
    <div class="container">
      <h1>Multiple dynamic forms</h1>
      <ul>
        <li>⚡️ Generate dynamic and reactive forms.</li>
        <li>😍 Easy to extend with custom field type, custom validation.</li>
      </ul>
      <div class="grid">
        <div class="col">
          <article>
            <Formly form_name={form_name} fields={fields} onSubmit={onSubmit} />
          </article>
        </div>
      </div>
    </div>
  );
};

export default App;
