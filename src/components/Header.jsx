import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import {LinkIcon, LogOut} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {BarLoader} from "react-spinners";
import {Button} from "./ui/button";
import {UrlState} from "../context";
import useFetch from "../hooks/useFetch";
import { logout } from "../../db/apiAuth";

const Header = () => {
  const {loading, fn: fnLogout} = useFetch(logout);
  const navigate = useNavigate();

  const {user, fetchUser} = UrlState();

  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to="/">
          <img src="/logo.png" className="h-16 ml-16" alt="Trimrr Logo" />
        </Link>
        <div className="flex gap-4">
          {!user ? (
            <Button className="ml-11" onClick={() => navigate("/auth")}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden ">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.profile_pic} className="object-contain" />
                  <AvatarFallback>SKP</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-background'>
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My Links
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    fnLogout().then(() => {
                      fetchUser();
                      navigate("/auth");
                    });
                  }}
                  className="text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
    </>
  );
};

export default Header;