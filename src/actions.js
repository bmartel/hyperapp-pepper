import { Http } from "@martel/hyperapp-fx";
import { route, scrollTo } from "hyperapp-page-router";

const updatePage = (state, data) => ({
  ...state,
  page: {
    ...state.page,
    ...data,
  },
});

const apiUrl = (site = "hotukdeals.com") =>
  `https://pepper-proxy.netlify.app/.netlify/functions/api?site=${site}`;

const GetThreads = (state, site) => [
  updatePage(state, { site, loading: true }),
  [
    scrollTo(),
    Http({
      url: apiUrl(site),
      action: (prev, threads) =>
        updatePage(prev, {
          threads: threads.map(
            ({
              thread_id,
              temperature_rating,
              title,
              updated,
              short_uri,
              poster: { username },
            }) => ({
              thread_id,
              temperature_rating,
              title,
              updated,
              short_uri,
              poster: { username },
            })
          ),
          loading: false,
        }),
    }),
  ],
];

export const loadIndex = route("index", (state, context) =>
  GetThreads(state, context.params.site || "hotukdeals.com")
);

export const loadShow = route("show", (state, context) => {
  const item = { id: context.params.id, kids: [] };
  return [
    updatePage(state, {
      item,
    }),
    [scrollTo()],
  ];
});
