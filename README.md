# Travel Planner Application

A web application that helps users plan trips by providing:
- Current weather conditions
- Currency exchange rates

## Features
- Search for any city or country
- Check current weather conditions
- See currency exchange rates (default: USD)
- Clean, responsive interface

## APIs Used
1. OpenWeatherMap API - For weather data
2. ExchangeRate-API - For currency exchange rates

## Image Details
- **Docker Hub Repository**: [shumbusho43/travel-planner](https://hub.docker.com/r/shumbusho43/travel-planner)
- **Image Name**: `shumbusho43/travel-planner`
- **Tags Available**: 
  - `v1` (initial stable version)
  - `latest`

## Build Instructions

### Prerequisites
- Docker installed
- Node.js (for local development)

### 1. Clone the repository
```bash
git clone https://github.com/Shumbusho43/travel-planner.git
cd travel-planner
2. Build the Docker image

bash
docker build -t shumbusho43/travel-planner:v1 .
Run Instructions

Local Development

bash
npm install
npm start
Then open http://localhost:8080 in your browser.

Using Docker Locally

bash
docker run -p 8080:8080 shumbusho43/travel-planner:v1
Access the application at http://localhost:8080

With Environment Variables (Recommended for Production)

First create a .env file:

env
OPENWEATHER_API_KEY=your_api_key_here
EXCHANGERATE_API_KEY=your_api_key_here
Then run:

bash
docker run -d --name travel-planner --restart unless-stopped \
  -p 8080:8080 \
  --env-file .env \
  shumbusho43/travel-planner:v1
Load Balancer Configuration (HAProxy)

Relevant Configuration Snippet

haproxy
backend webapps
    balance roundrobin
    server web01 <web01-ip>:8080 check
    server web02 <web02-ip>:8080 check
Reloading HAProxy

After making configuration changes:

bash
haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg
Testing Load Balancing

Verification Method 1: Using curl

bash
for i in {1..5}; do curl -s http://load-balancer-address | grep "Server" || echo "Response received"; done
Verification Method 2: Browser Testing

Access the application through the load balancer URL
Refresh multiple times
Security Hardening (API Key Management)

Best Practices for Production

Never commit API keys to version control
Use environment variables or secret management:
bash
docker run -d -e OPENWEATHER_API_KEY='your_key' \
             -e EXCHANGERATE_API_KEY='your_key' \
             -p 8080:8080 \
             shumbusho43/travel-planner:v1

This project is licensed under the MIT License - see the LICENSE file for details.