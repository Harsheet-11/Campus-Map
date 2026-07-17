export const CAMPUS_BOUNDS = {
  SW: { 
    lat: 22.24335, 
    lng: 84.89324 
  },
  NE: { 
    lat: 22.25709, 
    lng: 84.91599 
  },
} 

export const CAMPUS_CENTER = {
  lat: (CAMPUS_BOUNDS.SW.lat + CAMPUS_BOUNDS.NE.lat) / 2,
  lng: (CAMPUS_BOUNDS.SW.lng + CAMPUS_BOUNDS.NE.lng) / 2,
} as const;

export const DEFAULT_ZOOM = 15;
export const MIN_ZOOM     = 15;
export const MAX_ZOOM     = 17;