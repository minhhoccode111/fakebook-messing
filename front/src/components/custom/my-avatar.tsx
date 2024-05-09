import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { domParser } from "@/shared/methods";

type MyAvatar = {
  src: undefined | string;
  fallback: undefined | string;
};

const MyAvatar = ({ src, fallback }: MyAvatar) => {
  return (
    <Avatar>
      <AvatarImage src={domParser(src as string)} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default MyAvatar;
