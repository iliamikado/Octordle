#!/bin/sh

# One-time host hardening for the small Octordle VM.
# Run as root: sudo ./scripts/provision-vm.sh

set -eu

SWAP_SIZE_MB="${SWAP_SIZE_MB:-1024}"
JOURNAL_MAX_USE="${JOURNAL_MAX_USE:-100M}"

if [ "$(id -u)" -ne 0 ]; then
  echo 'Run this script as root.' >&2
  exit 1
fi

if ! swapon --show --noheadings | grep -q .; then
  if [ ! -f /swapfile ]; then
    fallocate -l "${SWAP_SIZE_MB}M" /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
  fi
  swapon /swapfile
fi

if ! grep -qE '^/swapfile[[:space:]]' /etc/fstab; then
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

install -d -m 0755 /etc/systemd/journald.conf.d
cat > /etc/systemd/journald.conf.d/octordle.conf <<EOF
[Journal]
SystemMaxUse=${JOURNAL_MAX_USE}
RuntimeMaxUse=50M
EOF
systemctl restart systemd-journald

cat > /etc/logrotate.d/octordle-auth <<'EOF'
/var/log/btmp {
    weekly
    size 10M
    rotate 4
    missingok
    notifempty
    compress
    delaycompress
    copytruncate
    create 0660 root utmp
}
EOF

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y fail2ban logrotate
cat > /etc/fail2ban/jail.d/sshd.local <<'EOF'
[sshd]
enabled = true
maxretry = 5
findtime = 10m
bantime = 1h
EOF
systemctl enable --now fail2ban
logrotate -f /etc/logrotate.d/octordle-auth

echo 'Host provisioning complete.'
echo 'Before disabling password authentication, add and verify an SSH key for a non-root sudo user.'
