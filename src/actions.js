import { Http } from "@martel/hyperapp-fx";
import { route, scrollTo } from "hyperapp-page-router";

const defaultSite = "hotukdeals.com";

const apiUrl = (site = "hotukdeals.com", resource = "thread") =>
  `https://pepper-proxy.netlify.app/.netlify/functions/api?site=${site}&resource=${resource}`;

export const pipeAction = (...actions) => (...params) =>
  actions.reduce(
    (result, action) => {
      const [state, fx] = result;
      const [nextState, currentFx] = action(state, ...params.slice(1));
      if (currentFx) {
        fx.push(currentFx);
      }
      return [nextState, fx];
    },
    [params[0], []]
  );

const updatePage = (state, data) => ({
  ...state,
  page: {
    ...state.page,
    ...data,
  },
});

const updateComments = (state, comments) => updatePage(state, { comments });

const hasThread = (state, site = defaultSite, threadId) =>
  state.page.thread &&
  state.page.thread.thread_id === parseInt(threadId) &&
  state.page.thread.site === site;

const reuseThread = (state, site, threadId) => {
  threadId = parseInt(threadId);
  const thread =
    state.page.site === site &&
    state.page.threads &&
    state.page.threads.find((t) => t.thread_id === threadId);
  return updatePage(state, { thread: thread || {}, site, loading: !thread });
};

const extractThread = (site) => ({
  thread_id,
  temperature_rating,
  title,
  updated,
  submitted,
  expired,
  status,
  local,
  last_commented,
  comment_count,
  group_count,
  main_group: { name: group_name, group_id },
  top_comment_count,
  price,
  price_display,
  short_uri,
  poster: { username },
}) => ({
  site,
  thread_id,
  temperature_rating,
  title,
  updated,
  submitted,
  expired,
  status,
  local,
  last_commented,
  comment_count,
  group_count,
  main_group: { name: group_name, group_id },
  top_comment_count,
  price,
  price_display,
  short_uri,
  poster: { username },
});

const GetThreadList = (state, site = defaultSite) => [
  updatePage(state, { site, loading: true }),
  [
    scrollTo(),
    Http({
      url: apiUrl(site),
      action: (prev, threads) =>
        updatePage(prev, {
          threads: threads.map(extractThread(site)),
          loading: false,
        }),
    }),
  ],
];

const GetThread = (state, site = defaultSite, threadId) => {
  const next = reuseThread(state, site, threadId);
  if (hasThread(next, site, threadId)) {
    return [next];
  }

  return [
    next,
    [
      scrollTo(),
      Http({
        url: apiUrl(site, `thread/${threadId}`),
        action: (prev, thread) =>
          updatePage(prev, {
            thread: extractThread(site)(thread),
            loading: false,
          }),
      }),
    ],
  ];
};

const GetComments = (state, site = defaultSite, threadId, after = null) => [
  updateComments(state, { items: [], loading: true }),
  [
    Http({
      url: apiUrl(
        site,
        `thread/${threadId}/comments${after ? `&after={after}` : ""}`
      ),
      action: (prev, comments) =>
        updateComments(prev, { items: comments, loading: false }),
    }),
  ],
];

const GetThreadWithComments = pipeAction(GetThread, GetComments);

export const loadIndex = route("index", (state, context) =>
  GetThreadList(state, context.params.site)
);

export const loadShow = route("show", (state, context) => {
  const { site, id } = context.params;
  return GetThreadWithComments(state, site, id);
});
