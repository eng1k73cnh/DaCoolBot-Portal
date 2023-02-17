export const editMessage = (
  channelId: string,
  messageId: string,
  content: string
) =>
  fetch(`/api/message/edit`, {
    method: "POST",
    body: JSON.stringify({
      channelId,
      messageId,
      content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) return res.json();
    return Promise.reject(res);
  });

export const sendMessage = (channelId: string, content: string) =>
  fetch(`/api/message/send`, {
    method: "POST",
    body: JSON.stringify({
      channelId,
      content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) return res.json();
    return Promise.reject(res);
  });
