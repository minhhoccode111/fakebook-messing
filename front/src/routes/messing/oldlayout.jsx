import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Footer, Header } from './../components/more';
import { get, set } from './../methods/index';

export default function Layout() {
  // location.pathname - the path of the current URL
  const { pathname } = useLocation();

  // login state on local storage
  const [loginState, setLoginState] = useState({});

  // init user data on local storage if has
  useEffect(() => {
    const state = get();

    // only use when token not expired
    if (new Date(state.expiresInDate) > new Date()) setLoginState(() => state);
    else set({});
  }, []);

  return (
    <>
      {/* TODO MAYBE /chat don't have header */}
      {pathname !== '/chat' && <Header loginState={loginState} />}
      {/* <Header loginState={loginState} /> */}

      {/* dynamic part */}
      <main className={'flex-1'}>
        <Outlet context={{ setLoginState, loginState }} />
      </main>

      {/* TODO MAYBE /chat don't have footer */}
      {pathname !== '/' && pathname !== '/chat' && <Footer />}
      {/* {pathname !== '/' && <Footer />} */}
    </>
  );
}
