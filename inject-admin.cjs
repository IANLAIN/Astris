const fs = require('fs');
const file = 'src/app/AstrisApp.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. IMPORT ADMIN DASHBOARD
const importAdmin = `import AdminDashboard from "./admin/AdminDashboard";\n`;
if (!content.includes('import AdminDashboard')) {
  // Put it after the other local imports
  content = content.replace(/import \{ getCurrentUser[\s\S]*?";/, (match) => match + '\n' + importAdmin);
}

// 2. RENDER ADMIN DASHBOARD
// We need to render <AdminDashboard /> when screen === "dashboard" && role === "admin"
// Wait, currently the code says `setScreen("dashboard")` for admins.
// Let's check what is rendered when `screen === "dashboard"`.
// `const [screen, setScreen] = useState<"landing" | "onboarding" | "quiz" | "profile" | "vacancies" | "vacancy-detail" | "mentor-select" | "accompaniment" | "org-profile" | "post-vacancy" | "candidates" | "candidate-detail" | "post-hire" | "dashboard" | "checkins" | "companies" | "about" | "support" | "partners">("landing");`
// Let's add AdminDashboard rendering.

const adminRender = `
        {role === "admin" && screen === "dashboard" && (
          <AdminDashboard 
             onLogout={handleLogout} 
             onBack={() => setScreen("landing")} 
          />
        )}
`;

if (!content.includes('<AdminDashboard')) {
  // Inject it right before the final `</main>` or similar if it's there, but actually inside `<main className="min-h-screen">` where all other screens are.
  // We can look for `{role === "mentor" && screen === "dashboard" && (` to put it near.
  
  content = content.replace(/\{role === "mentor" && screen === "dashboard"/, adminRender + '\n        {role === "mentor" && screen === "dashboard"');
}

fs.writeFileSync(file, content);
console.log("Admin Dashboard injected!");
