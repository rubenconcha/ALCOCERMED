import urllib.request
import re

req = urllib.request.Request('https://www.myinstants.com/es/instant/error-app-66543/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    links = re.findall(r'/media/sounds/[^\'"]+\.mp3', html)
    print(links)
except Exception as e:
    print(e)
