import React from "react";
import { action, runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";

const Text = (props) => {
  console.log("props", props);

  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(props.node.value);
  React.useEffect(() => {
    setValue(props.node.value);
  }, [props.node.value]);

  console.log("render Text", props.paths);

  if (editing) {
    return (
      <input
        autoFocus
        onBlur={() => {
          // setEditing(false);
          requestAnimationFrame(() => {
            runInAction(() => {
              // props.node.xxxxx = value;
              props.node.value = value;
            });
          });
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }

  return <span onClick={() => setEditing(true)}>{props.node.value}</span>;
};

const renderers = {
  heading: (props) => {
    const { depth } = props.node;
    const tagName = `h${depth}`;
    return React.createElement(tagName, {}, props.children);
  },
  paragraph: (props) => <p>{props.children}</p>,
  blockquote: (props) => <blockquote>{props.children}</blockquote>,
  text: Text
};

const Node = observer(({ Component, ...props }) => {
  console.log("render Node", props.paths);
  return <Component {...props} />;
});

for (const [key, comp] of Object.entries(renderers)) {
  const View = observer(comp);
  renderers[key] = (props) => <Node Component={View} {...props} />;
}

const renderNode = (node, props, paths) => {
  const Comp = renderers[node.type];

  return (
    <Comp {...props} key={paths.join(".")} paths={paths} node={node}>
      {(node.children || []).map((childNode, index) =>
        renderNode(
          childNode,
          { ...props, parentPaths: paths },
          paths.concat(index)
        )
      )}
    </Comp>
  );
};

const MarkdownViewEditable = ({ mdast }) => {
  const mdastStore = useLocalObservable(() => mdast);
  console.log("mdastStore", mdastStore);

  return (
    <div className="markdown-body">
      {!!mdastStore &&
        mdastStore.map((node, i) =>
          renderNode(
            node,
            {
              mdast: mdastStore
            },
            [i]
          )
        )}
    </div>
  );
};

export default MarkdownViewEditable;
