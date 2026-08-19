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

## Notes

- Scoring scrapes scamalytics.com with public proxies as fallback, so it can
  get rate-limited or blocked; that shows up as `"error": true` on individual
  IPs.
- Domain scoring is throttled (small batches, staggered requests, one retry)
  to reduce blocking, so large domains take longer to fully score.
