const fs = require('fs');

const file = 'src/app/AstrisApp.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace standard widths
content = content.replace(/\bclassName="([^"]*)"/g, (match, classes) => {
  let newClasses = classes;
  
  // Padding & margins
  newClasses = newClasses.replace(/\bp-8\b/g, 'p-4 md:p-8')
                         .replace(/\bpx-8\b/g, 'px-4 md:px-8')
                         .replace(/\bpy-8\b/g, 'py-4 md:py-8')
                         .replace(/\bp-10\b/g, 'p-5 md:p-10')
                         .replace(/\bpx-10\b/g, 'px-5 md:px-10')
                         .replace(/\bpy-12\b/g, 'py-6 md:py-12')
                         .replace(/\bpx-16\b/g, 'px-4 md:px-16')
                         .replace(/\bpx-20\b/g, 'px-4 lg:px-20');

  // Gaps
  newClasses = newClasses.replace(/\bgap-8\b/g, 'gap-4 md:gap-8')
                         .replace(/\bgap-6\b/g, 'gap-3 md:gap-6')
                         .replace(/\bgap-10\b/g, 'gap-5 md:gap-10');

  // Widths
  newClasses = newClasses.replace(/\bw-96\b/g, 'w-full md:w-96')
                         .replace(/\bw-64\b/g, 'w-full md:w-64')
                         .replace(/\bw-80\b/g, 'w-full md:w-80')
                         .replace(/\bmax-w-md\b/g, 'w-[95%] md:w-full md:max-w-md')
                         .replace(/\bmax-w-4xl\b/g, 'w-[95%] md:w-full md:max-w-4xl')
                         .replace(/\bw-\[800px\]\b/g, 'w-full md:w-[800px]');

  // Typography
  newClasses = newClasses.replace(/\btext-4xl\b/g, 'text-3xl md:text-4xl')
                         .replace(/\btext-5xl\b/g, 'text-3xl md:text-5xl')
                         .replace(/\btext-3xl\b/g, 'text-2xl md:text-3xl');

  // Grids
  newClasses = newClasses.replace(/\bgrid-cols-2\b/g, 'grid-cols-1 md:grid-cols-2')
                         .replace(/\bgrid-cols-3\b/g, 'grid-cols-1 md:grid-cols-3')
                         .replace(/\bgrid-cols-4\b/g, 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4');

  // Tables / wide components wrapping
  newClasses = newClasses.replace(/\bmin-w-\[800px\]\b/g, 'min-w-0 md:min-w-[800px]')
                         .replace(/\bmin-w-\[600px\]\b/g, 'min-w-0 md:min-w-[600px]');

  return `className="${newClasses}"`;
});

// For sidebars and fixed navbars, we want to allow them to stack on mobile.
// So replace specific sidebar patterns (e.g. h-screen w-64 fixed or similar)
content = content.replace(/className="([^"]*)\bw-64 border-r border-border\b([^"]*)"/g, (m, p1, p2) => {
  return `className="${p1}w-full md:w-64 border-b md:border-b-0 md:border-r border-border${p2}"`;
});

// Dashboard layout flex-row -> flex-col md:flex-row if it's the main container
content = content.replace(/className="flex h-screen bg-background"/g, 'className="flex flex-col md:flex-row h-screen bg-background overflow-hidden"');

// Fix modals to not overflow
content = content.replace(/w-full max-w-md/g, 'w-[95%] md:w-full md:max-w-md');

fs.writeFileSync(file, content);
console.log("Refactoring complete");
