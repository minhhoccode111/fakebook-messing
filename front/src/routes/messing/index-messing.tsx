import RouteHeader from "@/components/custom/route-header";
import CustomLink from "@/components/custom/custom-link";

const IndexMessing = () => {
  return (
    <section className="flex-1 max-w-[70ch] mx-auto">
      <RouteHeader>Messing</RouteHeader>

      <p className="font-bold text-red-700">Under maintained!</p>

      <p className="">
        If you want to experience, please check out my{" "}
        <CustomLink to="https://messagingapptop.vercel.app">
          Messaging App Project.
        </CustomLink>
      </p>

      <p className="">These two projects use the same database.</p>
    </section>
  );
};

export default IndexMessing;
