import {
  AiOutlineLoading3Quarters,
  AiOutlineExclamationCircle,
} from "react-icons/ai";

type LoadingWrapper = {
  children: React.ReactNode;
  isLoading: boolean;
  isError: boolean;
};

const LoadingWrapper = ({ children, isLoading, isError }: LoadingWrapper) => {
  return isError ? (
    <span className="text-red-500 animate-ping transition-all">
      <AiOutlineExclamationCircle />
    </span>
  ) : isLoading ? (
    <span className="text-black animate-spin transition-all">
      <AiOutlineLoading3Quarters />
    </span>
  ) : (
    <>{children}</>
  );
};

export default LoadingWrapper;
