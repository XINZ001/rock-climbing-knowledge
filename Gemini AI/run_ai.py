import json
import os
import google.genai as genai
from pydantic import BaseModel
from typing import List

class KnowledgePointSegment(BaseModel):
    kpId: str
    start: int
    end: int
    relevance: str
    note_zh: str
    note_en: str

class VideoSegments(BaseModel):
    videoId: str
    segments: List[KnowledgePointSegment]

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

for video in videos:
    transcript_lines = []
    for c in video["subs"]:
        transcript_lines.append(f"[{c['start']}] {c['text']}")
    transcript = "\n".join(transcript_lines)

    prompt = f"""You are a rock climbing expert. Analyze the following transcript from a video titled "{video['title']}".
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

Transcript:
{transcript}
"""

    try:
        client = genai.Client()
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": VideoSegments,
            },
        )
        print(f"--- Result for {video['videoId']} ---")
        print(response.text)
    except Exception as e:
        print(f"Error for {video['videoId']}: {e}")
