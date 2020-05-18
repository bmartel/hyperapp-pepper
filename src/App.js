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

const App = (state) => (
  <div>
    <Navigation />
    <RouterView {...state} />
  </div>
);

export default App;
