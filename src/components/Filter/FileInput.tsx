import { FilterState } from "@/pages";

export default function FileInput(props: {
  state: FilterState;
  setState: (state: FilterState) => void;
}) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Files</span>
        <span className="label-text-alt">Max 4.5MB</span>
      </label>
      <div className="flex flex-row">
        <input
          type="file"
          title="Files"
          className="file-input file-input-bordered file-input-info file-input-md w-80 bg-gray-100 dark:bg-slate-800"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              const fileSize = Array.from(e.target.files).reduce(
                (acc, file) => acc + file.size,
                0
              );
              props.setState({
                ...props.state,
                files: Array.from(e.target.files),
                fileSize,
              });
              e.target.classList.toggle(
                "file-input-success",
                !!e.target.files[0] && fileSize <= 4.5 * 1024 * 1024
              );
              e.target.classList.toggle(
                "file-input-error",
                !!e.target.files[0] && fileSize > 4.5 * 1024 * 1024
              );
            }
          }}
        />
      </div>
      <label className="label">
        <span className="label-text-alt">
          {props.state.fileSize
            ? `Current size: ${(props.state.fileSize / 1000000).toFixed(2)}MB`
            : "No files"}
        </span>
      </label>
    </div>
  );
}
