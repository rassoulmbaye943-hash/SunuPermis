import glob
import re

files = glob.glob('*.html')

for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Skip if already updated (has placeholders)
    if 'sp-header-placeholder' in content:
        print(f"Skipping {f} - already updated")
        continue
    
    # Get the page name for header
    page_match = re.search(r'document\.write\(spHeader\(["\']([^"\']+)["\']', content)
    page_name = page_match.group(1) if page_match else 'index.html'
    
    # Replace document.write(spHeader(...)) with placeholder + script
    header_pattern = r'<script>\s*document\.write\(spHeader\(["\'][^"\']+["\']\)\);\s*</script>'
    header_replacement = '''<div id="sp-header-placeholder"></div>
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        injectHeader("''' + page_name + '''");
      });
    </script>'''
    
    content = re.sub(header_pattern, header_replacement, content)
    
    # Replace document.write(spFooter()) with placeholder + script
    footer_pattern = r'<script>\s*document\.write\(spFooter\(\)\);\s*</script>'
    footer_replacement = '''<div id="sp-footer-placeholder"></div>
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        injectFooter();
      });
    </script>'''
    
    content = re.sub(footer_pattern, footer_replacement, content)
    
    with open(f, 'w', encoding='utf-8') as fp:
        fp.write(content)
    
    print(f"Updated {f}")

print("Done!")