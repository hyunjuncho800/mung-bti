// 멍고민 행동 체크: 문항, 규칙 기반 분석, 화면.
// 브라우저에서는 /check/<주제>/ 페이지가 불러 쓰고, Node에서는 build_site.js와 테스트가 데이터를 읽는다.
// 같은 답이면 항상 같은 결과가 나오도록 점수 합산 + 고정 순서로만 판단한다. 진단이 아니라 참고 정보.
(function () {
    // 선택지: t 글, c 원인별 점수, f 먼저 확인할 신호(안전 안내)
    var CHECKS = {
        barking: {
            title: '산책 중 다른 강아지를 보면 짖어요',
            short: '다른 강아지만 보면 짖거나 달려들려고 할 때',
            seoTitle: '산책 중 짖는 강아지 행동 체크: 상황 질문으로 원인 좁혀 보기',
            desc: '산책 중 다른 강아지를 보면 짖는 우리 강아지, 무서워서인지 반가워서인지 상황 질문 몇 개로 가능한 원인과 관찰 포인트, 안전한 대응 방법을 정리해 드려요.',
            tone: 'var(--pink)', img: 'guide-training',
            causes: {
                fear: {
                    name: '다가오는 게 부담스러운 쪽',
                    summary: '다른 강아지가 불편하거나 무서워서, 오지 말라고 먼저 짖는 경우예요.',
                    why: ['어릴 때 다른 강아지를 차분하게 만날 기회가 적었거나 놀란 일이 있었다면, 상대가 다가오는 것 자체가 부담이 될 수 있어요.', '줄에 묶여 있으면 피할 곳이 없어요. 도망 대신 짖어서 거리를 벌리려고 해요.', '짖었더니 상대가 지나가 버린 경험이 쌓이면, 짖는 게 통한다고 배우기도 해요.'],
                    observe: ['몇 미터쯤에서 짖기 시작하는지 기억해 두세요. 그보다 조금 먼 거리가 연습을 시작할 자리예요.', '짖기 전에 하품, 입술 핥기, 고개 돌리기, 몸 굳히기가 먼저 나오는지 보세요.', '상대 강아지의 크기나 움직임(뛰어오는지, 천천히 걷는지)에 따라 반응이 다른지 적어 두세요.'],
                    do: ['짖지 않는 거리에서 다른 강아지가 보이면 간식을 주고, 상대가 사라지면 간식을 멈춰요. 다른 강아지가 보이면 좋은 일이 생긴다고 연결하는 연습이에요.', '마주칠 것 같으면 길을 건너거나 주차된 차 뒤로 비켜서 거리를 먼저 벌려 주세요.', '짖었다면 그날은 거리가 가까웠다는 뜻이에요. 다음엔 더 멀리서 시작해요.'],
                },
                frustration: {
                    name: '반가운데 못 가서 답답한 쪽',
                    summary: '다가가서 인사하고 싶은데 줄 때문에 못 가니 답답함이 짖음으로 나오는 경우예요.',
                    why: ['줄 없이 만나면 잘 노는 강아지에게 흔해요. 원하는 걸 못 하는 답답함이 쌓이면서 소리가 커져요.', '예전에 당기거나 짖었을 때 결국 인사를 하게 됐다면, 그 방법을 더 쓰게 돼요.'],
                    observe: ['짖을 때 꼬리가 높고 넓게 흔들리는지, 몸이 앞으로 쏠리는지 보세요.', '상대가 지나간 뒤 금방 차분해지는지, 한참 흥분이 남는지 보세요.'],
                    do: ['다른 강아지를 보고 보호자 쪽을 한 번 쳐다보면 바로 간식을 주세요. 상대 대신 보호자를 보는 게 이득이 되게 만들어요.', '인사는 상대 보호자에게 먼저 물어보고, 줄이 느슨할 때만 3초 정도 짧게 시켜요. 당기기 시작하면 이름을 불러 데리고 나와요.', '마음껏 노는 시간은 산책과 따로, 울타리가 있는 곳에서 잘 맞는 친구와 만들어 주세요.'],
                },
                arousal: {
                    name: '산책 흥분이 넘치는 쪽',
                    summary: '산책 자체로 이미 들떠 있는데 다른 강아지라는 자극이 더해지면서 터지는 경우예요.',
                    why: ['현관을 나설 때부터 흥분이 높으면 작은 자극에도 크게 반응해요.', '하루 대부분을 집에서 보내다 나오면 쌓인 에너지가 한 번에 나오기 쉬워요.'],
                    observe: ['산책 처음 10분과 마지막 10분의 반응을 비교해 보세요.', '줄을 잡기 전 현관에서 얼마나 들떠 있는지 보세요.'],
                    do: ['현관에서 바로 나가지 말고, 앉거나 차분해질 때까지 기다렸다 문을 열어요.', '처음 5분은 사람과 강아지가 적은 길에서 냄새를 실컷 맡게 해 주세요. 냄새 맡기는 흥분을 가라앉히는 데 도움이 돼요.', '한 번 짖고 나면 조용한 곳으로 옮겨서 잠깐 쉬었다 걸어요.'],
                },
                pain: {
                    name: '몸이 불편할 수 있는 쪽',
                    summary: '아프거나 불편한 곳이 있으면 다른 강아지가 다가오는 것에 더 예민해질 수 있어요.',
                    why: ['관절, 피부, 귀, 이빨처럼 겉으로 잘 안 보이는 곳이 불편해도 예민해질 수 있어요.', '전에는 괜찮다가 갑자기 시작됐다면 몸 상태부터 확인하는 게 순서예요.'],
                    observe: ['걷는 모습, 계단 오르기, 만졌을 때 피하는 곳이 있는지 보세요.', '식욕, 잠, 배변이 평소와 다른지 함께 적어 두세요.'],
                    do: ['동물병원에서 진료를 먼저 받아 보세요. 행동이 바뀐 시점과 상황을 적어 가면 설명하기 쉬워요.', '진료 전까지는 다른 강아지가 적은 시간과 길을 골라 산책해 주세요.'],
                },
            },
            questions: [
                { id: 'dist', q: '다른 강아지가 어디쯤 왔을 때 짖기 시작하나요?', o: [
                    { t: '멀리서 보이기만 해도 짖어요', c: { fear: 2, arousal: 1 } },
                    { t: '몇 걸음 앞까지 오면 짖어요', c: { fear: 1, frustration: 1 } },
                    { t: '바로 옆에 오거나 냄새를 맡으려 할 때 짖어요', c: { fear: 2 } },
                    { t: '잘 모르겠어요', c: {} },
                ] },
                { id: 'body', q: '짖을 때 몸짓은 어떤 쪽에 가까운가요?', o: [
                    { t: '몸을 낮추거나 뒤로 물러나고, 꼬리가 내려가요', c: { fear: 3 } },
                    { t: '꼬리를 흔들며 앞으로 당기고, 낑낑대기도 해요', c: { frustration: 3 } },
                    { t: '몸이 굳은 채 상대를 노려보고, 등 털이 서요', c: { fear: 2 } },
                    { t: '펄쩍펄쩍 뛰고 정신이 없어 보여요', c: { arousal: 2, frustration: 1 } },
                ] },
                { id: 'offleash', q: '줄 없이 다른 강아지를 만나 본 적이 있나요? (애견 운동장 등)', o: [
                    { t: '줄이 없으면 잘 어울려 놀아요', c: { frustration: 3 } },
                    { t: '피하거나 보호자 뒤로 숨어요', c: { fear: 2 } },
                    { t: '처음엔 괜찮다가 금방 싸울 것처럼 돼요', c: { fear: 1 }, f: 'tension' },
                    { t: '그런 적이 없거나 잘 모르겠어요', c: {} },
                ] },
                { id: 'when', q: '언제부터 이랬나요?', o: [
                    { t: '어릴 때부터 쭉 그랬어요', c: { fear: 1 } },
                    { t: '몇 달 사이에 조금씩 심해졌어요', c: {} },
                    { t: '최근에 갑자기 시작됐어요', c: { pain: 2 }, f: 'sudden' },
                ] },
                { id: 'change', q: '갑자기 시작되기 전후로 이런 일이 있었나요?', showIf: { when: [2] }, o: [
                    { t: '다리를 절거나, 만지면 싫어하는 곳이 생겼어요', c: { pain: 3 }, f: 'pain' },
                    { t: '다른 강아지에게 물리거나 크게 놀란 일이 있었어요', c: { fear: 3 } },
                    { t: '이사, 가족 변화처럼 생활에 큰 변화가 있었어요', c: { fear: 1, arousal: 1 } },
                    { t: '특별히 떠오르는 일은 없어요', c: { pain: 1 } },
                ] },
                { id: 'where', q: '어떤 상황에서 가장 심한가요?', o: [
                    { t: '산책 나오자마자 처음 몇 분', c: { arousal: 3 } },
                    { t: '좁은 길, 모퉁이에서 갑자기 마주칠 때', c: { fear: 2 } },
                    { t: '상대가 우리 쪽으로 다가올 때', c: { fear: 1, frustration: 1 } },
                    { t: '상황과 상관없이 비슷해요', c: {} },
                ] },
                { id: 'calm', q: '상대가 지나가면 얼마나 빨리 진정하나요?', o: [
                    { t: '금방 원래대로 걸어요', c: { frustration: 1 } },
                    { t: '몇 분 동안 흥분이 남아요', c: { arousal: 2 } },
                    { t: '그날 산책 내내 예민해요', c: { arousal: 1, fear: 1 } },
                ] },
                { id: 'bite', q: '다른 강아지나 사람을 물거나, 물려고 달려든 적이 있나요?', o: [
                    { t: '있어요', c: {}, f: 'bite' },
                    { t: '없어요', c: {} },
                ] },
            ],
            flags: {
                bite: '물거나 물려고 달려든 적이 있다면 혼자 연습하기보다 반려견 행동을 보는 수의사나 행동 교육 전문가와 계획을 세우는 게 안전해요. 그 전까지는 마주칠 일이 적은 시간과 길을 골라 주세요.',
                tension: '줄 없이 만났을 때 싸울 것 같은 분위기가 된다면 당분간 다른 강아지와 자유롭게 노는 상황은 피하고, 전문가와 상의해 주세요.',
                sudden: '전에 없던 행동이 갑자기 시작됐다면 몸이 불편해서일 수 있어요. 동물병원에서 먼저 확인해 보세요.',
                pain: '다리를 절거나 만지면 싫어하는 곳이 있다면 통증 때문일 수 있어요. 행동 연습보다 진료가 먼저예요.',
            },
            avoid: ['줄을 세게 잡아채거나 혼내지 마세요. 다른 강아지가 나타날 때마다 불쾌한 일이 생기면 상대를 더 싫어하게 될 수 있어요.', '억지로 가까이 데려가서 인사시키지 마세요.', '초크체인이나 전기 충격 목걸이처럼 아프게 하는 도구는 쓰지 마세요.'],
            read: [21, 16, 11],
        },

        alone: {
            title: '혼자 있을 때 힘들어해요',
            short: '외출 준비만 해도 불안해하거나, 혼자 있을 때 짖고 망가뜨릴 때',
            seoTitle: '강아지 혼자 있을 때 행동 체크: 1분 상황 질문',
            desc: '보호자가 외출할 때 짖고 울거나 물건을 망가뜨리는 우리 강아지. 혼자 남는 게 힘든 건지 심심한 건지 상황 질문으로 가능한 원인과 대응 방법을 정리해 드려요.',
            tone: 'var(--lav)', img: 'guide-care',
            causes: {
                separation: {
                    name: '혼자 남는 게 힘든 쪽',
                    summary: '보호자와 떨어지는 것 자체가 불안해서 생기는 행동일 수 있어요.',
                    why: ['외출 준비 소리(열쇠, 신발, 가방)가 곧 혼자 남는다는 신호가 되면서 그때부터 불안이 시작돼요.', '불안한 강아지는 혼자 있을 때 좋아하는 간식도 잘 먹지 않는 경우가 많아요.', '나가는 문이나 창문 근처에서 행동이 몰리는 것도 흔한 모습이에요.'],
                    observe: ['휴대폰이나 홈캠으로 나간 뒤 30분을 녹화해 보세요. 언제부터, 어디서, 무엇을 하는지가 가장 큰 단서예요.', '외출 준비 중 어느 행동부터 따라다니기 시작하는지 보세요.', '돌아왔을 때 간식이나 장난감에 손댄 흔적이 있는지 확인해 보세요.'],
                    do: ['열쇠를 들었다 내려놓기, 신발만 신고 소파에 앉기처럼 외출 신호를 외출 없이 자주 보여 주세요. 신호가 의미를 잃게 하는 연습이에요.', '현관 밖에 몇 초만 나갔다 들어오는 것부터 시작해, 짖지 않고 버틸 수 있는 시간만큼씩 아주 조금씩 늘려요.', '나가고 들어올 때 인사는 짧고 담담하게 해 주세요.', '연습하는 동안에는 길게 혼자 두는 일을 줄일 방법(가족, 지인, 돌봄 서비스)을 찾아보세요. 한 번 크게 놀라면 연습이 뒤로 밀려요.'],
                },
                boredom: {
                    name: '심심하고 에너지가 남는 쪽',
                    summary: '불안보다는 할 일이 없고 몸과 머리를 쓸 기회가 부족해서 생기는 행동일 수 있어요.',
                    why: ['산책과 놀이가 부족하면 남은 에너지를 물어뜯기나 짖기로 써요.', '어린 강아지나 활동량이 많은 견종에게 더 흔해요.'],
                    observe: ['행동이 나간 직후가 아니라 한참 지나서 시작되는지 보세요.', '망가뜨린 물건이 집 안 여기저기 흩어져 있는지, 장난감 대신 슬리퍼나 쿠션인지 보세요.'],
                    do: ['나가기 전에 15~20분 정도 냄새 맡는 산책이나 놀이를 해 주세요.', '나갈 때 간식을 채운 장난감이나 노즈워크 매트를 주고, 돌아오면 치워서 외출할 때만 나오는 특별한 것으로 만들어 주세요.', '씹어도 되는 물건을 충분히 두고, 씹으면 안 되는 물건은 손이 닿지 않게 치워 주세요.'],
                },
                noise: {
                    name: '바깥 소리에 예민한 쪽',
                    summary: '혼자라서라기보다 현관, 복도, 택배 소리에 반응해서 짖는 경우예요.',
                    why: ['보호자가 있을 때는 보호자가 반응을 정리해 주지만, 혼자 있으면 소리마다 스스로 경계해야 해요.', '공동주택은 복도와 엘리베이터 소리가 잦아서 반응할 일이 많아요.'],
                    observe: ['보호자가 있을 때도 같은 소리에 짖는지 보세요.', '녹화 영상에서 짖기 직전에 무슨 소리가 났는지 확인해 보세요.'],
                    do: ['현관에서 먼 방에 쉬는 자리를 만들어 주세요.', '외출할 때 라디오나 백색 소음을 작게 틀어 바깥 소리를 덮어 주세요.', '보호자가 있을 때 복도 소리가 나면 간식을 주는 연습으로 소리와 좋은 일을 연결해 주세요.'],
                },
                toilet: {
                    name: '배변 쪽 문제일 수 있는 쪽',
                    summary: '혼자 있을 때 보이는 배변 실수는 불안, 배변 교육, 몸 상태 중 어느 쪽인지 나눠 봐야 해요.',
                    why: ['보호자가 있을 때도 실수한다면 배변 교육이나 방광, 장 문제일 가능성을 먼저 봐요.', '혼자 있을 때만 실수한다면 불안 때문일 수 있어요.'],
                    observe: ['소변 횟수와 양, 색, 냄새가 평소와 다른지 보세요.', '외출 시간이 배변 간격보다 긴지 확인해 보세요.'],
                    do: ['소변을 자주 보거나 색이 이상하다면 동물병원에서 소변 검사를 받아 보세요.', '나가기 직전에 배변할 기회를 주고, 배변 패드를 쉬는 자리에서 조금 떨어진 곳에 두세요.', '실수한 곳은 혼내지 말고 냄새가 남지 않게 효소 세정제로 닦아 주세요.'],
                },
            },
            questions: [
                { id: 'prep', q: '외출 준비(옷 입기, 열쇠, 가방)를 하면 어떻게 하나요?', o: [
                    { t: '졸졸 따라다니거나 낑낑대요', c: { separation: 3 } },
                    { t: '쳐다보긴 하지만 하던 걸 계속해요', c: { boredom: 1 } },
                    { t: '별로 신경 쓰지 않아요', c: { noise: 1, boredom: 1 } },
                ] },
                { id: 'what', q: '혼자 있을 때 가장 자주 보이는 행동은 무엇인가요?', o: [
                    { t: '문 앞에서 짖거나 울어요', c: { separation: 2 } },
                    { t: '물건을 물어뜯거나 망가뜨려요', c: { boredom: 1, separation: 1 } },
                    { t: '배변 실수를 해요', c: { toilet: 2 } },
                    { t: '바깥 소리가 날 때마다 짖어요', c: { noise: 3 } },
                    { t: '어떤지 확인해 본 적이 없어요', c: {} },
                ] },
                { id: 'chew', q: '주로 어디를 망가뜨리나요?', showIf: { what: [1] }, o: [
                    { t: '현관문, 창문, 켄넬 문 근처', c: { separation: 3 } },
                    { t: '집 안 여기저기, 슬리퍼나 쿠션', c: { boredom: 3 } },
                    { t: '잘 모르겠어요', c: {} },
                ] },
                { id: 'potty', q: '보호자가 집에 있을 때도 배변 실수를 하나요?', showIf: { what: [2] }, o: [
                    { t: '있을 때도 해요', c: { toilet: 3 } },
                    { t: '혼자 있을 때만 해요', c: { separation: 2 } },
                    { t: '최근 소변을 자주 보거나 색이 달라요', c: { toilet: 2 }, f: 'urine' },
                ] },
                { id: 'start', q: '그 행동은 나간 뒤 언제쯤 시작되나요?', o: [
                    { t: '나가자마자, 늦어도 30분 안에', c: { separation: 2 } },
                    { t: '한참 지나서 시작돼요', c: { boredom: 2 } },
                    { t: '소리가 날 때마다 그때그때', c: { noise: 2 } },
                    { t: '잘 모르겠어요', c: {} },
                ] },
                { id: 'food', q: '혼자 있을 때 간식이나 노즈워크 장난감을 주면요?', o: [
                    { t: '손도 안 대고 그대로 있어요', c: { separation: 2 } },
                    { t: '잘 먹고 가지고 놀아요', c: { boredom: 2 } },
                    { t: '줘 본 적이 없어요', c: {} },
                ] },
                { id: 'exercise', q: '평소 하루 산책과 놀이 시간은 어느 정도인가요?', o: [
                    { t: '30분이 안 돼요', c: { boredom: 2 } },
                    { t: '30분에서 1시간 정도', c: {} },
                    { t: '1시간이 넘어요', c: { separation: 1 } },
                ] },
                { id: 'harm', q: '혼자 있다가 이런 일이 있었나요?', o: [
                    { t: '발이나 입에 상처가 났어요', c: { separation: 2 }, f: 'injury' },
                    { t: '침을 많이 흘리거나 계속 헐떡였어요', c: { separation: 2 }, f: 'panic' },
                    { t: '문이나 켄넬을 뚫고 나오려 했어요', c: { separation: 2 }, f: 'escape' },
                    { t: '이런 일은 없었어요', c: {} },
                ] },
            ],
            flags: {
                injury: '혼자 있다가 몸에 상처가 났다면 혼자 연습할 단계가 아니에요. 상처 치료와 함께 수의사나 행동 전문가와 상의해 주세요. 불안을 줄이는 약을 함께 쓰는 방법도 진료에서 이야기해 볼 수 있어요.',
                panic: '침을 많이 흘리거나 계속 헐떡이는 건 강한 스트레스 신호일 수 있어요. 혼자 두는 시간을 줄일 방법을 먼저 찾고, 전문가와 상의해 주세요.',
                escape: '문이나 켄넬을 뚫고 나오려다 다칠 수 있어요. 켄넬에 가두는 것으로 해결하려 하지 말고, 전문가와 상의해 주세요.',
                urine: '소변을 자주 보거나 색이 달라졌다면 방광염 같은 몸 문제일 수 있어요. 동물병원에서 먼저 확인해 주세요.',
            },
            avoid: ['돌아와서 망가진 물건이나 배변 실수를 보고 혼내지 마세요. 강아지는 몇 시간 전 행동과 지금 혼나는 걸 연결하지 못하고, 보호자가 돌아오는 순간을 더 불안해할 수 있어요.', '짖음 방지 목걸이처럼 겁을 주거나 아프게 하는 도구는 불안을 키울 수 있어요.', '불안해하는 강아지를 켄넬에 가두는 것만으로는 해결되지 않아요. 켄넬을 편하게 여기는 강아지에게만 써 주세요.'],
            read: [7, 6, 16],
        },

        walk: {
            title: '산책 중에 멈추고 안 걸어요',
            short: '걷다가 주저앉거나, 집 쪽으로만 가려고 할 때',
            seoTitle: '강아지 산책 거부 행동 체크: 1분 상황 질문',
            desc: '산책하다 주저앉거나 안 걸으려는 우리 강아지. 아파서인지, 무서운 게 있어서인지, 냄새를 맡고 싶어서인지 상황 질문으로 가능한 원인과 대응 방법을 정리해 드려요.',
            tone: 'var(--green)', img: 'hub-guide',
            causes: {
                pain: {
                    name: '몸이 불편할 수 있는 쪽',
                    summary: '관절, 발바닥, 체력 문제로 걷는 게 불편해서 멈추는 경우예요.',
                    why: ['작은 강아지는 슬개골, 나이 든 강아지는 관절 문제로 걷기를 꺼릴 수 있어요.', '뜨거운 아스팔트, 염화칼슘, 작은 상처처럼 발바닥이 아파도 멈춰요.', '더운 날은 체온이 올라 금방 지쳐요.'],
                    observe: ['멈출 때 한쪽 다리를 들거나, 몇 걸음 깡총 뛰는지 보세요.', '산책 후 발바닥 사이에 상처나 붉은 곳이 있는지 보세요.', '같은 거리를 걸어도 날씨에 따라 멈추는 때가 다른지 적어 두세요.'],
                    do: ['다리를 절거나 갑자기 걷기 싫어한다면 동물병원 진료를 먼저 받아 주세요.', '여름에는 이른 아침이나 해 진 뒤에 걷고, 손등을 바닥에 5초 대 봐서 뜨거우면 나가지 않아요.', '진료 결과가 나오기 전까지는 짧고 평평한 길 위주로 걸어요.'],
                },
                fear: {
                    name: '무서운 게 있는 쪽',
                    summary: '특정 소리, 장소, 바닥이 무서워서 멈추는 경우예요.',
                    why: ['큰 차, 공사 소리, 오토바이처럼 갑작스러운 소리에 놀란 경험이 있으면 그 장소 자체를 피하려 해요.', '맨홀 뚜껑, 철판, 반짝이는 바닥처럼 발에 닿는 느낌이 낯선 곳을 꺼리는 강아지도 있어요.'],
                    observe: ['매번 같은 장소에서 멈추는지 보세요. 지도에 표시해 두면 공통점이 보여요.', '멈출 때 꼬리가 내려가거나, 귀가 뒤로 젖혀지거나, 몸이 떨리는지 보세요.'],
                    do: ['무서워하는 곳은 당분간 돌아가고, 멀리서 보기만 해도 간식을 주는 것부터 시작해요.', '스스로 한 발 다가가면 칭찬하고, 거기서 멈춰도 괜찮아요. 끌고 지나가지 마세요.', '소리가 큰 시간대(출퇴근, 공사 시간)를 피해 산책해 보세요.'],
                },
                sniff: {
                    name: '냄새를 맡고 싶은 쪽',
                    summary: '멈춰서 냄새를 맡는 건 강아지에게 자연스러운 산책 방식이에요.',
                    why: ['강아지는 냄새로 동네 소식을 읽어요. 냄새 맡기는 머리를 쓰는 활동이라 적당히 하면 산책 만족도가 높아져요.'],
                    observe: ['멈춘 뒤 실제로 코를 바닥에 대고 있는지 보세요.', '충분히 맡게 해 주면 다시 잘 걷는지 보세요.'],
                    do: ['"냄새 맡아도 돼" 구간과 "같이 걷자" 구간을 정해 번갈아 걸어 보세요. 신호를 정해 두면 서로 편해져요.', '산책 시간을 정해 두고 거리보다 냄새 맡기 시간을 넉넉히 넣어 주세요.'],
                },
                gear: {
                    name: '장비가 불편한 쪽',
                    summary: '하네스나 목줄이 몸에 맞지 않아 걷는 게 불편한 경우예요.',
                    why: ['새 하네스가 겨드랑이를 쓸거나 목을 누르면 걸을 때마다 불편해요.', '줄을 자주 당기면 목이나 가슴이 눌려 걷는 걸 피할 수 있어요.'],
                    observe: ['겨드랑이와 목 둘레에 털이 빠지거나 붉어진 곳이 있는지 보세요.', '장비를 채우려고 하면 피하는지 보세요.'],
                    do: ['손가락 두 개가 들어가는 정도로 맞춰 주고, 움직일 때 겨드랑이에 닿지 않는 디자인으로 바꿔 보세요.', '장비를 채울 때마다 간식을 주면서 천천히 다시 익숙해지게 해 주세요.'],
                },
                home: {
                    name: '집에 가고 싶은 쪽',
                    summary: '피곤하거나, 더 걷고 싶지 않거나, 멈추면 안아 준다고 배운 경우예요.',
                    why: ['체력보다 긴 산책이면 후반에 멈춰요.', '멈췄을 때 안아 주거나 집으로 돌아간 경험이 반복되면 멈추는 게 요청 방법이 돼요.'],
                    observe: ['집에서 멀어지는 방향에서만 멈추는지, 돌아오는 길에는 잘 걷는지 보세요.', '산책 몇 분쯤부터 멈추는지 기록해 보세요.'],
                    do: ['산책 거리를 지금보다 줄였다가 조금씩 늘려요.', '집 반대 방향으로 나갈 때는 처음 몇 걸음마다 간식을 주며 출발해 보세요.', '멈췄을 때 바로 안지 말고, 잠깐 기다렸다 방향을 바꿔 다시 걷게 해 주세요. 다만 아파 보이면 안아서 돌아오는 게 맞아요.'],
                },
            },
            questions: [
                { id: 'when', q: '주로 언제 멈추나요?', o: [
                    { t: '집을 나서자마자', c: { fear: 1, gear: 2, home: 1 } },
                    { t: '걷다가 특정 장소에서', c: { fear: 3 } },
                    { t: '한참 걷다가 후반에', c: { pain: 1, home: 2 } },
                    { t: '자주, 아무 데서나 멈춰요', c: { sniff: 2 } },
                ] },
                { id: 'place', q: '그 장소에는 무엇이 있나요?', showIf: { when: [1] }, o: [
                    { t: '큰 차, 공사, 오토바이 같은 큰 소리', c: { fear: 2 } },
                    { t: '다른 강아지나 낯선 사람이 자주 있어요', c: { fear: 2 } },
                    { t: '맨홀, 철판, 반짝이는 바닥', c: { fear: 2 } },
                    { t: '잘 모르겠어요', c: {} },
                ] },
                { id: 'after', q: '멈춘 다음에는 어떻게 하나요?', o: [
                    { t: '코를 바닥에 대고 냄새를 맡아요', c: { sniff: 3 } },
                    { t: '주저앉거나 엎드리고, 몸을 떨기도 해요', c: { fear: 2, pain: 1 } },
                    { t: '집 쪽으로 줄을 당겨요', c: { home: 2, fear: 1 } },
                    { t: '한쪽 다리를 들거나 절뚝여요', c: { pain: 3 }, f: 'limp' },
                ] },
                { id: 'weather', q: '날씨나 바닥에 따라 달라지나요?', o: [
                    { t: '더운 날 훨씬 심해요', c: { pain: 2 }, f: 'heat' },
                    { t: '추운 날이나 눈, 염화칼슘 있는 길에서 심해요', c: { pain: 2 } },
                    { t: '날씨와는 상관없어요', c: {} },
                ] },
                { id: 'age', q: '강아지 나이는요?', o: [
                    { t: '1살이 안 됐어요', c: { fear: 1, sniff: 1 } },
                    { t: '1살에서 7살 사이', c: {} },
                    { t: '7살이 넘었어요', c: { pain: 2 } },
                ] },
                { id: 'recent', q: '최근에 바뀐 게 있나요?', o: [
                    { t: '하네스나 목줄을 바꿨어요', c: { gear: 4 } },
                    { t: '이사를 했거나 산책 코스가 바뀌었어요', c: { fear: 2 } },
                    { t: '살이 쪘어요', c: { pain: 1, home: 1 } },
                    { t: '특별히 바뀐 건 없어요', c: {} },
                ] },
                { id: 'since', q: '언제부터 이랬나요?', o: [
                    { t: '원래부터 그랬어요', c: { sniff: 1, fear: 1 } },
                    { t: '최근에 갑자기 그래요', c: { pain: 2 }, f: 'sudden' },
                ] },
                { id: 'home', q: '집 안에서는 어떤가요?', o: [
                    { t: '소파나 계단 오르기를 꺼리고, 만지면 싫어하는 곳이 있어요', c: { pain: 3 }, f: 'pain' },
                    { t: '집 안에서는 잘 뛰어다녀요', c: { fear: 1, sniff: 1, home: 1 } },
                    { t: '평소보다 많이 자고 덜 움직여요', c: { pain: 2 } },
                ] },
            ],
            flags: {
                limp: '다리를 절거나 들고 걷는다면 통증 신호예요. 산책 연습보다 동물병원 진료가 먼저예요.',
                pain: '오르내리기를 꺼리거나 만지면 싫어하는 곳이 있다면 관절이나 허리 통증일 수 있어요. 동물병원에서 확인해 주세요.',
                sudden: '잘 걷던 강아지가 갑자기 걷기 싫어한다면 몸 상태부터 확인하는 게 순서예요.',
                heat: '더운 날 멈추고 혀를 길게 빼고 헐떡이거나 비틀거리면 열사병 위험이 있어요. 바로 그늘로 옮겨 몸을 식히고 동물병원에 연락하세요.',
            },
            avoid: ['줄을 당겨 억지로 끌고 가지 마세요. 아프거나 무서운 강아지에게 더 큰 부담이 돼요.', '무서워하는 곳에 일부러 오래 세워 두며 익숙해지게 하는 방법은 오히려 겁을 키울 수 있어요.', '혼내거나 큰 소리를 내지 마세요.'],
            read: [11, 15, 19],
        },
    };

    // 지금까지의 답으로 보여 줄 문항 목록 (조건부 문항 포함)
    function visibleQuestions(check, answers) {
        return check.questions.filter(function (q) {
            if (!q.showIf) return true;
            return Object.keys(q.showIf).every(function (id) { return q.showIf[id].indexOf(answers[id]) !== -1; });
        });
    }

    // answers: { 문항id: 선택지 번호 }. 보이지 않는 문항의 답은 무시한다.
    function analyze(check, answers) {
        var score = {}, flags = [];
        var order = Object.keys(check.causes);
        order.forEach(function (k) { score[k] = 0; });
        visibleQuestions(check, answers).forEach(function (q) {
            var opt = q.o[answers[q.id]];
            if (!opt) return;
            Object.keys(opt.c).forEach(function (k) { score[k] += opt.c[k]; });
            if (opt.f && flags.indexOf(opt.f) === -1) flags.push(opt.f);
        });
        var ranked = order.slice().sort(function (a, b) { return score[b] - score[a] || order.indexOf(a) - order.indexOf(b); });
        var top = score[ranked[0]];
        // 가장 높은 원인과, 그 점수의 절반 이상이면서 3점 이상인 원인을 최대 2개 더 보여 준다
        var causes = top <= 0 ? [] : ranked.filter(function (k, i) { return i === 0 || (score[k] >= 3 && score[k] * 2 >= top); }).slice(0, 3);
        flags.sort(function (a, b) { return Object.keys(check.flags).indexOf(a) - Object.keys(check.flags).indexOf(b); });
        return { causes: causes, flags: flags, score: score };
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { CHECKS: CHECKS, analyze: analyze, visibleQuestions: visibleQuestions };
        return;
    }

    // ---------------------------------------------------------------- 화면
    function h(tag, attrs, kids) {
        var el = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function (k) {
            if (k === 'text') el.textContent = attrs[k];
            else if (k === 'on') el.addEventListener('click', attrs[k]);
            else el.setAttribute(k, attrs[k]);
        });
        (kids || []).forEach(function (c) { if (c) el.appendChild(c); });
        return el;
    }
    function list(items, cls) { return h('ul', { class: cls || '' }, items.map(function (t) { return h('li', { text: t }); })); }
    function myDog() {
        try { return JSON.parse(localStorage.getItem('mung_dog') || 'null'); } catch (e) { return null; }
    }

    function track(name, params) { if (window.mungTrack) window.mungTrack(name, params); }

    function start(app) {
        var key = app.getAttribute('data-check');
        var check = CHECKS[key];
        if (!check) return;
        var answers = {}, idx = 0;
        var panel = app.querySelector('[data-panel]');
        var params = new URLSearchParams(location.search);

        function focusTop() {
            panel.focus({ preventScroll: true });
            var y = app.getBoundingClientRect().top + window.scrollY - 80;
            if (window.scrollY > y) window.scrollTo({ top: y, behavior: 'smooth' });
        }

        function renderQuestion() {
            var qs = visibleQuestions(check, answers);
            var q = qs[idx];
            var pct = Math.round((idx + 1) / qs.length * 100);
            var opts = q.o.map(function (o, i) {
                return h('button', { type: 'button', class: 'check-opt', 'aria-pressed': String(answers[q.id] === i), text: o.t, on: function () { choose(q, i); } });
            });
            panel.replaceChildren(
                h('div', { class: 'check-progress', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(qs.length), 'aria-valuenow': String(idx + 1), 'aria-label': '진행률' }, [h('i', { style: 'width:' + pct + '%' })]),
                h('p', { class: 'check-count', text: (idx + 1) + ' / ' + qs.length }),
                h('h2', { class: 'check-q', text: q.q }),
                h('div', { class: 'check-opts' }, opts),
                h('div', { class: 'check-nav' }, [
                    h('button', { type: 'button', class: 'btn btn-ghost', text: idx === 0 ? '처음으로' : '이전', on: function () { if (idx === 0) renderIntro(); else { idx--; renderQuestion(); } } }),
                ])
            );
            focusTop();
        }

        function choose(q, i) {
            answers[q.id] = i;
            // 답이 바뀌어 사라진 조건부 문항의 답은 지움
            var qs = visibleQuestions(check, answers);
            Object.keys(answers).forEach(function (id) { if (!qs.some(function (x) { return x.id === id; })) delete answers[id]; });
            panel.querySelectorAll('.check-opt').forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === i)); });
            setTimeout(function () {
                if (idx + 1 >= qs.length) {
                    var res = analyze(check, answers);
                    // 답변과 위험 신호는 보내지 않고, 가장 가까운 원인 이름과 개수만
                    track('behavior_check_complete', { check: key, result: res.causes[0] || 'none', causes: res.causes.length });
                    renderResult(res, false);
                }
                else { idx++; renderQuestion(); }
            }, 180);
        }

        function causeBlock(k, full) {
            var c = check.causes[k];
            var kids = [h('h3', { text: c.name }), h('p', { text: c.summary })];
            if (full) {
                kids.push(h('h4', { text: '왜 그럴 수 있나요' }), list(c.why));
                kids.push(h('h4', { text: '이런 걸 지켜봐 주세요' }), list(c.observe));
                kids.push(h('h4', { text: '이렇게 해 보세요' }), list(c.do));
            }
            return h('section', { class: 'check-cause' }, kids);
        }

        function renderResult(r, shared) {
            var kids = [];
            if (shared) {
                kids.push(h('p', { class: 'check-eyebrow', text: '공유받은 체크 결과' }));
                kids.push(h('h2', { class: 'check-q', text: '이 강아지는 이런 쪽에 가까웠어요' }));
            } else {
                kids.push(h('p', { class: 'check-eyebrow', text: '체크 결과' }));
                kids.push(h('h2', { class: 'check-q', text: r.causes.length ? '이런 쪽일 가능성이 있어요' : '답만으로는 방향을 잡기 어려워요' }));
            }
            if (r.flags.length) {
                kids.push(h('div', { class: 'callout callout-danger' }, [h('h3', { text: '먼저 확인해 주세요' }), list(r.flags.map(function (f) { return check.flags[f]; }))]));
            }
            if (r.causes.length) {
                r.causes.forEach(function (k) { kids.push(causeBlock(k, !shared)); });
            } else {
                kids.push(h('p', { text: '"잘 모르겠어요"가 많으면 원인을 좁히기 어려워요. 며칠 동안 언제, 어디서, 어떤 몸짓으로 그러는지 적어 두거나 영상으로 찍어 본 뒤 다시 체크해 보세요.' }));
            }
            if (!shared) {
                kids.push(h('section', { class: 'check-cause' }, [h('h3', { text: '하지 말아 주세요' }), list(check.avoid)]));
            }
            kids.push(h('p', { class: 'check-note', text: '상황 답변을 바탕으로 한 참고 정보예요. 진단이 아니에요. 물거나 물려고 하는 행동, 심한 스트레스, 통증이 의심되거나 행동이 갑자기 바뀌었다면 동물병원이나 반려견 행동 전문가와 상담해 주세요.' }));

            var dog = myDog();
            var actions = [];
            if (shared) {
                actions.push(h('button', { type: 'button', class: 'btn', text: '우리 강아지도 체크하기', on: function () { track('behavior_check_start', { check: key }); history.replaceState(null, '', location.pathname); answers = {}; idx = 0; renderQuestion(); } }));
            } else {
                if (r.causes.length) {
                    actions.push(h('button', { type: 'button', class: 'btn', text: '결과 링크 공유', on: function (e) { share(r, e.currentTarget); } }));
                    if (window.MungCard) actions.push(h('button', { type: 'button', class: 'btn btn-ghost', text: '카드 이미지 저장', on: function (e) { saveCard(r, e.currentTarget); } }));
                }
                actions.push(h('button', { type: 'button', class: 'btn btn-ghost', text: '다시 체크하기', on: function () { track('behavior_check_start', { check: key }); answers = {}; idx = 0; renderQuestion(); } }));
            }
            kids.push(h('div', { class: 'check-actions' }, actions));
            kids.push(h('div', { class: 'cta-box check-test' }, [
                h('div', {}, [
                    h('b', { text: dog && dog.typeName ? (dog.name || '우리 강아지') + '의 기질검사 결과는 ' + dog.typeName : '행동 뒤에 있는 기질도 궁금하다면' }),
                    h('p', { text: dog && dog.typeName ? '행동 체크는 지금 상황을, 기질검사는 타고난 성향을 봐요. 두 결과를 함께 보면 이해가 쉬워요.' : '20개 질문으로 우리 강아지의 타고난 성향을 알아볼 수 있어요.' }),
                    h('div', { class: 'check-actions' }, [
                        dog && dog.typeName ? h('a', { class: 'btn', href: '/routine/', text: '7일 맞춤 활동 보기' }) : null,
                        h('a', { class: dog && dog.typeName ? 'btn btn-ghost' : 'btn', href: '/', text: dog && dog.typeName ? '기질검사 다시 하기' : '우리 강아지 기질 알아보기' }),
                    ]),
                ]),
            ]));
            panel.replaceChildren.apply(panel, kids);
            focusTop();
        }

        function share(r, btn) {
            var url = location.origin + location.pathname + '#r=' + r.causes.join('.') + '&via=link';
            track('result_share', { content: 'check', method: 'link' });
            var text = check.title + ' 체크 결과: ' + check.causes[r.causes[0]].name;
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile && navigator.share) {
                navigator.share({ title: document.title, text: text, url: url }).catch(function () {});
                return;
            }
            var done = function () { var t = btn.textContent; btn.textContent = '링크를 복사했어요'; setTimeout(function () { btn.textContent = t; }, 1800); };
            if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { prompt('링크를 복사해 주세요', url); });
            else prompt('링크를 복사해 주세요', url);
        }

        // 세로 카드(1080x1350): 원인 이름과 요약만. 답변과 위험 신호는 넣지 않음
        function saveCard(r, btn) {
            var label = btn.textContent;
            track('result_share', { content: 'check', method: 'image' });
            btn.textContent = '이미지 만드는 중...'; btn.disabled = true;
            var done = function () { btn.textContent = label; btn.disabled = false; };
            MungCard.check({
                title: check.title, tone: getComputedStyle(document.documentElement).getPropertyValue(check.tone.slice(4, -1)).trim(), img: check.img,
                causes: r.causes.map(function (k) { return { name: check.causes[k].name, summary: check.causes[k].summary }; }),
            }).then(function (c) { return MungCard.deliver(c, 'mungtest-check-' + key + '.png', check.title + ' 체크 결과'); }).then(done, function () {
                alert('이미지를 만들지 못했어요. 화면을 캡처해서 공유해 주세요.'); done();
            });
        }

        function renderIntro() {
            panel.replaceChildren.apply(panel, Array.prototype.slice.call(intro.cloneNode(true).childNodes));
            panel.querySelector('[data-start]').addEventListener('click', function () { track('behavior_check_start', { check: key }); idx = 0; renderQuestion(); });
        }

        var intro = panel.cloneNode(true);
        // 공유 링크(#r=원인.원인, 예전 링크는 ?r=)로 들어오면 원인 요약만 보여 줌. 답변 원문은 주소에 담지 않음.
        var hash = new URLSearchParams(location.hash.slice(1));
        var shared = (hash.get('r') || params.get('r') || '').split('.').filter(function (k) { return check.causes[k]; }).slice(0, 3);
        if (shared.length) {
            renderResult({ causes: shared, flags: [] }, true);
            track('shared_link_visit', { content: 'check', via: hash.get('via') || params.get('via') || 'unknown' });
        } else {
            renderIntro();
            track('behavior_check_view', { check: key });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var app = document.querySelector('[data-check]');
        if (app) start(app);
    });
})();
