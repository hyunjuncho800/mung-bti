// 멍상황: 일상 상황 12가지. 상황마다 강아지 행동(signal-data.js의 행동 id), 3D 소품, 보이는 신호, 의미, 다른 강아지라면, 보호자 선택지와 해설.
// 선택지 해설은 각 출처의 안내(거리 두기, 억지로 하지 않기, 혼내지 않기)를 바탕으로 멍테스트가 직접 정리했다.
// verdict: good(좋은 선택) / ok(상황에 따라 괜찮음) / bad(피하는 게 좋음). env: 3D 배경(signal-env.js)
(function (root) {
    var SCENES = [
        {
            id: 'home_return', env: 'entrance', title: '보호자가 집에 돌아왔을 때', behavior: 'greeting', props: ['door', 'person'],
            person: { kind: 'adult', from: [0.45, 2.35], to: [0.45, 1.55] },
            situation: '현관문이 열리고 보호자가 들어와요. 강아지가 현관으로 달려 나와요.',
            signals: ['엉덩이까지 흔들리는 넓은 꼬리 흔들기', '말랑하게 움직이는 몸', '부드러운 눈과 편하게 벌린 입'],
            meaning: '보호자를 다시 만나 반가운 상태일 수 있어요.',
            alt: { behavior: 'excited', text: '어떤 강아지는 펄쩍펄쩍 뛰며 크게 흥분해요. 혼자 있는 동안 불안했던 강아지는 지나치게 흥분하거나, 반대로 보호자에게 거의 반응하지 않기도 해요.' },
            choices: [
                { text: '차분하게 인사하고, 강아지가 진정되면 쓰다듬어 준다', verdict: 'good', why: '반가움은 받아 주면서 흥분이 더 오르지 않게 해요.' },
                { text: '뛰어오르면 큰 소리로 혼낸다', verdict: 'bad', why: '혼나면 불안이 더해질 수 있어요. 뛰어오를 땐 반응을 멈추고, 네 발이 바닥에 닿았을 때 칭찬하는 편이 좋아요.' },
                { text: '반가우니 같이 뛰면서 흥분을 더 끌어올린다', verdict: 'ok', why: '함께 즐거운 건 좋지만, 매번 크게 흥분시키면 진정하기 어려워져요. 인사는 짧고 차분하게 하는 게 좋아요.' },
            ],
            sources: ['dogstrust_body', 'dogstrust_jump', 'dogstrust_sep'],
        },
        {
            id: 'meet_dog', env: 'park', title: '산책 중 다른 강아지를 만났을 때', behavior: 'alert', props: ['otherDog'],
            situation: '산책길 앞쪽에서 다른 강아지가 다가와요. 우리 강아지가 걸음을 멈춰요.',
            signals: ['앞으로 쫑긋 선 귀', '앞으로 쏠린 체중', '상대 강아지에게 고정된 시선'],
            meaning: '상대에게 관심이 있거나 경계하는 중일 수 있어요. 다음에 몸이 풀리는지, 굳는지가 중요해요.',
            alt: { behavior: 'play_bow', text: '편한 강아지는 몸을 낮춰 놀이 인사를 하거나 잠깐 냄새만 맡고 지나가요. 무서운 강아지는 꼬리를 내리고 보호자 뒤로 숨으려고 해요.' },
            choices: [
                { text: '거리를 두고 지나가며, 우리 강아지가 차분하면 칭찬한다', verdict: 'good', why: '편하게 지나갈 수 있는 거리를 지키면 긴장이 오르지 않아요. 차분한 행동을 칭찬하면 다음에도 차분하기 쉬워요.' },
                { text: '두 강아지 모두 편해 보이면 짧게 냄새를 맡게 하고 다시 걷는다', verdict: 'good', why: '양쪽 모두 몸이 풀려 있다면 짧은 인사는 괜찮아요. 오래 붙어 있지 않게 금방 다시 걸어 주세요.' },
                { text: '사회성을 기르려고 줄을 당겨 억지로 가까이 데려간다', verdict: 'bad', why: '긴장한 강아지를 억지로 맞서게 하면 오히려 더 나빠질 수 있어요.' },
            ],
            sources: ['dogstrust_react', 'dogstrust_body'],
        },
        {
            id: 'visitor', env: 'entrance', title: '낯선 사람이 집에 왔을 때', behavior: 'anxious', props: ['door', 'person'],
            person: { kind: 'adult', from: [0.45, 2.35], to: [0.45, 1.5] },
            situation: '처음 보는 손님이 현관으로 들어와요.',
            signals: ['뒤로 젖힌 귀', '낮아진 꼬리', '뒤로 빠진 체중과 시선 피하기', '입술 핥기'],
            meaning: '낯선 사람이 부담스럽다는 신호일 수 있어요.',
            alt: { behavior: 'greeting', text: '사람을 좋아하는 강아지는 꼬리를 흔들며 반기기도 해요. 그래도 손님이 먼저 다가가기보다 강아지가 다가오게 하는 게 좋아요.' },
            choices: [
                { text: '손님에게 강아지를 부르거나 만지지 말아 달라고 하고, 강아지가 쉴 수 있는 방을 마련한다', verdict: 'good', why: '강아지가 스스로 거리를 고를 수 있어요. 인사를 억지로 시키지 않는 게 좋아요.' },
                { text: '강아지가 먼저 냄새를 맡으러 오면 손님이 주먹 쥔 손을 낮게 내밀어 준다', verdict: 'ok', why: '강아지가 먼저 다가왔을 때는 괜찮은 방법이에요. 뒤로 물러나는 강아지에게 손을 뻗으면 부담이 커져요.' },
                { text: '빨리 친해지라고 손님이 강아지를 안아 보게 한다', verdict: 'bad', why: '낯선 사람에게 안기는 건 많은 강아지에게 큰 부담이에요. 물 수 있는 상황을 만들 수 있어요.' },
            ],
            sources: ['dogstrust_visitor', 'dogstrust_jump', 'aspca_bite', 'aspca_aggression'],
        },
        {
            id: 'hug', env: 'home', title: '보호자가 강아지를 안으려고 할 때', behavior: 'avoidance', pose: { lick: true }, props: ['person'],
            person: { kind: 'adult', from: [0.9, 1.4], to: [0.6, 0.95], lean: true },
            situation: '보호자가 강아지를 안으려고 몸을 숙여 팔을 뻗어요.',
            signals: ['고개와 몸을 돌리기', '시선 피하기', '입술 핥기', '뒤로 젖힌 귀'],
            meaning: '안기는 게 지금은 부담스럽다는 뜻일 수 있어요.',
            alt: { behavior: 'relaxed', text: '안기는 걸 편하게 여기는 강아지도 있어요. 몸이 말랑하고 스스로 다가와 기댄다면 괜찮다는 뜻일 수 있어요.' },
            choices: [
                { text: '안지 않고 손을 거둔 뒤, 강아지가 다가오면 가슴이나 어깨를 잠깐 쓰다듬는다', verdict: 'good', why: '강아지가 원할 때만 만지면 신뢰가 쌓여요. 머리 위보다 가슴이나 어깨를 더 편하게 여기는 강아지가 많아요.' },
                { text: '머리 위로 손을 뻗어 쓰다듬으며 달랜다', verdict: 'bad', why: '머리 위로 다가오는 손을 무서워하는 강아지가 많아요.' },
                { text: '싫어해도 익숙해지게 꼭 안아 준다', verdict: 'bad', why: '피하는 신호를 무시하고 안으면 더 강한 신호(으르렁거림, 물기)로 넘어갈 수 있어요.' },
            ],
            sources: ['aspca_bite', 'aspca_aggression', 'dogstrust_body'],
        },
        {
            id: 'vet', env: 'vet', title: '동물병원 진료를 기다릴 때', behavior: 'fearful', props: ['bench'],
            situation: '대기실에 낯선 냄새와 소리, 다른 동물들이 있어요.',
            signals: ['몸을 낮추고 떨기', '다리 사이로 만 꼬리', '뒤로 붙인 귀', '뒤로 빠진 체중'],
            meaning: '낯선 환경이 무섭다는 신호일 수 있어요.',
            alt: { behavior: 'curious', text: '병원을 편하게 여기는 강아지는 주변 냄새를 맡으며 둘러보기도 해요.' },
            choices: [
                { text: '사람과 동물이 적은 구석이나 바깥에서 기다리고, 익숙한 담요를 깔아 준다', verdict: 'good', why: '자극이 적은 곳에서 기다리면 긴장이 덜 쌓여요. 바깥에서 기다릴 땐 접수처에 미리 알려 주세요.' },
                { text: '기분을 풀어 주려고 대기실의 다른 강아지와 인사시킨다', verdict: 'bad', why: '이미 무서운 강아지에게 낯선 동물은 부담을 더할 수 있어요.' },
                { text: '진료실에 안 들어가려 하면 줄을 당겨 끌고 들어간다', verdict: 'bad', why: '억지로 끌면 다칠 수 있고 더 무서워해요. 천천히 기다리며 작은 걸음에 간식으로 칭찬해 주세요.' },
            ],
            sources: ['dogstrust_vet', 'dogstrust_exam'],
        },
        {
            id: 'thunder', env: 'night', title: '천둥이나 큰 소리를 들었을 때', behavior: 'fearful', props: ['window', 'thunder'],
            situation: '창밖에서 번개가 치고 큰 천둥소리가 울려요.',
            signals: ['몸을 낮추고 떨기', '숨을 곳 찾기', '다리 사이로 만 꼬리', '헐떡임'],
            meaning: '큰 소리가 무섭다는 신호일 수 있어요.',
            alt: { behavior: 'alert', text: '소리에 덜 민감한 강아지는 귀를 세우고 잠깐 살핀 뒤 다시 쉬기도 해요.' },
            choices: [
                { text: '조용하고 아늑한 숨을 곳을 내주고, 다가와 기대면 차분히 달래 준다', verdict: 'good', why: '숨을 곳이 있으면 스스로 견디기 쉬워요. 겁먹은 강아지가 위로를 원하면 달래 줘도 괜찮아요.' },
                { text: '무서워하는 행동을 혼내서 멈추게 한다', verdict: 'bad', why: '겁먹은 강아지를 혼내면 더 무서워져요.' },
                { text: '익숙해지라고 창문을 열어 소리를 더 크게 듣게 한다', verdict: 'bad', why: '무서운 것에 억지로 맞서게 하면 더 나빠질 수 있어요. 자주 이렇게 무서워한다면 동물병원과 상담해 주세요.' },
            ],
            sources: ['dogstrust_noise', 'dogstrust_react'],
        },
        {
            id: 'leaving', env: 'entrance', title: '보호자가 외출을 준비할 때', behavior: 'anxious', props: ['door', 'bag', 'person'],
            person: { kind: 'adult', from: [0.9, 1.9], to: [0.9, 1.9] },
            situation: '보호자가 가방을 챙기고 신발을 신어요.',
            signals: ['뒤로 젖힌 귀', '낮아진 꼬리', '시선 피하기와 입술 핥기', '보호자를 따라다니거나 문 앞을 막아서기'],
            meaning: '혼자 남는 게 불안하다는 신호일 수 있어요.',
            alt: { behavior: 'resting', text: '혼자 있는 데 익숙한 강아지는 보호자가 나갈 준비를 해도 쉬던 자리에서 그대로 쉬어요.' },
            choices: [
                { text: '집 안에서 잠깐 떨어져 있는 연습부터 시작해, 아주 짧은 외출로 조금씩 늘려 간다', verdict: 'good', why: '작은 단계부터 익숙해지면 혼자 있는 시간이 덜 무서워져요.' },
                { text: '행동이 갑자기 달라졌다면 먼저 동물병원에서 아픈 곳이 없는지 확인한다', verdict: 'good', why: '시력이나 청력 변화, 통증 같은 몸의 문제가 불안의 원인일 수도 있어요.' },
                { text: '돌아와서 어질러진 걸 보면 혼낸다', verdict: 'bad', why: '강아지는 지난 일과 혼나는 이유를 연결하지 못해요. 미안해 보이는 표정도 혼나는 분위기에 반응하는 거예요.' },
            ],
            sources: ['dogstrust_sep'],
        },
        {
            id: 'toy', env: 'home', title: '장난감을 가지고 놀 때', behavior: 'play_bow', props: ['toy'],
            situation: '보호자가 공을 굴려 주자 강아지가 몸을 낮춰요.',
            signals: ['앞을 낮추고 엉덩이를 드는 놀이 인사', '넓게 흔드는 꼬리', '부드러운 얼굴'],
            meaning: '같이 놀자는 신호로 자주 보여요.',
            alt: { behavior: 'guarding', pose: { bowl: false, headPitch: -0.6 }, text: '장난감을 아주 아끼는 강아지는 장난감 위에서 몸을 굳히고 지키려고 하기도 해요.' },
            choices: [
                { text: '짧게 놀아 주고 중간중간 쉬게 하며, 끝낼 땐 간식과 바꿔서 장난감을 받는다', verdict: 'good', why: '빼앗지 않고 바꾸면 장난감을 지킬 이유가 줄어요. 쉬는 시간이 있으면 흥분도 덜 쌓여요.' },
                { text: '흥분할수록 더 세게 놀아 준다', verdict: 'bad', why: '흥분이 너무 높아지면 차분하게 놀기 어려워져요. 냄새 맡기나 씹을 거리로 쉬게 해 주세요.' },
                { text: '장난감을 물고 안 놓으면 억지로 입에서 빼낸다', verdict: 'bad', why: '억지로 빼앗으면 사람이 다가오는 걸 장난감을 잃는 일로 기억하게 돼요.' },
            ],
            sources: ['dogstrust_body', 'dogstrust_guard'],
        },
        {
            id: 'child', env: 'home', title: '어린아이가 다가왔을 때', behavior: 'avoidance', pose: { lick: true }, props: ['person'],
            person: { kind: 'child', from: [0.2, 2.4], to: [0.35, 1.25] },
            situation: '아이가 강아지를 쓰다듬으려고 다가와요.',
            signals: ['고개와 몸을 돌리기', '시선 피하기', '입술 핥기', '뒤로 빠진 체중'],
            meaning: '아이가 다가오는 게 부담스럽다는 뜻일 수 있어요.',
            alt: { behavior: 'greeting', text: '아이를 좋아하는 강아지도 있어요. 그래도 아이와 강아지는 늘 어른이 지켜봐야 해요.' },
            choices: [
                { text: '아이를 멈추게 하고, 강아지가 원하면 스스로 다가오게 한다. 둘은 늘 어른이 지켜본다', verdict: 'good', why: '강아지가 피할 수 있고, 어른이 신호를 보며 바로 끼어들 수 있어요.' },
                { text: '강아지가 피하면 아이가 따라가서 쓰다듬게 한다', verdict: 'bad', why: '피하는 강아지를 따라가면 궁지에 몰려 더 강한 신호를 보낼 수 있어요.' },
                { text: '친해지라고 아이가 강아지를 껴안거나 얼굴을 맞대게 한다', verdict: 'bad', why: '껴안기, 얼굴 가까이 대기는 아이에겐 애정 표현이지만 강아지에겐 위협처럼 느껴질 수 있어요.' },
            ],
            sources: ['rspca_children', 'dogstrust_body'],
        },
        {
            id: 'bath', env: 'bath', title: '목욕을 준비할 때', behavior: 'anxious', pose: { lick: true }, props: ['tub'],
            situation: '욕조에 물을 받는 소리가 나고, 보호자가 수건을 꺼내요.',
            signals: ['뒤로 젖힌 귀', '낮아진 꼬리', '몸을 낮추고 피하려 함', '입술 핥기'],
            meaning: '목욕이 부담스럽다는 신호일 수 있어요.',
            alt: { behavior: 'relaxed', text: '천천히 익숙해진 강아지는 목욕 준비에도 편하게 있기도 해요.' },
            choices: [
                { text: '평소에 몸 만지기와 욕실 들어가기를 간식과 함께 짧게 연습하고, 싫어하는 신호가 보이면 멈춘다', verdict: 'good', why: '조금씩 좋은 경험을 쌓으면 목욕이 덜 무서워져요.' },
                { text: '계속 힘들어하면 반려견 미용사나 동물병원에 도움을 구한다', verdict: 'ok', why: '전문가 도움도 방법이에요. 그곳에서도 억지로 붙잡지 않는지 함께 확인해 주세요.' },
                { text: '도망가지 못하게 꽉 붙잡고 빨리 끝낸다', verdict: 'bad', why: '억지로 붙잡히면 더 긴장하고, 다음 목욕을 더 싫어하게 될 수 있어요.' },
            ],
            sources: ['dogstrust_exam', 'dogstrust_vet', 'dogstrust_stress'],
        },
        {
            id: 'eating', env: 'kitchen', title: '밥을 먹고 있을 때 사람이 다가올 때', behavior: 'guarding', props: ['person'],
            person: { kind: 'adult', from: [1.4, 2.2], to: [0.9, 1.5] },
            situation: '강아지가 밥을 먹는 중에 사람이 다가와요.',
            signals: ['밥그릇 위로 숙인 채 굳은 몸', '갑자기 멈춘 움직임', '다가오는 사람을 똑바로 쳐다보기', '급하게 먹기'],
            meaning: '밥을 빼앗길까 봐 지키는 행동일 수 있어요. 더 다가가면 으르렁거리거나 물 수 있어요.',
            alt: { behavior: 'relaxed', pose: { bowl: true, headPitch: -0.7 }, text: '지키지 않는 강아지는 사람이 지나가도 편하게 계속 먹어요. 그래도 먹을 땐 건드리지 않는 게 좋아요.' },
            choices: [
                { text: '다가가던 걸 멈추고 조용히 물러나, 다 먹을 때까지 기다린다', verdict: 'good', why: '지킬 이유를 없애 주면 긴장이 바로 내려가요.' },
                { text: '먹을 때는 조용한 곳에서 따로 먹게 하고, 걱정되면 행동 전문가와 상담한다', verdict: 'good', why: '먹는 자리를 따로 두면 모두가 안전해요. 아이가 있는 집이라면 특히 도움을 받아 주세요.' },
                { text: '버릇을 고치려고 밥그릇을 뺏었다가 돌려준다', verdict: 'bad', why: '다가오는 사람이 밥을 가져간다고 배우게 되어 지키는 행동이 더 심해질 수 있어요.' },
            ],
            sources: ['aspca_food', 'dogstrust_guard', 'aspca_aggression'],
        },
        {
            id: 'sleeping', env: 'bedroom', title: '쉬거나 잘 때 사람이 다가올 때', behavior: 'resting', props: ['bed', 'person'],
            person: { kind: 'adult', from: [1.4, 2.2], to: [0.9, 1.45] },
            situation: '강아지가 자기 자리에서 엎드려 쉬고 있는데 사람이 다가와요.',
            signals: ['엎드려 힘을 뺀 몸', '반쯤 감은 눈', '고른 숨'],
            meaning: '편하게 쉬는 중이에요. 이때 갑자기 건드리면 깜짝 놀랄 수 있어요.',
            alt: { behavior: 'freeze', pose: { posture: 'lie' }, text: '쉬는 중에 방해받는 걸 싫어하는 강아지는 몸이 굳거나 으르렁거리기도 해요.' },
            choices: [
                { text: '깨우지 말고 그대로 두고, 필요하면 떨어진 곳에서 이름을 불러 스스로 오게 한다', verdict: 'good', why: '강아지가 깨어서 스스로 오면 놀랄 일이 없어요.' },
                { text: '자리를 옮기려고 쓰다듬어 깨운 뒤 안아서 옮긴다', verdict: 'bad', why: '자는 중에 만지거나 옮기면 놀라서 방어할 수 있어요.' },
                { text: '아이가 자는 강아지 옆에 누워 같이 쉬게 한다', verdict: 'bad', why: '자거나 쉬는 강아지에게는 아이가 다가가지 않게 해 주세요.' },
            ],
            sources: ['aspca_aggression', 'rspca_children', 'dogstrust_body'],
        },
    ];
    var VERDICT = { good: '좋은 선택이에요', ok: '상황에 따라 괜찮아요', bad: '피하는 게 좋아요' };

    var api = { SCENES: SCENES, VERDICT: VERDICT };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.MungSignalScenes = api;
})(this);
