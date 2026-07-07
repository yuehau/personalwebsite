# -*- coding: utf-8 -*-
"""
Trilingual blog generator — Chin Yue Hau, Allianz Financial Advisor.

Emits static pages under blog/ (EN), blog/ms/ (BM), blog/zh/ (simplified CN)
plus sitemap.xml. Every page carries reciprocal hreflang alternates and a
language switcher. To publish a new post: add an entry to POSTS below, run
`py tools/build_blog.py` from the repo root, review, push.
"""
import os, io

SITE = "https://yuehau.my"
WA = "https://wa.me/60147058125"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LANGS = ["en", "ms", "zh"]
HTML_LANG = {"en": "en", "ms": "ms", "zh": "zh-Hans"}
PILL_LABEL = {"en": "English", "ms": "BM", "zh": "中文"}

UI = {
    "en": {
        "blog": "Blog", "home": "Home", "quote": "Get a Quote", "whatsapp": "WhatsApp",
        "index_title": "Insurance, explained simply",
        "index_sub": "Plain-language guides on protecting your family and your money — in English, Bahasa Malaysia and 中文.",
        "read": "min read", "published": "Published",
        "back": "← All articles",
        "cta_h": "Not sure what fits your situation?",
        "cta_p": "Tell me a bit about yourself and I'll give you an honest, no-pressure recommendation. The consultation is free.",
        "cta_quote": "📝 Get a Free Quote", "cta_wa": "💬 WhatsApp Me",
        "wa_msg": "Hi Yue Hau, I read your article and I'd like to ask about insurance.",
        "disclaimer": "Chin Yue Hau (Allianz Agent Code 241514-3) is an authorised life insurance agent representing Allianz Life Insurance Malaysia Berhad, part of PIP Agency at SBS Team Sdn Bhd. This article is general education, not financial advice — product details are subject to the official terms and documentation of Allianz Malaysia. Premium figures are indicative examples only.",
        "meta_suffix": "Chin Yue Hau · Allianz Financial Advisor, Klang Valley",
    },
    "ms": {
        "blog": "Blog", "home": "Utama", "quote": "Dapatkan Sebut Harga", "whatsapp": "WhatsApp",
        "index_title": "Insurans, diterangkan dengan mudah",
        "index_sub": "Panduan bahasa mudah untuk melindungi keluarga dan wang anda — dalam Bahasa Malaysia, English dan 中文.",
        "read": "min bacaan", "published": "Diterbitkan",
        "back": "← Semua artikel",
        "cta_h": "Tak pasti pelan mana sesuai untuk anda?",
        "cta_p": "Ceritakan sedikit tentang diri anda dan saya akan beri cadangan yang jujur, tanpa paksaan. Konsultasi adalah percuma.",
        "cta_quote": "📝 Dapatkan Sebut Harga Percuma", "cta_wa": "💬 WhatsApp Saya",
        "wa_msg": "Hi Yue Hau, saya baca artikel anda dan nak tanya pasal insurans.",
        "disclaimer": "Chin Yue Hau (Kod Ejen Allianz 241514-3) ialah ejen insurans hayat bertauliah yang mewakili Allianz Life Insurance Malaysia Berhad, di bawah PIP Agency di SBS Team Sdn Bhd. Artikel ini adalah pendidikan umum, bukan nasihat kewangan — butiran produk tertakluk kepada terma dan dokumentasi rasmi Allianz Malaysia. Angka premium hanyalah contoh anggaran.",
        "meta_suffix": "Chin Yue Hau · Penasihat Kewangan Allianz, Lembah Klang",
    },
    "zh": {
        "blog": "部落格", "home": "主页", "quote": "获取报价", "whatsapp": "WhatsApp",
        "index_title": "把保险讲得简单明白",
        "index_sub": "用浅白的语言讲解如何保护家人和钱包 — 提供中文、English 和 Bahasa Malaysia 版本。",
        "read": "分钟阅读", "published": "发布于",
        "back": "← 所有文章",
        "cta_h": "不确定哪个方案适合你？",
        "cta_p": "告诉我一些你的情况，我会给你诚实、零压力的建议。咨询完全免费。",
        "cta_quote": "📝 免费获取报价", "cta_wa": "💬 WhatsApp 联系我",
        "wa_msg": "Hi Yue Hau, 我看了你的文章，想咨询保险的事。",
        "disclaimer": "Chin Yue Hau（Allianz 代理编号 241514-3）是 Allianz Life Insurance Malaysia Berhad 的授权人寿保险代理，隶属 SBS Team Sdn Bhd 的 PIP Agency。本文属一般教育性内容，并非理财建议 — 产品详情以 Allianz Malaysia 官方条款与文件为准。文中保费数字仅为参考示例。",
        "meta_suffix": "Chin Yue Hau · Allianz 理财顾问 · 巴生谷",
    },
}

# ────────────────────────────────────────────────────────────────
# POSTS — add new entries here, newest first, then rerun this script.
# ────────────────────────────────────────────────────────────────
POSTS = [
    {
        "slug": "do-you-need-a-medical-card",
        "date": "2026-07-07",
        "minutes": 5,
        "category": {"en": "Medical", "ms": "Perubatan", "zh": "医疗"},
        "title": {
            "en": "Do you really need a medical card?",
            "ms": "Anda betul-betul perlukan kad perubatan?",
            "zh": "你真的需要医药卡吗？",
        },
        "excerpt": {
            "en": "Hospital bills are the #1 reason Malaysians dip into savings or debt. Here's how to tell — honestly — whether a medical card belongs in your plan.",
            "ms": "Bil hospital adalah punca utama rakyat Malaysia terpaksa korek simpanan atau berhutang. Ini cara menilai — secara jujur — sama ada anda perlukan kad perubatan.",
            "zh": "住院账单是马来西亚人动用积蓄甚至负债的头号原因。这篇文章诚实地告诉你，医药卡到底该不该买。",
        },
        "body": {
            "en": """
<p>Let's start with the honest answer: not everyone needs every insurance product. But if there is one piece of protection I'd tell a working Malaysian adult to look at first, it's the medical card. Here's why — and how to know if it applies to you.</p>
<h2>What a medical card actually does</h2>
<p>A medical card is not a discount card. It's a hospitalisation and surgical policy: when you're admitted to a private hospital, the insurer pays the bill — often <strong>cashless</strong>, meaning the hospital bills Allianz directly and you walk in without putting down a five-figure deposit.</p>
<h2>What do private hospital bills look like in Malaysia?</h2>
<p>These are the kinds of numbers I see in real claims:</p>
<ul>
<li>Appendix surgery: roughly <strong>RM8,000–RM15,000</strong></li>
<li>Dengue with complications, a week in the ward: <strong>RM10,000–RM20,000</strong></li>
<li>Heart procedures: <strong>RM30,000 and well beyond</strong></li>
</ul>
<p>Government hospitals are heavily subsidised and genuinely good — but the queue is the trade-off. A medical card is essentially buying the option to skip that queue when it matters most.</p>
<h2>"But my company already covers me"</h2>
<p>This is the most common reason people wait, and it has two catches. First, employer coverage usually has a low annual limit — RM20,000–RM50,000 is typical — which one serious admission can exceed. Second, and more important: <strong>the coverage ends when the job ends</strong>. If you resign, get retrenched, or retire, you lose it — and if your health has changed by then, buying your own policy may be expensive or impossible. Buying while young and healthy locks in your insurability.</p>
<h2>Who should prioritise a medical card?</h2>
<ul>
<li>Anyone whose savings couldn't absorb a RM20,000 bill tomorrow</li>
<li>Self-employed people and gig workers — no employer safety net at all</li>
<li>Parents — one child admission can be financially brutal</li>
<li>Young adults: this is when it's cheapest, with the fewest exclusions</li>
</ul>
<h2>What does it cost?</h2>
<p>It depends on your age, health and the plan, but as a rough guide a healthy adult in their 20s–30s typically pays around <strong>RM100–RM250 a month</strong> for a solid card with a high annual limit. That's the honest range — anyone quoting you an exact price before asking about your health is guessing.</p>
<h2>How to choose one (the 4 things that matter)</h2>
<ul>
<li><strong>Annual limit</strong> — how much the insurer pays per year. Higher is safer.</li>
<li><strong>Cashless admission</strong> — check the panel hospital list near your home.</li>
<li><strong>Deductible/co-pay</strong> — lower premium plans may ask you to share costs. Understand it before signing, not at the counter.</li>
<li><strong>Claims support</strong> — an agent who picks up the phone at admission time is part of the product.</li>
</ul>
<p>If you take one thing from this article: the question isn't really "do I need a medical card?" — it's "if I was hospitalised next month, whose money pays the bill?" If the answer is <em>my savings</em> or <em>my family</em>, that's the gap a card closes.</p>
""",
            "ms": """
<p>Jawapan jujur dulu: bukan semua orang perlukan semua produk insurans. Tetapi kalau ada satu perlindungan yang saya akan minta setiap orang dewasa bekerja di Malaysia lihat dahulu, ia adalah kad perubatan. Ini sebabnya — dan cara menilai sama ada ia relevan untuk anda.</p>
<h2>Apa sebenarnya fungsi kad perubatan</h2>
<p>Kad perubatan bukan kad diskaun. Ia polisi hospital dan pembedahan: bila anda dimasukkan ke hospital swasta, syarikat insurans yang bayar bil — selalunya secara <strong>tanpa tunai (cashless)</strong>, maksudnya hospital terus caj kepada Allianz dan anda tak perlu sediakan deposit puluhan ribu ringgit.</p>
<h2>Berapa besar bil hospital swasta di Malaysia?</h2>
<p>Ini angka-angka yang saya nampak dalam tuntutan sebenar:</p>
<ul>
<li>Pembedahan apendiks: sekitar <strong>RM8,000–RM15,000</strong></li>
<li>Denggi dengan komplikasi, seminggu di wad: <strong>RM10,000–RM20,000</strong></li>
<li>Prosedur jantung: <strong>RM30,000 ke atas</strong></li>
</ul>
<p>Hospital kerajaan memang bagus dan disubsidi — tetapi tukarannya ialah giliran menunggu. Kad perubatan pada asasnya membeli pilihan untuk tidak menunggu ketika ia paling kritikal.</p>
<h2>"Tapi syarikat saya dah cover"</h2>
<p>Ini alasan paling biasa orang bertangguh, dan ada dua perangkap. Pertama, perlindungan majikan biasanya ada had tahunan rendah — RM20,000–RM50,000 adalah tipikal — dan satu kemasukan serius boleh melepasi had itu. Kedua, lebih penting: <strong>perlindungan tamat bila kerja tamat</strong>. Berhenti kerja, diberhentikan, atau bersara — hilang. Dan jika kesihatan anda berubah ketika itu, membeli polisi sendiri mungkin mahal atau mustahil. Membeli semasa muda dan sihat mengunci kelayakan anda.</p>
<h2>Siapa patut utamakan kad perubatan?</h2>
<ul>
<li>Sesiapa yang simpanannya tak mampu tanggung bil RM20,000 esok</li>
<li>Mereka yang bekerja sendiri atau kerja gig — tiada jaringan keselamatan majikan langsung</li>
<li>Ibu bapa — satu kemasukan anak ke wad boleh sangat memeritkan kewangan</li>
<li>Orang muda: inilah masa premium paling murah dengan pengecualian paling sedikit</li>
</ul>
<h2>Berapa kosnya?</h2>
<p>Bergantung pada umur, kesihatan dan pelan, tetapi sebagai panduan kasar, dewasa sihat berumur 20-an hingga 30-an biasanya membayar sekitar <strong>RM100–RM250 sebulan</strong> untuk kad yang mantap dengan had tahunan tinggi. Itu julat yang jujur — sesiapa yang bagi harga tepat sebelum bertanya tentang kesihatan anda hanya meneka.</p>
<h2>Cara memilih (4 perkara yang penting)</h2>
<ul>
<li><strong>Had tahunan</strong> — jumlah maksimum insurans bayar setahun. Lebih tinggi, lebih selamat.</li>
<li><strong>Kemasukan tanpa tunai</strong> — semak senarai hospital panel berdekatan rumah anda.</li>
<li><strong>Deduktibel/ko-bayaran</strong> — pelan premium rendah mungkin minta anda kongsi kos. Fahami sebelum tandatangan, bukan di kaunter hospital.</li>
<li><strong>Sokongan tuntutan</strong> — ejen yang angkat telefon semasa anda di hospital adalah sebahagian daripada produk.</li>
</ul>
<p>Kalau ada satu perkara untuk dibawa pulang: soalannya bukan "perlukah saya kad perubatan?" — tetapi "kalau saya masuk hospital bulan depan, duit siapa yang bayar?" Jika jawapannya <em>simpanan saya</em> atau <em>keluarga saya</em>, itulah jurang yang kad ini tutup.</p>
""",
            "zh": """
<p>先说句实话：不是每个人都需要每一种保险。但如果要我建议每一位在马来西亚工作的成年人优先了解一样保障，那一定是医药卡。下面说明原因，以及怎么判断它是否适合你。</p>
<h2>医药卡到底是做什么的</h2>
<p>医药卡不是折扣卡，而是住院与手术保单：当你入住私人医院时，由保险公司支付账单 — 通常是<strong>免现金（cashless）</strong>的，即医院直接向 Allianz 收费，你入院时不需要先垫付五位数的按金。</p>
<h2>马来西亚私人医院的账单有多大？</h2>
<p>这些是我在真实理赔中常见的数字：</p>
<ul>
<li>盲肠手术：大约 <strong>RM8,000–RM15,000</strong></li>
<li>骨痛热症并发症，住院一周：<strong>RM10,000–RM20,000</strong></li>
<li>心脏手术：<strong>RM30,000 起，往往更高</strong></li>
</ul>
<p>政府医院有大量津贴，质量也确实不错 — 但代价是排队等候。医药卡的本质，就是在最要紧的时刻买下「不用排队」的选择权。</p>
<h2>「可是公司已经有保我了」</h2>
<p>这是最常见的拖延理由，但有两个陷阱。第一，雇主保障的年度限额通常很低 — RM20,000–RM50,000 很常见 — 一次严重住院就可能超过。第二，也是更重要的：<strong>工作结束，保障就结束</strong>。辞职、被裁、退休，保障立刻消失 — 如果那时你的健康状况已经改变，自己再买保单可能很贵，甚至买不到。趁年轻健康时投保，锁定的是你的「可保资格」。</p>
<h2>谁最应该优先考虑医药卡？</h2>
<ul>
<li>积蓄无法在明天就承受一张 RM20,000 账单的人</li>
<li>自雇人士和零工族 — 完全没有雇主这层安全网</li>
<li>父母 — 孩子一次住院对家庭财务的冲击可能非常大</li>
<li>年轻人：这是保费最便宜、除外条款最少的时候</li>
</ul>
<h2>大概要多少钱？</h2>
<p>取决于年龄、健康状况和方案，但粗略来说，20 至 30 多岁的健康成年人，一张年度限额较高的扎实医药卡，每月大约 <strong>RM100–RM250</strong>。这是诚实的区间 — 还没问过你健康状况就报出精确价格的人，都是在猜。</p>
<h2>怎么选？（真正重要的 4 件事）</h2>
<ul>
<li><strong>年度限额</strong> — 保险公司每年最多赔多少。越高越安全。</li>
<li><strong>免现金入院</strong> — 查一下住家附近的指定（panel）医院名单。</li>
<li><strong>自付额／共同承担</strong> — 低保费方案可能要求你分担费用。签名前搞清楚，别到医院柜台才发现。</li>
<li><strong>理赔支援</strong> — 入院时打电话有人接的代理，本身就是产品的一部分。</li>
</ul>
<p>如果这篇文章只记住一句话：问题其实不是「我需不需要医药卡」，而是「如果下个月我住院，账单由谁的钱来付？」如果答案是<em>我的积蓄</em>或<em>我的家人</em>，那正是医药卡要填补的缺口。</p>
""",
        },
    },
    {
        "slug": "medical-card-vs-critical-illness",
        "date": "2026-07-07",
        "minutes": 5,
        "category": {"en": "Protection", "ms": "Perlindungan", "zh": "保障"},
        "title": {
            "en": "Medical card vs critical illness cover — what's the difference?",
            "ms": "Kad perubatan vs perlindungan penyakit kritikal — apa bezanya?",
            "zh": "医药卡 vs 危疾保障 — 到底差在哪里？",
        },
        "excerpt": {
            "en": "One pays the hospital. The other pays YOU. Confusing them is the most expensive misunderstanding in Malaysian insurance.",
            "ms": "Satu bayar hospital. Satu lagi bayar ANDA. Mengelirukan kedua-duanya adalah salah faham paling mahal dalam insurans Malaysia.",
            "zh": "一个是付钱给医院，另一个是付钱给「你」。搞混这两者，是马来西亚保险里代价最高的误会。",
        },
        "body": {
            "en": """
<p>When I sit down with a new client, this is the question I hear most often: "I already have a medical card — why would I need critical illness cover too?" It's a fair question, and the answer changes how most people think about protection.</p>
<h2>The one-line difference</h2>
<p><strong>A medical card pays the hospital. Critical illness cover pays you.</strong></p>
<p>The medical card settles the treatment bill — ward, surgery, medication. Critical illness (CI) cover pays a <strong>lump sum in cash, directly to you</strong>, when you're diagnosed with a covered serious condition like cancer, heart attack or stroke. What you do with that money is entirely up to you.</p>
<h2>A realistic scenario</h2>
<p>Imagine a 35-year-old marketing manager diagnosed with early-stage cancer:</p>
<ul>
<li>Her <strong>medical card</strong> handles the hospital: surgery, chemotherapy, admissions. The bills — potentially RM100,000+ over a year — go to the insurer.</li>
<li>But she stops working for 10 months during treatment. Her salary stops. The car loan, house instalment and her parents' allowance don't.</li>
<li>Her <strong>CI payout</strong> — say RM200,000 — replaces that lost income, pays for a helper, covers non-panel treatments, and lets her recover without financial panic.</li>
</ul>
<p>Same illness, two completely different financial problems. The card solved the first. Only the CI cash solved the second.</p>
<h2>Why serious illness is an income problem, not just a bill problem</h2>
<p>Treatment for a major illness in Malaysia commonly takes 6–24 months of reduced or zero work. For most working adults, the lost income over that period is <em>bigger than the hospital bill</em>. That's the gap CI cover exists for — it's income protection disguised as health insurance.</p>
<h2>So which one first?</h2>
<p>My honest sequence for most people:</p>
<ul>
<li><strong>Medical card first</strong> — a hospital bill can arrive tomorrow and it's the more immediate catastrophic risk.</li>
<li><strong>CI cover second, but soon</strong> — especially if others depend on your income, or your family has a history of cancer, heart disease or stroke.</li>
</ul>
<h2>How much CI cover makes sense?</h2>
<p>A common rule of thumb is <strong>2–3 years of your income</strong> — enough to cover a realistic treatment-and-recovery period. Cost depends heavily on age and health, which is exactly why starting younger is dramatically cheaper.</p>
<h2>The misconceptions I correct most often</h2>
<ul>
<li><em>"My medical card covers cancer anyway."</em> It covers cancer <strong>treatment bills</strong>. It pays nothing towards your mortgage while you can't work.</li>
<li><em>"CI is only for old people."</em> Claims data says otherwise — and premiums lock in far cheaper when you're young and healthy.</li>
<li><em>"I'll add it later."</em> CI cover is medically underwritten. After a health scare, it may no longer be available to you at any price.</li>
</ul>
<p>The takeaway: these two products answer two different questions. <em>Who pays the hospital?</em> — the card. <em>Who pays my family while I recover?</em> — the CI lump sum. A complete plan usually needs an answer to both.</p>
""",
            "ms": """
<p>Bila saya duduk dengan klien baharu, ini soalan yang paling kerap saya dengar: "Saya dah ada kad perubatan — kenapa perlu perlindungan penyakit kritikal lagi?" Soalan yang wajar, dan jawapannya mengubah cara kebanyakan orang berfikir tentang perlindungan.</p>
<h2>Beza dalam satu ayat</h2>
<p><strong>Kad perubatan bayar hospital. Perlindungan penyakit kritikal bayar anda.</strong></p>
<p>Kad perubatan selesaikan bil rawatan — wad, pembedahan, ubat. Perlindungan penyakit kritikal (CI) pula membayar <strong>sekaligus, tunai, terus kepada anda</strong> apabila anda disahkan menghidap penyakit serius yang dilindungi seperti kanser, serangan jantung atau strok. Duit itu, terpulang sepenuhnya kepada anda untuk gunakan.</p>
<h2>Senario realistik</h2>
<p>Bayangkan pengurus pemasaran berumur 35 tahun disahkan kanser peringkat awal:</p>
<ul>
<li><strong>Kad perubatan</strong> dia uruskan hospital: pembedahan, kemoterapi, kemasukan wad. Bil — mungkin RM100,000+ setahun — pergi kepada syarikat insurans.</li>
<li>Tetapi dia berhenti kerja 10 bulan sepanjang rawatan. Gaji terhenti. Ansuran kereta, rumah dan duit bulanan ibu bapa tidak terhenti.</li>
<li><strong>Bayaran CI</strong> dia — katakan RM200,000 — ganti pendapatan yang hilang, bayar pembantu, tampung rawatan luar panel, dan biar dia pulih tanpa panik kewangan.</li>
</ul>
<p>Penyakit sama, dua masalah kewangan berbeza. Kad selesaikan yang pertama. Hanya tunai CI selesaikan yang kedua.</p>
<h2>Kenapa penyakit serius adalah masalah pendapatan, bukan sekadar masalah bil</h2>
<p>Rawatan penyakit besar di Malaysia biasanya mengambil 6–24 bulan kerja berkurangan atau langsung tiada. Bagi kebanyakan orang dewasa bekerja, pendapatan yang hilang sepanjang tempoh itu <em>lebih besar daripada bil hospital</em>. Itulah jurang yang CI wujud untuk tutup — ia perlindungan pendapatan yang menyamar sebagai insurans kesihatan.</p>
<h2>Jadi, yang mana dulu?</h2>
<p>Turutan jujur saya untuk kebanyakan orang:</p>
<ul>
<li><strong>Kad perubatan dahulu</strong> — bil hospital boleh datang esok dan ia risiko bencana yang lebih segera.</li>
<li><strong>CI kedua, tapi jangan lama</strong> — terutamanya jika ada yang bergantung pada pendapatan anda, atau keluarga ada sejarah kanser, sakit jantung atau strok.</li>
</ul>
<h2>Berapa banyak perlindungan CI yang masuk akal?</h2>
<p>Panduan biasa ialah <strong>2–3 tahun pendapatan anda</strong> — cukup untuk tempoh rawatan dan pemulihan yang realistik. Kos sangat bergantung pada umur dan kesihatan — sebab itulah bermula lebih muda jauh lebih murah.</p>
<h2>Salah faham yang paling kerap saya betulkan</h2>
<ul>
<li><em>"Kad perubatan saya cover kanser."</em> Ia cover <strong>bil rawatan</strong> kanser. Ia tak bayar sesen pun ansuran rumah anda semasa anda tak boleh bekerja.</li>
<li><em>"CI untuk orang tua sahaja."</em> Data tuntutan kata sebaliknya — dan premium jauh lebih murah dikunci semasa muda dan sihat.</li>
<li><em>"Nanti saya tambah."</em> CI melalui penilaian perubatan. Selepas satu isu kesihatan, ia mungkin tidak lagi tersedia untuk anda pada sebarang harga.</li>
</ul>
<p>Kesimpulannya: dua produk ini menjawab dua soalan berbeza. <em>Siapa bayar hospital?</em> — kad. <em>Siapa bayar keluarga saya semasa saya pulih?</em> — bayaran sekaligus CI. Pelan lengkap biasanya perlukan jawapan untuk kedua-duanya.</p>
""",
            "zh": """
<p>和新客户坐下来聊，我最常听到的问题就是：「我已经有医药卡了，为什么还需要危疾保障？」这是个好问题，而答案会改变大多数人对保障的理解。</p>
<h2>一句话说清楚区别</h2>
<p><strong>医药卡付钱给医院；危疾保障付钱给你。</strong></p>
<p>医药卡负责结清治疗账单 — 病房、手术、药物。危疾保障（CI）则是在你确诊受保的重大疾病（如癌症、心脏病、中风）时，<strong>一次性把一笔现金直接赔给你</strong>。这笔钱怎么用，完全由你决定。</p>
<h2>一个真实感的情景</h2>
<p>想象一位 35 岁的市场经理确诊早期癌症：</p>
<ul>
<li>她的<strong>医药卡</strong>处理医院的部分：手术、化疗、住院。一年可能超过 RM100,000 的账单，由保险公司承担。</li>
<li>但治疗期间她停工了 10 个月。薪水停了，车贷、房贷、给父母的家用却一个都没停。</li>
<li>她的 <strong>CI 赔付</strong> — 比如 RM200,000 — 补上中断的收入、请看护、支付非指定医院的治疗，让她安心康复，不必为钱恐慌。</li>
</ul>
<p>同一场病，两个完全不同的财务问题。医药卡解决了第一个；第二个，只有 CI 的现金能解决。</p>
<h2>为什么重病是「收入问题」，不只是「账单问题」</h2>
<p>在马来西亚，重大疾病的治疗通常意味着 6 至 24 个月无法正常工作。对大多数上班族来说，这段时间损失的收入<em>比医院账单还大</em>。这正是 CI 存在的意义 — 它本质上是披着健康保险外衣的收入保障。</p>
<h2>那么，先买哪个？</h2>
<p>对大多数人，我诚实的顺序是：</p>
<ul>
<li><strong>先医药卡</strong> — 住院账单明天就可能出现，是更紧迫的灾难性风险。</li>
<li><strong>CI 紧随其后</strong> — 尤其当有人依赖你的收入，或家族有癌症、心脏病、中风病史时。</li>
</ul>
<h2>危疾保额多少才合理？</h2>
<p>常用的经验法则是 <strong>2–3 年的收入</strong> — 足以覆盖一段现实的治疗加康复期。保费高度取决于年龄和健康状况 — 这正是越年轻投保越便宜的原因。</p>
<h2>我最常纠正的几个误会</h2>
<ul>
<li><em>「我的医药卡反正保癌症。」</em> 它保的是癌症的<strong>治疗账单</strong>。你无法工作时的房贷，它一分钱都不会出。</li>
<li><em>「CI 是老人才需要的。」</em> 理赔数据并非如此 — 而且年轻健康时投保，保费便宜得多并且锁定。</li>
<li><em>「以后再加。」</em> CI 需要核保。一旦健康出过状况，可能出多少钱都买不到了。</li>
</ul>
<p>结论：这两个产品回答的是两个不同的问题。<em>谁付医院的钱？</em> — 医药卡。<em>我康复期间谁养家？</em> — CI 的一次性赔付。完整的保障计划，通常两个问题都要有答案。</p>
""",
        },
    },
    {
        "slug": "first-time-buyer-mistakes",
        "date": "2026-07-07",
        "minutes": 6,
        "category": {"en": "Tips", "ms": "Tip", "zh": "贴士"},
        "title": {
            "en": "5 mistakes first-time policy buyers make",
            "ms": "5 kesilapan pembeli polisi kali pertama",
            "zh": "第一次买保险最常犯的 5 个错误",
        },
        "excerpt": {
            "en": "After hundreds of conversations with first-time buyers, the same five mistakes keep appearing. Every one of them is avoidable.",
            "ms": "Selepas ratusan perbualan dengan pembeli kali pertama, lima kesilapan yang sama asyik berulang. Semuanya boleh dielakkan.",
            "zh": "跟数百位第一次买保险的人聊过之后，我发现同样五个错误不断重复出现 — 而且每一个都可以避免。",
        },
        "body": {
            "en": """
<p>Buying your first policy is intimidating — the jargon, the pressure, the fear of choosing wrong. After hundreds of these conversations, I can tell you the same five mistakes appear again and again. Here they are, so you can skip them.</p>
<h2>Mistake 1: Shopping by price instead of by need</h2>
<p>"What's your cheapest plan?" is the wrong first question. A cheap plan that doesn't cover your actual risk isn't cheap — it's money spent on false security. The right sequence is: understand your situation (dependents, debts, health, savings) → identify the biggest gap → then find the most affordable way to close <em>that gap</em>. Price matters, but it comes third, not first.</p>
<h2>Mistake 2: Not disclosing health conditions honestly</h2>
<p>This is the most dangerous one. Some buyers "simplify" their medical history — that clinic visit for chest pain, the borderline blood sugar — thinking it makes approval smoother. Here's the reality: <strong>non-disclosure is the #1 reason claims get rejected</strong>. The insurer will find out during claims investigation, precisely when your family needs the money most. Declare everything. A policy with an exclusion that pays is infinitely better than a clean-looking policy that doesn't.</p>
<h2>Mistake 3: Assuming employer coverage is enough</h2>
<p>Group coverage is a genuine benefit — and a genuinely incomplete one. Typical limits of RM20,000–RM50,000 per year can be exhausted by one serious admission, and the entire benefit evaporates the day you leave the company. Treat employer coverage as a bonus layer, not a foundation. The foundation should be a policy <em>you</em> own, that follows you between jobs.</p>
<h2>Mistake 4: Waiting until you "need it"</h2>
<p>The cruel arithmetic of insurance: by the time you clearly need it, you often can't get it. Premiums rise with every birthday, and any new medical condition can mean loading, exclusions, or outright rejection. A healthy 26-year-old and a 36-year-old with high blood pressure are quoted very different prices for the same cover — if the second one is offered cover at all. Buying early isn't overcautious; it's locking in the best terms of your life.</p>
<h2>Mistake 5: Signing without understanding — and without a claims ally</h2>
<p>Two halves of the same mistake. First, know what you're buying: what's the annual limit? Is there a co-pay? What's excluded, and for how long? A good agent should explain these in plain language until they're genuinely clear. Second, remember that the person selling you the policy is also your claims support later. An agent who disappears after commission is a real risk to your family. Choose someone reachable — and test it: how fast do they reply <em>before</em> you've signed anything?</p>
<h2>The pattern behind all five</h2>
<p>Every one of these mistakes comes from treating insurance as a product to be bought quickly instead of a plan to be understood. The fix costs nothing: one honest conversation about your actual situation before any form gets filled. That's exactly what a good first consultation is for — and it should always be free and pressure-free.</p>
""",
            "ms": """
<p>Membeli polisi pertama memang menakutkan — istilah teknikal, tekanan jurujual, takut tersalah pilih. Selepas ratusan perbualan begini, saya boleh beritahu: lima kesilapan yang sama berulang setiap kali. Ini senarainya, supaya anda boleh langkau semuanya.</p>
<h2>Kesilapan 1: Memilih ikut harga, bukan ikut keperluan</h2>
<p>"Pelan paling murah apa?" adalah soalan pertama yang salah. Pelan murah yang tak melindungi risiko sebenar anda bukannya murah — ia duit yang dibayar untuk rasa selamat yang palsu. Turutan yang betul: faham situasi anda (tanggungan, hutang, kesihatan, simpanan) → kenal pasti jurang terbesar → barulah cari cara paling berpatutan untuk tutup <em>jurang itu</em>. Harga penting, tapi ia nombor tiga, bukan nombor satu.</p>
<h2>Kesilapan 2: Tidak mendedahkan keadaan kesihatan dengan jujur</h2>
<p>Ini yang paling bahaya. Ada pembeli "ringkaskan" sejarah perubatan — lawatan klinik sebab sakit dada, gula darah paras sempadan — kononnya supaya kelulusan lancar. Realitinya: <strong>ketidakdedahan adalah punca #1 tuntutan ditolak</strong>. Syarikat insurans akan tahu semasa siasatan tuntutan, tepat ketika keluarga anda paling perlukan duit itu. Isytiharkan semuanya. Polisi dengan pengecualian yang membayar adalah jauh lebih baik daripada polisi nampak bersih yang tidak membayar.</p>
<h2>Kesilapan 3: Menganggap perlindungan majikan sudah cukup</h2>
<p>Perlindungan berkumpulan memang satu kelebihan — tetapi ia tidak lengkap. Had tipikal RM20,000–RM50,000 setahun boleh habis dengan satu kemasukan serius, dan seluruh manfaat lenyap pada hari anda tinggalkan syarikat. Anggap perlindungan majikan sebagai lapisan bonus, bukan asas. Asas sepatutnya polisi milik <em>anda sendiri</em> yang ikut anda ke mana-mana.</p>
<h2>Kesilapan 4: Menunggu sampai "betul-betul perlu"</h2>
<p>Aritmetik kejam insurans: bila anda jelas memerlukannya, selalunya anda sudah tak boleh dapatkannya. Premium naik setiap tahun umur, dan sebarang masalah kesihatan baharu boleh bermakna caj tambahan, pengecualian, atau penolakan terus. Orang sihat berumur 26 tahun dan orang berumur 36 tahun dengan darah tinggi akan dapat harga sangat berbeza untuk perlindungan sama — itu pun kalau yang kedua masih ditawarkan. Membeli awal bukan terlalu berhati-hati; ia mengunci terma terbaik seumur hidup anda.</p>
<h2>Kesilapan 5: Tandatangan tanpa faham — dan tanpa rakan tuntutan</h2>
<p>Dua bahagian kesilapan yang sama. Pertama, tahu apa yang anda beli: berapa had tahunan? Ada ko-bayaran? Apa yang dikecualikan, berapa lama? Ejen yang baik akan terangkan dalam bahasa mudah sehingga anda betul-betul jelas. Kedua, ingat: orang yang jual polisi itu juga sokongan tuntutan anda kelak. Ejen yang hilang selepas dapat komisen adalah risiko sebenar kepada keluarga anda. Pilih orang yang boleh dihubungi — dan uji dulu: berapa cepat dia balas mesej <em>sebelum</em> anda tandatangan apa-apa?</p>
<h2>Corak di sebalik kelima-limanya</h2>
<p>Semua kesilapan ini datang daripada melayan insurans sebagai produk untuk dibeli cepat-cepat, bukan pelan untuk difahami. Penyelesaiannya percuma: satu perbualan jujur tentang situasi sebenar anda sebelum sebarang borang diisi. Itulah gunanya konsultasi pertama yang baik — dan ia sepatutnya sentiasa percuma dan tanpa paksaan.</p>
""",
            "zh": """
<p>第一次买保险确实让人发怵 — 满纸术语、推销压力、怕选错的恐惧。聊过几百次之后，我可以告诉你：同样五个错误反复出现。写在这里，让你可以直接绕开。</p>
<h2>错误一：按价格挑，而不是按需要挑</h2>
<p>「最便宜的方案是哪个？」是错误的第一个问题。一份保不住你真实风险的便宜保单并不便宜 — 那是花钱买假的安全感。正确的顺序是：先了解自己的情况（家庭负担、债务、健康、积蓄）→ 找出最大的缺口 → 再找最实惠的方式去补<em>那个缺口</em>。价格重要，但它排第三，不是第一。</p>
<h2>错误二：健康状况不如实申报</h2>
<p>这是最危险的一个。有些人会「简化」病史 — 那次因胸口痛看诊、那次血糖偏高 — 以为这样批得快。现实是：<strong>不如实申报是理赔被拒的头号原因</strong>。保险公司会在理赔调查时查出来，而那恰恰是你家人最需要这笔钱的时候。全部如实申报。一份带除外条款但会赔的保单，远胜一份看起来干净却不赔的保单。</p>
<h2>错误三：以为公司的团体保险就够了</h2>
<p>团体保障是真福利 — 也是真的不完整。常见的年度限额 RM20,000–RM50,000，一次严重住院就可能用完；而且离职当天，整个保障立刻消失。把公司保障当成加分层，而不是地基。地基应该是一份<em>属于你自己</em>、换工作也跟着你走的保单。</p>
<h2>错误四：等到「需要的时候」才买</h2>
<p>保险残酷的数学：当你明确需要它时，往往已经买不到了。保费随每个生日上涨，任何新的健康问题都可能带来加费、除外、甚至直接拒保。26 岁的健康年轻人和 36 岁有高血压的人，同样的保障报价天差地别 — 后者能不能投保还是未知数。早买不是过度谨慎，而是锁定你这辈子最好的条款。</p>
<h2>错误五：没搞懂就签名 — 而且身边没有理赔战友</h2>
<p>这是同一个错误的两半。第一，搞清楚你买的是什么：年度限额多少？有没有共同承担？哪些不保、不保多久？好的代理应该用大白话解释到你真正明白为止。第二，记住：卖你保单的人，也是你日后理赔时的支援。拿了佣金就消失的代理，对你的家人是实实在在的风险。选一个找得到人的 — 并且提前测试：<em>还没签单之前</em>，他回复信息有多快？</p>
<h2>五个错误背后的共同点</h2>
<p>这五个错误都源自同一件事：把保险当成一件要「赶快买掉」的商品，而不是一份要「先弄懂」的计划。解药是免费的：在填任何表格之前，先来一次关于你真实情况的诚实对话。这正是一次好的首次咨询的意义 — 而它应该永远免费、永远没有压力。</p>
""",
        },
    },
]

# ────────────────────────────────────────────────────────────────
# Templates
# ────────────────────────────────────────────────────────────────

def rel(lang):
    """Path prefix from a page in this language folder back to site root."""
    return "../" if lang == "en" else "../../"

def page_url(lang, fname):
    sub = "" if lang == "en" else lang + "/"
    return f"{SITE}/blog/{sub}{fname}"

def sibling_href(from_lang, to_lang, fname):
    """Relative link from a page in from_lang to the same page in to_lang."""
    if from_lang == "en":
        return fname if to_lang == "en" else f"{to_lang}/{fname}"
    if to_lang == "en":
        return f"../{fname}"
    return fname if to_lang == from_lang else f"../{to_lang}/{fname}"

def hreflangs(fname):
    lines = []
    for l in LANGS:
        lines.append(f'<link rel="alternate" hreflang="{HTML_LANG[l]}" href="{page_url(l, fname)}"/>')
    lines.append(f'<link rel="alternate" hreflang="x-default" href="{page_url("en", fname)}"/>')
    return "\n".join(lines)

def fonts(lang):
    base = "family=Sora:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,500;0,600;0,700;1,500;1,600"
    if lang == "zh":
        base += "&family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@600;700"
    return f"https://fonts.googleapis.com/css2?{base}&display=swap"

def pills(lang, fname):
    out = ['<div class="lang-pills" aria-label="Language">']
    for l in LANGS:
        cls = "pill active" if l == lang else "pill"
        out.append(f'<a class="{cls}" href="{sibling_href(lang, l, fname)}" hreflang="{HTML_LANG[l]}">{PILL_LABEL[l]}</a>')
    out.append("</div>")
    return "".join(out)

def header(lang, fname):
    u, r = UI[lang], rel(lang)
    blog_home = "index.html" if lang == "en" else "index.html"
    return f"""
<nav id="bnav">
  <div class="wrap bnav-in">
    <a href="{r}index.html" class="bnav-brand">
      <img src="{r}assets/img/allianz-logo.jpg" alt="Allianz"/>
      <span>Chin Yue Hau <small>· {u['blog']}</small></span>
    </a>
    <div class="bnav-links">
      <a href="{r}index.html">{u['home']}</a>
      <a href="{blog_home}" class="on">{u['blog']}</a>
      <a href="{r}index.html#lead" class="btn btn-gold bnav-btn">{u['quote']}</a>
      <a href="{WA}" target="_blank" rel="noopener" class="btn btn-green bnav-btn">💬</a>
    </div>
  </div>
</nav>"""

def cta(lang):
    u, r = UI[lang], rel(lang)
    import urllib.parse
    wa = WA + "?text=" + urllib.parse.quote(u["wa_msg"])
    return f"""
<div class="post-cta">
  <h3>{u['cta_h']}</h3>
  <p>{u['cta_p']}</p>
  <div class="post-cta-btns">
    <a class="btn btn-gold" href="{r}index.html#lead">{u['cta_quote']}</a>
    <a class="btn btn-green" href="{wa}" target="_blank" rel="noopener">{u['cta_wa']}</a>
  </div>
</div>"""

def footer(lang):
    u = UI[lang]
    return f"""
<footer class="bfoot">
  <div class="wrap">
    <p class="bfoot-disc">{u['disclaimer']}</p>
    <div class="bfoot-line">
      <span>© 2026 Chin Yue Hau · PIP Agency · SBS Team Sdn Bhd</span>
      <span class="bfoot-code">Allianz Agent Code <b>241514-3</b></span>
    </div>
  </div>
</footer>"""

def head(lang, fname, title, desc, jsonld=""):
    u, r = UI[lang], rel(lang)
    return f"""<!DOCTYPE html>
<html lang="{HTML_LANG[lang]}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>{title} | {u['meta_suffix']}</title>
<meta name="description" content="{desc}"/>
<meta property="og:title" content="{title}"/>
<meta property="og:description" content="{desc}"/>
<meta property="og:type" content="article"/>
<link rel="canonical" href="{page_url(lang, fname)}"/>
{hreflangs(fname)}
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="{fonts(lang)}" rel="stylesheet"/>
<link rel="stylesheet" href="{r}assets/css/styles.css"/>
<link rel="stylesheet" href="{r}assets/css/blog.css"/>
{jsonld}
</head>
<body class="blog{' zh' if lang == 'zh' else ''}">"""

def post_jsonld(p, lang, fname):
    import json
    data = {
        "@context": "https://schema.org", "@type": "BlogPosting",
        "headline": p["title"][lang], "description": p["excerpt"][lang],
        "datePublished": p["date"], "inLanguage": HTML_LANG[lang],
        "mainEntityOfPage": page_url(lang, fname),
        "author": {"@type": "Person", "name": "Chin Yue Hau",
                   "jobTitle": "Allianz Life Financial Advisor",
                   "identifier": "Allianz Agent Code 241514-3"},
        "publisher": {"@type": "Organization", "name": "Chin Yue Hau — Allianz Financial Advisor"},
    }
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + "</script>"

def post_page(p, lang):
    u = UI[lang]
    fname = p["slug"] + ".html"
    date_h = p["date"]
    body = f"""{head(lang, fname, p['title'][lang], p['excerpt'][lang], post_jsonld(p, lang, fname))}
{header(lang, fname)}
<div class="art-hero">
  <div class="wrap">
    <a class="art-back" href="index.html">{u['back']}</a>
    <div class="art-meta">
      <span class="chip-cat">{p['category'][lang]}</span>
      <span>{u['published']} {date_h}</span><span>·</span><span>{p['minutes']} {u['read']}</span>
    </div>
    <h1 class="art-h1">{p['title'][lang]}</h1>
    {pills(lang, fname)}
  </div>
</div>
<main class="wrap">
  <article class="art-body">
{p['body'][lang].strip()}
  {cta(lang)}
  </article>
</main>
{footer(lang)}
</body>
</html>
"""
    return fname, body

def index_page(lang):
    u = UI[lang]
    fname = "index.html"
    cards = []
    for p in POSTS:
        href = p["slug"] + ".html"
        cards.append(f"""
    <a class="post-card" href="{href}">
      <div class="pc-top"><span class="chip-cat">{p['category'][lang]}</span><span class="pc-min">{p['minutes']} {u['read']}</span></div>
      <h2>{p['title'][lang]}</h2>
      <p>{p['excerpt'][lang]}</p>
      <span class="pc-more">{'Read article →' if lang=='en' else ('Baca artikel →' if lang=='ms' else '阅读全文 →')}</span>
    </a>""")
    body = f"""{head(lang, fname, u['index_title'], u['index_sub'])}
{header(lang, fname)}
<div class="art-hero">
  <div class="wrap">
    <div class="art-meta"><span class="chip-cat">{u['blog']}</span></div>
    <h1 class="art-h1">{u['index_title']}</h1>
    <p class="index-sub">{u['index_sub']}</p>
    {pills(lang, fname)}
  </div>
</div>
<main class="wrap">
  <div class="post-grid">{''.join(cards)}
  </div>
  <article class="art-body" style="padding-top:0">{cta(lang)}</article>
</main>
{footer(lang)}
</body>
</html>
"""
    return fname, body

def sitemap():
    urls = [f"{SITE}/"]
    entries = [f"""  <url><loc>{SITE}/</loc></url>"""]
    fnames = ["index.html"] + [p["slug"] + ".html" for p in POSTS]
    for fname in fnames:
        for l in LANGS:
            alts = "".join(
                f'<xhtml:link rel="alternate" hreflang="{HTML_LANG[a]}" href="{page_url(a, fname)}"/>'
                for a in LANGS
            ) + f'<xhtml:link rel="alternate" hreflang="x-default" href="{page_url("en", fname)}"/>'
            entries.append(f"  <url><loc>{page_url(l, fname)}</loc>{alts}</url>")
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
            'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
            + "\n".join(entries) + "\n</urlset>\n")

def write(path, content):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with io.open(full, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print("wrote", path)

def main():
    for lang in LANGS:
        sub = "blog" if lang == "en" else f"blog/{lang}"
        fname, html = index_page(lang)
        write(f"{sub}/{fname}", html)
        for p in POSTS:
            fname, html = post_page(p, lang)
            write(f"{sub}/{fname}", html)
    write("sitemap.xml", sitemap())
    write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n")

if __name__ == "__main__":
    main()
