import * as React from "react";
import Search from "./components/Search";
import Result from "./components/Result";
import { BrowserRouter as Router, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={Search} />
        <Route path="/:postcode/:huisnr" component={Result} />
        <Route path="/:postcode/:huisnr/:toevoeging" component={Result} />
      </div>
    </Router>
  );
}
