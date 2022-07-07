import { IForm } from "solid-formly";
import { Component, createSignal, Show } from "solid-js";
import { Formly, IValue, IField } from "../../src/";

const App: Component = () => {
  const form_name = "my_form";
  const fields: IField[] = [
    {
      type: "input",
      name: "x",
      value: 2,
      attributes: {
        id: "x",
        type: "number",
        classes: ["form-control"],
        label: "X"
      },
      rules: ["required"]
    },
    {
      type: "input",
      name: "y",
      value: 8,
      attributes: {
        id: "y",
        type: "number",
        classes: ["form-control"],
        label: "Y"
      }
    },
    {
      type: "input",
      name: "total",
      attributes: {
        id: "total",
        type: "number",
        classes: ["form-control"],
        label: "X + Y"
      },
      preprocess: (field: IField, fields: IForm, values: any) => {
        field.value = values.x + values.y;
        // if (values.touched === "x" || values.touched === "y") {
        //   field.value = values.x + values.y;
        // }
        return field;
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
