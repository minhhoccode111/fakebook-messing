type LoadingWrapper = {
  children: React.ReactNode;
  isLoading: boolean;
  isError: boolean;
};

const LoadingWrapper = ({ children, isLoading, isError }: LoadingWrapper) => {
  return isError ? (
    <span className="">error</span>
  ) : isLoading ? (
    <span className="">loading</span>
  ) : (
    <>{children}</>
  );
};

export default LoadingWrapper;
