export interface OfficialWebsite {
  service: string;
  url: string;
  domain: string;
  verified: boolean;
  departmentName: string;
  notes?: string;
}

export interface OfficialWebsiteResolver {
  resolve(serviceQuery: string): Promise<OfficialWebsite>;
}

// Registry of verified government, public transport, and banking portals
export const VERIFIED_OFFICIAL_REGISTRY: Record<string, OfficialWebsite> = {
  'irctc': {
    service: 'Indian Railway Ticket Booking (IRCTC)',
    url: 'https://www.irctc.co.in/nget/',
    domain: 'irctc.co.in',
    verified: true,
    departmentName: 'Indian Railway Catering and Tourism Corporation'
  },
  'train': {
    service: 'Indian Railway Ticket Booking (IRCTC)',
    url: 'https://www.irctc.co.in/nget/',
    domain: 'irctc.co.in',
    verified: true,
    departmentName: 'Indian Railway Catering and Tourism Corporation'
  },
  'airindia': {
    service: 'Air India National Carrier',
    url: 'https://www.airindia.com',
    domain: 'airindia.com',
    verified: true,
    departmentName: 'Air India Ltd.'
  },
  'flight': {
    service: 'Airlines & Flight Portals',
    url: 'https://www.airindia.com',
    domain: 'airindia.com',
    verified: true,
    departmentName: 'Official Airline Portal'
  },
  'sbi': {
    service: 'State Bank of India NetBanking',
    url: 'https://www.onlinesbi.sbi',
    domain: 'onlinesbi.sbi',
    verified: true,
    departmentName: 'State Bank of India'
  },
  'banking': {
    service: 'State Bank of India NetBanking',
    url: 'https://www.onlinesbi.sbi',
    domain: 'onlinesbi.sbi',
    verified: true,
    departmentName: 'State Bank of India'
  },
  'pension': {
    service: 'Jeevan Pramaan Digital Life Certificate',
    url: 'https://jeevanpramaan.gov.in',
    domain: 'jeevanpramaan.gov.in',
    verified: true,
    departmentName: 'Govt of India Pensioners Portal'
  },
  'aadhaar': {
    service: 'UIDAI Official Aadhaar Portal',
    url: 'https://myaadhaar.uidai.gov.in',
    domain: 'uidai.gov.in',
    verified: true,
    departmentName: 'Unique Identification Authority of India'
  }
};

export class RealOfficialWebsiteResolver implements OfficialWebsiteResolver {
  public async resolve(serviceQuery: string): Promise<OfficialWebsite> {
    const q = serviceQuery.toLowerCase().trim();
    
    for (const [key, item] of Object.entries(VERIFIED_OFFICIAL_REGISTRY)) {
      if (q.includes(key) || key.includes(q)) {
        return item;
      }
    }

    // If not verified in official government/bank registry, NEVER fabricate a fake URL
    return {
      service: serviceQuery,
      url: '',
      domain: '',
      verified: false,
      departmentName: 'Unverified Service',
      notes: "Could not verify official portal in certified national directory. Please do not submit sensitive credentials."
    };
  }
}

export class MockOfficialWebsiteResolver implements OfficialWebsiteResolver {
  private customMocks: Map<string, OfficialWebsite> = new Map();

  constructor(custom?: Record<string, OfficialWebsite>) {
    if (custom) {
      Object.entries(custom).forEach(([k, v]) => this.customMocks.set(k.toLowerCase(), v));
    }
  }

  public async resolve(serviceQuery: string): Promise<OfficialWebsite> {
    const q = serviceQuery.toLowerCase().trim();
    if (this.customMocks.has(q)) {
      return this.customMocks.get(q)!;
    }

    for (const [key, item] of Object.entries(VERIFIED_OFFICIAL_REGISTRY)) {
      if (q.includes(key) || key.includes(q)) {
        return item;
      }
    }

    return {
      service: serviceQuery,
      url: '',
      domain: '',
      verified: false,
      departmentName: 'Unverified External Domain'
    };
  }
}
