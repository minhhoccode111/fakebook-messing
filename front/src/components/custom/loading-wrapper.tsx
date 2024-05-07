type LoadingWrapper = {
  children: React.ReactNode;
  isLoading: boolean;
  isError: boolean;
};

const LoadingWrapper = ({ children, isLoading, isError }: LoadingWrapper) => {
  return (
    <>
      {isError ? (
        "error"
      ) : isLoading ? (
        "loading"
      ) : (
        <>{children}</>
        // BUG: i used {children} instead of <>{children}</>
        // and break every thing how dumb is that
      )}
    </>
  );
};

export default LoadingWrapper;
