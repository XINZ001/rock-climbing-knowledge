import json
import re

with open("../rock-climbing-knowledge/src/data/kp-registry.json", "r") as f:
    kp_data = json.load(f)["registry"]

kps = []
for kp in kp_data:
    kps.append({"id": kp["id"], "keywords": [k.lower() for k in kp["keywords"]], "title": kp["title"]})

with open("catalyst_samples.json", "r") as f:
    videos = json.load(f)

for v in videos:
    print(f"--- Video: {v['title']} ---")
    matches = {}
    for chunk in v["subs"]:
        text = chunk["text"].lower()
        start = chunk["start"]
        for kp in kps:
            for kw in kp["keywords"]:
                if kw in text:
                    # Ignore very short generic keywords like "fall" or "try" if any, 
                    # but keywords in kp should be specific.
                    if kp["id"] not in matches:
                        matches[kp["id"]] = {"start": start, "title": kp["title"], "kw": kw}
                    # only keep the first occurrence or all? let's just keep the first for simplicity
                    break
    for kp_id, info in matches.items():
        print(f"[{info['start']}s] {info['title']['en']} ({kp_id}) - matched: {info['kw']}")
