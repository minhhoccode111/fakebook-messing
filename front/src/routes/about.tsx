import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import CustomLink from "@/components/custom/custom-link";

const About = () => {
  return (
    <section className="mx-auto p-4 max-w-[80ch] w-full">
      <h2 className="text-xl font-bold my-8">About</h2>

      <article className="flex flex-col gap-3 py-4">
        <p className="">Simple Facebook clone using MERN stack</p>

        <p className="">
          <CustomLink
            to="https://github.com/minhhoccode111/fakebook-messing"
            className=""
          >
            Project
          </CustomLink>
          is made by{" "}
          <CustomLink to="https://github.com/minhhoccode111" className="">
            minhhoccode111{" "}
          </CustomLink>
          .
        </p>

        <p className="">
          To showcase the{" "}
          <CustomLink to="https://www.theodinproject.com/lessons/nodejs-odin-book">
            {" "}
            Messaging App Back{" "}
          </CustomLink>{" "}
          developed for{" "}
          <CustomLink to="https://www.theodinproject.com/lessons/nodejs-messaging-app">
            {" "}
            The Odin Project&apos;s NodeJS course{" "}
          </CustomLink>
          .
        </p>

        <p className="">
          This project&apos;s backend uses free tier hosting on{" "}
          <CustomLink to={"https://glitch.com"}>Glitch</CustomLink>, which can
          cause significant delays in the server&apos;s response time for API
          requests or data fetching.
        </p>

        <p className="">
          However, I still really appreciate the fact that Glitch offers a free
          tier for hosting Backend projects.
        </p>

        <p className="">
          You will need to{" "}
          <Link to={"/login"}>
            <Button variant={"link"} size={"sm"} className="">
              login
            </Button>
          </Link>{" "}
          before doing anything.
        </p>
      </article>
    </section>
  );
};

export default About;
