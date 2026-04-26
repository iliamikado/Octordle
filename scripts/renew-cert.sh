#!/bin/sh

set -eu

CERTBOT_BIN="${CERTBOT_BIN:-certbot}"
NGINX_CONTAINER="${NGINX_CONTAINER:-octordle_nginx}"

pre_hook() {
  docker stop "$NGINX_CONTAINER"
}

post_hook() {
  docker start "$NGINX_CONTAINER"
}

case "${1:-}" in
  --pre-hook)
    pre_hook
    ;;
  --post-hook)
    post_hook
    ;;
  *)
    "$CERTBOT_BIN" renew -q \
      --pre-hook "$0 --pre-hook" \
      --post-hook "$0 --post-hook"
    ;;
esac
