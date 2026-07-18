import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface Props {
  words: string[];
  typed: string[];
  wordIdx: number;
  finished: boolean;
}

export function TypingArea({ words, typed, wordIdx, finished }: Props) {
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  // Scroll active line into view
  useLayoutEffect(() => {
    if (!activeWordRef.current || !containerRef.current) return;
    const wordTop = activeWordRef.current.offsetTop;
    const offset = window.innerWidth < 640 ? 40 : 60;
    containerRef.current.style.transform = `translateY(-${Math.max(0, wordTop - offset)}px)`;
  }, [wordIdx, words]);

  useLayoutEffect(() => {
    if (!caretRef.current || !activeCharRef.current || !containerRef.current) return;
    const charRect = activeCharRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    caretRef.current.style.transform = `translate(${charRect.left - containerRect.left}px, ${charRect.top - containerRect.top}px)`;
    caretRef.current.style.height = `${charRect.height}px`;
    caretRef.current.style.opacity = "1";
  }, [typed, wordIdx, words, ready]);

  if (!ready || words.length === 0) {
    return <div className="h-[100px] sm:h-[130px] md:h-[150px] lg:h-[180px]" aria-hidden />;
  }

  return (
    <div className="relative h-[100px] sm:h-[130px] md:h-[150px] lg:h-[180px] overflow-hidden font-mono text-lg sm:text-xl md:text-2xl lg:text-3xl leading-[1.6] tracking-wide select-none">
      <div ref={containerRef} className="relative transition-transform duration-200 ease-out">
        <div
          ref={caretRef}
          className="absolute left-0 top-0 w-[2px] sm:w-[3px] bg-primary rounded-sm caret-blink pointer-events-none z-10 opacity-0"
          style={{ boxShadow: "0 0 12px var(--caret)", transition: "transform 90ms ease-out, height 90ms ease-out" }}
        />
        <div className="flex flex-wrap gap-x-[0.4em] sm:gap-x-[0.5em] md:gap-x-[0.6em] gap-y-1 sm:gap-y-2">
          {words.map((word, wi) => {
            const t = typed[wi] ?? "";
            const isActive = wi === wordIdx;
            const isPast = wi < wordIdx;
            return (
              <span key={wi} ref={isActive ? activeWordRef : undefined} className="inline-flex">
                {word.split("").map((ch, ci) => {
                  const typedCh = t[ci];
                  let cls = "text-text-untyped";
                  if (typedCh !== undefined) {
                    cls = typedCh === ch
                      ? "text-text-typed"
                      : "text-text-error rounded-sm";
                  } else if (isPast) {
                    // skipped char
                    cls = "text-text-error/60 bg-[var(--text-error-bg)] rounded-sm";
                  }
                  const isCaretHere = isActive && ci === t.length;
                  return (
                    <span key={ci} ref={isCaretHere ? activeCharRef : undefined} className={cls}>
                      {ch}
                    </span>
                  );
                })}
                {/* extra typed chars beyond word length */}
                {t.length > word.length && t.slice(word.length).split("").map((ch, ei) => (
                  <span key={`e${ei}`} className="text-text-error/80 bg-[var(--text-error-bg)] rounded-sm">
                    {ch}
                  </span>
                ))}
                {/* caret anchor when at/beyond end of word */}
                {isActive && t.length >= word.length && (
                  <span ref={activeCharRef} className="inline-block w-[1px]">&#8203;</span>
                )}
              </span>
            );
          })}
        </div>
      </div>
      {finished && <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />}
    </div>
  );
}