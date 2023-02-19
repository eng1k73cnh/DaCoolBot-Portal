import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ChannelType,
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIGuildChannelsResult,
} from "discord-api-types/v10";
import Dropdown from "../Dropdown";
import toast from "react-hot-toast";
import { FilterState } from "../Session";

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
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Ping (clear to disable)</span>
            </label>
            <div className="flex flex-row">
              <input
                type="text"
                title="Ping"
                className="input input-bordered w-80 bg-gray-100 dark:bg-slate-800"
                value={props.state.ping}
                onChange={(e) => {
                  props.setState({ ...props.state, ping: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Files</span>
              <span className="label-text-alt">Max 8MB</span>
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
                      !!e.target.files[0] && fileSize <= 8000000
                    );
                    e.target.classList.toggle(
                      "file-input-error",
                      !!e.target.files[0] && fileSize > 8000000
                    );
                  }
                }}
              />
            </div>
            <label className="label">
              <span className="label-text-alt">
                {props.state.fileSize
                  ? `Current size: ${(props.state.fileSize / 1000000).toFixed(
                      2
                    )}MB`
                  : "No files"}
              </span>
            </label>
          </div>
          <button className="btn btn-primary mt-4" onClick={props.callback}>
            <span>Post message</span>
          </button>
        </>
      )}
    </div>
  );
};

export default Filter;
