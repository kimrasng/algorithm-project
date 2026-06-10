import { DistributionType } from '../algorithms/types';

function generateDomains(count: number): string[] {
  const tlds = ['com', 'net', 'org', 'io', 'dev'];
  const domains: string[] = [];
  for (let i = 0; i < count; i++) {
    const tld = tlds[i % tlds.length];
    domains.push(`domain-${i}.${tld}`);
  }
  return domains;
}

function uniformDistribution(domains: string[], requestCount: number): string[] {
  const requests: string[] = [];
  for (let i = 0; i < requestCount; i++) {
    requests.push(domains[i % domains.length]);
  }
  return requests;
}

function zipfDistribution(domains: string[], requestCount: number): string[] {
  const n = domains.length;
  const weights: number[] = [];
  let totalWeight = 0;

  for (let i = 1; i <= n; i++) {
    const w = 1 / i;
    weights.push(w);
    totalWeight += w;
  }

  const cdf: number[] = [];
  let cumulative = 0;
  for (let i = 0; i < n; i++) {
    cumulative += weights[i] / totalWeight;
    cdf.push(cumulative);
  }

  const requests: string[] = [];
  for (let i = 0; i < requestCount; i++) {
    const r = Math.random();
    let idx = 0;
    while (idx < cdf.length - 1 && r > cdf[idx]) {
      idx++;
    }
    requests.push(domains[idx]);
  }
  return requests;
}

function randomDistribution(domains: string[], requestCount: number): string[] {
  const requests: string[] = [];
  for (let i = 0; i < requestCount; i++) {
    const idx = Math.floor(Math.random() * domains.length);
    requests.push(domains[idx]);
  }
  return requests;
}

export function generateRequests(
  domainCount: number,
  requestCount: number,
  distribution: DistributionType
): string[] {
  const domains = generateDomains(domainCount);

  switch (distribution) {
    case 'uniform':
      return uniformDistribution(domains, requestCount);
    case 'zipf':
      return zipfDistribution(domains, requestCount);
    case 'random':
      return randomDistribution(domains, requestCount);
  }
}
