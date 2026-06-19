// ===== i18n 글로벌 객체 및 언어 데이터 =====
const translations = {
    ko: {
        // Meta & Titles
        meta_title_main: "반려견 기질 검사",
        meta_desc_main: "동물 행동학 이론을 바탕으로 반려견의 타고난 내재적 기질과 후천적 조율 성향을 입체적으로 분석하는 독창적인 반려견 성향 테스트입니다.",
        meta_title_age: "반려견 나이계산기",
        meta_desc_age: "미국 켄넬 클럽(AKC) 기준을 반영한 과학적이고 감성적인 반려견 나이 계산기입니다.",
        meta_title_size: "반려견 맞춤형 의류 사이즈 추천기",
        meta_desc_size: "우리 강아지에게 딱 맞는 옷 사이즈는 무엇일까요? 견종, 몸무게, 털 길이를 바탕으로 추천해 드립니다.",

        // Common UI (Nav, Modals, Footer)
        nav_about: "소개 및 문의",
        nav_age: "나이 계산기",
        nav_size: "의류 사이즈 추천기",
        nav_start: "기질 검사 시작",
        footer_copyright: "© 2026 반려견데이터솔루션 Lab. All Rights Reserved.",
        footer_terms1: "소개 및 문의",
        footer_terms2: "개인정보처리방침",
        footer_terms3: "이용약관",
        footer_terms4: "행동학 근거 안내",
        footer_disclaimer_main: "본 검사는 교육·참고용 동물행동학 정보를 바탕으로 제작되었으며, 수의사 진료를 대체하지 않습니다.",
        footer_disclaimer_age: "본 계산기는 미국 켄넬 클럽(AKC) 데이터를 참고하여 제작되었으며, 개체별 건강 상태에 따라 오차가 있을 수 있습니다.",

        // Header Toggles
        btn_lang_toggle: "EN",
        
        // --- Index Page ---
        logo_main: "🐾 반려견 기질 검사",
        hero_title: "우리집 댕댕이 속마음<br><span>얼마나 알고 계시나요?</span>",
        hero_btn: "3분 반려견 기질 검사 시작하기 →",
        mini_tools_title: "반려견 라이프 가이드",
        mini_tool_age: "반려견 나이 계산기",
        mini_tool_size: "의류 사이즈 추천기",
        stat_label: "지금까지 마음을 알아본 보호자 수",
        stat_desc: "오늘도 많은 댕댕이들이 참여하고 있어요! 🐶",
        btn_prev: "← 이전",
        btn_next: "다음 문항으로 →",
        btn_next_finish: "종합 성향 리포트 확인하기 🐾",
        
        // Content Grid (Main Page)
        content_card1_title: "검사의 원리",
        content_card1_t1: "유전자에 새겨진 변하지 않는 <strong>'내재적 기질'</strong>과 양육 환경에 따라 형성되는 <strong>'후천적 조율 성향'</strong>을 입체적으로 분리하여 과학적으로 측정합니다.",
        content_card1_t2: "동물행동학 및 심리학 지표를 기반으로 구축된 독창적인 20문항 체크리스트입니다.",
        content_card2_title: "타고난 본능 (4축)",
        content_card2_li1: "<strong>탐험성:</strong> 새로운 탐색을 즐기는 호기심",
        content_card2_li2: "<strong>안전성:</strong> 위험에 반응하는 신중함과 경계심",
        content_card2_li3: "<strong>교감성:</strong> 스킨십과 아이콘택트를 즐기는 친화력",
        content_card2_li4: "<strong>집중성:</strong> 즉각적 보상 없이 지속하는 인내력",
        content_card3_title: "후천적 성향 (3축)",
        content_card3_li1: "<strong>독립성:</strong> 보호자 없이도 안정적인 정서 자율성",
        content_card3_li2: "<strong>사교성:</strong> 낯선 사람 및 타견과의 조화로운 교류",
        content_card3_li3: "<strong>유연성:</strong> 생활 환경 변화에 적응하는 회복탄력성",

        // MBTI Zone
        mbti_title: "마지막 단계! 🐾",
        mbti_desc: "강아지와의 궁합을 확인하기 위해<br>보호자님의 MBTI를 알려주세요!",
        mbti_select_default: "MBTI 선택",
        mbti_submit_btn: "최종 결과 보기 ✨",
        alert_mbti: "강아지와의 궁합을 확인하기 위해 보호자님의 MBTI를 선택해주세요!",

        // Result Zone
        res_tag: "반려견 기질 검사 정밀 행동학 분석 결과",
        res_analyzing: "분석 중...",
        res_chart1_title: "타고난 내재적 기질 지표",
        res_chart1_sub: "DNA에 새겨진 본능 — 탐험성·안전성·교감성·집중성",
        res_chart2_title: "후천적 조율 성향 지표",
        res_chart2_sub: "양육과 사회화의 결과 — 독립성·사교성·유연성",
        res_report_title: "우리 강아지의 진짜 모습은?<br><span>반려견 기질 검사</span>",
        res_report_sub1: "🧬 타고난 내재적 기질 매칭 리포트",
        res_report_sub2: "🏡 후천적 조율 성향 분석 및 솔루션",
        res_chemistry_title: "💞 동반자 궁합 리포트",
        btn_save: "결과 이미지로 저장하기 📥",
        btn_kakao: "카카오톡 공유하기 💬",
        btn_restart: "다시 테스트하기 🔄",
        btn_share_other: "나도 우리 강아지 기질 검사 알아보기 🐾",
        
        // Likert Scale Options
        likert_1: "전혀<br>아님",
        likert_2: "대체로<br>아님",
        likert_3: "보통",
        likert_4: "대체로<br>맞음",
        likert_5: "정말<br>맞음",
        scale_end1: "전혀 해당 없음",
        scale_end2: "완전히 해당됨",

        // --- Age Calculator ---
        logo_age: "🐾 반려견 나이계산기",
        age_calc_title: "반려견 나이계산기",
        age_calc_subtitle: "우리 아이는 지금 사람 나이로 몇 살일까요?<br>크기와 견종을 고려한 AKC 기준으로 정확하게 알려드려요.",
        label_dog_name: "강아지 이름",
        placeholder_dog_name: "예: 탄이",
        label_breed_select: "견종 선택",
        breed_select_default: "견종을 선택해주세요",
        label_current_age: "현재 나이",
        age_unit_year: "년",
        age_unit_month: "개월",
        btn_age_calc: "결과 확인하기 🐾",
        res_badge_age: "Age Calculator Result",
        res_age_text1: "의 사람 나이는",
        res_age_text2: "세 입니다!",
        age_quote: "우리의 시간은 다르게 흐릅니다.<br>아이가 보호자님과 함께할 수 있는 시간은 생각보다 길지 않습니다.<br><strong>오늘, 한 번 더 눈을 맞추고 더 많이 사랑한다고 말해주세요.</strong>",
        alert_name: "강아지 이름을 입력해주세요.",
        alert_breed: "견종을 선택해주세요.",
        alert_age: "나이를 입력해주세요.",
        btn_age_restart: "다시 계산하기 🔄",
        age_story_stage1: "영유아기",
        age_story_text1: "(이)는 눈 뜨고 걷기 시작하며 세상 모든 것이 신기한 꼬마 시절입니다. 호기심이 넘쳐 사고도 치지만, 존재만으로도 미소를 짓게 하는 천사 같은 시기입니다.",
        age_story_stage2: "질풍노도 퍼피",
        age_story_text2: "(이)는 이가 간지러워 이것저것 물어뜯고, 개구쟁이처럼 에너지가 폭발하는 시기입니다. 올바른 사회화와 교감이 평생 성격을 좌우하는 중요한 때이기도 합니다.",
        age_story_stage3: "청년기",
        age_story_text3: "(이)는 골격이 다져지고 근육이 완성되는 빛나는 청춘입니다. 에너지가 최고조에 달하며, 보호자와 발맞춰 뛰고 걷는 최고의 산책 메이트입니다.",
        age_story_stage4: "성견기",
        age_story_text4: "(이)는 성격이 차분하게 자리 잡고, 눈빛만 봐도 보호자의 마음을 읽어내는 시기입니다. 든든한 가족이자 그 어떤 것과도 바꿀 수 없는 완벽한 단짝 친구입니다.",
        age_story_stage5: "중년기",
        age_story_text5: "의 입가에 하얀 털이 조금씩 보이기 시작합니다. 여전히 산책을 사랑하지만, 예전보다 잠이 조금 늘어나는 여유롭고 평화로운 중년입니다.",
        age_story_stage6: "시니어",
        age_story_text6: "의 활동량이 눈에 띄게 줄고, 뛸 때 관절을 신경 써주어야 합니다. 함께 걷는 산책 속도를 조금 늦춰주며, 정기적인 건강 검진과 식단 관리가 필요한 시기입니다.",
        age_story_stage7: "노령견",
        age_story_text7: "(이)는 예전처럼 멀리 걷지 못하고 눈동자가 조금 탁해질 수 있습니다. 아픈 곳을 숨기려 할 수 있으니, 아주 세심한 관찰과 따뜻한 품이 필요한 귀중하고 애틋한 시간입니다.",

        // --- Size Calculator ---
        logo_size: "🐾 의류 사이즈 추천기",
        size_calc_title: "우리 아이에게 딱 맞는 사이즈를 찾아보세요! 👕",
        size_calc_subtitle: "견종, 몸무게, 털 길이를 입력하면 최적의 옷 사이즈를 추천해 드립니다.",
        label_weight: "몸무게 (kg)",
        label_hair: "털 길이",
        hair_short: "✂️ 미용 직후(짧음)",
        hair_medium: "🐕 보통",
        hair_long: "☁️ 길고 풍성함",
        btn_size_calc: "계산하기",
        res_badge_size: "Size Recommendation",
        res_size_heading: "추천 사이즈",
        res_chest_text: "예상 가슴둘레: 약 ",
        res_size_note: "*본 추천은 mung-test.com의 자체 표준 규격을 기준으로 하며, 체형에 따라 약간의 오차가 있을 수 있습니다.*",

        // Optgroups
        optgroup_pop: "국내 주요 인기견",
        optgroup_small: "소형견 (10kg 미만)",
        optgroup_medium: "중형견 (10kg ~ 25kg 미만)",
        optgroup_large: "대형견 (25kg 이상)",

        breed_maltipoo: "말티푸 (소형)",
        breed_maltese: "말티즈 (소형)",
        breed_poodle: "푸들 (토이/미니어처 - 소형)",
        breed_pomeranian: "포메라니안 (소형)",
        breed_retriever: "리트리버 (골든/래브라도 - 대형)",
        breed_chihuahua: "치와와",
        breed_yorkshire: "요크셔 테리어",
        breed_shih_tzu: "시츄",
        breed_bichon: "비숑 프리제",
        breed_other_small: "기타 소형견",
        breed_corgi: "웰시 코기",
        breed_beagle: "비글",
        breed_cocker: "코카 스파니엘",
        breed_french_bulldog: "프렌치 불독",
        breed_other_medium: "기타 중형견",
        breed_husky: "시베리안 허스키",
        breed_samoyed: "사모예드",
        breed_jindo: "진돗개",
        breed_shepherd: "저먼 셰퍼드",
        breed_other_large: "기타 대형견",

        // --- Dynamic Script.js Text ---
        // Questions
        q1: "새로운 산책 경로나 생전 처음 보는 물건을 마주했을 때, 꼬리를 바짝 세우고 적극적으로 다가가 냄새를 맡는다.",
        q2: "택배 상자가 들어오거나 새로운 장난감을 사주면 눈빛이 돌변하며 오랜 시간 탐닉하고 집착한다.",
        q3: "산책 중 나비, 벌레, 길고양이 등을 발견하면 온몸의 근육을 긴장시키며 즉각 추적하려는 본능이 발동한다.",
        q4: "오토바이 배기음이나 천둥소리, 낯선 벨소리가 들리면 순간적으로 몸이 굳거나 침대 밑 등 구석으로 도망친다.",
        q5: "동물병원 문 앞이나 생전 처음 가보는 실내 카페에 입장하면 유독 보호자 다리 뒤에 숨으려 한다.",
        q6: "익숙하지 않은 타인이나 다른 강아지가 예고 없이 다가오면 경계하듯 짖거나 방어적인 으르렁거림을 보인다.",
        q7: "보호자가 조용히 이름을 부르거나 눈을 맞출 때 즉각적이고 격렬하게 반응한다.",
        q8: "보호자가 가짜로 우는 척을 하거나 한숨을 쉬면 다가와 얼굴을 핥아주는 등 감정적 동조 현상을 보인다.",
        q9: "간식 보상 없이도 보호자의 '말 한마디'와 '부드러운 스킨십'만으로 꼬리를 치며 행복해한다.",
        q10: "난이도 높은 노즈워크나 장난감 속 숨겨진 간식을 꺼내기 위해 쉽게 포기하지 않고 끝까지 집요하게 매달린다.",
        q11: "'앉아', '기다려' 등 기본 교육을 진행할 때, 주변의 사소한 자극에 한눈팔지 않고 오랫동안 주의를 집중한다.",
        q12: "뼈다귀나 개껌을 주면 한자리에서 완전히 다 해체할 때까지 지치지 않는 끈기를 보여준다.",
        q13: "보호자가 외출 준비를 하거나 문을 열고 나가도 하울링이나 발로 문을 긁는 행위 없이 자기 방석에서 무덤덤하게 잠을 잔다.",
        q14: "벨이 울려 흥분한 상태에서도 보호자가 단호하게 '기다려'라고 지시하면 스스로 감정을 조율하고 자제한다.",
        q15: "실내에서 보호자 꽁무니를 졸졸 따라다니기보다 자기만의 독립적인 휴식 공간에서 혼자만의 시간을 잘 즐긴다.",
        q16: "다른 반려견을 만났을 때 으르렁대지 않고, 카밍 시그널을 부드럽게 주고받으며 양보할 줄 안다.",
        q17: "미용실·목욕·발톱 깎기 등 예민할 수 있는 위생 케어 과정을 보호자나 전문가의 통제에 순응하며 안정적으로 잘 참아낸다.",
        q18: "산책 중 마주치는 낯선 사람이 조심스럽게 손을 내밀 때 순하게 냄새를 맡고 받아들인다.",
        q19: "갑작스러운 이사나 애견 펜션 등 생소한 환경에서도 마킹이나 구토 없이 빠르게 밥을 먹고 적응한다.",
        q20: "집안 가구 배치가 크게 바뀌거나 새로운 가전제품이 거실에 들어와도 크게 경계하지 않고 편안하게 스쳐 지나간다.",

        // Results
        res1_title: '🔥 호기심 천국 겁쟁이 — "이중인격 브레이크형"',
        res1_inherent: "탐험성({{ E }})과 안전성({{ S }})이 모두 높은 독특한 유전적 배열입니다. 새로운 자극을 보면 심장이 요동치며 돌진하다가도, 막상 대상을 코앞에서 마주하면 '앗 깜짝이야!' 하며 전력 후진하는 웰메이드 양가감정을 장착했습니다. 세상 모든 택배 상자는 다 뜯어야 직성이 풀리지만 초인종 소리에는 침대 밑 전용 벙커로 빛의 속도로 도피하는 유쾌한 매력이 돋보입니다. 교감성({{ M }})과 집중성({{ F }}) 수치도 함께 확인하여 학습 방향을 설정하세요.",
        res1_features: "이 유형의 반려견들은 내면에 강한 호기심과 방어적 본능이 공존하는 매우 입체적이고 매력적인 성향을 지니고 있습니다. 산책을 나가면 처음 보는 풀냄새나 낯선 물건에 이끌려 앞장서서 걸어가지만, 갑자기 자전거가 지나가거나 큰 소음이 들리면 즉각적으로 보호자 뒤로 숨거나 멈춰 서서 상황을 예의주시합니다. 이런 '액셀'과 '브레이크'가 동시에 작동하는 특성 때문에 어떤 날은 두려움 없는 탐험가 같고, 어떤 날은 세상에서 제일 소심한 겁쟁이처럼 보일 수 있습니다. 하지만 이는 불안정함이 아니라 매우 뛰어난 상황 판단 능력과 생존 본능을 갖추고 있다는 증거입니다. 낯선 사람이나 강아지에게도 관심은 많아 멀리서 꼬리를 흔들며 다가가려 하지만, 상대방이 갑작스럽게 훅 다가오면 당황하여 짖거나 피할 수 있습니다. 자기만의 페이스로 세상을 탐색할 때 가장 큰 행복을 느끼는 아이들입니다.",
        res1_tips: "보호자는 아이의 이런 '밀당' 같은 성향을 존중하고 기다림의 미학을 발휘해야 합니다. 낯선 사람을 만날 때는 억지로 인사시키지 말고, 아이가 먼저 냄새를 맡고 다가갈 때까지 충분한 시간과 거리를 확보해 주는 것이 중요합니다. 산책 시에도 아이가 멈춰 서서 관찰할 때는 재촉하지 말고 함께 기다려 주세요. 두려움을 극복하게 하겠다고 무리하게 낯선 환경에 밀어넣는 방식(홍수법)은 오히려 트라우마를 유발할 수 있습니다. 대신 긍정 강화 교육(클리커 훈련, 간식 보상)을 통해 새로운 자극이 즐거운 경험으로 이어지도록 점진적으로 노출시키는 체계적 둔감화가 효과적입니다. 가정 내에서는 아이가 언제든 도피하여 안정을 취할 수 있는 자기만의 안전한 켄넬이나 독립적인 휴식 공간(아지트)을 반드시 마련해 주세요.",
        res1_match: "🐶 찰떡궁합: 천천히 다가오고 선을 지켜주는 젠틀한 리트리버나 시츄 유형. (기다림의 미학을 아는 친구)<br>⚡ 상극 유형: 다짜고짜 뛰어오르며 과도한 스킨십을 시도하는 극강의 하이텐션 에너자이저.",

        res2_title: '🚀 브레이크 고장난 탐험가 — "폭주 호기심형"',
        res2_inherent: "타고난 탐험성({{ E }})이 최상위권인 반면 안전성({{ S }})은 거의 발동하지 않는 '용감무쌍형' DNA입니다. 세상에 무서울 것이 없고 낙엽이 굴러가도 '저것은 무엇인가!' 하며 몸을 던질 기세입니다. 겁이 없어 온 동네 참견쟁이가 될 수 있으므로 충동 조절 훈련이 절대적입니다. 집중성({{ F }})이 높다면 노즈워크나 어질리티 스포츠로 에너지를 건강하게 해소시켜 주세요.",
        res2_features: "지칠 줄 모르는 에너지와 세상 모든 것에 대한 무한한 사랑을 가진 직진형 반려견입니다. 두려움이나 경계심이 현저히 낮아 새로운 장소, 낯선 사람, 처음 보는 동물들에게 주저 없이 돌진합니다. 택배 기사님을 마치 10년 만에 만난 이산가족처럼 반기고, 산책로의 모든 이웃에게 인사를 건네야 직성이 풀리는 극강의 핵인싸 기질을 자랑합니다. 하지만 이 넘치는 호기심과 에너지는 때때로 무모함으로 이어질 수 있습니다. 도로로 갑자기 뛰어들거나, 상대방 강아지의 기분을 파악하지 못하고 과도하게 놀이를 요구하다가 마찰을 빚는 경우도 종종 발생합니다. 신체적 활동량이 매우 높으며, 지루함을 참지 못해 파괴적 행동(가구 물어뜯기, 벽지 찢기)으로 스트레스를 표출하기도 합니다.",
        res2_tips: "가장 시급하고 중요한 것은 바로 '충동 조절'과 '흥분 가라앉히기(Calming)' 교육입니다. 무조건 뛰게 해서 에너지를 소모시키는 것만으로는 한계가 있습니다. 오히려 아드레날린 분비를 가중시킬 수 있으므로, 흥분도가 높아질 때 보호자가 '기다려', '앉아', '엎드려' 등의 지시로 차분함을 되찾게 하는 규칙 기반의 훈련이 일상화되어야 합니다. 산책 시에는 보호자 옆에서 발을 맞춰 걷는 리쉬 워킹(나란히 걷기)을 철저히 연습하세요. 또한, 육체적 피로뿐만 아니라 정신적 피로를 유발하는 고난이도 노즈워크, 퍼즐 장난감, 혹은 어질리티 같은 도그 스포츠를 제공하여 두뇌 에너지를 건강하게 소모할 수 있는 채널을 열어주는 것이 반려견과 보호자 모두의 평화로운 일상을 위한 핵심 열쇠입니다.",
        res2_match: "🐶 찰떡궁합: 같이 뛰어놀며 지치지 않는 에너자이저 그룹 (보더콜리, 잭 러셀 테리어 유형)<br>⚡ 상극 유형: 조용히 쉬고 싶은 소심하고 예민한 노령견이나 독립적인 고양이형 강아지.",

        res3_title: '🛡️ 신중하고 세심한 파수꾼 — "소심형 철학자"',
        res3_inherent: "탐험성({{ E }})은 낮고 안전성({{ S }})이 높아 낯선 자극을 만나면 흥분보다 회피 반응이 지배적입니다. 동물병원 대기실이나 새로운 공간에서 큰 스트레스를 표현합니다. 내면적으로는 일상의 변화에 긴장 속에 살아가고 있을 확률이 높으니 체계적 둔감화 훈련이 필요합니다. 교감성({{ M }})이 높다면 보호자의 안심 시그널이 큰 안정제가 됩니다.",
        res3_features: "조심성이 매우 많고 외부 환경의 미세한 변화에도 깊이 반응하는 세심한 감수성의 소유자입니다. 익숙한 공간(집 안)과 친숙한 보호자 곁에서는 한없이 다정하고 편안하지만, 산책로를 조금만 벗어나거나 낯선 사람이 방문하면 꼬리를 내리고 구석으로 숨는 등 강한 회피 반응을 보입니다. 청각이나 후각 등 감각 기관이 남들보다 예민하게 열려 있어, 멀리서 들리는 오토바이 소리나 천둥소리, 청소기 소리에 극도로 긴장하며 바들바들 떠는 경우도 많습니다. 모험을 싫어하고 일상의 루틴(늘 가던 길, 늘 먹던 밥, 늘 자던 자리)이 철저하게 지켜질 때 가장 큰 안정감과 행복을 느낍니다. 낯선 자극 앞에서는 공격성(물기)보다는 회피성(숨기, 얼어붙기)을 주로 선택하는 방어적 기질이 강합니다.",
        res3_tips: "보호자는 아이의 예민함을 결코 '문제'로 취급하거나 다그쳐서는 안 되며, 든든한 방패이자 안전 기지가 되어주어야 합니다. 아이가 무서워하는 상황에서는 무리하게 직면시키지 말고, 조용히 안아서 피하거나 보호자 뒤로 숨을 수 있게 허용해 주세요. 일상생활에서는 변동을 최소화하여 정해진 시간에 밥을 주고, 예측 가능한 짧은 경로로 산책을 하는 것이 좋습니다. 두려워하는 소리나 물건에 대해서는 거실 끝에서부터 아주 약한 강도로 시작해 서서히 노출 강도를 높여가는 체계적 둔감화 훈련을 진행해야 합니다. 이때 맛있는 간식이나 부드러운 목소리로 칭찬하여 '무서운 줄 알았는데 괜찮네?'라는 긍정적 기억을 차곡차곡 쌓아주는 것이 가장 훌륭한 케어 방법입니다.",
        res3_match: "🐶 찰떡궁합: 옆에 있는지 없는지 모를 정도로 고요하고 무던한 평화주의자 유형.<br>⚡ 상극 유형: 앞뒤 안 가리고 얼굴부터 들이밀며 냄새를 맡으려 드는 과잉 친화력 강아지.",

        res4_title: '🛋️ 평화로운 안방 현자 — "무소유 집돌이형"',
        res4_inherent: "탐험성({{ E }})과 안전성({{ S }})이 모두 낮은 매우 평온하고 무던한 기질입니다. 이불 밖은 위험하다는 진리를 퍼피 시기부터 깨달은 현자 DNA입니다. 거창한 모험보다는 늘 가던 산책로 300m를 편안하게 왕복하는 것에 깊은 안락함을 느낍니다. 집중성({{ F }})을 활용한 차분한 교육으로 천천히 활력을 불어넣어 주세요.",
        res4_features: "세상사에 큰 욕심이 없고, 어떤 자극 앞에서도 평정심을 잃지 않는 해탈한 현자 같은 기질을 보여줍니다. 초인종 소리에도 꼬리만 한 번 툭 치고 다시 잠에 빠져들며, 산책을 나갈 때도 다른 아이들처럼 방방 뛰기보다는 '가자면 가야지' 하는 느긋한 태도로 나섭니다. 호기심도, 두려움도 적기 때문에 사고를 칠 확률이 매우 낮아 반려견으로서는 굉장히 키우기 수월한 편에 속합니다. 하지만 때로는 무기력해 보이거나 세상에 흥미를 느끼지 못하는 것처럼 비쳐 보호자를 섭섭하게 만들기도 합니다. 맛있는 간식이나 화려한 장난감 앞에서도 큰 동요가 없고, 하루 중 대부분의 시간을 편안한 소파나 푹신한 방석 위에서 명상하듯 누워 보내는 것을 세상에서 가장 사랑하는 진정한 '집돌이/집순이' 유형입니다.",
        res4_tips: "이 아이들에게 가장 필요한 것은 조용하고 평화로운 환경의 유지와, 너무 지루해지지 않도록 가미되는 가벼운 활력 요소입니다. 억지로 뛰게 하거나 애견 카페 등 시끄럽고 강아지가 많은 곳에 데려가는 것은 오히려 큰 피로감을 유발합니다. 대신 짧고 가벼운 동네 산책을 꾸준히 유지하여 최소한의 신체 건강을 도모해 주세요. 아이가 흥미를 느낄 만한 자극이 적기 때문에, 간식의 질을 높이거나 특이한 냄새(허브, 향신료 등)를 활용한 새로운 노즈워크 퍼즐을 제공하여 후각적 호기심을 부드럽게 자극해 주는 것이 좋습니다. 비만이 될 확률이 상대적으로 높은 유형이므로 주기적인 체중 관리와 식단 조절에 각별히 신경을 써야 하며, 관절에 무리가 가지 않는 가벼운 운동을 유도하는 것이 중요합니다.",
        res4_match: "🐶 찰떡궁합: 같이 나란히 누워 숨만 쉬어도 좋은 동급의 현자견, 혹은 게으른 고양이.<br>⚡ 상극 유형: 계속해서 놀자고 귀를 물어뜯거나 주변을 뱅뱅 도는 부산스러운 에너자이저.",
        
        res1_acquired: "후천적 독립성({{ I }})과 사교성({{ O }})이 조화롭게 발달한 아주 훌륭한 상태입니다. 보호자님이 그동안 눈물겨운 간식 보상과 일관성 있는 규칙으로 아이에게 엄청난 정서적 신뢰를 제공했음을 방증합니다. 혼자 있을 때는 고독을 즐길 줄 아는 쿨한 강아지이면서도, 미용·케어 시에는 전문가 손길을 묵묵히 받아들이는 '선비형' 성격을 완성했습니다. 유연성({{ X }})까지 높다면 여행도 함께 떠나도 좋습니다.",
        res1_humor: "처방전: 이미 완벽합니다. 보호자님은 내일 당장 강아지 훈육 학원 차리셔도 됩니다. 지금처럼만 맛있는 동결건조 트릿을 지속 공급하십시오.",
        res2_acquired: "사교성({{ O }})은 훌륭하나 독립성({{ I }})이 낮은 '보호자 한정 껌딱지' 성향입니다. 세상 모든 사람과 개들에겐 꼬리를 흔들며 천사처럼 행동하지만, 집에서 보호자님이 화장실만 가도 통곡의 벽을 세우는 감정 과잉 상태일 수 있습니다. 혼자 머무는 안전지대(방석) 교육을 소량씩 추가해 주는 것이 유익합니다.",
        res2_humor: "처방전: 아이의 우주는 온통 당신뿐입니다. 화장실 갈 때 문을 0.5cm만 열어두어 영혼의 단짝을 안심시키되, 가끔은 냉정한 척 '기다려'를 외치셔야 지갑(벽지 수리비)을 지킵니다.",
        res3_acquired: "독립성({{ I }})은 우수하나 사교성({{ O }})이 낮아 케어나 사회적 상황에서 협조성 향상이 필요합니다. 혼자 시간은 잘 보내지만 낯선 사람이나 다른 개가 다가오면 경계심이 높아질 수 있습니다. 점진적 노출 훈련과 고보상 간식을 결합한 사회화 교육을 꾸준히 제공해 주세요.",
        res3_humor: "처방전: 혼자서는 완벽한 도사인데 사람 만나면 갑자기 도인 수련 중 모드 돌입. 간식으로 세상이 무섭지 않다는 것을 단계적으로 알려드리세요.",
        res4_acquired: "독립성({{ I }})과 사교성({{ O }})이 모두 낮게 측정된 경우, 유연성({{ X }})을 높여주는 '밀당 케어'가 집중적으로 필요합니다. 무조건적인 다정함보다는 예측 가능한 스케줄 관리가 필수적입니다. 규칙적인 식사·산책 타임과 짧고 즐거운 훈련 세션이 아이에게 세상이 안전하다는 믿음을 심어줍니다.",
        res4_humor: "처방전: 겉으로는 '까칠한 고양이' 코스프레를 하지만 속으로는 보호자의 손길을 격렬히 갈구하는 완벽한 츤데레. 밀당의 고수가 되어 규칙적 스케줄로 승리하십시오.",

        // Chemistry
        chem1_text: "에너지 대폭발 덤앤더머 콤비! 주말마다 온 동네 오프로드를 누비는 환상의 런닝메이트입니다. 둘 다 지치지 않아서 집안 가구가 평화롭습니다.",
        chem2_text: "집돌이 집순이 집사와 에너지 과잉 에너자이저의 만남! 강아지는 나가자고 줄을 물고 오고, 보호자는 침대와 물아일체 중이군요. 보호자님의 체력 방전을 심심한 위로를 전합니다. 산책 대행이나 노즈워크 대량 투하가 시급합니다.",
        chem3_text: "보호자는 파티광, 강아지는 쫄보! 텐션 차이가 제법 납니다. 외향적인 보호자님이 억지로 시끌벅적한 애견카페에 데려가면 강아지는 구석에서 벌벌 떨 수 있어요. 아이의 속도에 맞춰주는 배려가 필요합니다.",
        chem4_text: "서로의 평온함을 존중하는 안정적 소울메이트! 시끄러운 세상 속 둘만의 조용한 아지트를 사랑하는 환상의 짝꿍입니다. 억지로 나가지 않아도 눈빛만으로 통하는 사이군요.",
        chem5_text: "눈물 없인 볼 수 없는 영혼의 단짝! 서로 눈빛만 봐도 가슴이 찡해지는 감성 충만 조합입니다. 단, 너무 애틋해서 생기는 분리불안을 조심하세요.",
        chem6_text: "실용주의 집사와 게으른 천재견의 만남! '필요 없는 움직임은 최소화한다'는 신념이 기가 막히게 일치합니다. 에너지를 아끼며 스마트하게 휴식하는 찰떡궁합 룸메이트입니다.",
        chem7_text: "눈빛만 봐도 통하는 단짝 콤비! 서로의 영역을 존중하면서도 필요할 때 완벽한 케미를 보여줍니다.",
        
        // Summary List Text
        sum_e_label: "탐험성",
        sum_e_high: "호기심 넘치는 탐험가 기질",
        sum_e_low: "신중하고 차분한 관조 기질",
        sum_s_label: "안전성",
        sum_s_high: "소음·낯선 환경에 민감함",
        sum_s_low: "외부 자극에 비교적 담대함",
        sum_m_label: "교감성",
        sum_m_high: "보호자와 강한 유대 형성",
        sum_m_low: "독립적·쿨한 애정 표현 스타일",
        sum_f_label: "집중성",
        sum_f_high: "끈질기고 포기를 모르는 집요함",
        sum_f_low: "빠른 전환과 다양성을 선호",
        sum_i_label: "독립성",
        sum_i_high: "분리 상황에도 안정적인 자율 조율",
        sum_i_low: "보호자 의존도가 높아 밀착형",
        sum_o_label: "사교성",
        sum_o_high: "타견·타인과 원만한 친화력",
        sum_o_low: "케어·사회화 훈련 강화 권장",
        sum_x_label: "유연성",
        sum_x_high: "환경 변화에 빠른 회복탄력성",
        sum_x_low: "환경 변화 시 완충 케어 필요",
        
        // Kakao Text
        kakao_share_text: "저희 아이는 [{{ dogType }}], 저는 [{{ ownerMbti }}]가 나와서 궁합 점수 {{ score }}점 나왔어요!\n\n우리 궁합 보러 가기",
        kakao_share_title: "🐾 우리 강아지 반려견기질검사 결과 도출!",
        kakao_share_btn: "나도 궁합 보러 가기 🐾",
        kakao_share_error: "카카오톡 공유를 실행할 수 없습니다.\n카카오 디벨로퍼스에 현재 도메인이 등록되어 있는지 확인해주세요.\n\n대신 결과 링크를 복사합니다.",
        kakao_copy_success: "링크가 클립보드에 복사되었습니다!",

        // --- Age Calculator Dynamic Text ---
        age_alert_name: "강아지 이름을 입력해주세요.",
        age_alert_breed: "견종을 선택해주세요.",
        age_alert_age: "나이를 입력해주세요.",
        age_alert_img_err: "이미지 저장 중 오류가 발생했습니다. 브라우저 설정을 확인해주세요.",
        age_alert_kakao_key: "카카오톡 공유 기능이 설정되지 않았습니다. (JS 키 누락)",
        age_alert_kakao_sdk: "카카오톡 SDK가 초기화되지 않았습니다.",
        age_save_loading: "이미지 생성 중... ⏳",
        age_save_btn: "결과 이미지로 저장하기 📥",

        age_stage1: "영유아기",
        age_story1: "{{ name }}(이)는 눈 뜨고 걷기 시작하며 세상 모든 것이 신기한 꼬마 시절입니다. 호기심이 넘쳐 사고도 치지만, {{ name }}의 존재만으로도 미소를 짓게 하는 천사 같은 시기입니다.",
        age_stage2: "질풍노도 퍼피",
        age_story2: "{{ name }}(이)는 이가 간지러워 이것저것 물어뜯고, 개구쟁이처럼 에너지가 폭발하는 시기입니다. 올바른 사회화와 교감이 {{ name }}의 평생 성격을 좌우하는 중요한 때이기도 합니다.",
        age_stage3: "청년기",
        age_story3: "{{ name }}(이)는 골격이 다져지고 근육이 완성되는 빛나는 청춘입니다. 에너지가 최고조에 달하며, 보호자와 발맞춰 뛰고 걷는 최고의 산책 메이트입니다.",
        age_stage4: "성견기",
        age_story4: "{{ name }}(이)는 성격이 차분하게 자리 잡고, 눈빛만 봐도 보호자의 마음을 읽어내는 시기입니다. 든든한 가족이자 그 어떤 것과도 바꿀 수 없는 완벽한 단짝 친구입니다.",
        age_stage5: "중년기",
        age_story5: "{{ name }}의 입가에 하얀 털이 조금씩 보이기 시작합니다. 여전히 산책을 사랑하지만, 예전보다 잠이 조금 늘어나는 여유롭고 평화로운 중년입니다.",
        age_stage6: "시니어",
        age_story6: "{{ name }}의 활동량이 눈에 띄게 줄고, 뛸 때 관절을 신경 써주어야 합니다. 함께 걷는 산책 속도를 조금 늦춰주며, 정기적인 건강 검진과 식단 관리가 필요한 시기입니다.",
        age_stage7: "노령견",
        age_story7: "{{ name }}(이)는 예전처럼 멀리 걷지 못하고 눈동자가 조금 탁해질 수 있습니다. 아픈 곳을 숨기려 할 수 있으니, 아주 세심한 관찰과 따뜻한 품이 필요한 귀중하고 애틋한 시간입니다.",

        age_kakao_title: "우리의 시간은 다르게 흐릅니다 🕰️",
        age_kakao_desc: "{{ name }}의 진짜 나이는 사람으로 치면 몇 살일까요? 지금 확인해 보세요.",
        age_kakao_btn: "결과 확인하기",

        // --- Size Calculator SEO & Dynamic ---
        size_alert_breed: "견종을 선택해주세요.",
        size_alert_kakao: "카카오톡 공유 기능이 설정되지 않았습니다.",
        size_alert_kakao_sdk: "카카오톡 SDK가 초기화되지 않았습니다.",
        size_kakao_title: "의류 사이즈 추천 결과 👕",
        size_kakao_desc: "우리 강아지의 예상 가슴둘레는 {{ chest }}cm, 추천 사이즈는 [{{ size }}] 입니다!",
        size_kakao_btn: "사이즈 확인하기",

        seo_s1_t: "강아지 옷, 왜 사이즈 선택이 중요할까요?",
        seo_s1_p1: "반려견에게 옷을 입히는 것은 단순한 패션을 넘어 <strong>체온 유지, 자외선 차단, 진드기 및 해충 방지</strong> 등 건강과 직결된 중요한 역할을 합니다. 하지만 사람과 달리 강아지는 체형이 견종마다 천차만별이기 때문에, 단순히 몸무게만으로 옷을 고르면 실패할 확률이 매우 높습니다. 꽉 끼는 옷은 피부 마찰과 관절의 움직임을 방해하여 큰 스트레스를 줄 수 있으며, 너무 헐렁한 옷은 보행 시 걸려 넘어지는 사고를 유발할 수 있습니다.",
        seo_s1_p2: "따라서 정확한 가슴둘레 측정과 견종별 체형 특성(예: 흉곽의 넓이와 깊이), 그리고 현재 털의 길이를 모두 고려하여 옷을 선택해야만 우리 아이가 하루 종일 편안하게 활동할 수 있습니다.",
        
        seo_s2_t: "견종별 체형 특성과 가슴둘레의 관계",
        seo_s2_p1: "강아지의 체형은 골격 구조에 따라 크게 세 가지로 나눌 수 있으며, 이는 사이즈 선택의 핵심 지표가 됩니다.",
        seo_s2_li1: "<strong>깊은 흉곽형 (푸들, 이탈리안 그레이하운드 등):</strong> 몸통이 좁고 가슴이 아래로 깊게 파인 체형입니다. 몸무게에 비해 가슴둘레가 커서 등길이에 맞추면 가슴이 꽉 끼는 경우가 많습니다.",
        seo_s2_li2: "<strong>넓은 흉곽형 (웰시코기, 닥스훈트 등):</strong> 다리가 짧고 가슴통이 넓게 발달한 체형입니다. 하네스나 옷을 고를 때 반드시 가슴 앞쪽 폭을 고려해야 하며 넉넉한 사이즈가 필요합니다.",
        seo_s2_li3: "<strong>근육/불독형 (프렌치 불독, 퍼그 등):</strong> 목이 두껍고 어깨와 가슴 근육이 매우 발달한 체형입니다. 일반적인 소형견 사이즈로는 목과 가슴이 잠기지 않으므로, 체중 대비 훨씬 큰 사이즈나 전용 의류를 입어야 합니다.",
        seo_s2_li4: "<strong>표준형 (말티즈, 포메라니안 등):</strong> 체중과 가슴둘레가 비교적 일정한 비율로 성장하는 체형입니다. 하지만 털이 길게 자라는 이중모 견종의 경우 털의 부피를 감안하여 반 치수 크게 고르는 것이 좋습니다.",

        seo_s3_t: "정확한 강아지 사이즈 측정 방법",
        seo_s3_p1: "강아지 옷을 구매하기 전에는 반드시 줄자를 이용하여 아이가 서 있는 상태에서 측정해야 합니다. 앉거나 누워 있을 때 측정하면 오차가 크게 발생할 수 있습니다.",
        seo_s3_li1: "<strong>가슴둘레:</strong> 앞다리 바로 뒤, 가슴통이 가장 굵고 넓은 부분을 여유 있게 잽니다. 손가락 두 개 정도가 들어갈 여유를 두는 것이 이상적입니다.",
        seo_s3_li2: "<strong>목둘레:</strong> 목걸이가 위치하는 목의 가장 굵은 부분을 잽니다.",
        seo_s3_li3: "<strong>등길이:</strong> 목 뒤(목덜미)에서부터 꼬리가 시작되는 뿌리 부분까지의 길이를 잽니다.",
        seo_s3_p2: "저희 mung-test.com의 반려견 맞춤형 의류 사이즈 추천기는 다년간의 데이터를 바탕으로 견종과 몸무게, 털 길이 변수를 종합적으로 연산하여 <strong>가장 이상적인 예상 가슴둘레와 추천 사이즈</strong>를 무료로 제공합니다. 우리 강아지의 편안한 일상을 위해 지금 바로 계산해보세요!",
    },
    en: {
        // Meta & Titles
        meta_title_main: "Dog Temperament Test",
        meta_desc_main: "An original dog temperament test analyzing your dog's inherent instincts and acquired traits based on animal behavioral science.",
        meta_title_age: "Dog Age Calculator",
        meta_desc_age: "A scientific and emotional dog age calculator reflecting AKC standards.",
        meta_title_size: "Dog Clothing Size Recommender",
        meta_desc_size: "What's the perfect clothes size for your dog? We recommend it based on breed, weight, and hair length.",

        // Common UI
        nav_about: "About & Contact",
        nav_age: "Age Calculator",
        nav_size: "Size Recommender",
        nav_start: "Start Test",
        footer_copyright: "© 2026 Dog Data Solution Lab. All Rights Reserved.",
        footer_terms1: "About",
        footer_terms2: "Privacy Policy",
        footer_terms3: "Terms of Use",
        footer_terms4: "Behavioral Background",
        footer_disclaimer_main: "This test is for educational reference based on behavioral science and does not replace veterinary diagnosis.",
        footer_disclaimer_age: "Calculated using AKC data. Individual health conditions may cause variations.",

        // Header Toggles
        btn_lang_toggle: "KR",

        // --- Index Page ---
        logo_main: "🐾 Dog Temperament Test",
        hero_title: "How much do you know<br><span>about your dog's mind?</span>",
        hero_btn: "Start 3-min Temperament Test →",
        mini_tools_title: "Mini Diagnostic Tools",
        mini_tool_age: "Dog Age Calculator",
        mini_tool_size: "Size Recommender",
        stat_label: "Guardians who participated so far",
        stat_desc: "Many dogs are participating today! 🐶",
        btn_prev: "← Prev",
        btn_next: "Next Question →",
        btn_next_finish: "View Comprehensive Report 🐾",
        
        // Content Grid
        content_card1_title: "Test Principles",
        content_card1_t1: "We scientifically measure by separating unchanging <strong>'Inherent Instincts'</strong> encoded in DNA and <strong>'Acquired Traits'</strong> formed by environment.",
        content_card1_t2: "An original 20-question checklist based on animal behavioral psychology.",
        content_card2_title: "Inherent Instincts (4 Axes)",
        content_card2_li1: "<strong>Exploration:</strong> Curiosity for new discoveries",
        content_card2_li2: "<strong>Safety:</strong> Caution and alertness to danger",
        content_card2_li3: "<strong>Empathy:</strong> Affinity for physical contact and eye contact",
        content_card2_li4: "<strong>Focus:</strong> Persistence without immediate reward",
        content_card3_title: "Acquired Traits (3 Axes)",
        content_card3_li1: "<strong>Independence:</strong> Emotional autonomy without guardians",
        content_card3_li2: "<strong>Sociability:</strong> Harmonious interaction with strangers and other dogs",
        content_card3_li3: "<strong>Resilience:</strong> Adaptability to environmental changes",

        // MBTI Zone
        mbti_title: "Final Step! 🐾",
        mbti_desc: "To check the chemistry with your dog,<br>please tell us your MBTI!",
        mbti_select_default: "Select MBTI",
        mbti_submit_btn: "See Final Result ✨",
        alert_mbti: "Please select your MBTI to check the chemistry!",

        // Result Zone
        res_tag: "Precise Behavioral Analysis Result",
        res_analyzing: "Analyzing...",
        res_chart1_title: "Inherent Instinct Indicators",
        res_chart1_sub: "DNA encoded instincts — Exploration, Safety, Empathy, Focus",
        res_chart2_title: "Acquired Trait Indicators",
        res_chart2_sub: "Results of rearing & socialization — Independence, Sociability, Resilience",
        res_report_title: "Your Dog's True Self<br><span>Temperament Test</span>",
        res_report_sub1: "🧬 Inherent Instinct Match Report",
        res_report_sub2: "🏡 Acquired Trait Analysis & Solutions",
        res_chemistry_title: "💞 Guardian Chemistry Report",
        btn_save: "Save as Image 📥",
        btn_kakao: "Share on KakaoTalk 💬",
        btn_restart: "Restart Test 🔄",
        btn_share_other: "Test my dog's temperament too 🐾",

        // Likert
        likert_1: "Not at<br>all",
        likert_2: "Mostly<br>not",
        likert_3: "Neutral",
        likert_4: "Mostly<br>true",
        likert_5: "Very<br>true",
        scale_end1: "Strongly Disagree",
        scale_end2: "Strongly Agree",

        // --- Age Calculator ---
        logo_age: "🐾 Dog Age Calculator",
        age_calc_title: "Dog Age Calculator",
        age_calc_subtitle: "How old is your dog in human years?<br>We accurately calculate based on AKC standards considering breed and size.",
        label_dog_name: "Dog Name",
        placeholder_dog_name: "ex: Max",
        label_breed_select: "Select Breed",
        breed_select_default: "Please select a breed",
        label_current_age: "Current Age",
        age_unit_year: " Y",
        age_unit_month: " M",
        btn_age_calc: "Check Result 🐾",
        res_badge_age: "Age Calculator Result",
        res_age_text1: "'s human age is",
        res_age_text2: "years old!",
        age_quote: "Our time flows differently.<br>The time your dog can spend with you is shorter than you think.<br><strong>Make eye contact one more time today, and say you love them.</strong>",
        alert_name: "Please enter your dog's name.",
        alert_breed: "Please select a breed.",
        alert_age: "Please enter the age.",
        btn_age_restart: "Calculate Again 🔄",
        age_story_stage1: "Infancy",
        age_story_text1: " is in their curious puppy days, just opening their eyes and walking. They might cause some trouble, but their existence alone brings angelic smiles.",
        age_story_stage2: "Rebellious Puppy",
        age_story_text2: " is full of explosive energy, chewing everything due to teething. Proper socialization now determines their lifelong personality.",
        age_story_stage3: "Youth",
        age_story_text3: " is in their prime youth with fully developed muscles. They are at peak energy, the perfect walking mate keeping pace with you.",
        age_story_stage4: "Adulthood",
        age_story_text4: "'s personality has settled. They can read your mind just by looking into your eyes. A reliable family member and perfect best friend.",
        age_story_stage5: "Middle Age",
        age_story_text5: " is starting to show white hairs around the mouth. Still loves walks, but sleeps a bit more in a peaceful middle age.",
        age_story_stage6: "Senior",
        age_story_text6: "'s activity levels have noticeably decreased. Slow down your walking pace and pay attention to regular checkups and diet.",
        age_story_stage7: "Geriatric",
        age_story_text7: " can't walk as far, and their eyes might get a bit cloudy. They need careful observation and warm embraces in this precious, tender time.",

        // --- Size Calculator ---
        logo_size: "🐾 Size Recommender",
        size_calc_title: "Find the Perfect Size! 👕",
        size_calc_subtitle: "Enter breed, weight, and hair length to get the optimal clothing size.",
        label_weight: "Weight (kg)",
        label_hair: "Hair Length",
        hair_short: "✂️ Just Groomed(Short)",
        hair_medium: "🐕 Medium",
        hair_long: "☁️ Long & Fluffy",
        btn_size_calc: "Calculate",
        res_badge_size: "Size Recommendation",
        res_size_heading: "Recommended Size",
        res_chest_text: "Est. Chest Girth: ~",
        res_size_note: "*This recommendation is based on mung-test.com's standard and may vary slightly depending on body type.*",

        // Optgroups
        optgroup_pop: "Popular Breeds",
        optgroup_small: "Small (<10kg)",
        optgroup_medium: "Medium (10~25kg)",
        optgroup_large: "Large (>25kg)",

        breed_maltipoo: "Maltipoo (Small)",
        breed_maltese: "Maltese (Small)",
        breed_poodle: "Poodle (Toy/Miniature - Small)",
        breed_pomeranian: "Pomeranian (Small)",
        breed_retriever: "Retriever (Golden/Labrador - Large)",
        breed_chihuahua: "Chihuahua",
        breed_yorkshire: "Yorkshire Terrier",
        breed_shih_tzu: "Shih Tzu",
        breed_bichon: "Bichon Frise",
        breed_other_small: "Other Small Breeds",
        breed_corgi: "Welsh Corgi",
        breed_beagle: "Beagle",
        breed_cocker: "Cocker Spaniel",
        breed_french_bulldog: "French Bulldog",
        breed_other_medium: "Other Medium Breeds",
        breed_husky: "Siberian Husky",
        breed_samoyed: "Samoyed",
        breed_jindo: "Jindo",
        breed_shepherd: "German Shepherd",
        breed_other_large: "Other Large Breeds",

        // --- Dynamic Script.js Text ---
        // Questions
        q1: "When encountering a new walking route or an unseen object, they raise their tail up high and actively approach to sniff it.",
        q2: "When a delivery box arrives or a new toy is given, their eyes change and they indulge and obsess over it for a long time.",
        q3: "When spotting a butterfly, bug, or stray cat during a walk, their instinct to track triggers immediately, tensing their whole body.",
        q4: "Upon hearing motorcycle exhaust, thunder, or a strange ringtone, their body freezes or they run away to hide under the bed.",
        q5: "At the door of the vet or entering a new indoor cafe, they noticeably try to hide behind their guardian's legs.",
        q6: "When an unfamiliar person or dog approaches unexpectedly, they bark defensively or growl protectively.",
        q7: "When the guardian quietly calls their name or makes eye contact, they respond immediately and intensely.",
        q8: "If the guardian pretends to cry or sighs, they approach and lick the face showing emotional synchronization.",
        q9: "Even without treats, they wag their tail and feel happy just with a single soft word and gentle touch from the guardian.",
        q10: "To get hidden treats from a difficult nosework or toy, they do not give up easily and persist tenaciously until the end.",
        q11: "During basic training like 'sit' and 'wait', they maintain attention for a long time without being distracted by minor stimuli.",
        q12: "When given a bone or chew, they show untiring persistence staying in one spot until it is completely dismantled.",
        q13: "When the guardian prepares to leave or opens the door, they sleep indifferently on their cushion without howling or scratching.",
        q14: "Even when excited by the doorbell, if the guardian firmly says 'wait', they autonomously regulate their emotions and control themselves.",
        q15: "Rather than following the guardian around indoors, they enjoy their alone time in their independent resting space.",
        q16: "When meeting another dog, they don't growl but yield smoothly exchanging calming signals.",
        q17: "During sensitive hygiene care like grooming, bathing, or nail clipping, they calmly endure and obey the guardian or expert.",
        q18: "When a stranger encountered during a walk carefully extends a hand, they gently sniff and accept it.",
        q19: "Even in unfamiliar environments like sudden moving or dog pensions, they adapt and eat quickly without marking or vomiting.",
        q20: "Even if furniture arrangements change significantly or new appliances enter the living room, they casually pass by without much wariness.",

        // Results
        res1_title: '🔥 Curious Coward — "Dual Personality Brakes"',
        res1_inherent: "A unique genetic arrangement with high Exploration({{ E }}) and Safety({{ S }}). When seeing a new stimulus, their heart races and they charge, but face-to-face they say 'Oh my!' and reverse in full speed—a well-made ambivalence. They must tear open every delivery box, but flee under the bed at the doorbell. Check Empathy({{ M }}) and Focus({{ F }}) to set learning directions.",
        res2_title: '🚀 Explorer with Broken Brakes — "Runaway Curiosity"',
        res2_inherent: "A 'fearless' DNA where Exploration({{ E }}) is top-tier while Safety({{ S }}) barely triggers. They fear nothing and throw themselves at rolling leaves! Since they lack fear, they can be a neighborhood busybody, so impulse control training is absolute. If Focus({{ F }}) is high, safely relieve their energy with nosework or agility.",
        res3_title: '🛡️ Cautious Watchman — "Timid Philosopher"',
        res3_inherent: "With low Exploration({{ E }}) and high Safety({{ S }}), avoidance dominates over excitement upon meeting unfamiliar stimuli. They express great stress at the vet or new spaces. They likely live with internal tension regarding daily changes, needing systematic desensitization. If Empathy({{ M }}) is high, your reassuring signals act as a great stabilizer.",
        res4_title: '🛋️ Peaceful Indoor Sage — "Minimalist Homebody"',
        res4_inherent: "A very calm and mild temperament with low Exploration({{ E }}) and Safety({{ S }}). A sage DNA that realized 'outside the blanket is dangerous' since puppyhood. Rather than grand adventures, they find deep comfort in casually walking the usual 300m route. Use calm education leveraging Focus({{ F }}) to slowly infuse vitality.",
        
        res1_acquired: "A very excellent state where Acquired Independence({{ I }}) and Sociability({{ O }}) developed harmoniously. This proves you provided immense emotional trust with tearful treat rewards and consistent rules. A cool dog enjoying solitude when alone, while acting 'scholarly' accepting expert touches during grooming. If Resilience({{ X }}) is also high, traveling together is great.",
        res1_humor: "Prescription: Already perfect. You could open a dog training academy tomorrow. Just keep supplying tasty freeze-dried treats as you do now.",
        res2_acquired: "A 'guardian-exclusive clingy' trait with excellent Sociability({{ O }}) but low Independence({{ I }}). They act like an angel wagging their tail to everyone else, but at home, if you go to the bathroom, they might build a wailing wall. It's beneficial to slowly add safe zone (cushion) training for alone time.",
        res2_humor: "Prescription: Their entire universe is you. Leave the bathroom door open 0.5cm to reassure your soulmate, but occasionally play it cool and shout 'wait' to save your wallet (wallpaper repair).",
        res3_acquired: "Excellent Independence({{ I }}) but low Sociability({{ O }}), needing improved cooperation in care or social situations. They spend time alone well, but wariness spikes when strangers or dogs approach. Consistently provide socialization combining gradual exposure and high-value treats.",
        res3_humor: "Prescription: A perfect guru alone, but suddenly enters 'monk in training' mode upon meeting people. Step-by-step, use treats to show the world isn't scary.",
        res4_acquired: "If both Independence({{ I }}) and Sociability({{ O }}) are low, 'push-and-pull care' boosting Resilience({{ X }}) is intensively needed. Rather than unconditional sweetness, predictable schedule management is essential. Regular meals/walks and short, fun training sessions plant the belief that the world is safe.",
        res4_humor: "Prescription: Cosplaying a 'prickly cat' on the outside, but a perfect tsundere fiercely craving your touch inside. Become a master of push-and-pull and win with a regular schedule.",

        // Chemistry
        chem1_text: "Explosive Energy Dumb & Dumber Combo! Fantastic running mates conquering off-roads every weekend. Neither gets tired, keeping your furniture peaceful.",
        chem2_text: "Homebody Guardian meets Energizer Dog! The dog brings the leash to go out, while the guardian is becoming one with the bed. Deep condolences for your drained stamina. Dog walkers or massive nosework drops are urgently needed.",
        chem3_text: "Guardian is a Party Animal, Dog is a Scaredy-cat! A quite huge tension gap. If the extroverted guardian forces them to a loud dog cafe, the dog might tremble in the corner. Consideration for the dog's pace is needed.",
        chem4_text: "Stable Soulmates respecting each other's peace! A fantastic pair loving a quiet hideout in a loud world. A bond where you communicate through eyes without forcing outings.",
        chem5_text: "Soulmates that make you cry! A sentimentally full combo where just making eye contact warms the heart. However, beware of separation anxiety from being too affectionate.",
        chem6_text: "Pragmatic Guardian meets Lazy Genius Dog! The belief of 'minimizing unnecessary movements' matches impeccably. A perfect roommate combo smartly resting and saving energy.",
        chem7_text: "Best friends communicating through eyes! Showing perfect chemistry when needed while respecting each other's boundaries.",

        // Summary List Text
        sum_e_label: "Exploration",
        sum_e_high: "Curious explorer trait",
        sum_e_low: "Cautious & calm observant trait",
        sum_s_label: "Safety",
        sum_s_high: "Sensitive to noise & new environments",
        sum_s_low: "Relatively bold to external stimuli",
        sum_m_label: "Empathy",
        sum_m_high: "Forms strong bond with guardian",
        sum_m_low: "Independent & cool affection style",
        sum_f_label: "Focus",
        sum_f_high: "Tenacious & unyielding persistence",
        sum_f_low: "Prefers quick transitions & variety",
        sum_i_label: "Independence",
        sum_i_high: "Stable self-regulation in separation",
        sum_i_low: "Highly dependent on guardian",
        sum_o_label: "Sociability",
        sum_o_high: "Smooth affinity with dogs/people",
        sum_o_low: "Care & socialization training recommended",
        sum_x_label: "Resilience",
        sum_x_high: "Quick recovery to environment changes",
        sum_x_low: "Needs buffer care during changes",

        // Kakao Text
        kakao_share_text: "My dog got [{{ dogType }}], and I got [{{ ownerMbti }}], resulting in a chemistry score of {{ score }}!\n\nCheck our chemistry",
        kakao_share_title: "🐾 Our Dog's Temperament Result!",
        kakao_share_btn: "Check chemistry too 🐾",
        kakao_share_error: "Cannot execute KakaoTalk sharing.\nPlease check if the current domain is registered.\n\nCopying result link instead.",
        kakao_copy_success: "Link copied to clipboard!",

        // --- Age Calculator Dynamic Text ---
        age_alert_name: "Please enter your dog's name.",
        age_alert_breed: "Please select a breed.",
        age_alert_age: "Please enter their age.",
        age_alert_img_err: "An error occurred while saving the image. Please check your browser settings.",
        age_alert_kakao_key: "KakaoTalk sharing is not configured. (JS key missing)",
        age_alert_kakao_sdk: "KakaoTalk SDK is not initialized.",
        age_save_loading: "Generating image... ⏳",
        age_save_btn: "Save Result as Image 📥",

        age_stage1: "Infancy",
        age_story1: "{{ name }} is just opening their eyes and learning to walk, finding everything in the world fascinating. Though their curiosity might cause little troubles, it's an angelic period where {{ name }}'s mere existence brings smiles.",
        age_stage2: "Stormy Puppyhood",
        age_story2: "{{ name }} is teething and chewing on everything, with energy exploding like a mischievous kid. Proper socialization and bonding now will significantly shape {{ name }}'s lifelong personality.",
        age_stage3: "Youth",
        age_story3: "{{ name }} is in their shining youth, with developing bones and muscles. Their energy is at its peak, making them the best walking mate to run and walk alongside you.",
        age_stage4: "Adulthood",
        age_story4: "{{ name }}'s personality has calmly settled down. They can read your mind just by making eye contact. They are a reliable family member and an irreplaceable perfect best friend.",
        age_stage5: "Middle Age",
        age_story5: "White hairs are starting to show slightly around {{ name }}'s muzzle. While they still love walks, they sleep a bit more than before, enjoying a relaxed and peaceful middle age.",
        age_stage6: "Senior",
        age_story6: "{{ name }}'s activity levels have noticeably decreased, and their joints need attention when running. It's time to slow down your walking pace and manage regular health checkups and diet.",
        age_stage7: "Geriatric",
        age_story7: "{{ name }} can't walk as far as before, and their eyes might look a bit cloudy. They might try to hide their pain, so this is a precious and affectionate time that requires very careful observation and a warm embrace.",

        age_kakao_title: "Our time flows differently 🕰️",
        age_kakao_desc: "How old is {{ name }} in human years? Check it out now.",
        age_kakao_btn: "Check Results",

        // --- Size Calculator SEO & Dynamic ---
        size_alert_breed: "Please select a breed.",
        size_alert_kakao: "KakaoTalk sharing is not configured.",
        size_alert_kakao_sdk: "KakaoTalk SDK is not initialized.",
        size_kakao_title: "Clothing Size Recommendation 👕",
        size_kakao_desc: "Our dog's estimated chest girth is {{ chest }}cm, and recommended size is [{{ size }}]!",
        size_kakao_btn: "Check Size",

        seo_s1_t: "Dog Clothes, Why is Sizing Important?",
        seo_s1_p1: "Dressing your dog is beyond fashion; it plays a critical health role including <strong>maintaining body temp, UV protection, and preventing ticks/pests</strong>. However, unlike humans, dog body types vary vastly by breed, so choosing clothes purely by weight has a high failure rate. Tight clothes cause friction and stress, while loose clothes can cause tripping accidents.",
        seo_s1_p2: "Therefore, you must choose clothes considering accurate chest girth, breed characteristics (chest depth/width), and current hair length to ensure they are comfortable all day.",
        
        seo_s2_t: "Breed Body Types and Chest Girth",
        seo_s2_p1: "Dog body types can be largely divided into three categories by skeletal structure, which is key for sizing.",
        seo_s2_li1: "<strong>Deep Chest (Poodle, Italian Greyhound, etc.):</strong> Narrow body but deep chest. Chest girth is large compared to weight, so matching the back length often results in a tight chest.",
        seo_s2_li2: "<strong>Wide Chest (Corgi, Dachshund, etc.):</strong> Short legs and a widely developed chest. When choosing a harness or clothes, you must consider the front chest width and need a generous size.",
        seo_s2_li3: "<strong>Muscular/Bulldog (French Bulldog, Pug, etc.):</strong> Thick neck and highly developed shoulder/chest muscles. Standard small dog sizes won't zip up, requiring much larger sizes or specialized clothing.",
        seo_s2_li4: "<strong>Standard (Maltese, Pomeranian, etc.):</strong> Weight and chest girth grow proportionally. However, for double-coated breeds with long hair, choose a half-size larger considering hair volume.",

        seo_s3_t: "How to Measure Dog Size Accurately",
        seo_s3_p1: "Before buying clothes, you must measure with a tape measure while the dog is standing. Measuring while sitting or lying down can cause large errors.",
        seo_s3_li1: "<strong>Chest Girth:</strong> Measure the thickest and widest part of the chest just behind the front legs with some slack. Two fingers of slack is ideal.",
        seo_s3_li2: "<strong>Neck Girth:</strong> Measure the thickest part of the neck where the collar sits.",
        seo_s3_li3: "<strong>Back Length:</strong> Measure from the base of the neck (nape) to the root of the tail.",
        seo_s3_p2: "mung-test.com's size recommender uses years of data to compute breed, weight, and hair length variables to provide the <strong>most ideal estimated chest girth and recommended size</strong> for free. Calculate now for your dog's comfortable daily life!",
    }
};

// ==========================================
// 공통 언어 및 테마 관리
// ==========================================
function getLang() {
    return localStorage.getItem('mung_lang') || 'ko';
}

function applyLanguage(lang) {
    localStorage.setItem('mung_lang', lang);
    const btnLang = document.getElementById('btn-lang');
    if (btnLang) btnLang.textContent = translations[lang].btn_lang_toggle;
    
    // HTML lang 속성 변경
    document.documentElement.lang = lang;

    // DOM 요소 텍스트 변경
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.innerHTML.includes('<') || translations[lang][key].includes('<')) {
                el.innerHTML = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // 메타 태그 및 타이틀 변경
    document.querySelectorAll('[data-i18n-meta]').forEach(el => {
        const key = el.getAttribute('data-i18n-meta');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName.toLowerCase() === 'title') {
                el.textContent = translations[lang][key];
            } else {
                el.setAttribute('content', translations[lang][key]);
            }
        }
    });

    // 플레이스홀더 변경
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.setAttribute('placeholder', translations[lang][key]);
        }
    });
    
    // Optgroup 라벨 변경
    document.querySelectorAll('optgroup[data-i18n-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-label');
        if (translations[lang] && translations[lang][key]) {
            el.setAttribute('label', translations[lang][key]);
        }
    });

    // 커스텀 이벤트 발생시켜 다른 스크립트들이 재렌더링 하도록 유도
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

function toggleLanguage() {
    const currentLang = getLang();
    applyLanguage(currentLang === 'ko' ? 'en' : 'ko');
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('mung_theme', isDark ? 'dark' : 'light');
    const btnTheme = document.getElementById('btn-theme');
    if (btnTheme) btnTheme.textContent = isDark ? '☀️' : '🌙';
}

function initI18nAndTheme() {
    // 다크모드 초기화
    const savedTheme = localStorage.getItem('mung_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        const btnTheme = document.getElementById('btn-theme');
        if (btnTheme) btnTheme.textContent = '☀️';
    } else {
        const btnTheme = document.getElementById('btn-theme');
        if (btnTheme) btnTheme.textContent = '🌙';
    }
    
    // 다국어 초기화
    const savedLang = getLang();
    applyLanguage(savedLang);

    // 이벤트 리스너 등록
    const btnTheme = document.getElementById('btn-theme');
    if (btnTheme) btnTheme.addEventListener('click', toggleTheme);

    const btnLang = document.getElementById('btn-lang');
    if (btnLang) btnLang.addEventListener('click', toggleLanguage);
}

document.addEventListener('DOMContentLoaded', initI18nAndTheme);
