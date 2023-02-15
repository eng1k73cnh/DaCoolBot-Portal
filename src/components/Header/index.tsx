import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useSession, signIn, signOut } from "next-auth/react";
import ThemeChanger from "../ThemeChanger";

const Header = (props: { setTheme: (theme: "dark" | "light") => void }) => {
  const { data: session } = useSession();
  return (
    <div className="navbar container mx-auto px-4 pt-5">
      <div className="navbar-start">
        <span className="self-center text-2xl font-semibold whitespace-nowrap hover:text-blue-500 transition-colors">
          DCB Portal
        </span>
      </div>
      <div className="navbar-end space-x-4">
        {!session?.user ? (
          <button onClick={() => signIn()}>
            <span className="grid gap-1 grid-flow-col items-center self-center text-xl font-medium whitespace-nowrap hover:text-blue-500 transition-colors">
              <FontAwesomeIcon icon={faRightToBracket} className="h-6 w-6" />
              {" Login"}
            </span>
          </button>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={session.user.image || ""}
              alt="User Image"
              className="rounded-full h-10 w-10"
            />
            <span className="self-center text-xl font-medium whitespace-nowrap">
              {session.user.name}
            </span>
            <button onClick={() => signOut()}>
              <span className="grid gap-1 grid-flow-col items-center self-center text-xl font-medium whitespace-nowrap hover:text-blue-500 transition-colors">
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className="h-6 w-6"
                />
              </span>
            </button>
          </>
        )}
        <ThemeChanger setAppTheme={props.setTheme} />
      </div>
    </div>
  );
};

export default Header;
