import { InlineLoadingIcon } from "../LoadingIcon";

export default function Dropdown(props: {
  type: string;
  items: ({ key: string; value: string } | undefined)[];
  fetched: boolean;
  callback: (channel: string) => void;
}) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{props.type}</span>
        {!props.fetched && <InlineLoadingIcon />}
      </label>
      <select
        title={props.type}
        className="select select-bordered w-80 bg-gray-100 dark:bg-slate-800"
        onChange={(e) => {
          props.callback(e.target.value);
        }}
      >
        <option value="">Select a {props.type.toLowerCase()}</option>
        {props.type === "Message" && (
          <option value="new">Create a new {props.type.toLowerCase()}</option>
        )}
        <optgroup label={props.type + "s"}>
          {props.items.map((item) => {
            if (item) {
              return (
                <option key={item.key} value={item.key}>
                  {item.value}
                </option>
              );
            }
          })}
        </optgroup>
      </select>
    </div>
  );
}
