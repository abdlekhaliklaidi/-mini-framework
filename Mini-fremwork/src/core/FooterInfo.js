import { createElement } from './framework.js';

export function FooterInfo() {
  return createElement(
    "footer",
    { class: "info" },
    [
      createElement("p", {}, ["Created by the Mini Framework"]),
      createElement(
        "p",
        {},
        [
          "Part of ",
          createElement("a", { href: "http://todomvc.com" }, ["TodoMVC"])
        ]
      )
    ]
  );
}
