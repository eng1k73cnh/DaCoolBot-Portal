import { FilterState } from "../Session";

export default function Ping(props: {
  state: FilterState;
  setState: (state: FilterState) => void;
}) {
  return (
    <div className="form-control w-full mt-1">
      <label className="label">
        <span className="label-text">Ping</span>
        <input
          type="checkbox"
          className="toggle toggle-success"
          checked={props.state.ping.enabled}
          onChange={(e) => {
            props.setState({
              ...props.state,
              ping: { ...props.state.ping, enabled: e.target.checked },
            });
          }}
        />
      </label>
      {props.state.ping.enabled && (
        <div className="flex flex-row">
          <input
            type="text"
            title="Ping"
            className="input input-bordered w-80 bg-gray-100 dark:bg-slate-800"
            value={props.state.ping.content}
            placeholder="Ping someone"
            onChange={(e) => {
              props.setState({
                ...props.state,
                ping: { ...props.state.ping, content: e.target.value },
              });
            }}
          />
        </div>
      )}
    </div>
  );
}
