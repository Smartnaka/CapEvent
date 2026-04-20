import { Moment, MomentType } from '../types/moment';

/** Maximum number of characters allowed in a moment's content field. */
export const MAX_CONTENT_LENGTH = 2000;

/** Maximum number of tags a single moment may carry. */
export const MAX_TAGS_PER_MOMENT = 10;

/** Maximum length of an individual tag string. */
const MAX_TAG_LENGTH = 50;

/** Maximum length of the generated ID. */
const MAX_ID_LENGTH = 128;

const VALID_TYPES: readonly MomentType[] = ['text', 'voice', 'photo'];

/**
 * Type-guard that validates an unknown value is a well-formed Moment.
 * Used when deserialising data from AsyncStorage to prevent corrupted or
 * crafted payloads from propagating through the application.
 */
export function isValidMoment(value: unknown): value is Moment {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const m = value as Record<string, unknown>;

  if (typeof m.id !== 'string' || m.id.length === 0 || m.id.length > MAX_ID_LENGTH) {
    return false;
  }

  if (!VALID_TYPES.includes(m.type as MomentType)) {
    return false;
  }

  if (typeof m.content !== 'string' || m.content.length > MAX_CONTENT_LENGTH) {
    return false;
  }

  if (!Array.isArray(m.tags) || m.tags.length > MAX_TAGS_PER_MOMENT) {
    return false;
  }

  for (const tag of m.tags) {
    if (typeof tag !== 'string' || tag.length === 0 || tag.length > MAX_TAG_LENGTH) {
      return false;
    }
  }

  if (typeof m.createdAt !== 'string' || Number.isNaN(Date.parse(m.createdAt))) {
    return false;
  }

  if (m.mediaUri !== undefined && typeof m.mediaUri !== 'string') {
    return false;
  }

  return true;
}
