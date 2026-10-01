# IP / Domain Risk Checker

Cloudflare Worker that checks the fraud/risk score of an IP address, resolves
a domain to its IPs and scores each one, and proxies Check-Host style
availability checks by country.

Deployable either as a plain Cloudflare Worker or as a Cloudflare Pages
project (Pages Functions). The two platforms behave slightly differently for
this project - see [Platform differences](#platform-differences-worker-vs-pages)
below before you deploy.

## Deploying

This repo has two separate, independent copies of the same app - deploy the
one that matches your platform, you don't need both:

- **`worker.js`** - for a plain Cloudflare Worker. Includes fixes for two
  platform restrictions that only affect Workers on `*.workers.dev` (not
  Pages) - see [Platform differences](#platform-differences-worker-vs-pages).
- **`_worker.js`** - for Cloudflare Pages. Left exactly as the original,
  unmodified source, since Pages doesn't hit either restriction and the
  file already worked correctly as-is.

### As a Worker (recommended - `wrangler.toml` included)

```
wrangler deploy
```

This uses the included `wrangler.toml` (project name `Cloudflare-scamalytics`,
entry point `worker.js`). It also declares a **Service Binding named `SELF`**
that points the Worker at itself - this is required for `/api/domain/<domain>`
to work correctly on domains with many IPs behind them (see below). Because
the binding's `service` value must match the Worker's own `name`, if you
rename the project in `wrangler.toml` update both fields together.

### As Cloudflare Pages

Deploy the folder as-is (via `wrangler pages deploy .`, the dashboard, or a
Git integration) - Pages automatically picks up `_worker.js` as the
Functions entry point, no build step or `wrangler.toml` needed.

### Via GitHub Actions (deploy to up to 4 Cloudflare accounts)

The repo includes a single workflow at `.github/workflows/deploy.yml` that
runs `wrangler deploy` for you. It supports deploying the same Worker to
**up to 4 separate Cloudflare accounts** in one run.

**1. Add the required secrets** in your repo's
*Settings → Secrets and variables → Actions → New repository secret*:

| Account | Secret names |
|---|---|
| Account 1 | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` |
| Account 2 (optional) | `CLOUDFLARE_ACCOUNT_ID_2`, `CLOUDFLARE_API_TOKEN_2` |
| Account 3 (optional) | `CLOUDFLARE_ACCOUNT_ID_3`, `CLOUDFLARE_API_TOKEN_3` |
| Account 4 (optional) | `CLOUDFLARE_ACCOUNT_ID_4`, `CLOUDFLARE_API_TOKEN_4` |

Each `CLOUDFLARE_API_TOKEN*` needs Workers Scripts **Edit** permission (and
KV **Edit** if you rely on it) for its account. You only need to add the
secrets for the accounts you actually plan to use - an account is skipped
entirely unless you tick its checkbox when running the workflow.

**2. Run it:**

- **Automatically** - every push to `main` that touches `worker.js` or
  `wrangler.toml` deploys to **account 1 only**.
- **Manually** - go to *Actions → Deploy Worker (Multi-Account) → Run
  workflow*. You'll see:
  - `account_1` / `account_2` / `account_3` / `account_4` - a checkbox for
    every account. Tick the ones you want to deploy to (at least one is
    required). You can give each account a friendly label with the
    repository variables `CLOUDFLARE_ACCOUNT_LABEL`,
    `CLOUDFLARE_ACCOUNT_2_LABEL`, and so on.
  - `worker_name` - optional name for the Worker. If left empty, the
    `WORKERNAME` secret (`WORKERNAME_2`, `WORKERNAME_3`, ... for the other
    accounts) is used, then the name in `wrangler.toml`.
  - `placement_mode` - `off`, `smart`, `region`, `host` or `hostname`, with
    `placement_provider` (`aws` / `gcp` / `azure`), `placement_region`,
    `placement_host` and `placement_hostname` as the matching values. The
    chosen placement is written into `wrangler.toml` as a `[placement]`
    section before deploying.

Each checked account gets deployed to independently (in parallel), each
using its own `CLOUDFLARE_ACCOUNT_ID*` / `CLOUDFLARE_API_TOKEN*` pair, and
the run's summary prints the resulting `*.workers.dev` URL for every account
that ran.

Pushes don't have the manual inputs, so automatic deploys read placement
from the optional secrets `PLACEMENT_MODE`, `PLACEMENT_PROVIDER`,
`PLACEMENT_REGION`, `PLACEMENT_HOST` and `PLACEMENT_HOSTNAME`. Set them if
you want a push to keep the placement you chose; otherwise the Worker is
redeployed without one.

### Using the Worker as an API from GitHub Actions workflows

If you call this Worker as an API from GitHub Actions workflows (for
example a scanner that checks thousands of IPs through `/api/<ip>`), a
single Worker can end up under heavy load. To reduce the pressure on it:

- **Create several Workers** (for example one per Cloudflare account using
  the multi-account deploy above) and have the caller spread its requests
  across all of them - in the scanner this means listing every Worker host
  in the `RISK_API_HOST` secret, separated by commas or new lines.
- **Set a placement for every one of those Workers, using a different
  region for each** (`placement_mode = region`, for example
  `aws:eu-central-1`, `aws:us-east-1` and `aws:ap-southeast-1`). One
  workflow run applies the same placement to every account you tick, so run
  it once per Worker: tick that account, pick its region, then repeat for
  the next one.

Without a placement, a Worker runs in the data center closest to whoever is
calling it, so all requests coming from GitHub's runners tend to land in the
same place. Pinning each Worker to its own region spreads the load and the
outgoing requests across different locations.

## Routes

### IP - single lookup

```
GET /<ip>
GET /api/<ip>
GET /?ip=<ip>
```

Returns fraud score and details for one IP. Unchanged, safe for existing
integrations.

### Domain - full risk check

```
GET /api/domain/<domain>
GET /?domain=<domain>
```

Resolves the domain and returns the risk score for every IP behind it in one
response.

### Domain - resolve only (legacy)

```
GET /api/<domain>
GET /?api=<domain>
```

Returns the raw IP groups for the domain without scoring them. Kept for
backward compatibility.

### Batch IP scoring

```
POST /api/check-ips
Content-Type: application/json

{ "ips": ["8.8.8.8", "1.1.1.1"] }
```

### Check-Host

```
GET /checkhost/<country>/<host>
GET /checkhost/<type>/<country>/<host>
GET /checkhost/check?host=<host>&type=<type>&country=<country>&country=<country>...
```

`type` is one of `ping`, `http`, `tcp`, `udp`, `dns` and defaults to `ping`
when omitted (so the old `/checkhost/<country>/<host>` and
`/checkhost/check?host=...&country=...` URLs keep working unchanged).

`country` is a 2-3 letter country code (e.g. `us`, `de`, `ir`). Up to 10
countries per request on the `check` endpoint.

The web UI's "Check-Host Network Test" tab lets you pick a check type
(Ping / HTTP / TCP / UDP / DNS) and one or more countries, and shows a
results table with columns tailored to the selected type (e.g. HTTP code +
response time for HTTP, open/closed + response time for TCP/UDP, record
count for DNS).

## Query parameters

| Parameter | Meaning | Behavior |
|-----------|---------|----------|
| `ip` | single IP | scores that IP |
| `domain` | domain name | resolves and scores every IP |
| `api` | IP or domain (legacy) | auto-detects type; domain returns raw groups, not scores |

## IPv6 support

IPv4 and IPv6 are treated as first-class, everywhere:

- Every entry point (`/<ip>`, `/api/<ip>`, `?ip=`, `?api=`, `POST /api/check-ips`,
  `/checkhost/<country>/<host>`, `/checkhost/<type>/<country>/<host>`) accepts
  IPv6 addresses in any valid textual form, including bracketed
  (`[2606:4700:4700::1111]`, `[::1]:443`) and
  link-local with a zone ID (`fe80::1%eth0` - the zone ID is stripped, since
  it's only meaningful locally and scamalytics.com can't resolve it).
- Every valid IPv6 address is normalized to its RFC 5952 canonical form
  (lowercase, shortest `::` compression, `::ffff:a.b.c.d` for IPv4-mapped
  addresses) before it's used to build the outbound scamalytics.com URL, the
  edge cache key, or the JSON response. This means `2001:0DB8::1`,
  `2001:db8:0:0:0:0:0:1` and `2001:db8::1` all hit the same cache entry and
  render identically, instead of being scored/cached three separate times.
- Domain and batch scoring (`/api/domain/<domain>`, `POST /api/check-ips`)
  de-duplicate the IP list by canonical form first, so a resolver returning
  the same IPv6 address in two different textual forms only gets scored
  once.
- API responses include an `ip_version` field (`4` or `6`) per IP, and the
  web UI shows an IPv4/IPv6 badge next to every address.
- Malformed entries in a batch request are reported back individually
  (`"error": true, "message": "Invalid IP address format"`) instead of
  failing the whole batch.

## Notes

- Scoring scrapes scamalytics.com with public proxies as fallback, so it can
  get rate-limited or blocked; that shows up as `"error": true` on individual
  IPs.
- Domain scoring is throttled (small batches, staggered requests, one retry)
  to reduce blocking, so large domains take longer to fully score.
- Check-Host results are proxied from a separate API
  (`CH_RENDER_API_BASE` in `worker.js`, defaults to
  `https://check-host.onrender.com`) and cached at the edge per
  country+host+type for 60 seconds. If that API is slow or down, the
  affected country's card shows an error message instead of results for
  other countries in the same request.

## Platform differences: Worker vs Pages

`worker.js` and `_worker.js` are two separate files with the same features,
diverging only where the platforms themselves force a difference. Two
Cloudflare restrictions apply only to plain Workers on `*.workers.dev`, not
to Pages, so only `worker.js` needed changes for them:

- **Cache API (`caches.default`)** only works on custom domains and on
  Pages (both `*.pages.dev` and custom domains). On a Worker's
  `*.workers.dev` subdomain it's unavailable and can throw instead of
  silently doing nothing. In `worker.js`, every `cache.match`/`cache.put`
  call goes through `safeCacheMatch`/`safeCachePut` wrappers that swallow
  that failure, so it still works correctly on `*.workers.dev` - it just
  always runs as a cache MISS instead of caching responses at the edge.
  Deploying `worker.js` to a Worker custom domain restores real edge
  caching. `_worker.js` doesn't need this, since Pages' Cache API always
  works.
- **Self-fetch for large domain checks.** `/api/domain/<domain>` splits big
  IP lists into groups and re-enters itself as fresh Worker invocations (via
  `POST /api/check-ips`) so each invocation's subrequest budget only has to
  cover a small group, instead of one invocation trying to directly fetch
  every IP (and hitting Cloudflare's "Too many subrequests by single Worker
  invocation" error on domains with many IPs behind them). In `_worker.js`
  this self-fetch is a plain HTTP request, which works fine because Pages'
  `_worker.js` is genuinely the origin for its own domain. `worker.js`
  can't do that: Cloudflare blocks a Worker from HTTP-fetching itself on
  the same zone/`workers.dev` subdomain (error 1042), so it instead goes
  through the `SELF` Service Binding declared in `wrangler.toml` - a direct
  runtime call rather than an HTTP subrequest, so the 1042 restriction
  doesn't apply. If that binding is ever missing (e.g. an older deploy),
  `worker.js` falls back to a plain `fetch()`, and if that also fails, to
  scoring the group in-process - so nothing crashes, but the subrequest
  budget can be exceeded on large domains without the binding in place.
