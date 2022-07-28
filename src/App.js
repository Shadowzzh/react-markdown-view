import React from "react";
import "./styles.css";
import MarkdownViewView from "./normal-markdown-view";
import MarkdownViewMutable from "./normal-markdown-mutable";
import MarkdownViewImmer from "./normal-markdown-immer";
import MarkdownViewMobx from "./normal-markdown-mobx";

import mdast from "./mdast";

const config = {
  view: MarkdownViewView,
  mutable: MarkdownViewMutable,
  immutable: MarkdownViewImmer,
  "mutable-mobx": MarkdownViewMobx
};

export default function App() {
  const [type, setType] = React.useState("view");
  const View = config[type];
  return (
    <>
      <h1>高性能 React 组件</h1>
      <small>点击切换渲染组件，点击文字，进入编辑模式，修改节点</small>
      <ul>
        {Object.keys(config).map((name) => (
          <li
            className={`li-item ${name === type ? "active" : ""}`}
            key={name}
            onClick={() => setType(name)}
          >
            {name}
          </li>
        ))}
      </ul>
      <View mdast={mdast} />
    </>
  );
}
