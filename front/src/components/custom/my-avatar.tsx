import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { domParser } from "@/shared/methods";

type MyAvatar = {
  fallback: undefined | string;
  status: undefined | string;
  src: undefined | string;
};

const MyAvatar = ({ src, fallback, status }: MyAvatar) => {
  let bg;
  switch (status) {
    case "online":
      bg = "bg-green-600";
      break;
    case "offline":
      bg = "bg-gray-600";
      break;
    case "busy":
      bg = "bg-red-600";
      break;
    case "afk":
      bg = "bg-yellow-600";
      break;
  }

  return (
    <div className={"relative" + " "}>
      <Avatar className="">
        <AvatarImage src={domParser(src as string)} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>

      {
        <div
          className={
            "w-3 h-3 z-10 rounded-full absolute bottom-0 right-0 animate-pulse transition-all" +
            " " +
            bg
          }
        ></div>
      }
    </div>
  );
};

export default MyAvatar;
