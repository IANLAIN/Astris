const fs = require('fs');

function replaceInFile(filepath, replacements) {
  let content = fs.readFileSync(filepath, 'utf8');
  for (const [search, replace] of replacements) {
    const safeSearch = search.replace(/[.*+?^$()|[\\]\\\\]/g, '\\\\$&');
    content = content.replace(new RegExp(safeSearch, 'g'), replace);
  }
  fs.writeFileSync(filepath, content);
}

// 1. SettingsPage.tsx
replaceInFile('src/app/pages/shared/SettingsPage.tsx', [
  ['lang === "es" ? "Perfil actualizado correctamente." : "Profile updated successfully."', 't("settings.saveSuccess")'],
  ['lang === "es" ? "Error al eliminar cuenta. Asegúrate de haber ejecutado el script SQL en Supabase." : "Error deleting account. Make sure you ran the SQL script in Supabase."', 't("settings.deleteError")'],
  ['lang === "es" ? "Configuración de Cuenta" : "Account Settings"', 't("settings.title")'],
  ['lang === "es" ? "Información Personal" : "Personal Information"', 't("settings.personal")'],
  ['lang === "es" ? "Nombre Completo" : "Full Name"', 't("settings.name")'],
  ['lang === "es" ? "Guardar Cambios" : "Save Changes"', 't("save")'],
  ['lang === "es" ? "Preferencias Visuales" : "Visual Preferences"', 't("settings.visual")'],
  ['lang === "es" ? "Modo oscuro" : "Dark mode"', 't("settings.dark")'],
  ['lang === "es" ? "Modo claro" : "Light mode"', 't("settings.light")'],
  ['lang === "es" ? "Paleta de colores" : "Color Palette"', 't("settings.palette")'],
  ['lang === "es" ? "Zona de Peligro" : "Danger Zone"', 't("settings.danger")'],
  ['lang === "es" \n              ? "Una vez que elimines tu cuenta, no hay vuelta atrás. Toda tu información y procesos se perderán permanentemente." \n              : "Once you delete your account, there is no going back. All your information and processes will be permanently lost."', 't("settings.deleteWarn")'],
  ['lang === "es" ? "Eliminar Cuenta" : "Delete Account"', 't("settings.delete")'],
  ['lang === "es" ? "¿Estás absolutamente seguro de esto?" : "Are you absolutely sure about this?"', 't("settings.deleteConfirm")'],
  ['lang === "es" ? "Sí, eliminar mi cuenta" : "Yes, delete my account"', 't("settings.deleteYes")'],
  ['lang === "es" ? "Cancelar" : "Cancel"', 't("settings.deleteCancel")'],
]);

// 2. NotFoundPage.tsx
replaceInFile('src/app/pages/shared/NotFoundPage.tsx', [
  ['import { Lang } from "../../types";', 'import { Lang } from "../../types";\nimport { useT } from "../../i18n/useT";'],
  ['export function NotFoundPage({ lang, onGoHome }: { lang: Lang; onGoHome: () => void }) {', 'export function NotFoundPage({ lang, onGoHome }: { lang: Lang; onGoHome: () => void }) {\n  const t = useT(lang);'],
  ['lang === "es" ? "Página no encontrada" : "Page not found"', 't("notfound.title")'],
  ['lang === "es" \n          ? "Lo sentimos, la página que estás buscando no existe o ha sido movida." \n          : "Sorry, the page you are looking for does not exist or has been moved."', 't("notfound.sub")'],
  ['lang === "es" ? "Volver al inicio" : "Go to home"', 't("notfound.home")'],
]);

// 3. LoginModal.tsx
replaceInFile('src/app/components/modals/LoginModal.tsx', [
  ['lang === "es" ? "Por favor ingresa tu correo electrónico." : "Please enter your email."', 't("login.emailError")'],
  ['lang === "es" ? "Volver a iniciar sesión" : "Back to login"', 't("login.backLogin")'],
  ['lang === "es" ? "Recuperar Contraseña" : "Reset Password"', 't("login.forgotTitle")'],
  ['lang === "es" ? "Enlace de recuperación enviado. Revisa tu bandeja de entrada." : "Recovery link sent. Check your inbox."', 't("login.recoverySent")'],
  ['lang === "es" ? "¿Olvidaste tu contraseña?" : "Forgot password?"', 't("login.forgot")'],
  ['lang === "es" ? "Enviar enlace" : "Send link"', 't("login.sendLink")'],
]);

// 4. UpdatePasswordModal.tsx
replaceInFile('src/app/components/modals/UpdatePasswordModal.tsx', [
  ['lang === "es" ? "La contraseña debe tener al menos 6 caracteres." : "Password must be at least 6 characters."', 't("updatePass.errorLength")'],
  ['lang === "es" ? "Nueva Contraseña" : "New Password"', 't("updatePass.title")'],
  ['lang === "es" ? "Ingresa tu nueva contraseña para acceder a tu cuenta." : "Enter your new password to access your account."', 't("updatePass.sub")'],
  ['lang === "es" ? "Guardar y continuar" : "Save and continue"', 't("updatePass.save")'],
]);

// 5. NavBar.tsx
replaceInFile('src/app/components/common/NavBar.tsx', [
  ['lang === "es" ? "Modo claro" : lang === "pt" ? "Modo claro" : lang === "fr" ? "Mode clair" : "Light mode"', 't("settings.light")'],
  ['lang === "es" ? "Modo oscuro" : lang === "pt" ? "Modo escuro" : lang === "fr" ? "Mode sombre" : "Dark mode"', 't("settings.dark")'],
  ['lang === "es" ? "Mi Cuenta" : "My Account"', 't("nav.account")'],
  ['lang === "es" ? "Configuración" : "Settings"', 't("nav.settings")'],
]);

// 6. CompanyOrgProfile.tsx
replaceInFile('src/app/pages/company/CompanyOrgProfile.tsx', [
  ['lang === "es" ? "Cambios guardados exitosamente" : "Changes saved successfully"', 't("comp.org.saveSuccess")'],
  ['lang === "es" ? "Error al guardar" : "Error saving changes"', 't("comp.org.saveError")'],
]);

// 7. CompanyPostVacancy.tsx
replaceInFile('src/app/pages/company/CompanyPostVacancy.tsx', [
  ['lang === "es" ? "Nivel de socialización requerido" : "Required socialization level"', 't("comp.post.socialReq")'],
  ['lang === "es" ? "Habilidades técnicas requeridas" : "Required technical skills"', 't("comp.post.techReq")'],
  ['lang === "es" ? "Modalidad" : "Modality"', 't("comp.post.modality")'],
  ['lang === "es" ? "Horario" : "Schedule"', 't("comp.post.schedule")'],
  ['lang === "es" ? "Publicar vacante" : "Post vacancy"', 't("comp.post.submit")'],
]);

// 8. CompanyCandidates.tsx
replaceInFile('src/app/pages/company/CompanyCandidates.tsx', [
  ['lang === "es" ? "Ver perfil" : "View profile"', 't("comp.cand.viewProfile")'],
]);

// 9. CompanyPostHire.tsx
replaceInFile('src/app/pages/company/CompanyPostHire.tsx', [
  ['lang === "es" ? "Analista de Datos Junior · Día 14 de 60" : "Junior Data Analyst · Day 14 of 60"', 't("comp.posthire.candSub")'],
  ['lang === "es" ? "El colaborador se encuentra en estado estable. Las herramientas asíncronas están configuradas correctamente. Se identificó un punto de fricción: reuniones sin agenda previa. El mentor está trabajando con RRHH para implementar un formato estructurado." : "The collaborator is in stable status. Async tools are correctly configured. One friction point identified: meetings without prior agenda. The mentor is working with HR to implement a structured format."', 't("comp.posthire.candObs")'],
]);

// 10. LandingPage.tsx
replaceInFile('src/app/pages/public/LandingPage.tsx', [
  ['lang === "es" ? "Respaldado y apoyado por" : lang === "pt" ? "Apoiado por" : lang === "fr" ? "Soutenu par" : "Supported by"', 't("landing.supported")'],
]);

// 11. AboutPage.tsx
replaceInFile('src/app/pages/public/AboutPage.tsx', [
  ['>Organizaciones que acompañan Astris<', '>{t("about.orgsTitle")}<'],
  ['>El proyecto se apoya en comunidades y organizaciones que aportan visibilidad, acompañamiento y una mirada práctica de inclusión.<', '>{t("about.orgsSub")}<'],
]);

console.log("Refactor completed!");
