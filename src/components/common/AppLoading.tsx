import { CSSProperties } from "react";

type AppLoadingVariant = "spinner" | "message";

const SPINNER_STYLE: CSSProperties = {
  borderColor: "var(--primary)",
  borderTopColor: "transparent",
};

export function AppLoading({
  variant = "spinner",
  message,
  rootStyle,
}: {
  variant?: AppLoadingVariant;
  message?: string;
  rootStyle?: CSSProperties;
}) {
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden bg-background flex items-center justify-center"
      style={rootStyle}
    >
      {variant === "spinner" ? (
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={SPINNER_STYLE}
        />
      ) : (
        <div
          className="p-6 rounded-2xl border border-border flex items-center gap-4 shadow-lg"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
            style={SPINNER_STYLE}
          />
          <p className="text-foreground font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}
