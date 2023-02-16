import { useEffect, useState } from "react";
import MDEditor from "@monaco-editor/react";
import LoadingIcon from "../LoadingIcon";

const Editor = (props: {
  channelId: string;
  messageId: string;
  callback: (content: string | undefined) => void;
  theme: "dark" | "light";
}) => {
  const [value, setValue] = useState<string | undefined>("");
  const [loaded, setLoaded] = useState<boolean>(false);

  const setEditorValue = (content: string | undefined) => {
    setValue(content);
    props.callback(content);
  };

  useEffect(() => {
    if (!props.channelId || !props.messageId) return;

    if (props.messageId === "new") {
      setValue("");
      setLoaded(true);
      return;
    }

    setLoaded(false);
    fetch(`/api/message/fetch`, {
      method: "POST",
      body: JSON.stringify({
        channelId: props.channelId,
        messageId: props.messageId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setValue(data.content);
        setLoaded(true);
      });
  }, [props.channelId, props.messageId]);

  if (!loaded) return <LoadingIcon />;

  return (
    <div className="flex flex-col pt-4 items-center place-content-center justify-center lg:min-w-[50vw] min-w-[75vw] lg:min-h-[50vh] min-h-[75vh] lg:p-10">
      <MDEditor
        className="lg:min-w-[50vw] min-w-[80vw] min-h-[75vh]"
        language="markdown"
        value={value}
        onChange={setEditorValue}
        theme={props.theme === "dark" ? "vs-dark" : "vs-light"}
      />
    </div>
  );
};

export default Editor;
