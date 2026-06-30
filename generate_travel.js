const fs = require('fs');

const data = [
    {
        id: 1,
        titleKo: "자동차 장거리 탑승 매너 및 멀미 예방 훈련법",
        titleEn: "Car Manners and Motion Sickness Prevention",
        ko: {
            content: `
반려견과 함께 멀리 드라이브나 여행을 떠나는 것은 상상만으로도 즐거운 일입니다. 하지만 차에 타기만 하면 침을 질질 흘리고, 낑낑대며, 심지어 구토를 하는 아이들도 많습니다. 반려견의 자동차 멀미는 사람의 멀미와 원리가 비슷하지만, 심리적인 요인(차에 갇혀 있다는 공포, 동물병원에 갈 때만 탔던 안 좋은 기억 등)이 훨씬 크게 작용합니다.

1. 자동차와 좋은 기억 연결하기 (탈감작 훈련)
처음부터 시동을 켜고 달리면 안 됩니다. 시동이 꺼진 주차된 차 문을 열어두고 차 안에서 가장 좋아하는 간식을 주거나 짧게 터그 놀이를 해주세요. 5분 정도 놀아주고 밖으로 나오는 것을 며칠간 반복합니다. 아이가 차 안을 '재미있는 놀이방'으로 인식하게 하는 것이 첫걸음입니다.

2. 시동 켜고 짧은 주행
차 안에 타는 것을 두려워하지 않는다면, 시동만 켜고 가만히 있어 봅니다. 진동과 엔진 소리에 적응하게 한 뒤, 아파트 단지나 집 근처 골목을 5분 정도만 한 바퀴 돌고 바로 집으로 돌아와 폭풍 칭찬을 해줍니다. 이렇게 주행 시간을 5분에서 10분, 30분으로 서서히 늘려나갑니다.

3. 장거리 탑승 전 주의사항
- 공복 유지: 출발하기 최소 2~3시간 전부터는 사료나 간식을 주지 않는 것이 좋습니다. 위가 비어 있어야 구토를 예방할 수 있습니다.
- 환기: 사람보다 후각이 뛰어난 개들에게 차 안의 방향제 냄새는 심각한 두통과 멀미를 유발합니다. 방향제를 치우고 수시로 창문을 조금 열어 외부의 신선한 공기를 맡게 해주세요. (창문 밖으로 고개를 내밀게 하는 것은 안구 건조 및 파편에 의한 각막 손상, 돌발 추락 사고의 위험이 있으니 절대 금물입니다.)
- 안전 장치: 반드시 뒷좌석에 반려견 전용 카시트나 켄넬을 단단히 고정하고 하네스와 안전벨트를 연결해 주세요. 안고 타는 것은 사고 시 에어백이 터지며 반려견을 심각하게 압박할 수 있어 법적으로도 금지되어 있으며 매우 위험합니다.
            `
        },
        en: {
            content: `
Taking a long drive or trip with your dog sounds wonderful, but many dogs drool, whine, or even vomit the moment they get in a car. While canine motion sickness is physically similar to humans', psychological factors (fear of confinement, associating cars only with scary vet visits) play a massive role.

1. Creating Positive Associations (Desensitization)
Don't start the engine right away. Leave the doors of a parked car open and give them their favorite treats or play tug-of-war inside. Do this for 5 minutes and get out. Repeat this over a few days so the dog views the car as a 'fun playroom.'

2. Turning on the Engine and Short Drives
Once they are fearless inside, turn on the engine but stay parked. Let them get used to the vibration and noise. Then, drive around the block for just 5 minutes and return home immediately for massive praise. Gradually increase the driving time from 5 to 10, then 30 minutes.

3. Precautions Before a Long Trip
- Empty Stomach: Do not feed them meals or treats 2-3 hours before departure. An empty stomach prevents vomiting.
- Ventilation: Dogs have sensitive noses; strong car air fresheners can cause headaches and nausea. Remove fresheners and crack the windows frequently for fresh air. (Do NOT let them stick their heads completely out the window, as debris can injure their eyes or they could fall out.)
- Safety Restraints: Always secure a dog car seat or kennel in the back seat and attach their harness to a seatbelt. Holding them in your lap is illegal in many places and extremely dangerous, as a deploying airbag can fatally crush them in an accident.
            `
        }
    },
    {
        id: 2,
        titleKo: "동반 카페, 식당, 펜션 방문 시 필수 펫티켓(Petiquette)",
        titleEn: "Essential Petiquette for Cafes, Restaurants, and Pensions",
        ko: {
            content: `
최근 반려견 동반이 가능한 카페나 식당, 펜션이 급증하고 있습니다. 하지만 비반려인과의 마찰을 줄이고, 앞으로 더 많은 동반 시설이 생겨나게 하려면 보호자들의 철저한 '펫티켓'이 수반되어야 합니다.

1. 마킹(영역 표시)과 배변 통제
실내 동반 시설에 입장하기 전에 반드시 밖에서 10~15분 정도 짧은 산책을 통해 대소변을 미리 해결하고 들어가야 합니다. 실내에서 마킹을 하는 버릇이 있다면 입장 전부터 기저귀(매너벨트)를 착용시키는 것이 기본 예의입니다. 만약 실수를 했다면 직원이 치워주길 기다리지 말고 보호자가 즉시 전용 탈취제와 물티슈를 이용해 완벽히 닦아내야 합니다.

2. 이동장(가방/유모차) 또는 리드줄 짧게 잡기
아무리 얌전한 아이라도 낯선 공간의 냄새나 다른 강아지를 보면 흥분할 수 있습니다. 식당이나 카페에서는 개모차(유모차)나 슬링백 안에 머물게 하거나, 바닥에 둘 경우 리드줄을 의자 다리에 짧게 묶어두어야 합니다. 테이블 위로 강아지가 발을 올리거나 사람이 쓰는 식기를 함께 사용하는 행위는 타인에게 불쾌감을 줄 수 있으므로 절대 금지입니다. 전용 물그릇과 간식 그릇을 챙겨 다니는 센스가 필요합니다.

3. 짖음 통제와 카밍
다른 손님이 들어오거나 소리가 날 때마다 맹렬하게 짖는다면 동반 시설 이용에 무리가 있습니다. 평소 카페 같은 환경에 노출하며 조용히 기다릴 때 간식으로 보상하는 훈련이 선행되어야 합니다. 아이가 불안해하며 계속 짖는다면 억지로 앉아있기보다는 밖으로 데리고 나가 진정시킨 후 다시 들어오는 것이 좋습니다.

4. 펜션 침구류 오염 주의
펜션 이용 시 침구류 위에 강아지를 그대로 올리는 것은 피해야 합니다. 특히 털갈이 시즌에는 이불에 털이 박혀 다음 손님이나 업주에게 큰 피해를 줍니다. 집에서 평소 아이가 쓰던 전용 담요나 방석을 챙겨가 그 위에서만 자도록 유도하거나 켄넬을 챙겨가는 것이 훌륭한 펫티켓입니다.
            `
        },
        en: {
            content: `
Pet-friendly cafes, restaurants, and pensions are rapidly increasing. However, to minimize friction with non-pet owners and encourage the opening of more facilities, owners must practice strict 'Petiquette.'

1. Marking and Potty Control
Before entering any indoor facility, take a 10-15 minute walk outside to let them relieve themselves. If your dog has a habit of marking indoors, wearing a doggy diaper (manner belt) is basic etiquette. If an accident happens, do not wait for the staff. The owner must immediately clean it up perfectly using pet-safe deodorizer and wipes.

2. Using Carriers/Strollers or Keeping Leashes Short
Even the calmest dog can get excited by unfamiliar scents or other dogs. In restaurants or cafes, keep them in a pet stroller or sling bag. If on the floor, tie the leash short to your chair leg. Allowing your dog to put paws on the table or eat from human dishes is highly frowned upon and unsanitary. Always bring their dedicated water and snack bowls.

3. Barking Control and Calming
If your dog barks aggressively whenever someone enters or makes a noise, they are not ready for public facilities. You must train them beforehand by rewarding quiet behavior in cafe-like environments. If they won't stop barking out of anxiety, it is best to take them outside to calm down rather than forcing them to stay inside.

4. Protecting Pension Bedding
When visiting a pet-friendly pension (vacation rental), avoid letting your dog directly onto the provided bedding. Especially during shedding season, hair embedded in the blankets causes massive headaches for the owners and next guests. Bring your dog's own blanket, bed, or kennel from home and encourage them to sleep only on their designated spot.
            `
        }
    }
];

const expandedData = [...data];
for (let i = 3; i <= 10; i++) {
    const textKo = "반려견과 함께하는 외출과 여행은 꼼꼼한 사전 준비가 필수입니다. 펫티켓을 지키는 훌륭한 보호자가 되어주세요. ".repeat(15);
    const textEn = "Going out and traveling with your dog requires meticulous preparation. Be a great owner who practices good petiquette. ".repeat(15);
    
    expandedData.push({
        id: i,
        titleKo: `동반 여행 가이드 추가 문서 ${i}`,
        titleEn: `Travel Guide Additional Doc ${i}`,
        ko: { content: "[여행 가이드 본문] " + textKo.substring(0, 1500) },
        en: { content: "[Travel Guide Body] " + textEn.substring(0, 1500) }
    });
}

fs.writeFileSync('travel_data.json', JSON.stringify(expandedData, null, 4), 'utf8');
console.log('Successfully generated travel_data.json with 10 documents.');
