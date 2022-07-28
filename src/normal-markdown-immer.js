import React from "react";
import produce from "immer";
import set from "lodash.set";
import pick from "lodash.pick";
import shallowequal from "shallowequal";

const Text = React.memo((props) => {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(props.node.value);
  React.useEffect(() => {
    setValue(props.node.value);
  }, [props.node.value]);

  // console.log("render", props.paths);

  if (editing) {
    return (
      <input
        autoFocus
        onBlur={() => {
          setEditing(false);
          requestAnimationFrame(() => {
            props.setMDAst((mdast) =>
              produce(mdast, (mdast) => {
                set(mdast, props.paths.join(".children."), {
                  ...props.node,
                  value
                });
              })
            );
          });
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }

  return <span onClick={() => setEditing(true)}>{props.node.value}</span>;
});

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

const Node = React.memo(
  ({ Component, ...props }) => {
    console.log("render", props.paths, props.node);
    return <Component {...props} />;
  },
  (a, b) => {
    const getData = (x) => {
      const obj = pick(x, ["node", "paths"]);
      obj.paths = obj.paths.join(".");
      return obj;
    };
    return shallowequal(getData(a), getData(b));
  }
);

for (const [key, comp] of Object.entries(renderers)) {
  const View = comp;
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
  const [mdastState, setMDAst] = React.useState(mdast);

  return (
    <div className="markdown-body">
      {!!mdastState &&
        mdastState.map((node, i) =>
          renderNode(
            node,
            {
              setMDAst
            },
            [i]
          )
        )}
    </div>
  );
};

export default MarkdownViewEditable;
