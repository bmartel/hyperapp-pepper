import { h, Lazy } from "hyperapp";

const getFuzzyTime = (unixTime, msNow) => {
  const diff = msNow - unixTime * 1000;
  const increments = [
    { word: "year(s)", incr: 1000 * 60 * 60 * 24 * 365 },
    { word: "month(s)", incr: 1000 * 60 * 60 * 24 * 30 },
    { word: "day(s)", incr: 1000 * 60 * 60 * 24 },
    { word: "hour(s)", incr: 1000 * 60 * 60 },
    { word: "minute(s)", incr: 1000 * 60 },
  ];
  const increment = increments.find((i) => diff >= i.incr);

  return increment
    ? `${Math.floor(diff / increment.incr)} ${increment.word} ago`
    : "Just now";
};

export const FuzzyTime = ({ time, dateNow = Date.now() }) => {
  try {
    return h(
      "span",
      { title: new Date(time * 1000).toISOString() },
      getFuzzyTime(time, dateNow)
    );
  } catch (err) {
    console.log("FuzzyTime Error", { time }, err);
    return null;
  }
};

export const NavLink = ({ text, url }) => (
  <li>
    <a href={`/${url || text}`} class="--link">
      {text}
    </a>
  </li>
);

export const Navigation = () => (
  <nav class="--flex-horizontal --flex-wrap">
    <a href="/" class="logo item --flex-center --no-underline --bold">
      P
    </a>
    <a href="/" class="item brand --no-underline --bold">
      Pepper Deals
    </a>
    <ul class="--flex-horizontal --flex-wrap item --extra-margin">
      <NavLink text="hotukdeals.com" />
      <NavLink text="mydealz.de" />
      <NavLink text="promodescuentos.com" />
      <NavLink text="pepper.pl" />
      <NavLink text="nl.pepper.com" />
      <NavLink text="preisjaeger.at" />
      <NavLink text="pelando.com.br" />
    </ul>
  </nav>
);

const Poster = ({ poster }) => (
  <span>
    by <a href="#">{poster.username}</a>{" "}
  </span>
);

export const ThreadData = ({ site, thread, now }) => {
  const url = thread.short_uri;
  const internalUrl = `/${site}/t/${thread.thread_id}`;
  return (
    <div class="thread">
      <a href={url} class="--no-underline">
        {thread.title}
      </a>
      {url && (
        <span class="--small">
          {" ( "}
          <a href={url} class="--light">
            {url}
          </a>
          {" )"}
        </span>
      )}
      <ul class="--flex-horizontal --light --block --small --unbreakable">
        <li>
          {thread.temperature_rating}
          {"°  "}
          {thread.poster && <Poster poster={thread.poster} />}
          {"  "}
          <a href={internalUrl}>
            <FuzzyTime time={thread.updated} now={now} />
          </a>
        </li>
        <li>
          <a href={internalUrl}>{thread.comment_count} comments</a>
        </li>
      </ul>
    </div>
  );
};

export const ThreadShadow = () => (
  <div class="thread">
    <div class="shadow" style={{ width: "60%" }}></div>{" "}
    <div
      class="shadow --small"
      style={{
        width: "20%",
        borderRadius: "5px",
        borderLeft: "1px black solid",
        borderRight: "1px black solid",
      }}
    ></div>
    <ul class="--flex-horizontal --light --block --small --unbreakable">
      <li>
        <div class="shadow --small" style={{ width: "30px" }}></div>
        <div class="shadow --small" style={{ width: "100px" }}></div>
        <div class="shadow --small" style={{ width: "60px" }}></div>
      </li>
      <li>
        <div class="shadow --small" style={{ width: "100px" }}></div>
      </li>
    </ul>
  </div>
);

export const Thread = ({ thread, site, now }) => {
  return thread.thread_id ? (
    <ThreadData thread={thread} site={site} now={now} />
  ) : (
    <ThreadShadow />
  );
};

export const ThreadComponent = ({ thread, site, now }) => (
  <Thread thread={thread} site={site} now={now} />
);

export const LazyThread = ({ thread, site, now }) => {
  return <Lazy view={ThreadComponent} site={site} thread={thread} now={now} />;
};
export const Spinner = () => <div class="spinner" />;

export const Threads = ({ collection, loading, site, now }) => (
  <div>
    <h1 class="content">
      {site.charAt(0).toUpperCase() + site.slice(1)} threads{" "}
      {loading && <Spinner />}
    </h1>
    <ol>
      {collection.map((thread, index) => (
        <li key={index}>
          <LazyThread thread={thread} site={site} now={now} />
        </li>
      ))}
    </ol>
  </div>
);
const emojis = {
  happy: "",
  sad: "", // todo!
};
export const Comments = ({ items, loading, site, now }) => (
  <div>
    {items.map((comment, index) => (
      <div key={index} class="comment">
        <span class="attribution --small --light">
          {comment.poster.username}
          <a class="author-link" href={comment.permalink}>
            <FuzzyTime time={comment.posted} now={now} />
          </a>
        </span>
        {comment.content.map((content) => {
          switch (content._type) {
            case "string":
              return content.content
                .split("<br />")
                .map((c) => <span>{c}</span>);
            case "smiley":
              return emojis[content.name] || null;
            case "image":
              return <img src={content.uri} />;
            default:
              return null;
          }
        })}
      </div>
    ))}
  </div>
);
