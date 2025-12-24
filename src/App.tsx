import { DiffFile, generateDiffFile } from "@git-diff-view/file";
import { DiffModeEnum, DiffView } from "@git-diff-view/react";
import hljs from "highlight.js";
import { useEffect, useState } from "react";

import "@git-diff-view/react/styles/diff-view-pure.css";

import Footer from "./components/footer";
import Header from "./components/header";
import ResultsHeader from "./components/results-header";
import Textarea from "./components/textarea";

function App() {
  const [originalText, setOriginalText] = useState("\n");
  const [modifiedText, setModifiedText] = useState("\n");
  const [diffFile, setDiffFile] = useState<DiffFile | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      async function updateDiff() {
        if (originalText === "" && modifiedText === "") {
          setDiffFile(null);
          return;
        }

        try {
          const detected = hljs.highlightAuto(modifiedText || originalText).language || "plaintext";

          const file = generateDiffFile("old_file", originalText, "new_file", modifiedText, detected, detected);

          file.initTheme("dark");

          if (originalText !== modifiedText) {
            file.init();
            file.buildUnifiedDiffLines();
            file.buildSplitDiffLines();
            setDiffFile(file);
          } else {
            setDiffFile(null);
          }
        } catch (err) {
          console.error("Diff generation failed:", err);
        }
      }

      updateDiff();
    }, 200);

    return () => clearTimeout(timer);
  }, [originalText, modifiedText]);
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6">
        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Textarea value={originalText} setValue={setOriginalText} label="Original Text" placeholder="Paste your original text here..." />
          <Textarea value={modifiedText} setValue={setModifiedText} label="Modified Text" placeholder="Paste your modified text here..." />
        </div>

        {diffFile && (
          <div className="overflow-hidden rounded-lg border border-zinc-800 shadow-sm">
            <ResultsHeader diffFile={diffFile} />
            <DiffView diffFile={diffFile} diffViewMode={DiffModeEnum.Unified} diffViewTheme="dark" diffViewHighlight diffViewWrap />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
