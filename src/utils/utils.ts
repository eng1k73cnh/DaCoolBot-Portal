export const editMessage = (
  body: FormData,
  channelId: string,
  messageId: string
) =>
  fetch(`/api/message/edit?channelId=${channelId}&messageId=${messageId}`, {
    method: "POST",
    body,
  }).then((res) => {
    if (res.ok) return res.json();
    return Promise.reject(res);
  });

export const sendMessage = (body: FormData, channelId: string) =>
  fetch(`/api/message/send?channelId=${channelId}`, {
    method: "POST",
    body,
  }).then((res) => {
    if (res.ok) return res.json();
    return Promise.reject(res);
  });
