import { useCallback, useEffect, useRef, useState } from 'react';

type FlowChatboxDockProps = {
  children: (bindings: {
    onInputFocusChange: (isFocused: boolean) => void;
    onPopoverStateChange: (isOpen: boolean) => void;
    onInteractionLockChange: (isLocked: boolean) => void;
  }) => React.ReactNode;
  handleLabel?: string;
  hideDelayMs?: number;
};

export function FlowChatboxDock({
  children,
  handleLabel = 'Ask / Add context',
  hideDelayMs = 420,
}: FlowChatboxDockProps) {
  const hideTimerRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [hasInputFocus, setHasInputFocus] = useState(false);
  const [hasPopoverOpen, setHasPopoverOpen] = useState(false);
  const [hasInteractionLock, setHasInteractionLock] = useState(false);
  const [isTouchMode, setIsTouchMode] = useState(false);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const showDock = useCallback(() => {
    clearHideTimer();
    setIsVisible(true);
  }, [clearHideTimer]);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    if (hasInputFocus || hasPopoverOpen || hasInteractionLock || isPointerInside) return;
    hideTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, hideDelayMs);
  }, [clearHideTimer, hasInputFocus, hasPopoverOpen, hasInteractionLock, hideDelayMs, isPointerInside]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    const updateTouchMode = () => setIsTouchMode(mediaQuery.matches);

    updateTouchMode();
    mediaQuery.addEventListener?.('change', updateTouchMode);

    return () => mediaQuery.removeEventListener?.('change', updateTouchMode);
  }, []);

  useEffect(() => {
    if (isTouchMode) return undefined;

    const handleMouseMove = (event: MouseEvent) => {
      if (window.innerHeight - event.clientY <= 56) {
        showDock();
      } else if (!isPointerInside && !hasInputFocus && !hasPopoverOpen && !hasInteractionLock) {
        scheduleHide();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasInputFocus, hasPopoverOpen, hasInteractionLock, isPointerInside, isTouchMode, scheduleHide, showDock]);

  useEffect(() => {
    if (hasInputFocus || hasPopoverOpen || hasInteractionLock || isPointerInside) {
      showDock();
      return;
    }

    if (isVisible) {
      scheduleHide();
    }
  }, [hasInputFocus, hasPopoverOpen, hasInteractionLock, isPointerInside, isVisible, scheduleHide, showDock]);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 md:px-6">
        <button
          type="button"
          onMouseEnter={showDock}
          onFocus={showDock}
          onClick={() => setIsVisible((prev) => !prev)}
          className="pointer-events-auto mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(15,15,16,0.82)] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#8E8E93] shadow-[0_10px_28px_rgba(0,0,0,0.32)] backdrop-blur-md transition-all hover:border-[rgba(255,132,61,0.38)] hover:text-[#FFFFFF]"
        >
          <span className="h-[3px] w-8 rounded-full bg-[#5E5E63]" />
          <span className="hidden sm:inline">{handleLabel}</span>
        </button>
      </div>

      {/* Bottom activation zone */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 h-14"
        onMouseEnter={showDock}
        onMouseLeave={scheduleHide}
      />

      <div
        className={`pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-3 md:px-6 transition-all duration-200 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[78%] opacity-0'
        }`}
      >
        <div
          className="pointer-events-auto w-full max-w-[1100px]"
          onMouseEnter={() => {
            setIsPointerInside(true);
            showDock();
          }}
          onMouseLeave={() => {
            setIsPointerInside(false);
            scheduleHide();
          }}
        >
          {children({
            onInputFocusChange: (isFocused) => {
              setHasInputFocus(isFocused);
              if (isFocused) {
                showDock();
              } else {
                scheduleHide();
              }
            },
            onPopoverStateChange: (isOpen) => {
              setHasPopoverOpen(isOpen);
              if (isOpen) {
                showDock();
              } else {
                scheduleHide();
              }
            },
            onInteractionLockChange: (isLocked) => {
              setHasInteractionLock(isLocked);
              if (isLocked) {
                showDock();
              } else {
                scheduleHide();
              }
            },
          })}
        </div>
      </div>
    </>
  );
}
