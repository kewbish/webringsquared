const WEBRING_URLS = [
  "https://kewbi.sh/",
  "https://kevinliu.me/",
  "https://www.nilsand.re/",
  "https://dylaniskandar.com/",
  "https://aadibajpai.com/",
  "https://uzpg.me/",
  "https://pranavg.me/",
  "https://siraben.dev/",
  "https://sohamsen.me/",
  "https://aayushman.me/",
  "https://zerodawn0d.github.io/",
];

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Max-Age": "86400",
    },
  });
};

export const onRequest = async (context) => {
  const ipKey = context.params.ipkey;
  const queryParams = new URL(context.request.url).searchParams;
  if (queryParams.get("set") !== null) {
    let hasIndexToSet = Number.parseInt(queryParams.get("set"));
    if (Number.isNaN(hasIndexToSet)) {
      return new Response({ status: 400 });
    }
    hasIndexToSet %= WEBRING_URLS.length;
    await context.env.KV.put(ipKey, hasIndexToSet);
    return new Response({ status: 200 });
  }
  let index = await context.env.KV.get(ipKey);
  if (index === null) {
    index = 0;
  } else {
    index = Number.parseInt(index);
    if (Number.isNaN(index)) {
      return new Response({ status: 400 });
    }
    index =
      (((index + 1) % WEBRING_URLS.length) + WEBRING_URLS.length) %
      WEBRING_URLS.length;
  }
  await context.env.KV.put(ipKey, index);
  const url = WEBRING_URLS[index];
  var response = new Response(
    JSON.stringify({ url, index, urls: WEBRING_URLS })
  );
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
};
