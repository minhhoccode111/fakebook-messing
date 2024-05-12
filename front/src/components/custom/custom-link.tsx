import { Button } from "@/components/ui/button";

type CustomLinkPropsType = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

const CustomLink = ({ to, children, className }: CustomLinkPropsType) => {
  return (
    <a href={to} target="_blank" rel="noopener noreferrer" className="">
      <Button variant={"link"} size={"sm"} className={className}>
        {children}
      </Button>
    </a>
  );
};

export default CustomLink;
