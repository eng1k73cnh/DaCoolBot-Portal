import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ChannelType,
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIGuildChannelsResult,
} from "discord-api-types/v10";
import Dropdown from "../Dropdown";
import toast from "react-hot-toast";

const Filter = (props: {
  currentChannel: string;
  currentMessage: string;
  pingContent: string;
  setChannel: (channel: string) => void;
  setMessage: (msg: string) => void;
  setPingContent: (content: string) => void;
  callback: () => void;
}) => {
  const { data: user, status } = useSession();

  const [channels, setChannels] = useState<RESTGetAPIGuildChannelsResult>([]);
  const [msgList, setMsgList] = useState<RESTGetAPIChannelMessagesResult>([]);

  const botID = "947808159983108137";

  useEffect(() => {
    if (status === "loading" || !user) return;

    fetch("/api/channel/list")
      .then((res) => {
        if (res.ok) return res.json();
        else return Promise.reject(res);
      })
      .then((data) => {
        setChannels(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch message list");
      });
  }, [status, user]);

  useEffect(() => {
    if (status === "loading" || !user || props.currentChannel === "") return;

    fetch(`/api/channel/messages`, {
      method: "POST",
      body: JSON.stringify({
        channelId: props.currentChannel,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return Promise.reject(res);
      })
      .then((data) => {
        setMsgList(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch message list");
      });
  }, [status, user, props.currentChannel]);

  return (
    <div className="flex flex-col pt-4 items-center place-content-center justify-center min-w-fit min-h-full lg:p-10">
      <Dropdown
        type="Channel"
        items={channels.map((channel) => {
          if (channel.type === ChannelType.GuildText) {
            return { key: channel.id, value: "#-" + channel.name };
          }
        })}
        callback={(channel: string) => {
          props.setChannel(channel);
          props.setMessage("");
        }}
      />
      {props.currentChannel && (
        <Dropdown
          type="Message"
          items={msgList.map((msg) => {
            if (msg.author.id === botID)
              return { key: msg.id, value: msg.content.split("\n")[0] };
          })}
          callback={(msg: string) => props.setMessage(msg)}
        />
      )}
      {props.currentMessage && (
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Ping (clear to disable)</span>
          </label>
          <div className="flex flex-row">
            <input
              type="text"
              title="Ping"
              className="input input-bordered w-80 bg-gray-100 dark:bg-slate-800"
              value={props.pingContent}
              onChange={(e) => props.setPingContent(e.target.value)}
            />
          </div>
        </div>
      )}
      {props.currentMessage && (
        <button className="btn btn-primary mt-4" onClick={props.callback}>
          <span>Post message</span>
        </button>
      )}
    </div>
  );
};

export default Filter;
