// @ts-nocheck
// Type is extended from jwt callback
// https://next-auth.js.org/configuration/callbacks#jwt-callback

import Image from "next/image";
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
    <header className="navbar container mx-auto px-4 pt-5">
      <div className="navbar-start">
        <Image
          src="/icon.png"
          alt="DaCoolBot Logo"
          width={50}
          height={50}
          className="rounded-full mr-4"
        />
        <span className="self-center text-2xl font-semibold whitespace-nowrap hover:text-blue-500 transition-colors hidden lg:block">
          DCB Portal
        </span>
      </div>
      <div className="navbar-end space-x-4">
        {!session?.user ? (
          <button title="Sign in" onClick={() => signIn("discord")}>
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
            <div>
              <span className="self-center text-xl font-medium whitespace-nowrap">
                {session.user.name}
              </span>
              <span className="self-center text-base font-light whitespace-nowrap">
                #{session.user.discriminator}
              </span>
            </div>
            <button title="Sign Out" onClick={() => signOut()}>
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
    </header>
  );
};

export default Header;
