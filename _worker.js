const HTML_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Scamalytics IP Checker - API & Fraud Risk Score Analysis</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
            width: 100%;
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
    <div class="w-full max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 box-border">
        <div class="text-center mb-6 sm:mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Scamalytics IP Checker</h1>
            <p class="text-sm sm:text-base text-gray-600">Check IP Fraud Risk & Score Analysis</p>
        </div>

        <div class="mb-6">
            <div class="flex gap-2 bg-white rounded-xl shadow-lg p-1.5 sm:p-2">
                <button id="tabScamalyticsBtn" onclick="switchTab('scamalytics')" class="flex-1 py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base rounded-lg font-semibold transition-colors bg-blue-600 text-white">
                    Scamalytics IP Check
                </button>
                <button id="tabCheckhostBtn" onclick="switchTab('checkhost')" class="flex-1 py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base rounded-lg font-semibold transition-colors text-gray-600 hover:bg-gray-100">
                    Check-Host Network Test
                </button>
            </div>
        </div>

        <div id="scamalyticsPanel">

        <div class="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input 
                    type="text" 
                    id="ipInput" 
                    placeholder="Enter IP or domain, e.g. 8.8.8.8, example.com"
                    class="w-full flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button 
                    onclick="checkIP()" 
                    id="checkBtn"
                    class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base transform active:scale-95">
                    Check
                </button>
            </div>
            <p class="text-xs sm:text-sm text-gray-500 mt-3">You can also use URL parameter: ?ip=8.8.8.8</p>
            <p class="text-xs sm:text-sm text-blue-600 mt-2 break-words">API Endpoints: <code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/8.8.8.8</code>, <code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/api/example.com</code></p>
        </div>

        <div id="loading" class="hidden text-center py-12">
            <div class="loading mx-auto mb-4"></div>
            <p class="text-gray-600 text-sm sm:text-base">Fetching data...</p>
        </div>

        <div id="error" class="hidden bg-red-50 border-2 border-red-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 fade-in">
            <div class="flex items-center gap-3">
                <span class="text-2xl sm:text-3xl">&#9888;&#65039;</span>
                <div class="break-words flex-1">
                    <h3 class="font-bold text-red-800 text-sm sm:text-base">Error Fetching Data</h3>
                    <p id="errorMessage" class="text-red-600 text-xs sm:text-sm mt-1"></p>
                </div>
            </div>
        </div>

        <div id="results" class="hidden fade-in">
            <div id="scoreCard" class="rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white">
                <div class="text-center">
                    <h2 class="text-lg sm:text-xl font-semibold mb-2">Fraud Score</h2>
                    <div class="text-6xl sm:text-7xl font-bold mb-2" id="fraudScore">-</div>
                    <div class="text-xl sm:text-2xl font-semibold" id="riskLevel">-</div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                    <h3 class="font-bold text-base sm:text-lg mb-4 text-gray-800 flex items-center gap-2">
                        <span>&#127760;</span> IP Information
                    </h3>
                    <div class="space-y-3 text-sm sm:text-base">
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-600">IP Address:</span>
                            <span class="font-semibold break-all text-right" id="ipAddress">-</span>
                        </div>
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-600">Country:</span>
                            <span class="font-semibold text-right" id="country">-</span>
                        </div>
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-600">City:</span>
                            <span class="font-semibold text-right" id="city">-</span>
                        </div>
                        <div class="flex justify-between items-start gap-2">
                            <span class="text-gray-600 shrink-0">ISP:</span>
                            <span class="font-semibold text-xs sm:text-sm text-right break-words" id="isp">-</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                    <h3 class="font-bold text-base sm:text-lg mb-4 text-gray-800 flex items-center gap-2">
                        <span>&#9889;</span> Risk Factors
                    </h3>
                    <div class="space-y-3 text-sm sm:text-base" id="riskFactors">
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 class="font-bold text-base sm:text-lg mb-4 text-gray-800 flex items-center gap-2">
                    <span>&#128202;</span> Additional Information
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4" id="additionalInfo">
                </div>
            </div>
        </div>

        <div id="domainResults" class="hidden fade-in">
            <div class="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-4">
                <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-1">Domain: <span id="domainName" class="text-blue-600 break-all"></span></h2>
                <p class="text-xs sm:text-sm text-gray-500"><span id="domainIpCount">0</span> IP address(es) resolved. Each one is checked separately below.</p>
            </div>
            <div id="domainResultsList" class="space-y-4"></div>
        </div>

        </div>

        <div id="checkhostPanel" class="hidden">

            <div class="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8">
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                    <input
                        type="text"
                        id="chHostInput"
                        placeholder="Host, domain or IP (e.g. example.com)"
                        class="w-full flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <button
                        onclick="chRunCheck()"
                        id="chCheckBtn"
                        class="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base transform active:scale-95">
                        Run Check
                    </button>
                </div>
                <p class="text-xs sm:text-sm text-purple-600 mb-2 break-words">API Endpoint: <code class="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/checkhost/us/example.com</code> (type any two-letter country code directly in the URL)</p>

                <div class="pt-2">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-semibold text-sm sm:text-base text-gray-700">Countries</h3>
                        <button onclick="chResetNodeSelection()" class="text-xs px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600">Reset</button>
                    </div>
                    <p class="text-xs text-gray-400 mb-3">Pick one or more countries â€” each one is checked from every check-host.net node in that country.</p>

                    <div class="relative">
                        <button
                            type="button"
                            id="chCountryDropdownBtn"
                            onclick="chToggleCountryDropdown()"
                            class="w-full flex justify-between items-center px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-white text-left">
                            <span id="chCountryDropdownLabel" class="text-gray-500 truncate mr-2">Select countries...</span>
                            <span class="text-gray-400 shrink-0">&#9662;</span>
                        </button>
                        <div id="chCountryDropdownPanel" class="hidden absolute left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-30 max-w-full">
                            <input
                                type="text"
                                id="chCountrySearch"
                                placeholder="Search countries..."
                                oninput="chFilterCountryOptions()"
                                class="w-full px-3 py-2 border-b-2 border-gray-200 rounded-t-lg focus:outline-none text-xs sm:text-sm" />
                            <div id="chCountryOptionsList" class="max-h-48 sm:max-h-56 overflow-y-auto"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="chLoading" class="hidden text-center py-12">
                <div class="loading mx-auto mb-4"></div>
                <p class="text-gray-600 text-sm sm:text-base">Running check...</p>
            </div>

            <div id="chError" class="hidden bg-red-50 border-2 border-red-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 fade-in">
                <div class="flex items-center gap-3">
                    <span class="text-2xl sm:text-3xl">&#9888;&#65039;</span>
                    <div class="break-words flex-1">
                        <h3 class="font-bold text-red-800 text-sm sm:text-base">Error Running Check</h3>
                        <p id="chErrorMessage" class="text-red-600 text-xs sm:text-sm mt-1"></p>
                    </div>
                </div>
            </div>

            <div id="chResults" class="hidden fade-in bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                <h3 class="font-bold text-base sm:text-lg mb-4 text-gray-800">Results</h3>
                <div class="w-full overflow-hidden">
                    <div id="chResultsList" class="space-y-4"></div>
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
                scoreCard.className = 'rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white risk-low';
            } else if (data.fraudScore <= 50) {
                scoreCard.className = 'rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white risk-medium';
            } else if (data.fraudScore <= 75) {
                scoreCard.className = 'rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white risk-high';
            } else {
                scoreCard.className = 'rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white risk-very-high';
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
                { key: 'Anonymizing VPN', icon: '&#128274;' },
                { key: 'Tor Exit Node', icon: '&#129437;' },
                { key: 'Server', icon: '&#128421;&#65039;' },
                { key: 'Public Proxy', icon: '&#127760;' },
                { key: 'Web Proxy', icon: '&#128257;' },
                { key: 'Datacenter', icon: '&#127970;' }
            ];

            factorsToShow.forEach(factor => {
                const value = data.details[factor.key] || 'No';
                const isYes = value.toLowerCase() === 'yes';
                const isUnknown = value.toLowerCase() === 'unknown';
                riskFactorsDiv.innerHTML += \`
                    <div class="flex justify-between items-center border-b pb-2">
                        <span class="text-gray-600 text-xs sm:text-sm">\${factor.icon} \${factor.key}:</span>
                        <span class="font-semibold text-xs sm:text-sm \${isYes ? 'text-red-600' : isUnknown ? 'text-orange-600' : 'text-green-600'}">
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
                        <div class="bg-gray-50 rounded-lg p-2.5 sm:p-3">
                            <div class="text-xs text-gray-500 mb-1">\${field}</div>
                            <div class="font-semibold text-gray-800 text-xs sm:text-sm break-words">\${data.details[field]}</div>
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
                        <div class="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4">
                            <p class="font-semibold text-red-700 text-sm break-all">\${item.ip || 'Unknown IP'}</p>
                            <p class="text-xs text-red-500 mt-1">\${item.message || 'Failed to fetch data for this IP'}</p>
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
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div class="flex flex-col sm:flex-row">
                            <div class="\${riskClass} text-white p-3 sm:p-4 sm:w-36 flex flex-col items-center justify-center text-center">
                                <div class="text-2xl sm:text-3xl font-bold">\${score}</div>
                                <div class="text-xs opacity-90">\${translateRiskFromEnglish(item.risk)}</div>
                            </div>
                            <div class="p-3 sm:p-4 flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs sm:text-sm">
                                <div class="break-all"><span class="text-gray-500">IP:</span> <span class="font-semibold">\${item.ip}</span></div>
                                <div class="truncate"><span class="text-gray-500">Country:</span> <span class="font-semibold">\${country}</span></div>
                                <div class="truncate"><span class="text-gray-500">ISP:</span> <span class="font-semibold">\${isp}</span></div>
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

        const CH_COUNTRIES = [
            ['us', 'United States'], ['ca', 'Canada'], ['gb', 'United Kingdom'], ['de', 'Germany'],
            ['fr', 'France'], ['nl', 'Netherlands'], ['ru', 'Russia'], ['ua', 'Ukraine'],
            ['pl', 'Poland'], ['se', 'Sweden'], ['fi', 'Finland'], ['no', 'Norway'],
            ['dk', 'Denmark'], ['it', 'Italy'], ['es', 'Spain'], ['ch', 'Switzerland'],
            ['at', 'Austria'], ['be', 'Belgium'], ['cz', 'Czechia'], ['ro', 'Romania'],
            ['bg', 'Bulgaria'], ['gr', 'Greece'], ['tr', 'Turkey'], ['il', 'Israel'],
            ['ae', 'United Arab Emirates'], ['sa', 'Saudi Arabia'], ['ir', 'Iran'], ['in', 'India'],
            ['cn', 'China'], ['jp', 'Japan'], ['kr', 'South Korea'], ['sg', 'Singapore'],
            ['hk', 'Hong Kong'], ['tw', 'Taiwan'], ['vn', 'Vietnam'], ['th', 'Thailand'],
            ['id', 'Indonesia'], ['my', 'Malaysia'], ['ph', 'Philippines'], ['au', 'Australia'],
            ['br', 'Brazil'], ['mx', 'Mexico'], ['ar', 'Argentina'], ['za', 'South Africa'],
            ['eg', 'Egypt'], ['kz', 'Kazakhstan']
        ];

        function switchTab(tab) {
            const scamBtn = document.getElementById('tabScamalyticsBtn');
            const chBtn = document.getElementById('tabCheckhostBtn');
            const scamPanel = document.getElementById('scamalyticsPanel');
            const chPanel = document.getElementById('checkhostPanel');

            const activeClass = 'flex-1 py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base rounded-lg font-semibold transition-colors bg-blue-600 text-white';
            const activeClassPurple = 'flex-1 py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base rounded-lg font-semibold transition-colors bg-purple-600 text-white';
            const inactiveClass = 'flex-1 py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base rounded-lg font-semibold transition-colors text-gray-600 hover:bg-gray-100';

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
                if (document.getElementById('chCountryOptionsList').children.length === 0) {
                    chRenderCountryOptions();
                }
            }
        }

        function chRenderCountryOptions() {
            const list = document.getElementById('chCountryOptionsList');
            list.innerHTML = CH_COUNTRIES.map(([code, name]) => \`
                <label class="ch-country-option flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50" data-country-name="\${name.toLowerCase()}">
                    <input type="checkbox" class="ch-country-checkbox" value="\${code}" onchange="chOnCountryToggle()">
                    <span>\${name} <span class="text-gray-400 text-xs">(\${code})</span></span>
                </label>
            \`).join('');
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
        }

        function chUpdateCountryDropdownLabel() {
            const label = document.getElementById('chCountryDropdownLabel');
            const selected = chGetSelectedCountries();
            if (selected.length === 0) {
                label.textContent = 'Select countries...';
                label.className = 'text-gray-500 truncate mr-2';
            } else if (selected.length <= 2) {
                label.textContent = selected.map(c => c.toUpperCase()).join(', ');
                label.className = 'text-gray-800 truncate mr-2';
            } else {
                label.textContent = selected.length + ' countries selected';
                label.className = 'text-gray-800 truncate mr-2';
            }
        }

        function chResetNodeSelection() {
            document.querySelectorAll('.ch-country-checkbox').forEach(cb => { cb.checked = false; });
            chUpdateCountryDropdownLabel();
        }

        async function chRunCheck() {
            const host = document.getElementById('chHostInput').value.trim();
            const selectedCountries = chGetSelectedCountries();

            if (!host) {
                chShowError('Please enter a host, domain or IP address');
                return;
            }
            if (selectedCountries.length === 0) {
                chShowError('Select at least one country');
                return;
            }

            chShowLoading();

            try {
                const params = new URLSearchParams();
                params.set('host', host);
                selectedCountries.forEach(c => params.append('country', c));

                const res = await fetch('/checkhost/check?' + params.toString());
                const data = await res.json();

                if (!res.ok || !data.ok) {
                    throw new Error(data.message || 'Failed to run check');
                }

                chDisplayResults(data.host, data.results);

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

        function chDisplayResults(host, results) {
            document.getElementById('chLoading').classList.add('hidden');
            document.getElementById('chError').classList.add('hidden');
            document.getElementById('chResults').classList.remove('hidden');

            const listDiv = document.getElementById('chResultsList');
            listDiv.innerHTML = '';

            results.forEach(entry => {
                if (!entry.ok) {
                    listDiv.innerHTML += \`
                        <div class="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                            <p class="font-semibold text-red-700">\${entry.country.toUpperCase()}</p>
                            <p class="text-sm text-red-500">\${entry.message || 'Request failed'}</p>
                        </div>
                    \`;
                    return;
                }

                const d = entry.data;
                const accessible = !!d.is_accessible;
                const badgeClass = accessible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
                const badgeText = accessible ? 'Accessible' : 'Not accessible';

                let nodeRows = '';
                Object.keys(d.details || {}).forEach(nodeId => {
                    const n = d.details[nodeId] || {};
                    const nodeOk = n.status === 'OK';
                    nodeRows += \`
                        <tr class="border-b last:border-b-0">
                            <td class="py-1.5 px-2 text-xs sm:text-sm text-gray-600">\${nodeId}</td>
                            <td class="py-1.5 px-2 text-xs sm:text-sm font-semibold \${nodeOk ? 'text-green-600' : 'text-red-600'}">\${n.status || '-'}</td>
                            <td class="py-1.5 px-2 text-xs sm:text-sm text-gray-700">\${n.ping_ms != null ? n.ping_ms + ' ms' : '-'}</td>
                        </tr>
                    \`;
                });

                listDiv.innerHTML += \`
                    <div class="border-2 border-gray-100 rounded-xl p-4">
                        <div class="flex items-center justify-between mb-1">
                            <h4 class="font-bold text-gray-800">\${(d.country || entry.country).toUpperCase()}</h4>
                            <span class="px-3 py-1 rounded-full text-xs font-semibold \${badgeClass}">\${badgeText}</span>
                        </div>
                        <p class="text-xs sm:text-sm text-gray-500 mb-3">\${d.nodes_checked || 0} node(s) checked for \${d.host || host}</p>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="border-b text-gray-500 text-xs">
                                        <td class="py-1 px-2">Node</td>
                                        <td class="py-1 px-2">Status</td>
                                        <td class="py-1 px-2">Ping</td>
                                    </tr>
                                </thead>
                                <tbody>\${nodeRows}</tbody>
                            </table>
                        </div>
                        \${d.report_url ? \`<a href="\${d.report_url}" target="_blank" rel="noopener noreferrer" class="inline-block mt-3 text-xs sm:text-sm text-purple-600 hover:underline">View full report on check-host.net &rarr;</a>\` : ''}
                    </div>
                \`;
            });
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
            'Content-Type': 'text/html; charset=UTF-8',
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

const CH_RENDER_API_BASE = 'https://check-host.onrender.com';

async function chHandleRequest(request, chSubPath) {
    if (chSubPath === 'check') {
        return chHandleCheckRequest(request);
    }

    const parts = chSubPath.split('/').filter(Boolean);
    if (parts.length >= 2) {
        const country = parts[0];
        const host = parts.slice(1).join('/');
        return chHandleDirectRequest(country, host);
    }

    return chJsonResponse({ ok: false, message: 'Unknown Check-Host endpoint' }, 404);
}

async function chHandleDirectRequest(country, host) {
    if (!country || !/^[a-zA-Z]{2,3}$/.test(country)) {
        return chJsonResponse({ ok: false, message: 'Invalid country code format (expected e.g. "us", "de", "ir")' }, 400);
    }
    if (!host) {
        return chJsonResponse({ ok: false, message: 'Missing host' }, 400);
    }

    const result = await chCheckSingleCountry(host, country.toLowerCase());

    if (!result.ok) {
        return chJsonResponse({ ok: false, message: result.message, country: country.toLowerCase(), host }, 502);
    }

    return chJsonResponse({ ok: true, ...result.data });
}

async function chHandleCheckRequest(request) {
    const url = new URL(request.url);
    const host = url.searchParams.get('host');
    const countries = url.searchParams.getAll('country');

    if (!host) {
        return chJsonResponse({ ok: false, message: 'Missing "host" parameter' }, 400);
    }
    if (countries.length === 0) {
        return chJsonResponse({ ok: false, message: 'Select at least one country' }, 400);
    }

    const limitedCountries = countries.slice(0, 10);

    const results = await Promise.all(limitedCountries.map(country => chCheckSingleCountry(host, country.toLowerCase())));

    return chJsonResponse({ ok: true, host, results });
}

async function chCheckSingleCountry(host, country) {
    const cacheUrl = new URL('https://cache.internal/checkhost-render');
    cacheUrl.searchParams.set('country', country);
    cacheUrl.searchParams.set('host', host);
    const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
    const cache = caches.default;

    const cached = await cache.match(cacheKey);
    if (cached) {
        const data = await cached.json();
        return { country, ok: true, data };
    }

    const target = `${CH_RENDER_API_BASE}/${encodeURIComponent(country)}/${encodeURIComponent(host)}`;

    try {
        const res = await fetch(target, {
            headers: { 'Accept': 'application/json' }
        });

        const contentType = res.headers.get('content-type') || '';
        const bodyText = await res.text();

        if (!contentType.toLowerCase().includes('json')) {
            const snippet = bodyText.slice(0, 150).replace(/\s+/g, ' ').trim();
            throw new Error(`Non-JSON response (HTTP ${res.status}): "${snippet}"`);
        }

        let data;
        try {
            data = JSON.parse(bodyText);
        } catch (e) {
            throw new Error(`Invalid JSON response (HTTP ${res.status})`);
        }

        if (!res.ok) {
            throw new Error((data && data.message) || `HTTP ${res.status}`);
        }

        const cacheResponse = new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' }
        });
        await cache.put(cacheKey, cacheResponse);

        return { country, ok: true, data };
    } catch (e) {
        return { country, ok: false, message: e.message || 'Request failed' };
    }
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
