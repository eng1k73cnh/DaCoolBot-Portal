import { useState } from "react";
import { useSession } from "next-auth/react";
import Editor from "../Editor";
import toast from "react-hot-toast";
import { LoadingIcon } from "../LoadingIcon";
import Filter from "../Filter";
import { editMessage, sendMessage } from "@/utils/utils";

export type FilterState = {
  channel: string;
  message: string;
  ping: {
    enabled: boolean;
    content: string;
  };
  files: File[];
  fileSize: number;
};

const Session = (props: { theme: "dark" | "light" }) => {
  const { data: user, status } = useSession();

  const [filterState, setFilterState] = useState<FilterState>({
    channel: "",
    message: "",
    ping: {
      enabled: true,
      content: `@everyone DaCoolReminder is updated for ${new Date(
        Date.now() + new Date().getTimezoneOffset() * 60000 + 7 * 3600 * 1000
      ).toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`,
    },
    files: [],
    fileSize: 0,
  });

  const [sent, setSent] = useState<boolean>(true);
  const [editorValue, setEditorValue] = useState<string | undefined>("");

  if (status === "loading") {
    return <LoadingIcon />;
  }

  if (!user) {
    return <div>Not signed in</div>;
  }

  const postMessage = () => {
    if (filterState.fileSize > 8388608) {
      toast.error("File size limit exceeded");
      return;
    }

    setSent(false);

    const form = new FormData();
    const json = {
      content: editorValue || "",
      attachments: filterState.files.map((file, index) => {
        return { id: index, filename: file.name };
      }),
    };
    form.append("payload_json", JSON.stringify(json));

    filterState.files.forEach((file, index) => {
      form.append(`files[${index}]`, file, file.name);
    });

    if (filterState.message === "new") {
      toast("Sending message...");
      sendMessage(form, filterState.channel)
        .then((data) => {
          console.log(data);
          toast.success("Message sent successfully!");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to send message");
        })
        .finally(() => {
          setSent(true);
        });
    } else {
      toast("Editing message...");
      editMessage(form, filterState.channel, filterState.message)
        .then((data) => {
          console.log(data);
          toast.success("Message edited successfully!");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to edit message");
        })
        .finally(() => {
          setSent(true);
        });
    }

    if (filterState.ping.enabled && filterState.ping.content) {
      const form = new FormData();
      form.append("channelId", filterState.channel);
      form.append(
        "payload_json",
        JSON.stringify({ content: filterState.ping.content })
      );

      toast("Sending ping...");
      sendMessage(form, filterState.channel)
        .then((data) => {
          console.log(data);
          toast.success("Ping sent successfully!");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to send ping");
        });
    }
  };

  return (
    <div className="hero">
      <div className="hero-content flex-col lg:flex-row">
        <Filter
          state={filterState}
          setState={setFilterState}
          callback={postMessage}
          messageSent={sent}
        />
        {filterState.message && (
          <>
            <div className="divider md:divider-horizontal" />
            <Editor
              channelId={filterState.channel}
              messageId={filterState.message}
              callback={setEditorValue}
              theme={props.theme}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Session;
