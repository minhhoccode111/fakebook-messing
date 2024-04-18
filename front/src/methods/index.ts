export function get(key = 'loginState') {
  const data = localStorage.getItem(key);
  return data === null ? {} : JSON.parse(data);
}

export function set(value, key = 'loginState') {
  localStorage.setItem(key, JSON.stringify(value));
}

// parse escaped string from server to html dom
export function domParser(str) {
  if (!str) return '';
  // console.log(`the str in dom parser belike: `, str);

  const parser = new DOMParser();

  // unescaped special characters from server
  return parser.parseFromString(str, 'text/html').documentElement.textContent;
}

export function markdownParser(str) {
  if (!str) return '';

  const rules = [
    //header rules
    // come on. who is going to use h6 h5 h4
    [/#{6}\s?([^\n]+)/g, '<h6>$1</h6>'],

    [/#{5}\s?([^\n]+)/g, '<h5>$1</h5>'],

    [/#{4}\s?([^\n]+)/g, '<h4>$1</h4>'],

    [/#{3}\s?([^\n]+)/g, '<h3 class="text-xl font-bold text-green-400">$1</h3>'],

    [/#{2}\s?([^\n]+)/g, '<h2 class="text-2xl font-bold text-yellow-400">$1</h2>'],

    [/#{1}\s?([^\n]+)/g, '<h1 class="text-3xl font-bold text-red-400">$1</h1>'],

    //bold, italics and paragraph rules
    [/\*\*\s?([^\n]+)\*\*/g, '<b>$1</b>'],
    [/\*\s?([^\n]+)\*/g, '<i>$1</i>'],
    [/__([^_]+)__/g, '<b>$1</b>'],
    [/_([^_`]+)_/g, '<i>$1</i>'],
    [/~([^~`]+)~/g, '<strike>$1</strike>'],
    [/([^\n]+\n?)/g, '<p>$1</p>'],

    //highlights
    [/(`)(\s?[^\n,]+\s?)(`)/g, '<a class="bg-gray-300 text-slate-900 rounded-md px-1">$2</a>'],

    //Lists, only * and + because - will mess every else
    [/([^\n]+)(\+)([^\n]+)/g, '<ul class="ml-6 list-disc"><li>$3</li></ul>'],
    [/([^\n]+)(\*)([^\n]+)/g, '<ul class="ml-6 list-disc"><li>$3</li></ul>'],

    //Image
    [/!\[([^\]]+)\]\(([^)]+)\s"([^")]+)"\)/g, '<img class="block w-full" src="$2" alt="$1" title="$3" />'],

    //links
    [/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-link underline decoration-dotted hover:decoration-solid">$1</a>'],
  ];

  // console.log(str);
  rules.forEach(([rule, template]) => {
    // console.log('the str belike: ', str);
    // console.log(`the rule belike: `, rule);
    // console.log(`the template belike: `, template);
    str = str.replace(rule, template);
  });
  // console.log(`final str belike: `, str);

  return str;
}
