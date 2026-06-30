// 生活実態スコア：数値が高いほど「生活実態が別」
function calcSeparationScore(answers) {
  let score = 0

  if (answers.foodSeparate === 'yes') score += 3
  else if (answers.foodSeparate === 'partial') score += 1

  if (answers.bankSeparate === 'yes') score += 3
  else if (answers.bankSeparate === 'partial') score += 1

  if (answers.mealSeparate === 'yes') score += 2
  else if (answers.mealSeparate === 'partial') score += 1

  if (answers.spaceSeparate === 'yes') score += 2
  else if (answers.spaceSeparate === 'partial') score += 1

  if (answers.utilitiesPayer === 'self') score += 1
  if (answers.rentPayer === 'self') score += 1

  return score
}

// 同居家族の収入が高いかどうか
function isFamilyHighIncome(answers) {
  return answers.familyHasIncome === 'yes' && (answers.familyIncomeLevel === 'high1' || answers.familyIncomeLevel === 'high2')
}

function isFamilyMidIncome(answers) {
  return answers.familyHasIncome === 'yes' && answers.familyIncomeLevel === 'mid'
}

export function diagnoseHousehold(answers) {
  const hasFam = answers.hasFamilyMember === 'yes'
  const alreadySeparated = answers.jumintoStatus === 'separated' || answers.planSeparation === 'already'
  const separationScore = hasFam ? calcSeparationScore(answers) : 10
  const highIncome = hasFam && isFamilyHighIncome(answers)
  const midIncome = hasFam && isFamilyMidIncome(answers)
  const hasAssets = answers.familyAssets === 'enough' || answers.familyAssets === 'some'
  const canSeparateLiving = answers.hasAlternativePlace === 'yes' || answers.hasAlternativePlace === 'looking'
  const hasCareBurden = answers.hasCareburden === 'yes_certified' || answers.hasCareburden === 'yes_not_certified'
  const supportReasons = Array.isArray(answers.supportReason) ? answers.supportReason : []

  // Pattern A: 同居のまま申請
  const issuesA = []
  if (!hasFam) {
    issuesA.push({ level: 'ok', text: '同居家族がいないため、本人（または夫婦）のみの世帯として申請できます。世帯分離の問題は発生しません。' })
  } else {
    if (highIncome) {
      issuesA.push({ level: 'critical', text: '同居家族の月収が高いため、3人以上の世帯収入が最低生活費を超える可能性があります。同居のままでは申請が難しい場合があります。' })
    } else if (midIncome) {
      issuesA.push({ level: 'warn', text: '同居家族に一定の収入があります。世帯全体の収入と最低生活費を比較した上で、申請可能性を判断する必要があります。' })
    } else if (answers.familyHasIncome === 'none') {
      issuesA.push({ level: 'check', text: '同居家族に収入がない場合、世帯全員が生活保護の対象になる可能性があります。全員の収入・資産を正直に申告してください。' })
    }

    if (hasAssets) {
      issuesA.push({ level: 'warn', text: '世帯全体の預貯金・資産が多い場合は、資産活用を求められる可能性があります。' })
    }

    if (supportReasons.length > 0) {
      issuesA.push({ level: 'check', text: '同居家族が扶養できない理由を、具体的な金額・状況・医師の意見なども含めて説明できるよう準備してください。' })
    }

    issuesA.push({ level: 'info', text: '扶養照会：福祉事務所は申請者の親族（同居・別居を問わず）に扶養できないか確認の書類（扶養照会）を送付する場合があります。' })
  }

  // Pattern B: 住民票上の世帯分離をして申請
  const issuesB = []
  if (!hasFam) {
    issuesB.push({ level: 'info', text: '同居家族がいないため、世帯分離の問題は発生しません。' })
  } else {
    issuesB.push({ level: 'critical', text: '【重要】住民票上の世帯分離だけでは不十分です。生活保護では「生活実態」が確認されます。食費・光熱費・家賃・通帳・食事・生活空間が実際に分かれているかを審査されます。' })

    if (separationScore >= 8) {
      issuesB.push({ level: 'ok', text: '入力内容から、生活実態がある程度分かれている可能性があります。ただし最終判断は福祉事務所が行います。' })
    } else if (separationScore >= 4) {
      issuesB.push({ level: 'warn', text: '生活実態が一部分かれていますが、まだ一体とみなされる要素があります。食費・通帳・生活費の独立をさらに明確にする必要があります。' })
    } else {
      issuesB.push({ level: 'critical', text: '現在の生活実態では、住民票を分けても「同一世帯」と判断される可能性が高いです。食事・家計・生活空間を実際に分けることが必要です。' })
    }

    if (answers.separationReason === 'welfare') {
      issuesB.push({ level: 'warn', text: '生活保護申請のためだけに世帯分離をした場合、理由を詳しく説明できるよう準備が必要です。実態が伴わない申告は不正受給とみなされるリスクがあります。' })
    }

    if (alreadySeparated) {
      issuesB.push({ level: 'check', text: '世帯分離済みの場合、分離してからの期間・理由・生活実態をまとめて説明できるようにしてください。' })
    }

    if (answers.utilitiesPayer === 'family' || answers.rentPayer === 'family') {
      issuesB.push({ level: 'warn', text: '光熱費や家賃を同居家族が全額払っている場合、実態上は家計が一体とみなされる可能性があります。' })
    }
  }

  // Pattern C: 老夫婦のみ別居して申請
  const issuesC = []
  if (canSeparateLiving) {
    issuesC.push({ level: 'ok', text: '別居できる候補物件があります。老夫婦のみの2人世帯として申請すれば、同居家族の収入が影響しない形で審査されます。' })
  } else {
    issuesC.push({ level: 'info', text: '現時点では別居先が見つかっていません。福祉事務所に相談しながら、条件に合う物件を探す必要があります。' })
  }

  const separateRent = answers.separateRent
  if (separateRent && separateRent !== 'unknown') {
    const rentWarnings = {
      '60plus': '6万円以上の家賃は2人世帯の住宅扶助上限を超える可能性があります。事前に必ず確認してください。',
      '50to60': '5〜6万円の家賃は地域によっては住宅扶助の上限に近い水準です。地域の上限額を確認してください。',
    }
    if (rentWarnings[separateRent]) {
      issuesC.push({ level: 'warn', text: rentWarnings[separateRent] })
    } else {
      issuesC.push({ level: 'check', text: '候補の家賃は住宅扶助の上限内に収まる可能性がありますが、地域差があります。契約前に必ず確認してください。' })
    }
  }

  issuesC.push({ level: 'warn', text: '転居先は申請前に必ず福祉事務所で確認してください。先に契約してしまうと住宅扶助が受けられない場合があります。' })
  issuesC.push({ level: 'check', text: '初期費用（敷金・礼金・引越し代）は、生活保護の一時扶助として申請できる場合があります。事前に確認してください。' })
  issuesC.push({ level: 'info', text: '高齢者のみの世帯は入居を断られる場合があります。高齢者可・生活保護可の物件を探す必要があります。' })

  if (hasCareBurden) {
    issuesC.push({ level: 'check', text: '要介護状態の場合、別居後の医療・介護サービスの手配も同時に確認してください。' })
  }

  // 全体警告
  const globalWarnings = [
    '住民票を分けるだけで生活保護が通るとは限りません。',
    '生活実態と異なる申告は不正受給と判断されるリスクがあります。',
    '世帯分離や転居は、必ず福祉事務所へ事前相談してから進めてください。',
  ]

  if (answers.preConsulted === 'no') {
    globalWarnings.push('まだ福祉事務所への相談がされていません。世帯分離・転居の前に必ず相談してください。')
  }

  return {
    hasFam,
    separationScore,
    highIncome,
    hasCareBurden,
    canSeparateLiving,
    alreadySeparated,
    issuesA,
    issuesB,
    issuesC,
    globalWarnings,
    recommended: getRecommended(hasFam, highIncome, midIncome, separationScore, canSeparateLiving, answers),
  }
}

function getRecommended(hasFam, highIncome, midIncome, score, canSeparate, answers) {
  if (!hasFam) return 'A'
  if (canSeparate && (highIncome || (midIncome && score < 4))) return 'C'
  if (hasFam && score >= 6 && answers.jumintoStatus === 'separated') return 'B'
  if (canSeparate && highIncome) return 'C'
  if (!highIncome && !midIncome) return 'A'
  return 'B'
}

export function generateHouseholdPhrase(answers, result) {
  const hasFam = answers.hasFamilyMember === 'yes'
  const famWho = Array.isArray(answers.familyWho) ? answers.familyWho : []
  const famLabel = famWho.includes('daughter') ? '娘' : famWho.includes('son') ? '息子' : '同居家族'
  const hasSpouse = true // 老夫婦前提
  const alreadySeparated = answers.jumintoStatus === 'separated' || answers.planSeparation === 'already'
  const hasCareBurden = answers.hasCareburden === 'yes_certified' || answers.hasCareburden === 'yes_not_certified'
  const supportReasons = Array.isArray(answers.supportReason) ? answers.supportReason : []

  const supportStr = supportReasons.map((r) => ({
    care_burden: '介護の負担が大きい',
    low_income: '自身の生活も苦しい',
    medical_cost: '医療費・介護費が高額',
    work_burden: '仕事・育児との両立が限界',
    mental: '精神的・身体的な負担が限界',
    future: 'このまま続けると共倒れになる恐れがある',
    other: 'その他の事情',
  }[r] || r)).join('、')

  const separationStatus = alreadySeparated
    ? '住民票上の世帯分離をすでに行っています。'
    : answers.planSeparation === 'yes'
      ? '住民票上の世帯分離を検討しています。'
      : ''

  const separateRentStr = answers.separateRent && answers.separateRent !== 'unknown'
    ? `別居先の候補家賃は月${{'under30':'3万円未満','30to40':'約3〜4万円','40to50':'約4〜5万円','50to60':'約5〜6万円','60plus':'6万円以上'}[answers.separateRent] || ''}です。`
    : ''

  const preConsultStr = answers.preConsulted === 'yes'
    ? 'すでに一度相談に伺いました。' : ''

  return `${hasFam ? `${famLabel}と同居している` : ''}老夫婦の生活保護申請について相談したいです。
${hasFam && supportStr ? `${famLabel}は${supportStr}という状況にあり、継続的な扶養が困難です。` : ''}
${hasCareBurden ? '本人・配偶者の介護負担があり、日常生活に支援が必要な状態です。' : ''}
${separationStatus}
${preConsultStr}
今後の選択肢として次の3点を確認したいです。
①同居のまま申請する場合、${famLabel}の収入・資産はどのように扱われるか。
②${separationStatus ? '実施済みの' : ''}住民票上の世帯分離について、生活保護上も別世帯と見なされる条件は何か。
③老夫婦のみ近隣に別居して申請する場合、住宅扶助の上限・初期費用・申請手順はどうなるか。
${separateRentStr}
生活保護を受けるためだけに形式的な世帯分離をしたいわけではなく、実際の生活実態と扶養困難の状況を正しく説明した上で、適切な申請方法を確認したいです。`.trim()
}
