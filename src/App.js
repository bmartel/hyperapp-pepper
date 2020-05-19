import { h } from "hyperapp";
import { Navigation } from "./components";
import Index from "./IndexPage.js";
import Show from "./ShowPage.js";

const Views = {
  index: Index,
  show: Show,
};

const RouterView = ({ page, router }) => {
  if (router.current in Views) {
    const View = Views[router.current];
    return <View page={page} router={router} />;
  }
  return <div>Ooops ... Not Found</div>;
};

const theme = {
  "hotukdeals.com": {
    "--color-primary": "#6d8800",
    "--color-secondary": "#a61c00",
  },
  "promodescuentos.com": {
    "--color-primary": "#063565",
    "--color-secondary": "#98cf36",
  },
  "mydealz.de": {
    "--color-primary": "#003e6f",
    "--color-secondary": "#6ecd37",
  },
  "dealabs.com": {
    "--color-primary": "#1d1f20",
    "--color-secondary": "#36b7cd",
  },
};

const App = (state) => (
  <div class="wrapper" style={theme[state.page.site]}>
    <Navigation />
    <RouterView {...state} />
  </div>
);

export default App;
