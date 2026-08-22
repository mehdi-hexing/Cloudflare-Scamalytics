# IP / Domain Risk Checker

Cloudflare Worker that checks the fraud/risk score of an IP address, resolves
a domain to its IPs and scores each one, and proxies Check-Host style
availability checks by country.

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
GET /checkhost/check?host=<host>&country=<country>&country=<country>...
```

`country` is a 2-3 letter country code (e.g. `us`, `de`, `ir`). Up to 10
countries per request on the `check` endpoint.

## Query parameters

| Parameter | Meaning | Behavior |
|-----------|---------|----------|
| `ip` | single IP | scores that IP |
| `domain` | domain name | resolves and scores every IP |
| `api` | IP or domain (legacy) | auto-detects type; domain returns raw groups, not scores |

## IPv6 support

IPv4 and IPv6 are treated as first-class, everywhere:

- Every entry point (`/<ip>`, `/api/<ip>`, `?ip=`, `?api=`, `POST /api/check-ips`,
  `/checkhost/<country>/<host>`) accepts IPv6 addresses in any valid textual
  form, including bracketed (`[2606:4700:4700::1111]`, `[::1]:443`) and
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
