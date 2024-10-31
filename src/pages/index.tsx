import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import Editor from "@/components/Editor";
import { LoadingIcon } from "@/components/LoadingIcon";
import Filter from "@/components/Filter";
import { editMessage, sendMessage } from "@/utils";

const Home = () => {
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
		if (filterState.fileSize > 8 * 1024 * 1024) {
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
			sendMessage(form, filterState.channel).finally(() => {
				setSent(true);
			});
		} else {
			toast("Editing message...");
			editMessage(form, filterState.channel, filterState.message).finally(() => {
				setSent(true);
			});
		}

		if (filterState.ping.enabled && filterState.ping.content) {
			const form = new FormData();
			form.append("channelId", filterState.channel);
			form.append("payload_json", JSON.stringify({ content: filterState.ping.content }));

			toast("Sending ping...");
			sendMessage(form, filterState.channel);
		}
	};

	return (
		<>
			<div className="hero">
				<div className="hero-content flex-col lg:flex-row">
					<Filter state={filterState} setState={setFilterState} callback={postMessage} messageSent={sent} />
					{filterState.message && (
						<>
							<div className="divider md:divider-horizontal" />
							<Editor channelId={filterState.channel} messageId={filterState.message} callback={setEditorValue} />
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default Home;
