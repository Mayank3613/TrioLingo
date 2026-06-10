export interface ReadingPassage {
  id: number;
  title: string;
  titleJp: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  topic: string;
  passage: string;
  translation: string;
  questions: {
    question: string;
    questionEn: string;
    options: string[];
    correctIndex: number;
  }[];
  wordCount: number;
}

export const READING_DATA: ReadingPassage[] = [
  // ═══════════════════════════════════════
  //  N5 — 5 Passages
  // ═══════════════════════════════════════
  {
    id: 1,
    title: 'My Daily Life',
    titleJp: '私の毎日',
    jlptLevel: 'N5',
    topic: 'Daily Life',
    passage: '私は毎朝六時に起きます。顔を洗って、朝ごはんを食べます。朝ごはんはいつもパンと牛乳です。七時に家を出て、電車で学校に行きます。学校は九時から三時までです。学校の後で、友達と図書館で勉強します。',
    translation: 'I wake up at 6 AM every morning. I wash my face and eat breakfast. Breakfast is always bread and milk. I leave home at 7 and go to school by train. School is from 9 to 3. After school, I study at the library with friends.',
    questions: [
      { question: '私は何時に起きますか。', questionEn: 'What time do I wake up?', options: ['五時', '六時', '七時', '八時'], correctIndex: 1 },
      { question: '朝ごはんは何ですか。', questionEn: 'What is for breakfast?', options: ['ごはんとみそ汁', 'パンと牛乳', 'おにぎり', '何も食べない'], correctIndex: 1 },
      { question: '学校の後で何をしますか。', questionEn: 'What do I do after school?', options: ['テレビを見る', '買い物をする', '友達と勉強する', 'すぐ家に帰る'], correctIndex: 2 },
    ],
    wordCount: 65,
  },
  {
    id: 2,
    title: 'Weekend Plans',
    titleJp: '週末の予定',
    jlptLevel: 'N5',
    topic: 'Daily Life',
    passage: '今週の土曜日に友達と買い物に行きます。新しい服を買いたいです。日曜日は家族と公園に行きます。公園で写真を撮ったり、お弁当を食べたりします。天気がいいといいですね。',
    translation: 'This Saturday I will go shopping with friends. I want to buy new clothes. On Sunday I will go to the park with my family. At the park, we will take photos and eat bento. I hope the weather is nice.',
    questions: [
      { question: '土曜日に何をしますか。', questionEn: 'What will you do on Saturday?', options: ['公園に行く', '映画を見る', '買い物に行く', '家で勉強する'], correctIndex: 2 },
      { question: '日曜日は誰と行きますか。', questionEn: 'Who will you go with on Sunday?', options: ['一人で', '友達と', '先生と', '家族と'], correctIndex: 3 },
      { question: '公園で何をしますか。', questionEn: 'What will you do at the park?', options: ['泳ぐ', '写真を撮る', 'サッカーをする', '本を読む'], correctIndex: 1 },
    ],
    wordCount: 55,
  },
  {
    id: 3,
    title: 'My Room',
    titleJp: '私の部屋',
    jlptLevel: 'N5',
    topic: 'Home',
    passage: '私の部屋は広くないですが、好きです。窓の近くに机があります。机の上にパソコンと本があります。ベッドは部屋の右にあります。壁に日本の地図を貼っています。毎日この部屋で日本語を勉強しています。',
    translation: 'My room is not spacious, but I like it. There is a desk near the window. On the desk there is a computer and books. The bed is on the right side of the room. I have a map of Japan on the wall. I study Japanese in this room every day.',
    questions: [
      { question: '机はどこにありますか。', questionEn: 'Where is the desk?', options: ['ドアの近く', '窓の近く', 'ベッドの近く', '壁の前'], correctIndex: 1 },
      { question: '壁に何がありますか。', questionEn: 'What is on the wall?', options: ['時計', '写真', '日本の地図', 'カレンダー'], correctIndex: 2 },
      { question: '部屋は広いですか。', questionEn: 'Is the room spacious?', options: ['はい、とても広い', 'いいえ、広くない', 'はい、まあまあ広い', 'とても狭い'], correctIndex: 1 },
    ],
    wordCount: 60,
  },
  {
    id: 4,
    title: 'At the Restaurant',
    titleJp: 'レストランで',
    jlptLevel: 'N5',
    topic: 'Food',
    passage: '昨日、友達と日本料理のレストランに行きました。私はてんぷらを食べました。友達はお寿司を食べました。飲み物は緑茶にしました。料理はとても美味しかったです。店の人はとても親切でした。また行きたいです。',
    translation: 'Yesterday, I went to a Japanese restaurant with a friend. I ate tempura. My friend ate sushi. We had green tea to drink. The food was very delicious. The staff was very kind. I want to go again.',
    questions: [
      { question: '私は何を食べましたか。', questionEn: 'What did I eat?', options: ['お寿司', 'ラーメン', 'てんぷら', 'カレー'], correctIndex: 2 },
      { question: '飲み物は何でしたか。', questionEn: 'What was the drink?', options: ['コーヒー', 'ジュース', '水', '緑茶'], correctIndex: 3 },
      { question: '店の人はどうでしたか。', questionEn: 'How was the staff?', options: ['忙しかった', '怖かった', '親切だった', '静かだった'], correctIndex: 2 },
    ],
    wordCount: 58,
  },
  {
    id: 5,
    title: 'Seasons in Japan',
    titleJp: '日本の季節',
    jlptLevel: 'N5',
    topic: 'Culture',
    passage: '日本には四つの季節があります。春は暖かくて、桜がきれいです。夏は暑くて、海に行く人が多いです。秋は涼しくて、紅葉がきれいです。冬は寒くて、雪が降ります。私は秋が一番好きです。',
    translation: 'Japan has four seasons. Spring is warm and cherry blossoms are beautiful. Summer is hot and many people go to the sea. Autumn is cool and the autumn leaves are beautiful. Winter is cold and it snows. I like autumn the best.',
    questions: [
      { question: '日本にはいくつの季節がありますか。', questionEn: 'How many seasons does Japan have?', options: ['二つ', '三つ', '四つ', '五つ'], correctIndex: 2 },
      { question: '夏にはどこに行く人が多いですか。', questionEn: 'Where do many people go in summer?', options: ['山', '海', '公園', '図書館'], correctIndex: 1 },
      { question: '私はどの季節が一番好きですか。', questionEn: 'Which season do I like the most?', options: ['春', '夏', '秋', '冬'], correctIndex: 2 },
    ],
    wordCount: 62,
  },

  // ═══════════════════════════════════════
  //  N4 — 4 Passages
  // ═══════════════════════════════════════
  {
    id: 6,
    title: 'My Hobby',
    titleJp: '私の趣味',
    jlptLevel: 'N4',
    topic: 'Hobbies',
    passage: '私の趣味は写真を撮ることです。三年前にカメラを買ってから、毎週末写真を撮りに出かけています。最初は上手に撮れませんでしたが、練習するうちにだんだん上手になりました。先月、写真コンテストに応募したら、三等賞をもらいました。とても嬉しかったです。将来はプロのカメラマンになりたいと思っています。',
    translation: 'My hobby is taking photos. Since I bought a camera three years ago, I go out to take photos every weekend. At first I couldn\'t take good photos, but as I practiced, I gradually got better. Last month, when I entered a photo contest, I received third prize. I was very happy. I want to become a professional photographer in the future.',
    questions: [
      { question: 'カメラをいつ買いましたか。', questionEn: 'When was the camera bought?', options: ['一年前', '二年前', '三年前', '先月'], correctIndex: 2 },
      { question: 'コンテストで何をもらいましたか。', questionEn: 'What did they receive at the contest?', options: ['一等賞', '二等賞', '三等賞', '何ももらわなかった'], correctIndex: 2 },
      { question: '将来何になりたいですか。', questionEn: 'What do they want to become?', options: ['先生', 'プロのカメラマン', '医者', '画家'], correctIndex: 1 },
    ],
    wordCount: 95,
  },
  {
    id: 7,
    title: 'Letter from Japan',
    titleJp: '日本からの手紙',
    jlptLevel: 'N4',
    topic: 'Travel',
    passage: '先月から東京に留学しています。最初は言葉が分からなくて大変でしたが、ホストファミリーがとても優しくて助けてくれました。毎日日本語学校に通っていますが、授業はほとんど日本語で行われるので、リスニング力がとても伸びました。週末には浅草や秋葉原に遊びに行きました。日本の食べ物は何でも美味しいですが、特にラーメンが気に入りました。来月は京都に旅行する予定です。',
    translation: 'I have been studying in Tokyo since last month. At first it was hard because I didn\'t understand the language, but my host family was very kind and helped me. I attend Japanese school every day, and since classes are conducted almost entirely in Japanese, my listening ability has improved a lot. On weekends I went to Asakusa and Akihabara. All Japanese food is delicious, but I especially liked ramen. I plan to travel to Kyoto next month.',
    questions: [
      { question: 'どこに留学していますか。', questionEn: 'Where are they studying abroad?', options: ['大阪', '京都', '東京', '北海道'], correctIndex: 2 },
      { question: '何が一番伸びましたか。', questionEn: 'What improved the most?', options: ['読む力', 'リスニング力', '書く力', '漢字の力'], correctIndex: 1 },
      { question: '特に何が気に入りましたか。', questionEn: 'What did they especially like?', options: ['寿司', 'てんぷら', 'ラーメン', 'うどん'], correctIndex: 2 },
    ],
    wordCount: 120,
  },
  {
    id: 8,
    title: 'A Job Interview',
    titleJp: '面接',
    jlptLevel: 'N4',
    topic: 'Work',
    passage: '来週の水曜日に面接があります。それで今、準備をしています。まず、会社について調べました。その会社はIT関係の会社で、社員は500人ぐらいいるそうです。面接では自己紹介をしなければなりません。また、なぜこの会社で働きたいのかも説明する必要があります。緊張していますが、自分の気持ちをちゃんと伝えられるように練習しています。',
    translation: 'I have an interview next Wednesday. So I am preparing now. First, I researched the company. That company is in IT, and apparently has about 500 employees. At the interview, I have to introduce myself. I also need to explain why I want to work at this company. I am nervous, but I am practicing so I can properly convey my feelings.',
    questions: [
      { question: '面接はいつですか。', questionEn: 'When is the interview?', options: ['月曜日', '火曜日', '水曜日', '木曜日'], correctIndex: 2 },
      { question: '会社は何の会社ですか。', questionEn: 'What kind of company is it?', options: ['食品', 'IT関係', '教育', '医療'], correctIndex: 1 },
      { question: '面接で何をしなければなりませんか。', questionEn: 'What must be done at the interview?', options: ['テストを受ける', '自己紹介をする', '書類を書く', '電話をかける'], correctIndex: 1 },
    ],
    wordCount: 105,
  },
  {
    id: 9,
    title: 'Japanese Festivals',
    titleJp: '日本のお祭り',
    jlptLevel: 'N4',
    topic: 'Culture',
    passage: '日本には一年を通じて様々なお祭りがあります。夏祭りは特に人気があり、多くの人が浴衣を着て参加します。祭りでは屋台がたくさん出て、焼きそばやたこ焼きなどを売っています。夜には花火大会が開かれることが多く、空に大きな花火が上がると、みんなが「きれい！」と叫びます。私は去年、地元の祭りで太鼓を叩く体験をしました。とても楽しかったです。',
    translation: 'Japan has various festivals throughout the year. Summer festivals are especially popular, and many people participate wearing yukata. At festivals, many food stalls appear, selling yakisoba and takoyaki. At night, fireworks displays are often held, and when large fireworks go up in the sky, everyone shouts "Beautiful!" Last year, I had the experience of playing taiko drums at a local festival. It was very enjoyable.',
    questions: [
      { question: '夏祭りで何を着る人が多いですか。', questionEn: 'What do many people wear at summer festivals?', options: ['着物', '浴衣', 'スーツ', 'ドレス'], correctIndex: 1 },
      { question: '夜に何が開かれますか。', questionEn: 'What is held at night?', options: ['コンサート', 'ダンス大会', '花火大会', '映画上映'], correctIndex: 2 },
      { question: '私は去年何をしましたか。', questionEn: 'What did I do last year?', options: ['浴衣を着た', '花火を見た', '太鼓を叩いた', '屋台を出した'], correctIndex: 2 },
    ],
    wordCount: 115,
  },

  // ═══════════════════════════════════════
  //  N3 — 3 Passages
  // ═══════════════════════════════════════
  {
    id: 10,
    title: 'Technology and Daily Life',
    titleJp: 'テクノロジーと日常生活',
    jlptLevel: 'N3',
    topic: 'Technology',
    passage: 'スマートフォンの普及により、私たちの生活は大きく変わりました。買い物をするにしても、友達と連絡を取るにしても、スマートフォンがあれば簡単にできます。しかし、便利な一方で、問題もあります。例えば、歩きスマホによる事故が増えていますし、SNSの使いすぎによるコミュニケーション能力の低下も指摘されています。技術は私たちの生活を豊かにしますが、使い方を誤ると逆効果になりかねません。大切なのは、技術に頼りすぎず、バランスよく活用することではないでしょうか。',
    translation: 'With the spread of smartphones, our lives have changed dramatically. Whether shopping or contacting friends, it can be done easily with a smartphone. However, while convenient, there are also problems. For example, accidents from texting while walking are increasing, and the decline of communication skills due to overuse of social media has been pointed out. Technology enriches our lives, but if used incorrectly, it can have the opposite effect. What\'s important is to use technology in a balanced way without relying on it too much.',
    questions: [
      { question: 'スマートフォンの問題として挙げられているのは何ですか。', questionEn: 'What is mentioned as a problem with smartphones?', options: ['値段が高い', '壊れやすい', '歩きスマホの事故', '電池がすぐなくなる'], correctIndex: 2 },
      { question: '筆者が大切だと言っていることは何ですか。', questionEn: 'What does the author say is important?', options: ['スマホを使わない', 'バランスよく活用する', '新しい技術を開発する', 'SNSをやめる'], correctIndex: 1 },
      { question: 'この文章の主なテーマは何ですか。', questionEn: 'What is the main theme of this passage?', options: ['スマホの歴史', 'SNSの使い方', 'テクノロジーの利点と問題点', '事故の防止方法'], correctIndex: 2 },
    ],
    wordCount: 160,
  },
  {
    id: 11,
    title: 'Work-Life Balance',
    titleJp: 'ワークライフバランス',
    jlptLevel: 'N3',
    topic: 'Society',
    passage: '近年、日本では「ワークライフバランス」という考え方が注目されています。かつての日本社会では、長時間労働が当たり前とされ、会社のために自分の時間を犠牲にすることが美徳とされてきました。しかし、過労による健康問題や、少子化の一因として長時間労働が指摘されるようになり、状況は変わりつつあります。政府は働き方改革を推進し、残業の上限規制や有給休暇の取得促進などの政策を打ち出しました。企業もリモートワークやフレックスタイム制度を導入するところが増えています。ただし、実際にこれらの制度が十分に機能しているかどうかについては、まだ議論の余地があります。',
    translation: 'In recent years, the concept of "work-life balance" has been getting attention in Japan. In Japanese society of the past, long working hours were considered normal, and sacrificing personal time for the company was regarded as a virtue. However, as long working hours began to be pointed out as a cause of health problems from overwork and declining birth rates, the situation is changing. The government promoted work reform and introduced policies such as overtime limits and promotion of paid leave. More companies are also introducing remote work and flextime systems. However, whether these systems are functioning sufficiently is still a matter of debate.',
    questions: [
      { question: 'かつての日本では何が当たり前でしたか。', questionEn: 'What was considered normal in old Japan?', options: ['短時間労働', '長時間労働', 'リモートワーク', 'フレックスタイム'], correctIndex: 1 },
      { question: '政府が推進しているのは何ですか。', questionEn: 'What is the government promoting?', options: ['教育改革', '働き方改革', '税制改革', '医療改革'], correctIndex: 1 },
      { question: '筆者はこれらの制度についてどう考えていますか。', questionEn: 'What does the author think about these systems?', options: ['完全に成功している', 'まだ議論の余地がある', '全く効果がない', '必要ない'], correctIndex: 1 },
    ],
    wordCount: 190,
  },
  {
    id: 12,
    title: 'Environmental Issues',
    titleJp: '環境問題',
    jlptLevel: 'N3',
    topic: 'Environment',
    passage: '地球温暖化は、現代社会が直面する最も深刻な問題の一つです。産業革命以降、化石燃料の大量使用により二酸化炭素の排出量が急増し、地球の平均気温は着実に上昇しています。その結果、海面上昇や異常気象の頻発など、様々な影響が現れています。この問題に対処するため、多くの国が再生可能エネルギーの導入を進めています。日本でも太陽光発電や風力発電の普及が進んでいますが、エネルギー自給率はまだ低い状態です。個人レベルでも、省エネ行動やリサイクルの推進など、できることはたくさんあります。',
    translation: 'Global warming is one of the most serious problems facing modern society. Since the Industrial Revolution, CO2 emissions have surged due to massive use of fossil fuels, and the Earth\'s average temperature has been steadily rising. As a result, various effects such as rising sea levels and frequent extreme weather events have appeared. To address this problem, many countries are advancing the adoption of renewable energy. In Japan too, solar and wind power generation are spreading, but the energy self-sufficiency rate is still low. Even at the individual level, there are many things we can do, such as energy-saving actions and promoting recycling.',
    questions: [
      { question: '地球温暖化の主な原因は何ですか。', questionEn: 'What is the main cause of global warming?', options: ['人口増加', '化石燃料の大量使用', '森林伐採', '水質汚染'], correctIndex: 1 },
      { question: '温暖化の影響として挙げられていないものは何ですか。', questionEn: 'Which is NOT mentioned as an effect of warming?', options: ['海面上昇', '異常気象', '地震の増加', '気温の上昇'], correctIndex: 2 },
      { question: '日本のエネルギー自給率はどうですか。', questionEn: 'How is Japan\'s energy self-sufficiency rate?', options: ['とても高い', '世界一', 'まだ低い', '十分である'], correctIndex: 2 },
    ],
    wordCount: 175,
  },

  // ═══════════════════════════════════════
  //  N2 — 2 Passages
  // ═══════════════════════════════════════
  {
    id: 13,
    title: 'The Role of AI in Education',
    titleJp: '教育におけるAIの役割',
    jlptLevel: 'N2',
    topic: 'Education',
    passage: '人工知能（AI）の教育分野への応用が急速に進んでいる。従来の画一的な教育とは異なり、AIを活用すれば、一人一人の学習進度や理解度に合わせた個別最適化された学習が可能になる。例えば、AIが学習者の弱点を分析し、それに応じた問題を自動的に出題するシステムが既に実用化されている。また、言語学習においては、AIチャットボットとの会話練習が注目を集めている。しかしながら、AIに過度に依存することへの懸念も少なくない。批判的思考力や創造性といった、人間にしか育めない能力の発達が阻害されるのではないかという指摘がある。教育におけるAIの活用は、あくまで教師の補助的役割にとどめ、人間同士の対話や協働学習の機会を確保することが肝要であろう。',
    translation: 'The application of artificial intelligence (AI) to education is advancing rapidly. Unlike conventional uniform education, by utilizing AI, individually optimized learning tailored to each person\'s progress and comprehension level becomes possible. For example, systems where AI analyzes learners\' weaknesses and automatically generates corresponding problems are already in practical use. Also, in language learning, conversation practice with AI chatbots is gaining attention. However, there are considerable concerns about excessive dependence on AI. There are concerns that the development of abilities that only humans can nurture, such as critical thinking and creativity, may be hindered. The use of AI in education should remain in a supplementary role to teachers, and it is essential to ensure opportunities for human dialogue and collaborative learning.',
    questions: [
      { question: 'AIを活用した教育の利点として述べられているのは何ですか。', questionEn: 'What is stated as an advantage of AI-based education?', options: ['教師が不要になる', '個別最適化された学習', '学費が安くなる', '学校に行かなくてよくなる'], correctIndex: 1 },
      { question: 'AIへの懸念として挙げられているのは何ですか。', questionEn: 'What is mentioned as a concern about AI?', options: ['コストが高い', '技術が未熟', '批判的思考力の発達が阻害される', 'プライバシーの問題'], correctIndex: 2 },
      { question: '筆者はAIの教育での役割をどう考えていますか。', questionEn: 'How does the author view AI\'s role in education?', options: ['教師の代わりになるべき', '全く使うべきではない', '補助的役割にとどめるべき', '生徒に任せるべき'], correctIndex: 2 },
    ],
    wordCount: 230,
  },
  {
    id: 14,
    title: 'Aging Society and Its Challenges',
    titleJp: '高齢化社会とその課題',
    jlptLevel: 'N2',
    topic: 'Society',
    passage: '日本は世界で最も高齢化が進んだ国の一つであり、総人口に占める65歳以上の割合は既に29%を超えている。この急速な高齢化は、社会保障制度に大きな負担をかけている。年金、医療、介護にかかる費用は年々増大し、現役世代の負担は限界に近づいている。一方で、高齢者の社会参加を促進する動きも活発化している。定年後も働き続ける「シニア人材」の活用や、高齢者が地域のボランティア活動に参加する事例が増えている。また、テクノロジーの活用も重要な対策の一つだ。介護ロボットやIoTを活用した見守りシステムの導入が進められている。高齢化社会の課題を解決するためには、世代間の協力と、社会制度の柔軟な見直しが不可欠である。',
    translation: 'Japan is one of the most aged societies in the world, with the proportion of people aged 65 and over already exceeding 29% of the total population. This rapid aging is placing a heavy burden on the social security system. Costs for pensions, healthcare, and nursing care are increasing year by year, and the burden on the working generation is approaching its limit. On the other hand, movements to promote social participation by elderly people are also becoming active. Utilization of "senior talent" who continue working after retirement and cases of elderly people participating in local volunteer activities are increasing. Also, the use of technology is one important countermeasure. Introduction of nursing care robots and monitoring systems using IoT is being advanced. To solve the challenges of an aging society, cooperation between generations and flexible review of social systems are essential.',
    questions: [
      { question: '日本の65歳以上の割合はどのくらいですか。', questionEn: 'What is the proportion of people aged 65+ in Japan?', options: ['約15%', '約20%', '約25%', '29%以上'], correctIndex: 3 },
      { question: 'テクノロジーの活用例として挙げられていないものは何ですか。', questionEn: 'Which is NOT mentioned as a use of technology?', options: ['介護ロボット', 'IoT見守りシステム', '自動運転車', 'シニア人材の活用'], correctIndex: 2 },
      { question: '筆者が不可欠だと述べているのは何ですか。', questionEn: 'What does the author say is essential?', options: ['経済成長', '世代間の協力と制度の見直し', '移民の受け入れ', '出生率の向上'], correctIndex: 1 },
    ],
    wordCount: 235,
  },

  // ═══════════════════════════════════════
  //  N1 — 1 Passage
  // ═══════════════════════════════════════
  {
    id: 15,
    title: 'The Meaning of Language and Culture',
    titleJp: '言語と文化の関係性',
    jlptLevel: 'N1',
    topic: 'Language',
    passage: '言語は単なるコミュニケーションの手段にとどまらず、文化の根幹を成すものである。サピア＝ウォーフの仮説が示唆するように、言語は話者の世界認識そのものを規定しうる。例えば、日本語には主語を省略する傾向があるが、これは日本文化における「察する」文化、すなわち言外の意味を読み取ることを重視する姿勢と密接に関連している。また、敬語体系の複雑さは、日本社会における上下関係や相互の距離感を精緻に表現する必要性から発達したものと言えよう。翻って、英語のように主語の明示が必須である言語では、個人の主体性や自己主張が言語構造に組み込まれていると解釈することもできる。グローバル化が進む現代において、異文化理解の促進には、表面的な言語能力の習得のみならず、その背後にある文化的コンテクストへの深い理解が求められる。言語学習とは、いわば異なる世界観への扉を開く営みに他ならないのである。',
    translation: 'Language is not merely a means of communication, but forms the very foundation of culture. As the Sapir-Whorf hypothesis suggests, language can determine the speaker\'s perception of the world itself. For example, Japanese has a tendency to omit subjects, which is closely related to the "reading between the lines" culture in Japanese society — the attitude of valuing implicit meaning. Also, the complexity of the honorific system can be said to have developed from the necessity of precisely expressing hierarchical relationships and social distance in Japanese society. Conversely, in languages like English where explicit subjects are mandatory, one can interpret that individual agency and self-assertion are built into the language structure. In today\'s globalizing world, promoting cross-cultural understanding requires not only superficial acquisition of language skills, but deep understanding of the cultural context behind them. Language learning is, so to speak, nothing other than the endeavor of opening a door to a different worldview.',
    questions: [
      { question: 'サピア＝ウォーフの仮説は何を示唆していますか。', questionEn: 'What does the Sapir-Whorf hypothesis suggest?', options: ['言語は文化に影響されない', '言語が世界認識を規定しうる', 'すべての言語は同じ構造を持つ', '敬語は不要である'], correctIndex: 1 },
      { question: '日本語の主語省略は何と関連していますか。', questionEn: 'What is the omission of subjects in Japanese related to?', options: ['文法の簡略化', '言外の意味を読み取る文化', '言語能力の低さ', '漢字の影響'], correctIndex: 1 },
      { question: '筆者が言語学習をどう定義していますか。', questionEn: 'How does the author define language learning?', options: ['単語を覚えること', '文法を理解すること', '異なる世界観への扉を開くこと', '会話能力を高めること'], correctIndex: 2 },
    ],
    wordCount: 285,
  },
];

export const READING_BY_LEVEL = {
  N5: READING_DATA.filter(r => r.jlptLevel === 'N5'),
  N4: READING_DATA.filter(r => r.jlptLevel === 'N4'),
  N3: READING_DATA.filter(r => r.jlptLevel === 'N3'),
  N2: READING_DATA.filter(r => r.jlptLevel === 'N2'),
  N1: READING_DATA.filter(r => r.jlptLevel === 'N1'),
};
