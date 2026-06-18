import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tauriStorage } from '../services/tauriStorage';
import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  State,
  type Card as FSRSCard,
  type Grade,
  type RecordLog,
} from 'ts-fsrs';

export type CardType = 'vocab' | 'kanji' | 'grammar';

export interface StudyCard {
  id: string;
  type: CardType;
  contentId: number;
  fsrsCard: FSRSCard;
  addedAt: string;
}

// Serialized version for localStorage
interface SerializedStudyCard {
  id: string;
  type: CardType;
  contentId: number;
  fsrsCard: {
    due: string;
    stability: number;
    difficulty: number;
    elapsed_days: number;
    scheduled_days: number;
    reps: number;
    lapses: number;
    state: number;
    last_review?: string;
  };
  addedAt: string;
}

const scheduler = fsrs(generatorParameters());

function serializeCard(card: FSRSCard): SerializedStudyCard['fsrsCard'] {
  return {
    due: new Date(card.due).toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as number,
    last_review: card.last_review ? new Date(card.last_review).toISOString() : undefined,
  };
}

function deserializeCard(serialized: SerializedStudyCard['fsrsCard']): FSRSCard {
  return {
    due: new Date(serialized.due),
    stability: serialized.stability,
    difficulty: serialized.difficulty,
    elapsed_days: serialized.elapsed_days,
    scheduled_days: serialized.scheduled_days,
    reps: serialized.reps,
    lapses: serialized.lapses,
    state: serialized.state as State,
    last_review: serialized.last_review ? new Date(serialized.last_review) : undefined,
  };
}

interface FSRSState {
  cards: SerializedStudyCard[];

  addCard: (type: CardType, contentId: number) => void;
  removeCard: (id: string) => void;
  reviewCard: (id: string, rating: Grade) => void;

  getCardsByType: (type: CardType) => StudyCard[];
  getDueCards: () => StudyCard[];
  getNewCards: (type?: CardType) => StudyCard[];
  getCardForContent: (type: CardType, contentId: number) => StudyCard | undefined;
  isCardAdded: (type: CardType, contentId: number) => boolean;

  getTotalCards: () => number;
  getDueCount: () => number;
  getMasteredCount: () => number;
  getReviewableCards: (limit?: number) => StudyCard[];
}

function hydrateCard(sc: SerializedStudyCard): StudyCard {
  return {
    ...sc,
    fsrsCard: deserializeCard(sc.fsrsCard),
  };
}

export const useFSRSStore = create<FSRSState>()(
  persist(
    (set, get) => ({
      cards: [],

      addCard: (type, contentId) => {
        const id = `${type}-${contentId}`;
        const existing = get().cards.find(c => c.id === id);
        if (existing) return;

        const emptyCard = createEmptyCard(new Date());
        const newCard: SerializedStudyCard = {
          id,
          type,
          contentId,
          fsrsCard: serializeCard(emptyCard),
          addedAt: new Date().toISOString(),
        };

        set(state => ({ cards: [...state.cards, newCard] }));
      },

      removeCard: (id) => {
        set(state => ({ cards: state.cards.filter(c => c.id !== id) }));
      },

      reviewCard: (id, rating) => {
        set(state => {
          const cardIndex = state.cards.findIndex(c => c.id === id);
          if (cardIndex === -1) return state;

          const serializedCard = state.cards[cardIndex];
          const fsrsCard = deserializeCard(serializedCard.fsrsCard);

          const now = new Date();
          const recordLog: RecordLog = scheduler.repeat(fsrsCard, now);
          const result = recordLog[rating];

          const updatedCards = [...state.cards];
          updatedCards[cardIndex] = {
            ...serializedCard,
            fsrsCard: serializeCard(result.card),
          };

          return { cards: updatedCards };
        });
      },

      getCardsByType: (type) => {
        return get().cards.filter(c => c.type === type).map(hydrateCard);
      },

      getDueCards: () => {
        const now = new Date();
        return get().cards
          .filter(c => {
            const card = deserializeCard(c.fsrsCard);
            return card.state !== State.New && new Date(card.due) <= now;
          })
          .map(hydrateCard);
      },

      getNewCards: (type?) => {
        return get().cards
          .filter(c => {
            const card = deserializeCard(c.fsrsCard);
            return card.state === State.New && (type ? c.type === type : true);
          })
          .map(hydrateCard);
      },

      getCardForContent: (type, contentId) => {
        const found = get().cards.find(c => c.type === type && c.contentId === contentId);
        return found ? hydrateCard(found) : undefined;
      },

      isCardAdded: (type, contentId) => {
        return get().cards.some(c => c.type === type && c.contentId === contentId);
      },

      getTotalCards: () => get().cards.length,

      getDueCount: () => {
        const now = new Date();
        return get().cards.filter(c => {
          const card = deserializeCard(c.fsrsCard);
          return card.state !== State.New && new Date(card.due) <= now;
        }).length;
      },

      getMasteredCount: () => {
        return get().cards.filter(c => {
          const card = deserializeCard(c.fsrsCard);
          return card.state === State.Review && card.stability > 21;
        }).length;
      },

      getReviewableCards: (limit = 20) => {
        const now = new Date();
        const allCards = get().cards;

        // Priority: due cards first, then new cards
        const due = allCards.filter(c => {
          const card = deserializeCard(c.fsrsCard);
          return card.state !== State.New && new Date(card.due) <= now;
        });

        const newCards = allCards.filter(c => {
          const card = deserializeCard(c.fsrsCard);
          return card.state === State.New;
        });

        const combined = [...due, ...newCards].slice(0, limit);
        return combined.map(hydrateCard);
      },
    }),
    {
      name: 'triolingo-fsrs',
      storage: tauriStorage,
    }
  )
);
