#!/bin/bash
# Fetch CDN base URLs from Unsplash og:image tags in parallel

SLUGS=(
  VmYZe_yqxL0 Kr-OVDntFX4 G2QYE9czCEw R0te3xFBo3w HZQhILEYJnE
  XSEazbZB0WY nUdYeVEj6xQ vN5s7Pmr9yg yhPidJl8ch4 XUQIkRJRz2A
  HegvNcZXWTE xhMz5xIbhRg z6H6kupMXws cvikmsgyiKQ 8uiZfcAtw4A
  v7A1a4wakeA RCpr1YgSQNY DQS9lps3JzI iXc9NJwwX3E N8_6eaZHJos
  g6gomJuaI8I AlfXMSDNzxI tWR4WFn7Y8w rVUyf4XTO8Q Xxk0nhN0Jq4
  l2iy3wrC_8E G27dHn4Bsck 7j-aTZwAB7s oPSKdGC4jXo R5ElaCyLqAo
  ZHsG61qr5ak u7jPkSGlP0M JZZAORC6J2o KLCtKbyilMU
  OYl9cFHal34 7vyTATsnkrk IfeWcuWf2hk i8Ouj0jdnEM 3LthhRoBMMQ
  cTnKAssJt9A GGlz-QSvL38 agOqiIgM46M qo1pyCD02t4
  zxmD_oHT7hE NjYEyBEZBXQ s2BJNI8zt7E EQ_DW72NkYU DU52UG0FO74
  PvqFnMN3uqY 0vpV3Sbmcf8
)

fetch_one() {
  local SLUG="$1"
  local CDN
  CDN=$(curl -sL --max-time 15 "https://unsplash.com/photos/${SLUG}" 2>/dev/null | grep -o 'og:image" content="https://images\.unsplash\.com/photo-[^?]*' | sed 's/og:image" content="//' | head -1)
  if [ -n "$CDN" ]; then
    echo "${SLUG}|${CDN}"
  else
    echo "${SLUG}|FAILED"
  fi
}

export -f fetch_one

printf '%s\n' "${SLUGS[@]}" | xargs -P 8 -I {} bash -c 'fetch_one "$@"' _ {}
