const fs = require('fs');

const diagnosticsUpdates = {
    3: {
        "titleKo": "엉덩이를 바닥에 대고 끄는 행동을 할 때 (똥스키)",
        "titleEn": "Dragging Bottom on the Floor (Scooting)",
        "ko": {
            "physical": "가장 흔한 원인은 항문 주위에 있는 항문낭에 분비물이 가득 차서 가려움이나 통증을 느끼는 것입니다. 혹은 항문낭에 염증이 생겼거나, 기생충 감염, 사료나 간식으로 인한 알레르기성 피부염이 원인일 수 있습니다. 최근 미용 후 항문 주변 피부가 자극을 받아 가려워하는 경우도 종종 발생합니다.",
            "psychological": "신체적 이상이 전혀 없음에도 불구하고 이런 행동을 한다면, 바닥에 엉덩이를 비비는 행동 자체가 일종의 놀이나 습관으로 굳어졌을 가능성이 있습니다. 또한, 보호자의 관심을 끌기 위한 행동일 수도 있습니다.",
            "homecare": "가장 먼저 항문낭을 부드럽게 짜주어 분비물을 배출시켜 주세요. 한 달에 1~2회 목욕 시 정기적으로 짜주는 것이 좋습니다. 구충제 복용 시기가 지났다면 구충제를 먹이시고, 엉덩이 주변 피부가 붉게 달아올랐는지 확인 후 진정 보습제를 발라주세요.",
            "redflag": "항문 주위가 심하게 부어오르거나 붉고, 피나 고름이 묻어난다면 항문낭 파열이나 심각한 염증일 수 있습니다. 이 경우 절대 집에서 짜려고 하지 말고 즉시 동물병원에 방문하여 치료를 받아야 합니다."
        },
        "en": {
            "physical": "The most common cause is full anal glands, which cause itching or discomfort. Other physical reasons include anal gland infection, intestinal parasites, or food-related allergic dermatitis. Sometimes, dogs scoot because the skin around the anus was irritated during a recent grooming session.",
            "psychological": "If there are no physical issues, scooting might have become a playful habit. In some cases, dogs learn that this behavior gets their owner's attention, leading them to do it whenever they want you to look at them.",
            "homecare": "First, try gently expressing the anal glands to release the fluid. It's recommended to do this once or twice a month during bath time. Ensure your dog is up-to-date on deworming medication. Check the skin around the anus for redness and apply a pet-safe soothing balm if it's mildly irritated.",
            "redflag": "If the anal area is severely swollen, bright red, or if you see blood or pus, it could indicate an anal gland rupture or severe infection. Do not attempt to express the glands yourself; visit a veterinarian immediately for professional treatment."
        }
    },
    4: {
        "titleKo": "자신의 꼬리를 미친 듯이 쫓아 빙글빙글 돌 때",
        "titleEn": "Chasing Their Own Tail Madly (Spinning)",
        "ko": {
            "physical": "벼룩이나 진드기 같은 외부 기생충 감염, 혹은 항문낭염으로 인해 엉덩이나 꼬리 부위가 가려워서 쫓는 행동일 수 있습니다. 드물게는 척추나 꼬리뼈 주변의 신경계 이상이나 통증이 원인일 수 있습니다.",
            "psychological": "극심한 스트레스나 무료함이 가장 큰 원인입니다. 운동량이 부족하거나 혼자 있는 시간이 길어질 때, 꼬리를 장난감 삼아 노는 행동이 강박증으로 발전한 경우가 많습니다. 좁은 공간에 갇혀 있을 때 흔히 나타나는 정형행동(강박행동) 중 하나입니다.",
            "homecare": "꼬리를 쫓는 행동을 보일 때 보호자가 웃거나 반응해주면 칭찬으로 오해할 수 있으므로 무관심으로 일관하세요. 대신 산책 시간을 30분 이상 늘려 에너지를 충분히 소비하게 하고, 노즈워크나 터그 놀이로 관심을 다른 곳으로 분산시켜야 합니다.",
            "redflag": "꼬리를 물어뜯어 상처가 나고 털이 빠질 때까지 멈추지 않거나, 이름을 불러도 전혀 반응하지 않고 빙글빙글 도는 것에만 집착한다면, 심각한 강박장애(OCD)나 신경계 질환일 수 있으므로 수의사 및 행동교정 전문가의 상담이 필수입니다."
        },
        "en": {
            "physical": "This can be caused by external parasites like fleas or ticks, or anal gland issues causing severe itching around the hindquarters. Rarely, it could indicate neurological issues or pain around the spine or tailbone.",
            "psychological": "Severe stress, boredom, or confinement are the primary culprits. When dogs lack exercise or spend too much time alone, chasing their tail starts as play and can evolve into a compulsive behavior. It's a common stereotypic behavior in dogs lacking mental stimulation.",
            "homecare": "Do not laugh or react when your dog chases its tail, as they might interpret this as praise or attention. Ignore the behavior and instead increase their daily walk time by at least 30 minutes. Use nosework or tug toys to redirect their focus and burn off mental energy.",
            "redflag": "If your dog bites its tail to the point of bleeding or hair loss, or if they obsessively spin and cannot be interrupted even when called, it could indicate Canine Compulsive Disorder (CCD) or a neurological condition requiring immediate veterinary and behavioral intervention."
        }
    },
    5: {
        "titleKo": "보호자가 외출할 때 심하게 짖고 물건을 부술 때",
        "titleEn": "Barking and Destroying Items When Owner Leaves",
        "ko": {
            "physical": "이 증상은 신체적인 질병보다는 호르몬 불균형이나 뇌 신경 전달 물질의 문제로 인해 불안감을 조절하지 못하는 상태일 가능성이 있습니다. 특히 노령견의 경우 인지기능장애(강아지 치매)로 인해 갑작스러운 불안 증세를 보일 수 있습니다.",
            "psychological": "전형적인 '분리불안(Separation Anxiety)' 증상입니다. 보호자와 떨어지는 것에 대한 극도의 공포와 패닉 상태를 느끼며, 이를 해소하기 위해 문을 긁거나 물건을 물어뜯고, 하울링을 하는 등의 파괴적이고 시끄러운 행동을 보입니다.",
            "homecare": "외출 30분 전부터는 반려견과 시선을 맞추거나 인사하지 마세요. 외출 전 충분한 산책으로 체력을 소진시키고, 오래 먹을 수 있는 간식(콩 장난감 등)을 제공하여 보호자가 나가는 상황을 긍정적으로 인식하게 만들어야 합니다. 1분, 5분씩 짧게 외출했다 돌아오는 둔감화 훈련을 반복하세요.",
            "redflag": "보호자가 없는 동안 계속해서 침을 심하게 흘려 입 주변과 앞가슴이 흠뻑 젖어 있거나, 피가 날 정도로 문이나 창문을 긁고 자해하는 행동을 보인다면, 약물 치료가 병행되어야 하는 중증 분리불안이므로 수의사의 처방이 시급합니다."
        },
        "en": {
            "physical": "Rather than a physical disease, this is often related to a chemical imbalance in the brain making the dog unable to regulate anxiety. In senior dogs, sudden onset of this behavior can be a sign of Canine Cognitive Dysfunction (dog dementia).",
            "psychological": "This is textbook 'Separation Anxiety.' The dog experiences extreme panic and fear of being separated from the owner. To cope with this overwhelming stress, they resort to destructive behaviors like chewing furniture, scratching doors, or excessive howling and barking.",
            "homecare": "Avoid making eye contact or saying emotional goodbyes 30 minutes before leaving. Exhaust your dog with a long walk before departure, and leave them with a high-value, long-lasting treat (like a stuffed KONG) to create positive associations with your absence. Practice desensitization by leaving for just 1 minute, then 5 minutes, gradually increasing the time.",
            "redflag": "If the dog drools so heavily that their chest is soaked, or if they scratch doors/windows until their paws bleed (self-harm), this is severe separation anxiety. Behavioral modification alone won't work at this stage; urgent veterinary intervention for anti-anxiety medication is required."
        }
    },
    6: {
        "titleKo": "평소 잘 가리던 배변을 갑자기 아무 데나 할 때",
        "titleEn": "Sudden Loss of House Training (Incontinence/Accidents)",
        "ko": {
            "physical": "방광염, 요도염, 결석 등 비뇨기계 질환으로 인해 소변을 참지 못하는 경우가 가장 많습니다. 또한 당뇨병이나 쿠싱증후군으로 인해 물을 많이 마시고 소변량이 늘어났거나, 노령견의 경우 괄약근 약화나 인지기능장애(치매)가 원인일 수 있습니다.",
            "psychological": "이사나 가구 배치 변경, 새로운 가족(아기, 다른 반려동물)의 등장으로 인한 스트레스가 원인일 수 있습니다. 불안감이나 불만을 표현하기 위한 마킹(영역 표시) 행동일 수도 있으며, 배변 패드 주변에서 크게 놀란 기억(트라우마)이 있을 때도 패드를 거부합니다.",
            "homecare": "혼내거나 코를 박게 하는 체벌은 절대 금물입니다. 불안감을 가중시켜 몰래 숨어서 배변하게 만듭니다. 배변 패드를 평소보다 더 크고 여러 장 깔아주시고, 패드에 제대로 배변했을 때 폭풍 칭찬과 함께 즉각적으로 간식 보상을 해주어 긍정적인 기억을 다시 심어주세요.",
            "redflag": "소변에 피가 섞여 나오거나(혈뇨), 소변을 볼 때 낑낑거리며 고통스러워하는 경우, 혹은 물을 마시는 양이 평소보다 2배 이상 급증했다면 심각한 내과 질환의 신호이므로 지체 없이 동물병원에서 소변 검사와 혈액 검사를 받아야 합니다."
        },
        "en": {
            "physical": "Urinary tract infections (UTIs), cystitis, or bladder stones are the most common reasons a dog can't hold their urine. Conditions like diabetes or Cushing's disease cause excessive drinking and urination. In seniors, weakened sphincter muscles or cognitive dysfunction (dementia) can be the cause.",
            "psychological": "Stress from environmental changes (moving, rearranging furniture, or a new baby/pet) can trigger this. It could also be territory marking driven by anxiety or dissatisfaction. If a dog had a scary experience near their pee pad, they might associate the pad with trauma and avoid it.",
            "homecare": "Never scold or rub their nose in the mess; this only increases anxiety and teaches them to hide their accidents. Place larger and more numerous pee pads around the house. When they use the pad correctly, immediately shower them with praise and a high-value treat to rebuild positive reinforcement.",
            "redflag": "If there is blood in the urine (hematuria), if the dog whines or strains in pain while urinating, or if their water consumption has suddenly doubled, these are major red flags for severe internal diseases. Immediate veterinary blood and urine tests are required."
        }
    },
    7: {
        "titleKo": "노란색 거품 토(공복토)를 자주 할 때",
        "titleEn": "Vomiting Yellow Foam (Bilious Vomiting)",
        "ko": {
            "physical": "위장이 오랜 시간 비어 있을 때 담즙(위액)이 위 점막을 자극하여 발생하는 전형적인 '공복토'입니다. 식사 간격이 너무 길거나, 위산이 과다 분비되었을 때 흔하게 나타납니다. 간혹 위염이나 췌장염 등 소화기 질환의 초기 증상일 수도 있습니다.",
            "psychological": "새로운 환경, 분리불안, 낯선 소음 등으로 인한 극심한 스트레스가 위장 운동을 저하시키고 위산 분비를 촉진시켜 구토를 유발할 수 있습니다. 예민한 강아지일수록 스트레스성 위장 장애를 겪기 쉽습니다.",
            "homecare": "사료 급여 횟수를 늘려 식사 간격을 줄여주는 것이 핵심입니다. 하루 급여량을 유지하되 아침, 점심, 저녁, 자기 전 4번으로 나누어 급여해 보세요. 특히 자기 직전이나 이른 아침에 소량의 사료를 주면 공복토 예방에 매우 효과적입니다.",
            "redflag": "노란 토를 하루 3회 이상 반복하거나, 구토 후 식욕이 완전히 사라져 사료를 거부하고 무기력해진다면 주의해야 합니다. 특히 토사물에 붉은 피가 섞여 있거나 설사를 동반한다면 파보바이러스나 췌장염 등 치명적인 질병일 수 있으므로 응급 내원해야 합니다."
        },
        "en": {
            "physical": "This is classic 'bilious vomiting syndrome,' which occurs when the stomach is empty for too long, allowing bile to irritate the stomach lining. It happens when meal intervals are too long or stomach acid is overproduced. Occasionally, it's an early sign of gastritis or pancreatitis.",
            "psychological": "Extreme stress from a new environment, separation anxiety, or loud noises can slow down gastrointestinal motility and stimulate excess stomach acid, leading to vomiting. Sensitive dogs are particularly prone to stress-induced gastrointestinal upset.",
            "homecare": "The key is to shorten the time between meals by increasing the feeding frequency. Maintain the same daily caloric intake but divide it into 4 meals (morning, afternoon, evening, and right before bed). A small snack right before bedtime is highly effective in preventing morning empty-stomach vomiting.",
            "redflag": "If the dog vomits yellow foam more than 3 times a day, or if they completely lose their appetite and become lethargic after vomiting, take action. If the vomit contains blood or is accompanied by severe diarrhea, it could be a life-threatening illness like Parvovirus or pancreatitis, requiring emergency veterinary care."
        }
    },
    8: {
        "titleKo": "허공을 향해 이빨을 딱딱거리며 파리를 잡는 듯한 행동",
        "titleEn": "Snapping at Invisible Flies in the Air (Fly-Snapping)",
        "ko": {
            "physical": "눈에 보이지 않는 파리를 잡는 듯한 이 행동(Fly-Snapping)은 단순한 장난이 아닐 수 있습니다. 시력 저하나 초자체 혼탁(비문증)으로 인해 눈앞에 이물질이 떠다니는 것처럼 느껴서 일어날 수 있으며, 흔하게는 부분 발작(뇌전증)과 같은 신경계 이상 질환이 원인일 수 있습니다.",
            "psychological": "심한 스트레스나 빛, 그림자에 대한 강박증이 원인일 수 있습니다. 빛이 반사되는 것에 지나치게 예민하게 반응하거나, 지루함을 해소하기 위해 만들어낸 자신만의 이상 행동 패턴일 가능성도 존재합니다.",
            "homecare": "강아지가 이 행동을 할 때 이름을 불러서 시선을 환기시킬 수 있는지 확인하세요. 시선 환기가 된다면 스트레스나 지루함이 원인일 수 있으므로, 산책과 노즈워크를 늘려주세요. 강한 손전등이나 레이저 포인터 놀이는 강박증을 악화시키므로 절대 피해야 합니다.",
            "redflag": "큰 소리로 이름을 부르거나 간식을 코앞에 대주어도 행동을 멈추지 않고 허공에 이빨을 딱딱거린다면, 이는 뇌 신경계의 부분 발작(Seizure)일 확률이 매우 높습니다. 이 경우 행동을 촬영한 후 즉시 신경과 진료가 가능한 동물병원을 찾아가세요."
        },
        "en": {
            "physical": "This behavior, known as 'Fly-Snapping,' is rarely just a game. It can be caused by vision issues like 'floaters' in the eye, making the dog think there's a bug. More commonly, it is a symptom of a neurological disorder, specifically a type of focal seizure (epilepsy) or gastrointestinal discomfort.",
            "psychological": "It can be triggered by severe stress or an OCD-like compulsion related to light and shadows. The dog might be overly sensitive to light reflections or have developed this bizarre behavior pattern as a coping mechanism for extreme boredom.",
            "homecare": "Check if you can snap them out of it by calling their name or offering a treat. If they easily snap out of it, it might be boredom or mild OCD; increase their mental and physical enrichment. Never use laser pointers for play, as this heavily exacerbates light-chasing compulsions.",
            "redflag": "If the dog is completely unresponsive to their name or a treat held to their nose and continues snapping at the air, it is highly likely a neurological focal seizure. Record the behavior on video and seek immediate veterinary neurological evaluation."
        }
    },
    9: {
        "titleKo": "자기 발이나 다리를 계속해서 잘근잘근 씹을 때",
        "titleEn": "Chewing Obsessively on Their Own Paws or Legs",
        "ko": {
            "physical": "발바닥 핥기와 비슷하지만 '씹는' 행동은 통증과 연관이 깊습니다. 관절염, 슬개골 탈구 등으로 인한 내부의 깊은 통증을 해소하기 위해 그 부위를 씹는 경우가 많습니다. 또는 알레르기성 피부염이나 진드기 감염으로 극심한 가려움을 참지 못해 살점을 씹기도 합니다.",
            "psychological": "만성적인 스트레스, 애정 결핍, 심한 무료함이 원인입니다. 특히 앞다리의 한 부분만 집중적으로 핥고 씹어 털이 빠지고 굳은살이 박이는 '말단 육아종(Acral Lick Granuloma)'은 강박장애의 대표적인 증상으로, 마음의 병이 신체적 손상으로 이어진 케이스입니다.",
            "homecare": "다리를 만졌을 때 흠칫 놀라거나 피한다면 관절 통증일 수 있으므로 무리한 산책이나 점프를 금지하세요. 씹는 행동을 물리적으로 막기 위해 넥카라를 씌우고, 강박행동이라면 하루 종일 핥을 수 있는 릭매트(Lick mat)에 습식 사료를 발라 얼려 제공하여 시선을 분산시켜 주세요.",
            "redflag": "피부가 벗겨져 피가 나고, 뼈가 드러날 정도로 심하게 자기 다리를 씹어 먹는 자해 행동을 보인다면 응급 상황입니다. 이는 단순한 가려움이 아닌 극심한 신경통이나 고도 강박증이므로, 넥카라를 씌운 채 즉각 수의사의 정밀 검사와 처방을 받아야 합니다."
        },
        "en": {
            "physical": "While licking is usually about itching, 'chewing' is strongly linked to pain. Dogs often chew the skin over a joint that hurts due to arthritis, patellar luxation, or bone issues to relieve deep-seated pain. It can also be a desperate response to extreme allergic itching or tick bites.",
            "psychological": "Chronic stress, lack of affection, or severe boredom are major psychological triggers. Obsessively licking and chewing one specific spot on the front leg until it creates a thick, hairless sore is known as 'Acral Lick Granuloma'—a prime example of a psychological compulsion causing severe physical harm.",
            "homecare": "If the dog flinches or pulls away when you touch the leg, suspect joint pain and restrict jumping and rigorous exercise. Use a cone (E-collar) to physically break the cycle of self-trauma. To satisfy the urge to lick/chew, provide a frozen 'Lick mat' smeared with wet food to safely redirect their focus.",
            "redflag": "If the chewing escalates to severe self-mutilation where the skin is torn, bleeding profusely, or deep tissue/bone is exposed, it is a medical emergency. This indicates agonizing nerve pain or severe OCD. Apply a cone immediately and rush to a veterinary hospital."
        }
    },
    10: {
        "titleKo": "보호자가 만지려고 할 때 갑자기 몸을 굳히고 으르렁거릴 때",
        "titleEn": "Stiffening and Growling When Touched",
        "ko": {
            "physical": "평소 스킨십을 좋아하던 아이가 갑자기 이런다면 100% 신체적 통증 때문입니다. 디스크(추간판 탈출증), 슬개골 탈구, 귀 염증, 혹은 복부의 심한 통증으로 인해 방어 본능이 발동하여 '나를 만지면 아프니까 다가오지 마!'라고 경고하는 것입니다.",
            "psychological": "자신의 영역(침대, 방석)이나 소중한 자원(음식, 장난감)을 지키려는 '자원 수비(Resource Guarding)' 성향입니다. 혹은 과거 사람의 손길에 심하게 맞았거나 강압적인 제압을 당했던 트라우마가 있어, 사람의 손이 다가오는 것 자체에 극도의 공포를 느끼는 상태일 수 있습니다.",
            "homecare": "강아지가 으르렁거릴 때는 절대 무리해서 만지거나 힘으로 제압하려 하지 마세요. 물릴 위험이 높습니다. 강아지가 안정감을 느끼는 거리를 유지한 채, 맛있는 간식을 바닥에 던져주며 '내 손은 안전하고 좋은 것을 주는 손'이라는 인식을 아주 천천히 다시 심어주어야 합니다.",
            "redflag": "아무런 전조 증상(입술 핥기, 하품, 귀 젖히기 등) 없이 손을 대자마자 맹렬하게 물어버리거나(Bite), 등이 굽은 채로 부들부들 떨며 만지지도 못하게 한다면 급성 디스크 터짐이나 췌장염 등 끔찍한 고통을 겪고 있는 중일 수 있으므로 수건으로 감싸 안고 즉시 응급실로 가야 합니다."
        },
        "en": {
            "physical": "If a normally cuddly dog suddenly stiffens and growls, it is almost certainly due to acute pain. Spinal disc issues (IVDD), patellar luxation, severe ear infections, or abdominal pain trigger their defense mechanism. The growl is a warning: 'Don't touch me, I'm hurting!'",
            "psychological": "This can be 'Resource Guarding,' where the dog is protecting their valued space (bed) or items (food/toys). Alternatively, it could be trauma-based; if a dog was hit or handled roughly in the past, a reaching hand triggers intense fear and a 'fight or flight' response.",
            "homecare": "Never force physical contact, punish the growl, or try to 'dominate' the dog when they do this—you will likely get bitten. Respect their warning and give them space. Slowly rebuild trust by tossing high-value treats near them without touching, teaching them that a reaching hand means good things, not threats.",
            "redflag": "If the dog bites fiercely without any prior warning signs (like lip licking or whale eye), or if they stand with a hunched back, trembling violently and refusing to move, they might be experiencing excruciating pain like a ruptured spinal disc or acute pancreatitis. Carefully wrap them in a blanket and rush to the vet."
        }
    }
};

const data = JSON.parse(fs.readFileSync('diagnostics_data.json', 'utf8'));

data.forEach(item => {
    if (diagnosticsUpdates[item.id]) {
        item.titleKo = diagnosticsUpdates[item.id].titleKo;
        item.titleEn = diagnosticsUpdates[item.id].titleEn;
        item.ko = diagnosticsUpdates[item.id].ko;
        item.en = diagnosticsUpdates[item.id].en;
        // Keep the buttonType intact since we already set it
    }
});

fs.writeFileSync('diagnostics_data.json', JSON.stringify(data, null, 4), 'utf8');
console.log('Diagnostics 3-10 updated.');
