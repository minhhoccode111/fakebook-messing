type RouteHeaderPropsType = {
  children: React.ReactNode;
};

const RouteHeader = ({ children }: RouteHeaderPropsType) => {
  return <h2 className="text-2xl font-bold my-8">{children}</h2>;
};

export default RouteHeader;
