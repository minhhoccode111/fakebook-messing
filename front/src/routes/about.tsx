import CustomLink from "@/components/custom/custom-link";
import RouteHeader from "@/components/custom/route-header";

const About = () => {
  return (
    <section className="w-full max-w-[70ch] mx-auto">
      <RouteHeader>About</RouteHeader>

      <article className="flex flex-col gap-3 py-4">
        <p className="">
          Simple{" "}
          <CustomLink to="https://github.com/minhhoccode111/fakebook-messing">
            Social Media App
          </CustomLink>{" "}
          to showcase the{" "}
          <CustomLink to="https://www.theodinproject.com/lessons/nodejs-odin-book">
            Odin-book Project
          </CustomLink>{" "}
          developed for{" "}
          <CustomLink to="https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs">
            {" "}
            The Odin Project&apos;s NodeJS course
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
      </article>
    </section>
  );
};

export default About;
