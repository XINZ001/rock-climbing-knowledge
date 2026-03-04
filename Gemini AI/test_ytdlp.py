import yt_dlp
import sys
import json

def fetch_videos(url):
    ydl_opts = {
        'extract_flat': True,
        'quiet': True,
        'playlistend': 5,
        'nocheckcertificate': True
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=False)
        if 'entries' in info_dict:
            for entry in info_dict['entries']:
                print(json.dumps({'title': entry.get('title'), 'id': entry.get('id'), 'description': entry.get('description', '')}))

if __name__ == '__main__':
    fetch_videos('https://www.youtube.com/@AdamOndra/videos')
