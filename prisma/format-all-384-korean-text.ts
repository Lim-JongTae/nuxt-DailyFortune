import fs from 'fs'
import path from 'path'

interface LineEntry {
  hexagramId: number
  lineNumber: number
  hexagramNameHanja: string
  hexagramNameKorean: string
  nameHanja: string
  textHanja: string
  textKorean: string
  modernAdvice: string
}

function processFullFormatting() {
  const jsonPath = path.join(process.cwd(), 'prisma', 'iching_384_lines.json')
  const lines: LineEntry[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  const formattedLines: LineEntry[] = lines.map(line => {
    // 1. textHanja 포맷 정리 (효명 1공백 + 낱개한자 붙여쓰기 + 구두점，。)
    let cleanHanja = line.textHanja.replace(new RegExp(`^${line.nameHanja}\\s*`), '').trim()
    cleanHanja = cleanHanja
      .replace(/，/g, '')
      .replace(/。/g, '')
      .replace(/([\u4e00-\u9fa5\u3400-\u4dbf])\s+([\u4e00-\u9fa5\u3400-\u4dbf])/g, '$1$2')
      .replace(/([\u4e00-\u9fa5\u3400-\u4dbf])\s+([\u4e00-\u9fa5\u3400-\u4dbf])/g, '$1$2')

    // 주요 어휘 구분 쉼표 및 종결 마침표
    let punctuatedHanja = cleanHanja.replace(/(勿用|利見大人|夕惕若|無咎|元吉|貞吉|無不利|利居貞|利建侯|求婚媾|往吉|致寇至|出自穴|貞厲|利涉大川|征凶|食舊德|安貞吉|三褫之|無眚|否臧凶|王三錫命|輿屍凶|無咎無譽|其血玄黃|利女貞|利用賓于王|悔亡|貞疾|勿疑|何咎|周通|不有躬|以往吝|利禦寇|納婦吉|子克家|童蒙吉|小有言|歸而逋|鞶帶|輿屍|左次|執言|長子帥師|弟子輿屍|開國承家|小人勿用|盈缶|自內|匪人|外比|三驅|失前禽|邑人不誡|無首|束帛戔戔|利用侵伐|勿藥有喜|利有攸往|利用刑人|用脫桎梏|乘馬班如|匪寇婚媾|女貞不字|十年乃字|即鹿無虞|惟入于林中|君子幾不如舍|屯其膏|小貞吉|大貞凶|泣血漣如|發蒙|包蒙|勿用取女|困蒙|童蒙|擊蒙|需于郊|需于沙|需于泥|需于血|需于酒食|入于穴|不永所事|不克訟|歸而逋|復卽命|訟元吉|師出以律|在師中|師或輿屍|師左次|田有禽|長子帥師|大君有命|有孚比之|比之自內|比之匪人|外比之|顯比|比之無首|履虎尾|履道坦坦|素履|夬履|視履考祥|拔茅茹|包荒|無平不陂|翩翩不富|帝乙歸妹|城復于隍|包承|包羞|有命無咎|休否|傾否|同人于門|同人于宗|伏戎于莽|乘其墉|同人先號咈而後笑|同人于郊|無交害|大車以載|公用亨于天子|匪其彭|厥孚交如|自天祐之|謙謙君子|鳴謙|勞謙|撝謙|不富以其鄰|鳴豫|介于石|盱豫|由豫|貞疾恆不死|冥豫|官有渝|係小子|係丈夫|隨有獲|孚于嘉|拘係之|幹父之蠱|幹母之蠱|裕父之蠱|不事王侯|咸臨|至臨|知臨|敦臨|童觀|窺觀|觀我生|觀國之光|觀其生|屨校滅趾|噬膚滅鼻|噬臘肉遇毒|噬乾胏|噬乾肉|何校滅耳|賁其趾|賁其須|賁如濡如|賁如皤如|賁于丘園|白賁|剝牀以足|剝牀以辨|剝之|剝牀以膚|貫魚以宮人寵|碩果不食|不遠復|休復|頻復|中行獨復|敦復|迷復|無妄往|不耕穫|無妄之災|可貞|無妄之疾|無妄行|有厲|輿說輹|良馬逐|童牛之牿|豶豕之牙|何天之衢|舍爾靈龜|顛頤|拂頤|由頤|藉用白茅|枯楊生稊|棟橈|棟隆|枯楊生華|過涉滅頂|習坎|坎有險|來之坎坎|樽酒簋貳|坎不盈|係用徽纆|履錯然|黃離|日昃之離|突如其來如|出涕沱若|王用出征|咸其拇|咸其腓|咸其股|憧憧往來|咸其脢|咸其輔頰舌|濬恆|불恆其德|田無禽|恆其德|振恆|遯尾|執之用黃牛之革|繫遯|好遯|嘉遯|肥遯|壯于趾|小人用壯|壯于大輿之輹|喪羊于易|羝羊觸藩|晉如摧如|晉如愁如|衆允|晉如鼫鼠|晉其角|明夷于飛|明夷夷于左股|明夷于南狩|入于左腹|箕子之明夷|不明晦|閑有家|無攸遂|家人寪寪|富家|王假有家|有孚威如|遇主于巷|見輿曳|睽孤|睽孤見豕|往蹇來譽|王臣蹇蹇|往蹇來反|往蹇來連|大蹇朋來|往蹇來碩|解而拇|田獲三狐|負且乘|解而股|君子維有解|公用射隼|利貞征凶|三人行|損其疾|或益之|弗損益之|利用爲大作|益之用凶事|中行告公|有孚惠心|莫益之|壯于前趾|惕號莫夜|壯于頄|莧陸夬夬|無號|繫于金柅|包有魚|臀無膚|包無魚|以杞包瓜|姤其角|有孚不終|引吉|萃如嗟如|大吉|萃有位|齎咨涕洟|允升|升虛邑|升階|冥升|困于株木|困于酒食|困于石|來徐徐|劓刖|困于葛藟|井泥不食|井谷射鮒|井渫不食|井甃|井冽寒泉|井收勿幕|鞏用黃牛之革|巳日乃革之|革言三就|改命|大人虎變|君子豹變|鼎顛趾|鼎有實|鼎耳革|鼎折足|鼎黃耳|鼎玉鉉|震來虩虩|震來厲|震蘇蘇|震遂泥|震往來厲|震索索|艮其趾|艮其腓|艮其限|艮其身|艮其輔|敦艮|鴻漸于干|鴻漸于磐|鴻漸于陸|鴻漸于木|鴻漸于陵|歸妹以娣|眇能視|歸妹以須|歸妹愆期|帝乙歸妹|女承筐|豐其屋|豐其部|豐其沛|來章有慶譽|火山旅|旅瑣瑣|旅館得其次|旅焚 ignorance|旅于處|射雉一矢亡|鳥焚其巢|進退|巽在牀下|頻巽|田獲三品|和兌|孚兌|來兌|商兌未寧|孚于剝|引兌|風行地上|鼎烹有孚|渙其躬|渙其群|渙汗其大號|渙其血去|節如其初|不出戶庭|不節若|安節|甘節|苦節|虞吉|鶴鳴在陰|敵者來也|月幾望|有孚攣如|翰音|飛鳥以凶|過其祖|弗過防之|弗遇過之|密雲不雨|曳其輪|婦喪其茀|高宗伐鬼方|繻有衣袽|東鄰殺牛|濡其首|濡其尾|未濟征凶|无咎|吉|凶|吝|厲)/g, '$1，')
    punctuatedHanja = punctuatedHanja.replace(/，+/g, '，').replace(/，$/, '') + '。'
    const formattedTextHanja = `${line.nameHanja} ${punctuatedHanja}`

    // 2. textKorean 포맷 일관성 정리 (음독 붙여쓰기 + " - " + 한글 뜻풀이)
    let rawKorean = line.textKorean.trim()

    // Prefix 추출 ("초구:", "육이:", "구삼:" 등)
    let prefix = ''
    const matchPrefix = rawKorean.match(/^([가-힣0-9]+\s*:\s*)/)
    if (matchPrefix) {
      prefix = matchPrefix[1].replace(/\s*/g, '') + ' ' // 예: "초구: "
      rawKorean = rawKorean.slice(matchPrefix[0].length).trim()
    }

    // 이미 " - " 하이폰 대시로 구분되어 있는 경우와 그렇지 않은 경우 분리
    let soundPart = rawKorean
    let meaningPart = ''

    if (rawKorean.includes(' - ')) {
      const parts = rawKorean.split(/\s*-\s*/)
      soundPart = parts[0]
      meaningPart = parts.slice(1).join(' - ')
    } else {
      meaningPart = line.modernAdvice
    }

    // 낱개 한글 음독 붙여쓰기 가공 (예: "부 우 행 군 정 린 구" -> "부우행군정린구")
    let cleanSound = soundPart
      .replace(/([가-힣])\s+([가-힣])/g, '$1$2')
      .replace(/([가-힣])\s+([가-힣])/g, '$1$2')

    // 완성된 textKorean 포맷: "초구: 잠룡물용 - 물속에 잠겨 있는 용이니 쓰지 말라"
    const formattedTextKorean = `${prefix}${cleanSound} - ${meaningPart}`

    return {
      ...line,
      textHanja: formattedTextHanja,
      textKorean: formattedTextKorean
    }
  })

  // 1. json 저장 (DB는 절대 건드리지 않음)
  fs.writeFileSync(jsonPath, JSON.stringify(formattedLines, null, 2), 'utf-8')

  // 2. csv 저장
  const csvHeader = 'hexagram_id,line_number,hexagram_name_hanja,hexagram_name_korean,line_name_hanja,line_text_hanja,line_text_korean,modern_advice\n'
  const csvRows = formattedLines.map(l => {
    const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`
    return [
      l.hexagramId,
      l.lineNumber,
      escapeCsv(l.hexagramNameHanja),
      escapeCsv(l.hexagramNameKorean),
      escapeCsv(l.nameHanja),
      escapeCsv(l.textHanja),
      escapeCsv(l.textKorean),
      escapeCsv(l.modernAdvice)
    ].join(',')
  }).join('\n')

  const csvPath = path.join(process.cwd(), 'prisma', 'iching_384_lines.csv')
  fs.writeFileSync(csvPath, '\uFEFF' + csvHeader + csvRows, 'utf-8')

  console.log(`✅ [DB 미반영] 전체 384효 textKorean 포맷 (음독 붙여쓰기 + " - " + 한글 뜻풀이) 표준화 완료! (총 ${formattedLines.length}개)`)
}

processFullFormatting()
