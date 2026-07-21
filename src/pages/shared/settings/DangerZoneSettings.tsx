import { AlertTriangle, Trash2 } from "lucide-react";

export function DangerZoneSettings({
  t,
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleDeleteAccount,
  saving,
}: any) {
  return (
    <section className="p-6 md:p-8 rounded-[2rem] border-2 border-red-500/20 bg-red-500/5">
      <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
        <AlertTriangle size={20} /> {t("settings.danger")}
      </h2>
      <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-5 max-w-xl">
        {t("settings.deleteWarn")}
      </p>
      
      {!showDeleteConfirm ? (
        <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all bg-red-500 text-white hover:bg-red-600">
          <Trash2 size={16} /> {t("settings.delete")}
        </button>
      ) : (
        <div className="p-5 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 flex flex-col gap-4 max-w-md">
          <p className="font-bold text-red-600 dark:text-red-400 text-sm">
            {t("settings.deleteConfirm")}
          </p>
          <div className="flex gap-3">
            <button onClick={handleDeleteAccount} disabled={saving} className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
              {saving ? "..." : (t("settings.deleteYes"))}
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} disabled={saving} className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
              {t("settings.deleteCancel")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
