const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walk(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

walk('src/features', (file) => {
    if (file.endsWith('.tsx')) {
        let content = fs.readFileSync(file, 'utf8');
        let changed = false;

        // Pattern 1: standard rounded-xl or 2xl
        const cardRegex = /className="rounded-(?:xl|2xl)\s+([^"]+)"\s*style=\{\{\s*background:\s*'var\(--bg-card\)',\s*border:\s*'1px solid var\(--border-primary\)'(?:,\s*[^}]+)?\s*\}\}/g;
        if (cardRegex.test(content)) {
            content = content.replace(cardRegex, 'className="card-premium $1"');
            changed = true;
        }
        
        // Pattern 2: just rounded-xl with no extra classes in className, but same style
        const cardRegex2 = /className="rounded-(?:xl|2xl)"\s*style=\{\{\s*background:\s*'var\(--bg-card\)',\s*border:\s*'1px solid var\(--border-primary\)'(?:,\s*[^}]+)?\s*\}\}/g;
        if (cardRegex2.test(content)) {
            content = content.replace(cardRegex2, 'className="card-premium"');
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(file, content);
            console.log('Updated cards in', file);
        }
    }
});
