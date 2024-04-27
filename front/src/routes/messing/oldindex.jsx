import { Link, useOutletContext } from 'react-router-dom';

export default function Index() {
  const { loginState } = useOutletContext();

  return (
    <section className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center gap-16 sm:gap-32">
        <div className="text-link ripper underline hover:decoration-2 underline-offset-4 tracking-widest p-4">
          <h1 className="font-bold text-xl whitespace-nowrap">Messaging App</h1>
        </div>

        <div className="border-2 h-0 border-sky-500 relative self-stretch">
          {loginState.token ? (
            <>
              <Link
                className="ripper p-4 underline hover:decoration-2 underline-offset-4 flex items-center tracking-widest absolute right-3/4 translate-x-1/2 bottom-0 translate-y-1/2 z-10"
                to={'chat'}
              >
                <span className="text-xl font-bold whitespace-nowrap">Chat now</span>
              </Link>

              <Link
                className="ripper p-4 underline hover:decoration-2 underline-offset-4 flex items-center tracking-widest absolute right-1/4 translate-x-1/2 bottom-0 translate-y-1/2 z-10"
                to={'profile'}
              >
                <span className="text-xl font-bold whitespace-nowrap">Profile</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                className="ripper p-4 underline hover:decoration-2 underline-offset-4 flex items-center tracking-widest absolute right-3/4 translate-x-1/2 bottom-0 translate-y-1/2 z-10"
                to={'login'}
              >
                <span className="text-xl font-bold whitespace-nowrap">Login</span>
              </Link>

              <Link
                className="ripper p-4 underline hover:decoration-2 underline-offset-4 flex items-center tracking-widest absolute right-1/2 translate-x-1/2 bottom-0 translate-y-1/2 z-10"
                to={'signup'}
              >
                <span className="text-xl font-bold whitespace-nowrap">Signup</span>
              </Link>

              <Link
                className="ripper p-4 underline hover:decoration-2 underline-offset-4 flex items-center tracking-widest absolute right-1/4 translate-x-1/2 bottom-0 translate-y-1/2 z-10"
                to={'about'}
              >
                <span className="text-xl font-bold whitespace-nowrap">About</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
