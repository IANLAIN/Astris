import { useRef, useState, useCallback } from "react";
import { Upload, X, User, Loader2, AlertCircle, Check } from "lucide-react";
import { uploadAvatar } from "@/services/dataSource";

export interface AvatarUploadProps {
  /** Current avatar URL (empty string if none) */
  currentUrl: string;
  /** User full name (for initials fallback) */
  userName: string;
  /** User ID for uploading */
  userId: string;
  /** Called after a successful upload with the new public URL */
  onAvatarChange: (url: string) => void;
  /** Whether the user is a demo user (upload disabled) */
  isDemo?: boolean;
}

export function AvatarUpload({
  currentUrl,
  userName,
  userId,
  onAvatarChange,
  isDemo = false,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Derive initials from name (max 2 characters)
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
      if (!allowedTypes.includes(file.type)) {
        setError("Formato no soportado. Usa JPEG, PNG, WebP, GIF o AVIF.");
        return;
      }

      // Validate file size (max 5 MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen es demasiado grande. Máximo 5 MB.");
        return;
      }

      setUploading(true);
      setError(null);
      setSuccess(false);

      try {
        const publicUrl = await uploadAvatar(userId, file);
        if (publicUrl) {
          onAvatarChange(publicUrl);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error al subir la imagen.";
        setError(message);
      } finally {
        setUploading(false);
        // Reset input so the same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [userId, onAvatarChange],
  );

  const triggerFileInput = useCallback(() => {
    if (uploading) return;
    setError(null);
    fileInputRef.current?.click();
  }, [uploading]);

  const clearAvatar = useCallback(() => {
    onAvatarChange("");
    setError(null);
    setSuccess(false);
  }, [onAvatarChange]);

  const hasAvatar = !!currentUrl;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar preview */}
      <button
        type="button"
        onClick={triggerFileInput}
        disabled={uploading || isDemo}
        className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all disabled:cursor-not-allowed disabled:opacity-60 group"
        aria-label="Cambiar foto de perfil"
      >
        {uploading ? (
          <Loader2 size={28} className="text-primary animate-spin" />
        ) : hasAvatar ? (
          <img
            src={currentUrl}
            alt="Foto de perfil"
            className="w-full h-full object-cover"
          />
        ) : initials ? (
          <span
            className="text-2xl font-bold text-foreground/70 select-none"
            aria-hidden="true"
          >
            {initials}
          </span>
        ) : (
          <User size={28} className="text-muted-foreground/60" aria-hidden="true" />
        )}

        {/* Overlay on hover */}
        {!uploading && !isDemo && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
            <Upload size={20} className="text-primary" />
          </div>
        )}
      </button>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={uploading || isDemo}
          className="text-xs font-semibold text-primary hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-0"
        >
          {uploading ? "Subiendo..." : "Subir foto"}
        </button>

        {hasAvatar && !isDemo && (
          <button
            type="button"
            onClick={clearAvatar}
            className="text-xs font-semibold text-destructive hover:underline cursor-pointer bg-transparent border-0"
          >
            Eliminar
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Feedback messages */}
      {error && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs">
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs">
          <Check size={12} />
          Foto actualizada
        </div>
      )}

      {isDemo && (
        <p className="text-xs text-muted-foreground/60 italic text-center">
          Los usuarios demo no pueden modificar su foto
        </p>
      )}
    </div>
  );
}
