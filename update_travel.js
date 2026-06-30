const fs = require('fs');

const data = JSON.parse(fs.readFileSync('travel_data.json', 'utf8'));

const updates = [
  {
    "id": 3,
    "titleKo": "반려견 동반 여행 필수 준비물 체크리스트 및 짐 싸기 팁",
    "titleEn": "Essential Packing List and Tips for Traveling with Dogs",
    "ko": {
        "content": "사료와 간식은 평소 먹던 것으로 일수보다 넉넉히 챙기고, 이동장(크레이트), 배변 패드, 매너 벨트, 평소 쓰던 담요나 장난감을 챙겨 낯선 곳에서의 불안감을 줄여주세요. 동물등록증과 예방접종 증명서 사진을 폰에 저장해두면 비상 시 유용합니다."
    },
    "en": {
        "content": "Pack their usual food and treats with plenty of extras. Bring a carrier (crate), pee pads, belly bands, and familiar blankets or toys to reduce anxiety in new places. Save photos of their registration and vaccination records on your phone for emergencies."
    }
  },
  {
    "id": 4,
    "titleKo": "KTX, SRT 등 대중교통 이용 시 동반 탑승 규정과 매너",
    "titleEn": "Rules and Etiquette for Public Transit (Trains, Subways)",
    "ko": {
        "content": "대중교통 탑승 시에는 반드시 규격에 맞는 이동장(캐리어)에 반려견의 신체(머리 포함)가 완전히 들어가 있어야 합니다. 이용 전 예방접종 여부를 확인하며, 역내 및 객실 안에서는 이동장 밖으로 꺼내지 않는 것이 원칙입니다. 옆 좌석 승객을 위해 짖음 방지 훈련이나 대형견의 경우 사전 예약 규정을 꼭 체크하세요."
    },
    "en": {
        "content": "When using public transit, your dog must be completely inside a size-compliant carrier (including their head). Check vaccination requirements before use, and never take them out of the carrier inside stations or cabins. Ensure they are trained not to bark for the sake of other passengers, and always check advance reservation rules for large dogs."
    }
  },
  {
    "id": 5,
    "titleKo": "반려견과 함께하는 안전한 캠핑 및 야외 아웃도어 가이드",
    "titleEn": "Safe Camping and Outdoor Guide with Dogs",
    "ko": {
        "content": "자연 속 캠핑장에서는 진드기, 모기 등 외부 기생충 감염 위험이 높으므로 사전 방역이 필수입니다. 텐트 내부의 날카로운 팩이나 화로대의 불씨에 다치지 않도록 안전거리를 유지하고, 밤에는 야간 식별이 가능한 LED 리드줄이나 펜던트를 착용시켜 주세요. 야생동물이나 낯선 소리에 놀라 이탈하지 않도록 리드줄 고정을 철저히 해야 합니다."
    },
    "en": {
        "content": "In nature campsites, pre-travel pest prevention is essential due to high risks of ticks and mosquitoes. Maintain a safe distance from sharp tent pegs or campfire embers. Use LED leashes or pendants at night for visibility. Ensure the leash is firmly secured so they don't bolt when startled by wildlife or strange noises."
    }
  },
  {
    "id": 6,
    "titleKo": "바다 및 계곡 수영 시 안전 수칙과 물놀이 후 케어법",
    "titleEn": "Safety Rules for Beach/Valley Swimming and Post-Swim Care",
    "ko": {
        "content": "강아지도 수영이 처음이라면 구명조끼를 반드시 착용시켜야 하며, 물에 들어가기 전 가벼운 준비 운동과 발부터 물을 적셔주세요. 염분이 있는 바닷물이나 계곡물을 과도하게 마시지 않도록 깨끗한 음수를 자주 급여하고, 물놀이 후에는 피부병 예방을 위해 귓속 물기를 완벽히 말리고 깨끗한 물로 염분과 이물질을 씻겨내야 합니다."
    },
    "en": {
        "content": "If your dog is new to swimming, a life jacket is a must. Do light warm-ups and wet their paws first before entering the water. Frequently offer clean drinking water so they don't drink salty seawater or valley water. After swimming, dry their ears completely to prevent skin diseases, and wash off salt and debris with clean water."
    }
  },
  {
    "id": 7,
    "titleKo": "반려견과 국내선/국제선 비행기 탑승 시 체크포인트",
    "titleEn": "Checkpoints for Domestic/International Flights with Dogs",
    "ko": {
        "content": "항공사마다 기내 동반 탑승이 가능한 반려견의 무게 기준(케이지 포함 통상 7~9kg 이하)과 수하물 위탁 규정이 다릅니다. 출발 최소 2~3시간 전 사료 급여를 마쳐 구토를 예방하고, 기내용 소프트 케이지 규격을 준수하세요. 이용 전 항공사에 반려견 동반 좌석을 유선으로 먼저 확정 예약해야 합니다."
    },
    "en": {
        "content": "Airlines have varying weight limits (usually 7-9kg including the carrier) for in-cabin travel and checked baggage rules. Finish feeding them at least 2-3 hours before departure to prevent vomiting, and adhere to in-cabin soft carrier size rules. Always confirm your pet reservation via phone with the airline before the trip."
    }
  },
  {
    "id": 8,
    "titleKo": "낯선 여행지에서 반려견 잃어버렸을 때 대처 및 예방법",
    "titleEn": "Prevention and Response if You Lose Your Dog on a Trip",
    "ko": {
        "content": "여행지에서는 반려견이 호기심이나 불안감으로 갑자기 뛰어나갈 수 있으므로 외출 시 인식표(보호자 연락처 기재) 착용은 필수입니다. 만약 분실했다면 즉시 인근 지자체 유기동물 보호센터와 포인핸드 앱에 등록하고, 평소 자주 쓰던 담요나 보호자의 옷을 잃어버린 장소 주변에 두면 냄새를 맡고 돌아오는 데 도움이 됩니다."
    },
    "en": {
        "content": "In unfamiliar places, dogs may bolt out of curiosity or anxiety, so wearing an ID tag (with your contact info) is mandatory. If lost, immediately register them with local animal shelters and missing pet apps. Placing their familiar blanket or your worn clothes near the spot where they went missing can help them sniff their way back."
    }
  },
  {
    "id": 9,
    "titleKo": "인생샷 보장! 반려견이 편안해하는 여행 스냅 촬영 팁",
    "titleEn": "Guaranteed Great Shots! Tips for Stress-Free Dog Photos",
    "ko": {
        "content": "억지로 카메라를 보게 하기보다 좋아하는 간식이나 소리 나는 장난감으로 카메라 렌즈 뒤쪽에서 시선을 유도하세요. 강아지의 눈높이에 맞춰 카메라를 낮추는 로우 앵글(Low-Angle)로 촬영하면 훨씬 생동감 있고 다정한 사진을 얻을 수 있습니다. 촬영 중 아이가 지치지 않도록 충분한 휴식과 보상을 주는 것이 핵심입니다."
    },
    "en": {
        "content": "Instead of forcing them to look at the camera, lure their gaze from behind the lens using their favorite treats or squeaky toys. Shoot from a low angle matching their eye level to capture more vivid and affectionate photos. The key is providing plenty of rest and rewards so they don't get exhausted during the shoot."
    }
  },
  {
    "id": 10,
    "titleKo": "여행지 지역 별미 및 휴게소 음식 섭취 시 주의사항",
    "titleEn": "Precautions When Eating Regional Delicacies and Rest Stop Food",
    "ko": {
        "content": "여행 중 들르는 휴게소 음식이나 지역 특산물(포도, 초콜릿, 양파가 들어간 음식 등) 중에는 반려견에게 치명적인 독성이 있는 음식을 무심코 급여할 위험이 있습니다. 사람이 먹는 자극적인 음식을 멀리하고, 여행지 주변의 '반려견 동반 가능 식당'을 미리 파악하여 안전한 반려견 전용 메뉴나 챙겨온 간식을 급여해 주세요."
    },
    "en": {
        "content": "There is a high risk of accidentally feeding dogs toxic foods from rest stops or regional delicacies (like grapes, chocolate, or foods with onions). Keep them away from highly seasoned human food. Research 'dog-friendly restaurants' nearby in advance to safely offer them dog menus or their packed treats."
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

fs.writeFileSync('travel_data.json', JSON.stringify(data, null, 4), 'utf8');
console.log('Updated travel_data.json successfully.');
