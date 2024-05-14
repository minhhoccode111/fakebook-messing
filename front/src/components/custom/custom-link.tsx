type CustomLinkPropsType = {
  children: React.ReactNode;
  className?: string;
  to: string;
};

const CustomLink = ({ to, children }: CustomLinkPropsType) => {
  return (
    <a
      href={to}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sky-500 underline-offset-2 hover:underline"
    >
      {children}
    </a>
  );
};

export default CustomLink;
