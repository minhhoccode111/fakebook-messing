import CustomLink from "@/components/custom/custom-link";

const Footer = () => {
  return (
    <footer className="p-4 grid place-items-center">
      <p className="">
        Made by{" "}
        <CustomLink to="https://github.com/minhhoccode111">
          minhhoccode111
        </CustomLink>
      </p>
    </footer>
  );
};

export default Footer;
