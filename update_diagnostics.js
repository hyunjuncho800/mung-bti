const fs = require('fs');

const data = JSON.parse(fs.readFileSync('diagnostics_data.json', 'utf8'));

const updates = [
  {
    "id": 3,
    "titleKo": "엉덩이를 바닥에 대고 끄는 행동을 할 때 (똥스키)",
    "titleEn": "Dragging Bottom on the Floor (Scooting)",
    "ko": {
        "physical": "가장 흔한 원인은 항문 주위에 있는 항문낭에 분비물이 가득 차서 가려움이나 통증을 느끼는 것입니다. 혹은 항문낭에 염증이 생겼거나, 기생충 감염, 사료나 간식으로 인한 알레르기성 피부염이 원인일 수 있습니다. 최근 미용 후 항문 주변 피부가 자극을 받아 일시적으로 끄는 경우도 있습니다.",
        "psychological": "배변 활동 후 항문 주위에 이물감이 남아있는 느낌에 스트레스를 받거나 불안함을 느껴 이를 해소하려는 행동일 수 있습니다. 드물게는 이러한 행동을 했을 때 보호자가 크게 반응하며 관심을 주었던 기억 때문에, 보호자의 주의를 끌기 위한 학습된 행동으로 나타나기도 합니다.",
        "homecare": "반려견의 꼬리를 살짝 들고 항문 양옆(4시, 8시 방향)을 확인하여 붓거나 발적이 있는지 보세요. 목욕 시 주기에 맞춰 항문낭을 부드럽게 짜서 비워주시고, 항문 주변을 항상 청결하고 건조하게 유지해 주세요. 식단에서 알레르기 유발 유인을 줄여주는 것도 도움이 됩니다.",
        "redflag": "항문 주변이 심하게 붉어지거나 부어오르고, 피나 고름 같은 분비물이 관찰된다면 항문낭 파열이나 심한 염증의 신호입니다. 아이가 엉덩이를 만지려고 할 때 극심한 통증을 호소한다면 즉시 병원에 방문하여 소독 및 항생제 처방을 받아야 합니다."
    },
    "en": {
        "physical": "The most common cause is impacted anal glands causing itchiness or pain. Other causes include gland infections, parasites, or allergic dermatitis from food. It can also temporarily happen after grooming due to skin irritation.",
        "psychological": "It could be stress or anxiety caused by a lingering sensation after defecating. Rarely, it might be a learned behavior to seek attention if the owner reacted strongly to it in the past.",
        "homecare": "Lift the tail and check for swelling or redness around the anus (4 and 8 o'clock positions). Regularly express the anal glands gently during baths, and keep the area clean and dry. Reducing allergens in the diet also helps.",
        "redflag": "If the area is severely red, swollen, or discharging blood or pus, it indicates a ruptured or severely infected anal gland. If the dog shows extreme pain when touched, visit a vet immediately for antibiotics and cleaning."
    }
  },
  {
    "id": 4,
    "titleKo": "갑자기 깨갱거리며 몸을 만지는 것을 싫어할 때",
    "titleEn": "Suddenly Yelping and Refusing to Be Touched",
    "ko": {
        "physical": "가장 유력한 원인은 척추 디스크(간판판 탈출증)나 슬개골 탈출증, 고관절 이형성증 같은 근골격계의 급성 통증입니다. 혹은 발톱이 부러졌거나, 눈에 보이지 않는 미세한 자상, 벌레 물림, 또는 급성 복통(췌장염 등)으로 인해 특정 부위가 닿았을 때 극심한 통증을 느끼는 상태일 수 있습니다.",
        "psychological": "과거에 특정 부위를 만졌을 때 아팠던 기억(주사, 미용 상처 등)으로 인한 트라우마나 극심한 공포심 때문일 수 있습니다. 신체적 통증이 없더라도 현재 환경이나 주변 인물에 대해 강한 경계심과 스트레스를 느끼고 있을 때 방어기제로서 만지는 것을 거부할 수 있습니다.",
        "homecare": "억지로 안아 올리거나 통증 부위를 확인하려고 과도하게 만지지 마세요. 아이를 평평하고 푹신한 바닥에 두고 움직임을 최소화할 수 있도록 제한(울타리나 케이지 격리)해 주세요. 계단이나 침대에서 뛰어내리지 못하게 하고, 심신 안정을 위해 주변을 어둡고 조용하게 만들어 줍니다.",
        "redflag": "소리를 지른 후 뒷다리를 끌거나 제대로 서지 못하는 증상(마비 증상), 등이나 허리를 둥글게 말고 부르르 떠는 행위, 호흡이 비정상적으로 가빠지거나 밥과 물을 모두 거부하는 상태가 지속된다면 신경계나 내부 장기의 응급 상황이므로 지체 없이 병원으로 가야 합니다."
    },
    "en": {
        "physical": "The most likely cause is acute musculoskeletal pain like a herniated disc, luxating patella, or hip dysplasia. It could also be a broken nail, unseen minor cuts, bug bites, or acute abdominal pain (e.g., pancreatitis) causing extreme pain when touched.",
        "psychological": "It could stem from trauma or intense fear from past painful experiences (e.g., injections, grooming cuts). Even without physical pain, strong defensiveness and stress regarding the current environment or people can trigger this rejection.",
        "homecare": "Do not forcefully pick up or excessively touch the dog to locate the pain. Place them on a flat, soft surface and restrict movement (e.g., in a playpen or crate). Prevent jumping off beds or stairs, and keep the environment dark and quiet for relaxation.",
        "redflag": "If yelping is followed by dragging hind legs, inability to stand (paralysis), arching the back while trembling, abnormally fast breathing, or total refusal of food and water, this is a neurological or internal emergency requiring immediate vet care."
    }
  },
  {
    "id": 5,
    "titleKo": "켁켁거리며 거위 울음소리 같은 기침을 할 때",
    "titleEn": "Coughing with a Honking Sound",
    "ko": {
        "physical": "공기가 지나가는 통로인 기관지가 좁아지는 '기관허탈(Tracheal Collapse)' 증상일 확률이 매우 높습니다. 주로 포메라니안, 말티즈, 요크셔테리어 등 소형견에게 자주 발생합니다. 그 외에도 전염성 기관지염인 '켄넬코프'나 심장 비대로 인해 기관지가 압박을 받아 발생하는 심장성 기침일 가능성도 있습니다.",
        "psychological": "반려견이 보호자의 귀가, 간식 시간, 장난감 놀이 등으로 인해 급격하게 흥분하거나 스트레스를 받아 과호흡이 일어날 때 기관지에 무리가 가며 기침이 유발됩니다. 불안감이나 긴장감이 극도로 높아졌을 때도 호흡 패턴이 깨지면서 켁켁거리는 증상이 심해질 수 있습니다.",
        "homecare": "목을 압박하는 목줄 대신 가슴을 감싸는 하네스로 즉시 교체해 주세요. 아이가 흥분했을 때는 차분한 목소리로 달래며 안정을 취하게 하고, 실내 습도를 50~60%로 촉촉하게 유지해 주는 것이 좋습니다. 과체중일 경우 기관지 압박이 심해지므로 체중 관리가 필수적입니다.",
        "redflag": "기침이 멈추지 않고 연속적으로 발생하거나, 혀와 잇몸의 색깔이 보라색 또는 푸른색으로 변하는 청색증 증상이 나타나는 경우, 혹은 호흡을 할 때 쌕쌕거리는 천명음이 크게 들린다면 산소 부족으로 인한 쇼크 위험이 있으므로 즉시 응급 야간 병원을 찾아야 합니다."
    },
    "en": {
        "physical": "This is highly likely 'Tracheal Collapse,' a narrowing of the airway. It often occurs in small breeds like Pomeranians, Maltese, and Yorkies. Other possibilities include 'Kennel Cough' (infectious bronchitis) or cardiac cough caused by an enlarged heart pressing on the airway.",
        "psychological": "Extreme excitement or stress (e.g., owner returning, treat time) can cause hyperventilation, straining the airway and triggering coughs. Extreme anxiety or tension can also disrupt breathing patterns, leading to severe hacking.",
        "homecare": "Immediately switch from a neck collar to a chest harness to avoid pressure. When the dog is excited, calmly soothe them and maintain indoor humidity at 50-60%. Weight management is crucial as obesity severely worsens airway compression.",
        "redflag": "If coughing is continuous, or if the tongue/gums turn purple/blue (cyanosis), or if loud wheezing occurs during breathing, this indicates a risk of hypoxic shock. Seek an emergency vet immediately."
    }
  },
  {
    "id": 6,
    "titleKo": "평소와 달리 헥헥거리며 안절부절못하고 떨 때",
    "titleEn": "Panting Heavily, Restless, and Trembling",
    "ko": {
        "physical": "실내 온도가 너무 높아 발생한 초기 열사병 증상이거나, 감염 및 염증으로 인한 고열 상태일 수 있습니다. 또한 급성 복통, 관절 통증 등 몸 어딘가에 강한 통증이 있을 때 이를 견디기 위해 호흡이 가빠지고 몸을 떨게 됩니다. 노령견의 경우 인지기능 장애 증상으로 나타나기도 합니다.",
        "psychological": "천둥번개, 폭죽, 공사장 소음 등 외부의 갑작스러운 소음으로 인한 극심한 공포와 공황 상태일 수 있습니다. 또는 보호자와의 분리불안, 낯선 환경으로의 이동, 새로운 사람이나 동물에 대한 스트레스가 심리적 과부하를 일으켜 신체적인 떨림과 과호흡으로 표출되는 것입니다.",
        "homecare": "실내 온도를 시원하게 조절해 주시고, 편안하고 독립된 어두운 공간(켄넬 등)으로 대피시켜 주세요. 소음이 원인이라면 클래식 음악이나 백색소음을 틀어 소리를 상쇄시켜 줍니다. 신체 통증이 의심된다면 배를 만졌을 때 딱딱한지, 다리를 저는지 조심스럽게 살펴보세요.",
        "redflag": "주변 환경을 시원하고 안정되게 바꿨음에도 30분 이상 떨림과 헥헥거림이 멈추지 않는 경우, 침을 과도하게 흘리거나 눈동자가 흔들리는 증상, 짚었을 때 몸이 불덩이처럼 뜨거운 고열 상태가 지속된다면 신속한 수의사의 진단과 처치가 필요합니다."
    },
    "en": {
        "physical": "This could be early heatstroke from high indoor temperatures or a high fever due to infection. It can also indicate severe localized pain (like acute abdominal or joint pain) causing fast breathing and tremors. In senior dogs, it may be a sign of cognitive dysfunction.",
        "psychological": "It could be extreme fear or panic triggered by sudden noises like thunder or fireworks. Separation anxiety, moving to a new environment, or stress from new people/animals can also cause psychological overload, resulting in physical tremors and hyperventilation.",
        "homecare": "Cool down the room and move the dog to a quiet, dark, and independent space (like a crate). If noise is the cause, play classical music or white noise. If physical pain is suspected, gently check if the belly is hard or if they are limping.",
        "redflag": "If the trembling and panting persist for over 30 minutes despite a calm/cool environment, or if accompanied by excessive drooling, rolling eyes, or a burning hot body indicating high fever, rapid veterinary intervention is required."
    }
  },
  {
    "id": 7,
    "titleKo": "노란색 또는 녹색 토를 했을 때",
    "titleEn": "Vomiting Yellow or Green Fluid",
    "ko": {
        "physical": "노란색 토는 공복 시간이 너무 길어져 위가 비었을 때 위액과 쓸개즙이 역류하여 발생하는 '공복 토'인 경우가 많습니다. 반면 녹색 토는 산책 중 풀을 뜯어 먹었을 때 발생하기도 하지만, 풀을 먹지 않았다면 이물질 오인 섭취로 인한 위장관 막힘, 급성 췌장염, 또는 쓸개즙 자체의 중등도 이상 역류가 원인일 수 있습니다.",
        "psychological": "급격한 스트레스나 과도한 긴장 상태(호텔링, 장거리 차 탑승, 미용 등)를 겪을 때 위장 운동이 급격히 저하되면서 소화 불량과 함께 구토 증상으로 이어질 수 있습니다. 예민한 아이들의 경우 일상의 변화 자체가 스트레스로 작용해 위산 분비를 촉진하기도 합니다.",
        "homecare": "단순 노란색 공복 토라면 급여 간격을 조절하여 밤늦게 소량의 사료를 주거나 식사 횟수를 나누어 정기적으로 급여해 보세요. 구토 후에는 위장을 진정시키기 위해 최소 몇 시간 동안 음식을 제한하고, 물은 미지근한 상태로 조금씩만 급여하며 상태를 관찰해야 합니다.",
        "redflag": "구토의 횟수가 하루에 3회 이상 반복되는 경우, 녹색 토와 함께 심한 악취나 피가 섞여 나오는 경우, 구토 후 무기력증에 빠져 기운이 전혀 없거나 설사를 동반한다면 단순 공복 토가 아니므로 이물질 확인을 위한 엑스레이 및 혈액 검사를 받아야 합니다."
    },
    "en": {
        "physical": "Yellow vomit is often 'bilious vomiting' caused by an empty stomach and reflux of gastric acid/bile due to long fasting. Green vomit can occur from eating grass, but otherwise might indicate a gastrointestinal blockage from foreign objects, acute pancreatitis, or severe bile reflux.",
        "psychological": "Extreme stress or tension (e.g., boarding, long car rides, grooming) can severely slow gastrointestinal motility, leading to indigestion and vomiting. For sensitive dogs, mere routine changes act as stress, increasing stomach acid secretion.",
        "homecare": "For simple yellow bile vomit, adjust feeding intervals by giving a small late-night snack or dividing meals. After vomiting, restrict food for a few hours to calm the stomach, and offer only small sips of lukewarm water while monitoring.",
        "redflag": "If vomiting repeats 3+ times a day, if green vomit has a foul odor or blood, or if accompanied by severe lethargy and diarrhea, this is not simple fasting vomit. An X-ray and blood test are needed immediately to rule out obstruction."
    }
  },
  {
    "id": 8,
    "titleKo": "벽이나 바닥에 머리를 강하게 대고 밀고 있을 때 (Head Pressing)",
    "titleEn": "Pressing Head Hard Against Walls/Floors (Head Pressing)",
    "ko": {
        "physical": "이 행동은 단순한 장난이 아닌 매우 심각한 신경계 질환의 증상입니다. 뇌종양, 뇌염, 두부 외상 등 뇌 자체의 질환이거나, 간 기능이 떨어져 체내 암모니아가 해독되지 않고 뇌로 올라가 발생하는 '간성뇌증', 혹은 납이나 약물 등 독성 물질에 중독되었을 때 나타나는 대표적인 증상입니다.",
        "psychological": "해당 증상은 대뇌의 신경학적 손상과 압박으로 인해 발생하는 강박적이고 본능적인 통증 완화 행동입니다. 단순한 불안감이나 지루함, 외로움 등 심리적인 요인만으로는 벽에 머리를 무작정 대고 힘을 주어 누르는 행동(Head Pressing)이 나타나지 않습니다.",
        "homecare": "아이가 이 행동을 하고 있다면 즉시 스마트폰을 꺼내 **영상을 10초 이상 촬영**하세요. 병원에 가서 증상을 설명할 때 영상이 가장 확실한 진단 단서가 됩니다. 아이가 벽에 머리를 찧어 2차 부상을 입지 않도록 주변의 날카로운 물건을 치우고 부드러운 쿠션 등으로 머리를 보호해 준 뒤 즉시 이동해야 합니다.",
        "redflag": "이 행동 자체가 **심각한 응급 신호**입니다. 머리를 벽에 대고 있는 것과 동시에 초점이 없는 눈동자, 제자리를 빙글빙글 도는 선회 행동(Pacing), 몸의 중심을 잡지 못하고 쓰러지거나 발을 떠는 발작 증상이 동반된다면 1분 1초가 급한 상황이므로 즉시 대형 동물병원 응급실로 가야 합니다."
    },
    "en": {
        "physical": "This is a very serious neurological symptom, not play. It indicates brain diseases like tumors, encephalitis, or head trauma. It can also be 'hepatic encephalopathy' (ammonia poisoning the brain due to liver failure) or toxicity from lead or drugs.",
        "psychological": "This behavior is a compulsive, instinctual pain-relief action caused by neurological damage and pressure in the cerebrum. Simple anxiety, boredom, or loneliness do not cause a dog to forcefully press their head against walls.",
        "homecare": "Immediately record a video for at least 10 seconds. This video is the best diagnostic clue for the vet. Remove sharp objects nearby and protect their head with a soft cushion to prevent secondary injuries, then go to the vet immediately.",
        "redflag": "This behavior itself is a **severe emergency flag**. If accompanied by unfocused eyes, pacing in circles, inability to balance, collapsing, or seizures, every second counts. Head straight to a large emergency veterinary hospital."
    }
  },
  {
    "id": 9,
    "titleKo": "귀를 자주 털거나 뒷발로 격렬하게 긁을 때",
    "titleEn": "Shaking Head or Scratching Ears Vigorously",
    "ko": {
        "physical": "외이도염, 중이염 등 귀 내부의 세균성·곰팡이성 감염이 가장 흔한 원인입니다. 특히 목욕 후 귓속 물기를 제대로 말리지 않았을 때 잘 생깁니다. 또는 귀 진드기 같은 외부 기생충의 감염이거나, 특정 음식이나 환경(진드기, 먼지)에 반응하는 알레르기성 피부염의 신호일 수 있습니다.",
        "psychological": "지루함, 고립감, 스트레스를 심하게 느낄 때 자신의 몸 특정 부위를 과도하게 긁거나 터는 강박 행동으로 발전할 수 있습니다. 특히 스트레스를 받으면 체내 히스타민 분비가 촉진되어 실제로 피부 가려움증이 유발되기도 하므로, 환경적 불만이 가려움증을 악화시킬 수 있습니다.",
        "homecare": "귀 안쪽을 살짝 뒤집어 내부가 붉게 부어올랐거나 갈색/검은색 귀지가 많고 냄새가 나는지 확인하세요. 가벼운 증상이라면 자극이 적은 귀 세정제를 사용하여 부드럽게 닦아주고 물기를 완벽히 말려주세요. 발톱으로 귀를 파서 상처가 나지 않도록 발톱을 짧게 정리해 주는 것도 중요합니다.",
        "redflag": "귀 주변을 만지려고 할 때 으르렁거리며 심한 통증을 호소하는 경우, 귀 안쪽이 퉁퉁 부어 구멍이 막혀 보일 정도이거나 샛노란 고름 및 피가 섞여 나오는 경우, 고개가 한쪽으로 기우는 사경 증상이 보인다면 염증이 고막 안쪽까지 진행된 것이므로 즉시 전문 치료가 필요합니다."
    },
    "en": {
        "physical": "Bacterial or fungal infections like otitis externa/media are the most common causes, often triggered by incomplete drying after a bath. It can also be ear mites (parasites) or an allergic skin reaction to certain foods or environmental factors (dust mites).",
        "psychological": "Severe boredom, isolation, or stress can develop into compulsive scratching or shaking. Stress also promotes histamine release, literally causing itchy skin, meaning environmental dissatisfaction can worsen the itching.",
        "homecare": "Gently flip the ear to check for redness, swelling, or excessive brown/black foul-smelling wax. For mild symptoms, use a gentle ear cleaner and dry completely. Keep their hind claws trimmed short to prevent self-inflicted scratches inside the ear.",
        "redflag": "If they growl in severe pain when the ear is touched, if the ear canal is swollen shut, if there is bright yellow pus or blood, or if the head tilts to one side, the infection has reached the inner ear and requires immediate professional treatment."
    }
  },
  {
    "id": 10,
    "titleKo": "소변을 볼 때 낑낑거리거나 자주 마려워할 때",
    "titleEn": "Whining While Urinating or Frequent Urination",
    "ko": {
        "physical": "방광염이나 요로 결석(신장, 방광, 요도 결석)이 발생했을 때 나타나는 전형적인 증상입니다. 결석이나 염증이 요도를 자극해 소변이 조금만 차도 극심한 뇨의와 통증을 느끼게 됩니다. 수컷 반려견의 경우 전립선 비대증이나 전립선염 등 전립선 질환이 원인인 경우도 많습니다.",
        "psychological": "이사를 가거나 배변 패드의 위치가 바뀌었을 때, 혹은 배변 실수로 인해 호되게 혼난 기억이 있을 때 심리적 위축으로 소변을 시원하게 보지 못하고 찔끔거릴 수 있습니다. 긴장감이 높은 상태에서는 방광 근육이 수축하여 자주 마려운 증상이 심리적으로 유발될 수 있습니다.",
        "homecare": "배변 패드에 묻은 소변의 색깔을 주의 깊게 관찰하고 깨끗한 종이 종이컵에 소변을 조금 받아 이물질이나 모래 같은 결석 가루가 있는지 확인해 보세요. 방광 내 노폐물 배출을 돕기 위해 음수량을 평소보다 늘려주시고, 배변 공간을 가장 편안하고 조용한 장소에 마련해 줍니다.",
        "redflag": "소변 색깔이 붉거나 핑크빛을 띠는 혈뇨 증상, 소변을 보려고 10분 이상 자세를 잡고 힘을 주는데도 소변이 단 한 방울도 나오지 않는 경우(요도 폐색)는 체내 독소가 쌓여 급성 신부전으로 이어져 24시간 내에 생명이 위험해질 수 있는 최고조의 응급 상황이므로 즉시 내원해야 합니다."
    },
    "en": {
        "physical": "This is a classic sign of cystitis or urinary stones (kidney, bladder, urethral). Stones or inflammation irritate the urethra, causing severe urgency and pain even with minimal urine. In male dogs, prostate issues like hyperplasia or prostatitis are also common causes.",
        "psychological": "Psychological intimidation from moving, changed pee pad locations, or being severely scolded for accidents can cause them to pee in dribbles. High tension contracts the bladder muscles, psychologically inducing frequent urination.",
        "homecare": "Carefully observe the urine color on the pad, and collect a sample in a clean paper cup to check for debris or sand-like stone particles. Increase their water intake to help flush out waste, and ensure their potty area is in the most comfortable, quiet spot.",
        "redflag": "If the urine is red or pink (hematuria), or if they strain in position for over 10 minutes without passing a single drop (urethral obstruction), toxins will build up rapidly. This leads to acute kidney failure and is a top-tier emergency requiring immediate vet care to prevent death within 24 hours."
    }
  }
];

// Apply updates
updates.forEach(update => {
  const index = data.findIndex(item => item.id === update.id);
  if (index !== -1) {
    data[index] = update;
  }
});

fs.writeFileSync('diagnostics_data.json', JSON.stringify(data, null, 4), 'utf8');
console.log('Updated diagnostics_data.json successfully.');
