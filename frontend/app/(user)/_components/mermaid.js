import React from "react";
import mermaid from "mermaid";
import { Maximize2 } from "lucide-react";
import { useTheme } from "next-themes";

function MermaidWrapper({ chart }) {
  const { resolvedTheme } = useTheme();
  const diagramRef = React.useRef();

  React.useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: resolvedTheme === "dark" ? "dark" : "neutral",
      securityLevel: "loose",
      fontFamily: "Fira Code",
    });

    mermaid.contentLoaded();
  }, [chart, resolvedTheme]);

  const handleFullscreen = () => {
    if (diagramRef.current) {
      const diagram = diagramRef.current;

      if (diagram.requestFullscreen) {
        diagram.requestFullscreen();
      } else if (diagram.webkitRequestFullscreen) {
        diagram.webkitRequestFullscreen();
      } else if (diagram.msRequestFullscreen) {
        diagram.msRequestFullscreen();
      }

      // Add fullscreen styles
      diagram.style.background = "var(--background)";
      diagram.style.display = "flex";
      diagram.style.alignItems = "center";
      diagram.style.justifyContent = "center";
      diagram.style.minHeight = "100vh";
      diagram.style.width = "100vw";
      diagram.style.padding = "2rem";

      // Handle fullscreen change
      const handleFullscreenChange = () => {
        if (
          !document.fullscreenElement &&
          !document.webkitFullscreenElement &&
          !document.msFullscreenElement
        ) {
          // Reset styles when exiting fullscreen
          diagram.style.background = "";
          diagram.style.display = "";
          diagram.style.alignItems = "";
          diagram.style.justifyContent = "";
          diagram.style.minHeight = "";
          diagram.style.width = "";
          diagram.style.padding = "";

          // Remove event listener
          document.removeEventListener(
            "fullscreenchange",
            handleFullscreenChange
          );
          document.removeEventListener(
            "webkitfullscreenchange",
            handleFullscreenChange
          );
          document.removeEventListener(
            "msfullscreenchange",
            handleFullscreenChange
          );
        }
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.addEventListener("msfullscreenchange", handleFullscreenChange);
    }
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <button
        className="absolute top-2 right-2 z-10 bg-card border border-border rounded p-1 text-muted-foreground hover:bg-accent/50"
        onClick={handleFullscreen}
        title="View Fullscreen"
      >
        <Maximize2 size={18} />
      </button>
      <div ref={diagramRef} className="mermaid text-lg">
        {chart}
      </div>
    </div>
  );
}

export default MermaidWrapper;
