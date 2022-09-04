import { Component, createSignal, Show } from "solid-js";

const list_rules = {
  required: "This field is required",
  min: "This field must be more characters long",
  max: "This field must be less characters long",
  between: "This field must be between values defined",
  equal: "This field must be equal to value defined",
  email: "This email format is not valid",
  types: "Must to allowed file types",
  maxsize: "This file has size more than max size",
  custom_rule: "Error"
};

const Message: Component<any> = props => {
  const [rules] = createSignal<any>(list_rules);
  const [messages, setMessages] = createSignal<any>(props.messages);
  // Liste rules with default message.

  const displayError = (rule: string) => {
    let message = "";
    if (messages()[rule]) {
      message += messages()[rule] ? messages()[rule] : rules()["custom_rule"];
    } else {
      message += rules()[rule] ? rules()[rule] : rules()["custom_rule"];
    }
    return message;
  };

  return (
    <Show when={props.error}>
      <div class="invalid-feedback">{displayError(props.error)}</div>
    </Show>
  );
};

export default Message;
