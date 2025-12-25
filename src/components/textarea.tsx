import { forwardRef, useRef, useState } from "react";

interface Props {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function Textarea({ id, label, placeholder, value, setValue }: Props) {
  const [isCopying, setIsCopying] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }

  function handleClear() {
    setIsClearing(true);
    setValue("");

    setTimeout(() => {
      setIsClearing(false);
    }, 2000);
  }

  async function handleCopyToClipboard() {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    } finally {
      setTimeout(() => {
        setIsCopying(false);
      }, 2000);
    }
  }

  return (
    <div className="flex-1 overflow-hidden rounded-lg border border-zinc-800 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-900 py-3 pr-2 pl-4">
        <h3 className="flex items-center gap-3 font-semibold">
          <svg
            className="size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
            <path d="M14 2v5a1 1 0 0 0 1 1h5" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
          {label}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">{value.split("\n").length} lines</span>
          <div className="flex gap-1">
            <button type="button" onClick={handleClear} className="group rounded p-1.5 transition-colors enabled:cursor-pointer enabled:hover:bg-zinc-600" disabled={!value} title="Clear textarea">
              {isClearing ? (
                <svg
                  className="text-red-600 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg
                  className="size-3.5 text-zinc-300 group-disabled:text-zinc-600 enabled:group-hover:text-zinc-100"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 16h5v5" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="group rounded p-1.5 transition-colors enabled:cursor-pointer enabled:hover:bg-zinc-600"
              disabled={!value}
              title="Copy to clipboard">
              {isCopying ? (
                <svg
                  className="size-3.5 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  className="size-3.5 text-zinc-300 group-disabled:text-zinc-600 enabled:group-hover:text-zinc-100"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="scrollbar relative flex h-80">
        <LineNumbers ref={lineNumbersRef} content={value || ""} />
        <textarea
          id={id}
          name={id}
          ref={textareaRef}
          value={value}
          placeholder={placeholder}
          spellCheck={false}
          className="absolute top-0 right-0 bottom-0 left-14 z-10 resize-none bg-zinc-800 py-3 pr-5 pl-3 font-mono text-sm leading-6 outline-none"
          onChange={(e) => setValue(e.target.value)}
          onScroll={handleScroll}
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
}

const LineNumbers = forwardRef<HTMLDivElement, { content: string }>(({ content }, ref) => {
  const lines = content.split("\n");
  return (
    <div ref={ref} className="h-80 overflow-hidden bg-zinc-800 py-3">
      {lines.map((line, index) => (
        <div key={index} className="flex pr-5">
          <span className="inline-block w-14 border-r border-zinc-700 px-3 text-right font-mono text-sm leading-6 text-zinc-400">{index + 1}</span>
          <span className="pointer-events-none -z-10 inline-block w-full pl-3 font-mono text-sm leading-6 opacity-0 select-none">{line || "\u00A0"}</span>
        </div>
      ))}
    </div>
  );
});
