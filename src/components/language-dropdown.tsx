import { languageOptions } from "../utils/languages";

interface LanguageDropdownProps {
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
}

export default function LanguageDropdown({ selectedLanguage, setSelectedLanguage }: LanguageDropdownProps) {
  function handleSelect(value: string) {
    setSelectedLanguage(value);

    const popover = document.getElementById("language-dropdown");
    popover?.hidePopover();
  }

  const selectedLanguageLabel = languageOptions.find((opt) => opt.value === selectedLanguage)?.label;

  return (
    <>
      <button
        id="language-dropdown-btn-show"
        type="button"
        className="cursor-pointer inline-flex items-center justify-between gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:bg-neutral-900 hover:text-zinc-100 border-white/20 hover:border-white/10 h-10 w-36 rounded-md px-6 has-[>svg]:pl-3 has-[>svg]:pr-2"
        popoverTarget="language-dropdown"
        popoverTargetAction="show"
        aria-label="Open mobile menu"
        aria-controls="language-dropdown"
        aria-haspopup="listbox">
        <span>{selectedLanguageLabel}</span>
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <nav id="language-dropdown" popover="" className="w-36 h-48 overflow-y-auto rounded-md border border-neutral-800 bg-neutral-900">
        <div className="popover-menu relative">
          <div role="listbox" className="flex flex-col gap-1 py-1">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                role="option"
                type="button"
                aria-selected={selectedLanguage === option.value}
                className={`text-left px-2 py-1 cursor-pointer text-zinc-50 rounded-md transition-colors ${selectedLanguage === option.value ? "bg-neutral-700 text-white" : "hover:bg-neutral-700"}`}
                onClick={() => handleSelect(option.value)}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
