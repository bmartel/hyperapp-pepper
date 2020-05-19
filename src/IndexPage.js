import { h } from "hyperapp";

import { Threads } from "./components";

const emptyThreads = (num = 20) =>
  Array(num).fill({
    thread_id: null,
  });

export default ({ page }) => (
  <Threads
    site={page.site}
    loading={page.loading}
    now={page.now || null}
    collection={page.threads || emptyThreads()}
  />
);
