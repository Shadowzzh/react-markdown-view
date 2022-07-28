import React from "react";

const Text = (props) => {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(props.node.value);
  React.useEffect(() => {
    setValue(props.node.value);
  }, [props.node.value]);

  if (editing) {
    return (
      <input
        autoFocus
        onBlur={() => {
          console.log("onBlur 1");
          setEditing(false);
          console.log("onBlur 2");
          // props.node.value = value;
          requestAnimationFrame(() => {
            console.log("onBlur 3");
            props.node.value = value;
            console.log("onBlur 4");
          });
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }

  console.log("render text");

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

const MarkdownViewMutable = ({ mdast }) => {
  return (
    <div className="markdown-body">
      {!!mdast && mdast.map((node, i) => renderNode(node, {}, [i]))}
    </div>
  );
};

export default MarkdownViewMutable;
