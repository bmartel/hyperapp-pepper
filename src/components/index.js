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
  <nav class="--flex-horizontal">
    <a href="/" class="logo item --flex-center --no-underline --bold">
      P
    </a>
    <a href="/" class="item --no-underline --bold">
      Pepper Deals
    </a>
    <ul class="--flex-horizontal item --extra-margin">
      <NavLink text="hotukdeals.com" />
      <NavLink text="mydealz.de" />
      <NavLink text="promodescuentos.com" />
      <NavLink text="pepper.pl" />
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
  const url = thread.short_uri || `/${site}/t/${thread.thread_id}`;
  return (
    <div class="thread">
      <a href={url} class="--no-underline">
        {thread.title}
      </a>
      {thread.short_uri && (
        <span class="--small">
          {" ( "}
          <a href={thread.short_uri} class="--light">
            {thread.short_uri}
          </a>
          {" )"}
        </span>
      )}
      <ul class="--flex-horizontal --light --block --small --unbreakable">
        <li>{thread.temperature_rating}°</li>
        <li>{thread.poster && <Poster poster={thread.poster} />}</li>
        <li>
          <a href={`/${site}/t/${thread.thread_id}`}>
            <FuzzyTime time={thread.updated} now={now} />
          </a>
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
        <div class="shadow --small" style={{ width: "22px" }}></div>
      </li>
      <li>
        <div class="shadow --small" style={{ width: "100px" }}></div>
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

export const Threads = ({ collection, loading, site, now }) => {
  console.log(loading);
  return (
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
};
