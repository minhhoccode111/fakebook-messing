type LogoPropsType = {
  className: string;
};

export const Logo = ({ className }: LogoPropsType) => {
  return <div className={"" + " " + className}></div>;
};

export const Icons = {
  logo: Logo,
};
