import json
import re

with open('scratch/auto_translations.json', 'r', encoding='utf-8') as f:
    auto = json.load(f)

with open('src/i18n/content.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to insert into T = { es: { ... }, en: { ... }, pt: { ... }, fr: { ... } }
# Let's use regex to find the end of each language dictionary
def insert_keys(lang, dict_content):
    global content
    # find where lang: { starts
    start_idx = content.find(f'{lang}: {{')
    if start_idx == -1: return
    # Find the matching closing bracket or the start of the next key. It's easier to find the first '{' and the corresponding '}'
    # But for a simple hack, just insert after the opening '{'
    insert_str = ""
    for k, v in dict_content.items():
        v_safe = v.replace('"', '\\"')
        insert_str += f'\n    "{k}": "{v_safe}",'
    
    content = content[:start_idx + len(f'{lang}: {{')] + insert_str + content[start_idx + len(f'{lang}: {{'):]

insert_keys('es', auto['es'])
insert_keys('en', auto['en'])
insert_keys('pt', auto['pt'])
insert_keys('fr', auto['fr'])

with open('src/i18n/content.ts', 'w', encoding='utf-8') as f:
    f.write(content)
