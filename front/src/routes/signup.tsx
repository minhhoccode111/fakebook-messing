import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Signup() {
  // validation form on typing
  const [fullnameValidationState, setFullnameValidationState] = useState(true);
  const [confirmPasswordValidationState, setConfirmPasswordValidationState] =
    useState(true);

  // handle input states manually
  const [fullnameState, setFullnameState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [confirmPasswordState, setConfirmPasswordState] = useState("");

  // handle fetch states
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // error messages to display
  const [displayMessages, setDisplayMessages] = useState([]);

  // validate on change of password and confirm-password field
  useEffect(() => {
    if (passwordState === confirmPasswordState)
      setConfirmPasswordValidationState(() => true);
    else setConfirmPasswordValidationState(() => false);
  }, [passwordState, confirmPasswordState]);

  // validate on change of fullname field
  useEffect(() => {
    if (fullnameState.trim() === "" || fullnameState.charAt(0) === " ")
      setFullnameValidationState(false);
    else setFullnameValidationState(true);
  }, [fullnameState]);

  // handle signup submit manually
  async function handleSignupFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const fullname = form.querySelector(`input[name="fullname"]`);
    const username = form.querySelector(`input[name="username"]`);
    const password = form.querySelector(`input[name="password"]`);
    const confirmPassword = form.querySelector(
      `input[name="confirm-password"]`,
    );

    setIsLoading(() => true);

    try {
      await axios({
        mode: "cors",
        method: "post",
        url: import.meta.env.VITE_API_ORIGIN + "/auth/signup",
        data: {
          username: username.value,
          password: password.value,
          fullname: fullname.value,
          "confirm-password": confirmPassword.value,
        },
      });

      // clear inputs
      username.value = "";
      // these 3 inputs we manually handle its state
      setFullnameState(() => "");
      setPasswordState(() => "");
      setConfirmPasswordState(() => "");

      // alert successfully created user
      setDisplayMessages(() => [
        { success: true, msg: `*Successfully created user!` },
      ]);
    } catch (err) {
      if (err.response.status === 400) {
        setDisplayMessages(() => [...err.response.data.errors]);
      } else {
        setIsError(() => true);
        setDisplayMessages(() => [
          { msg: `*There is a server error or  internet connection!` },
        ]);
      }
    } finally {
      setIsLoading(() => false);
    }
  }

  return (
    <section className="mx-auto max-w-[60ch] px-4 py-16 my-10 sm:px-6 lg:px-8 shadow-lg shadow-gray-400 rounded-xl bg-[#ffffffcc] text-slate-900">
      {/* header and dummy text */}
      <div className="mx-auto text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Signup</h1>

        <p className="mt-4 text-gray-500">
          Want to join the conversation? Signing up is quick and free! By
          creating an account, you&apos;ll be able to chat with other users,
          join groups, create groups. Let&apos;s build a vibrant community
          together!
        </p>
      </div>

      <form
        onSubmit={handleSignupFormSubmit}
        className="mx-auto mb-0 mt-8 space-y-12"
      >
        <div className="mt-10">
          <label htmlFor="fullname" className="sr-only">
            Fullname
          </label>

          <div className="relative">
            <input
              name="fullname"
              id="fullname"
              type="text"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm peer"
              placeholder="Enter fullname"
              minLength={"1"}
              maxLength={"50"}
              required
              value={fullnameState}
              onChange={(e) => setFullnameState(() => e.target.value)}
            />

            <span
              className={
                (fullnameValidationState ? "hidden " : "block ") +
                "text-danger absolute bottom-full m-1 z-10 text-xs peer-invalid:block"
              }
            >
              *Fullname must not be empty or start with space.
            </span>
          </div>
        </div>

        <div className="mt-10">
          <label htmlFor="username" className="sr-only">
            Username
          </label>

          <div className="relative">
            <input
              name="username"
              id="username"
              type="email"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm peer"
              placeholder="Enter username"
              minLength={"8"}
              required
            />

            <span className="hidden text-danger peer-invalid:block absolute bottom-full m-1 z-10 text-xs">
              *Username must be a valid email, at least 8 characters.
            </span>

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="">
          <label htmlFor="password" className="sr-only">
            Password
          </label>

          <div className="relative">
            <input
              name="password"
              id="password"
              type="password"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm peer"
              placeholder="Enter password"
              minLength={"8"}
              maxLength={"32"}
              // at least 1 uppercase, 1 lowercase, 1 number, 1 special char
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$"
              required
              value={passwordState}
              onChange={(e) => setPasswordState(() => e.target.value)}
            />

            <span className="hidden text-danger peer-invalid:block absolute bottom-full m-1 z-10 text-xs">
              *Password must contain at least 1 uppercase, 1 lowercase, 1
              number, 1 special character, at least 8 characters.
            </span>

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="">
          <label htmlFor="confirm-password" className="sr-only">
            Confirm password
          </label>

          <div className="relative">
            <input
              name="confirm-password"
              id="confirm-password"
              type="password"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm peer"
              placeholder="Confirm password"
              minLength={"8"}
              maxLength={"32"}
              required
              value={confirmPasswordState}
              onChange={(e) => setConfirmPasswordState(() => e.target.value)}
            />

            <span
              className={
                (confirmPasswordValidationState ? "hidden " : "block ") +
                "text-danger absolute bottom-full m-1 z-10 text-xs peer-invalid:block"
              }
            >
              *Confirm password does not match.
            </span>

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link className="underline text-link" to="/login">
              Log in
            </Link>{" "}
            now
          </p>

          {/* if a server error or no internet connection */}
          {isError ? (
            <SubmitButton isDisable={true}>
              <Error />
            </SubmitButton>
          ) : isLoading ? (
            <SubmitButton isDisable={true}>
              <Loading />
            </SubmitButton>
          ) : (
            <SubmitButton isDisable={false}>Signup</SubmitButton>
          )}
        </div>
      </form>

      {/* a list of error messages from server (wrong password and stuffs) */}
      {displayMessages.length !== 0 && (
        <div className="px-8 py-2 font-bold text-lg">
          {displayMessages.map((error, index) => {
            return error.success ? (
              <p key={index} className="text-success">
                {error.msg}
              </p>
            ) : (
              <p key={index} className="text-danger">
                {error}
              </p>
            );
          })}
        </div>
      )}
    </section>
  );
}
