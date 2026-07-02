const fs = require('fs');
const file = 'src/app/admin/AdminDashboard.tsx';
let c = fs.readFileSync(file, 'utf8');

// I accidentally wrote `\` instead of ` when creating the template literal in React code.
c = c.replace(/className=\{\\\`w-full/g, 'className={`w-full');
c = c.replace(/transition-colors \\\$\{view/g, 'transition-colors ${view');
c = c.replace(/hover:bg-muted'\}\\\`\}/g, "hover:bg-muted'}`} ");
c = c.replace(/className=\{\\\`p-2/g, 'className={`p-2');
c = c.replace(/transition-colors \\\$\{u\.deleted_at/g, 'transition-colors ${u.deleted_at');
c = c.replace(/text-destructive'\}\\\`\}/g, "text-destructive'}`}");
c = c.replace(/className=\{\\\`hover:bg-muted\/30/g, 'className={`hover:bg-muted/30');
c = c.replace(/transition-colors \\\$\{u\.deleted_at \? 'opacity-50' : ''\}\\\`\}/g, "transition-colors ${u.deleted_at ? 'opacity-50' : ''}`}");
c = c.replace(/className=\{\\\`w-12/g, 'className={`w-12');
c = c.replace(/justify-center \\\$\{s\.bg\} \\\$\{s\.color\}\\\`\}/g, "justify-center ${s.bg} ${s.color}`}");

fs.writeFileSync(file, c);
console.log("Syntax fixed");
