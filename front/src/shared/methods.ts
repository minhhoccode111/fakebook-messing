// parse escaped string from server to html dom
export const domParser = (str: string) => {
  if (!str) return "";
  // console.log(`the str in dom parser belike: `, str);

  const parser = new DOMParser();

  // unescaped special characters from server
  return (
    parser.parseFromString(str, "text/html").documentElement.textContent || ""
  );
};

export const markdownParser = (str: string) => {
  if (!str) return "";

  const rules = [
    //header rules
    // come on. who is going to use h6 h5 h4
    { reg: /#{6}\s?([^\n]+)/g, string: "<h6>$1</h6>" },

    { reg: /#{5}\s?([^\n]+)/g, string: "<h5>$1</h5>" },

    { reg: /#{4}\s?([^\n]+)/g, string: "<h4>$1</h4>" },

    {
      reg: /#{3}\s?([^\n]+)/g,
      string: '<h3 class="text-xl font-bold text-green-400">$1</h3>',
    },

    {
      reg: /#{2}\s?([^\n]+)/g,
      string: '<h2 class="text-2xl font-bold text-yellow-400">$1</h2>',
    },

    {
      reg: /#{1}\s?([^\n]+)/g,
      string: '<h1 class="text-3xl font-bold text-red-400">$1</h1>',
    },

    //bold, italics and paragraph rules
    { reg: /\*\*\s?([^\n]+)\*\*/g, string: "<b>$1</b>" },
    { reg: /\*\s?([^\n]+)\*/g, string: "<i>$1</i>" },
    { reg: /__([^_]+)__/g, string: "<b>$1</b>" },
    { reg: /_([^_`]+)_/g, string: "<i>$1</i>" },
    { reg: /~([^~`]+)~/g, string: "<strike>$1</strike>" },
    { reg: /([^\n]+\n?)/g, string: "<p>$1</p>" },

    //highlights
    {
      reg: /(`)(\s?[^\n,]+\s?)(`)/g,
      string: '<a class="bg-gray-300 text-slate-900 rounded-md px-1">$2</a>',
    },

    //Lists, only * and + because - will mess every else
    {
      reg: /([^\n]+)(\+)([^\n]+)/g,
      string: '<ul class="ml-6 list-disc"><li>$3</li></ul>',
    },
    {
      reg: /([^\n]+)(\*)([^\n]+)/g,
      string: '<ul class="ml-6 list-disc"><li>$3</li></ul>',
    },

    //Image
    // e.g: ![something](https://google.com/image.png "cap here")
    {
      reg: /!\[([^\]]+)\]\(([^)]+)\s"([^")]+)"\)/g,
      string: '<img class="block w-full" src="$2" alt="$1" title="$3" />',
    },

    //links
    {
      reg: /\[([^\]]+)\]\(([^)]+)\)/g,
      string:
        '<a href="$2" class="text-link underline decoration-dotted hover:decoration-solid">$1</a>',
    },
  ];

  // console.log(str);
  rules.forEach(({ reg, string }) => {
    // console.log('the str belike: ', str);
    // console.log(`the rule belike: `, rule);
    // console.log(`the template belike: `, template);
    str = str.replace(reg, string);
  });
  // console.log(`final str belike: `, str);

  return str;
};
