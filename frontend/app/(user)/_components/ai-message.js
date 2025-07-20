import React from "react";
import Mermaid from "./mermaid";
import ShinyText from "../../../components/ui/shinyText";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import { useEffect, useRef } from "react";

const PreBlock = ({ children }) => {
  const codeElement = React.Children.only(children);
  const codeRef = useRef(null);
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [codeElement.props.children]);
  const language = codeElement.props.className
    ? codeElement.props.className.replace("language-", "")
    : "";
  return (
    <pre className="rounded-md bg-muted p-4 overflow-x-auto">
      <code ref={codeRef} className={`language-${language}`}>
        {codeElement.props.children}
      </code>
    </pre>
  );
};

const InlineCode = ({ className, children, ...props }) => (
  <code className={className} {...props}>
    {children}
  </code>
);

const AiMessage = ({ content }) => {
  if (
    !content ||
    typeof content !== "object" ||
    !Array.isArray(content.blocks)
  ) {
    return (
      <span>
        {typeof content === "string" ? content : JSON.stringify(content)}
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {content.blocks.map((block, idx) => {
        if (block.type === "explanation") {
          return (
            <div key={idx} className="bg-card rounded-md p-4">
              <div className="mb-1">
                <ShinyText
                  text={block.title}
                  className="font-semibold text-primary"
                />
              </div>
              <div className="text-foreground">
                <ReactMarkdown
                  components={{
                    pre: PreBlock,
                    code: InlineCode,
                  }}
                >
                  {block.content}
                </ReactMarkdown>
              </div>
            </div>
          );
        } else if (block.type === "diagram") {
          return (
            <div
              key={idx}
              className="bg-card rounded-md p-4 flex flex-col items-center"
            >
              {block.content && (
                <div className="w-full flex justify-center">
                  <Mermaid chart={block.content} />
                </div>
              )}
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default AiMessage;
