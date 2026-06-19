import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  ChevronDown,
  ChevronUp,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  MapPin,
  X,
  Award,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useUserStore } from '../../stores/userStore';
import confetti from 'canvas-confetti';

interface Chapter {
  id: number;
  title: string;
  titleJp: string;
  level: string;
  description: string;
  lessons: number;
  completedLessons: number;
  icon: string;
  color: string;
  scenarios: string[];
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'Arrival in Tokyo',
    titleJp: '東京到着',
    level: 'N5',
    description: 'Your first day in Japan. Learn to navigate airports, trains, and introduce yourself.',
    lessons: 8,
    completedLessons: 0,
    icon: '✈️',
    color: '#22c55e',
    scenarios: ['Airport Arrival', 'Hotel Check-in', 'Convenience Store', 'Train Station', 'Self Introduction', 'Asking Directions', 'Restaurant Order', 'Phone Setup'],
  },
  {
    id: 2,
    title: 'Daily Life',
    titleJp: '日常生活',
    level: 'N4',
    description: 'Settle into Japanese daily life. Shopping, cooking, and making friends.',
    lessons: 8,
    completedLessons: 0,
    icon: '🏠',
    color: '#3b82f6',
    scenarios: ['Grocery Shopping', 'Cooking Japanese Food', 'Meeting Neighbors', 'Post Office', 'Doctor Visit', 'Weekend Plans', 'Birthday Party', 'Weather Talk'],
  },
  {
    id: 3,
    title: 'Work & Culture',
    titleJp: '仕事と文化',
    level: 'N3',
    description: 'Start working in Japan. Navigate office culture and explore traditions.',
    lessons: 8,
    completedLessons: 0,
    icon: '🏯',
    color: '#f59e0b',
    scenarios: ['Job Interview', 'First Day at Office', 'Business Email', 'Team Meeting', 'Shrine Visit', 'Tea Ceremony', 'Company Party', 'Project Presentation'],
  },
  {
    id: 4,
    title: 'Advanced Society',
    titleJp: '社会探求',
    level: 'N2',
    description: 'Engage with Japanese media, news, and deeper cultural discussions.',
    lessons: 8,
    completedLessons: 0,
    icon: '📰',
    color: '#8b5cf6',
    scenarios: ['Reading News', 'TV Discussion', 'University Lecture', 'Political Debate', 'Book Club', 'Art Gallery', 'Environmental Talk', 'Legal Document'],
  },
  {
    id: 5,
    title: 'Mastery',
    titleJp: '匠の道',
    level: 'N1',
    description: 'Master nuanced Japanese. Academic writing, literature, and professional expertise.',
    lessons: 8,
    completedLessons: 0,
    icon: '🏆',
    color: '#ef4444',
    scenarios: ['Academic Paper', 'Literary Analysis', 'Business Negotiation', 'Speech Writing', 'Translation Work', 'Research Presentation', 'Cultural Essay', 'Final Challenge'],
  },
];

interface ScenarioChallenge {
  title: string;
  context: string;
  dialogue: { role: 'speaker_a' | 'speaker_b'; nameA: string; nameB: string; textJp: string; textRomaji: string; textEn: string }[];
  questions: { prompt: string; options: string[]; correctAnswer: string; explanation: string }[];
}

function getScenarioChallenge(chapterId: number, _scenarioIndex: number, scenarioName: string): ScenarioChallenge {
  let dialogue: ScenarioChallenge['dialogue'] = [];
  let context = "";
  let questions: ScenarioChallenge['questions'] = [];

  if (chapterId === 1) {
    context = `You just arrived at your scenario for Chapter 1 (${scenarioName}). Learn essential N5 vocabulary and expressions for daily situations.`;
    dialogue = [
      {
        role: 'speaker_a',
        nameA: 'Staff',
        nameB: 'You',
        textJp: 'いらっしゃいませ！何かお探しですか？',
        textRomaji: 'Irasshaimase! Nani ka osagashi desu ka?',
        textEn: 'Welcome! Are you looking for something?'
      },
      {
        role: 'speaker_b',
        nameA: 'Staff',
        nameB: 'You',
        textJp: 'すみません、駅はどこですか？',
        textRomaji: 'Sumimasen, eki wa doko desu ka?',
        textEn: 'Excuse me, where is the station?'
      },
      {
        role: 'speaker_a',
        nameA: 'Staff',
        nameB: 'You',
        textJp: '駅はあそこです。歩いて五分ですよ。',
        textRomaji: 'Eki wa asoko desu. Aruite go-fun desu yo.',
        textEn: 'The station is over there. It is a 5-minute walk.'
      }
    ];
    questions = [
      {
        prompt: 'How do you say "Excuse me" or "Sorry" in Japanese?',
        options: ['すみません (Sumimasen)', 'ありがとう (Arigatou)', 'こんにちは (Konnichiwa)', 'さようなら (Sayounara)'],
        correctAnswer: 'すみません (Sumimasen)',
        explanation: '「すみません」 is the most common way to say "excuse me" or "sorry" to get someone\'s attention.'
      },
      {
        prompt: 'Which particle marks the topic of a sentence?',
        options: ['は (wa)', 'が (ga)', 'を (wo)', 'に (ni)'],
        correctAnswer: 'は (wa)',
        explanation: 'The particle 「は」 (written as "ha") marks the main topic of the sentence.'
      },
      {
        prompt: 'What does 「五分」 (go-fun) mean in the dialogue?',
        options: ['5 minutes', '5 hours', '5 days', '5 people'],
        correctAnswer: '5 minutes',
        explanation: '「五分」 means 5 minutes. 「分」 (fun/pun) is the counter for minutes.'
      }
    ];
  } else if (chapterId === 2) {
    context = `Settle into daily life in Japan for Chapter 2 (${scenarioName}). Master N4 grammar structures.`;
    dialogue = [
      {
        role: 'speaker_a',
        nameA: 'Friend',
        nameB: 'You',
        textJp: '明日、一緒に買い物に行きませんか？',
        textRomaji: 'Ashita, issho ni kaimono ni ikimasen ka?',
        textEn: 'Would you like to go shopping together tomorrow?'
      },
      {
        role: 'speaker_b',
        nameA: 'Friend',
        nameB: 'You',
        textJp: 'いいですね！午後から雨が降るそうですが、大丈夫ですか？',
        textRomaji: 'Ii desu ne! Gogo kara ame ga furu sou desu ga, daijoubu desu ka?',
        textEn: 'Sounds good! I heard it will rain in the afternoon, is that okay?'
      },
      {
        role: 'speaker_a',
        nameA: 'Friend',
        nameB: 'You',
        textJp: 'デパートの中だから雨が降っても大丈夫ですよ。',
        textRomaji: 'Depaato no naka dakara ame ga futte mo daijoubu desu yo.',
        textEn: 'Since we will be inside the department store, it is fine even if it rains.'
      }
    ];
    questions = [
      {
        prompt: 'What grammatical pattern is used to express "I heard that..." or "It looks like..."?',
        options: ['〜そうです (sou desu)', '〜てください (te kudasai)', '〜たいです (tai desu)', '〜なければならない (nakereba naranai)'],
        correctAnswer: '〜そうです (sou desu)',
        explanation: 'In N4 grammar, verb dictionary form + 「そうです」 expresses hearsay ("I heard that").'
      },
      {
        prompt: 'How do you say "together" in Japanese?',
        options: ['一緒に (issho ni)', '一人で (hitori de)', '別々に (betsubetsu ni)', '静かに (shizuka ni)'],
        correctAnswer: '一緒に (issho ni)',
        explanation: '「一緒に」 (issho ni) means "together".'
      },
      {
        prompt: 'What does 「午後」 (gogo) mean?',
        options: ['Afternoon / PM', 'Morning / AM', 'Evening', 'Night'],
        correctAnswer: 'Afternoon / PM',
        explanation: '「午後」 means afternoon or PM, while 「午前」 (gozen) means morning or AM.'
      }
    ];
  } else if (chapterId === 3) {
    context = `Adapt to workplace culture and professional communication for Chapter 3 (${scenarioName}).`;
    dialogue = [
      {
        role: 'speaker_a',
        nameA: 'Boss',
        nameB: 'You',
        textJp: '会議の資料はもう準備できましたか？',
        textRomaji: 'Kaigi no shiryou wa mou junbi dekimashita ka?',
        textEn: 'Are the materials for the meeting ready yet?'
      },
      {
        role: 'speaker_b',
        nameA: 'Boss',
        nameB: 'You',
        textJp: 'はい、先ほどメールでお送りいたしました。ご確認ください。',
        textRomaji: 'Hai, sakihodo meeru de ookiri itashimashita. Go-kakunin kudasai.',
        textEn: 'Yes, I sent them to you via email just a moment ago. Please review them.'
      },
      {
        role: 'speaker_a',
        nameA: 'Boss',
        nameB: 'You',
        textJp: 'ありがとう。内容について後で話し合いましょう。',
        textRomaji: 'Arigatou. Naiyou ni tsuite ato de hanashiaimashou.',
        textEn: 'Thank you. Let\'s discuss the contents later.'
      }
    ];
    questions = [
      {
        prompt: 'Which honorific (Keigo) expression is used to humble one\'s own action of sending/giving?',
        options: ['お送りいたしました (ookiri itashimashita)', '送ってくださいました (okutte kudasaimashita)', '送られます (okuraremasu)', '送るでしょう (okuru deshou)'],
        correctAnswer: 'お送りいたしました (ookiri itashimashita)',
        explanation: '「お送りいたしました」 is Kenjougo (humble form) used to show respect to the boss.'
      },
      {
        prompt: 'What does the grammar point 「〜について」 mean?',
        options: ['About / Regarding', 'Instead of', 'Because of', 'In contrast to'],
        correctAnswer: 'About / Regarding',
        explanation: 'Noun + 「について」 is the N3 grammar pattern meaning "about" or "concerning".'
      },
      {
        prompt: 'What is the meaning of 「先ほど」 (sakihodo)?',
        options: ['A short while ago', 'Tomorrow', 'Next week', 'Immediately'],
        correctAnswer: 'A short while ago',
        explanation: '「先ほど」 is a polite workplace expression meaning "just a moment ago" or "a short while ago".'
      }
    ];
  } else if (chapterId === 4) {
    context = `Analyze societal topics, news articles, and debates for Chapter 4 (${scenarioName}).`;
    dialogue = [
      {
        role: 'speaker_a',
        nameA: 'Host',
        nameB: 'You',
        textJp: '最近の気候変動問題についてどうお考えですか？',
        textRomaji: 'Saikin no kikou hendou mondai ni tsuite dou o-kangae desu ka?',
        textEn: 'What are your thoughts on the recent climate change issues?'
      },
      {
        role: 'speaker_b',
        nameA: 'Host',
        nameB: 'You',
        textJp: '温室効果ガスの削減に向けて、早急に対策を講じるべきです。',
        textRomaji: 'Onshitsu kouka gasu no sakugen ni mukete, sakkyuu ni taisaku wo koujiru beki desu.',
        textEn: 'We should take countermeasures urgently toward reducing greenhouse gases.'
      },
      {
        role: 'speaker_a',
        nameA: 'Host',
        nameB: 'You',
        textJp: '確かに。政府だけでなく民間企業の協力も不可欠ですね。',
        textRomaji: 'Tashikani. Seifu dake de naku minkan kigyou no kyouryoku mo fukatsu desu ne.',
        textEn: 'Indeed. Not only the government, but cooperation from private corporations is indispensable.'
      }
    ];
    questions = [
      {
        prompt: 'What grammatical expression means "should do" or "ought to do" based on social duty?',
        options: ['〜べきだ (beki da)', '〜かもしれない (kamo shirenai)', '〜そうだ (sou da)', '〜やすい (yasui)'],
        correctAnswer: '〜べきだ (beki da)',
        explanation: 'In N2 grammar, verb dictionary form + 「べきだ」 represents an obligation or something one ought to do.'
      },
      {
        prompt: 'What does the phrase 「〜に向けて」 (ni mukete) mean?',
        options: ['Aimed at / Heading towards', 'Contrary to', 'Because of', 'Regardless of'],
        correctAnswer: 'Aimed at / Heading towards',
        explanation: '「〜に向けて」 means looking forward or working towards a specific goal.'
      },
      {
        prompt: 'What does the N2 word 「不可欠」 (fukatsu) mean?',
        options: ['Indispensable / Essential', 'Impossible', 'Unnecessary', 'Optional'],
        correctAnswer: 'Indispensable / Essential',
        explanation: '「不可欠」 literally means "not possible to lack", which translates to indispensable or essential.'
      }
    ];
  } else {
    context = `Engage in advanced professional negotiations and research for Chapter 5 (${scenarioName}).`;
    dialogue = [
      {
        role: 'speaker_a',
        nameA: 'Client',
        nameB: 'You',
        textJp: 'この契約条件の変更は、弊社としては極めて承服しかねます。',
        textRomaji: 'Kono keiyaku jouken no hengou wa, heisha to shite wa kiwamete shouhuku kanemasu.',
        textEn: 'As for our company, modifying these contract terms is extremely unacceptable.'
      },
      {
        role: 'speaker_b',
        nameA: 'Client',
        nameB: 'You',
        textJp: '承知いたしました。妥協案として、納期を二週間延期するというのはいかがでしょうか？',
        textRomaji: 'Shouchi itashimashita. Dakyouan to shite, nouki wo ni-shuukan enki suru to iu no wa ikaga deshou ka?',
        textEn: 'Understood. As a compromise, how about extending the delivery deadline by two weeks?'
      },
      {
        role: 'speaker_a',
        nameA: 'Client',
        nameB: 'You',
        textJp: 'それであれば、検討の余地がございます。社内に持ち帰って協議いたします。',
        textRomaji: 'Sore de areba, kentou no yochi ga gozaimasu. Shanai ni mochikaette kyougi itashimasu.',
        textEn: 'If that is the case, there is room for consideration. I will take it back to consult within our company.'
      }
    ];
    questions = [
      {
        prompt: 'What does the N1 suffix 「〜かねる」 (kaneru) express when attached to a verb stem?',
        options: ['Unable to / Difficult to do', 'On the verge of doing', 'Easy to do', 'Must do'],
        correctAnswer: 'Unable to / Difficult to do',
        explanation: 'In N1 grammar, verb stem + 「かねる」 is a polite way of refusing or stating that one cannot do something.'
      },
      {
        prompt: 'What is the meaning of the N1 expression 「承服」 (shouhuku)?',
        options: ['Consent / Accept', 'Refusal', 'Doubt', 'Delay'],
        correctAnswer: 'Consent / Accept',
        explanation: '「承服」 means to consent, yield, or accept. 「承服しかねます」 means "we cannot accept this".'
      },
      {
        prompt: 'What does 「検討の余地」 (kentou no yochi) mean?',
        options: ['Room for consideration', 'No hope', 'Complete agreement', 'Mistake'],
        correctAnswer: 'Room for consideration',
        explanation: '「余地」 means room or margin, so 「検討の余地」 translates to room for consideration or room for discussion.'
      }
    ];
  }

  return {
    title: scenarioName,
    context,
    dialogue,
    questions
  };
}

export function CareerPage() {
  const { profile, completeCareerLesson, addXP, addCoins } = useUserStore();
  const [expandedChapter, setExpandedChapter] = React.useState<number | null>(null);

  // Challenge modal states
  const [activeChallenge, setActiveChallenge] = React.useState<{
    chapterId: number;
    scenarioIndex: number;
    scenarioName: string;
  } | null>(null);
  const [challengeStep, setChallengeStep] = React.useState<'dialogue' | 'quiz' | 'result'>('dialogue');
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = React.useState(0);

  const progressMap = profile.careerProgress || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  const dynamicChapters = React.useMemo(() => {
    return CHAPTERS.map((ch) => ({
      ...ch,
      completedLessons: progressMap[ch.id] || 0,
    }));
  }, [progressMap]);

  const isUnlocked = React.useCallback((chapterId: number) => {
    if (chapterId === 1) return true;
    const prevChapterCompleted = (progressMap[chapterId - 1] || 0) >= 8;
    return prevChapterCompleted;
  }, [progressMap]);

  const activeIndex = React.useMemo(() => {
    for (let i = dynamicChapters.length - 1; i >= 0; i--) {
      if (isUnlocked(dynamicChapters[i].id)) {
        return i;
      }
    }
    return 0;
  }, [dynamicChapters, isUnlocked]);

  const totalLessons = dynamicChapters.reduce((sum, ch) => sum + ch.lessons, 0);
  const totalCompleted = dynamicChapters.reduce((sum, ch) => sum + ch.completedLessons, 0);
  const estimatedHours = Math.ceil((totalLessons - totalCompleted) * 15 / 60);

  const getButtonState = (chapter: typeof dynamicChapters[0]) => {
    if (!isUnlocked(chapter.id)) return 'locked' as const;
    if (chapter.completedLessons >= chapter.lessons) return 'completed' as const;
    if (chapter.completedLessons > 0) return 'continue' as const;
    return 'start' as const;
  };

  const startChallenge = (chapterId: number, scenarioIndex: number) => {
    const chapter = CHAPTERS.find(c => c.id === chapterId)!;
    const scenarioName = chapter.scenarios[scenarioIndex];
    setActiveChallenge({ chapterId, scenarioIndex, scenarioName });
    setChallengeStep('dialogue');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCorrectAnswersCount(0);
  };

  const handleAnswerSelect = (answer: string, correctAnswer: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    setShowExplanation(true);
    if (answer === correctAnswer) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = (totalQuestions: number) => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setChallengeStep('result');
    }
  };

  const handleCompleteChallenge = () => {
    if (activeChallenge) {
      const isPassed = correctAnswersCount >= 2;
      if (isPassed) {
        const currentChapterProgress = progressMap[activeChallenge.chapterId] || 0;
        if (activeChallenge.scenarioIndex === currentChapterProgress) {
          completeCareerLesson(activeChallenge.chapterId);
          addXP(15);
          addCoins(5);
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      }
      setActiveChallenge(null);
    }
  };

  const handleRetryChallenge = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCorrectAnswersCount(0);
    setChallengeStep('dialogue');
  };

  const toggleExpand = (chapterId: number) => {
    setExpandedChapter(prev => (prev === chapterId ? null : chapterId));
  };

  const challengeData = activeChallenge ? getScenarioChallenge(activeChallenge.chapterId, activeChallenge.scenarioIndex, activeChallenge.scenarioName) : null;

  return (
    <div className="p-6 max-w-4xl mx-auto overflow-y-auto h-full pb-24">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Career Mode
            </h1>
            <p
              className="text-base mt-1"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-japanese)' }}
            >
              キャリアモード
            </p>
          </div>
          <Badge variant="primary" size="md">
            <BookOpen size={14} />
            Chapter {Math.min(activeIndex + 1, CHAPTERS.length)} / {CHAPTERS.length}
          </Badge>
        </div>
      </motion.div>

      {/* Progress Overview Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="rounded-2xl p-5 mb-10"
        style={{
          background: 'var(--gradient-primary)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/80 text-sm font-medium">Your Journey</div>
            <div className="text-white text-2xl font-bold mt-1">
              {totalCompleted} <span className="text-base font-normal text-white/60">/ {totalLessons} lessons</span>
            </div>
          </div>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <MapPin size={24} color="white" />
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <motion.div
            className="h-full rounded-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Learning Path Timeline */}
      <div className="relative">
        {/* Central vertical line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 hidden md:block"
          style={{ background: 'var(--border-primary)' }}
        />
        {/* Mobile left line */}
        <div
          className="absolute left-6 top-0 bottom-0 w-0.5 md:hidden"
          style={{ background: 'var(--border-primary)' }}
        />

        {dynamicChapters.map((chapter, index) => {
          const unlocked = isUnlocked(chapter.id);
          const buttonState = getButtonState(chapter);
          const isLeft = index % 2 === 0;
          const isExpanded = expandedChapter === chapter.id;

          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2 + index * 0.12,
                duration: 0.5,
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              whileHover={unlocked ? { scale: 1.01 } : undefined}
              className="relative mb-12 last:mb-0"
            >
              {/* Timeline node — desktop centered */}
              <div className="absolute left-1/2 -translate-x-1/2 top-8 z-10 hidden md:flex">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-4 shadow-md"
                  style={{
                    borderColor: unlocked ? chapter.color : 'var(--border-primary)',
                    background: unlocked ? chapter.color : 'var(--bg-tertiary)',
                    boxShadow: unlocked ? `0 0 12px ${chapter.color}40` : 'var(--shadow-sm)',
                  }}
                >
                  {unlocked ? (
                    <span className="text-white font-bold text-sm">{chapter.id}</span>
                  ) : (
                    <Lock size={16} style={{ color: 'var(--text-tertiary)' }} />
                  )}
                </div>
              </div>

              {/* Timeline node — mobile left */}
              <div className="absolute left-6 -translate-x-1/2 top-6 z-10 md:hidden">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-[3px] shadow-sm"
                  style={{
                    borderColor: unlocked ? chapter.color : 'var(--border-primary)',
                    background: unlocked ? chapter.color : 'var(--bg-tertiary)',
                  }}
                >
                  {unlocked ? (
                    <span className="text-white font-bold text-xs">{chapter.id}</span>
                  ) : (
                    <Lock size={12} style={{ color: 'var(--text-tertiary)' }} />
                  )}
                </div>
              </div>

              {/* Chapter Card */}
              <div
                className={`
                  md:w-[calc(50%-40px)]
                  ${isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'}
                  ml-14 md:ml-auto
                `}
                style={{
                  ...(!isLeft && { marginLeft: undefined }),
                }}
              >
                <Card
                  hover={unlocked}
                  padding="none"
                  className="overflow-hidden"
                >
                  <div style={{ opacity: unlocked ? 1 : 0.5 }}>
                    {/* Color top bar */}
                    <div className="h-1.5" style={{ background: chapter.color }} />

                    <div className="p-5">
                      {/* Top row: icon + badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                            style={{
                              background: `${chapter.color}15`,
                              border: `2px solid ${chapter.color}30`,
                            }}
                          >
                            {chapter.icon}
                          </div>
                          <div>
                            <Badge
                              variant="default"
                              size="sm"
                              className="mb-1"
                            >
                              Chapter {chapter.id}
                            </Badge>
                            <h3
                              className="text-lg font-bold leading-tight"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {chapter.title}
                            </h3>
                            <span
                              className="text-sm"
                              style={{
                                color: 'var(--text-secondary)',
                                fontFamily: 'var(--font-japanese)',
                              }}
                            >
                              {chapter.titleJp}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={unlocked ? 'primary' : 'default'}
                          size="sm"
                        >
                          {chapter.level}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p
                        className="text-sm mt-3 leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {chapter.description}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <ProgressBar
                          value={chapter.completedLessons}
                          max={chapter.lessons}
                          label={`${chapter.completedLessons} / ${chapter.lessons} lessons`}
                          showPercentage
                          size="sm"
                          gradient={`linear-gradient(135deg, ${chapter.color}, ${chapter.color}cc)`}
                        />
                      </div>

                      {/* Expand scenarios button */}
                      <button
                        onClick={() => toggleExpand(chapter.id)}
                        className="flex items-center gap-1.5 mt-3 text-sm font-medium transition-colors cursor-pointer"
                        style={{ color: chapter.color }}
                        disabled={!unlocked}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {isExpanded ? 'Hide' : 'View'} Scenarios
                      </button>

                      {/* Expandable scenario list */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div
                              className="mt-3 rounded-xl p-3 grid grid-cols-1 gap-1.5"
                              style={{ background: 'var(--bg-tertiary)' }}
                            >
                              {chapter.scenarios.map((scenario, sIndex) => {
                                const isCompleted = sIndex < chapter.completedLessons;
                                const isCurrent = sIndex === chapter.completedLessons;
                                return (
                                  <motion.div
                                    key={scenario}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: sIndex * 0.04 }}
                                    className={`flex items-center gap-2.5 py-1.5 px-2 rounded-lg ${isCurrent ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all' : ''}`}
                                    style={{
                                      background: isCompleted ? `${chapter.color}10` : 'transparent',
                                      border: isCurrent ? `1px dashed ${chapter.color}` : '1px solid transparent',
                                    }}
                                    onClick={isCurrent ? () => startChallenge(chapter.id, sIndex) : undefined}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2
                                        size={16}
                                        style={{ color: chapter.color, flexShrink: 0 }}
                                      />
                                    ) : isCurrent ? (
                                      <Play
                                        size={16}
                                        style={{ color: chapter.color, flexShrink: 0 }}
                                        className="animate-pulse"
                                      />
                                    ) : (
                                      <Circle
                                        size={16}
                                        style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
                                      />
                                    )}
                                    <span
                                      className="text-sm"
                                      style={{
                                        color: isCompleted
                                          ? 'var(--text-primary)'
                                          : 'var(--text-secondary)',
                                        fontWeight: isCompleted || isCurrent ? 600 : 400,
                                      }}
                                    >
                                      {sIndex + 1}. {scenario}
                                    </span>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action Button */}
                      <div className="mt-4">
                        {buttonState === 'locked' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled
                            leftIcon={<Lock size={14} />}
                          >
                            Locked — Complete Chapter {chapter.id - 1}
                          </Button>
                        ) : buttonState === 'completed' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<CheckCircle2 size={14} />}
                          >
                            Completed ✨
                          </Button>
                        ) : buttonState === 'continue' ? (
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Play size={14} />}
                            onClick={() => startChallenge(chapter.id, chapter.completedLessons)}
                          >
                            Continue
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Play size={14} />}
                            onClick={() => startChallenge(chapter.id, 0)}
                            style={{
                              background: `linear-gradient(135deg, ${chapter.color}, ${chapter.color}dd)`,
                            }}
                          >
                            Start Chapter
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-tertiary)' }}
            >
              <BookOpen size={20} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                Total Progress
              </div>
              <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {totalCompleted} / {totalLessons}{' '}
                <span
                  className="text-sm font-normal"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  lessons
                </span>
              </div>
            </div>
          </div>
          <ProgressBar
            value={totalCompleted}
            max={totalLessons}
            size="sm"
            className="mt-3"
            showPercentage
          />
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-tertiary)' }}
            >
              <Clock size={20} style={{ color: 'var(--accent-secondary)' }} />
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                Estimated Time
              </div>
              <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {estimatedHours}{' '}
                <span
                  className="text-sm font-normal"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  hours remaining
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            ~15 min per lesson · {totalLessons - totalCompleted} lessons left
          </div>
        </Card>
      </motion.div>

      {/* Scenario Challenge Modal Overlay */}
      <AnimatePresence>
        {activeChallenge && challengeData && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="max-w-2xl w-full bg-card rounded-3xl border border-primary shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-primary" style={{ background: 'var(--bg-tertiary)' }}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gradient-primary">
                    Chapter {activeChallenge.chapterId} · Scenario {activeChallenge.scenarioIndex + 1}
                  </span>
                  <h2 className="text-xl font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>
                    {challengeData.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveChallenge(null)}
                  className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {challengeStep === 'dialogue' && (
                  <div className="space-y-5">
                    {/* Context description */}
                    <Card padding="md" style={{ background: 'var(--bg-hover)', borderLeft: '4px solid var(--accent-primary)' }}>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {challengeData.context}
                      </p>
                    </Card>

                    {/* Dialogue bubbles */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                        Roleplay Conversation
                      </h3>
                      {challengeData.dialogue.map((turn, tIdx) => {
                        const isUser = turn.role === 'speaker_b';
                        return (
                          <div
                            key={tIdx}
                            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[10px] font-bold mb-1 px-1" style={{ color: 'var(--text-tertiary)' }}>
                              {isUser ? turn.nameB : turn.nameA}
                            </span>
                            <div
                              className={`p-4 rounded-2xl max-w-[85%] shadow-sm ${isUser ? 'bg-gradient-primary text-white rounded-tr-none' : 'bg-tertiary rounded-tl-none border border-primary'}`}
                              style={{
                                background: isUser ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                              }}
                            >
                              <p className="font-bold text-sm md:text-base leading-relaxed" style={{ fontFamily: 'var(--font-japanese)' }}>
                                {turn.textJp}
                              </p>
                              <p className="text-[11px] mt-1 opacity-75 font-mono">
                                {turn.textRomaji}
                              </p>
                              <div className="h-px my-1.5 opacity-20 bg-current" />
                              <p className="text-xs opacity-90 leading-normal">
                                {turn.textEn}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {challengeStep === 'quiz' && (
                  <div className="space-y-6">
                    {/* Progress tracking */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                        <span>Challenge Quiz</span>
                        <span className="font-bold">{currentQuestionIndex + 1} of {challengeData.questions.length}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden bg-tertiary" style={{ background: 'var(--bg-tertiary)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            background: 'var(--gradient-primary)',
                            width: `${((currentQuestionIndex + 1) / challengeData.questions.length) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Question Prompt */}
                    <div className="py-2">
                      <h3 className="text-lg font-extrabold leading-snug" style={{ color: 'var(--text-primary)' }}>
                        {challengeData.questions[currentQuestionIndex].prompt}
                      </h3>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 gap-3">
                      {challengeData.questions[currentQuestionIndex].options.map((opt) => {
                        const isCorrectAnswer = opt === challengeData.questions[currentQuestionIndex].correctAnswer;
                        const isSelected = opt === selectedAnswer;
                        const isAnySelected = selectedAnswer !== null;

                        let btnBg = 'var(--bg-card)';
                        let btnBorder = '1px solid var(--border-primary)';
                        let btnColor = 'var(--text-primary)';

                        if (isSelected) {
                          if (isCorrectAnswer) {
                            btnBg = 'rgba(34, 197, 94, 0.15)';
                            btnBorder = '2.5px solid #22c55e';
                            btnColor = '#22c55e';
                          } else {
                            btnBg = 'rgba(239, 68, 68, 0.15)';
                            btnBorder = '2.5px solid #ef4444';
                            btnColor = '#ef4444';
                          }
                        } else if (isAnySelected && isCorrectAnswer) {
                          // Reveal correct answer if user got it wrong
                          btnBg = 'rgba(34, 197, 94, 0.08)';
                          btnBorder = '1.5px dashed #22c55e';
                          btnColor = '#22c55e';
                        } else if (isAnySelected) {
                          btnBg = 'var(--bg-card)';
                          btnBorder = '1px solid var(--border-subtle)';
                          btnColor = 'var(--text-tertiary)';
                        }

                        return (
                          <motion.button
                            key={opt}
                            whileHover={!isAnySelected ? { scale: 1.01 } : undefined}
                            whileTap={!isAnySelected ? { scale: 0.99 } : undefined}
                            onClick={() => handleAnswerSelect(opt, challengeData.questions[currentQuestionIndex].correctAnswer)}
                            disabled={isAnySelected}
                            className="w-full text-left p-4 rounded-xl font-bold text-sm transition-all duration-150 flex items-center justify-between cursor-pointer"
                            style={{
                              background: btnBg,
                              border: btnBorder,
                              color: btnColor,
                            }}
                          >
                            <span>{opt}</span>
                            {isSelected && isCorrectAnswer && <CheckCircle2 size={16} className="text-green-500" />}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl text-xs leading-relaxed border"
                        style={{
                          background: 'var(--bg-tertiary)',
                          borderColor: selectedAnswer === challengeData.questions[currentQuestionIndex].correctAnswer ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <p className="font-bold mb-1" style={{ color: selectedAnswer === challengeData.questions[currentQuestionIndex].correctAnswer ? '#22c55e' : '#ef4444' }}>
                          {selectedAnswer === challengeData.questions[currentQuestionIndex].correctAnswer ? 'Correct! 正解！' : 'Incorrect.'}
                        </p>
                        {challengeData.questions[currentQuestionIndex].explanation}
                      </motion.div>
                    )}
                  </div>
                )}

                {challengeStep === 'result' && (
                  <div className="flex flex-col items-center justify-center text-center py-6 space-y-6">
                    {/* Score Circle / Confetti visual */}
                    <div className="relative w-28 h-28 rounded-full border-4 flex items-center justify-center" style={{ borderColor: correctAnswersCount >= 2 ? '#22c55e' : '#ef4444' }}>
                      <span className="text-3xl font-extrabold" style={{ color: correctAnswersCount >= 2 ? '#22c55e' : '#ef4444' }}>
                        {correctAnswersCount} / 3
                      </span>
                    </div>

                    {/* Feedback header */}
                    <div>
                      <h3 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                        {correctAnswersCount >= 2 ? 'Scenario Mastered! ✨' : 'Try Again'}
                      </h3>
                      <p className="text-sm mt-1 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
                        {correctAnswersCount >= 2
                          ? 'Outstanding! You correctly understood the conversation and questions.'
                          : 'You need at least 2 correct answers to pass. Let\'s review and try again.'}
                      </p>
                    </div>

                    {/* Rewards (if passed) */}
                    {correctAnswersCount >= 2 && (
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary" style={{ background: 'var(--bg-tertiary)' }}>
                          <Award size={15} className="text-amber-500" />
                          <span className="text-xs font-extrabold" style={{ color: 'var(--text-primary)' }}>+15 XP</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary" style={{ background: 'var(--bg-tertiary)' }}>
                          <Sparkles size={15} className="text-yellow-500" />
                          <span className="text-xs font-extrabold" style={{ color: 'var(--text-primary)' }}>+5 Coins</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-primary flex justify-end gap-3" style={{ background: 'var(--bg-tertiary)' }}>
                {challengeStep === 'dialogue' && (
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<Play size={15} />}
                    onClick={() => setChallengeStep('quiz')}
                  >
                    Start Quiz
                  </Button>
                )}

                {challengeStep === 'quiz' && (
                  <Button
                    variant="primary"
                    size="md"
                    disabled={selectedAnswer === null}
                    onClick={() => handleNextQuestion(challengeData.questions.length)}
                  >
                    {currentQuestionIndex < challengeData.questions.length - 1 ? 'Next Question' : 'View Results'}
                  </Button>
                )}

                {challengeStep === 'result' && (
                  <>
                    {correctAnswersCount < 2 ? (
                      <>
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={() => setActiveChallenge(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="md"
                          onClick={handleRetryChallenge}
                        >
                          Retry Quiz
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleCompleteChallenge}
                      >
                        Complete Scenario
                      </Button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CareerPage;
