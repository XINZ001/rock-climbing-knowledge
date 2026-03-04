#!/bin/bash
# Fetch actual CDN URLs from Unsplash photo pages via og:image meta tags
# Output format: SLUG|CDN_BASE_URL|PHOTOGRAPHER

declare -A PHOTOS=(
  # Technique - General climbing
  ["VmYZe_yqxL0"]="woman climbing wall - indoor technique"
  ["Kr-OVDntFX4"]="two men climbing indoor wall"
  ["G2QYE9czCEw"]="man wall climbing on red wall"
  ["R0te3xFBo3w"]="man climbing climbing wall"
  ["HZQhILEYJnE"]="man climbing climbing wall fitness"
  ["XSEazbZB0WY"]="person climbing colorful outdoor bouldering wall"
  ["nUdYeVEj6xQ"]="close up of climbing wall"
  ["vN5s7Pmr9yg"]="climbing wall with equipment"
  ["yhPidJl8ch4"]="two climbers on climbing wall"
  ["XUQIkRJRz2A"]="man climbing climbing wall"
  # Outdoor climbing
  ["HegvNcZXWTE"]="man climbing mountain NEOM Saudi Arabia"
  ["xhMz5xIbhRg"]="man climbing cliff"
  ["z6H6kupMXws"]="person climbing large rock face"
  ["cvikmsgyiKQ"]="person rock climbing cliff"
  ["8uiZfcAtw4A"]="man climbing large rock"
  ["v7A1a4wakeA"]="person rock climbing sandy cliff"
  ["RCpr1YgSQNY"]="man climbing mountain outdoor"
  ["DQS9lps3JzI"]="rock climber ascending cliff near water"
  ["iXc9NJwwX3E"]="crack climbing Utah"
  ["N8_6eaZHJos"]="steep cliff face vertical rock formations"
  ["0vpV3Sbmcf8"]="granite cliff face behind forest"
  ["g6gomJuaI8I"]="man jumping/rappelling cliff Smith Rock"
  ["AlfXMSDNzxI"]="silhouette of 2 men climbing rope"
  ["tWR4WFn7Y8w"]="man climbing mountain with rope"
  ["rVUyf4XTO8Q"]="man climbing cliff with rope"
  ["Xxk0nhN0Jq4"]="person on rope side of mountain"
  ["l2iy3wrC_8E"]="multi-pitch climbing"
  ["G27dHn4Bsck"]="man hanging from rope on cliff"
  ["7j-aTZwAB7s"]="people climbing mountain sunny sky"
  ["oPSKdGC4jXo"]="man climbing cliff sea"
  ["R5ElaCyLqAo"]="climber reaches summit blue twilight"
  # Gear
  ["-7nnXc4jBWU"]="climbing shoes on rock"
  ["ZHsG61qr5ak"]="chalk bag close-up"
  ["u7jPkSGlP0M"]="two ropes connected by carabiners"
  ["JZZAORC6J2o"]="metal carabiner clip on rope"
  # Knots
  ["KLCtKbyilMU"]="figure eight knot close-up"
  ["OYl9cFHal34"]="four ropes with different knots"
  # Yosemite
  ["7vyTATsnkrk"]="Yosemite Valley El Capitan Half Dome"
  ["IfeWcuWf2hk"]="El Capitan Yosemite daytime"
  ["i8Ouj0jdnEM"]="grayscale El Capitan Yosemite"
  ["3LthhRoBMMQ"]="Half Dome rises Yosemite Valley"
  # Rock types
  ["cTnKAssJt9A"]="granite surface close-up"
  # Kids
  ["GGlz-QSvL38"]="boy doing wall climbing"
  # Fitness
  ["agOqiIgM46M"]="woman doing pull-ups gym"
  ["qo1pyCD02t4"]="man doing pull up gym"
  # Rock formations
  ["2-xdwyS-__0"]="topless man climbing brown rock"
  ["zxmD_oHT7hE"]="boy climbing brown rock formation"
  # Additional
  ["NjYEyBEZBXQ"]="man rock climbing"
  ["s2BJNI8zt7E"]="man in front of climbing wall"
  ["EQ_DW72NkYU"]="group climbing mountain"
  ["DU52UG0FO74"]="man climbing snow mountain"
  ["PvqFnMN3uqY"]="person climbing mountain"
)

echo "["
FIRST=true
for SLUG in "${!PHOTOS[@]}"; do
  DESC="${PHOTOS[$SLUG]}"

  # Fetch the og:image URL
  OG_IMG=$(curl -sL --max-time 10 "https://unsplash.com/photos/${SLUG}" 2>/dev/null | grep -o 'og:image" content="https://images\.unsplash\.com/photo-[^?]*' | sed 's/og:image" content="//' | head -1)

  # Get photographer from og:title or page title
  PHOTOGRAPHER=$(curl -sL --max-time 10 "https://unsplash.com/photos/${SLUG}" 2>/dev/null | grep -o '<title>[^<]*</title>' | sed 's/<title>//;s/<\/title>//' | grep -o 'on Unsplash' | head -1)

  if [ -n "$OG_IMG" ]; then
    if [ "$FIRST" = true ]; then
      FIRST=false
    else
      echo ","
    fi
    printf '  {"slug": "%s", "cdnBase": "%s", "desc": "%s"}' "$SLUG" "$OG_IMG" "$DESC"
  fi
done
echo ""
echo "]"
