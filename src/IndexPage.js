import { h } from "hyperapp";

import { Threads } from "./components";

const emptyThreads = (num = 20) =>
  Array(num).fill({
    thread_id: null,
    temperature_rating: null,
    title: null,
    updated: null,
    short_uri: null,
    poster: null,
  });

export default ({ page }) => {
  const collection = page.threads || emptyThreads();
  console.log(page);
  return (
    <Threads
      site={page.site}
      loading={page.loading}
      now={page.now || null}
      collection={collection}
    />
  );
};
