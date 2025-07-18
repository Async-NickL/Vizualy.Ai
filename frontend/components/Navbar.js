import {
  SignInButton,
  SignUpButton,
  SignedOut,
} from "@clerk/nextjs";
import { InteractiveHoverButton } from "./ui/animated-button";
import Image from "next/image";
import ThemeSwitcher from "./ui/theme-switcher";


const Navbar = () => {

  
  
  return (
    <div>
      <header className="fixed bg-black/5 backdrop-blur-md border-b-1 border-foreground/10 w-full flex justify-between items-center max-sm:p-2 p-4 gap-4 h-14 z-[50]">
        <div className="logo max-sm:hidden">
          <Image src={"/logo.png"} alt="Vizualy" width={40} height={40} />
        </div>
        <div className="flex gap-4 justify-between max-sm:w-full max-sm:gap-2">
          <div className="auth flex gap-2">
            <SignedOut>
              <InteractiveHoverButton>
                <SignInButton forceRedirectUrl="/chat/new" />
              </InteractiveHoverButton>
              <InteractiveHoverButton>
                <SignUpButton forceRedirectUrl="/chat/new" />
              </InteractiveHoverButton>
            </SignedOut>
          </div>
          <ThemeSwitcher />
        </div>
      </header>
    </div>
  );
};

export default Navbar;
