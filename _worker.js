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
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">Scamalytics IP Checker</h1>
            <p class="text-gray-600">Check IP Fraud Risk & Score Analysis</p>
        </div>

        <div class="mb-6">
            <div class="flex gap-2 bg-white rounded-xl shadow-lg p-2">
                <button id="tabScamalyticsBtn" onclick="switchTab('scamalytics')" class="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors bg-blue-600 text-white">
                    Scamalytics IP Check
                </button>
                <button id="tabCheckhostBtn" onclick="switchTab('checkhost')" class="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors text-gray-600 hover:bg-gray-100">
                    Check-Host Network Test
                </button>
            </div>
        </div>

        <div id="scamalyticsPanel">

        <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div class="flex flex-col sm:flex-row gap-4">
                <input 
                    type="text" 
                    id="ipInput" 
                    placeholder="Enter IP (IPv4/IPv6) or domain, e.g. 8.8.8.8, 2001:4860:4860::8888, example.com"
                    class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button 
                    onclick="checkIP()" 
                    id="checkBtn"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95">
                    Check
                </button>
            </div>
            <p class="text-sm text-gray-500 mt-3">You can also use URL parameter: ?ip=8.8.8.8</p>
            <p class="text-sm text-blue-600 mt-2">API Endpoints: <code class="bg-gray-100 px-2 py-1 rounded">/8.8.8.8</code>, <code class="bg-gray-100 px-2 py-1 rounded">/api/example.com</code> (IPv4, IPv6 and domains are all supported â€” a domain is resolved and every IP behind it is checked)</p>
        </div>

        <div id="loading" class="hidden text-center py-12">
            <div class="loading mx-auto mb-4"></div>
            <p class="text-gray-600">Fetching data...</p>
        </div>

        <div id="error" class="hidden bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 fade-in">
            <div class="flex items-center gap-3">
                <span class="text-3xl">âš ï¸</span>
                <div>
                    <h3 class="font-bold text-red-800">Error Fetching Data</h3>
                    <p id="errorMessage" class="text-red-600"></p>
                </div>
            </div>
        </div>

        <div id="results" class="hidden fade-in">
            <div id="scoreCard" class="rounded-2xl shadow-xl p-8 mb-6 text-white">
                <div class="text-center">
                    <h2 class="text-xl font-semibold mb-2">Fraud Score</h2>
                    <div class="text-7xl font-bold mb-2" id="fraudScore">-</div>
                    <div class="text-2xl font-semibold" id="riskLevel">-</div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                        <span>ðŸŒ</span> IP Information
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

                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                        <span>âš¡</span> Risk Factors
                    </h3>
                    <div class="space-y-3" id="riskFactors">
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                    <span>ðŸ“Š</span> Additional Information
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="additionalInfo">
                </div>
            </div>
        </div>

        <div id="domainResults" class="hidden fade-in">
            <div class="bg-white rounded-2xl shadow-xl p-6 mb-4">
                <h2 class="text-xl font-bold text-gray-800 mb-1">Domain: <span id="domainName" class="text-blue-600"></span></h2>
                <p class="text-sm text-gray-500"><span id="domainIpCount">0</span> IP address(es) resolved. Each one is checked separately below.</p>
            </div>
            <div id="domainResultsList" class="space-y-4"></div>
        </div>

        </div>

        <div id="checkhostPanel" class="hidden">

            <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
                <div class="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        id="chHostInput"
                        placeholder="Host, domain or IP (e.g. example.com or smtp://gmail.com)"
                        class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <select id="chTypeSelect" class="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500">
                        <option value="ping">Ping</option>
                        <option value="http">HTTP</option>
                        <option value="tcp">TCP</option>
                        <option value="udp">UDP</option>
                        <option value="dns">DNS</option>
                    </select>
                    <button
                        onclick="chRunCheck()"
                        id="chCheckBtn"
                        class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95">
                        Run Check
                    </button>
                </div>

                <div class="flex items-center gap-4 mb-3">
                    <label class="text-sm text-gray-600">Fallback max nodes (used only if no country below has a node count selected):</label>
                    <input type="number" id="chMaxNodes" value="3" min="1" max="10" class="w-20 px-2 py-1 border-2 border-gray-300 rounded-lg text-sm">
                </div>

                <div class="border-t pt-4">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-semibold text-gray-700">Countries</h3>
                        <button onclick="chResetNodeSelection()" class="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg">Reset</button>
                    </div>
                    <p class="text-xs text-gray-400 mb-2">The country list, and how many nodes exist in each one, come directly from check-host.net's own node list â€” the worker just relays it.</p>

                    <div class="relative mb-3">
                        <button
                            type="button"
                            id="chCountryDropdownBtn"
                            onclick="chToggleCountryDropdown()"
                            class="w-full flex justify-between items-center px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-white text-left">
                            <span id="chCountryDropdownLabel" class="text-gray-500">Loading countries...</span>
                            <span class="text-gray-400">&#9662;</span>
                        </button>
                        <div id="chCountryDropdownPanel" class="hidden absolute left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-20">
                            <input
                                type="text"
                                id="chCountrySearch"
                                placeholder="Search countries..."
                                oninput="chFilterCountryOptions()"
                                class="w-full px-3 py-2 border-b-2 border-gray-200 rounded-t-lg focus:outline-none text-sm" />
                            <div id="chCountryOptionsList" class="max-h-56 overflow-y-auto"></div>
                        </div>
                    </div>

                    <h4 class="text-sm font-semibold text-gray-700 mb-2">Nodes to use per selected country</h4>
                    <div id="chNodesList" class="divide-y max-h-56 overflow-y-auto border rounded-lg">
                        <p class="text-gray-400 text-sm p-3">Select one or more countries above.</p>
                    </div>
                </div>
            </div>

            <div id="chLoading" class="hidden text-center py-12">
                <div class="loading mx-auto mb-4"></div>
                <p class="text-gray-600">Running check across nodes...</p>
            </div>

            <div id="chError" class="hidden bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 fade-in">
                <div class="flex items-center gap-3">
                    <span class="text-3xl">âš ï¸</span>
                    <div>
                        <h3 class="font-bold text-red-800">Error Running Check</h3>
                        <p id="chErrorMessage" class="text-red-600"></p>
                    </div>
                </div>
            </div>

            <div id="chResults" class="hidden fade-in bg-white rounded-2xl shadow-xl p-6">
                <h3 class="font-bold text-lg mb-4 text-gray-800">Results</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b-2">
                                <th class="py-2 px-3">Location</th>
                                <th class="py-2 px-3">Node</th>
                                <th class="py-2 px-3">Result</th>
                            </tr>
                        </thead>
                        <tbody id="chResultsTable"></tbody>
                    </table>
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
            const rawInput = document.getElementById('ipInput').value.trim();

            if (!rawInput) {
                showError('Please enter an IP address or domain');
                return;
            }

            const inputIsIP = isValidIP(rawInput);
            const inputIsDomain = !inputIsIP && isValidDomain(rawInput);

            if (!inputIsIP && !inputIsDomain) {
                showError('Invalid IP address or domain format');
                return;
            }

            const url = new URL(window.location);
            url.searchParams.set('ip', rawInput);
            window.history.pushState({}, '', url);

            showLoading();

            try {
                const response = await fetch(\`/api/\${rawInput}\`);
                const data = await response.json();

                if (!response.ok || data.error) {
                    throw new Error(data.message || 'Failed to fetch data');
                }

                if (Array.isArray(data.results)) {
                    displayDomainResults(data.info.domain, data.results);
                } else {
                    displayResults({
                        ip: data.info.ip,
                        fraudScore: data.info.fraud_score,
                        riskLevel: translateRiskFromEnglish(data.info.risk),
                        details: {
                            'Country Name': (data.details.country || '-') + ' ' + (data.details.flag || ''),
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
                }

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
            document.getElementById('domainResults').classList.add('hidden');
            
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
                { key: 'Anonymizing VPN', icon: 'ðŸ”’' },
                { key: 'Tor Exit Node', icon: 'ðŸ§…' },
                { key: 'Server', icon: 'ðŸ–¥ï¸' },
                { key: 'Public Proxy', icon: 'ðŸŒ' },
                { key: 'Web Proxy', icon: 'ðŸ”„' },
                { key: 'Datacenter', icon: 'ðŸ¢' }
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

        function displayDomainResults(domain, results) {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('error').classList.add('hidden');
            document.getElementById('results').classList.add('hidden');

            document.getElementById('domainResults').classList.remove('hidden');
            document.getElementById('domainName').textContent = domain;
            document.getElementById('domainIpCount').textContent = results.length;

            const listDiv = document.getElementById('domainResultsList');
            listDiv.innerHTML = '';

            results.forEach(item => {
                if (item.error) {
                    listDiv.innerHTML += \`
                        <div class="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                            <p class="font-semibold text-red-700">\${item.ip || 'Unknown IP'}</p>
                            <p class="text-sm text-red-500">\${item.message || 'Failed to fetch data for this IP'}</p>
                        </div>
                    \`;
                    return;
                }

                const score = item.fraud_score || 0;
                let riskClass = 'risk-low';
                if (score > 75) riskClass = 'risk-very-high';
                else if (score > 50) riskClass = 'risk-high';
                else if (score > 25) riskClass = 'risk-medium';

                const details = item.details || {};
                const country = ((details.country || '-') + ' ' + (details.flag || '')).trim();
                const isp = details.isp || details.organization || '-';

                listDiv.innerHTML += \`
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div class="flex flex-col sm:flex-row">
                            <div class="\${riskClass} text-white p-4 sm:w-40 flex flex-col items-center justify-center text-center">
                                <div class="text-3xl font-bold">\${score}</div>
                                <div class="text-xs">\${translateRiskFromEnglish(item.risk)}</div>
                            </div>
                            <div class="p-4 flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                                <div><span class="text-gray-500">IP:</span> <span class="font-semibold">\${item.ip}</span></div>
                                <div><span class="text-gray-500">Country:</span> <span class="font-semibold">\${country}</span></div>
                                <div><span class="text-gray-500">ISP:</span> <span class="font-semibold">\${isp}</span></div>
                                <div><span class="text-gray-500">VPN:</span> <span class="font-semibold">\${details.vpn || '-'}</span></div>
                                <div><span class="text-gray-500">Tor:</span> <span class="font-semibold">\${details.tor || '-'}</span></div>
                                <div><span class="text-gray-500">Datacenter:</span> <span class="font-semibold">\${details.datacenter || '-'}</span></div>
                            </div>
                        </div>
                    </div>
                \`;
            });
        }

        function showLoading() {
            document.getElementById('results').classList.add('hidden');
            document.getElementById('domainResults').classList.add('hidden');
            document.getElementById('error').classList.add('hidden');
            document.getElementById('loading').classList.remove('hidden');
        }

        function showError(message) {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('results').classList.add('hidden');
            document.getElementById('domainResults').classList.add('hidden');
            document.getElementById('error').classList.remove('hidden');
            document.getElementById('errorMessage').textContent = message;
        }

        function isValidIP(ip) {
            return isValidIPv4(ip) || isValidIPv6(ip);
        }

        function isValidIPv4(ip) {
            const ipv4Regex = /^(\\d{1,3}\\.){3}\\d{1,3}$/;
            if (!ipv4Regex.test(ip)) return false;
            return ip.split('.').every(part => parseInt(part, 10) >= 0 && parseInt(part, 10) <= 255);
        }

        function isValidIPv6(ip) {
            const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/;
            return ipv6Regex.test(ip);
        }

        function isValidDomain(domain) {
            if (!domain || domain.length > 253) return false;
            const domainRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\\.[A-Za-z0-9-]{1,63})*\\.[A-Za-z]{2,}$/;
            return domainRegex.test(domain);
        }

        let chNodesCache = null;
        let chCountryMap = {};

        function switchTab(tab) {
            const scamBtn = document.getElementById('tabScamalyticsBtn');
            const chBtn = document.getElementById('tabCheckhostBtn');
            const scamPanel = document.getElementById('scamalyticsPanel');
            const chPanel = document.getElementById('checkhostPanel');

            const activeClass = 'flex-1 py-2 px-4 rounded-lg font-semibold transition-colors bg-blue-600 text-white';
            const activeClassPurple = 'flex-1 py-2 px-4 rounded-lg font-semibold transition-colors bg-purple-600 text-white';
            const inactiveClass = 'flex-1 py-2 px-4 rounded-lg font-semibold transition-colors text-gray-600 hover:bg-gray-100';

            if (tab === 'scamalytics') {
                scamPanel.classList.remove('hidden');
                chPanel.classList.add('hidden');
                scamBtn.className = activeClass;
                chBtn.className = inactiveClass;
            } else {
                chPanel.classList.remove('hidden');
                scamPanel.classList.add('hidden');
                chBtn.className = activeClassPurple;
                scamBtn.className = inactiveClass;
                if (!chNodesCache) chLoadNodes();
            }
        }

        async function chLoadNodes() {
            const dropdownLabel = document.getElementById('chCountryDropdownLabel');
            dropdownLabel.textContent = 'Loading countries...';
            try {
                const res = await fetch('/checkhost/nodes');
                const data = await res.json();

                if (!res.ok || data.ok === false) {
                    throw new Error(data.message || ('HTTP ' + res.status));
                }

                chNodesCache = data.nodes || {};
                chBuildCountryMap();
                chRenderCountryOptions();
                chUpdateCountryDropdownLabel();
            } catch (e) {
                console.error('Check-Host node list error:', e);
                dropdownLabel.textContent = 'Failed to load countries';
                document.getElementById('chNodesList').innerHTML =
                    '<p class="text-red-500 text-sm p-3">Failed to load the node list from check-host.net (' +
                    (e.message || 'unknown error') +
                    '). You can still run a check using the "max nodes" fallback above.</p>';
            }
        }

        function chBuildCountryMap() {
            const countries = {};
            Object.keys(chNodesCache).forEach(hostId => {
                const info = chNodesCache[hostId] || {};
                const countryName = info.country || 'Unknown';
                if (!countries[countryName]) countries[countryName] = [];
                countries[countryName].push(hostId);
            });
            Object.keys(countries).forEach(c => countries[c].sort());
            chCountryMap = countries;
        }

        function chRenderCountryOptions() {
            const list = document.getElementById('chCountryOptionsList');
            const countryNames = Object.keys(chCountryMap).sort();

            if (countryNames.length === 0) {
                list.innerHTML = '<p class="text-gray-400 text-sm p-3">No countries available.</p>';
                return;
            }

            list.innerHTML = countryNames.map(country => {
                const count = chCountryMap[country].length;
                return \`
                    <label class="ch-country-option flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50" data-country-name="\${country.toLowerCase()}">
                        <span class="flex items-center gap-2">
                            <input type="checkbox" class="ch-country-checkbox" value="\${country}" onchange="chOnCountryToggle()">
                            <span>\${country}</span>
                        </span>
                        <span class="text-gray-400 text-xs">\${count} node\${count > 1 ? 's' : ''}</span>
                    </label>
                \`;
            }).join('');
        }

        function chFilterCountryOptions() {
            const query = document.getElementById('chCountrySearch').value.trim().toLowerCase();
            document.querySelectorAll('.ch-country-option').forEach(row => {
                const name = row.getAttribute('data-country-name') || '';
                row.classList.toggle('hidden', query !== '' && !name.includes(query));
            });
        }

        function chToggleCountryDropdown() {
            const panel = document.getElementById('chCountryDropdownPanel');
            const isHidden = panel.classList.contains('hidden');
            if (isHidden) {
                panel.classList.remove('hidden');
                document.getElementById('chCountrySearch').value = '';
                chFilterCountryOptions();
                setTimeout(() => document.getElementById('chCountrySearch').focus(), 0);
            } else {
                panel.classList.add('hidden');
            }
        }

        document.addEventListener('click', (e) => {
            const panel = document.getElementById('chCountryDropdownPanel');
            const btn = document.getElementById('chCountryDropdownBtn');
            if (!panel || panel.classList.contains('hidden')) return;
            if (!panel.contains(e.target) && !btn.contains(e.target)) {
                panel.classList.add('hidden');
            }
        });

        function chGetSelectedCountries() {
            return Array.from(document.querySelectorAll('.ch-country-checkbox:checked')).map(cb => cb.value);
        }

        function chOnCountryToggle() {
            chUpdateCountryDropdownLabel();
            chRenderCountryNodeCounts();
        }

        function chUpdateCountryDropdownLabel() {
            const label = document.getElementById('chCountryDropdownLabel');
            const selected = chGetSelectedCountries();
            if (selected.length === 0) {
                label.textContent = 'Select countries...';
                label.className = 'text-gray-500';
            } else if (selected.length <= 2) {
                label.textContent = selected.join(', ');
                label.className = 'text-gray-800';
            } else {
                label.textContent = selected.length + ' countries selected';
                label.className = 'text-gray-800';
            }
        }

        function chRenderCountryNodeCounts() {
            const container = document.getElementById('chNodesList');
            const selectedCountries = chGetSelectedCountries();

            if (selectedCountries.length === 0) {
                container.innerHTML = '<p class="text-gray-400 text-sm p-3">Select one or more countries above.</p>';
                return;
            }

            container.innerHTML = '';
            selectedCountries.forEach(country => {
                const ids = chCountryMap[country] || [];
                const max = ids.length;
                if (max === 0) return;

                const row = document.createElement('div');
                row.className = 'flex items-center justify-between px-3 py-2 text-sm';

                let options = '';
                for (let i = 1; i <= max; i++) {
                    options += \`<option value="\${i}">\${i}</option>\`;
                }

                row.innerHTML = \`
                    <span>\${country} <span class="text-gray-400 text-xs">(max \${max})</span></span>
                    <select class="ch-country-count-select border-2 border-gray-200 rounded-lg px-2 py-1 text-sm" data-country="\${country}">
                        \${options}
                    </select>
                \`;
                container.appendChild(row);
            });
        }

        function chResetNodeSelection() {
            document.querySelectorAll('.ch-country-checkbox').forEach(cb => { cb.checked = false; });
            chUpdateCountryDropdownLabel();
            chRenderCountryNodeCounts();
        }

        function chGetSelectedNodes() {
            const selected = [];
            document.querySelectorAll('.ch-country-count-select').forEach(sel => {
                const n = parseInt(sel.value, 10) || 0;
                if (n > 0) {
                    const country = sel.getAttribute('data-country');
                    const ids = (chCountryMap[country] || []).slice(0, n);
                    selected.push(...ids);
                }
            });
            return selected;
        }

        async function chRunCheck() {
            const host = document.getElementById('chHostInput').value.trim();
            const type = document.getElementById('chTypeSelect').value;
            const maxNodes = document.getElementById('chMaxNodes').value;
            const selectedNodes = chGetSelectedNodes();

            if (!host) {
                chShowError('Please enter a host, domain or IP address');
                return;
            }

            chShowLoading();

            try {
                const params = new URLSearchParams();
                params.set('type', type);
                params.set('host', host);

                if (selectedNodes.length > 0) {
                    selectedNodes.forEach(n => params.append('node', n));
                } else if (maxNodes) {
                    params.set('max_nodes', maxNodes);
                }

                const startRes = await fetch('/checkhost/check?' + params.toString());
                const startData = await startRes.json();

                if (!startRes.ok || !startData.ok) {
                    throw new Error(startData.message || 'Failed to start check');
                }

                const requestId = startData.request_id;
                const nodesInfo = startData.nodes || {};

                let attempts = 0;
                let resultData = { results: {} };

                while (attempts < 15) {
                    await new Promise(r => setTimeout(r, 1500));
                    const resultRes = await fetch('/checkhost/result/' + requestId);
                    resultData = await resultRes.json();

                    const values = Object.values(resultData.results || {});
                    const stillPending = values.length === 0 || values.some(v => v === null);
                    if (!stillPending) break;
                    attempts++;
                }

                chDisplayResults(type, nodesInfo, resultData.results || {});

            } catch (error) {
                console.error('Check-Host error:', error);
                chShowError(error.message || 'Error running the check. Please try again.');
            }
        }

        function chShowLoading() {
            document.getElementById('chResults').classList.add('hidden');
            document.getElementById('chError').classList.add('hidden');
            document.getElementById('chLoading').classList.remove('hidden');
        }

        function chShowError(message) {
            document.getElementById('chLoading').classList.add('hidden');
            document.getElementById('chResults').classList.add('hidden');
            document.getElementById('chError').classList.remove('hidden');
            document.getElementById('chErrorMessage').textContent = message;
        }

        function chDisplayResults(type, nodesInfo, results) {
            document.getElementById('chLoading').classList.add('hidden');
            document.getElementById('chError').classList.add('hidden');
            document.getElementById('chResults').classList.remove('hidden');

            const nodeIds = Object.keys(results);
            let rows = '';

            nodeIds.forEach(nodeId => {
                const info = nodesInfo[nodeId] || [];
                const location = [info[2], info[1]].filter(Boolean).join(', ');
                rows += \`
                    <tr class="border-b">
                        <td class="py-2 px-3 font-medium">\${location || '-'}</td>
                        <td class="py-2 px-3 text-sm text-gray-500">\${nodeId}</td>
                        <td class="py-2 px-3">\${chFormatResult(type, results[nodeId])}</td>
                    </tr>
                \`;
            });

            document.getElementById('chResultsTable').innerHTML =
                rows || '<tr><td colspan="3" class="py-4 text-center text-gray-400">No data returned</td></tr>';
        }

        function chFormatResult(type, nodeResult) {
            if (nodeResult === null || nodeResult === undefined) {
                return '<span class="text-orange-500">Pending / no response</span>';
            }
            try {
                if (type === 'ping') {
                    const pings = nodeResult[0] || [];
                    const ok = pings.filter(p => p[0] === 'OK').length;
                    return \`<span class="\${ok > 0 ? 'text-green-600' : 'text-red-600'}">\${ok}/\${pings.length} OK</span>\`;
                }
                if (type === 'http') {
                    const r = nodeResult[0];
                    if (!r) return '<span class="text-gray-400">No data</span>';
                    const status = r[0], time = r[1], msg = r[2], code = r[3];
                    return status === 1
                        ? \`<span class="text-green-600">\${code} \${msg} (\${(time * 1000).toFixed(0)}ms)</span>\`
                        : \`<span class="text-red-600">\${msg || 'Failed'}</span>\`;
                }
                if (type === 'tcp') {
                    const r = nodeResult[0];
                    if (!r) return '<span class="text-gray-400">No data</span>';
                    return r.error
                        ? \`<span class="text-red-600">\${r.error}</span>\`
                        : \`<span class="text-green-600">Connected (\${(r.time * 1000).toFixed(0)}ms)</span>\`;
                }
                if (type === 'udp') {
                    const r = nodeResult[0];
                    if (!r) return '<span class="text-gray-400">No data</span>';
                    return r.error
                        ? \`<span class="text-orange-600">\${r.error}</span>\`
                        : \`<span class="text-green-600">Connected (\${((r.time || 0) * 1000).toFixed(0)}ms)</span>\`;
                }
                if (type === 'dns') {
                    const r = nodeResult[0];
                    if (!r) return '<span class="text-gray-400">No data</span>';
                    const a = (r.A || []).join(', ') || '-';
                    const aaaa = (r.AAAA || []).join(', ') || '-';
                    return \`A: \${a}<br><span class="text-gray-400 text-xs">AAAA: \${aaaa}</span>\`;
                }
            } catch (e) {
                return '<span class="text-gray-400">Parse error</span>';
            }
            return JSON.stringify(nodeResult);
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

    if (cleanPath === 'checkhost' || cleanPath.startsWith('checkhost/')) {
        const chSubPath = cleanPath === 'checkhost' ? '' : cleanPath.substring('checkhost/'.length);
        return chHandleRequest(request, chSubPath);
    }

    let target = null;
    
    if (cleanPath) {
        if (cleanPath.startsWith('api/')) {
            target = cleanPath.substring(4);
        } else {
            target = cleanPath;
        }
        
        if (target && isValidIP(target)) {
            return handleAPIRequest(target, request);
        }
        if (target && isValidDomain(target)) {
            return handleDomainRequest(target, request);
        }
    }
    
    const apiParam = url.searchParams.get('api');
    if (apiParam) {
        if (isValidIP(apiParam)) {
            return handleAPIRequest(apiParam, request);
        }
        if (isValidDomain(apiParam)) {
            return handleDomainRequest(apiParam, request);
        }
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
            info: {
                success: true,
                ip: data.ip,
                fraud_score: data.fraudScore,
                risk: data.risk
            },
            details: buildIpDetails(data)
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

function buildIpDetails(data) {
    const countryCode = data.details['Country Code'] || null;
    const flagEmoji = getFlagEmoji(countryCode);

    return {
        country: data.details['Country Name'] || null,
        country_code: countryCode,
        flag: flagEmoji,
        state: data.details['State / Province'] || null,
        city: data.details['City'] || null,
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
    };
}

async function handleDomainRequest(domain, request) {
    const cacheUrl = new URL(request.url);
    cacheUrl.pathname = `/domain-cache/${domain}`;
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
        const ips = await resolveDomain(domain);

        if (!ips || ips.length === 0) {
            return jsonResponse({
                error: true,
                message: 'Could not resolve this domain to any IPv4/IPv6 address',
                domain: domain
            }, 404);
        }

        const limitedIps = ips.slice(0, 10);

        const results = await Promise.all(limitedIps.map(async (ip) => {
            try {
                const data = await fetchScamalyticsData(ip);
                return {
                    ip: data.ip,
                    fraud_score: data.fraudScore,
                    risk: data.risk,
                    details: buildIpDetails(data)
                };
            } catch (err) {
                return {
                    ip: ip,
                    error: true,
                    message: err.message || 'Failed to fetch data for this IP'
                };
            }
        }));

        const apiResponse = {
            info: {
                success: true,
                domain: domain,
                resolved_count: results.length
            },
            results: results
        };

        const finalResponse = jsonResponse(apiResponse);
        finalResponse.headers.set('X-Cache', 'MISS');
        finalResponse.headers.set('Cache-Control', 'public, max-age=3600');

        await cache.put(cacheKey, finalResponse.clone());

        return finalResponse;

    } catch (error) {
        return jsonResponse({
            error: true,
            message: error.message || 'Failed to resolve domain',
            domain: domain
        }, 500);
    }
}

async function resolveDomain(domain) {
    const doh = (type) => fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`,
        { headers: { 'Accept': 'application/dns-json' } }
    ).then(res => res.ok ? res.json() : { Answer: [] }).catch(() => ({ Answer: [] }));

    const [aData, aaaaData] = await Promise.all([doh('A'), doh('AAAA')]);

    const ips = [];
    (aData.Answer || []).forEach(record => {
        if (record.type === 1 && isValidIP(record.data)) ips.push(record.data);
    });
    (aaaaData.Answer || []).forEach(record => {
        if (record.type === 28 && isValidIP(record.data)) ips.push(record.data);
    });

    return [...new Set(ips)];
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
    return isValidIPv4(ip) || isValidIPv6(ip);
}

function isValidIPv4(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(ip)) return false;
    return ip.split('.').every(part => parseInt(part, 10) >= 0 && parseInt(part, 10) <= 255);
}

function isValidIPv6(ip) {
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/;
    return ipv6Regex.test(ip);
}

function isValidDomain(domain) {
    if (!domain || domain.length > 253) return false;
    const domainRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.[A-Za-z]{2,}$/;
    return domainRegex.test(domain);
}

function getFlagEmoji(countryCode) {
    if (!countryCode || countryCode.length !== 2) return "";
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    try {
        return String.fromCodePoint(...codePoints);
    } catch (e) {
        return "";
    }
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

const CH_ALLOWED_TYPES = ['ping', 'http', 'tcp', 'udp', 'dns'];
const CH_API_BASE = 'https://check-host.net';

async function chHandleRequest(request, chSubPath) {
    if (chSubPath === '' || chSubPath === 'nodes') {
        return chHandleNodesRequest();
    }
    if (chSubPath === 'check') {
        return chHandleCheckRequest(request);
    }
    if (chSubPath.startsWith('result/')) {
        const requestId = chSubPath.substring('result/'.length);
        return chHandleResultRequest(requestId, request);
    }
    return chJsonResponse({ ok: false, message: 'Unknown Check-Host endpoint' }, 404);
}

function chNormalizeNodesMap(rawMap) {
    const nodes = {};
    if (!rawMap || typeof rawMap !== 'object') return nodes;

    Object.keys(rawMap).forEach(hostId => {
        const entry = rawMap[hostId];
        if (Array.isArray(entry)) {
            nodes[hostId] = {
                country_code: entry[0] || null,
                country: entry[1] || null,
                city: entry[2] || null,
                ip: entry[3] || null,
                asn: entry[4] || null
            };
        } else if (entry && typeof entry === 'object') {
            nodes[hostId] = {
                country_code: entry.country_code || null,
                country: entry.country || null,
                city: entry.city || null,
                ip: entry.ip || null,
                asn: entry.asn || null
            };
        }
    });

    return nodes;
}

async function chFetchJson(url) {
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': getRandomUserAgent(),
            'Referer': 'https://check-host.net/',
            'Origin': 'https://check-host.net'
        }
    });

    const contentType = res.headers.get('content-type') || '';
    const bodyText = await res.text();

    if (!contentType.toLowerCase().includes('json')) {
        const snippet = bodyText.slice(0, 180).replace(/\s+/g, ' ').trim();
        throw new Error(`check-host.net returned a non-JSON response (HTTP ${res.status}): "${snippet}"`);
    }

    let data;
    try {
        data = JSON.parse(bodyText);
    } catch (e) {
        throw new Error(`check-host.net returned invalid JSON (HTTP ${res.status})`);
    }

    return { status: res.status, ok: res.ok, data };
}

async function chHandleNodesRequest() {
    const cacheKey = new Request('https://cache.internal/checkhost-nodes-v2', { method: 'GET' });
    const cache = caches.default;

    const cached = await cache.match(cacheKey);
    if (cached) {
        const headers = new Headers(cached.headers);
        headers.set('X-Cache', 'HIT');
        return new Response(cached.body, { status: cached.status, headers });
    }

    try {
        const { ok, status, data: raw } = await chFetchJson(`${CH_API_BASE}/nodes/hosts`);

        if (!ok) {
            throw new Error(`Upstream returned HTTP ${status}`);
        }

        const rawMap = (raw && typeof raw === 'object' && raw.nodes) ? raw.nodes : raw;

        if (!rawMap || typeof rawMap !== 'object' || Array.isArray(rawMap)) {
            throw new Error('Unexpected response shape from check-host.net');
        }

        const nodes = chNormalizeNodesMap(rawMap);

        if (Object.keys(nodes).length === 0) {
            throw new Error('Node list from check-host.net was empty after parsing');
        }

        const response = chJsonResponse({ ok: true, nodes });
        response.headers.set('X-Cache', 'MISS');
        response.headers.set('Cache-Control', 'public, max-age=3600');

        await cache.put(cacheKey, response.clone());
        return response;
    } catch (e) {
        return chJsonResponse({
            ok: false,
            message: 'Failed to fetch Check-Host node list: ' + (e.message || 'unknown error')
        }, 502);
    }
}

async function chHandleCheckRequest(request) {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const host = url.searchParams.get('host');
    const maxNodes = url.searchParams.get('max_nodes');
    const nodes = url.searchParams.getAll('node');

    if (!type || !CH_ALLOWED_TYPES.includes(type)) {
        return chJsonResponse({ ok: false, message: 'Invalid or missing "type" parameter. Allowed: ' + CH_ALLOWED_TYPES.join(', ') }, 400);
    }
    if (!host) {
        return chJsonResponse({ ok: false, message: 'Missing "host" parameter' }, 400);
    }

    const upstream = new URL(`${CH_API_BASE}/check-${type}`);
    upstream.searchParams.set('host', host);

    if (nodes.length > 0) {
        nodes.forEach(n => upstream.searchParams.append('node', n));
    } else {
        const safeMaxNodes = Math.min(Math.max(parseInt(maxNodes, 10) || 3, 1), 10);
        upstream.searchParams.set('max_nodes', String(safeMaxNodes));
    }

    try {
        const { ok, status, data } = await chFetchJson(upstream.toString());

        if (!ok || data.error) {
            const message = Array.isArray(data.error) ? data.error.join(', ') : (data.error || `Upstream returned HTTP ${status}`);
            return chJsonResponse({ ok: false, message }, ok ? 400 : 502);
        }

        return chJsonResponse({
            ok: true,
            request_id: data.request_id || null,
            permanent_link: data.permanent_link || null,
            nodes: chNormalizeNodesMap(data.nodes || {})
        });
    } catch (e) {
        return chJsonResponse({ ok: false, message: 'Failed to start Check-Host check: ' + (e.message || 'unknown error') }, 502);
    }
}

async function chHandleResultRequest(requestId, request) {
    if (!requestId || !/^[a-zA-Z0-9]+$/.test(requestId)) {
        return chJsonResponse({ ok: false, message: 'Invalid request id' }, 400);
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    if (!type || !CH_ALLOWED_TYPES.includes(type)) {
        return chJsonResponse({ ok: false, message: 'Invalid or missing "type" parameter. Allowed: ' + CH_ALLOWED_TYPES.join(', ') }, 400);
    }

    try {
        const { ok, status, data: raw } = await chFetchJson(`${CH_API_BASE}/check-result-extended/${requestId}`);

        if (!ok) {
            throw new Error(`Upstream returned HTTP ${status}`);
        }

        const results = {};
        let finished = true;

        Object.keys(raw || {}).forEach(hostId => {
            const normalized = chNormalizeNodeResult(type, raw[hostId]);
            if (normalized.status === 'pending') finished = false;
            results[hostId] = normalized;
        });

        return chJsonResponse({ ok: true, finished, results });
    } catch (e) {
        return chJsonResponse({ ok: false, message: 'Failed to fetch Check-Host result: ' + (e.message || 'unknown error') }, 502);
    }
}

function chNormalizeNodeResult(type, nodeData) {
    if (nodeData === null || nodeData === undefined) {
        return { status: 'pending', message: 'Waiting for this node to report', time_ms: null };
    }
    try {
        switch (type) {
            case 'ping': return chNormalizePingResult(nodeData);
            case 'http': return chNormalizeHttpResult(nodeData);
            case 'tcp': return chNormalizeTcpResult(nodeData);
            case 'udp': return chNormalizeUdpResult(nodeData);
            case 'dns': return chNormalizeDnsResult(nodeData);
            default: return { status: 'unknown', message: 'Unrecognized check type', time_ms: null };
        }
    } catch (e) {
        return { status: 'error', message: 'Failed to parse result: ' + (e.message || 'unknown error'), time_ms: null };
    }
}

function chNormalizePingResult(nodeData) {
    const attemptsRaw = Array.isArray(nodeData[0]) ? nodeData[0] : [];
    const attempts = attemptsRaw.map(a => {
        const ok = a && a[0] === 'OK';
        return {
            status: ok ? 'ok' : 'timeout',
            time_ms: (ok && typeof a[1] === 'number') ? Math.round(a[1] * 1000) : null,
            ip: (a && a[2]) || null
        };
    });

    const okAttempts = attempts.filter(a => a.status === 'ok');
    const total = attempts.length;

    let status = 'failed';
    if (total > 0 && okAttempts.length === total) status = 'ok';
    else if (okAttempts.length > 0) status = 'partial';

    const avgTime = okAttempts.length
        ? Math.round(okAttempts.reduce((sum, a) => sum + a.time_ms, 0) / okAttempts.length)
        : null;

    return {
        status,
        message: total > 0 ? `${okAttempts.length}/${total} replies received` : 'No response',
        time_ms: avgTime,
        attempts
    };
}

function chNormalizeHttpResult(nodeData) {
    const r = nodeData[0];
    if (!r) return { status: 'failed', message: 'No data returned', time_ms: null };

    const ok = r[0] === 1;
    return {
        status: ok ? 'ok' : 'failed',
        message: r[2] || (ok ? 'OK' : 'Request failed'),
        time_ms: typeof r[1] === 'number' ? Math.round(r[1] * 1000) : null,
        http_code: (r[3] !== undefined && r[3] !== null) ? r[3] : null,
        ip: r[4] || null
    };
}

function chNormalizeTcpResult(nodeData) {
    const r = nodeData[0];
    if (!r) return { status: 'failed', message: 'No data returned', time_ms: null };
    if (r.error) return { status: 'failed', message: r.error, time_ms: null };

    return {
        status: 'ok',
        message: 'Connected',
        time_ms: typeof r.time === 'number' ? Math.round(r.time * 1000) : null,
        ip: r.address || null,
        port: r.port || null
    };
}

function chNormalizeUdpResult(nodeData) {
    const r = nodeData[0];
    if (!r) return { status: 'failed', message: 'No data returned', time_ms: null };
    if (r.error) return { status: 'failed', message: r.error, time_ms: null };

    return {
        status: 'ok',
        message: 'Response received',
        time_ms: typeof r.time === 'number' ? Math.round(r.time * 1000) : null
    };
}

function chNormalizeDnsResult(nodeData) {
    const r = nodeData[0];
    if (!r) return { status: 'failed', message: 'No data returned', time_ms: null, records: {} };

    const records = {};
    ['A', 'AAAA', 'NS', 'MX', 'TXT', 'CNAME', 'SOA'].forEach(key => {
        if (r[key] && r[key].length) records[key] = r[key];
    });

    const hasAny = Object.keys(records).length > 0;
    return {
        status: hasAny ? 'ok' : 'failed',
        message: hasAny ? 'Records resolved' : 'No records found',
        time_ms: null,
        records
    };
}

function chJsonResponse(data, status = 200) {
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
