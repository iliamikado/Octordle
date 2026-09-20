# Octordle

Octordle is a word-guessing game similar to Wordle, but for eight words at once.

Play online: https://octordle.ru

## Launch

```bash
docker compose up
```

## Production safeguards

`docker-compose.yml` limits each container, rotates Docker logs (three files of
at most 10 MB per container), restarts stopped application containers, and keeps
PostgreSQL and the API on the private Docker network. Only Nginx exposes ports
`80` and `443` to the host.

On a new or existing small VM, run the host provisioning script once as root:

```bash
chmod +x scripts/provision-vm.sh
sudo ./scripts/provision-vm.sh
```

It creates a 1 GB swap file, caps persistent system logs at 100 MB, rotates the
failed-login log (`btmp`), and installs/enables fail2ban for SSH. This script
does not disable SSH password login automatically: first create and test a
non-root sudo user with an SSH key, then disable root/password login manually.

The game history is intentionally retained because personal totals and averages
use all historical `game_info` rows. The current incident was caused by host
logs and memory pressure, not by PostgreSQL data. Add a data-retention policy
only after deciding how many days of personal history must be preserved.

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
/path/to/repo/scripts/renew-cert.sh --dry-run
```

Example `cron` entry for a daily check at `03:00`:

```cron
0 3 * * * /path/to/repo/scripts/renew-cert.sh
```

The deployment workflow copies the script to `/root/scripts/renew-cert.sh`,
disables the built-in `certbot.timer`, and installs the `cron` entry above on
the server.
