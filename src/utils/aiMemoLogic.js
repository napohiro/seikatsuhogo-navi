// キーワード検出ヘルパー
function contains(str, ...keywords) {
  if (!str) return false
  return keywords.some((k) => str.includes(k))
}

// 状況整理メモ生成
function buildSituationMemo(inputs) {
  const parts = []

  if (inputs.concern) {
    parts.push(`【困っていること】\n${inputs.concern}`)
  }
  if (inputs.family) {
    parts.push(`【家族構成】\n${inputs.family}`)
  }
  if (inputs.income) {
    parts.push(`【収入状況】\n${inputs.income}`)
  }
  if (inputs.illness) {
    parts.push(`【病気・障害・介護】\n${inputs.illness}`)
  }
  if (inputs.housing) {
    parts.push(`【住まい】\n${inputs.housing}`)
  }
  if (inputs.anxiety) {
    parts.push(`【申請で不安なこと】\n${inputs.anxiety}`)
  }
  if (inputs.windowSaid) {
    parts.push(`【窓口で言われたこと】\n${inputs.windowSaid}`)
  }

  return parts.join('\n\n')
}

// 質問リスト生成
function buildQuestions(inputs) {
  const questions = []
  const all = Object.values(inputs).join(' ')

  // 同居・世帯分離系
  if (contains(all, '同居', '娘', '息子', '家族', '世帯分離')) {
    questions.push('同居のまま申請した場合、同居家族の収入・資産はどのように扱われますか？')
    questions.push('住民票上の世帯分離をした場合、生活保護上も別世帯と見なされる条件は何ですか？')
    questions.push('世帯分離直後の申請で問題になる点はありますか？')
  }

  // 家賃・転居系
  if (contains(all, '家賃', '転居', '引越', '物件', '別居')) {
    questions.push('老夫婦のみ別居して申請する場合、住宅扶助の上限はいくらですか？')
    questions.push('転居先の契約前に、福祉事務所で住宅扶助の上限額を確認できますか？')
    questions.push('初期費用（敷金・礼金・引越し代）は生活保護で出ますか？')
  }

  // 医療・介護系
  if (contains(all, '病気', '介護', '障害', '医療', '病院', '要介護', '認知症', '入院')) {
    questions.push('病気・介護がある場合、医療費・介護費はどのように補助されますか？')
    questions.push('医師の診断書が必要ですか？どの段階で用意すればいいですか？')
    questions.push('要介護認定を受けている場合、介護扶助の申請はどうなりますか？')
  }

  // 年金系
  if (contains(all, '年金', '国民年金', '厚生年金', '障害年金')) {
    questions.push('年金を受け取っている場合、生活保護費はどのように計算されますか？')
    questions.push('年金額が変わった場合、生活保護費も変わりますか？')
  }

  // 申請拒否・窓口対応
  if (contains(all, '断られ', '拒否', '帰れ', '資産があるから', '扶養できる', '窓口')) {
    questions.push('窓口で断られた場合、申請書を受け取る権利はありますか？')
    questions.push('「資産がある」「家族が扶養できる」と言われた場合、どう対応すればいいですか？')
    questions.push('申請書を出した後、何日以内に決定が来ますか？')
  }

  // 資産系
  if (contains(all, '預貯金', '貯金', '資産', '保険', '車', '土地')) {
    questions.push('預貯金がいくら以下であれば申請できますか？')
    questions.push('生命保険・不動産・車がある場合、どう扱われますか？')
  }

  // 就労系
  if (contains(all, '働け', '仕事', '就労', '働く')) {
    questions.push('少しなら働ける場合でも申請できますか？')
    questions.push('申請後に収入が発生した場合、どう届け出ますか？')
  }

  // 申請手続き
  if (contains(inputs.question || '', '手続き', '書類', '必要', '申請')) {
    questions.push('申請に必要な書類は何ですか？')
    questions.push('申請書はどこでもらえますか？')
    questions.push('申請から受給開始まで何日かかりますか？')
  }

  // カスタム質問を追加
  if (inputs.question) {
    questions.push(`（ご自身の質問）${inputs.question}`)
  }

  // 最低でも3件は返す
  if (questions.length === 0) {
    questions.push('申請に必要な書類は何ですか？')
    questions.push('申請から受給決定まで何日かかりますか？')
    questions.push('生活保護の受給中にやってはいけないことはありますか？')
  }

  return questions
}

// 窓口で伝える文章生成
function buildWindowPhrase(inputs) {
  const parts = []
  parts.push('生活保護の申請について相談したいです。')

  if (inputs.family) parts.push(`家族構成は、${inputs.family}です。`)
  if (inputs.income) parts.push(`収入は、${inputs.income}です。`)
  if (inputs.illness) parts.push(`健康状態として、${inputs.illness}があります。`)
  if (inputs.housing) parts.push(`住まいの状況は、${inputs.housing}です。`)
  if (inputs.concern) parts.push(`特に困っているのは、${inputs.concern}です。`)
  if (inputs.windowSaid) parts.push(`以前の相談で「${inputs.windowSaid}」と言われましたが、再度確認させてください。`)
  if (inputs.question) parts.push(`確認したいのは、${inputs.question}です。`)

  parts.push('申請書をいただけますか？')

  return parts.filter(Boolean).join('\n')
}

// リスク抽出
function buildRisks(inputs) {
  const risks = []
  const all = Object.values(inputs).join(' ')

  if (contains(all, '世帯分離', '住民票')) {
    risks.push('住民票上の世帯分離だけでは、生活保護上の別世帯にならない場合があります。生活実態（食費・光熱費・通帳・食事・生活空間）が実際に分かれているか確認が必要です。')
  }
  if (contains(all, '契約済み', '契約した', '手付', '申込金')) {
    risks.push('転居先をすでに契約してしまった場合、住宅扶助の対象外になる可能性があります。福祉事務所への事前確認が必須です。')
  }
  if (contains(all, '断られ', '拒否')) {
    risks.push('口頭で断られた場合でも、申請書を受け取る権利は法律で保障されています。「申請書をください」と明確に伝えてください。')
  }
  if (contains(all, '預貯金', '貯金', '100万', '資産')) {
    risks.push('預貯金・資産の申告漏れは不正受給とみなされます。正直に全て申告してください。')
  }
  if (contains(all, '世帯分離のため', '保護のため', '裏技')) {
    risks.push('生活保護を受けるためだけの世帯分離は、生活実態と異なる申告とみなされ、不正受給のリスクがあります。')
  }

  // デフォルト
  risks.push('申請中は、収入・資産・家族状況に変化があった場合は速やかに報告する義務があります。')
  risks.push('生活保護の受給中に働いた場合は収入申告が必要です。申告漏れは返還・罰則の対象になります。')

  return risks
}

// 次のアクション
function buildNextSteps(inputs) {
  const steps = []
  const all = Object.values(inputs).join(' ')

  if (!contains(all, '相談した', '行った', '窓口に')) {
    steps.push('まず福祉事務所（市区町村の生活保護担当窓口）に電話か直接訪問して相談する')
  }
  if (contains(all, '病気', '介護', '医療', '障害')) {
    steps.push('医師の診断書・障害手帳・介護認定通知書など、健康状態を証明する書類を準備する')
  }
  if (contains(all, '年金')) {
    steps.push('年金の受給額がわかる書類（年金振込通知書・ねんきん定期便など）を準備する')
  }
  if (contains(all, '同居', '娘', '息子', '家族')) {
    steps.push('同居家族の収入・資産がわかる書類（給与明細・通帳のコピーなど）を準備する')
  }
  if (contains(all, '転居', '別居', '物件', '家賃')) {
    steps.push('転居を検討している場合は、契約前に必ず福祉事務所で住宅扶助の上限額を確認する')
  }
  if (contains(all, '断られ', '拒否')) {
    steps.push('申請書を受け取れなかった場合は「申請書の交付を求めます」と書面で要求するか、法テラス・支援団体に相談する')
  }

  steps.push('申請書類を揃えたら、福祉事務所に「申請したい」と明確に伝えて申請書を提出する')
  steps.push('申請後は担当ケースワーカーの調査に誠実に対応する（通常14日以内に決定）')

  return steps
}

export function generateAiMemo(inputs) {
  return {
    situation: buildSituationMemo(inputs),
    questions: buildQuestions(inputs),
    windowPhrase: buildWindowPhrase(inputs),
    risks: buildRisks(inputs),
    nextSteps: buildNextSteps(inputs),
  }
}

export const MEMO_FIELDS = [
  {
    id: 'concern',
    label: '今困っていること',
    placeholder: '例：生活費が底をついてきた。年金だけでは生活できない。娘に頼り続けられない。',
    rows: 3,
  },
  {
    id: 'family',
    label: '家族構成',
    placeholder: '例：老夫婦2人（夫75歳、妻70歳）。娘（45歳）と同居中。',
    rows: 2,
  },
  {
    id: 'income',
    label: '収入',
    placeholder: '例：夫の年金が月3万円、妻の年金が月2万円。その他の収入なし。',
    rows: 2,
  },
  {
    id: 'illness',
    label: '病気・障害・介護',
    placeholder: '例：夫は脳梗塞の後遺症で歩行困難。妻は要介護2の認定を受けている。',
    rows: 3,
  },
  {
    id: 'housing',
    label: '住まい',
    placeholder: '例：娘の家に同居。家賃は娘が払っている。転居先の候補として月4万円の物件がある。',
    rows: 2,
  },
  {
    id: 'anxiety',
    label: '申請で不安なこと',
    placeholder: '例：娘の収入が影響するのか。世帯分離したら通るのか。先に転居してしまっても大丈夫か。',
    rows: 3,
  },
  {
    id: 'windowSaid',
    label: '窓口で言われたこと（任意）',
    placeholder: '例：資産があるから無理と言われた。娘が扶養できると言われた。',
    rows: 2,
  },
  {
    id: 'question',
    label: '聞きたい質問（任意）',
    placeholder: '例：世帯分離直後でも申請できるか。初期費用は出るか。',
    rows: 2,
  },
]
