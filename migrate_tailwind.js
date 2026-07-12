import fs from 'fs';

// Read config dynamically to avoid module issues
let configStr = fs.readFileSync('tailwind.config.js', 'utf8');

// A simple manual extraction since the file has a specific format
let themeCss = '@theme {\n';
let colorsMatch = configStr.match(/"colors":\s*\{([^}]+)\}/);
if (colorsMatch) {
    let colors = colorsMatch[1].split(',\n');
    colors.forEach(c => {
        let parts = c.split(':');
        if (parts.length === 2) {
            let key = parts[0].replace(/"/g, '').trim();
            let val = parts[1].replace(/"/g, '').trim();
            if(key) themeCss += `  --color-${key}: ${val};\n`;
        }
    });
}

let spacingMatch = configStr.match(/"spacing":\s*\{([^}]+)\}/);
if (spacingMatch) {
    let spacing = spacingMatch[1].split(',\n');
    spacing.forEach(s => {
        let parts = s.split(':');
        if (parts.length === 2) {
            let key = parts[0].replace(/"/g, '').trim();
            let val = parts[1].replace(/"/g, '').trim();
            if(key) themeCss += `  --spacing-${key}: ${val};\n`;
        }
    });
}

// Add the font families manually since they are arrays
themeCss += `  --font-kpi-value: "Inter";\n`;
themeCss += `  --font-body-md: "Inter";\n`;
themeCss += `  --font-display-lg: "Space Grotesk";\n`;
themeCss += `  --font-headline-sm: "Space Grotesk";\n`;
themeCss += `  --font-headline-md: "Space Grotesk";\n`;
themeCss += `  --font-body-lg: "Inter";\n`;
themeCss += `  --font-headline-lg: "Space Grotesk";\n`;
themeCss += `  --font-label-caps: "Inter";\n`;

themeCss += '}\n';

let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace('@config "../tailwind.config.js";', themeCss);
fs.writeFileSync('src/index.css', css);
console.log('Migrated to @theme');
