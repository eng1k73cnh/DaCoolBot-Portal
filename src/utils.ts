import { toast } from "react-hot-toast";

const processResponse = (res: Response) => {
  if (res.ok) return res.json();
  return Promise.reject(res);
};

export const editMessage = (
  body: FormData,
  channelId: string,
  messageId: string
) =>
  fetch(`/api/message/edit?channelId=${channelId}&messageId=${messageId}`, {
    method: "POST",
    body,
  })
    .then(processResponse)
    .then((data) => {
      console.log(data);
      toast.success("Message edited successfully!");
    })
    .catch((err) => {
      console.error(err);
      toast.error("Failed to edit message");
    });

export const sendMessage = (body: FormData, channelId: string) =>
  fetch(`/api/message/send?channelId=${channelId}`, {
    method: "POST",
    body,
  })
    .then(processResponse)
    .then((data) => {
      console.log(data);
      toast.success("Message sent successfully!");
    })
    .catch((err) => {
      console.error(err);
      toast.error("Failed to send message");
    });

export const fetchData = (endpoint: string) =>
  fetch(endpoint)
    .then(processResponse)
    .catch((err) => {
      console.log(err);
      toast.error("Something went wrong");
    });
