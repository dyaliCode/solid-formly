import { Component, createSignal, For, JSX, Show } from "solid-js";
import { addClasses } from "../utils/form";
import { isRequired } from "../utils/helper";
import { IPropsField } from "../utils/types";

const Input: Component<IPropsField> = ({ form_name, field, changeValue }: IPropsField) => {
  let inputFile: any;
  const multiple: boolean = true;
  const [files, setFiles] = createSignal<any[]>([]);

  const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = async (
    event: any
  ): Promise<void> => {
    setFiles(Array.from(event.target.files));
    console.log("111", 111);
    if (files().length > 0) {
      const data = {
        form_name,
        field_name: field.name,
        value: files()
      };
      changeValue(data);
    }
  };

  const deleteFile = (e: any, file: File) => {
    e.preventDefault();
    let newValue: any;
    const _files: File[] = files().filter(i => i.name != file.name);
    if (files().length === 0) {
      inputFile.value = null;
      newValue = null;
    } else {
      newValue = _files;
    }

    console.log("inputFile", inputFile);
    setFiles(newValue);

    const data = {
      form_name,
      field_name: field.name,
      value: newValue
    };
    changeValue(data);
  };

  return (
    <>
      <input
        type="file"
        name={field.name}
        id={field.attributes.id}
        classList={addClasses(field.attributes.classes ? field.attributes.classes : [])}
        multiple={multiple}
        onInput={onInput}
        ref={inputFile}
      />

      <Show when={files() && field.extra.showPreview}>
        <For each={files()}>
          {(file: File) => (
            <div class="file">
              <pre>
                <code>{JSON.stringify(file.name, null, 2)}</code>
              </pre>
              <div class="img">
                <img src={window.URL.createObjectURL(file)} alt={file.name} />
              </div>
              <div class="infos">
                <ul>
                  <li>Name: {file.name}</li>
                  <li>Size: {file.size}</li>
                  <li>Type: {file.type}</li>
                  <li>
                    <button type="button" onClick={e => deleteFile(e, file)} class="btn">
                      Remove
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </For>
      </Show>
    </>
  );
};

export default Input;
