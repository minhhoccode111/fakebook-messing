import { markdownParser, domParser } from "@/shared/methods";

type DangerHtmlPropsType = {
  content: string;
};

const DangerHtml = ({ content }: DangerHtmlPropsType) => {
  // TODO: ask Anh Duc Master about this
  return (
    <div
      // incase when a really long not break word destroy our layout
      className="break-all"
      dangerouslySetInnerHTML={{ __html: markdownParser(domParser(content)) }}
    ></div>
  );
};

export default DangerHtml;
