import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ChannelType,
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIGuildChannelsResult,
} from "discord-api-types/v10";
import Editor from "../Editor";
import toast, { Toaster } from "react-hot-toast";
import LoadingIcon from "../LoadingIcon";

const Filter = (props: { theme: "dark" | "light" }) => {
  const { data: user, status } = useSession();

  const [valid, setValid] = useState<boolean>(false);
  const [loading, setStatus] = useState<boolean>(true);

  const [channels, setChannels] = useState<RESTGetAPIGuildChannelsResult>([]);
  const [msgList, setMsgList] = useState<RESTGetAPIChannelMessagesResult>([]);

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

  const botID = "947808159983108137";

  useEffect(() => {
    if (status === "loading") return;

    fetch("/api/validate")
      .then((res) => res.json())
      .then((data) => {
        setValid(data);
        setStatus(false);
      });
  }, [status]);

  useEffect(() => {
    if (status === "loading" || !user) return;

    fetch("/api/channel/list")
      .then((res) => res.json())
      .then((data) => {
        setChannels(data);
      });
  }, [status, user]);

  useEffect(() => {
    if (status === "loading" || !user || currentChannel === "") return;

    fetch(`/api/channel/messages`, {
      method: "POST",
      body: JSON.stringify({
        channelId: currentChannel,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMsgList(data);
      });
  }, [status, user, currentChannel]);

  if (status === "loading" || loading) {
    return <LoadingIcon />;
  }

  if (!user) {
    return <div>Not signed in</div>;
  }

  if (!valid) {
    toast.error("Invalid/unauthorized user");
    return (
      <div>
        <Toaster />
        <p>Invalid/unauthorized user</p>
      </div>
    );
  }

  const editMessage = () => {
    toast("Editing message...");
    fetch(`/api/message/edit`, {
      method: "POST",
      body: JSON.stringify({
        channelId: currentChannel,
        messageId: currentMsg,
        content: editorValue,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.success("Message edited successfully!");
      });

    if (pingContent) {
      fetch(`/api/message/send`, {
        method: "POST",
        body: JSON.stringify({
          channelId: currentChannel,
          content: pingContent,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          toast.success("Message sent successfully!");
        });
    }
  };

  return (
    <div className="hero">
      <div className="hero-content flex-col lg:flex-row">
        <div className="flex flex-col pt-4 items-center place-content-center justify-center min-w-fit min-h-full lg:p-10">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Channel</span>
            </label>
            <select
              title="Channel"
              className="select select-bordered w-80 bg-gray-100 dark:bg-slate-800"
              onChange={(e) => {
                setCurrentChannel(e.target.value);
                setCurrentMsg("");
              }}
            >
              {channels.map((channel) => {
                if (channel.type === ChannelType.GuildText) {
                  return (
                    <option key={channel.id} value={channel.id}>
                      {channel.name}
                    </option>
                  );
                }
              })}
            </select>
          </div>
          {currentChannel && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Message</span>
              </label>
              <select
                title="Message"
                className="select select-bordered w-80 bg-gray-100 dark:bg-slate-800"
                onChange={(e) => setCurrentMsg(e.target.value)}
              >
                {msgList.map((msg) => {
                  if (msg.author.id === botID)
                    return (
                      <option key={msg.id} value={msg.id}>
                        {msg.content.split("\n")[0]}
                      </option>
                    );
                })}
              </select>
            </div>
          )}
          {currentMsg && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Ping (clear to disable)</span>
              </label>
              <div className="flex flex-row">
                <input
                  type="text"
                  className="input input-bordered w-80 bg-gray-100 dark:bg-slate-800"
                  value={pingContent}
                  onChange={(e) => setPingContent(e.target.value)}
                />
              </div>
            </div>
          )}
          {currentMsg && (
            <>
              {" "}
              <Toaster />
              <button className="btn btn-primary mt-4" onClick={editMessage}>
                <span>Edit message</span>
              </button>
            </>
          )}
        </div>
        {currentMsg && (
          <div className="flex flex-col pt-4 items-center place-content-center justify-center lg:min-w-[50vw] min-w-[75vw] lg:min-h-[50vh] min-h-[75vh] lg:p-10">
            <Editor
              channelId={currentChannel}
              messageId={currentMsg}
              callback={setEditorValue}
              theme={props.theme}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
