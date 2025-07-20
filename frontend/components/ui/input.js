"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "motion/react";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  const radius = 100;
  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = React.useState(props.value || "");
  const textareaRef = React.useRef();

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
      radial-gradient(
        ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
        var(--primary),
        transparent 80%
      )
    `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="group/input flex-grow w-full rounded-lg p-[2px] transition duration-300"
    >
      <textarea
        ref={(el) => {
          textareaRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        className={cn(
          `shadow-input flex min-h-[44px] w-full rounded-md border border-foreground/30 bg-card px-3 py-2 text-sm text-foreground transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none`,
          className
        )}
        rows={1}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (props.onChange) props.onChange(e);
        }}
        {...props}
      />
    </motion.div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
