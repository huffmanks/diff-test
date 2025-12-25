import { DiffFile, generateDiffFile } from "@git-diff-view/file";
import { DiffModeEnum, DiffView } from "@git-diff-view/react";
import hljs from "highlight.js";
import { useState } from "react";

import "@git-diff-view/react/styles/diff-view-pure.css";

import Footer from "./components/footer";
import Header from "./components/header";
import ResultsHeader from "./components/results-header";
import Textarea from "./components/textarea";

function App() {
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [diffFile, setDiffFile] = useState<DiffFile | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (originalText === "" && modifiedText === "") {
      setDiffFile(null);
      return;
    }

    try {
      const detected = hljs.highlightAuto(modifiedText || originalText).language || "typescript";

      const original = originalText || "\n";
      const modified = modifiedText || "\n";

      const _file = generateDiffFile("original_file.ts", original, "modified_file.ts", modified, detected, detected);

      const instance = DiffFile.createInstance({
        oldFile: { content: original, fileName: "original_file.ts" },
        newFile: { content: modified, fileName: "modified_file.ts" },
        hunks: _file._diffList,
      });

      instance.initTheme("dark");

      if (originalText !== modifiedText) {
        instance.initRaw();

        instance.buildUnifiedDiffLines();
        setDiffFile(instance);
      } else {
        setDiffFile(null);
      }
    } catch (err) {
      console.error("Diff generation failed:", err);
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Textarea id="orignal-text" value={originalText} setValue={setOriginalText} label="Original Text" placeholder="Paste your original text here..." />
              <Textarea id="modified-text" value={modifiedText} setValue={setModifiedText} label="Modified Text" placeholder="Paste your modified text here..." />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full md:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:bg-neutral-900 hover:text-zinc-100 border-white/20 hover:border-white/10 h-10 rounded-md px-6 has-[>svg]:px-4">
              Compare
            </button>
          </form>
        </div>

        {diffFile && (
          <div className="overflow-hidden rounded-lg border border-zinc-800 shadow-sm">
            <ResultsHeader diffFile={diffFile} />
            <DiffView diffFile={diffFile} diffViewMode={DiffModeEnum.Unified} diffViewWrap />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
