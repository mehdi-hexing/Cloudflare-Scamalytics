const HTML_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scamalytics IP Checker - API & Fraud Risk Score Analysis</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
        }
        
        .risk-low {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .risk-medium {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        
        .risk-high {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }
        
        .risk-very-high {
            background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%);
        }
        
        .loading {
            border: 4px solid #f3f4f6;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">Scamalytics IP Checker</h1>
            <p class="text-gray-600">Check IP Fraud Risk & Score Analysis</p>
        </div>

        <!-- Input Section -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div class="flex flex-col sm:flex-row gap-4">
                <input 
                    type="text" 
                    id="ipInput" 
                    placeholder="Enter IP address (127.0.0.1,...)"
                    class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button 
                    onclick="checkIP()" 
                    id="checkBtn"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95">
                    Check IP
                </button>
            </div>
            <p class="text-sm text-gray-500 mt-3">You can also use URL parameter: ?ip=8.8.8.8</p>
            <p class="text-sm text-blue-600 mt-2">API Endpoints: <code class="bg-gray-100 px-2 py-1 rounded">/8.8.8.8</code> or <code class="bg-gray-100 px-2 py-1 rounded">/api/8.8.8.8</code></p>
        </div>

        <!-- Loading -->
        <div id="loading" class="hidden text-center py-12">
            <div class="loading mx-auto mb-4"></div>
            <p class="text-gray-600">Fetching data...</p>
        </div>

        <!-- Error -->
        <div id="error" class="hidden bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 fade-in">
            <div class="flex items-center gap-3">
                <span class="text-3xl">⚠️</span>
                <div>
                    <h3 class="font-bold text-red-800">Error Fetching Data</h3>
                    <p id="errorMessage" class="text-red-600"></p>
                </div>
            </div>
        </div>

        <!-- Results -->
        <div id="results" class="hidden fade-in">
            <!-- Score Card -->
            <div id="scoreCard" class="rounded-2xl shadow-xl p-8 mb-6 text-white">
                <div class="text-center">
                    <h2 class="text-xl font-semibold mb-2">Fraud Score</h2>
                    <div class="text-7xl font-bold mb-2" id="fraudScore">-</div>
                    <div class="text-2xl font-semibold" id="riskLevel">-</div>
                </div>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- IP Info -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                        <span>🌐</span> IP Information
                    </h3>
                    <div class="space-y-3">
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-600">IP Address:</span>
                            <span class="font-semibold" id="ipAddress">-</span>
                        </div>
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-600">Country:</span>
                            <span class="font-semibold" id="country">-</span>
                        </div>
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-600">City:</span>
                            <span class="font-semibold" id="city">-</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">ISP:</span>
                            <span class="font-semibold text-sm" id="isp">-</span>
                        </div>
                    </div>
                </div>

                <!-- Risk Factors -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                        <span>⚡</span> Risk Factors
                    </h3>
                    <div class="space-y-3" id="riskFactors">
                        <!-- Will be populated dynamically -->
                    </div>
                </div>
            </div>

            <!-- Additional Info -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                    <span>📊</span> Additional Information
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="additionalInfo">
                    <!-- Will be populated dynamically -->
                </div>
            </div>
        </div>
    </div>

    <script>
        window.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const paramIP = urlParams.get('ip');
            
            if (paramIP) {
                document.getElementById('ipInput').value = paramIP;
                checkIP();
            }
        });

        document.getElementById('ipInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkIP();
            }
        });

        async function checkIP() {
            const ipInput = document.getElementById('ipInput').value.trim();
            
            if (!ipInput) {
                showError('Please enter an IP address');
                return;
            }
            
            if (!isValidIP(ipInput)) {
                showError('Invalid IP address format');
                return;
            }

            const url = new URL(window.location);
            url.searchParams.set('ip', ipInput);
            window.history.pushState({}, '', url);

            showLoading();

            try {
                const response = await fetch(\`/api/\${ipInput}\`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch IP data');
                }
                
                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.message || 'Failed to fetch IP data');
                }
                
                displayResults({
                    ip: data.ip,
                    fraudScore: data.fraud_score,
                    riskLevel: translateRiskFromEnglish(data.risk),
                    details: {
                        'Country Name': data.details.country || '-',
                        'Country Code': data.details.country_code || '-',
                        'City': data.details.city || '-',
                        'ISP': data.details.isp || '-',
                        'ISP Name': data.details.isp || '-',
                        'Organization Name': data.details.organization || '-',
                        'Hostname': data.details.hostname || '-',
                        'ASN': data.details.asn || '-',
                        'State / Province': data.details.state || '-',
                        'Postal Code': data.details.postal_code || '-',
                        'Datacenter': data.details.datacenter || '-',
                        'Anonymizing VPN': data.details.vpn || '-',
                        'Tor Exit Node': data.details.tor || '-',
                        'Public Proxy': data.details.proxy || '-',
                        'Server': data.details.server || '-',
                        'Web Proxy': data.details.web_proxy || '-'
                    }
                });
                
            } catch (error) {
                console.error('Error:', error);
                showError(error.message || 'Error fetching data. Please try again.');
            }
        }

        function translateRiskFromEnglish(englishRisk) {
            const translations = {
                'very_low': 'Very Low Risk',
                'low': 'Low Risk',
                'medium': 'Medium Risk',
                'high': 'High Risk',
                'very_high': 'Very High Risk',
                'unknown': 'Unknown'
            };
            return translations[englishRisk] || englishRisk;
        }

        function displayResults(data) {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('error').classList.add('hidden');
            
            const resultsDiv = document.getElementById('results');
            resultsDiv.classList.remove('hidden');

            const scoreCard = document.getElementById('scoreCard');
            if (data.fraudScore <= 25) {
                scoreCard.className = 'rounded-2xl shadow-xl p-8 mb-6 text-white risk-low';
            } else if (data.fraudScore <= 50) {
                scoreCard.className = 'rounded-2xl shadow-xl p-8 mb-6 text-white risk-medium';
            } else if (data.fraudScore <= 75) {
                scoreCard.className = 'rounded-2xl shadow-xl p-8 mb-6 text-white risk-high';
            } else {
                scoreCard.className = 'rounded-2xl shadow-xl p-8 mb-6 text-white risk-very-high';
            }

            document.getElementById('fraudScore').textContent = data.fraudScore;
            document.getElementById('riskLevel').textContent = data.riskLevel;

            document.getElementById('ipAddress').textContent = data.ip;
            document.getElementById('country').textContent = data.details['Country Name'] || '-';
            document.getElementById('city').textContent = data.details['City'] || '-';
            document.getElementById('isp').textContent = data.details['ISP Name'] || data.details['ISP'] || data.details['Organization Name'] || '-';

            const riskFactorsDiv = document.getElementById('riskFactors');
            riskFactorsDiv.innerHTML = '';
            
            const factorsToShow = [
                { key: 'Anonymizing VPN', icon: '🔒' },
                { key: 'Tor Exit Node', icon: '🧅' },
                { key: 'Server', icon: '🖥️' },
                { key: 'Public Proxy', icon: '🌐' },
                { key: 'Web Proxy', icon: '🔄' },
                { key: 'Datacenter', icon: '🏢' }
            ];

            factorsToShow.forEach(factor => {
                const value = data.details[factor.key] || 'No';
                const isYes = value.toLowerCase() === 'yes';
                const isUnknown = value.toLowerCase() === 'unknown';
                riskFactorsDiv.innerHTML += \`
                    <div class="flex justify-between items-center border-b pb-2">
                        <span class="text-gray-600">\${factor.icon} \${factor.key}:</span>
                        <span class="font-semibold \${isYes ? 'text-red-600' : isUnknown ? 'text-orange-600' : 'text-green-600'}">
                            \${value}
                        </span>
                    </div>
                \`;
            });

            const additionalInfoDiv = document.getElementById('additionalInfo');
            additionalInfoDiv.innerHTML = '';
            
            const additionalFields = [
                'Country Code', 
                'State / Province', 
                'Postal Code', 
                'Hostname', 
                'ASN', 
                'Organization Name'
            ];
            
            additionalFields.forEach(field => {
                if (data.details[field] && data.details[field] !== '-') {
                    additionalInfoDiv.innerHTML += \`
                        <div class="bg-gray-50 rounded-lg p-3">
                            <div class="text-xs text-gray-500 mb-1">\${field}</div>
                            <div class="font-semibold text-gray-800">\${data.details[field]}</div>
                        </div>
                    \`;
                }
            });
        }

        function showLoading() {
            document.getElementById('results').classList.add('hidden');
            document.getElementById('error').classList.add('hidden');
            document.getElementById('loading').classList.remove('hidden');
        }

        function showError(message) {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('results').classList.add('hidden');
            document.getElementById('error').classList.remove('hidden');
            document.getElementById('errorMessage').textContent = message;
        }

        function isValidIP(ip) {
            const ipv4Regex = /^(\\d{1,3}\\.){3}\\d{1,3}$/;
            const ipv6Regex = /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/;
            
            if (ipv4Regex.test(ip)) {
                const parts = ip.split('.');
                return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
            }
            
            return ipv6Regex.test(ip);
        }
    </script>
</body>
</html>`;

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

export default {
    async fetch(request, env, ctx) {
        return handleRequest(request);
    }
};

export async function onRequest(context) {
    return handleRequest(context.request);
}

async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    let ip = null;
    
    if (cleanPath) {
        if (cleanPath.startsWith('api/')) {
            ip = cleanPath.substring(4);
        } else {
            ip = cleanPath;
        }
        
        if (ip && isValidIP(ip)) {
            return handleAPIRequest(ip, request);
        }
    }
    
    const apiParam = url.searchParams.get('api');
    if (apiParam) {
        return handleAPIRequest(apiParam, request);
    }
    
    return new Response(HTML_PAGE, {
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=3600'
        }
    });
}

async function handleAPIRequest(ip, request) {
    if (!isValidIP(ip)) {
        return jsonResponse({
            error: true,
            message: 'Invalid IP address format',
            ip: ip
        }, 400);
    }

    const cacheUrl = new URL(request.url);
    cacheUrl.pathname = `/api-cache/${ip}`;
    cacheUrl.search = '';
    const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
    const cache = caches.default;

    let cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
        const responseHeaders = new Headers(cachedResponse.headers);
        responseHeaders.set('X-Cache', 'HIT');
        return new Response(cachedResponse.body, {
            status: cachedResponse.status,
            headers: responseHeaders
        });
    }
    
    try {
        const data = await fetchScamalyticsData(ip);
        
        const apiResponse = {
            success: true,
            ip: data.ip,
            fraud_score: data.fraudScore,
            risk: data.risk,
            details: {
                country: data.details['Country Name'] || null,
                country_code: data.details['Country Code'] || null,
                city: data.details['City'] || null,
                state: data.details['State / Province'] || null,
                postal_code: data.details['Postal Code'] || null,
                isp: data.details['ISP Name'] || data.details['ISP'] || null,
                organization: data.details['Organization Name'] || null,
                hostname: data.details['Hostname'] || null,
                asn: data.details['ASN'] || null,
                datacenter: data.details['Datacenter'] || null,
                vpn: data.details['Anonymizing VPN'] || null,
                tor: data.details['Tor Exit Node'] || null,
                proxy: data.details['Public Proxy'] || null,
                server: data.details['Server'] || null,
                web_proxy: data.details['Web Proxy'] || null
            }
        };
        
        const finalResponse = jsonResponse(apiResponse);
        finalResponse.headers.set('X-Cache', 'MISS');
        finalResponse.headers.set('Cache-Control', 'public, max-age=3600');

        await cache.put(cacheKey, finalResponse.clone());
        
        return finalResponse;
        
    } catch (error) {
        return jsonResponse({
            error: true,
            message: error.message || 'Failed to fetch IP data',
            ip: ip
        }, 500);
    }
}

async function fetchScamalyticsData(ip) {
    const targetUrl = `https://scamalytics.com/ip/${ip}`;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);
        
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': getRandomUserAgent(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const html = await response.text();
            if (html && html.length > 1000 && (html.includes('Fraud Score') || html.includes('scamalytics'))) {
                return parseScamalyticsHTML(html, ip);
            }
        }
    } catch (e) {
    
    }

    const groupA = [
        { name: 'CorsProxyIO', url: `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}` },
        { name: 'Codetabs', url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}` },
        { name: 'AllOrigins Raw', url: `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}` }
    ];

    try {
        const html = await raceProxies(groupA, 4000);
        return parseScamalyticsHTML(html, ip);
    } catch (eA) {
        
        const groupB = [
            { name: 'ThingProxy', url: `https://thingproxy.freeboard.io/fetch/${targetUrl}` },
            { name: 'JSONPlaceholder Proxy', url: `https://jsonp.afeld.me/?url=${encodeURIComponent(targetUrl)}` }
        ];

        try {
            const html = await raceProxies(groupB, 5000);
            return parseScamalyticsHTML(html, ip);
        } catch (eB) {
            throw new Error('All connection paths and mirror proxies failed. Please try again.');
        }
    }
}

async function raceProxies(proxyList, timeoutMs) {
    const promises = proxyList.map(proxy => {
        return (async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
            
            try {
                const response = await fetch(proxy.url, {
                    headers: { 'User-Agent': getRandomUserAgent() },
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`Status ${response.status}`);
                }
                
                const html = await response.text();
                
                if (!html || html.length < 1000) {
                    throw new Error('Response too short');
                }
                if (!html.includes('Fraud Score') && !html.includes('scamalytics')) {
                    throw new Error('Invalid HTML structure');
                }
                
                return html;
            } catch (err) {
                clearTimeout(timeoutId);
                throw err;
            }
        })();
    });

    return new Promise((resolve, reject) => {
        let errors = [];
        let resolved = false;
        
        promises.forEach(p => {
            p.then(val => {
                if (!resolved) {
                    resolved = true;
                    resolve(val);
                }
            }).catch(err => {
                errors.push(err.message);
                if (errors.length === promises.length && !resolved) {
                    reject(new Error("All parallel attempts failed"));
                }
            });
        });
        
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                reject(new Error("Race timeout"));
            }
        }, timeoutMs + 200);
    });
}

function parseScamalyticsHTML(html, ip) {
    let fraudScore = 0;
    let riskLevel = 'unknown';
    const details = {};
    
    const scoreMatch = html.match(/Fraud Score:\s*(\d+)/i);
    if (scoreMatch) {
        fraudScore = parseInt(scoreMatch[1]);
    }
    
    const riskMatch = html.match(/<div class="panel_title[^"]*"[^>]*>(.*?)<\/div>/i);
    if (riskMatch) {
        const riskText = riskMatch[1].trim();
        
        if (riskText.includes('Very Low Risk')) riskLevel = 'very_low';
        else if (riskText.includes('Low Risk')) riskLevel = 'low';
        else if (riskText.includes('Medium Risk')) riskLevel = 'medium';
        else if (riskText.includes('High Risk')) riskLevel = 'high';
        else if (riskText.includes('Very High Risk')) riskLevel = 'very_high';
    }
    
    if (riskLevel === 'unknown') {
        if (fraudScore === 0) riskLevel = 'very_low';
        else if (fraudScore <= 25) riskLevel = 'low';
        else if (fraudScore <= 50) riskLevel = 'medium';
        else if (fraudScore <= 75) riskLevel = 'high';
        else riskLevel = 'very_high';
    }
    
    const tableRowRegex = /<tr>\s*<th>([^<]+)<\/th>\s*<td>(?:<div class="risk[^"]*">)?([^<]+)(?:<\/div>)?<\/td>\s*<\/tr>/gi;
    let match;
    
    while ((match = tableRowRegex.exec(html)) !== null) {
        const key = match[1].trim();
        const value = match[2].trim();
        
        if (key && value && value !== 'n/a') {
            details[key] = value;
        }
    }
    
    const ispMatch = html.match(/<a href="[^"]*\/ip\/isp\/[^"]*">([^<]+)<\/a>/i);
    if (ispMatch) {
        details['ISP Name'] = ispMatch[1].trim();
        details['ISP'] = ispMatch[1].trim();
    }

    return {
        ip: ip,
        fraudScore: fraudScore,
        risk: riskLevel,
        details: details
    };
}

function isValidIP(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/;
    
    if (ipv4Regex.test(ip)) {
        const parts = ip.split('.');
        return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
    }
    
    return ipv6Regex.test(ip);
}

function getRandomUserAgent() {
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data, null, 2), {
        status: status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
