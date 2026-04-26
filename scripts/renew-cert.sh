#!/bin/sh

set -eu

NGINX_CONTAINER="${NGINX_CONTAINER:-octordle_nginx}"

resolve_certbot_bin() {
  if [ "${CERTBOT_BIN:-}" ]; then
    printf '%s\n' "$CERTBOT_BIN"
    return 0
  fi

  if command -v certbot >/dev/null 2>&1; then
    command -v certbot
    return 0
  fi

  if [ -x /snap/bin/certbot ]; then
    printf '%s\n' /snap/bin/certbot
    return 0
  fi

  if [ -x /usr/bin/certbot ]; then
    printf '%s\n' /usr/bin/certbot
    return 0
  fi

  echo "certbot binary not found" >&2
  exit 1
}

CERTBOT_BIN="$(resolve_certbot_bin)"

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
  --dry-run)
    "$CERTBOT_BIN" renew --dry-run \
      --pre-hook "$0 --pre-hook" \
      --post-hook "$0 --post-hook"
    ;;
  *)
    "$CERTBOT_BIN" renew -q \
      --pre-hook "$0 --pre-hook" \
      --post-hook "$0 --post-hook"
    ;;
esac
