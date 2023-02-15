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
    <MDEditor
      className="lg:min-w-[50vw] min-w-[80vw] min-h-[75vh]"
      language="markdown"
      value={value}
      onChange={setEditorValue}
      theme={props.theme === "dark" ? "vs-dark" : "vs-light"}
    />
  );
};

export default Editor;
