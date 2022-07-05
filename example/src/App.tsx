import { Component, createSignal, Show } from "solid-js";
import { Formly, IValue, IField } from "../../dist/";

const App: Component = () => {
  const form_name = "my_form";
  const fields: IField[] = [
    {
      type: "file", // required
      name: "name-file", // require
      attributes: {
        type: "file", // required
        id: "id-field", // optional
        classes: ["form-control"], // optional
        label: "Image" // optional
      },
      extra: {
        multiple: false, // optional
        showPreview: true // optional
      },
      rules: ["file"],
      messages: {
        types: "image type not valid"
      },
      file: {
        // need to add this attribute object if you need a file rule
        types: "jpg,gif",
        maxsize: 5
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
