import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ChannelType,
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIGuildChannelsResult,
} from "discord-api-types/v10";
import toast from "react-hot-toast";
import { FilterState } from "../Session";

import Dropdown from "./Dropdown";
import FileInput from "./FileInput";
import Ping from "./Ping";

const Filter = (props: {
  state: FilterState;
  setState: (state: FilterState) => void;
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
    if (status === "loading" || !user || props.state.channel === "") return;

    fetch(`/api/channel/messages?channelId=${props.state.channel}`)
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
  }, [status, user, props.state.channel]);

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
          props.setState({ ...props.state, channel: channel, message: "" });
        }}
      />
      {props.state.channel && (
        <Dropdown
          type="Message"
          items={msgList.map((msg) => {
            if (msg.author.id === botID)
              return { key: msg.id, value: msg.content.split("\n")[0] };
          })}
          callback={(msg: string) => {
            props.setState({ ...props.state, message: msg });
          }}
        />
      )}
      {props.state.message && (
        <>
          <Ping state={props.state} setState={props.setState} />
          <FileInput state={props.state} setState={props.setState} />
          <button className="btn btn-primary mt-4" onClick={props.callback}>
            <span>Post message</span>
          </button>
        </>
      )}
    </div>
  );
};

export default Filter;
