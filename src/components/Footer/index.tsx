import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeCommit } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="flex navbar container p-4 mx-auto md:p-6 flex-row-reverse">
      <FontAwesomeIcon icon={faCodeCommit} className="ml-1 h-4 w-4" />
      <code>
        <a
          href={
            "https://github.com/eng1k73cnh/DaCoolBot-Portal/commit/" +
            process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
          }
          className="hover:text-blue-500 transition-colors text-xs"
          rel="noreferrer noopener"
          target="_blank"
        >
          {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7)}
        </a>
      </code>
    </footer>
  );
};

export default Footer;
