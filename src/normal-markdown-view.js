import React from "react";

const renderers = {
  heading: (props) => {
    const { depth } = props.node;
    const tagName = `h${depth}`;
    return React.createElement(tagName, {}, props.children);
  },
  paragraph: (props) => <p>{props.children}</p>,
  blockquote: (props) => <blockquote>{props.children}</blockquote>,
  text: (props) => <span>{props.node.value}</span>
};

const renderNode = (node, props) => {
  const Comp = renderers[node.type];
  return (
    <Comp {...props} node={node}>
      {(node.children || []).map((childNode, index) =>
        renderNode(childNode, { parent: node, key: index })
      )}
    </Comp>
  );
};

const MarkdownView = ({ mdast }) => {
  return (
    <div className="markdown-body">
      {!!mdast && mdast.map((node, i) => renderNode(node, { key: i }))}
    </div>
  );
};

export default MarkdownView;
