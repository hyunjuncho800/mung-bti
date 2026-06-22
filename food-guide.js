const rawFoodData = [
  { id: 1, name: "사과", category: "과일", isSafe: true, tags: ["비타민", "소화촉진", "씨앗제거"], summary: "씨앗과 껍질, 심지를 제외한 과육만 급여하세요.", detail: "비타민 A, C와 식이섬유가 풍부해 소화와 피로 해소에 좋습니다. 단, 사과 씨앗에는 시안화물이라는 독성이 있으므로 반드시 완전히 제거하고 작게 잘라 주어야 합니다." },
  { id: 2, name: "수박", category: "과일", isSafe: true, tags: ["수분보충", "음수량", "씨앗주의"], summary: "빨간 과육만 주시고 두꺼운 껍질과 씨는 빼주세요.", detail: "90% 이상이 수분으로 이루어져 있어 여름철 수분 보충과 열을 내리는 데 탁월합니다. 수박씨는 장폐색을 유발할 수 있고 껍질은 소화가 안 되므로 과육만 잘라 줍니다." },
  { id: 3, name: "바나나", category: "과일", isSafe: true, tags: ["칼륨", "에너지", "변비예방"], summary: "껍질을 벗기고 소량만 급여하세요.", detail: "칼륨, 섬유질, 비타민이 풍부해 마그네슘 보충과 장 건강에 좋습니다. 당도가 높으므로 당뇨가 있거나 비만인 강아지에게는 주의가 필요하며 간식 개념으로 조금만 주어야 합니다." },
  { id: 4, name: "포도", category: "과일", isSafe: false, tags: ["급성신부전", "치명적", "건포도포함"], summary: "단 한 알도 절대 먹이면 안 되는 치명적인 음식입니다.", detail: "포도와 거봉, 건포도 등은 강아지에게 급성 신부전을 유발하는 원인 물질을 포함하고 있습니다. 구토, 설사, 무기력증을 유발하며 심하면 사망에 이를 수 있으므로 보관에 주의해야 합니다." },
  { id: 5, name: "딸기", category: "과일", isSafe: true, tags: ["항산화", "비타민C", "꼭지제거"], summary: "꼭지를 따고 깨끗이 씻어 소량만 급여하세요.", detail: "항산화 물질과 비타민 C가 풍부하여 면역력 향상과 노화 방지에 도움을 줍니다. 자일리톨 성분이 미량 포함되어 있어 과량 급여 시 저혈당을 유발할 수 있으니 하루 1~2알이 적당합니다." },
  { id: 6, name: "블루베리", category: "과일", isSafe: true, tags: ["슈퍼푸드", "눈건강", "노화방지"], summary: "깨끗이 씻어서 생으로 또는 얼려서 급여하세요.", detail: "안토시아닌과 항산화 성분이 풍부해 노령견의 눈 건강과 인지 기능 개선에 매우 좋습니다. 크기가 작아 훈련용 보상 간식으로 활용하기 좋습니다." },
  { id: 7, name: "복숭아", category: "과일", isSafe: true, tags: ["알레르기주의", "씨앗위험", "과육만"], summary: "거대한 씨앗은 무조건 버리고 과육만 잘라 주세요.", detail: "비타민과 수분이 풍부하지만 알레르기를 유발하기 쉬운 과일입니다. 특히 복숭아 씨앗은 끝이 날카로워 식도나 장에 상처를 내거나 걸려서 장폐색을 일으키므로 절대 닿지 않게 해야 합니다." },
  { id: 8, name: "귤", category: "과일", isSafe: true, tags: ["비타민C", "신맛주의", "껍질제거"], summary: "속껍질까지 까서 알맹이 위주로 소량만 주세요.", detail: "비타민 C가 풍부해 면역력에 좋으나, 감귤류의 산성 성분은 강아지의 위를 자극할 수 있습니다. 많이 먹으면 구토나 설사를 유발하므로 작게 한 조각 정도만 맛보게 하는 것이 좋습니다." },
  { id: 9, name: "아보카도", category: "과일", isSafe: false, tags: ["퍼신독성", "구토설사", "지방함량고"], summary: "퍼신(Persin)이라는 독성 성분이 있어 급여를 금합니다.", detail: "아보카도에 포함된 '퍼신' 성분은 강아지에게 위장 장애, 구토, 설사를 유발할 수 있습니다. 또한 지방 함량이 너무 높아 췌장염을 일으킬 위험이 있습니다." },
  { id: 10, name: "고구마", category: "채소", isSafe: true, tags: ["식이섬유", "찐고구마", "다이어트적"], summary: "익혀서 급여하되 많이 먹으면 비만의 원인이 됩니다.", detail: "식이섬유가 풍부해 변비와 장 건강에 좋고 기호성이 매우 뛰어납니다. 찌거나 구워서 급여하되, 탄수화물 함량이 높아 많이 먹으면 쉽게 살이 찌므로 양 조절이 필수적입니다." },
  { id: 11, name: "당근", category: "채소", isSafe: true, tags: ["눈건강", "치석제거", "베타카로틴"], summary: "생으로 주어 씹는 재미를 주거나 살짝 익혀주세요.", detail: "베타카로틴이 풍부해 시력 보호와 모질 개선에 도움을 줍니다. 생당근을 스틱 모양으로 주면 훌륭한 노즈워크용 간식이자 치석 제거 효과를 볼 수 있습니다." },
  { id: 12, name: "브로콜리", category: "채소", isSafe: true, tags: ["살짝데치기", "항암효과", "소량급여"], summary: "물에 살짝 데쳐서 줄기 위주로 작게 잘라 주세요.", detail: "비타민과 항암 성분이 풍부한 채소입니다. 하지만 브로콜리의 '이소티오시아네이트' 성분은 다량 섭취 시 위장을 자극하므로 전체 식사량의 10% 미만으로 아주 소량만 데쳐서 주어야 합니다." },
  { id: 13, name: "양파", category: "채소", isSafe: false, tags: ["적혈구파괴", "빈혈유발", "절대금지"], summary: "적혈구를 파괴하여 치명적인 빈혈을 일으킵니다.", detail: "양파와 짜장면, 카레 등에 들어간 양파 성분은 익혀도 독성이 사라지지 않습니다. 강아지의 적혈구를 파괴해 용혈성 빈혈을 일으키며 구토, 혈뇨, 황달 증상을 유발하므로 절대 먹이면 안 됩니다." },
  { id: 14, name: "마늘", category: "채소", isSafe: false, tags: ["티오황산염", "빈혈", "한국음식주의"], summary: "양파와 마찬가지로 독성이 있어 급여하면 안 됩니다.", detail: "마늘에 포함된 티오황산염 성분은 강아지에게 중독 증상을 일으키고 빈혈을 유발합니다. 한국 음식에는 다진 마늘이 자주 들어가므로 사람이 먹는 반찬이나 고기를 주지 않도록 주의해야 합니다." },
  { id: 15, name: "양배추", category: "채소", isSafe: true, tags: ["위건강", "소화기능", "가스유발"], summary: "살짝 데치거나 삶아서 소량만 급여하세요.", detail: "위 건강을 돕는 비타민 U가 풍부하여 위장이 약한 강아지에게 좋습니다. 다만 갑상선 기능 저하증이 있는 아이들에게는 좋지 않으며, 많이 먹으면 장에 가스가 차서 복통을 유발할 수 있습니다." },
  { id: 16, name: "오이", category: "채소", isSafe: true, tags: ["수분가득", "다이어트", "입냄새제거"], summary: "껍질을 벗겨 작게 썰어주면 훌륭한 다이어트 간식이 됩니다.", detail: "칼로리가 거의 없고 수분이 많아 체중 감량이 필요한 강아지에게 최고의 간식입니다. 아삭한 식감으로 씹는 재미를 주며 입 냄새를 줄여주는 효과도 있습니다." },
  { id: 17, name: "토마토", category: "채소", isSafe: true, tags: ["빨갛게익은것만", "토마틴독성", "방울토마토"], summary: "완벽히 빨갛게 잘 익은 토마토만 소량 급여하세요.", detail: "잘 익은 토마토는 항산화 성분인 라이코펜이 풍부해 건강에 이롭습니다. 하지만 초록색을 띠는 덜 익은 토마토나 꼭지, 잎에는 '토마틴'이라는 독성이 있어 구토와 부정맥을 유발하므로 주의해야 합니다." },
  { id: 18, name: "닭고기", category: "육류", isSafe: true, tags: ["고단백", "닭가슴살", "알레르기체크"], summary: "양념 없이 삶은 닭가슴살은 좋은 단백질원입니다.", detail: "지방이 적고 단백질이 풍부해 근육 발달과 기력 회복에 좋습니다. 단, 사료의 주요 성분인 만큼 은근히 닭고기 알레르기가 있는 강아지가 많으므로 급여 후 피부를 잘 살펴야 합니다." },
  { id: 19, name: "소고기", category: "육류", isSafe: true, tags: ["기력회복", "철분풍부", "양념금지"], summary: "지방이 적은 부위로 양념 없이 구워주거나 삶아주세요.", detail: "철분과 필수 아미노산이 풍부해 빈혈 예방과 면역력에 좋습니다. 기름진 부위는 췌장염을 유발할 수 있으므로 우둔살이나 홍두깨살 같은 살코기 부위를 선택해 간을 하지 않고 조리해 줍니다." },
  { id: 20, name: "삼겹살", category: "육류", isSafe: false, tags: ["췌장염위험", "고지방", "구토유발"], summary: "지방 함량이 지나치게 높아 췌장염을 유발할 수 있습니다.", detail: "삼겹살이나 차돌박이처럼 기름기가 지나치게 많은 육류는 강아지의 소화 기관에 큰 부담을 주며, 급성 췌장염의 주원인이 됩니다. 심한 구토와 복통을 동반하므로 살코기가 아닌 비계 부위는 절대 주면 안 됩니다." },
  { id: 21, name: "오리고기", category: "육류", isSafe: true, tags: ["불포화지방산", "피부모질", "보양식"], summary: "생오리나 양념 없는 훈제를 구워 기름기를 빼고 주세요.", detail: "불포화지방산이 풍부하여 피부와 모질을 부드럽게 해주고 혈관 건강에 도움을 줍니다. 시중의 사람용 훈제오리는 염분이 강하므로 반려견 전용 오리고기나 생오살을 조리해 주는 것이 안전합니다." },
  { id: 22, name: "돼지뼈 / 닭뼈", category: "육류", isSafe: false, tags: ["식도파열", "장폐색", "익힌뼈위험"], summary: "익힌 동물의 뼈는 날카롭게 부러져 내부 장기를 찌릅니다.", detail: "생뼈와 달리 삶거나 구운 뼈(치킨 뼈, 족발 뼈 등)는 씹었을 때 날카로운 조각으로 쪼개집니다. 이를 삼키면 식도, 위, 장에 구멍을 내거나 걸려서 수술을 해야 하므로 매우 위험합니다." },
  { id: 23, name: "북어 / 황태", category: "수산물", isSafe: true, tags: ["강아지보약", "염분제거필수", "기력회복"], summary: "물에 여러 번 끓여 염분을 완전히 빼고 가시를 발라 주세요.", detail: "강아지계의 보약으로 불릴 만큼 아미노산이 풍부해 출산, 수술 후 기력 회복에 최고입니다. 다만 바다 생선 특성상 염분이 많으므로 반나절 이상 물에 담가 소금기를 완전히 빼고 끓여주어야 합니다." },
  { id: 24, name: "연어", category: "수산물", isSafe: true, tags: ["오메가3", "피부미용", "완전히익히기"], summary: "생연어는 위험하므로 반드시 완전히 익혀서 급여하세요.", detail: "오메가-3 지방산이 풍부해 모질 개선과 면역력, 관절 건강에 훌륭합니다. 하지만 날것으로 먹으면 '연어 흡충'에 의한 연어 중독(구토, 고열)에 걸릴 수 있으므로 찌거나 구워서 바짝 익혀주어야 합니다." },
  { id: 25, name: "오징어 / 문어", category: "수산물", isSafe: false, tags: ["소화불량", "위장장애", "건어물위험"], summary: "타우린은 많으나 소화가 전혀 안 되어 위통을 유발합니다.", detail: "오징어, 문어, 낙지 등 패류 및 갑각류는 질겨서 강아지가 제대로 씹지 못하고 삼키기 쉽습니다. 위에 들어가면 불어나서 소화 불량, 구토, 심한 장폐색을 유발할 수 있으며 건오징어는 특히 위험합니다." },
  { id: 26, name: "새우", category: "수산물", isSafe: true, tags: ["콜레스테롤", "껍질제거", "익혀서급여"], summary: "껍질과 꼬리, 머리를 완전히 떼고 삶아서 살만 주세요.", detail: "키토산과 타우린이 풍부해 소량 급여 시 건강에 이롭습니다. 그러나 날것으로 주면 안 되며, 단단하고 뾰족한 새우 껍질과 꼬리는 소화 기관에 상처를 내므로 확실히 제거해야 합니다." },
  { id: 27, name: "초콜릿", category: "가공식품", isSafe: false, tags: ["테오브로민", "치명적독성", "응급실"], summary: "강아지에게 가장 대중적이고 치명적인 독극물입니다.", detail: "초콜릿의 카카오 성분에 포함된 '테오브로민'은 강아지가 대사하지 못하는 독성 물질입니다. 심박수 급증, 발작, 구토 등을 일으키며 소량으로도 목숨이 위험하므로 먹었을 시 즉시 동물병원을 찾아야 합니다." },
  { id: 28, name: "자일리톨 껌", category: "가공식품", isSafe: false, tags: ["인슐린과다", "급성간부전", "저혈당쇼크"], summary: "소량으로도 심각한 저혈당 쇼크와 간 손상을 일으킵니다.", detail: "사람용 껌이나 캔디에 든 자일리톨은 강아지 체내에서 인슐린을 과다 분비시켜 급격한 저혈당을 유발합니다. 섭취 후 30분 이내에 무기력, 구토, 발작이 올 수 있으며 간 괴사를 일으키는 무서운 성분입니다." },
  { id: 29, name: "두부", category: "가공식품", isSafe: true, tags: ["식물성단백질", "데치기", "다이어트식"], summary: "찬물에 담가 염분을 빼고 끓는 물에 데쳐서 주세요.", detail: "콩으로 만든 두부는 풍부한 식물성 단백질을 제공하며 소화 흡수율이 높아 나이 든 반려견에게도 좋습니다. 제조 과정에서 간수가 들어가므로 끓는 물에 데쳐 염분을 빼고 급여하는 것이 좋습니다." },
  { id: 30, name: "우유 (사람용)", category: "음료", isSafe: false, tags: ["유당불내증", "설사유발", "락토프리필수"], summary: "사람 우유는 설사를 유발하므로 락토프리 우유만 주세요.", detail: "강아지는 사람이 먹는 일반 우유 속 유당(Lactose)을 분해하는 효소(락타아제)가 부족합니다. 일반 우유를 마시면 장염, 설사, 복통을 겪으므로 반드시 반려견 전용 펫밀크나 유당이 제거된 락토프리 우유를 주어야 합니다." },
  { id: 31, name: "커피 / 녹차", category: "음료", isSafe: false, tags: ["카페인중독", "심장마비", "흥분상태"], summary: "카페인 성분은 강아지의 심장과 신경계에 치명적입니다.", detail: "커피, 녹차, 홍차, 에너지 드링크 등에 함유된 카페인은 강아지에게 과도한 흥분, 고혈압, 구토, 부정맥, 발작을 유발합니다. 중독 증상이 심할 경우 심장마비로 이어질 수 있습니다. " },
  { id: 32, name: "막걸리 / 술", category: "음료", isSafe: false, tags: ["알코올중독", "호흡곤란", "절대금지"], summary: "아주 미량의 알코올로도 급성 알코올 중독에 빠집니다.", detail: "강아지의 간은 알코올을 분해할 수 없습니다. 술을 마시면 뇌 손상, 호흡 곤란, 혼수 상태에 빠지며 심한 경우 사망합니다. 호기심으로라도 술잔을 바닥에 두어 강아지가 핥지 않도록 해야 합니다." },
  { id: 33, name: "계란 노른자", category: "기타", isSafe: true, tags: ["기력회복", "영양만점", "완전식품"], summary: "완전히 삶아서 사료에 으깨어 주면 훌륭한 영양식이 됩니다.", detail: "단백질, 아미노산, 비타민이 풍부해 강아지의 피로 해소와 모질 개선에 아주 좋습니다. 단, 칼로리가 높은 편이므로 하루 식사량에 맞춰 적당량만 조절해 주어야 합니다." },
  { id: 34, name: "계란 흰자 (날것)", category: "기타", isSafe: false, tags: ["아비딘성분", "비오틴결핍", "살모넬라균"], summary: "날계란 흰자는 비오틴 결핍과 식중독을 유발할 수 있습니다.", detail: "익힌 계란 흰자는 안전하지만, 날것 상태의 흰자에는 '아비딘'이라는 성분이 있어 비타민H(비오틴)의 흡수를 방해해 피부염을 유발합니다. 또한 살모넬라균 감염 위험이 있으므로 꼭 계란은 삶아서 줍니다." },
  { id: 35, name: "치즈 (사람용)", category: "가공식품", isSafe: false, tags: ["높은염분", "지방과다", "반려견전용추천"], summary: "염분과 지방이 너무 많아 사람 치즈는 피하는 게 좋습니다.", detail: "일반 슬라이스 치즈나 피자 치즈는 나트륨과 지방 함량이 너무 높아 강아지의 신장에 부담을 주고 췌장염을 일으킬 수 있습니다. 급여하고 싶다면 염분을 뺀 아기용 치즈나 펫 전용 치즈를 선택하세요." },
  { id: 36, name: "식빵 / 밀가루", category: "가공식품", isSafe: true, tags: ["탄수화물", "글루텐알레르기", "소량만"], summary: "아무것도 첨가되지 않은 흰 식빵 부드러운 부분만 조금 주세요.", detail: "순수한 식빵은 독성은 없으나 단순 탄수화물 덩어리라 영양학적으로 이롭지 않고 쉽게 살이 딉니다. 글루텐 알레르기가 있는 강아지는 가려움증을 느낄 수 있으며, 이스트가 들어간 생빵 반죽은 위에서 부풀어 올라 절대 금지입니다." },
  { id: 37, name: "아몬드 / 땅콩", category: "기타", isSafe: false, tags: ["견과류위험", "소화불량", "마카다미아독성"], summary: "지방이 많아 소화가 어렵고 기도가 막힐 위험이 큽니다.", detail: "견과류는 알갱이가 단단해 씹지 않고 삼켰을 때 식도나 장을 막을 수 있으며, 지방 함량이 높아 구토나 설사를 유발합니다. 특히 '마카다미아'는 강아지에게 신경계 중독을 일으키므로 절대 먹이면 안 됩니다." },
  { id: 38, name: "버섯", category: "채소", isSafe: true, tags: ["면역력", "팽이버섯", "표고버섯"], summary: "식용 버섯을 양념 없이 완전히 익혀서 작게 잘라 주세요.", detail: "사람이 먹는 팽이, 새송이, 표고버섯 등은 베타글루칸이 풍부해 면역력에 좋습니다. 단, 기름에 볶지 말고 물에 삶아 주어야 하며 야외 산책 중 마주치는 야생 버섯은 치명적인 독버섯일 수 있으므로 절대 먹지 못하게 해야 합니다." },
  { id: 39, name: "아이스크림", category: "가공식품", isSafe: false, tags: ["당분과다", "유당불내증", "비만유발"], summary: "설탕과 유당이 지나치게 많아 위장 장애를 유발합니다.", detail: "아이스크림은 다량의 설탕과 우유 성분으로 이루어져 있어 강아지가 먹으면 급성 설사나 복통을 겪고 비만의 원인이 됩니다. 특히 초콜릿맛이나 녹차맛, 자일리톨이 첨가된 아이스크림은 독극물과 같습니다." },
  { id: 40, name: "김치", category: "가공식품", isSafe: false, tags: ["매운음식", "염분폭탄", "위궤양"], summary: "매운 고춧가루와 마늘, 높은 염분으로 위벽을 자극합니다.", detail: "한국인의 소울푸드이지만 강아지에겐 최악의 음식입니다. 캡사이신 성분은 강아지의 위벽을 헐게 만들고 심한 설사와 복통을 유발하며, 김치에 포함된 다량의 마늘과 파 성분은 빈혈까지 동반합니다." },
  { id: 41, name: "꿀", category: "기타", isSafe: true, tags: ["천연당분", "감기예방", "보툴리누스주의"], summary: "감기 기운이 있을 때 따뜻한 물에 소량만 타서 주세요.", detail: "천연 피로회복제 역할을 하며 기침을 완화하는 데 도움을 줍니다. 소화력이 약한 1세 미만의 새끼 강아지에게는 보툴리누스균 중독을 일으킬 수 있어 급여를 금하며, 성견이라도 당뇨 예방을 위해 아주 가끔 소량만 주어야 합니다." },
  { id: 42, name: "감", category: "과일", isSafe: true, tags: ["단감", "홍시", "장폐색주의"], summary: "씨앗을 완벽히 제거하고 부드러운 과육만 주세요.", detail: "단감이나 홍시는 비타민이 풍부해 소량 급여 시 면역력에 좋습니다. 다만 감 씨앗은 소화되지 않고 장에 걸려 수술로 제거해야 하는 단골 원인이 되며, 탄닌 성분이 많아 과식하면 변비를 유발합니다." }
];

// 이모지 매핑 헬퍼
const iconMap = {
  "사과": "🍎", "수박": "🍉", "바나나": "🍌", "포도": "🍇", "딸기": "🍓", "블루베리": "🫐", "복숭아": "🍑", "귤": "🍊", "아보카도": "🥑",
  "고구마": "🍠", "당근": "🥕", "브로콜리": "🥦", "양파": "🧅", "마늘": "🧄", "양배추": "🥬", "오이": "🥒", "토마토": "🍅",
  "닭고기": "🍗", "소고기": "🥩", "삼겹살": "🥓", "오리고기": "🦆", "돼지뼈 / 닭뼈": "🦴",
  "북어 / 황태": "🐟", "연어": "🍣", "오징어 / 문어": "🦑", "새우": "🦐",
  "초콜릿": "🍫", "자일리톨 껌": "🍬", "두부": "🧊", "치즈 (사람용)": "🧀", "식빵 / 밀가루": "🍞", "아이스크림": "🍦", "김치": "🌶️",
  "우유 (사람용)": "🥛", "커피 / 녹차": "☕", "막걸리 / 술": "🍺",
  "계란 노른자": "🥚", "계란 흰자 (날것)": "🍳", "아몬드 / 땅콩": "🥜", "버섯": "🍄", "꿀": "🍯", "감": "🍅"
};

// 데이터에 이모지 병합 및 키명 변경(type -> isSafe, tag -> tags 등)
const foodData = rawFoodData.map(food => ({
  id: food.id,
  type: food.isSafe ? 'safe' : 'unsafe',
  icon: iconMap[food.name] || "🍽️",
  name: food.name,
  category: food.category,
  tags: food.tags,
  tag: food.tags[0], // 메인 태그 (카드 표시용)
  desc: food.summary,
  warning: food.detail,
  howTo: food.isSafe ? food.summary : "절대 급여 금지"
}));

// 상태 관리
let currentType = 'safe'; // 'safe' or 'unsafe'
let currentCategory = '전체'; // 카테고리 필터
let searchQuery = '';

// 페이지네이션
const ITEMS_PER_PAGE = 12;
let currentPage = 1;
let filteredDataCache = []; // 필터링된 전체 결과 캐싱

const categories = ['전체', '과일', '채소', '육류', '수산물', '가공식품', '음료', '기타'];

function initCategoryChips() {
    const chipContainer = document.getElementById('category-chips');
    chipContainer.innerHTML = categories.map(cat => 
        `<button class="category-chip ${cat === currentCategory ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
    ).join('');

    chipContainer.querySelectorAll('.category-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCategory = e.target.dataset.cat;
            
            // UI 업데이트
            chipContainer.querySelectorAll('.category-chip').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // 초기화 후 렌더링
            currentPage = 1;
            applyFilters();
        });
    });
}

function applyFilters() {
    filteredDataCache = foodData.filter(food => {
        // 1. 안전 여부 필터
        const matchType = food.type === currentType;
        
        // 2. 카테고리 필터
        const matchCategory = currentCategory === '전체' || food.category === currentCategory;

        // 3. 검색어 필터 (이름 또는 태그 배열 내 텍스트 매칭)
        const query = searchQuery.toLowerCase();
        const matchSearch = food.name.toLowerCase().includes(query) || 
                            food.tags.some(tag => tag.toLowerCase().includes(query));

        return matchType && matchCategory && matchSearch;
    });

    renderFoodGrid(true); // reset = true
}

function renderFoodGrid(reset = false) {
    const grid = document.getElementById('food-grid');
    const loadMoreBtn = document.getElementById('btn-load-more');
    const lang = typeof getLang === 'function' ? getLang() : 'ko';
    
    if (reset) {
        grid.innerHTML = '';
    }

    if (filteredDataCache.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🐶💦</div>
                <div class="empty-text">
                    ${lang === 'ko' ? `앗, '<b>${searchQuery}</b>'에 대한 검색 결과가 없어요!<br>다른 음식을 검색해보시거나 필터를 변경해보세요.` : `Oops, no results for '<b>${searchQuery}</b>'!<br>Try searching for another food or change the filter.`}
                </div>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }

    // 현재 페이지에 해당하는 데이터 조각 (Slice)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const itemsToShow = filteredDataCache.slice(startIndex, endIndex);

    const htmlString = itemsToShow.map(food => {
        const cls = food.type === 'safe' ? 'safe' : 'unsafe';
        return `
            <div class="food-card ${cls}" onclick="openFoodModal(${food.id})">
                <div class="food-icon">${food.icon}</div>
                <div class="food-name">${food.name}</div>
                <div class="food-tag">#${food.tag}</div>
            </div>
        `;
    }).join('');

    // DOM에 추가
    if (reset) {
        grid.innerHTML = htmlString;
    } else {
        grid.insertAdjacentHTML('beforeend', htmlString);
    }

    // 더보기 버튼 표시 여부 결정
    if (filteredDataCache.length > endIndex) {
        loadMoreBtn.style.display = 'inline-block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

function openFoodModal(foodId) {
    const food = foodData.find(f => f.id === foodId);
    if (!food) return;

    const modal = document.getElementById('food-modal');
    const body = document.getElementById('food-modal-body');
    const lang = typeof getLang === 'function' ? getLang() : 'ko';

    const safeLabel = lang === 'ko' ? '먹어도 돼요 🟢' : 'Safe 🟢';
    const unsafeLabel = lang === 'ko' ? '먹으면 안 돼요 ❌' : 'Unsafe ❌';
    const tagCls = food.type === 'safe' ? 'safe' : 'unsafe';
    const typeLabel = food.type === 'safe' ? safeLabel : unsafeLabel;

    body.innerHTML = `
        <span class="food-modal-tag ${tagCls}">${typeLabel}</span>
        <h3><span style="font-size: 2rem;">${food.icon}</span> ${food.name}</h3>
        
        <p class="food-modal-content-text">${food.desc}</p>
        
        <div style="margin-bottom: 16px;">
            <strong style="color:var(--text); font-size:1.05rem;">💡 ${lang === 'ko' ? '상세 설명 / 급여 방법' : 'Details / How to feed'}</strong>
            <p class="food-modal-content-text" style="margin-top: 4px;">${food.warning}</p>
        </div>
    `;

    modal.classList.add('active');
}

function closeFoodModal() {
    document.getElementById('food-modal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. 카테고리 칩 초기화
    initCategoryChips();

    // 2. 탭 이벤트 리스너
    const tabSafe = document.getElementById('tab-safe');
    const tabUnsafe = document.getElementById('tab-unsafe');

    tabSafe.addEventListener('click', () => {
        currentType = 'safe';
        tabSafe.classList.add('active', 'safe');
        tabUnsafe.classList.remove('active', 'unsafe');
        tabSafe.style.background = '';
        tabUnsafe.style.background = '';
        
        currentPage = 1;
        applyFilters();
    });

    tabUnsafe.addEventListener('click', () => {
        currentType = 'unsafe';
        tabUnsafe.classList.add('active', 'unsafe');
        tabSafe.classList.remove('active', 'safe');
        
        currentPage = 1;
        applyFilters();
    });

    // 3. 검색 이벤트 리스너
    const searchInput = document.getElementById('food-search-input');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        currentPage = 1;
        applyFilters();
    });

    // 4. 더보기 버튼 이벤트 리스너
    const loadMoreBtn = document.getElementById('btn-load-more');
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderFoodGrid(false); // reset = false 로 계속 이어붙이기
    });

    // 5. 최초 렌더링
    applyFilters();
});
