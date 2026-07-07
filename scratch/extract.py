import os
import re
import json

src_dir = '/home/salo/Escritorio/Astris/src'
content_file = '/home/salo/Escritorio/Astris/src/i18n/content.ts'

# Regex to match simple ternaries: lang === "es" ? "Español" : "English"
# We will just replace them with t('auto.key')
pattern1 = re.compile(r'lang\s*===\s*"es"\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"')

# Pattern for 4 langs: lang === "es" ? "es" : lang === "pt" ? "pt" : lang === "fr" ? "fr" : "en"
pattern2 = re.compile(r'lang\s*===\s*"es"\s*\?\s*"([^"]+)"\s*:\s*lang\s*===\s*"pt"\s*\?\s*"([^"]+)"\s*:\s*lang\s*===\s*"fr"\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"')

translations = {'es': {}, 'en': {}, 'pt': {}, 'fr': {}}
counter = 0

def generate_key(es_text):
    global counter
    # Create a safe key
    safe = re.sub(r'[^a-zA-Z0-9]', '_', es_text.lower())[:15]
    counter += 1
    return f"auto.{safe}._{counter}"

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            if 'content.ts' in file or 'useT.ts' in file:
                continue
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            new_content = content
            
            # Replace 4 langs
            for m in pattern2.finditer(content):
                es, pt, fr, en = m.groups()
                key = generate_key(es)
                translations['es'][key] = es
                translations['pt'][key] = pt
                translations['fr'][key] = fr
                translations['en'][key] = en
                new_content = new_content.replace(m.group(0), f't("{key}")')
                
            # Replace 2 langs (if any left after 4 langs)
            for m in pattern1.finditer(new_content):
                es, en = m.groups()
                key = generate_key(es)
                translations['es'][key] = es
                translations['en'][key] = en
                translations['pt'][key] = es # Fallback
                translations['fr'][key] = es # Fallback
                new_content = new_content.replace(m.group(0), f't("{key}")')
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)

print(json.dumps(translations, indent=2))
