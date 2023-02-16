import { useState } from "react";
import { useSession } from "next-auth/react";
import Editor from "../Editor";
import toast from "react-hot-toast";
import LoadingIcon from "../LoadingIcon";
import Filter from "../Filter";
import { editMessage, sendMessage } from "@/utils/utils";

const Session = (props: { theme: "dark" | "light" }) => {
  const { data: user, status } = useSession();

  const [currentChannel, setCurrentChannel] = useState<string>("");
  const [currentMsg, setCurrentMsg] = useState<string>("");

  const [pingContent, setPingContent] = useState<string>(
    `@everyone DaCoolReminder is updated for ${new Date(
      Date.now() + new Date().getTimezoneOffset() * 60000 + 7 * 3600 * 1000
    ).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`
  );

  const [editorValue, setEditorValue] = useState<string | undefined>("");

  if (status === "loading") {
    return <LoadingIcon />;
  }

  if (!user) {
    return <div>Not signed in</div>;
  }

  const postMessage = () => {
    if (currentMsg === "new") {
      toast("Sending message...");
      sendMessage(currentChannel, editorValue || "").then((data) => {
        console.log(data);
        toast.success("Message sent successfully!");
      });
    } else {
      toast("Editing message...");
      editMessage(currentChannel, currentMsg, editorValue || "").then(
        (data) => {
          console.log(data);
          toast.success("Message edited successfully!");
        }
      );
    }

    if (pingContent) {
      sendMessage(currentChannel, pingContent).then((data) => {
        console.log(data);
        toast.success("Ping sent successfully!");
      });
    }
  };

  return (
    <div className="hero md:min-h-[80vh] min-h-[75vh]">
      <div className="hero-content flex-col lg:flex-row">
        <Filter
          currentChannel={currentChannel}
          currentMessage={currentMsg}
          pingContent={pingContent}
          setChannel={setCurrentChannel.bind(this)}
          setMessage={setCurrentMsg.bind(this)}
          setPingContent={setPingContent.bind(this)}
          callback={postMessage}
        />
        {currentMsg && (
          <Editor
            channelId={currentChannel}
            messageId={currentMsg}
            callback={setEditorValue}
            theme={props.theme}
          />
        )}
      </div>
    </div>
  );
};

export default Session;
