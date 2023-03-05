import { useContext, useEffect, useState, memo } from "react";
import MDEditor from "@monaco-editor/react";
import { LoadingIcon } from "../LoadingIcon";
import toast from "react-hot-toast";
import { ThemeContext } from "@/pages/_app";

const Editor = memo(function Editor(props: {
  channelId: string;
  messageId: string;
  callback: (content: string | undefined) => void;
}) {
  const [value, setValue] = useState<string | undefined>("");
  const [loaded, setLoaded] = useState<boolean>(false);
  const theme = useContext(ThemeContext);

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
    fetch(
      `/api/message/fetch?channelId=${props.channelId}&messageId=${props.messageId}`
    )
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(res);
      })
      .then((data) => {
        props.callback(data.content);
        setValue(data.content);
        setLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch message content");
        setLoaded(true);
      });
  }, [props.channelId, props.messageId]);

  if (!loaded) return <LoadingIcon />;

  return (
    <div className="flex flex-col max-sm:pt-4 max-sm:pb-4 md:pr-4 md:pl-4 items-center place-content-center justify-center lg:min-w-[50vw] min-w-[75vw] min-h-[75vh] lg:min-h-[70vh] max-sm:w-full">
      <MDEditor
        className="lg:min-w-[50vw] min-w-[75vw] lg:min-h-[70vh] min-h-[75vh]"
        language="markdown"
        value={value}
        onChange={setEditorValue}
        theme={`vs-${theme}`}
      />
    </div>
  );
});

export default Editor;
