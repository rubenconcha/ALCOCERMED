import urllib.request
req = urllib.request.Request('https://www.myinstants.com/media/sounds/app-error.mp3', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response, open('error_sound.mp3', 'wb') as out_file:
        out_file.write(response.read())
    print("Download successful")
except Exception as e:
    print(e)
