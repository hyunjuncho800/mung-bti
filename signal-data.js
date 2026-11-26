// 멍시그널 데이터: 몸 신호(조절 값), 행동 상태별 자세와 설명, 참고 출처.
// 3D 모델(signal-dog.js)과 규칙 엔진(signal-rules.js)이 같은 값을 쓴다. 모델을 바꿔도 이 데이터는 그대로 쓴다.
// 브라우저에서는 window.MungSignalData, Node(빌드·테스트)에서는 require로 쓴다.
(function (root) {
    // 조절할 수 있는 몸 신호. min~max 사이 값이고, 모델은 이 값만 보고 자세를 만든다.
    var PARAMS = [
        { id: 'earForward', label: '귀가 앞으로 서는 정도', min: 0, max: 1, step: 0.05, def: 0.3, left: '자연스럽게', right: '앞으로 쫑긋' },
        { id: 'earBack', label: '귀가 뒤로 눕는 정도', min: 0, max: 1, step: 0.05, def: 0.1, left: '그대로', right: '뒤로 바짝' },
        { id: 'tailHeight', label: '꼬리 높이', min: -1, max: 1, step: 0.05, def: 0, left: '다리 사이로', right: '높이 바짝' },
        { id: 'wagSpeed', label: '꼬리 흔드는 속도', min: 0, max: 1, step: 0.05, def: 0.2, left: '멈춤', right: '빠르게' },
        { id: 'wagRange', label: '꼬리 흔드는 폭', min: 0, max: 1, step: 0.05, def: 0.4, left: '좁게', right: '넓게' },
        { id: 'bodyHeight', label: '몸 높이', min: -1, max: 0.3, step: 0.05, def: 0, left: '바닥에 붙음', right: '높이 섬' },
        { id: 'bow', label: '앞을 낮추고 엉덩이 들기', min: 0, max: 1, step: 0.05, def: 0, left: '없음', right: '놀이 인사 자세' },
        { id: 'tension', label: '몸의 긴장', min: 0, max: 1, step: 0.05, def: 0.1, left: '말랑하게 풀림', right: '뻣뻣하게 굳음' },
        { id: 'weight', label: '체중 방향', min: -1, max: 1, step: 0.05, def: 0, left: '뒤로 뺌', right: '앞으로 쏠림' },
        { id: 'headPitch', label: '고개 높이', min: -1, max: 1, step: 0.05, def: 0, left: '아래로', right: '위로' },
        { id: 'headTilt', label: '고개 기울이기', min: -1, max: 1, step: 0.05, def: 0, left: '왼쪽', right: '오른쪽' },
        { id: 'gaze', label: '시선', min: -1, max: 1, step: 0.05, def: 0, left: '피함', right: '똑바로 응시' },
        { id: 'mouthOpen', label: '입 벌림', min: 0, max: 1, step: 0.05, def: 0.3, left: '다묾', right: '크게 벌림' },
        { id: 'lipCurl', label: '입술 들기 (이빨 보이기)', min: 0, max: 1, step: 0.05, def: 0, left: '없음', right: '이빨이 보임' },
    ];
    // 켜고 끄는 동작과 상황. 조작 화면에서 버튼으로 바꾼다.
    var TOGGLES = [
        { id: 'lick', label: '입술 핥기' },
        { id: 'yawn', label: '하품' },
        { id: 'shake', label: '몸 털기' },
        { id: 'sniff', label: '땅 냄새 맡기' },
        { id: 'paw', label: '앞발 들기' },
        { id: 'freeze', label: '움직임 멈춤' },
        { id: 'bowl', label: '밥그릇 앞' },
    ];
    // 자세: 하나만 고른다
    var POSTURES = [
        { id: 'stand', label: '서기' },
        { id: 'sit', label: '앉기' },
        { id: 'lie', label: '엎드리기' },
        { id: 'back', label: '배 보이며 눕기' },
    ];
    var DEFAULTS = { posture: 'stand' };
    PARAMS.forEach(function (p) { DEFAULTS[p.id] = p.def; });
    TOGGLES.forEach(function (t) { DEFAULTS[t.id] = false; });

    var SOURCES = {
        dogstrust_body: { name: 'Dogs Trust: How to understand your dog\'s body language', url: 'https://www.dogstrust.org.uk/dog-advice/understanding-your-dog/body-language' },
        dogstrust_stress: { name: 'Dogs Trust: Signs your dog may be stressed', url: 'https://www.dogstrust.org.uk/dog-advice/understanding-your-dog/signs-your-dog-may-be-stressed' },
        rspca_body: { name: 'RSPCA: Understanding your dog\'s body language', url: 'https://www.rspca.org.uk/adviceandwelfare/pets/dogs/behaviour/understanding' },
        aspca_bite: { name: 'ASPCA: Dog Bite Prevention', url: 'https://www.aspca.org/pet-care/dog-care/dog-bite-prevention' },
        aspca_aggression: { name: 'ASPCA: Aggression', url: 'https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/aggression' },
        aspca_food: { name: 'ASPCA: Food Guarding', url: 'https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/food-guarding' },
    };

    // 행동 상태. pose는 PARAMS·TOGGLES·posture 값(빠진 값은 기본값), motion은 모양만 바꾸는 반복 동작(tremble: 몸 떨림, wiggle: 몸 흔들기).
    var BEHAVIORS = [
        {
            id: 'relaxed', name: '편안함', tone: 'calm',
            pose: { earForward: 0.3, earBack: 0.1, tailHeight: 0, wagSpeed: 0.15, wagRange: 0.35, bodyHeight: 0, tension: 0.1, mouthOpen: 0.35, gaze: 0 },
            motion: {},
            explain: {
                observe: '몸이 말랑하게 풀려 있고, 귀와 꼬리가 그 강아지의 평소 위치에 있어요. 입이 살짝 벌어져 있고 숨소리가 고르며, 눈빛이 부드러워요.',
                meaning: '지금 있는 곳과 상황이 편안하다는 뜻일 수 있어요.',
                check: ['몸 전체가 부드럽게 움직이는지', '눈을 부드럽게 깜빡이는지, 흰자가 보이지 않는지', '하품이나 입술 핥기가 같이 나오지 않는지'],
                action: ['지금처럼 조용한 환경을 유지해 주세요.', '쓰다듬고 싶다면 강아지가 먼저 다가오는지 보고, 짧게 쓰다듬은 뒤 반응을 살펴요.'],
                mistakes: ['귀와 꼬리 모양은 견종마다 달라요. 말티푸처럼 귀가 처진 강아지는 귀 위치로 읽기 어려워서 몸과 얼굴을 함께 봐야 해요.'],
            },
            sources: ['dogstrust_body', 'aspca_bite'],
        },
        {
            id: 'play_bow', name: '놀이 제안', tone: 'positive',
            pose: { earForward: 0.5, earBack: 0, tailHeight: 0.4, wagSpeed: 0.7, wagRange: 0.8, bodyHeight: 0, bow: 1, tension: 0.2, mouthOpen: 0.5, gaze: 0.2 },
            motion: {},
            explain: {
                observe: '앞다리를 쭉 뻗어 가슴을 낮추고 엉덩이는 높이 든 자세예요. 꼬리를 넓게 흔들고, 입이 편하게 벌어져 있어요.',
                meaning: '"같이 놀자"는 신호로 자주 보여요. 놀이 도중에 하면 "지금까지는 장난이었어"라고 알려 주는 의미일 수도 있어요.',
                check: ['몸이 통통 튀듯 가볍게 움직이는지', '상대가 반응하지 않을 때 스스로 물러나는지', '놀이가 끝난 뒤 금방 차분해지는지'],
                action: ['짧게 놀아 주고 중간중간 쉬는 시간을 넣어 주세요.', '강아지끼리 놀 때는 한쪽이 피하거나 숨으면 잠깐 떼어 놓아요.'],
                mistakes: ['이 자세 하나만 보고 다른 강아지와 무조건 잘 논다고 생각하지 마세요. 몸이 뻣뻣해지거나 한쪽만 계속 쫓으면 놀이가 아닐 수 있어요.'],
            },
            sources: ['dogstrust_body'],
        },
        {
            id: 'alert', name: '주의 집중', tone: 'caution',
            pose: { earForward: 1, earBack: 0, tailHeight: 0.55, wagSpeed: 0, wagRange: 0.1, bodyHeight: 0.15, tension: 0.6, weight: 0.5, headPitch: 0.25, gaze: 0.7, mouthOpen: 0 },
            motion: {},
            explain: {
                observe: '귀를 한쪽으로 세우고, 고개를 들고, 입을 다문 채 한곳을 바라봐요. 체중이 앞으로 실리고 꼬리가 올라가 있어요.',
                meaning: '무언가를 알아차리고 정보를 모으는 중이에요. 궁금해서일 수도, 경계해서일 수도 있어요.',
                check: ['몸이 점점 굳는지, 아니면 곧 풀리는지', '바라보는 대상이 무엇인지', '짖기, 입술 들기 같은 다음 신호가 이어지는지'],
                action: ['무엇을 보는지 확인하고, 필요하면 조용히 거리를 벌려 주세요.', '이름을 부르거나 간식으로 주의를 돌려 긴장이 더 오르지 않게 해요.'],
                mistakes: ['주의 집중은 그 자체로 나쁜 신호가 아니에요. 다만 몸이 굳고 시선이 고정된 상태가 길어지면 긴장이 높아지는 중일 수 있어요.'],
            },
            sources: ['dogstrust_body', 'aspca_bite'],
        },
        {
            id: 'anxious', name: '불안 신호', tone: 'stress',
            pose: { earForward: 0, earBack: 0.65, tailHeight: -0.45, wagSpeed: 0, wagRange: 0.1, bodyHeight: -0.3, tension: 0.6, weight: -0.35, headPitch: -0.35, gaze: -0.6, mouthOpen: 0, lick: true },
            motion: {},
            explain: {
                observe: '귀가 뒤로 젖혀지고, 꼬리가 낮아지고, 몸이 살짝 낮아졌어요. 시선을 피하고 입술을 핥아요.',
                meaning: '지금 상황이 부담스럽고 불편하다는 이른 신호일 수 있어요. 이 단계에서 알아차리면 더 큰 반응을 막기 쉬워요.',
                check: ['하품, 몸 털기, 헐떡임이 덥지 않은데도 나오는지', '자리를 피하려고 하는지', '무엇이 생긴 뒤에 이런 모습이 시작됐는지'],
                action: ['불편해하는 원인(사람, 소리, 손길)에서 거리를 벌려 주세요.', '억지로 다가가거나 안지 말고, 스스로 쉴 곳으로 갈 수 있게 해 주세요.'],
                mistakes: ['입술 핥기나 하품은 먹은 뒤나 졸릴 때도 해요. 한 가지 신호만으로 불안하다고 단정하지 말고 몸 전체와 상황을 같이 봐요.'],
            },
            sources: ['dogstrust_stress', 'rspca_body', 'aspca_bite'],
        },
        {
            id: 'fearful', name: '두려움 신호', tone: 'fear',
            pose: { earForward: 0, earBack: 1, tailHeight: -1, wagSpeed: 0, wagRange: 0, bodyHeight: -0.75, tension: 0.8, weight: -0.7, headPitch: -0.6, gaze: -0.8, mouthOpen: 0 },
            motion: { tremble: true },
            explain: {
                observe: '몸을 바닥 가까이 낮추고, 꼬리를 다리 사이로 말아 넣고, 귀를 뒤로 바짝 붙여요. 체중이 뒤로 빠져 있고 몸을 떨기도 해요.',
                meaning: '무섭거나 위협을 느끼고 있다는 신호예요. 피할 곳이 없다고 느끼면 경고나 방어 행동으로 이어질 수 있어요.',
                check: ['숨거나 도망칠 곳을 찾는지', '눈 흰자가 보이는지', '몸이 굳으며 움직임이 멈추는지'],
                action: ['무서워하는 대상을 멀리하고, 강아지가 숨을 수 있는 공간을 막지 마세요.', '혼내거나 억지로 끌어내지 마세요. 두려움이 더 커질 수 있어요.', '자주 반복된다면 수의사나 반려견 행동 전문가와 상담해 주세요.'],
                mistakes: ['배를 보이며 눕는 행동을 "배 쓰다듬어 달라"로 읽기 쉬운데, 불안한 강아지가 "해치지 말아 달라"는 뜻으로 하는 경우도 많아요.'],
            },
            sources: ['rspca_body', 'dogstrust_body', 'aspca_bite'],
        },
        {
            id: 'warning', name: '경고 신호', tone: 'warning',
            pose: { earForward: 0.6, earBack: 0, tailHeight: 0.6, wagSpeed: 0.25, wagRange: 0.12, bodyHeight: 0.1, tension: 1, weight: 0.55, headPitch: -0.05, gaze: 1, mouthOpen: 0.05, lipCurl: 0.75 },
            motion: {},
            explain: {
                observe: '몸이 뻣뻣하게 굳고, 대상을 똑바로 응시하며, 입술을 들어 이빨을 보여요. 꼬리가 높게 선 채로 좁고 딱딱하게 움직이기도 해요.',
                meaning: '"더 다가오지 마"라는 분명한 경고예요. 이 신호를 무시하면 무는 행동으로 이어질 수 있어요.',
                check: ['으르렁거림이 함께 나오는지', '무엇을 지키려는지(음식, 장난감, 쉬는 자리)', '이 신호 전에 하품, 시선 피하기 같은 작은 신호가 있었는지'],
                action: ['바로 움직임을 멈추고, 등을 보이지 말고 천천히 거리를 벌려 주세요.', '경고했다고 혼내지 마세요. 경고를 혼나면 다음엔 경고 없이 물 수 있어요.', '같은 상황에서 반복된다면 수의사나 반려견 행동 전문가와 상담해 주세요.'],
                mistakes: ['꼬리를 흔든다고 반가운 건 아니에요. 몸이 굳고 시선이 고정된 채 흔드는 꼬리는 긴장의 신호일 수 있어요.'],
            },
            sources: ['rspca_body', 'aspca_bite', 'aspca_aggression'],
        },
        {
            id: 'greeting', name: '반가운 인사', tone: 'positive',
            pose: { earForward: 0.15, earBack: 0.35, tailHeight: 0.15, wagSpeed: 0.85, wagRange: 1, bodyHeight: -0.1, tension: 0.15, weight: 0.2, mouthOpen: 0.6, gaze: 0.1 },
            motion: { wiggle: true },
            explain: {
                observe: '몸 전체가 말랑하게 움직이고, 엉덩이까지 같이 흔들릴 만큼 꼬리를 넓게 흔들어요. 꼬리가 프로펠러처럼 빙글빙글 돌기도 해요. 눈은 둥글고 부드럽고, 입이 편하게 벌어져 있어요.',
                meaning: '좋아하는 사람이나 친구를 만나 반가운 상태일 수 있어요.',
                check: ['몸이 굳지 않고 계속 말랑한지', '다가왔다가 금방 물러나기를 되풀이하지 않는지', '흥분이 너무 오래 이어지지 않는지'],
                action: ['반갑게 인사를 받아 주세요.', '너무 흥분했다면 잠깐 조용히 기다렸다가 차분해지면 쓰다듬어 주세요.'],
                mistakes: ['몸을 낮추고 꼬리를 빠르게 흔들며 다가왔다가 금방 물러난다면, 반가움이 아니라 불안을 달래려는 행동일 수 있어요.'],
            },
            sources: ['dogstrust_body'],
        },
        {
            id: 'curious', name: '궁금함', tone: 'positive',
            pose: { earForward: 0.8, earBack: 0, tailHeight: 0.2, wagSpeed: 0.1, wagRange: 0.3, tension: 0.3, mouthOpen: 0.1, gaze: 0.3, headTilt: 0.7 },
            motion: {},
            explain: {
                observe: '고개를 한쪽으로 갸웃하고 귀를 소리 나는 쪽으로 세워요. 몸은 크게 긴장하지 않았어요.',
                meaning: '처음 듣는 소리나 낯선 것을 더 알아보려는 모습일 수 있어요.',
                check: ['몸이 계속 풀려 있는지, 점점 굳는지', '다가가서 냄새를 맡는지, 피하려는지', '시선이 대상에 고정된 채 움직임이 멈추지 않는지'],
                action: ['스스로 살펴볼 시간을 주세요.', '처음 보는 물건은 억지로 들이밀지 말고 강아지가 먼저 다가가게 해 주세요.'],
                mistakes: ['고개 갸웃은 궁금할 때만 하는 게 아니에요. 불안할 때 상황을 파악하려고 하기도 해서 귀, 꼬리, 몸의 긴장을 함께 봐야 해요.'],
            },
            sources: ['dogstrust_body'],
        },
        {
            id: 'stress_yawn', name: '졸리지 않은 하품', tone: 'stress',
            pose: { earForward: 0, earBack: 0.6, tailHeight: -0.3, wagSpeed: 0, tension: 0.55, headPitch: -0.15, gaze: -0.6, mouthOpen: 0, yawn: true },
            motion: {},
            explain: {
                observe: '졸릴 상황이 아닌데 크게 하품하고, 고개를 돌려 시선을 피해요. 귀가 뒤로 젖혀져 있어요.',
                meaning: '부담스러운 상황에서 스스로를 진정시키려는 신호일 수 있어요.',
                check: ['방금 무슨 일이 있었는지(안기, 낯선 사람, 병원 등)', '입술 핥기, 시선 피하기가 같이 나오는지', '정말 졸린 시간인지'],
                action: ['하던 일을 잠깐 멈추고 쉴 틈을 주세요.', '원인이 사람이나 손길이라면 조금 떨어져 주세요.'],
                mistakes: ['하품을 보면 "졸리구나" 하고 넘기기 쉬워요. 잘 시간이 아닌데 긴장되는 순간에 하품한다면 스트레스 신호일 수 있어요.'],
            },
            sources: ['dogstrust_stress', 'rspca_body', 'aspca_bite'],
        },
        {
            id: 'shake_off', name: '몸 털기', tone: 'stress',
            pose: { earForward: 0.1, earBack: 0.3, tailHeight: -0.3, wagSpeed: 0, tension: 0.4, mouthOpen: 0.1, shake: true },
            motion: {},
            explain: {
                observe: '젖지 않았는데 머리부터 꼬리까지 몸을 세게 털어요. 긴장되는 일이 끝난 직후에 자주 보여요.',
                meaning: '쌓인 긴장을 털어 내고 마음을 가라앉히는 행동일 수 있어요. 가벼운 스트레스를 스스로 다루는 방법이에요.',
                check: ['털기 직전에 어떤 일이 있었는지', '털고 난 뒤 몸이 풀리는지', '자꾸 되풀이하거나 귀, 피부를 긁지 않는지'],
                action: ['털고 나면 잠깐 쉴 시간을 주세요.', '자주 털거나 긁는다면 아프거나 가려운 곳이 없는지 동물병원에서 확인해 주세요.'],
                mistakes: ['몸 털기를 털 정리로만 보기 쉬워요. 안긴 뒤나 다른 강아지를 만난 뒤에 털었다면 그 상황이 조금 부담스러웠을 수 있어요.'],
            },
            sources: ['dogstrust_body'],
        },
        {
            id: 'sniff_ground', name: '딴청 피우며 냄새 맡기', tone: 'stress',
            pose: { earForward: 0, earBack: 0.4, tailHeight: -0.3, wagSpeed: 0, tension: 0.45, headPitch: -0.5, gaze: -0.5, mouthOpen: 0, sniff: true },
            motion: {},
            explain: {
                observe: '무언가와 마주친 직후에 갑자기 땅에 코를 대고 냄새를 맡아요. 상대를 보지 않고 딴청을 피우는 것처럼 보여요.',
                meaning: '긴장을 낮추려는 행동일 수 있어요. 물론 그냥 냄새가 궁금해서일 때도 많아요.',
                check: ['냄새 맡기 직전에 다른 강아지나 사람이 다가왔는지', '귀와 꼬리가 낮아졌는지', '냄새를 맡고 나서 몸이 풀리는지'],
                action: ['다그치거나 줄을 당기지 말고 잠깐 기다려 주세요.', '다가오는 상대가 원인이라면 거리를 벌려 주세요.'],
                mistakes: ['산책 중 냄새 맡기는 대부분 자연스러운 탐색이에요. 갑자기, 무언가와 마주친 직후에 나올 때 긴장 신호로 볼 수 있어요.'],
            },
            sources: ['dogstrust_body'],
        },
        {
            id: 'paw_sit', name: '앉아서 앞발 들기', tone: 'stress',
            pose: { posture: 'sit', earForward: 0, earBack: 0.7, tailHeight: -0.7, wagSpeed: 0, tension: 0.55, headPitch: -0.4, gaze: -0.7, mouthOpen: 0, paw: true },
            motion: {},
            explain: {
                observe: '앉은 채로 고개를 숙이고 시선을 피해요. 꼬리는 몸 쪽으로 붙이고, 귀는 뒤로 젖히고, 앞발 하나를 살짝 들어요.',
                meaning: '불편하거나 걱정스럽다는 신호일 수 있어요.',
                check: ['하품이나 입술 핥기가 같이 나오는지', '누가 몸을 굽혀 가까이 다가오고 있지 않은지', '자리를 피하려고 하는지'],
                action: ['몸을 굽혀 다가가지 말고 조금 물러나 주세요.', '강아지가 스스로 다가올 때까지 기다려 주세요.'],
                mistakes: ['앞발 드는 모습을 "손" 하는 귀여운 행동으로만 보기 쉬워요. 고개를 숙이고 시선을 피하며 든다면 불편하다는 뜻일 수 있어요.'],
            },
            sources: ['rspca_body'],
        },
        {
            id: 'guarding', name: '자원 지키기', tone: 'warning',
            pose: { earForward: 0.3, earBack: 0.2, tailHeight: 0.1, wagSpeed: 0, wagRange: 0.1, tension: 0.95, weight: 0.2, headPitch: -0.85, gaze: 0.9, mouthOpen: 0, lipCurl: 0.15, bowl: true, freeze: true },
            motion: {},
            explain: {
                observe: '밥그릇 위로 몸을 숙인 채 뻣뻣하게 굳어요. 움직임을 멈추고 다가오는 쪽을 똑바로 쳐다보거나, 급하게 먹기도 해요.',
                meaning: '밥이나 장난감처럼 소중한 것을 빼앗길까 봐 지키는 행동일 수 있어요. 더 다가가면 으르렁거리거나 물 수 있어요.',
                check: ['으르렁거림이나 입술 들기가 함께 나오는지', '어떤 물건, 어떤 사람에게 그러는지', '먹는 속도가 갑자기 빨라지는지'],
                action: ['먹거나 무언가를 갖고 있을 때는 다가가지 말고 떨어져 주세요.', '혼내거나 억지로 빼앗지 마세요. 지키려는 마음이 더 커질 수 있어요.', '아이가 있는 집이거나 되풀이된다면 수의사나 반려견 행동 전문가와 상담해 주세요.'],
                mistakes: ['"누가 주인인지 보여 줘야 한다"며 밥그릇을 빼앗는 건 오히려 위험해요. 강아지는 다가오는 사람을 밥을 가져가려는 사람으로 받아들여요.'],
            },
            sources: ['aspca_food', 'aspca_aggression'],
        },
        {
            id: 'resting', name: '엎드려 쉬기', tone: 'calm',
            pose: { posture: 'lie', earForward: 0.1, earBack: 0.15, tailHeight: -0.1, wagSpeed: 0, tension: 0.05, headPitch: -0.5, mouthOpen: 0.15, gaze: 0 },
            motion: {},
            explain: {
                observe: '배를 바닥에 대고 엎드려 몸에 힘을 뺐어요. 머리를 앞발 쪽으로 내려놓고, 눈이 반쯤 감겨 있어요.',
                meaning: '지금 있는 곳이 안전하고 편하다고 느끼는 모습일 수 있어요.',
                check: ['숨이 고르고 몸이 말랑한지', '작은 소리에도 벌떡 일어나지 않는지', '쉬거나 자는 시간이 평소보다 갑자기 늘거나 줄지 않았는지'],
                action: ['쉬고 있을 땐 깨우거나 만지지 말고 그대로 두세요.', '자는 시간이 갑자기 달라졌다면 동물병원에서 확인해 주세요.'],
                mistakes: ['쉬는 강아지를 갑자기 만지거나 옮기면 놀라서 방어할 수 있어요. 깨어 있을 때 다가와 주기를 기다려 주세요.'],
            },
            sources: ['dogstrust_body', 'aspca_aggression'],
        },
        {
            id: 'belly_relaxed', name: '편하게 배 보이기', tone: 'calm',
            pose: { posture: 'back', earForward: 0, earBack: 0.2, tailHeight: 0, wagSpeed: 0.3, wagRange: 0.4, tension: 0.05, mouthOpen: 0.5, gaze: 0 },
            motion: {},
            explain: {
                observe: '믿는 사람 앞에서 배를 드러내고 벌러덩 누워요. 몸과 다리가 축 늘어지고, 입이 편하게 벌어져 있어요.',
                meaning: '안전하다고 느끼고, 배를 쓰다듬어 달라는 뜻일 수 있어요.',
                check: ['다리와 몸이 축 늘어져 있는지', '꼬리를 말아 넣거나 귀를 바짝 젖히지 않았는지', '쓰다듬다 멈췄을 때 더 해 달라고 다가오는지'],
                action: ['배를 3초쯤 가볍게 쓰다듬고 손을 떼 보세요. 더 원하면 다시 다가와요.'],
                mistakes: ['배를 보인다고 모두 쓰다듬어 달라는 뜻은 아니에요. 몸이 굳고 꼬리를 말아 넣었다면 "불안해서 배 보이기"일 수 있어요.'],
            },
            sources: ['dogstrust_body'],
        },
        {
            id: 'appeasement_roll', name: '불안해서 배 보이기', tone: 'fear',
            pose: { posture: 'back', earForward: 0, earBack: 1, tailHeight: -1, wagSpeed: 0, wagRange: 0, tension: 0.85, gaze: 0.6, mouthOpen: 0 },
            motion: {},
            explain: {
                observe: '옆으로 또는 등을 대고 누웠는데 몸이 굳어 있어요. 꼬리를 말아 넣고 귀를 바짝 젖힌 채, 걱정되는 대상을 계속 쳐다봐요. 뒷다리 하나를 뻣뻣하게 들기도 해요.',
                meaning: '"나는 해치지 않아요, 다가오지 마세요"라는 뜻일 수 있어요. 위협을 느껴서 당장 거리가 필요한 상태예요.',
                check: ['몸과 뒷다리에 힘이 들어가 있는지', '꼬리를 말고 귀를 젖혔는지', '시선이 다가오는 사람이나 강아지에게 고정돼 있는지'],
                action: ['다가가거나 배를 만지지 말고 바로 물러나 주세요.', '다른 사람이나 강아지도 다가가지 않게 해 주세요.', '자주 보인다면 반려견 행동 전문가와 상담해 주세요.'],
                mistakes: ['배를 쓰다듬어 달라는 뜻으로 가장 오해하기 쉬운 자세예요. 계속 다가가면 으르렁거리거나 물 수 있어요.'],
            },
            sources: ['dogstrust_body', 'dogstrust_stress', 'aspca_bite'],
        },
    ];

    var api = { PARAMS: PARAMS, TOGGLES: TOGGLES, POSTURES: POSTURES, DEFAULTS: DEFAULTS, BEHAVIORS: BEHAVIORS, SOURCES: SOURCES };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.MungSignalData = api;
})(this);
