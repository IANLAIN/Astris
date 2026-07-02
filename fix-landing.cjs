const fs = require('fs');
const file = 'src/app/AstrisApp.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add mobileMenuOpen state to LandingPage if it doesn't exist
content = content.replace(/function LandingPage\(\{([^}]*)\}\s*:\s*\{([^}]*)\}\)\s*\{\s*const t = useT\(lang\);/,
  (match) => {
    return match + '\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);';
  }
);

// 2. Replace the header in LandingPage
const landingHeaderRegex = /<header className="fixed top-0 left-0 right-0 z-40 border-b border-border backdrop-blur-sm" style=\{\{ backgroundColor: "var\(--background\)", opacity: 0.97 \}\}>[\s\S]*?<\/header>/;

const responsiveLandingHeader = `<header className="fixed top-0 left-0 right-0 z-40 border-b border-border backdrop-blur-sm" style={{ backgroundColor: "var(--background)", opacity: 0.97 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={astrisImg} alt="Astris Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <span className="text-lg md:text-xl font-bold text-foreground tracking-tight">Astris</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { key: "about", label: t("landing.nav.about") },
              { key: "support", label: t("landing.nav.support") },
              { key: "partners", label: t("landing.nav.partners") },
            ].map((item) => (
              <button key={item.key} onClick={() => onNavigate(item.key as PublicView)} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{item.label}</button>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={onLang} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-border cursor-pointer hover:bg-secondary" aria-label="Cambiar idioma">
              <Globe size={16} />{lang.toUpperCase()}
            </button>
            <button onClick={() => onOpenAuth(undefined, "login")} className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-border cursor-pointer" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>{t("landing.nav.login")}</button>
            <button onClick={() => onOpenAuth(undefined, "register")} className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>{t("landing.nav.register")}</button>
          </div>
          
          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button onClick={onLang} className="flex items-center justify-center p-2 rounded-lg border border-border hover:bg-secondary">
               <Globe size={18} />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-foreground">
              {mobileMenuOpen ? <X size={24} /> : <div className="space-y-1.5"><div className="w-6 h-0.5 bg-foreground"></div><div className="w-6 h-0.5 bg-foreground"></div><div className="w-6 h-0.5 bg-foreground"></div></div>}
            </button>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background px-4 py-6 space-y-6 shadow-xl h-screen overflow-y-auto pb-24">
            <nav className="flex flex-col gap-4">
              {[
                { key: "about", label: t("landing.nav.about") },
                { key: "support", label: t("landing.nav.support") },
                { key: "partners", label: t("landing.nav.partners") },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => { onNavigate(item.key as PublicView); setMobileMenuOpen(false); }}
                  className="text-lg text-left font-medium text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <button onClick={() => { onOpenAuth(undefined, "login"); setMobileMenuOpen(false); }} className="w-full rounded-xl border-2 border-border px-5 py-3 text-center text-base font-semibold" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>{t("landing.nav.login")}</button>
              <button onClick={() => { onOpenAuth(undefined, "register"); setMobileMenuOpen(false); }} className="w-full rounded-xl px-5 py-3 text-center text-base font-semibold" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>{t("landing.nav.register")}</button>
            </div>
          </div>
        )}
      </header>`;

content = content.replace(landingHeaderRegex, responsiveLandingHeader);

// 3. Fix the Hero section text sizes which are hardcoded text-[52px] and flex rows in LandingPage
const landingHeroRegex = /<h1 className="text-\[52px\] font-bold text-foreground leading-\[1.1\] mb-5" style=\{\{ letterSpacing: "-0.02em" \}\}>/g;
content = content.replace(landingHeroRegex, '<h1 className="text-4xl md:text-[52px] font-bold text-foreground leading-[1.1] mb-5" style={{ letterSpacing: "-0.02em" }}>');

// Convert the hero layout to flex-col on mobile
content = content.replace(/<div className="relative max-w-7xl mx-auto px-5 md:px-10 py-14 flex items-center justify-between gap-12">/g, '<div className="relative max-w-7xl mx-auto px-5 md:px-10 py-14 flex flex-col lg:flex-row items-center justify-between gap-12">');

// Adjust hero buttons wrapper to be responsive
content = content.replace(/<div className="flex flex-wrap gap-3">/g, '<div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">');
content = content.replace(/className="flex items-center gap-3 px-6 py-3.5/g, 'className="flex items-center justify-center sm:justify-start gap-3 w-full sm:w-auto px-6 py-3.5');

// Adjust the about/partners sections
content = content.replace(/className="relative max-w-7xl mx-auto px-10 py-14 flex items-center justify-between gap-12"/g, 'className="relative max-w-7xl mx-auto px-4 sm:px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"');
content = content.replace(/className="flex items-start gap-12"/g, 'className="flex flex-col md:flex-row items-start gap-8 md:gap-12"');

fs.writeFileSync(file, content);
console.log("Landing page specifically fixed!");
