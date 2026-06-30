const PENSION_VALUES = {
  '0': 0,
  low1: 20000,
  low2: 40000,
  low3: 65000,
  mid1: 100000,
  mid2: 135000,
  high: 175000,
}

const PENSION_DISPLAY = {
  '0': 'なし',
  low1: '約2万円',
  low2: '約4万円',
  low3: '約6.5万円',
  mid1: '約10万円',
  mid2: '約13.5万円',
  high: '約17.5万円以上',
}

const OTHER_INCOME_VALUES = {
  '0': 0,
  low1: 20000,
  low2: 40000,
  mid: 75000,
  high: 100000,
}

const FAMILY_INCOME_VALUES = {
  '0': 0,
  low1: 80000,
  low2: 125000,
  mid: 175000,
  high1: 225000,
  high2: 280000,
}

const FAMILY_INCOME_DISPLAY = {
  '0': 'なし',
  low1: '約8万円',
  low2: '約12.5万円',
  mid: '約17.5万円',
  high1: '約22.5万円',
  high2: '約28万円以上',
}

const TARGET_RENT_VALUES = {
  none: 0,
  under30: 25000,
  '30to40': 35000,
  '40to50': 45000,
  '50to60': 55000,
  '60to70': 65000,
  '70plus': 75000,
  unknown: 0,
}

const TARGET_RENT_DISPLAY = {
  none: '転居なし',
  under30: '3万円未満',
  '30to40': '3〜4万円',
  '40to50': '4〜5万円',
  '50to60': '5〜6万円',
  '60to70': '6〜7万円',
  '70plus': '7万円以上',
  unknown: '未定',
}

// 住宅扶助上限（2人世帯・都市部目安）
const RENT_SAFE_LIMIT_2 = 44000
const RENT_WARN_LIMIT_2 = 58000
// 3人世帯目安
const RENT_SAFE_LIMIT_3 = 52000
const RENT_WARN_LIMIT_3 = 66000

// 最低生活費目安（月額）
const BASE_LIVING_COST = {
  1: 80000,
  2: 120000,
  3: 150000,
}

function getHouseholdSizeA(answers) {
  const hasFam = answers.hasFamilyMember && answers.hasFamilyMember !== 'no'
  const hasSpouse = answers.hasSpouse === 'yes'
  if (hasFam && hasSpouse) return 3
  if (hasFam || hasSpouse) return 2
  return 1
}

function getHouseholdSizeB(answers) {
  return answers.hasSpouse === 'yes' ? 2 : 1
}

export function simulate(answers) {
  const pensionMain = PENSION_VALUES[answers.pensionMain] || 0
  const pensionSpouse = answers.hasSpouse === 'yes' ? (PENSION_VALUES[answers.pensionSpouse] || 0) : 0
  const otherIncome = OTHER_INCOME_VALUES[answers.otherIncome] || 0
  const baseCoupleIncome = pensionMain + pensionSpouse + otherIncome

  const familyIncome = FAMILY_INCOME_VALUES[answers.familyMemberIncome] || 0
  const hasFamilyMember = answers.hasFamilyMember && answers.hasFamilyMember !== 'no'

  // A案: 同居（3人世帯想定）
  const sizeA = getHouseholdSizeA(answers)
  const totalIncomeA = hasFamilyMember ? baseCoupleIncome + familyIncome : baseCoupleIncome
  const minLivingA = BASE_LIVING_COST[sizeA] || 150000
  const incomeGapA = minLivingA - totalIncomeA

  // B案: 別居（老夫婦のみ・2人世帯想定）
  const sizeB = getHouseholdSizeB(answers)
  const totalIncomeB = baseCoupleIncome
  const targetRentVal = TARGET_RENT_VALUES[answers.targetRent] || 0
  const minLivingB = (BASE_LIVING_COST[sizeB] || 120000) + targetRentVal
  const incomeGapB = minLivingB - totalIncomeB

  // 家賃リスク判定（B案）
  let rentRisk = 'ok'
  if (answers.targetRent && answers.targetRent !== 'none' && answers.targetRent !== 'unknown') {
    if (targetRentVal > RENT_WARN_LIMIT_2) rentRisk = 'over'
    else if (targetRentVal > RENT_SAFE_LIMIT_2) rentRisk = 'warn'
  }

  // 申請可能性スコア（A案）
  const issuesA = []
  const warningsA = []

  if (hasFamilyMember) {
    const fi = FAMILY_INCOME_VALUES[answers.familyMemberIncome] || 0
    if (fi >= 175000) {
      issuesA.push({ level: 'info', text: '同居家族に一定の収入があるため、3人世帯での申請可能性は低くなる傾向があります。' })
    } else if (fi >= 80000) {
      issuesA.push({ level: 'warn', text: '同居家族の収入が比較的低い場合でも、3人世帯として合算されます。収入が最低生活費を下回る場合は申請できる可能性があります。' })
    }
    if (answers.familyCanSupport === 'no' || answers.familyCanSupport === 'partial') {
      issuesA.push({ level: 'check', text: '同居家族が継続扶養困難と判断された場合、申請を受け付けてもらえる場合があります。' })
    }
  }

  if (incomeGapA > 0 && (!hasFamilyMember || FAMILY_INCOME_VALUES[answers.familyMemberIncome] < 175000)) {
    warningsA.push({ level: 'ok', text: `世帯収入が最低生活費の目安（約${Math.round(minLivingA / 10000)}万円）を下回っている可能性があります。` })
  } else if (hasFamilyMember && FAMILY_INCOME_VALUES[answers.familyMemberIncome] >= 175000) {
    issuesA.push({ level: 'caution', text: '同居家族の収入が高い場合、3人世帯では申請が難しい場合があります。B案（別居）の方が実現しやすい可能性があります。' })
  }

  if (answers.hasIllness === 'yes') {
    issuesA.push({ level: 'check', text: '病気・障害・要介護の状態は、申請の重要な判断材料になります。医師の診断書・介護認定書類を準備してください。' })
  }

  // 申請可能性スコア（B案）
  const issuesB = []
  const warningsB = []

  if (answers.targetRent && answers.targetRent !== 'none') {
    if (rentRisk === 'over') {
      issuesB.push({ level: 'critical', text: `候補物件の家賃（${TARGET_RENT_DISPLAY[answers.targetRent]}）が2人世帯の住宅扶助上限（目安：約${Math.round(RENT_WARN_LIMIT_2 / 10000)}万円）を超えています。この物件への転居は困難です。` })
    } else if (rentRisk === 'warn') {
      issuesB.push({ level: 'warn', text: `候補物件の家賃（${TARGET_RENT_DISPLAY[answers.targetRent]}）が住宅扶助の上限に近い水準です。地域によっては超える可能性があります。契約前に必ず確認してください。` })
    } else {
      issuesB.push({ level: 'ok', text: `候補物件の家賃（${TARGET_RENT_DISPLAY[answers.targetRent]}）は住宅扶助の上限内に収まる可能性が高いです。ただし地域差があるため、事前に確認してください。` })
    }
  }

  if (answers.contractStatus === 'signed') {
    issuesB.push({ level: 'critical', text: '転居先をすでに契約済みです。生活保護申請前に契約した住宅は住宅扶助の対象外になる場合があります。早急に福祉事務所へ相談してください。' })
  } else if (answers.contractStatus === 'deposit_paid') {
    issuesB.push({ level: 'warn', text: '申込金・手付金を支払い済みです。契約前に福祉事務所へ相談することを強くおすすめします。' })
  }

  if (answers.initialCost && answers.initialCost !== 'none' && answers.initialCost !== 'unknown') {
    issuesB.push({ level: 'check', text: '初期費用（敷金・礼金など）は、原則として生活保護の「一時扶助」として申請できる場合があります。必ず事前に福祉事務所で確認してください。' })
  }

  if (answers.commonFee && answers.commonFee !== 'none' && answers.commonFee !== 'unknown') {
    warningsB.push({ level: 'check', text: '共益費・管理費は、住宅扶助に含まれる場合と含まれない場合があります。契約前に福祉事務所へ確認してください。' })
  }

  if (incomeGapB > 0) {
    warningsB.push({ level: 'ok', text: `老夫婦のみの世帯収入（年金等）が最低生活費の目安（家賃込み約${Math.round(minLivingB / 10000)}万円）を下回る場合、申請できる可能性があります。` })
  }

  if (answers.savings === 'enough') {
    issuesA.push({ level: 'caution', text: '預貯金が100万円以上ある場合は資産として判断され、すぐには申請できない可能性があります。' })
    issuesB.push({ level: 'caution', text: '預貯金が100万円以上ある場合は資産として判断され、すぐには申請できない可能性があります。' })
  }

  // 申請可能性の総合判定
  const possibilityA = calcPossibility(totalIncomeA, minLivingA, hasFamilyMember, familyIncome, answers)
  const possibilityB = calcPossibility(totalIncomeB, minLivingB, false, 0, answers)

  return {
    patternA: {
      householdSize: sizeA,
      totalIncome: totalIncomeA,
      minLiving: minLivingA,
      incomeGap: incomeGapA,
      possibility: possibilityA,
      issues: issuesA,
      warnings: warningsA,
      pros: getProsA(answers, hasFamilyMember),
      cons: getConsA(answers, hasFamilyMember, familyIncome),
      risks: getRisksA(answers, hasFamilyMember, familyIncome),
    },
    patternB: {
      householdSize: sizeB,
      totalIncome: totalIncomeB,
      minLiving: minLivingB,
      incomeGap: incomeGapB,
      possibility: possibilityB,
      rentRisk,
      issues: issuesB,
      warnings: warningsB,
      pros: getProsB(answers),
      cons: getConsB(answers),
      risks: getRisksB(answers),
    },
    coupleIncome: baseCoupleIncome,
    familyIncome,
    hasFamilyMember,
    pensionMainDisplay: PENSION_DISPLAY[answers.pensionMain] || '不明',
    pensionSpouseDisplay: answers.hasSpouse === 'yes' ? (PENSION_DISPLAY[answers.pensionSpouse] || '不明') : null,
    familyIncomeDisplay: hasFamilyMember ? (FAMILY_INCOME_DISPLAY[answers.familyMemberIncome] || '不明') : null,
    targetRentDisplay: TARGET_RENT_DISPLAY[answers.targetRent] || '未入力',
  }
}

function calcPossibility(income, minLiving, hasFamilyMember, familyIncome, answers) {
  if (answers.savings === 'enough') return 'low'
  if (answers.familyCanSupport === 'yes') return 'low'

  const gap = minLiving - income
  if (hasFamilyMember && familyIncome >= 175000) {
    if (gap <= 0) return 'low'
    return 'mid'
  }
  if (gap > 30000) return 'high'
  if (gap > 0) return 'mid'
  return 'low'
}

function getProsA(answers, hasFamilyMember) {
  const pros = []
  if (hasFamilyMember) pros.push('家族と同居のため、生活上のサポートを受けやすい')
  if (answers.hasIllness === 'yes') pros.push('病気・介護がある場合、家族の見守りが得られる')
  pros.push('転居費用・初期費用が不要')
  pros.push('慣れた環境で生活できる')
  return pros
}

function getConsA(answers, hasFamilyMember, familyIncome) {
  const cons = []
  if (hasFamilyMember && familyIncome >= 175000) {
    cons.push('同居家族の収入が高いと3人世帯全体の収入が増え、申請が難しくなる')
    cons.push('娘・息子に扶養義務照会が届く場合がある（本人の同意なしでも照会される）')
  } else if (hasFamilyMember && familyIncome >= 80000) {
    cons.push('同居家族の収入も合算されるため、3人世帯の最低生活費を上回る可能性がある')
  }
  if (hasFamilyMember) cons.push('家族のプライバシー・関係性への影響がある場合がある')
  cons.push('家族の収入状況によっては申請できない場合がある')
  return cons
}

function getRisksA(answers, hasFamilyMember, familyIncome) {
  const risks = []
  if (hasFamilyMember && familyIncome >= 125000) {
    risks.push('同居家族の収入が扶養能力あると判断されると申請が受理されない場合がある')
  }
  if (hasFamilyMember) {
    risks.push('福祉事務所から同居家族への扶養照会が行われることがある')
  }
  risks.push('家族の収入が増えた場合、受給が停止・減額される可能性がある')
  return risks
}

function getProsB(answers) {
  const pros = ['老夫婦のみの2人世帯として申請するため、娘・息子の収入が申請に影響しない']
  pros.push('世帯を分けることで、夫婦の収入・資産のみで判断される')
  if (answers.hasIllness === 'yes') pros.push('医療扶助・介護扶助も受けやすくなる可能性がある')
  pros.push('自分たちのペースで生活できる')
  return pros
}

function getConsB(answers) {
  const cons = ['転居費用・初期費用が必要（敷金・礼金・引越し代など）']
  cons.push('高齢者のみの世帯は入居を断られる物件が多い場合がある')
  if (answers.hasIllness === 'yes') cons.push('病気・要介護の場合、日常生活のサポートが得られにくい')
  cons.push('家賃が住宅扶助の上限を超えないか、事前に確認が必要')
  cons.push('新しい環境への適応が負担になる場合がある')
  return cons
}

function getRisksB(answers) {
  const risks = []
  if (answers.contractStatus === 'signed') {
    risks.push('【重要】申請前に契約した住宅は住宅扶助の対象にならない場合がある')
  }
  if (answers.contractStatus === 'deposit_paid') {
    risks.push('申込金・手付金支払い済みの場合、契約前に必ず福祉事務所へ相談が必要')
  }
  risks.push('住宅扶助の上限を超える家賃の物件には入居できない')
  risks.push('初期費用は事前申請が必要（事後申請は原則認められない）')
  risks.push('高齢者向け物件の数が限られており、探すのに時間がかかる場合がある')
  return risks
}

export function generateComparisonPhrase(answers, result) {
  const hasFam = answers.hasFamilyMember && answers.hasFamilyMember !== 'no'
  const famLabel = answers.hasFamilyMember === 'daughter' ? '娘' : answers.hasFamilyMember === 'son' ? '息子' : '家族'
  const hasSpouse = answers.hasSpouse === 'yes'
  const municipality = answers.municipality ? `${answers.municipality}在住の` : ''
  const coupleStr = hasSpouse ? '老夫婦' : '本人（高齢者）'
  const illnesses = answers.illnessDetail || []
  const illnessStr = illnesses.length > 0
    ? illnesses.map((i) => ({
        stroke: '脳梗塞・脳出血の後遺症',
        heart: '心臓病・心筋梗塞',
        spine: '脊椎・骨・関節の病気',
        chronic: '慢性疾患',
        cancer: 'がん',
        mental: '精神疾患',
        disability: '身体障害・認知症',
        care: '要介護',
        other: 'その他の疾患',
      }[i] || i)).join('、')
    : null

  const pensionStr = hasSpouse
    ? `本人の年金は月${result.pensionMainDisplay}、配偶者の年金は月${result.pensionSpouseDisplay}程度`
    : `年金収入は月${result.pensionMainDisplay}程度`

  const targetRent = answers.targetRent && answers.targetRent !== 'none' && answers.targetRent !== 'unknown'
    ? `転居先の候補家賃は月${result.targetRentDisplay}です。`
    : ''

  const contractNote = answers.contractStatus === 'signed'
    ? 'すでに転居先の契約を結んでしまいました。住宅扶助の適用について至急相談したいです。'
    : answers.contractStatus === 'deposit_paid'
      ? 'まだ正式契約はしていませんが、申込金を払っている状態です。契約前に確認したいです。'
      : '契約前に、住宅扶助の上限、初期費用の扱い、申請手順について確認したいです。'

  const supportNote = answers.familyCanSupport === 'no'
    ? `${famLabel}は介護・生活費の負担が重く、継続的な扶養が難しい状況です。`
    : answers.familyCanSupport === 'partial'
      ? `${famLabel}も生活に余裕がなく、継続的な扶養は難しい状況です。`
      : ''

  return `${municipality}${coupleStr}の生活保護申請について相談したいです。
${hasFam ? `${famLabel}と同居していますが、` : ''}${supportNote}
${pensionStr}です。
${illnessStr ? `本人は${illnessStr}があり、就労が困難な状態です。` : answers.canWork === 'no' || answers.canWork === 'difficult' ? '健康上の理由から就労が難しい状態です。' : ''}
このまま${hasFam ? `${famLabel}と3人世帯として申請する場合` : '現状のまま申請する場合'}と、${hasSpouse ? '夫婦のみ' : '一人で'}近隣の住宅に転居して申請する場合で、どちらが現実的か確認したいです。
${targetRent}
${contractNote}`.trim()
}
