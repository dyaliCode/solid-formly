import { Component, createSignal, For, JSX, Show } from "solid-js";
import { addClasses, dispatchValues, IPropsField } from "../utils";

const Input: Component<IPropsField> = ({ form_name, field, changeValue }: IPropsField) => {
  let inputFile: any;
  const multiple: boolean = true;
  const [files, setFiles] = createSignal<any[]>([]);

  const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = async (
    event: any
  ): Promise<void> => {
    setFiles(Array.from(event.target.files));
    if (files().length > 0) {
      dispatchValues(form_name, field.name, files(), changeValue);
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

    setFiles(newValue);

    dispatchValues(form_name, field.name, newValue, changeValue);
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
