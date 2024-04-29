import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MyAvatar = {
  src: string;
  fallback: string;
};

const MyAvatar = ({ src, fallback }: MyAvatar) => {
  return (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default MyAvatar;
