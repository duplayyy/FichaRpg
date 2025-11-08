// =========================
// particulas.js
// Maid-sensei: script para particulas.html
// ====== keys localStorage ======
const LS = {
  darkMode: 'darkMode',
  particulas_times: 'duppon_particulas_times',   // contador de "vezes feitas"
  particulas_tests: 'duppon_particulas_tests',
  particulas_errors: 'duppon_particulas_errors'  // guarda frases erradas para repetir
};

// ====== Small util ======
function $(sel){ return document.querySelector(sel) }
function $all(sel){ return Array.from(document.querySelectorAll(sel)) }
function saveJSON(key, obj){ localStorage.setItem(key, JSON.stringify(obj)) }
function loadJSON(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) || fallback } catch(e){ return fallback } }

// ====== Conteúdo (exemplo inicial) ======
// Cada item = { id, particle, sentenceHTML, answer (string), hint (string) }
// sentenceHTML aceita <span class="w" data-mean="...">漢字</span> e ____ para lacuna
const BANK = [
  // =================================
  // 1. は (wa) - MARCADOR DE TÓPICO
  // =================================
  {
    id: 1,
    particle: 'は',
    sentenceHTML: '<ruby><span class="w" data-mean="eu">私</span><rt>わたし</rt></ruby>____<ruby><span class="w" data-mean="estudante, aluno">学生</span><rt>がくせい</rt></ruby><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'wa',
    hint: 'Marca o tópico principal da frase (Eu).',
  },
  {
    id: 2,
    particle: 'は',
    sentenceHTML: '<span class="w" data-mean="este">この</span><ruby><span class="w" data-mean="livro">本</span><rt>ほん</rt></ruby>____<span class="w" data-mean="interessante">おもしろい</span><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'wa',
    hint: 'Marca o tópico "este livro".',
  },
  {
    id: 3,
    particle: 'は',
    sentenceHTML: '<ruby><span class="w" data-mean="hoje">今日</span><rt>きょう</rt></ruby>____<ruby><span class="w" data-mean="frio">寒</span><rt>さむ</rt></ruby><span class="w" data-mean="negação">くありません</span>。',
    answer: 'wa',
    hint: 'Marca o tópico "hoje" (com negação, usado para contraste).',
  },
  {
    id: 4,
    particle: 'は',
    sentenceHTML: '<span class="w" data-mean="café">コーヒー</span>____<ruby><span class="w" data-mean="beber">飲</span><rt>の</rt></ruby><span class="w" data-mean="partícula de objeto direto">み</span><span class="w" data-mean="partícula conjuntiva">ます</span><span class="w" data-mean="partícula conjuntiva (mas)">が</span>、<ruby><span class="w" data-mean="chá">お茶</span><rt>おちゃ</rt></ruby><span class="w" data-mean="partícula de tópico">は</span><ruby><span class="w" data-mean="beber">飲</span><rt>の</rt></ruby><span class="w" data-mean="negação">みません</span>。',
    answer: 'wa',
    hint: 'Usado para **contraste** ("quanto ao café, eu bebo, mas...").',
  },
  {
    id: 5,
    particle: 'は',
    sentenceHTML: '<ruby><span class="w" data-mean="senhor Tanaka">田中</span><rt>たなか</rt></ruby><span class="w" data-mean="sufixo de polidez">さん</span>____<ruby><span class="w" data-mean="professor">先生</span><rt>せんせい</rt></ruby><span class="w" data-mean="cópula de polidez">です</span><span class="w" data-mean="partícula de pergunta">か</span>。',
    answer: 'wa',
    hint: 'Marca o tópico principal da pergunta ("Quanto ao Sr. Tanaka?").',
  },

  // =================================
  // 2. が (ga) - MARCADOR DE SUJEITO/FOCO
  // =================================
  {
    id: 6,
    particle: 'が',
    sentenceHTML: '<ruby><span class="w" data-mean="chuva">雨</span><rt>あめ</rt></ruby>____<ruby><span class="w" data-mean="cair, chover">降</span><rt>ふ</rt></ruby><span class="w" data-mean="estar em andamento">っています</span>。',
    answer: 'ga',
    hint: 'Indica o sujeito que executa a ação (a chuva é que está caindo).',
  },
  {
    id: 7,
    particle: 'が',
    sentenceHTML: '<ruby><span class="w" data-mean="eu">私</span><rt>わたし</rt></ruby><span class="w" data-mean="partícula de tópico">は</span>、<ruby><span class="w" data-mean="gato">猫</span><rt>ねこ</rt></ruby>____<ruby><span class="w" data-mean="gostar">好</span><rt>す</rt></ruby><span class="w" data-mean="cópula de polidez">きです</span>。',
    answer: 'ga',
    hint: 'Usado com verbos/adjetivos de desejo/gosto (好き, 欲しい).',
  },
  {
    id: 8,
    particle: 'が',
    sentenceHTML: '<span class="w" data-mean="qual">どの</span><ruby><span class="w" data-mean="pessoa">人</span><rt>ひと</rt></ruby>____<ruby><span class="w" data-mean="senhor Tanaka">田中</span><rt>たなか</rt></ruby><span class="w" data-mean="sufixo de polidez">さん</span><span class="w" data-mean="cópula de polidez">です</span><span class="w" data-mean="partícula de pergunta">か</span>。',
    answer: 'ga',
    hint: 'Usado para perguntar pelo sujeito (Quem/Qual/O que).',
  },
  {
    id: 9,
    particle: 'が',
    sentenceHTML: '<span class="w" data-mean="porta">ドア</span>____<ruby><span class="w" data-mean="abrir">開</span><rt>あ</rt></ruby><span class="w" data-mean="estar em andamento">いています</span>。',
    answer: 'ga',
    hint: 'Usado para descrever estados naturais ou espontâneos (a porta *está* aberta).',
  },
  {
    id: 10,
    particle: 'が',
    sentenceHTML: 'わたし<span class="w" data-mean="partícula de tópico">は</span><ruby><span class="w" data-mean="japonês">日本</span><rt>にほん</rt></ruby><ruby><span class="w" data-mean="linguagem">語</span><rt>ご</rt></ruby>____<ruby><span class="w" data-mean="entender, saber">分</span><rt>わ</rt></ruby><span class="w" data-mean="polidez">かります</span>。',
    answer: 'ga',
    hint: 'Usado com verbos de percepção e habilidade (わかる, できる).',
  },

  // =================================
  // 3. を (o/wo) - MARCADOR DE OBJETO DIRETO
  // =================================
  {
    id: 11,
    particle: 'を',
    sentenceHTML: '<ruby><span class="w" data-mean="água">水</span><rt>みず</rt></ruby>____<ruby><span class="w" data-mean="beber">飲</span><rt>の</rt></ruby><span class="w" data-mean="polidez">みます</span>。',
    answer: 'o',
    hint: 'Marca o objeto direto (a água está sendo bebida).',
  },
  {
    id: 12,
    particle: 'を',
    sentenceHTML: '<ruby><span class="w" data-mean="jornal">新聞</span><rt>しんぶん</rt></ruby>____<ruby><span class="w" data-mean="ler">読</span><rt>よ</rt></ruby><span class="w" data-mean="polidez">みます</span>。',
    answer: 'o',
    hint: 'Marca o objeto direto (o jornal está sendo lido).',
  },
  {
    id: 13,
    particle: 'を',
    sentenceHTML: '<ruby><span class="w" data-mean="rua">道</span><rt>みち</rt></ruby>____<ruby><span class="w" data-mean="atravessar">渡</span><rt>わた</rt></ruby><span class="w" data-mean="polidez">ります</span>。',
    answer: 'o',
    hint: 'Usado com verbos de movimento para indicar por onde se passa (atravessar a rua).',
  },
  {
    id: 14,
    particle: 'を',
    sentenceHTML: '<ruby><span class="w" data-mean="parque">公園</span><rt>こうえん</rt></ruby>____<ruby><span class="w" data-mean="passear">散歩</span><rt>さんぽ</rt></ruby><span class="w" data-mean="verbo fazer">します</span>。',
    answer: 'o',
    hint: 'Usado para indicar o local de uma ação não-linear ou passeio (passear pelo parque).',
  },
  {
    id: 15,
    particle: 'を',
    sentenceHTML: '<span class="w" data-mean="qual">どの</span><span class="w" data-mean="ônibus">バス</span>____<ruby><span class="w" data-mean="pegar, embarcar">乗</span><rt>の</rt></ruby><span class="w" data-mean="polidez">ります</span><span class="w" data-mean="partícula de pergunta">か</span>。',
    answer: 'o',
    hint: 'Marca o objeto direto da ação (qual ônibus será pego).',
  },

  // =================================
  // 4. に (ni) - DESTINO/ALVO/TEMPO
  // =================================
  {
    id: 16,
    particle: 'に',
    sentenceHTML: '<ruby><span class="w" data-mean="escola">学校</span><rt>がっこう</rt></ruby>____<ruby><span class="w" data-mean="ir">行</span><rt>い</rt></ruby><span class="w" data-mean="polidez">きます</span>。',
    answer: 'ni',
    hint: 'Indica o **destino** final do movimento.',
  },
  {
    id: 17,
    particle: 'に',
    sentenceHTML: '<ruby><span class="w" data-mean="três">三</span><rt>さん</rt></ruby><ruby><span class="w" data-mean="hora">時</span><rt>じ</rt></ruby>____<ruby><span class="w" data-mean="acordar">起</span><rt>お</rt></ruby><span class="w" data-mean="polidez">きます</span>。',
    answer: 'ni',
    hint: 'Indica **tempo específico** (hora, dia da semana, ano).',
  },
  {
    id: 18,
    particle: 'に',
    sentenceHTML: '<span class="w" data-mean="cadeira">いす</span>____<ruby><span class="w" data-mean="sentar">座</span><rt>すわ</rt></ruby><span class="w" data-mean="polidez">ります</span>。',
    answer: 'ni',
    hint: 'Indica o **alvo/ponto de contato** da ação (sentar-se *na* cadeira).',
  },
  {
    id: 19,
    particle: 'に',
    sentenceHTML: '<ruby><span class="w" data-mean="mesa, escrivaninha">机</span><rt>つくえ</rt></ruby><span class="w" data-mean="partícula de posse">の</span><ruby><span class="w" data-mean="em cima">上</span><rt>うえ</rt></ruby>____<ruby><span class="w" data-mean="ter, existir (inanimado)">あります</span><rt>あります</rt></ruby>。',
    answer: 'ni',
    hint: 'Indica o local de **existência** (com ある - para objetos inanimados).',
  },
  {
    id: 20,
    particle: 'に',
    sentenceHTML: '<ruby><span class="w" data-mean="mãe">母</span><rt>はは</rt></ruby>____<span class="w" data-mean="dar (para outrem)">あげます</span>。',
    answer: 'ni',
    hint: 'Indica a **pessoa alvo** (receptor) da ação (dar *para* a mãe).',
  },

  // =================================
  // 5. で (de) - LOCAL DE AÇÃO/MEIO
  // =================================
  {
    id: 21,
    particle: 'で',
    sentenceHTML: '<span class="w" data-mean="restaurante">レストラン</span>____<ruby><span class="w" data-mean="comer">食</span><rt>た</rt></ruby><span class="w" data-mean="polidez">べます</span>。',
    answer: 'de',
    hint: 'Indica o **local onde** a ação acontece.',
  },
  {
    id: 22,
    particle: 'で',
    sentenceHTML: '<span class="w" data-mean="inglês">えいご</span>____<ruby><span class="w" data-mean="falar">話</span><rt>はな</rt></ruby><span class="w" data-mean="polidez">します</span>。',
    answer: 'de',
    hint: 'Indica o **instrumento** ou **língua** usada ("de inglês").',
  },
  {
    id: 23,
    particle: 'で',
    sentenceHTML: '<span class="w" data-mean="este">この</span><ruby><span class="w" data-mean="lápis">鉛筆</span><rt>えんぴつ</rt></ruby>____<ruby><span class="w" data-mean="escrever">書</span><rt>か</rt></ruby><span class="w" data-mean="polidez">きます</span>。',
    answer: 'de',
    hint: 'Indica o **meio/ferramenta** usado (escrever *com* o lápis).',
  },
  {
    id: 24,
    particle: 'で',
    sentenceHTML: '<ruby><span class="w" data-mean="doença">病気</span><rt>びょうき</rt></ruby>____<ruby><span class="w" data-mean="morrer">死</span><rt>し</rt></ruby><span class="w" data-mean="passado">にました</span>。',
    answer: 'de',
    hint: 'Indica a **causa** (morreu *por causa da* doença).',
  },
  {
    id: 25,
    particle: 'で',
    sentenceHTML: '<ruby><span class="w" data-mean="tudo">全部</span><rt>ぜんぶ</rt></ruby>____<span class="w" data-mean="duzentos ienes">200円</span><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'de',
    hint: 'Indica o **limite/escopo** (o total dá 200 ienes).',
  },

  // =================================
  // 6. の (no) - POSSE/RELAÇÃO
  // =================================
  {
    id: 26,
    particle: 'の',
    sentenceHTML: '<ruby><span class="w" data-mean="eu">私</span><rt>わたし</rt></ruby>____<ruby><span class="w" data-mean="carro">車</span><rt>くるま</rt></ruby><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'no',
    hint: 'Indica **posse** (carro *de* mim).',
  },
  {
    id: 27,
    particle: 'の',
    sentenceHTML: '<span class="w" data-mean="este">これ</span><span class="w" data-mean="partícula de tópico">は</span><ruby><span class="w" data-mean="Japão">日本</span><rt>にほん</rt></ruby>____<ruby><span class="w" data-mean="produto">製品</span><rt>せいひん</rt></ruby><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'no',
    hint: 'Indica **origem** ou **relação** (produto *do* Japão).',
  },
  {
    id: 28,
    particle: 'の',
    sentenceHTML: '<ruby><span class="w" data-mean="professor">先生</span><rt>せんせい</rt></ruby>____<ruby><span class="w" data-mean="filho">子</span><rt>こ</rt></ruby><span class="w" data-mean="partícula de tópico">どもは</span><span class="w" data-mean="bonito, limpo">きれいです</span>。',
    answer: 'no',
    hint: 'Indica **posse/relação** (filho *do* professor).',
  },
  {
    id: 29,
    particle: 'の',
    sentenceHTML: '<ruby><span class="w" data-mean="quebrar">壊</span><rt>こわ</rt></ruby><span class="w" data-mean="passado">れた</span>____<span class="w" data-mean="partícula de tópico">は</span><span class="w" data-mean="este">これ</span><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'no',
    hint: 'Usado como **nominalizador** (o que quebrou *é* este).',
  },
  {
    id: 30,
    particle: 'の',
    sentenceHTML: '<ruby><span class="w" data-mean="trabalhar">働</span><rt>はたら</rt></ruby><span class="w" data-mean="nominalizador">く</span>____が<ruby><span class="w" data-mean="gostar">好</span><rt>す</rt></ruby><span class="w" data-mean="cópula de polidez">きです</span>。',
    answer: 'no',
    hint: 'Transforma o verbo (trabalhar) em substantivo (ação *de* trabalhar) para ser o objeto de "gostar".',
  },

  // =================================
  // 7. と (to) - E/COM/CITAÇÃO
  // =================================
  {
    id: 31,
    particle: 'と',
    sentenceHTML: '<ruby><span class="w" data-mean="amigo">友達</span><rt>ともだち</rt></ruby>____<ruby><span class="w" data-mean="falar">話</span><rt>はな</rt></ruby><span class="w" data-mean="polidez">します</span>。',
    answer: 'to',
    hint: 'Indica o **parceiro** da ação ("com" um amigo).',
  },
  {
    id: 32,
    particle: 'と',
    sentenceHTML: '<ruby><span class="w" data-mean="cachorro">犬</span><rt>いぬ</rt></ruby>____<ruby><span class="w" data-mean="gato">猫</span><rt>ねこ</rt></ruby><span class="w" data-mean="partícula de sujeito">が</span><ruby><span class="w" data-mean="ter, existir (animado)">います</span><rt>います</rt></ruby>。',
    answer: 'to',
    hint: 'Indica **lista completa** de itens (cachorro *e* gato).',
  },
  {
    id: 33,
    particle: 'と',
    sentenceHTML: '「<span class="w" data-mean="adeus">さようなら</span>」____<ruby><span class="w" data-mean="dizer">言</span><rt>い</rt></ruby><span class="w" data-mean="passado">いました</span>。',
    answer: 'to',
    hint: 'Usado para **citação** ("disse *o quê*?").',
  },
  {
    id: 34,
    particle: 'と',
    sentenceHTML: '<ruby><span class="w" data-mean="o que">何</span><rt>なに</rt></ruby>____<ruby><span class="w" data-mean="pensar">思</span><rt>おも</rt></ruby><span class="w" data-mean="polidez">います</span><span class="w" data-mean="partícula de pergunta">か</span>。',
    answer: 'to',
    hint: 'Usado para citar um **pensamento** ("pensar *o quê*?").',
  },
  {
    id: 35,
    particle: 'と',
    sentenceHTML: '<ruby><span class="w" data-mean="eu">私</span><rt>わたし</rt></ruby>____<ruby><span class="w" data-mean="ele">彼</span><rt>かれ</rt></ruby><span class="w" data-mean="partícula de tópico">は</span><ruby><span class="w" data-mean="irmãos">兄弟</span><rt>きょうだい</rt></ruby><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'to',
    hint: 'Liga dois substantivos em uma lista completa (Eu *e* ele).',
  },

  // =================================
  // 8. へ (e) - DIREÇÃO
  // =================================
  {
    id: 36,
    particle: 'へ',
    sentenceHTML: '<span class="w" data-mean="Brasil">ブラジル</span>____<ruby><span class="w" data-mean="voltar">帰</span><rt>かえ</rt></ruby><span class="w" data-mean="polidez">ります</span>。',
    answer: 'e',
    hint: 'Indica a **direção** do movimento (voltando *para* o Brasil).',
  },
  {
    id: 37,
    particle: 'へ',
    sentenceHTML: '<ruby><span class="w" data-mean="casa">家</span><rt>いえ</rt></ruby>____<ruby><span class="w" data-mean="voltar">帰</span><rt>かえ</rt></ruby><span class="w" data-mean="polidez">ります</span>。',
    answer: 'e',
    hint: 'Indica a **direção** do movimento (voltando *para* casa).',
  },
  {
    id: 38,
    particle: 'へ',
    sentenceHTML: '<ruby><span class="w" data-mean="Tokyo">東京</span><rt>とうきょう</rt></ruby>____<ruby><span class="w" data-mean="ir">行</span><rt>い</rt></ruby><span class="w" data-mean="polidez">きます</span>。',
    answer: 'e',
    hint: 'Indica a **direção** do movimento (indo *para* Tóquio).',
  },
  {
    id: 39,
    particle: 'へ',
    sentenceHTML: '<ruby><span class="w" data-mean="Japão">日本</span><rt>にほん</rt></ruby>____<ruby><span class="w" data-mean="vir">来</span><rt>き</rt></ruby><span class="w" data-mean="passado">ました</span>。',
    answer: 'e',
    hint: 'Indica a **direção** do movimento (vindo *para* o Japão).',
  },
  {
    id: 40,
    particle: 'へ',
    sentenceHTML: '<ruby><span class="w" data-mean="amigo">友達</span><rt>ともだち</rt></ruby>____<ruby><span class="w" data-mean="mandar carta">手紙</span><rt>てがみ</rt></ruby><span class="w" data-mean="partícula de objeto direto">を</span><ruby><span class="w" data-mean="enviar">送</span><rt>おく</rt></ruby><span class="w" data-mean="polidez">ります</span>。',
    answer: 'e',
    hint: 'Usado para indicar o **receptor** (enviar *para* um amigo - focado na direção).',
  },

  // =================================
  // 9. も (mo) - TAMBÉM
  // =================================
  {
    id: 41,
    particle: 'も',
    sentenceHTML: '<ruby><span class="w" data-mean="eu">私</span><rt>わたし</rt></ruby>____<ruby><span class="w" data-mean="estudante, aluno">学生</span><rt>がくせい</rt></ruby><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'mo',
    hint: 'Significa "**também**" (Eu *também* sou estudante).',
  },
  {
    id: 42,
    particle: 'も',
    sentenceHTML: '<span class="w" data-mean="este">これ</span>____<span class="w" data-mean="aquele">それ</span>____<ruby><span class="w" data-mean="caro">高</span><rt>たか</rt></ruby><span class="w" data-mean="cópula de polidez">いです</span>。',
    answer: 'mo',
    hint: 'Usado para dizer que **ambos** são caros ("tanto isso *quanto* aquilo").',
  },
  {
    id: 43,
    particle: 'も',
    sentenceHTML: '<span class="w" data-mean="ninguém">だれ</span>____<ruby><span class="w" data-mean="vir">来</span><rt>き</rt></ruby><span class="w" data-mean="negação passado">ませんでした</span>。',
    answer: 'mo',
    hint: 'Usado com pronomes interrogativos na forma negativa para significar "**ninguém/nada**" (Ninguém *sequer* veio).',
  },
  {
    id: 44,
    particle: 'も',
    sentenceHTML: '<ruby><span class="w" data-mean="dinheiro">お金</span><rt>おかね</rt></ruby>____<span class="w" data-mean="não ter">ありません</span>。',
    answer: 'mo',
    hint: 'Significa "nem (dinheiro)" na forma negativa ("Não tenho *sequer* dinheiro").',
  },
  {
    id: 45,
    particle: 'も',
    sentenceHTML: '<span class="w" data-mean="este">この</span><span class="w" data-mean="pão">パン</span><span class="w" data-mean="partícula de tópico">は</span>、<ruby><span class="w" data-mean="doce">甘</span><rt>あま</rt></ruby><span class="w" data-mean="partícula 'e também'">い</span>____<ruby><span class="w" data-mean="salgado">塩辛</span><rt>しおから</rt></ruby><span class="w" data-mean="cópula de polidez">いです</span>。',
    answer: 'mo',
    hint: 'Significa "**e também**" quando usado para listar características (é *doce e também* salgado).',
  },

  // =================================
  // 10. から (kara) - DE/DESDE/PORQUE
  // =================================
  {
    id: 46,
    particle: 'から',
    sentenceHTML: '8<ruby><span class="w" data-mean="hora">時</span><rt>じ</rt></ruby>____<ruby><span class="w" data-mean="estudar">勉強</span><rt>べんきょう</rt></ruby><span class="w" data-mean="verbo fazer">します</span>。',
    answer: 'kara',
    hint: 'Indica o **ponto inicial** no tempo ("desde" as 8h).',
  },
  {
    id: 47,
    particle: 'から',
    sentenceHTML: '<span class="w" data-mean="Brasil">ブラジル</span>____<ruby><span class="w" data-mean="vir">来</span><rt>き</rt></ruby><span class="w" data-mean="passado">ました</span>。',
    answer: 'kara',
    hint: 'Indica o **ponto de origem** no espaço ("de" ou "vindo de").',
  },
  {
    id: 48,
    particle: 'から',
    sentenceHTML: '<ruby><span class="w" data-mean="cansar">疲</span><rt>つか</rt></ruby><span class="w" data-mean="passado">れた</span>____<ruby><span class="w" data-mean="voltar">帰</span><rt>かえ</rt></ruby><span class="w" data-mean="polidez">ります</span>。',
    answer: 'kara',
    hint: 'Indica a **razão/causa** ("porque/já que").',
  },
  {
    id: 49,
    particle: 'から',
    sentenceHTML: '<span class="w" data-mean="aqui">ここ</span><span class="w" data-mean="partícula locativa">で</span><ruby><span class="w" data-mean="parar">止</span><rt>と</rt></ruby><span class="w" data-mean="forma te">まって</span>____<ruby><span class="w" data-mean="ir">行</span><rt>い</rt></ruby><span class="w" data-mean="forma te">って</span><span class="w" data-mean="pedir">ください</span>。',
    answer: 'kara',
    hint: 'Indica a ordem das ações (pare **e depois** vá).',
  },
  {
    id: 50,
    particle: 'から',
    sentenceHTML: '<ruby><span class="w" data-mean="estação de trem">駅</span><rt>えき</rt></ruby>____<ruby><span class="w" data-mean="andar">歩</span><rt>ある</rt></ruby><span class="w" data-mean="polidez">きます</span>。',
    answer: 'kara',
    hint: 'Indica o **ponto de partida** ("a partir da" estação).',
  },

  // =================================
  // 11. まで (made) - ATÉ/LIMITE
  // =================================
  {
    id: 51,
    particle: 'まで',
    sentenceHTML: '5<ruby><span class="w" data-mean="hora">時</span><rt>じ</rt></ruby>____<ruby><span class="w" data-mean="trabalhar">働</span><rt>はたら</rt></ruby><span class="w" data-mean="polidez">きます</span>。',
    answer: 'made',
    hint: 'Indica o **ponto final** no tempo ("até" as 5h).',
  },
  {
    id: 52,
    particle: 'まで',
    sentenceHTML: '<ruby><span class="w" data-mean="estação de trem">駅</span><rt>えき</rt></ruby>____<ruby><span class="w" data-mean="ir">行</span><rt>い</rt></ruby><span class="w" data-mean="polidez">きます</span>。',
    answer: 'made',
    hint: 'Indica o **ponto final** no espaço ("até a" estação).',
  },
  {
    id: 53,
    particle: 'まで',
    sentenceHTML: '<ruby><span class="w" data-mean="eu">私</span><rt>わたし</rt></ruby>____<ruby><span class="w" data-mean="saber">知</span><rt>し</rt></ruby><span class="w" data-mean="negação">りません</span>。',
    answer: 'made',
    hint: 'Significa "até mesmo/inclusive" (Até *mesmo eu* não sei).',
  },
  {
    id: 54,
    particle: 'まで',
    sentenceHTML: '<span class="w" data-mean="esta">この</span><ruby><span class="w" data-mean="notícia">ニュース</span><rt>ニュース</rt></ruby><span class="w" data-mean="partícula de tópico">は</span><ruby><span class="w" data-mean="hoje">今日</span><rt>きょう</rt></ruby>____<ruby><span class="w" data-mean="chegar">届</span><rt>とど</rt></ruby><span class="w" data-mean="passado">いた</span>。',
    answer: 'made',
    hint: 'Indica o **limite temporal** (chegou *até* hoje).',
  },
  {
    id: 55,
    particle: 'まで',
    sentenceHTML: '<ruby><span class="w" data-mean="fim">終</span><rt>お</rt></ruby><span class="w" data-mean="fim">わり</span>____<ruby><span class="w" data-mean="ver">見</span><rt>み</rt></ruby><span class="w" data-mean="polidez">ます</span>。',
    answer: 'made',
    hint: 'Indica o **limite** de uma ação (ver *até o* fim).',
  },

  // =================================
  // 12. よ (yo) - ÊNFASE/ASSERTIVIDADE
  // =================================
  {
    id: 56,
    particle: 'よ',
    sentenceHTML: '<span class="w" data-mean="aqui">ここ</span><span class="w" data-mean="partícula de tópico">は</span><ruby><span class="w" data-mean="perigoso">危</span><rt>あぶ</rt></ruby><span class="w" data-mean="adjetivo i">ない</span>____。',
    answer: 'yo',
    hint: 'Partícula de fim de frase para **afirmar** algo importante (É perigoso, *viu*!).',
  },
  {
    id: 57,
    particle: 'よ',
    sentenceHTML: '<ruby><span class="w" data-mean="eu">私</span><rt>わたし</rt></ruby><span class="w" data-mean="partícula de sujeito">が</span><ruby><span class="w" data-mean="fazer">やります</span><rt>やります</rt></ruby>____。',
    answer: 'yo',
    hint: 'Usado para expressar **vontade/decisão** com convicção (Eu farei *sim*).',
  },
  {
    id: 58,
    particle: 'よ',
    sentenceHTML: '<ruby><span class="w" data-mean="nome">名前</span><rt>なまえ</rt></ruby><span class="w" data-mean="partícula de tópico">は</span><span class="w" data-mean="Maria">マリア</span><span class="w" data-mean="cópula de polidez">です</span>____。',
    answer: 'yo',
    hint: 'Usado para **corrigir** ou **dar informação nova** ao ouvinte (Meu nome é Maria, *sabe*?).',
  },
  {
    id: 59,
    particle: 'よ',
    sentenceHTML: '<ruby><span class="w" data-mean="ir">行</span><rt>い</rt></ruby><span class="w" data-mean="volitivo">こう</span>____。',
    answer: 'yo',
    hint: 'Usado com a forma volitiva (convite) para **incentivar** (Vamos, *cara*!).',
  },
  {
    id: 60,
    particle: 'よ',
    sentenceHTML: '<span class="w" data-mean="bom dia">おはよう</span>____。',
    answer: 'yo',
    hint: 'Usado para **chamar a atenção** de forma amigável (Ei, bom dia!).',
  },

  // =================================
  // 13. ね (ne) - CONCORDÂNCIA/CONFIRMAÇÃO
  // =================================
  {
    id: 61,
    particle: 'ね',
    sentenceHTML: '<span class="w" data-mean="isto">これ</span>、<span class="w" data-mean="delicioso">おいしい</span>____。',
    answer: 'ne',
    hint: 'Partícula de fim de frase para buscar **concordância** (É delicioso, *né*?).',
  },
  {
    id: 62,
    particle: 'ね',
    sentenceHTML: '<ruby><span class="w" data-mean="amanhã">明日</span><rt>あした</rt></ruby>、<ruby><span class="w" data-mean="chuva">雨</span><rt>あめ</rt></ruby><span class="w" data-mean="partícula de sujeito">が</span><ruby><span class="w" data-mean="cair, chover">降</span><rt>ふ</rt></ruby><span class="w" data-mean="polidez">ります</span>____。',
    answer: 'ne',
    hint: 'Usado para **confirmar** uma informação (Vai chover amanhã, *certo*?).',
  },
  {
    id: 63,
    particle: 'ね',
    sentenceHTML: '<ruby><span class="w" data-mean="você">君</span><rt>きみ</rt></ruby><span class="w" data-mean="partícula de tópico">は</span>、<ruby><span class="w" data-mean="quem">誰</span><rt>だれ</rt></ruby><span class="w" data-mean="cópula informal">だ</span>____。',
    answer: 'ne',
    hint: 'Usado para **reflexão** ou **auto-correção** (Eu sou... quem, *hein*?).',
  },
  {
    id: 64,
    particle: 'ね',
    sentenceHTML: '<span class="w" data-mean="onde">どこ</span>____<ruby><span class="w" data-mean="ir">行</span><rt>い</rt></ruby><span class="w" data-mean="volitivo">こう</span><span class="w" data-mean="partícula de pergunta">か</span>。',
    answer: 'ne',
    hint: 'Usado com perguntas ou convites para suavizar o tom (Onde devemos ir, *hein*?).',
  },
  {
    id: 65,
    particle: 'ね',
    sentenceHTML: '<span class="w" data-mean="aquela">あの</span><ruby><span class="w" data-mean="loja">店</span><rt>みせ</rt></ruby>、<span class="w" data-mean="bom">いい</span>____。',
    answer: 'ne',
    hint: 'Suaviza uma opinião ou sugestão (Aquela loja é boa, *eu acho*).',
  },

  // =================================
  // 14. か (ka) - PERGUNTA/OPÇÕES
  // =================================
  {
    id: 66,
    particle: 'か',
    sentenceHTML: '<ruby><span class="w" data-mean="ele">彼</span><rt>かれ</rt></ruby><span class="w" data-mean="partícula de tópico">は</span><ruby><span class="w" data-mean="professor">先生</span><rt>せんせい</rt></ruby><span class="w" data-mean="cópula de polidez">です</span>____。',
    answer: 'ka',
    hint: 'Partícula de fim de frase para fazer uma **pergunta** (Ele é professor?).',
  },
  {
    id: 67,
    particle: 'か',
    sentenceHTML: '<ruby><span class="w" data-mean="chá verde">お茶</span><rt>おちゃ</rt></ruby>____<span class="w" data-mean="café">コーヒー</span>____<ruby><span class="w" data-mean="beber">飲</span><rt>の</rt></ruby><span class="w" data-mean="polidez">みます</span>____。',
    answer: 'ka',
    hint: 'Usado para listar **opções** ("ou") (Chá *ou* café?). (Note: o último é para a pergunta principal)',
  },
  {
    id: 68,
    particle: 'か',
    sentenceHTML: '<ruby><span class="w" data-mean="eu">私</span><rt>わたし</rt></ruby><span class="w" data-mean="partícula de sujeito">が</span><span class="w" data-mean="fazer (informal)">やる</span>____。',
    answer: 'ka',
    hint: 'Usado para fazer uma **auto-pergunta** ou sugestão (Devo fazer?).',
  },
  {
    id: 69,
    particle: 'か',
    sentenceHTML: '<span class="w" data-mean="quando">いつ</span>____<ruby><span class="w" data-mean="vir">来</span><rt>き</rt></ruby><span class="w" data-mean="polidez">ます</span>____。',
    answer: 'ka',
    hint: 'Usado com pronomes interrogativos (Quem/O que/Quando) para formular a pergunta. (Note: o último é para a pergunta principal)',
  },
  {
    id: 70,
    particle: 'か',
    sentenceHTML: '<ruby><span class="w" data-mean="dez">十</span><rt>じっ</rt></ruby><ruby><span class="w" data-mean="minutos">分</span><rt>ぷん</rt></ruby>____<ruby><span class="w" data-mean="levar tempo">かかる</span><rt>かかる</rt></ruby>。',
    answer: 'ka',
    hint: 'Usado para expressar **incerteza** ou estimativa ("cerca de dez minutos").',
  },

  // =================================
  // 15. や (ya) - E (LISTA INCOMPLETA)
  // =================================
  {
    id: 71,
    particle: 'や',
    sentenceHTML: '<span class="w" data-mean="laranja">オレンジ</span>____<ruby><span class="w" data-mean="maçã">りんご</span><rt>りんご</rt></ruby><span class="w" data-mean="partícula de objeto direto">を</span><ruby><span class="w" data-mean="comprar">買</span><rt>か</rt></ruby><span class="w" data-mean="passado">いました</span>。',
    answer: 'ya',
    hint: 'Lista incompleta ("e coisas como...").',
  },
  {
    id: 72,
    particle: 'や',
    sentenceHTML: '<ruby><span class="w" data-mean="segunda-feira">月曜日</span><rt>げつようび</rt></ruby>____<ruby><span class="w" data-mean="quarta-feira">水曜日</span><rt>すいようび</rt></ruby><span class="w" data-mean="partícula de tempo">に</span><ruby><span class="w" data-mean="ter aula">授業</span><rt>じゅぎょう</rt></ruby><span class="w" data-mean="partícula de sujeito">が</span><ruby><span class="w" data-mean="ter, existir">あります</span><rt>あります</rt></ruby>。',
    answer: 'ya',
    hint: 'Usado para listar dias ou períodos incompletamente.',
  },
  {
    id: 73,
    particle: 'や',
    sentenceHTML: '<ruby><span class="w" data-mean="papel">紙</span><rt>かみ</rt></ruby>____<span class="w" data-mean="caneta">ペン</span><span class="w" data-mean="partícula de sujeito">が</span><ruby><span class="w" data-mean="ter, existir">あります</span><rt>あります</rt></ruby>。',
    answer: 'ya',
    hint: 'Lista incompleta de materiais ("papel, caneta, e etc...").',
  },
  {
    id: 74,
    particle: 'や',
    sentenceHTML: '<ruby><span class="w" data-mean="criança">子</span><rt>こ</rt></ruby><span class="w" data-mean="criança">ども</span>____<ruby><span class="w" data-mean="adulto">大人</span><rt>おとな</rt></ruby><span class="w" data-mean="partícula de sujeito">が</span><ruby><span class="w" data-mean="vir">来</span><rt>く</rt></ruby><span class="w" data-mean="deve">るでしょう</span>。',
    answer: 'ya',
    hint: 'Lista incompleta de pessoas ("crianças, adultos, e outros...").',
  },
  {
    id: 75,
    particle: 'や',
    sentenceHTML: '<ruby><span class="w" data-mean="chá">お茶</span><rt>おちゃ</rt></ruby>____<span class="w" data-mean="suco">ジュース</span><span class="w" data-mean="partícula de sujeito">が</span><span class="w" data-mean="bom">いい</span><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'ya',
    hint: 'Usado para dar exemplos de bebidas ("chá, suco, ou algo assim...").',
  },

  // =================================
  // 16. より (yori) - COMPARAÇÃO
  // =================================
  {
    id: 76,
    particle: 'より',
    sentenceHTML: '<span class="w" data-mean="este">これ</span><span class="w" data-mean="partícula de tópico">は</span><span class="w" data-mean="aquele">それ</span>____<ruby><span class="w" data-mean="caro">高</span><rt>たか</rt></ruby><span class="w" data-mean="cópula de polidez">いです</span>。',
    answer: 'yori',
    hint: 'Usado para indicar o ponto de comparação ("mais caro *do que* aquilo").',
  },
  {
    id: 77,
    particle: 'より',
    sentenceHTML: '<span class="w" data-mean="este">この</span><ruby><span class="w" data-mean="livro">本</span><rt>ほん</rt></ruby><span class="w" data-mean="partícula de tópico">は</span><span class="w" data-mean="aquele">あの</span>____<ruby><span class="w" data-mean="fácil">簡単</span><rt>かんたん</rt></ruby><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'yori',
    hint: 'Usado para comparação (mais fácil *do que* aquele).',
  },
  {
    id: 78,
    particle: 'より',
    sentenceHTML: '<ruby><span class="w" data-mean="eu">私</span><rt>わたし</rt></ruby><span class="w" data-mean="partícula de tópico">は</span><ruby><span class="w" data-mean="ele">彼</span><rt>かれ</rt></ruby>____<ruby><span class="w" data-mean="alto">背</span><rt>せ</rt></ruby><span class="w" data-mean="alto">が</span><ruby><span class="w" data-mean="alto">高</span><rt>たか</rt></ruby><span class="w" data-mean="cópula de polidez">いです</span>。',
    answer: 'yori',
    hint: 'Usado para indicar o ponto de comparação (mais alto *do que* ele).',
  },
  {
    id: 79,
    particle: 'より',
    sentenceHTML: '3<ruby><span class="w" data-mean="horas">時間</span><rt>じかん</rt></ruby>____<ruby><span class="w" data-mean="muito">多</span><rt>おお</rt></ruby><span class="w" data-mean="adverbial">く</span><ruby><span class="w" data-mean="dormir">寝</span><rt>ね</rt></ruby><span class="w" data-mean="passado">ました</span>。',
    answer: 'yori',
    hint: 'Usado para indicar uma quantidade maior (mais *do que* 3 horas).',
  },
  {
    id: 80,
    particle: 'より',
    sentenceHTML: '<ruby><span class="w" data-mean="hoje">今日</span><rt>きょう</rt></ruby>____<ruby><span class="w" data-mean="ontem">昨日</span><rt>きのう</rt></ruby><span class="w" data-mean="partícula de posse">の</span><ruby><span class="w" data-mean="clima">天気</span><rt>てんき</rt></ruby><span class="w" data-mean="partícula de sujeito">が</span><span class="w" data-mean="bom">いい</span><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'yori',
    hint: 'Inverte a ordem: "O clima de ontem é melhor do que o de hoje".',
  },

  // =================================
  // 17. だけ (dake) - SOMENTE/APENAS
  // =================================
  {
    id: 81,
    particle: 'だけ',
    sentenceHTML: '<ruby><span class="w" data-mean="um">一</span><rt>ひと</rt></ruby><span class="w" data-mean="um">つ</span>____<ruby><span class="w" data-mean="comprar">買</span><rt>か</rt></ruby><span class="w" data-mean="passado">いました</span>。',
    answer: 'dake',
    hint: 'Significa "**apenas** um".',
  },
  {
    id: 82,
    particle: 'だけ',
    sentenceHTML: '<span class="w" data-mean="isto">これ</span>____<ruby><span class="w" data-mean="suficiente">足</span><rt>た</rt></ruby><span class="w" data-mean="potencial/poder">りる</span>。',
    answer: 'dake',
    hint: 'Significa "apenas isso é suficiente".',
  },
  {
    id: 83,
    particle: 'だけ',
    sentenceHTML: '<ruby><span class="w" data-mean="ele">彼</span><rt>かれ</rt></ruby>____<span class="w" data-mean="partícula de sujeito">が</span><ruby><span class="w" data-mean="ir">行</span><rt>い</rt></ruby><span class="w" data-mean="polidez">きます</span>。',
    answer: 'dake',
    hint: 'Pode ser usado após outras partículas como が ("Apenas ele vai").',
  },
  {
    id: 84,
    particle: 'だけ',
    sentenceHTML: '<ruby><span class="w" data-mean="salário">給料</span><rt>きゅうりょう</rt></ruby>____<span class="w" data-mean="partícula instrumental">で</span><ruby><span class="w" data-mean="viver">生</span><rt>い</rt></ruby><span class="w" data-mean="nominalizador">きる</span><span class="w" data-mean="partícula de posse">の</span><span class="w" data-mean="partícula de tópico">は</span><ruby><span class="w" data-mean="difícil">大変</span><rt>たいへん</rt></ruby><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'dake',
    hint: 'Significa "**somente** com o salário".',
  },
  {
    id: 85,
    particle: 'だけ',
    sentenceHTML: '<ruby><span class="w" data-mean="ver">見</span><rt>み</rt></ruby>る____。',
    answer: 'dake',
    hint: 'Usado para restringir a ação ("Apenas ver").',
  },

  // =================================
  // 18. くらい/ぐらい (kurai/gurai) - APROXIMADAMENTE
  // =================================
  {
    id: 86,
    particle: 'ぐらい',
    sentenceHTML: '10<ruby><span class="w" data-mean="minutos">分</span><rt>ぷん</rt></ruby>____<ruby><span class="w" data-mean="levar tempo">かかります</span><rt>かかります</rt></ruby>。',
    answer: 'gurai',
    hint: 'Indica tempo **aproximado** ("cerca de 10 minutos").',
  },
  {
    id: 87,
    particle: 'くらい',
    sentenceHTML: '<span class="w" data-mean="isto">これ</span>____<ruby><span class="w" data-mean="pequeno">小</span><rt>ちい</rt></ruby><span class="w" data-mean="adjetivo i">さい</span><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'kurai',
    hint: 'Indica grau **aproximado** ("aproximadamente deste tamanho").',
  },
  {
    id: 88,
    particle: 'ぐらい',
    sentenceHTML: '3<ruby><span class="w" data-mean="pessoas">人</span><rt>にん</rt></ruby>____<ruby><span class="w" data-mean="vir">来</span><rt>き</rt></ruby><span class="w" data-mean="polidez">ます</span>。',
    answer: 'gurai',
    hint: 'Indica número **aproximado** ("cerca de 3 pessoas").',
  },
  {
    id: 89,
    particle: 'くらい',
    sentenceHTML: '<ruby><span class="w" data-mean="eu">私</span><rt>わたし</rt></ruby><span class="w" data-mean="partícula de tempo">に</span>____<ruby><span class="w" data-mean="fácil">簡単</span><rt>かんたん</rt></ruby><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'kurai',
    hint: 'Usado para indicar "grau" ("É fácil *para mim*").',
  },
  {
    id: 90,
    particle: 'ぐらい',
    sentenceHTML: '<span class="w" data-mean="quanto">どの</span>____<ruby><span class="w" data-mean="levar tempo, custar">かかります</span><rt>かかります</rt></ruby><span class="w" data-mean="partícula de pergunta">か</span>。',
    answer: 'gurai',
    hint: 'Usado em perguntas sobre quantidade/tempo aproximado ("Quanto *aproximadamente* custa?").',
  },

  // =================================
  // 19. ながら (nagara) - ENQUANTO
  // =================================
  {
    id: 91,
    particle: 'ながら',
    sentenceHTML: '<ruby><span class="w" data-mean="andar">歩</span><rt>ある</rt></ruby><span class="w" data-mean="radical do verbo">き</span>____<ruby><span class="w" data-mean="falar">話</span><rt>はな</rt></ruby><span class="w" data-mean="polidez">します</span>。',
    answer: 'nagara',
    hint: 'Indica ações simultâneas (falar *enquanto* anda).',
  },
  {
    id: 92,
    particle: 'ながら',
    sentenceHTML: '<ruby><span class="w" data-mean="ver">見</span><rt>み</rt></ruby>____<ruby><span class="w" data-mean="comer">食</span><rt>た</rt></ruby><span class="w" data-mean="infomal">べる</span>。',
    answer: 'nagara',
    hint: 'Indica ações simultâneas (comer *enquanto* vê).',
  },
  {
    id: 93,
    particle: 'ながら',
    sentenceHTML: '<ruby><span class="w" data-mean="música">音楽</span><rt>おんがく</rt></ruby><span class="w" data-mean="partícula de objeto direto">を</span><ruby><span class="w" data-mean="escutar">聞</span><rt>き</rt></ruby><span class="w" data-mean="radical do verbo">き</span>____<ruby><span class="w" data-mean="estudar">勉強</span><rt>べんきょう</rt></ruby><span class="w" data-mean="verbo fazer">します</span>。',
    answer: 'nagara',
    hint: 'Indica a ação secundária (estudar *enquanto* escuta música).',
  },
  {
    id: 94,
    particle: 'ながら',
    sentenceHTML: '<ruby><span class="w" data-mean="ser triste">残念</span><rt>ざんねん</rt></ruby>____、<ruby><span class="w" data-mean="ir">行</span><rt>い</rt></ruby><span class="w" data-mean="não poder/ir">けない</span>。',
    answer: 'nagara',
    hint: 'Usado para indicar um contraste inesperado ("Embora seja triste...").',
  },
  {
    id: 95,
    particle: 'ながら',
    sentenceHTML: '<span class="w" data-mean="sempre">いつも</span><ruby><span class="w" data-mean="rir">笑</span><rt>わら</rt></ruby><span class="w" data-mean="radical do verbo">い</span>____<ruby><span class="w" data-mean="trabalhar">働</span><rt>はたら</rt></ruby><span class="w" data-mean="informal">く</span>。',
    answer: 'nagara',
    hint: 'Indica um estado contínuo (trabalhar *sempre rindo*).',
  },

  // =================================
  // 20. とか (to ka) - E COISAS TIPO...
  // =================================
  {
    id: 96,
    particle: 'とか',
    sentenceHTML: '<ruby><span class="w" data-mean="manga">漫画</span><rt>まんが</rt></ruby>____<span class="w" data-mean="anime">アニメ</span>____<span class="w" data-mean="partícula de sujeito">が</span><ruby><span class="w" data-mean="gostar">好</span><rt>す</rt></ruby><span class="w" data-mean="cópula de polidez">きです</span>。',
    answer: 'toka',
    hint: 'Lista exemplos informalmente ("mangá, anime, e coisas do tipo").',
  },
  {
    id: 97,
    particle: 'とか',
    sentenceHTML: '<span class="w" data-mean="onde">どこ</span>____<ruby><span class="w" data-mean="o que">何</span><rt>なに</rt></ruby>____、<ruby><span class="w" data-mean="comprar">買</span><rt>か</rt></ruby><span class="w" data-mean="forma te">って</span><ruby><span class="w" data-mean="vir">来</span><rt>き</rt></ruby><span class="w" data-mean="pedir">てください</span>。',
    answer: 'toka',
    hint: 'Usado para dar opções vagas ("Compre algo *em algum lugar ou algo* e venha"). (Preenche os dois "ou algo") ',
  },
  {
    id: 98,
    particle: 'とか',
    sentenceHTML: '<ruby><span class="w" data-mean="sair">出</span><rt>で</rt></ruby><span class="w" data-mean="volitivo">かけよう</span>____<ruby><span class="w" data-mean="pensar">思</span><rt>おも</rt></ruby><span class="w" data-mean="estar em andamento">っています</span>。',
    answer: 'toka',
    hint: 'Usado para citar pensamentos vagos ("Estou pensando *em sair ou algo assim*").',
  },
  {
    id: 99,
    particle: 'とか',
    sentenceHTML: '<ruby><span class="w" data-mean="eu">私</span><rt>わたし</rt></ruby>____<ruby><span class="w" data-mean="você">君</span><rt>きみ</rt></ruby>____<ruby><span class="w" data-mean="ir">行</span><rt>い</rt></ruby><span class="w" data-mean="informal">く</span>。',
    answer: 'toka',
    hint: 'Lista pessoas informalmente ("Eu, você, ou algo assim"). (Preenche os dois "ou algo") ',
  },
  {
    id: 100,
    particle: 'とか',
    sentenceHTML: '<ruby><span class="w" data-mean="Japão">日本</span><rt>にほん</rt></ruby><span class="w" data-mean="partícula de posse">の</span><ruby><span class="w" data-mean="comida">食</span><rt>た</rt></ruby><span class="w" data-mean="coisa, objeto">べ物</span>____、<span class="w" data-mean="delicioso">おいしい</span><span class="w" data-mean="cópula de polidez">です</span>。',
    answer: 'toka',
    hint: 'Dá exemplos de comida japonesa ("Comida japonesa *como* sushis *ou algo assim* é deliciosa").',
  },
  // IDs 1 a 45 (Partículas が, を, に, で, の, と, へ, も, から, まで) continuariam aqui, mas foram omitidos para brevidade.
  // Vou garantir que você tenha todas as 100 frases completas no seu ambiente.
];

// ====== Estado ======
let state = {
  pool: [],           // frases disponíveis (objetos)
  errors: loadJSON(LS.particulas_errors, []), // ids de frases erradas
  current: null,      // objeto atual
  times: parseInt(localStorage.getItem(LS.particulas_times) || '0', 10),
  tests: parseInt(localStorage.getItem(LS.particulas_tests) || '0', 10)
};

// ====== DOM refs ======
const knownEl = $('#known');
const unknownEl = $('#unknown');
const testsEl = $('#tests');
const phraseDisplay = $('#phrase-display');
const optionsWrap = $('#options');
const nextBtn = $('#next-btn');
const hintBtn = $('#hint-btn');
const feedbackEl = $('#feedback');
const tooltip = $('#kanji-tooltip');
const shuffleCheckbox = $('#shuffleCheckbox');
const repeatErrorsCheckbox = $('#repeatErrors');
const resetSessionBtn = $('#reset-session');
const hintText = $('#hint-text');

// ====== Funções utilitárias ======
function shuffle(arr){
  return arr.slice().sort(()=>Math.random()-0.5);
}
function updateStatsDisplay(){
  // known = total - unknown (we'll treat unknown as BANK.length - known)
  const total = BANK.length;
  const known = Math.max(0, total - (loadJSON('duppon_known_set', []).length));
  knownEl.textContent = known;
  unknownEl.textContent = total - known;
  testsEl.textContent = state.tests;
  // vezes feitas
  $('#known') && (knownEl.textContent = known);
  $('#unknown') && (unknownEl.textContent = total - known);
  $('#tests') && (testsEl.textContent = state.tests);
  // the "vezes feitas" main counter
  $all('#vezes-particulas, #vezesParticulas').forEach(el=>{
    el.textContent = state.times;
  });
}

// ====== Inicializar pool ======
function initPool(){
  const useShuffle = shuffleCheckbox ? shuffleCheckbox.checked : true;
  let pool = BANK.slice();

  // Se repetir erros primeiro e há erros salvos -> traz essas frasess primeiro
  if (repeatErrorsCheckbox && repeatErrorsCheckbox.checked && state.errors.length){
    const errIds = state.errors.slice();
    // move items whose id in state.errors to front (keeping order)
    const errs = pool.filter(p => errIds.includes(p.id));
    const rest = pool.filter(p => !errIds.includes(p.id));
    pool = errs.concat(rest);
  }

  if (useShuffle) pool = shuffle(pool);
  state.pool = pool;
}

// ====== Monta opções embaralhadas (3 alternativas: correta + 2 partículas aleatórias) ======
function buildOptions(correctParticle){
  const particles = Array.from(new Set(BANK.map(b => b.particle)));
  // garante correto + duas erradas (se possível)
  let choices = [correctParticle];
  const others = particles.filter(p => p!==correctParticle);
  shuffle(others);
  while(choices.length < 3 && others.length){
    choices.push(others.shift());
  }
  choices = shuffle(choices);
  // monta botões
  optionsWrap.innerHTML = '';
  choices.forEach(ch=>{
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-btn';
    btn.textContent = ch;
    btn.dataset.particle = ch;
    optionsWrap.appendChild(btn);
  });
  // bind events (delegation simpler but here fine)
  $all('.option-btn').forEach(b=>{
    b.addEventListener('click', (e)=> onOptionClick(e.currentTarget));
  });
}

// ====== Quando o usuário clica numa opção ======
function onOptionClick(btn){
  const chosen = btn.dataset.particle;
  const correct = state.current.particle;
  // trava opções
  $all('.option-btn').forEach(x=>x.disabled = true);
  if (chosen === correct){
    btn.classList.add('correct');
    feedbackEl.textContent = 'Correto! ✨';
    // salvar progresso: incrementa vezes feitas
    state.times++;
    localStorage.setItem(LS.particulas_times, String(state.times));
    // remover da lista de erros se estava
    state.errors = state.errors.filter(id => id !== state.current.id);
    saveJSON(LS.particulas_errors, state.errors);
  } else {
    btn.classList.add('wrong');
    feedbackEl.textContent = `Errado — resposta: ${correct}`;
    // guardar para repetir depois
    if (!state.errors.includes(state.current.id)){
      state.errors.push(state.current.id);
      saveJSON(LS.particulas_errors, state.errors);
    }
  }
  // atualiza displays
  updateStatsDisplay();
  // se botões estiverem desabilitados, re-habilita o next
  nextBtn.disabled = false;
}

// ====== Renderiza a próxima frase ======
function renderNext(){
  feedbackEl.textContent = '';
  nextBtn.disabled = true;
  if (!state.pool || state.pool.length === 0) initPool();
  state.current = state.pool.shift();
  if (!state.current){
    // re-inicializa pool quando acabar
    initPool();
    state.current = state.pool.shift();
  }
  // render sentence: replace '____' with a blank indicator
  const html = state.current.sentenceHTML.replace('____', '<span class="lacuna">____</span>');
  phraseDisplay.innerHTML = html;
  buildOptions(state.current.particle);
  // bind click for kanji words (delegation)
  $all('.w').forEach(w=>{
    w.style.cursor = 'pointer';
  });
  // ao mostrar, oculta tooltip
  hideTooltip();
  // atualiza contadores
  updateStatsDisplay();
}

// ====== Dica ======
function showHint(){
  if (!state.current) return;
  feedbackEl.textContent = `Dica: ${state.current.hint}`;
  setTimeout(()=>{ feedbackEl.textContent = '' }, 2500);
}

// ====== Tooltip para kanjis/words ======
function showTooltipFor(el, text, evt){
  tooltip.textContent = text;
  tooltip.style.display = 'block';
  tooltip.setAttribute('aria-hidden','false');
  // posiciona próximo ao cursor (ajuste para não sair da tela)
  let x = (evt && evt.clientX) ? evt.clientX + 12 : el.getBoundingClientRect().left;
  let y = (evt && evt.clientY) ? evt.clientY + 12 : el.getBoundingClientRect().bottom + 6;
  const pad = 8;
  const tw = tooltip.offsetWidth || 200;
  const th = tooltip.offsetHeight || 40;
  // ajustar se próximo ao lado direito
  if (x + tw + pad > window.innerWidth) x = window.innerWidth - tw - pad;
  if (y + th + pad > window.innerHeight) y = window.innerHeight - th - pad;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}
function hideTooltip(){ tooltip.style.display = 'none'; tooltip.setAttribute('aria-hidden','true') }

// ====== Eventos de clique fora do tooltip => fecha ======
document.addEventListener('click', (ev)=>{
  const target = ev.target;
  // se clicou numa palavra marcável
  if (target.matches('.w')){
    const mean = target.dataset.mean || 'Sem tradução';
    showTooltipFor(target, mean, ev);
    ev.stopPropagation();
    return;
  }
  // se clicou em uma option ou next, não fecha (mas se clicou em qualquer outro lugar, fecha)
  if (target.closest('.option-btn') || target.closest('.kanji-tooltip') || target.closest('.phrase-card')) {
    // não fecha
  } else {
    hideTooltip();
  }
});

// ====== Botões de controle ======
nextBtn && nextBtn.addEventListener('click', ()=>{
  // avança sem depender do answer; também registra teste
  state.tests++;
  localStorage.setItem(LS.particulas_tests, String(state.tests));
  // salvar vezes feitas continua no onOptionClick
  renderNext();
});
hintBtn && hintBtn.addEventListener('click', showHint);
resetSessionBtn && resetSessionBtn.addEventListener('click', ()=>{
  if (!confirm('Reiniciar sessão? Progresso local será limpo.')) return;
  state.times = 0; state.tests = 0; state.errors = [];
  localStorage.removeItem(LS.particulas_times);
  localStorage.removeItem(LS.particulas_tests);
  saveJSON(LS.particulas_errors, []);
  updateStatsDisplay();
  initPool();
  renderNext();
});

// ====== Dark mode: sincroniza com a chave global (compatível com outras páginas) ======
function applyDarkIfNeeded(){
  const isDark = localStorage.getItem(LS.darkMode) === 'true';
  document.body.classList.toggle('dark-mode', isDark);
  // atualiza ícone (todos os toggles)
  $all('#dark-mode-toggle, .dark-btn').forEach(btn=>{
    btn.textContent = isDark ? '☀️' : '🌙';
  });
}
function setupDarkToggles(){
  $all('#dark-mode-toggle, .dark-btn').forEach(btn=>{
    // remove listeners seguros: clone pattern
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
  });
  $all('#dark-mode-toggle, .dark-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      btn.classList.add('spin');
      document.body.classList.add('mode-switching');
      setTimeout(()=> document.body.classList.remove('mode-switching'), 350);
      setTimeout(()=>{
        const isNow = document.body.classList.toggle('dark-mode');
        localStorage.setItem(LS.darkMode, isNow ? 'true' : 'false');
        $all('#dark-mode-toggle, .dark-btn').forEach(b=> b.textContent = isNow ? '☀️' : '🌙');
      }, 220);
      setTimeout(()=> btn.classList.remove('spin'), 700);
    });
  });
}

// ====== Init on load ======
document.addEventListener('DOMContentLoaded', ()=>{
  // restore counters
  state.times = parseInt(localStorage.getItem(LS.particulas_times) || '0', 10);
  state.tests = parseInt(localStorage.getItem(LS.particulas_tests) || '0', 10);
  state.errors = loadJSON(LS.particulas_errors, []);
  updateStatsDisplay();
  setupDarkToggles();
  applyDarkIfNeeded();
  initPool();
  renderNext();

  // listeners delegados para opções (caso criadas depois)
  // também adiciona listener para palavras kanji atuais (já feito ao renderNext)
});

// ====== Sincroniza entre abas (opcional) ======
window.addEventListener('storage', (e)=>{
  if (!e.key) return;
  if (e.key === LS.darkMode) applyDarkIfNeeded();
  if (e.key === LS.particulas_times || e.key === LS.particulas_tests){
    state.times = parseInt(localStorage.getItem(LS.particulas_times) || '0', 10);
    state.tests = parseInt(localStorage.getItem(LS.particulas_tests) || '0', 10);
    updateStatsDisplay();
  }
});
