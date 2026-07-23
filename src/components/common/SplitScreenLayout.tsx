import { ReactNode } from "react";

export function SplitScreenLayout({
  left,
  right,
  leftClassName = "",
  rightClassName = "",
}: {
  left: ReactNode;
  right: ReactNode;
  leftClassName?: string;
  rightClassName?: string;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel — 60% */}
      <div
        className={`flex-1 lg:w-[60%] min-w-0 px-5 md:px-10 lg:px-16 py-10 md:py-14 overflow-y-auto bg-card ${leftClassName}`}
      >
        {left}
      </div>

      {/* Right panel — 40% — themed background */}
      <div
        className={`hidden lg:flex lg:w-[40%] flex-col sticky top-0 h-screen overflow-y-auto ${rightClassName}`}
        style={{ backgroundColor: "color-mix(in srgb, var(--primary) 8%, var(--background))" }}
      >
        {right}
      </div>
    </div>
  );
}
