export interface EventRecord {
  id: string;
  name: string;
  venue: string;
  keyGuests: string;
  vipContacts: string;
  mood: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventDraft {
  name: string;
  venue: string;
  keyGuests: string;
  vipContacts: string;
  mood: string;
  notes: string;
}
