import { DiffFile, generateDiffFile } from "@git-diff-view/file";
import { DiffModeEnum, DiffView } from "@git-diff-view/react";
import { useEffect, useState } from "react";

import "@git-diff-view/react/styles/diff-view-pure.css";

import Footer from "./components/footer";
import Header from "./components/header";
import LanguageDropdown from "./components/language-dropdown";
import ResultsHeader from "./components/results-header";
import Textarea from "./components/textarea";
import { languages } from "./utils/languages";

function App() {
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("plaintext");
  const [liveUpdates, setLiveUpdates] = useState(false);
  const [diffFile, setDiffFile] = useState<DiffFile | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateDiff();
  }

  function updateDiff() {
    if (originalText === "" && modifiedText === "") {
      setDiffFile(null);
      return;
    }

    if (diffFile && diffFile._oldFileContent === diffFile._newFileContent) return;

    const oldFileName = `old_file.${languages[selectedLanguage].extension}`;
    const newFileName = `new_file.${languages[selectedLanguage].extension}`;
    const oldFileContent = originalText || "\n";
    const newFileContent = modifiedText || "\n";

    const _file = generateDiffFile(oldFileName, oldFileContent, newFileName, newFileContent, selectedLanguage, selectedLanguage);

    const instance = DiffFile.createInstance({
      oldFile: { content: oldFileContent, fileName: oldFileName },
      newFile: { content: newFileContent, fileName: newFileName },
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
  }

  useEffect(() => {
    if (!liveUpdates) return;

    updateDiff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveUpdates, modifiedText, originalText]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <form onSubmit={handleSubmit}>
            <div className="w-fit ml-auto mb-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={liveUpdates} onChange={(e) => setLiveUpdates(e.target.checked)} />
                  <span className="text-sm">Live updates</span>
                </label>
                <LanguageDropdown selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Textarea id="orignal-text" value={originalText} setValue={setOriginalText} label="Original Text" placeholder="Paste your original text here..." />
              <Textarea id="modified-text" value={modifiedText} setValue={setModifiedText} label="Modified Text" placeholder="Paste your modified text here..." />
            </div>
            <button
              type="submit"
              disabled={!originalText || !modifiedText}
              className="w-full md:w-auto cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:bg-neutral-900 hover:text-zinc-100 border-white/20 hover:border-white/10 h-10 rounded-md px-6 has-[>svg]:px-4">
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
