import { Component, createSignal, Show } from "solid-js";
import { Formly, IValue, IField } from "../../src/";

const App: Component = () => {
  const form_name = "my_form";
  const fields: IField[] = [
    {
      type: "textarea", // required
      name: "name-field-textarea", // required
      value: "", // optional
      attributes: {
        type: "textarea", // required
        id: "id-field-textarea", // required
        classes: ["form-control"], // optional
        label: "Label field textarea", // optional
        placeholder: "Placeholder field textarea", // optional
        disabled: false, // optional
        readonly: false, // optional
        rows: 7, // optional
        cols: 4 // optional
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
