import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  User,
  Send,
  BookOpen,
  MessageSquare,
  RotateCcw,
  Zap,
  ArrowLeft,
  Trophy,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  hasApiKey,
  sendMessage,
  type ChatMessage as AIChatMessage,
  type AITutorConfig,
} from '../../services/aiService';
import { useUserStore } from '../../stores/userStore';

// ── Data ──────────────────────────────────────────────────────

const TOPICS = [
  { id: 'greetings', title: 'Greetings & Introductions', titleJp: '挨拶と自己紹介', icon: '👋', color: '#22c55e', difficulty: 'Beginner' },
  { id: 'restaurant', title: 'At a Restaurant', titleJp: 'レストランで', icon: '🍜', color: '#f59e0b', difficulty: 'Beginner' },
  { id: 'shopping', title: 'Shopping', titleJp: '買い物', icon: '🛍️', color: '#3b82f6', difficulty: 'Intermediate' },
  { id: 'directions', title: 'Asking for Directions', titleJp: '道を聞く', icon: '🗺️', color: '#8b5cf6', difficulty: 'Intermediate' },
  { id: 'workplace', title: 'At the Workplace', titleJp: '職場で', icon: '💼', color: '#ef4444', difficulty: 'Advanced' },
  { id: 'travel', title: 'Travel & Transportation', titleJp: '旅行と交通', icon: '✈️', color: '#06b6d4', difficulty: 'Advanced' },
];

interface ScriptedMessage {
  id: number;
  role: 'tutor' | 'user';
  text: string;
  textJp?: string;
  translation?: string;
  options?: string[];
}

const CONVERSATIONS: Record<string, ScriptedMessage[]> = {
  greetings: [
    { id: 1, role: 'tutor', text: 'Welcome! Let\'s practice Japanese greetings! 🌸', textJp: 'ようこそ！日本語の挨拶を練習しましょう！' },
    { id: 2, role: 'tutor', text: 'How would you greet someone in the morning?', options: ['おはようございます', 'こんにちは', 'こんばんは', 'さようなら'] },
    { id: 3, role: 'tutor', text: '正解！ おはようございます (ohayou gozaimasu) means "Good morning"! It\'s the polite form. Among friends, you can just say おはよう!', textJp: 'おはようございます = Good morning (丁寧)' },
    { id: 4, role: 'tutor', text: 'Now, how about an afternoon greeting?', options: ['おはよう', 'こんにちは', 'こんばんは', 'いらっしゃいませ'] },
    { id: 5, role: 'tutor', text: 'Perfect! こんにちは (konnichiwa) is used from late morning until evening. It\'s one of the most well-known Japanese greetings!', textJp: 'こんにちは = Hello / Good afternoon' },
    { id: 6, role: 'tutor', text: 'Let\'s try introducing yourself! How do you say "I am [name]" in Japanese?', options: ['私は___です', 'あなたは___です', '名前は___か', '私が___だ'] },
    { id: 7, role: 'tutor', text: '素晴らしい！ 私は___です (watashi wa ___ desu) is the standard self-introduction pattern. You can also add はじめまして (hajimemashite - nice to meet you) before it!', textJp: '私は___です = I am ___' },
    { id: 8, role: 'tutor', text: 'Great job! You\'ve learned the basics of Japanese greetings! 🎉 You earned 20 XP!', textJp: 'お疲れ様でした！' },
  ],
  restaurant: [
    { id: 1, role: 'tutor', text: 'Let\'s practice ordering at a Japanese restaurant! 🍜', textJp: 'レストランでの注文を練習しましょう！' },
    { id: 2, role: 'tutor', text: 'You enter a ramen shop. The staff says いらっしゃいませ! What do you say for a table for one?', options: ['一人です', '二人です', '三人です', 'すみません'] },
    { id: 3, role: 'tutor', text: '正解! 一人です (hitori desu) means "one person" / "table for one". The counter for people is special in Japanese!', textJp: '一人 = ひとり (one person)' },
    { id: 4, role: 'tutor', text: 'The waiter asks what you\'d like. How do you order?', options: ['ラーメンをください', 'ラーメンを食べる', 'ラーメンがある', 'ラーメンだ'] },
    { id: 5, role: 'tutor', text: 'Perfect! ___をください (___wo kudasai) means "please give me ___". It\'s the most common ordering pattern!', textJp: '___をください = ___please' },
    { id: 6, role: 'tutor', text: 'After eating, how do you ask for the check?', options: ['お会計お願いします', 'ごちそうさまでした', 'いただきます', 'おいしい'] },
    { id: 7, role: 'tutor', text: 'お会計お願いします (okaikei onegaishimasu) is the polite way to ask for the bill. Well done!', textJp: 'お会計 = check/bill' },
    { id: 8, role: 'tutor', text: 'Excellent! You can now handle a restaurant visit! 🎉 You earned 25 XP!', textJp: 'お疲れ様でした！' },
  ],
  shopping: [
    { id: 1, role: 'tutor', text: 'Let\'s go shopping in Japan! 🛍️ You\'re at a clothing store.', textJp: '日本で買い物をしましょう！' },
    { id: 2, role: 'tutor', text: 'You see a nice shirt. How do you ask how much it costs?', options: ['これはいくらですか？', 'これは何ですか？', 'これをください', 'どこですか？'] },
    { id: 3, role: 'tutor', text: 'いくらですか (ikura desu ka) means "How much is it?". これ (kore) means "this". Very useful for shopping!', textJp: 'いくら = how much' },
    { id: 4, role: 'tutor', text: 'The clerk says ¥3,000. You want to try it on. What do you say?', options: ['試着してもいいですか？', '買いたいです', 'いりません', '高いですね'] },
    { id: 5, role: 'tutor', text: '試着してもいいですか (shichaku shitemo ii desu ka) means "May I try it on?" The ～てもいいですか pattern is used for asking permission!', textJp: '試着 = trying on clothes' },
    { id: 6, role: 'tutor', text: 'It fits perfectly! How do you say "I\'ll take this one"?', options: ['これにします', 'これが好きです', 'きれいですね', 'また来ます'] },
    { id: 7, role: 'tutor', text: 'これにします (kore ni shimasu) means "I\'ll go with this one". ～にします is the pattern for making a decision or selection!', textJp: '～にします = I\'ll take / I\'ll go with' },
    { id: 8, role: 'tutor', text: 'Great shopping practice! You\'re ready to hit the stores! 🎉 You earned 25 XP!', textJp: 'お疲れ様でした！' },
  ],
  directions: [
    { id: 1, role: 'tutor', text: 'Let\'s learn how to ask for and understand directions! 🗺️', textJp: '道を聞く練習をしましょう！' },
    { id: 2, role: 'tutor', text: 'You\'re lost and need to find the station. How do you ask "Where is the station?"', options: ['駅はどこですか？', '駅は何ですか？', '駅に行く', '駅が好きです'] },
    { id: 3, role: 'tutor', text: '駅はどこですか (eki wa doko desu ka) is perfect! ～はどこですか is the essential pattern for asking locations.', textJp: 'どこ = where' },
    { id: 4, role: 'tutor', text: 'Someone says まっすぐ行ってください. What does it mean?', options: ['Please go straight', 'Please turn right', 'Please turn left', 'Please go back'] },
    { id: 5, role: 'tutor', text: 'Correct! まっすぐ (massugu) means "straight ahead". Other useful words: 右 (migi - right), 左 (hidari - left), 角 (kado - corner).', textJp: 'まっすぐ = straight, 右 = right, 左 = left' },
    { id: 6, role: 'tutor', text: 'How do you ask "Is it far from here?"', options: ['ここから遠いですか？', 'ここはどこですか？', 'ここが好きです', 'いつ着きますか？'] },
    { id: 7, role: 'tutor', text: 'ここから遠いですか (koko kara tooi desu ka) uses ～から (from) + 遠い (far). The opposite is 近い (chikai - near).', textJp: '遠い = far, 近い = near' },
    { id: 8, role: 'tutor', text: 'Now you can navigate Japan with confidence! 🎉 You earned 25 XP!', textJp: 'お疲れ様でした！' },
  ],
  workplace: [
    { id: 1, role: 'tutor', text: 'Let\'s practice formal Japanese for the workplace! 💼', textJp: 'ビジネス日本語を練習しましょう！' },
    { id: 2, role: 'tutor', text: 'It\'s your first day. How do you properly introduce yourself to colleagues?', options: ['はじめまして、よろしくお願いいたします', 'やあ、元気？', 'おはよう、僕は新人', '私は新しい人です'] },
    { id: 3, role: 'tutor', text: 'よろしくお願いいたします is the most polite form. In business, using いたします instead of します shows extra respect (謙譲語 - humble language).', textJp: 'よろしくお願いいたします = formal "pleased to work with you"' },
    { id: 4, role: 'tutor', text: 'Your boss asks you to prepare a document. How do you acknowledge?', options: ['承知いたしました', 'わかった', 'はい、いいよ', 'できるかも'] },
    { id: 5, role: 'tutor', text: '承知いたしました (shouchi itashimashita) is the most polite way to say "understood" in business. It\'s more formal than わかりました.', textJp: '承知いたしました > かしこまりました > わかりました' },
    { id: 6, role: 'tutor', text: 'You need to leave for the day. What do you say?', options: ['お先に失礼します', 'バイバイ', 'さようなら', 'また明日'] },
    { id: 7, role: 'tutor', text: 'お先に失礼します (osaki ni shitsurei shimasu) literally means "Excuse me for leaving before you." Colleagues respond with お疲れ様でした (otsukaresama deshita).', textJp: 'お先に失礼します = Excuse me for leaving first' },
    { id: 8, role: 'tutor', text: 'Excellent work on business Japanese! 🎉 You earned 30 XP!', textJp: 'お疲れ様でした！' },
  ],
  travel: [
    { id: 1, role: 'tutor', text: 'Let\'s plan a trip in Japan! ✈️ You\'re at a hotel front desk.', textJp: '旅行の日本語を練習しましょう！' },
    { id: 2, role: 'tutor', text: 'How do you tell the receptionist you have a reservation?', options: ['予約があります', '部屋が欲しい', 'ホテルはどこ？', '泊まりたいかも'] },
    { id: 3, role: 'tutor', text: '予約があります (yoyaku ga arimasu) means "I have a reservation." 予約 (yoyaku) is used for all types of reservations — hotels, restaurants, tickets!', textJp: '予約 = reservation' },
    { id: 4, role: 'tutor', text: 'You want to ask what time check-out is. How do you ask?', options: ['チェックアウトは何時ですか？', 'いつ出ますか？', '出る時間は？', '何時に帰る？'] },
    { id: 5, role: 'tutor', text: '何時ですか (nanji desu ka) means "what time is it?" — combined with チェックアウト it becomes a natural hotel question. 何時 works for asking about any scheduled time.', textJp: '何時 = what time' },
    { id: 6, role: 'tutor', text: 'You want to visit a temple. How do you ask for a recommendation?', options: ['おすすめのお寺はありますか？', 'お寺に行きたい', 'お寺が好き', 'お寺はどこ？'] },
    { id: 7, role: 'tutor', text: 'おすすめ (osusume) means "recommendation." おすすめの～はありますか is a versatile pattern for asking for recommendations on anything!', textJp: 'おすすめ = recommendation' },
    { id: 8, role: 'tutor', text: 'You\'re ready for your Japan adventure! 🎉 You earned 30 XP!', textJp: 'お疲れ様でした！' },
  ],
};

function getXPForTopic(topicId: string): number {
  const msgs = CONVERSATIONS[topicId];
  const lastMsg = msgs ? msgs[msgs.length - 1] : undefined;
  if (!lastMsg) return 20;
  const match = lastMsg.text.match(/(\d+)\s*XP/);
  return match ? parseInt(match[1], 10) : 20;
}

function getDifficultyVariant(difficulty: string): 'success' | 'warning' | 'danger' {
  if (difficulty === 'Beginner') return 'success';
  if (difficulty === 'Intermediate') return 'warning';
  return 'danger';
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const LIVE_XP_REWARD = 25;
const LIVE_MAX_USER_MESSAGES = 5;

// ── Typing Indicator ──────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3 mb-4"
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <Bot size={16} className="text-white" />
      </div>
      <div
        className="card-premium rounded-tl-sm px-4 py-3 flex items-center gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: 'var(--text-tertiary)' }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ── Mode Badge ────────────────────────────────────────────────

function ModeBadge({ live, compact }: { live: boolean; compact?: boolean }) {
  if (live) {
    return (
      <Badge
        variant="success"
        size={compact ? 'sm' : 'md'}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
      >
        <Sparkles size={12} /> 🤖 Live AI
      </Badge>
    );
  }
  return (
    <div className="flex flex-col items-end gap-0.5">
      <Badge
        variant="warning"
        size={compact ? 'sm' : 'md'}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
      >
        <WifiOff size={12} /> 📖 Demo Mode
      </Badge>
      {!compact && (
        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
          Add API key in Settings for live AI
        </span>
      )}
    </div>
  );
}

// ── Topic Selection Screen ────────────────────────────────────

function TopicSelection({ onSelect }: { onSelect: (topicId: string) => void }) {
  const isLive = hasApiKey();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-10 relative">
        {/* Mode indicator – top right */}
        <div className="absolute top-0 right-0">
          <ModeBadge live={isLive} />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Bot size={32} className="text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          AI Tutor
        </h1>
        <p className="text-lg mb-1" style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-japanese)' }}>
          AI先生
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          Choose a topic to practice with your AI sensei
        </p>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOPICS.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.07 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(topic.id)}
              className="w-full text-left rounded-2xl p-5 cursor-pointer transition-shadow"
              style={{
                background: `linear-gradient(135deg, ${topic.color}18 0%, ${topic.color}08 100%)`,
                border: `1px solid ${topic.color}30`,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                  style={{ background: `${topic.color}20` }}
                >
                  {topic.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
                    {topic.title}
                  </h3>
                  <p
                    className="text-sm mb-2"
                    style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-japanese)' }}
                  >
                    {topic.titleJp}
                  </p>
                  <Badge variant={getDifficultyVariant(topic.difficulty)} size="sm">
                    {topic.difficulty}
                  </Badge>
                </div>
                <MessageSquare size={16} style={{ color: 'var(--text-tertiary)' }} className="shrink-0 mt-1" />
              </div>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Shared Message Bubble ─────────────────────────────────────

interface DisplayMessage {
  id: string;
  role: 'tutor' | 'user';
  text: string;
  textJp?: string;
  options?: string[];
  isError?: boolean;
  isSystem?: boolean;
}

function MessageBubble({
  msg,
  onOptionSelect,
}: {
  msg: DisplayMessage;
  onOptionSelect?: (opt: string) => void;
}) {
  // Error message
  if (msg.isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-start gap-3 mb-1"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: '#ef444425' }}
        >
          <WifiOff size={14} style={{ color: '#ef4444' }} />
        </div>
        <div
          className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3"
          style={{
            background: '#ef444410',
            border: '1px solid #ef444430',
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: '#ef4444' }}>
            {msg.text}
          </p>
        </div>
      </motion.div>
    );
  }

  const isTutor = msg.role === 'tutor';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-start gap-3 ${!isTutor ? 'justify-end' : ''}`}
    >
      {isTutor && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${!isTutor ? 'order-first' : ''}`}>
        {isTutor ? (
          <div
            className="card-premium rounded-tl-sm px-4 py-3"
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
              {msg.text}
            </p>
            {msg.textJp && (
              <p
                className="text-xs mt-1.5 leading-relaxed"
                style={{
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-japanese)',
                }}
              >
                {msg.textJp}
              </p>
            )}
          </div>
        ) : (
          <div
            className="rounded-2xl rounded-tr-sm px-4 py-3"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <p
              className="text-sm leading-relaxed text-white"
              style={{ fontFamily: 'var(--font-japanese)' }}
            >
              {msg.text}
            </p>
          </div>
        )}

        {/* Response Options (demo mode) */}
        {msg.options && onOptionSelect && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {msg.options.map((opt) => (
              <motion.button
                key={opt}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOptionSelect(opt)}
                className="px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors"
                style={{
                  background: 'var(--bg-hover)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                  fontFamily: 'var(--font-japanese)',
                }}
              >
                {opt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {!isTutor && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'var(--accent-secondary)', opacity: 0.85 }}
        >
          <User size={16} className="text-white" />
        </div>
      )}
    </motion.div>
  );
}

// ── Completion Card ───────────────────────────────────────────

function CompletionCard({ xp, onBack }: { xp: number; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="card-premium p-6 text-center mt-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
        className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <Trophy size={28} className="text-white" />
      </motion.div>
      <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        Session Complete!
      </h3>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Great practice session!
      </p>

      <div className="flex items-center justify-center gap-2 mb-5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          <Badge variant="xp" size="md">
            <Zap size={14} />
            +{xp} XP
          </Badge>
        </motion.div>
      </div>

      <Button
        variant="primary"
        size="lg"
        leftIcon={<RotateCcw size={18} />}
        onClick={onBack}
        className="w-full"
      >
        Choose Another Topic
      </Button>
    </motion.div>
  );
}

// ── Chat Top Bar ──────────────────────────────────────────────

function ChatTopBar({
  topic,
  isLive,
  onBack,
}: {
  topic: (typeof TOPICS)[number];
  isLive: boolean;
  onBack: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 shrink-0"
      style={{ borderBottom: '1px solid var(--border-primary)' }}
    >
      <button
        onClick={onBack}
        className="p-1.5 rounded-lg cursor-pointer transition-colors"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft size={20} />
      </button>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xl">{topic.icon}</span>
        <div className="min-w-0">
          <h2 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
            {topic.title}
          </h2>
          <p
            className="text-xs truncate"
            style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-japanese)' }}
          >
            {topic.titleJp}
          </p>
        </div>
      </div>
      <ModeBadge live={isLive} compact />
    </div>
  );
}

// ── Live AI Chat Screen ───────────────────────────────────────

function LiveChatScreen({
  topicId,
  onBack,
}: {
  topicId: string;
  onBack: () => void;
}) {
  const topic = TOPICS.find((t) => t.id === topicId)!;
  const profile = useUserStore((s) => s.profile);
  const addXP = useUserStore((s) => s.addXP);

  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Initial greeting from tutor
  useEffect(() => {
    const greeting: DisplayMessage = {
      id: `tutor-init-${Date.now()}`,
      role: 'tutor',
      text: `こんにちは！Welcome to our ${topic.title} lesson. Let's practice together! 一緒に練習しましょう！`,
    };
    setMessages([greeting]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isTyping || isComplete) return;

    const userMsg: DisplayMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    };

    const newUserCount = userMessageCount + 1;
    setUserMessageCount(newUserCount);
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const config: AITutorConfig = {
        topicId: topic.id,
        topicTitle: topic.title,
        jlptLevel: profile.currentJLPTLevel,
        userName: profile.displayName,
      };

      // Build API history from existing messages (exclude errors/system)
      const updatedMessages = [...messages, userMsg];
      const apiHistory: AIChatMessage[] = updatedMessages
        .filter((m) => !m.isError && !m.isSystem)
        .map((m) => ({
          role: m.role === 'tutor' ? ('model' as const) : ('user' as const),
          parts: [{ text: m.text }],
        }));

      const response = await sendMessage(apiHistory, text, config);

      const tutorMsg: DisplayMessage = {
        id: `tutor-${Date.now()}`,
        role: 'tutor',
        text: response,
      };

      setMessages((prev) => [...prev, tutorMsg]);

      // Check if session should complete
      if (newUserCount >= LIVE_MAX_USER_MESSAGES) {
        setIsComplete(true);
        if (!xpAwarded) {
          addXP(LIVE_XP_REWARD);
          setXpAwarded(true);
        }
      }
    } catch (err) {
      const errorMsg: DisplayMessage = {
        id: `error-${Date.now()}`,
        role: 'tutor',
        text: err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
        isError: true,
        isSystem: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-80px)] max-w-2xl mx-auto"
    >
      <ChatTopBar topic={topic} isLive onBack={onBack} />

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </AnimatePresence>

        <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

        {/* Completion */}
        <AnimatePresence>
          {isComplete && <CompletionCard xp={LIVE_XP_REWARD} onBack={onBack} />}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      {!isComplete && (
        <div
          className="px-4 py-3 shrink-0"
          style={{ borderTop: '1px solid var(--border-primary)' }}
        >
          {userMessageCount >= LIVE_MAX_USER_MESSAGES - 1 && userMessageCount < LIVE_MAX_USER_MESSAGES && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-center mb-2"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Last message in this session
            </motion.div>
          )}
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-2"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isTyping}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-japanese)',
              }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={isTyping || !inputValue.trim()}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-opacity"
              style={{
                background: 'var(--accent-primary)',
                opacity: isTyping || !inputValue.trim() ? 0.5 : 1,
              }}
            >
              <Send size={14} className="text-white" />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Demo Chat Screen ──────────────────────────────────────────

function DemoChatScreen({
  topicId,
  onBack,
}: {
  topicId: string;
  onBack: () => void;
}) {
  const topic = TOPICS.find((t) => t.id === topicId)!;
  const conversation = CONVERSATIONS[topicId] || [];
  const addXP = useUserStore((s) => s.addXP);

  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [conversationStep, setConversationStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Show initial tutor message(s)
  useEffect(() => {
    if (conversation.length === 0) return;

    const showInitial = async () => {
      setIsTyping(true);
      await delay(600);
      setIsTyping(false);

      const first = conversation[0];
      const initialMsgs: DisplayMessage[] = [
        { id: `tutor-${first.id}`, role: 'tutor', text: first.text, textJp: first.textJp },
      ];

      if (conversation.length > 1 && conversation[1].options) {
        setIsTyping(true);
        setMessages([...initialMsgs]);
        await delay(500);
        setIsTyping(false);
        const second = conversation[1];
        initialMsgs.push({
          id: `tutor-${second.id}`,
          role: 'tutor',
          text: second.text,
          textJp: second.textJp,
          options: second.options,
        });
        setConversationStep(2);
      } else {
        setConversationStep(1);
      }

      setMessages([...initialMsgs]);
    };

    showInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  const handleOptionSelect = async (option: string) => {
    const userMsg: DisplayMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: option,
    };

    // Remove options from the last tutor message
    setMessages((prev) => {
      const updated = [...prev];
      const lastTutorIdx = updated.length - 1;
      if (updated[lastTutorIdx]?.options) {
        updated[lastTutorIdx] = { ...updated[lastTutorIdx], options: undefined };
      }
      return [...updated, userMsg];
    });

    let step = conversationStep;
    while (step < conversation.length) {
      const nextMsg = conversation[step];
      step++;

      setIsTyping(true);
      await delay(800);
      setIsTyping(false);

      const displayMsg: DisplayMessage = {
        id: `tutor-${nextMsg.id}`,
        role: 'tutor',
        text: nextMsg.text,
        textJp: nextMsg.textJp,
        options: nextMsg.options,
      };

      setMessages((prev) => [...prev, displayMsg]);
      setConversationStep(step);

      if (nextMsg.options) {
        return;
      }

      if (step >= conversation.length) {
        setIsComplete(true);
        if (!xpAwarded) {
          const xp = getXPForTopic(topicId);
          addXP(xp);
          setXpAwarded(true);
        }
        return;
      }
    }
  };

  const xp = getXPForTopic(topicId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-80px)] max-w-2xl mx-auto"
    >
      <ChatTopBar topic={topic} isLive={false} onBack={onBack} />

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} onOptionSelect={handleOptionSelect} />
          ))}
        </AnimatePresence>

        <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

        <AnimatePresence>
          {isComplete && <CompletionCard xp={xp} onBack={onBack} />}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      {/* Bottom Bar */}
      {!isComplete && (
        <div
          className="px-4 py-3 shrink-0"
          style={{ borderTop: '1px solid var(--border-primary)' }}
        >
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-2.5"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}
          >
            <BookOpen size={16} style={{ color: 'var(--text-tertiary)' }} />
            <span className="flex-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Select an option above to respond...
            </span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--bg-hover)' }}
            >
              <Send size={14} style={{ color: 'var(--text-tertiary)' }} />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Main Page Component ───────────────────────────────────────

export function AITutorPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  if (selectedTopic) {
    const isLive = hasApiKey();
    if (isLive) {
      return (
        <LiveChatScreen
          key={selectedTopic}
          topicId={selectedTopic}
          onBack={() => setSelectedTopic(null)}
        />
      );
    }
    return (
      <DemoChatScreen
        key={selectedTopic}
        topicId={selectedTopic}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  return <TopicSelection onSelect={setSelectedTopic} />;
}

export default AITutorPage;
