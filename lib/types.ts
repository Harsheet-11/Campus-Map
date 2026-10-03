// ─── Icons ──────────────────────────────────────────────────────────────────
export type MapMode = "general" | "lore" | "fest";

export type SpotAction = "POPUP" | "MENU_CARD" | "COMP_FORM" | "NONE" | null;

export type IconType = "TEMP_PIN" | "PERMANENT_SPOT" | "LORE" | "SYSTEM";

export interface Icon {
  id:          string;
  slug:        string;
  name:        string;
  emoji:       string;
  description: string;
  color:       string;
  icon_type:   IconType;
  is_active:   boolean;
  sort_order:  number;
  created_at:  string;
}

// ─── Permanent Spots ─────────────────────────────────────────────────────────

export interface PermanentSpot {
  id:           string;
  name:         string;
  slang:        string;
  category:     SpotCategory;
  lat:          number;
  lng:          number;
  description:  string;
  min_zoom:     number;
  display_type: DisplayType;
  click_action: ClickAction;
  icon:         SpotIcon | null;
  mode:          MapMode;
}

export interface PermanentSpotFull extends PermanentSpot {
  approved:     boolean;
  is_hidden:    boolean;
  submitted_by: string | null;
  created_at:   string;
  approved_at:  string | null;
}


export type SpotCategory =
  | "CANTEEN"
  | "CHAI"
  | "HANGOUT"
  | "STUDY"
  | "NAP"
  | "DOG_ZONE"
  | "VIBE"
  | "EVENT"
  | "PEACOCK_TERRITORY"
  | "LANDMARK"
  | "HOSTEL"
  | "DEPARTMENT"
  | "ACADEMIC"
  | "FACILITY"
  | "TEMPLE"
  | "SPORTS"
  | "FOOD_COURT"
  | "BAKERY"
  | "FAST_FOOD"
  | "MYSTERY";

// ── New: what the marker looks like on the map ────────────────────────────────
// Stored in DB, not decided by frontend code.
//
// ICON  → emoji only, no name text
// LABEL → name text only, no emoji (icon_id can be NULL in DB)
// BOTH  → emoji + name label together

export type DisplayType = "ICON" | "LABEL" | "BOTH";

// ── New: what happens when the user taps the marker ───────────────────────────
// Stored in DB, not decided by frontend code.
//
// NONE         → nothing happens
// POPUP        → small Leaflet popup opens on the marker
// MENU_CARD    
// LORE_SHEET    

export type ClickAction = "NONE" | "POPUP" | "MENU_CARD" | "COMP_FORM" | "LORE_SHEET";

export interface SpotIcon {
  emoji: string;
  slug:  string;
  color: string;
  icon_type: IconType;
}


// ─── Food Items ──────────────────────────────────────────────────────────────

export type VoteType = "UP" | "DOWN";

export interface FoodItem {
  id:               string;
  dish_name:        string;
  review:           string;
  upvotes:          number;
  downvotes:        number;
  score:            number;
  submitted_by_npc?: string;
  canteen_id:       string;
}

export interface FoodItemWithVote extends FoodItem {
  user_vote: VoteType | null;
}

export interface PendingFoodSubmission {
  id:         string;
  dish_name:  string;
  review:     string;
  created_at: string;
}

// ─── Fest — Phase 5 stubs ────────────────────────────────────────────────────

export type FestEventCategory =
  | "PERFORMANCE"
  | "COMPETITION"
  | "WORKSHOP"
  | "FOOD_STALL"
  | "EXHIBITION"
  | "GENERAL";

export interface FestStatus {
  is_active:  boolean;
  fest_name:  string | null;
  started_at: string | null;
  ends_at:    string | null;
}

export interface FestEvent {
  id:          string;
  name:        string;
  description: string;
  lat:         number;
  lng:         number;
  category:    FestEventCategory;
  timing:      string;
  is_active:   boolean;
  created_at:  string;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export type UserRole = "student" | "admin";

export interface UserStats {
  pins_dropped:         number;
  votes_cast:           number;
  lore_read:            number;
  jump_scares_survived: number;
  naming_wars_won:      number;
  submissions_approved: number;
  dog_spots:            number;
  peacock_spots:        number;
  flood_reports:        number;
}

export interface UserProfile {
  id:                       string;
  npc_name:                 string;
  badges:                   string[];
  stats:                    UserStats;
  jump_scares_enabled:      boolean;
  push_subscription_active: boolean;
  npc_name_locked_until:    string | null;
  created_at:               string;
  role:                     UserRole;
}

// ─── API shapes ───────────────────────────────────────────────────────────────

export interface ApiError {
  error: {
    code:    string;
    message: string;
  };
}

// ─── Lore Stories ─────────────────────────────────────────────────────────────

// Shape used for skull markers on the map — minimal, no content
export interface LoreSpot {
  id:          string;
  title:       string;
  lat:         number;
  lng:         number;
  is_canon:    boolean;
  chill_count: number;
  icon:        string;
}

// Shape used in the story reader — full content
export interface LoreSpotFull extends LoreSpot {
  content:       string;
  location: string;
  scare_count:   number;
}

// ─── Scare Videos ─────────────────────────────────────────────────────────────

export interface ScareVideo {
  id:                   string;
  cloudinary_url_webm:  string;
  cloudinary_url_mp4:   string;
  duration_ms:          number;
}