import CustomLink from "@/components/custom/custom-link";

const IndexMessing = () => {
  return (
    <section className="flex-1 max-w-[70ch] mx-auto">
      <h2 className="text-xl font-bold my-8">Messing</h2>

      <p className="font-bold text-red-700">Under maintained!</p>

      <p className="">
        If you want to experience, please check out my{" "}
        <CustomLink to="https://github.com/minhhoccode111/messaging-app-front">
          Messaging App Project.
        </CustomLink>
      </p>

      <p className="">These two projects use the same database.</p>
    </section>
  );
};

export default IndexMessing;
