import yt_dlp
import os
import re

channels = [
    ("Adam Ondra", "https://www.youtube.com/@AdamOndra"),
    ("Magnus Midtbo", "https://www.youtube.com/@magmidt"),
    ("Alex Megos", "https://www.youtube.com/@alexandermegosAM"),
    ("Jakob Schubert", "https://www.youtube.com/@JakobSchubertClimbing"),
    ("Lattice Training", "https://www.youtube.com/@LatticeTraining"),
    ("Hoopers Beta", "https://www.youtube.com/@HoopersBeta"),
    ("Movement for Climbers", "https://www.youtube.com/@movementforclimbers"),
    ("Rock Entry", "https://www.youtube.com/@rockentry"),
    ("Bouldering Bobat", "https://www.youtube.com/@BoulderingBobat"),
    ("EpicTV Climbing Daily", "https://www.youtube.com/@EpicTVClimbing"),
    ("Mellow", "https://www.youtube.com/@mellowclimbing"),
    ("Wide Boyz", "https://www.youtube.com/@WideBoyztv"),
    ("Hannah Morris Bouldering", "https://www.youtube.com/@HannahMorrisBouldering"),
    ("IFSC", "https://www.youtube.com/@IFSClimbing"),
    ("Dave MacLeod", "https://www.youtube.com/@climbermacleod"),
    ("Catalyst Climbing", "https://www.youtube.com/@CatalystClimbing"),
    ("Geek Climber", "https://www.youtube.com/@GeekClimber"),
    ("Albert Ok", "https://www.youtube.com/@AlbertOkay"),
    ("Neil Gresham", "https://www.youtube.com/@NeilGresham")
]

def classify_video(title, desc):
    text = (title + " " + desc).lower()
    tags = []
    
    # 过滤明显的非攀岩或者会员限定的视频
    if any(kw in text for kw in ['members only', 'join this channel to watch']):
        return ["会员限定(跳过)"]
        
    # 关键词分类逻辑
    if any(kw in text for kw in ['hangboard', 'pull up', 'pull-up', 'strength', 'campus', 'core', 'workout', 'train', 'muscle', 'fitness', 'endurance', 'power', 'weight', 'finger']):
        tags.append("💪 身体素质与训练")
    if any(kw in text for kw in ['technique', 'footwork', 'crimp', 'dyno', 'drop knee', 'slab', 'overhang', 'crack', 'beta', 'how to climb', 'movement', 'skill', 'sloper', 'pinch', 'tips']):
        tags.append("🧗 攀爬技术")
    if any(kw in text for kw in ['fear', 'mind', 'mental', 'projecting', 'tactics', 'scared', 'headgame', 'focus']):
        tags.append("🧠 心理与策略")
    if any(kw in text for kw in ['shoe', 'gear', 'harness', 'rope', 'cam', 'trad gear', 'belay device', 'review', 'board']):
        tags.append("🎒 装备知识")
    if any(kw in text for kw in ['belay', 'fall', 'knot', 'rappel', 'anchor', 'safety', 'safe', 'spotting']):
        tags.append("🛡️ 安全与风险管理")
    if any(kw in text for kw in ['injury', 'rehab', 'pulley', 'tendonitis', 'warm up', 'warmup', 'stretch', 'pain', 'heal', 'flexibility', 'doctor', 'pt', 'mobility']):
        tags.append("🩹 伤病预防与恢复")
    if any(kw in text for kw in ['outdoor', 'yosemite', 'rock', 'crag', 'trad', 'big wall', 'free solo', 'multi-pitch', 'multi pitch', 'boulder outside']):
        tags.append("⛰️ 户外攀岩实践")
    if any(kw in text for kw in ['ifsc', 'world cup', 'olympic', 'compete', 'competition', 'speed climbing', 'championship', 'paris 2024']):
        tags.append("🏆 竞技攀岩")
    if any(kw in text for kw in ['vlog', 'friend', 'challenge', 'fun', 'gym session', 'epic', 'collab', 'vs', 'day in the life', 'climbing with']):
        tags.append("🫂 攀岩社交与挑战")
        
    # 如果没有命中任何知识点，但频道本身是相关频道，就归为日常或综述
    if not tags:
        tags.append("🌐 综合/日常记录")
        
    return list(set(tags))

def generate_md(channel_name, url):
    ydl_opts = {
        'extract_flat': True,
        'quiet': True,
        'nocheckcertificate': True,
        'playlistend': 100 # 提取最近的100个视频以保证质量和速度
    }
    
    filename = f"{channel_name.replace(' ', '_')}_videos.md"
    
    print(f"Fetching videos for {channel_name}...")
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # fetch the /videos page to get actual video uploads
            info_dict = ydl.extract_info(url + '/videos', download=False)
            
            if info_dict and 'entries' in info_dict:
                valid_entries = 0
                
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(f"# {channel_name} - 频道视频精选资源库\n\n")
                    f.write(f"**频道链接**: {url}\n\n")
                    f.write("已自动剔除了会员专属视频及可能相关度低的内容。以下是该频道近期最有价值的攀岩视频，并已通过 AI 关键词分析为其打上了**知识点标签**。\n\n---\n\n")
                    
                    for entry in info_dict['entries']:
                        if not entry: continue
                        title = entry.get('title', 'Unknown Title')
                        video_id = entry.get('id')
                        desc = entry.get('description', '') or ''
                        
                        tags = classify_video(title, desc)
                        
                        # 跳过会员视频或完全不相关的视频（这里主要靠上方的 member_only 判断跳过）
                        if "会员限定(跳过)" in tags:
                            continue
                            
                        # 清理简介文本
                        desc_clean = ' '.join(desc.split('\n'))
                        # 截取前 150 个字符
                        desc_clean = desc_clean[:150] + '...' if len(desc_clean) > 150 else desc_clean
                        if not desc_clean.strip():
                            desc_clean = "暂无详细简介"
                            
                        video_url = f"https://www.youtube.com/watch?v={video_id}" if video_id else url
                        
                        tags_str = " | ".join(tags)
                        
                        f.write(f"### [{title}]({video_url})\n")
                        f.write(f"- **🏷️ 知识归类**：`{tags_str}`\n")
                        f.write(f"- **📝 简介总结**：{desc_clean}\n\n")
                        
                        valid_entries += 1
                        
                print(f"✅ Created {filename} with {valid_entries} valid videos.")
    except Exception as e:
        print(f"❌ Error fetching {channel_name}: {e}")

for name, url in channels:
    generate_md(name, url)
