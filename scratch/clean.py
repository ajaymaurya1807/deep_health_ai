import glob, re

html_files = glob.glob('stitch_remix_of_deep_health_ai_mobile_app/**/*.html', recursive=True)
updated_count = 0

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    new_content = new_content.replace('onclick="history.back()"', 'onclick="history.back();"')
    
    def clean_alt(match):
        alt_body = match.group(1)
        alt_clean = ' '.join(alt_body.split())
        return f'alt="{alt_clean}"'
    
    new_content = re.sub(r'alt="([^"]*?\n[^"]*?)"', clean_alt, new_content, flags=re.DOTALL)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        updated_count += 1

print(f'Cleaned {updated_count} HTML files.')
