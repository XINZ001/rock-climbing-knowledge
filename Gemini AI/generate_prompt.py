import os
import json

def get_allowed_kps():
    with open("../rock-climbing-knowledge/src/data/kp-registry.json", "r") as f:
        data = json.load(f)
        return {kp["id"]: kp["keywords"] for kp in data["registry"]}

kps = get_allowed_kps()
kp_lines = []
for k, v in kps.items():
    kp_lines.append("- " + str(k) + ": " + ", ".join(v[:3]))
kp_summary = "\n".join(kp_lines)

with open("catalyst_samples.json", "r") as f:
    videos = json.load(f)

video = videos[0]
transcript_lines = []
for c in video["subs"]:
    s = c["start"]
    t = c["text"]
    transcript_lines.append(f"[{s}] {t}")
transcript = "\n".join(transcript_lines)

v_title = video["title"]

prompt = f"""You are a rock climbing expert. Analyze the following transcript from a video titled "{v_title}".
Identify segments that teach specific climbing knowledge points.
You MUST map the identified knowledge to one of the following exact knowledge point IDs (kpId).
Choose the most specific and relevant kpId. If you cannot find a matching kpId, DO NOT hallucinate one; skip the segment.

Allowed Knowledge Points (ID: keywords):
{kp_summary}

Rules:
- The `start` and `end` times should be in seconds, matching the timestamps in the transcript.
- `relevance` must be one of: "primary", "secondary", "mention".
- `note_zh` is a concise Chinese summary of what is taught in this segment.
- `note_en` is the English equivalent.

Output ONLY valid JSON representing a dictionary with "videoId" and "segments" list. DO NOT surround with markdown.

Transcript:
{transcript}
"""

with open("prompt.txt", "w") as f:
    f.write(prompt)
