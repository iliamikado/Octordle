# Octordle

Octordle is a word-guessing game similar to Wordle, but for eight words at once.

Play online: https://octordle.ru

## Launch

```bash
docker compose up
```

## Certificate Renewal

For the current `certbot --standalone` setup, renewal needs the `80` port to be
free. The repository includes `scripts/renew-cert.sh`, which temporarily stops
the `octordle_nginx` container, runs `certbot renew`, and starts the container
again.

Make the script executable on the server:

```bash
chmod +x /path/to/repo/scripts/renew-cert.sh
```

Test the hooks before enabling automation:

```bash
/path/to/repo/scripts/renew-cert.sh --pre-hook
/path/to/repo/scripts/renew-cert.sh --post-hook
```

Run a dry run:

```bash
certbot renew --dry-run \
  --pre-hook '/path/to/repo/scripts/renew-cert.sh --pre-hook' \
  --post-hook '/path/to/repo/scripts/renew-cert.sh --post-hook'
```

Example `cron` entry for a daily check at `03:00`:

```cron
0 3 * * * /path/to/repo/scripts/renew-cert.sh
```
