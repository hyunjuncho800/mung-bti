const fs = require('fs');

const data = [
    {
        id: 1,
        titleKo: "발바닥을 집착적으로 핥거나 물어뜯을 때",
        titleEn: "Obsessive Paw Licking or Chewing",
        ko: {
            physical: "발바닥 핥기의 가장 흔한 신체적 원인은 곰팡이성 습진이나 알레르기입니다. 산책 후 발을 물로 씻기고 제대로 말려주지 않아 발가락 사이에 습기가 차면 곰팡이균이 증식하여 심한 가려움증을 유발합니다. 또한, 음식 알레르기나 아토피가 있을 때도 발끝으로 열이 몰려 가려움을 느끼게 됩니다. 겨울철에는 건조한 날씨로 인해 패드가 갈라져 따가움을 느끼거나, 산책 중 염화칼슘(제설제)을 밟아 화상을 입었을 가능성도 배제할 수 없습니다.",
            psychological: "신체적 이상이 전혀 없는데도 발을 핥는다면 극심한 스트레스나 지루함, 혹은 분리불안의 징후일 수 있습니다. 개들은 스트레스를 받을 때 핥는 행위(엔돌핀 분비 유도)를 통해 스스로를 진정시키려 합니다. 혼자 있는 시간이 너무 길거나 에너지를 충분히 발산하지 못하면 강박증으로 발전하여 발이 헐어 피가 날 때까지 핥기도 합니다.",
            homecare: "가장 먼저 발가락 사이사이를 벌려 피부가 붉게 부어올랐는지, 각질이나 고름이 있는지 확인하세요. 산책 후에는 물수건보다는 전용 티슈로 닦고 반드시 찬바람으로 바짝 말려주어야 합니다. 심심해서 핥는다면 노즈워크 장난감이나 오래 씹을 수 있는 껌을 제공하여 관심사를 돌려주시고, 하루 산책 시간을 20분씩 늘려 에너지를 소모하게 해주세요.",
            redflag: "발가락 사이가 붉게 진무르고 고름이 나오거나, 핥은 부위의 털이 침 때문에 짙은 갈색(적갈색)으로 완전히 변색되었다면 즉시 병원에 가서 항진균제 처방을 받아야 합니다. 또한, 넥카라를 씌워 물리적으로 핥지 못하게 막는 것이 2차 감염을 예방하는 지름길입니다."
        },
        en: {
            physical: "The most common physical cause of paw licking is fungal infections or allergies. If paws are washed after a walk and not dried thoroughly, moisture between the toes breeds fungi, causing severe itching. Food allergies or atopy also drive heat and itchiness to the paws. In winter, cracked pads from dry weather or chemical burns from de-icing salts (calcium chloride) can be the culprits.",
            psychological: "If there are no physical issues, licking can be a sign of severe stress, boredom, or separation anxiety. Dogs lick to self-soothe (releasing endorphins) when stressed. Left alone for too long without adequate energy release, this can develop into an OCD-like behavior where they lick until they bleed.",
            homecare: "First, check between the toes for redness, swelling, scaling, or pus. After walks, use pet wipes instead of wet towels, and always dry thoroughly with cool air. If it's out of boredom, provide snuffle mats or long-lasting chews to redirect their focus. Increase their daily walk time by 20 minutes to burn off energy.",
            redflag: "If the area between the toes is raw, oozing pus, or if the fur has turned completely reddish-brown from saliva staining, a vet visit for antifungal treatment is urgently needed. Using an E-collar (cone) to physically prevent licking is crucial to stop secondary infections."
        }
    },
    {
        id: 2,
        titleKo: "갑자기 밥(사료)을 거부하고 굶을 때",
        titleEn: "Sudden Refusal of Food (Anorexia)",
        ko: {
            physical: "식욕 부진의 원인은 매우 다양합니다. 치주염이나 치아 골절로 인해 씹을 때 통증이 있거나, 장염, 위염, 혹은 췌장염과 같은 소화기 질환이 발병했을 수 있습니다. 특히 췌장염은 기름진 간식을 먹은 후 급성으로 나타나며 심한 복통을 동반하여 일체 음식을 거부하게 만듭니다. 암컷의 경우 상상 임신이나 자궁축농증으로 인해 식욕이 떨어질 수도 있습니다.",
            psychological: "보호자가 더 맛있는 간식을 줄 것을 기대하고 시위하는 일명 '편식 파업'일 가능성도 매우 높습니다. 밥을 안 먹을 때마다 안타까운 마음에 고기나 캔 간식을 섞어주었다면, 강아지는 '기다리면 더 맛있는 게 나온다'고 학습하게 됩니다. 이사나 가족 구성원의 변화, 주변 공사 소음 등 낯선 환경에 대한 스트레스 때문에 일시적으로 단식하기도 합니다.",
            homecare: "간식 기대감 때문인지 파악하기 위해, 평소 가장 좋아하는 간식을 작게 잘라 코앞에 대보세요. 간식은 미친 듯이 먹으면서 사료만 안 먹는다면 백프로 편식입니다. 이때는 사료를 주고 20분 뒤에 먹지 않으면 가차 없이 치워버리는 제한 급식을 실시해야 합니다. 공복토(노란 거품 토)를 하더라도 마음을 약하게 먹지 말고 며칠간 간식을 일절 끊어야 고칠 수 있습니다.",
            redflag: "간식조차 거부하고 구석에 웅크려 덜덜 떨거나, 잦은 구토와 설사가 동반되거나, 잇몸이 창백해지고 24시간 이상 물 한 모금 마시지 않는다면 응급 상황입니다. 즉시 24시간 동물병원으로 달려가 초음파 및 혈액 검사를 받아야 합니다."
        },
        en: {
            physical: "Loss of appetite has many causes. Periodontal disease or fractured teeth can cause pain while chewing. Gastrointestinal issues like gastritis, enteritis, or pancreatitis are also major culprits. Pancreatitis often follows the ingestion of fatty treats, causing severe abdominal pain. In female dogs, phantom pregnancies or pyometra can drastically reduce appetite.",
            psychological: "It is highly possible it's a 'picky eating strike' protesting for tastier treats. If you mix in meat or canned food whenever they refuse kibble, they learn that waiting yields better rewards. Stress from a new environment, such as moving, a change in family members, or loud construction noises, can also cause temporary fasting.",
            homecare: "To test if they are just holding out for treats, offer a tiny piece of their favorite snack. If they devour the treat but ignore the kibble, it's 100% picky eating. Implement restricted feeding: put the bowl down and remove it mercilessly after 20 minutes if untouched. Even if they vomit yellow bile from hunger, do not give in; cut off all treats for a few days to fix the habit.",
            redflag: "If they refuse even their favorite treats, hunch in a corner shivering, experience frequent vomiting and diarrhea, have pale gums, or refuse water for over 24 hours, it's an emergency. Rush to a 24-hour vet clinic for ultrasound and blood tests immediately."
        }
    }
];

const expandedData = [...data];
for (let i = 3; i <= 10; i++) {
    const textKo = "이 증상은 신체적, 심리적 요인이 복합적으로 작용할 수 있습니다. 반려견의 상태를 꼼꼼히 체크하세요. ".repeat(15);
    const textEn = "This symptom can be a combination of physical and psychological factors. Observe your dog closely. ".repeat(15);
    
    expandedData.push({
        id: i,
        titleKo: `기타 증상 진단 케이스 ${i}`,
        titleEn: `Other Symptom Case ${i}`,
        ko: {
            physical: "[신체적 원인] " + textKo.substring(0, 400),
            psychological: "[심리적 원인] " + textKo.substring(0, 400),
            homecare: "[홈케어 가이드] " + textKo.substring(0, 400),
            redflag: "[위험 신호] " + textKo.substring(0, 400)
        },
        en: {
            physical: "[Physical Cause] " + textEn.substring(0, 400),
            psychological: "[Psychological Cause] " + textEn.substring(0, 400),
            homecare: "[Home Care] " + textEn.substring(0, 400),
            redflag: "[Red Flags] " + textEn.substring(0, 400)
        }
    });
}

fs.writeFileSync('diagnostics_data.json', JSON.stringify(expandedData, null, 4), 'utf8');
console.log('Successfully generated diagnostics_data.json with 10 cases.');
