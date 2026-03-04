import yt_dlp
import os

channels = [
    ("Adam Ondra", "https://www.youtube.com/@AdamOndra"),
    ("Magnus Midtbø", "https://www.youtube.com/@magmidt"),
    ("Alex Megos", "https://www.youtube.com/@alexandermegosAM"),
]

def generate_md(channel_name, url):
    ydl_opts = {
        'extract_flat': True,
        'quiet': True,
        'nocheckcertificate': True,
        'playlistend': 50 # Let's get the 50 most recent videos for this stage, to show progress.
    }
    
    filename = f"{channel_name.replace(' ', '_')}_videos.md"
    
    print(f"Fetching videos for {channel_name}...")
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        # fetch the /videos page specifically to get video uploads
        info_dict = ydl.extract_info(url + '/videos', download=False)
        
        if 'entries' in info_dict:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(f"# {channel_name} 视频列表\n\n")
                f.write(f"频道链接: {url}\n\n")
                f.write("此页面自动提取了频道最新的 50 个视频及简介。\n\n")
                
                for entry in info_dict['entries']:
                    title = entry.get('title', 'Unknown Title')
                    video_id = entry.get('id')
                    desc = entry.get('description', '')
                    if desc:
                        # cleanup desc, remove newlines inside description
                        desc = ' '.join(desc.split('\n'))[:200] + '...'
                    else:
                        desc = "无简介"
                        
                    video_url = f"https://www.youtube.com/watch?v={video_id}" if video_id else "No URL"
                    
                    f.write(f"### [{title}]({video_url})\n")
                    f.write(f"> {desc}\n\n")
            print(f"Created {filename} with {len(info_dict['entries'])} videos.")

for name, url in channels:
    generate_md(name, url)

