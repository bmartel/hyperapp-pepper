import { h } from "hyperapp";

import { ThreadComponent, Comments } from "./components";

export default ({ page }) => (
  <div class="threadView">
    <ThreadComponent
      site={page.site}
      thread={page.thread}
      now={page.now || null}
    />

    <Comments {...page.comments} now={page.now || null} />
  </div>
);

