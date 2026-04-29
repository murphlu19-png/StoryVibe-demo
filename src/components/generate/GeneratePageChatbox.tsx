import { MockComposerShell } from '@/components/shared/MockComposerShell';

type GeneratePageChatboxProps = {
  resetKey: string;
  autoFocusSignal: number;
  mentionAssets: Array<{
    id: string;
    name: string;
    role?: string;
    thumbnail?: string;
  }>;
  selectedContextTitle?: string | null;
  onSubmit: (input: string, attachedAssets: File[]) => void;
};

export function GeneratePageChatbox({
  resetKey,
  autoFocusSignal,
  mentionAssets,
  selectedContextTitle,
  onSubmit,
}: GeneratePageChatboxProps) {
  const placeholder = selectedContextTitle
    ? 'Ask to revise, extend, or generate from this selected history...'
    : 'Describe your video idea, attach references, or continue from a previous generation...';

  const footerNote = selectedContextTitle
    ? `Continuing from ${selectedContextTitle}. Classifier routing stays local to the mock demo.`
    : 'Start a new script from Generate without returning to Home. All routing stays local to the mock demo.';

  return (
    <div className="rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(18,18,19,0.96)_0%,rgba(14,14,15,0.98)_100%)] p-2 shadow-[0_-10px_40px_rgba(0,0,0,0.28)] backdrop-blur-sm">
      <MockComposerShell
        mentionAssets={mentionAssets}
        resetKey={resetKey}
        placeholder={placeholder}
        footerNote={footerNote}
        ctaLabel="Generate Script"
        autoFocusSignal={autoFocusSignal}
        mentionDisplayMode="compact"
        disableMentionWhenEmpty
        onCta={(input, context) => onSubmit(input, context.attachedAssets)}
      />
    </div>
  );
}
