---
layout: post
title: "Vánoční nadílka"
permalink: /vanocni-nadilka/
date: 2016-12-14 13:00:00 +0200
author: Michal Humpula
tags: networking
categories: [blog, ops_a_devops]
---

O sysadminech v Heurece se dá říci leccos, nedostatek paranoie to ale není. Máme
zdvojené téměř všechno. Každý server má dva zdroje, každý napájený z jiné větve
na jiném jističi, z každého serveru vedou dva síťové kabely do switche a většina
takových serverů obsahuje nějaké raidové pole. Celé systémy jsou taktéž
zdvojené: balancery, DNS servery, databáze, atd. A v neposlední řadě máme
servery umístěny ve dvou datacentrech.

Motivací je mít funkční alespoň část služeb, i když v jednom datacentru dojde k
fatálnímu výpadku (typicky napájení). Protože srdce českého internetu se
v podstatě nachází pouze v Praze, nemá smysl umisťovat druhé datacentrum někam
daleko od prvního (slovenská játra odbavíme pohodlně i z Prahy). Výhoda je
zřejmá. Zatímco při druhé lokalitě serverů, například v Německu, bychom museli
řešit nějakou vzdálenou replikaci dat, mezi dvěma datacentry v Praze můžeme
využít některý ze spousty optických propojů, které jsou v ní natažené.
Typická odezva mezi serverovnami je pak v řádu stovek mikrosekund. Služby tak
nemají šanci poznat, jestli se připojují na server vedle, nebo v jiné pražské
části, a mohou všechny žít v iluzi jedné LAN sítě.

Protože jsme paranoidní a historie nás poučila, s jakou jistotou jsou bagristé
schopni najít optické kabely v zemi, máme samozřejmě zdublované i optické trasy
mezi datacentry. Každá vede jinudy, kabel patří jiným společnostem a my si
pronajímáme pouze tzv. lambdu na každé trase. Prakticky to pak vypadá tak, že
pokud je potřeba například vyměnit transceiver, který do optiky svítí, tak se
jednoduše odpojí, aktivní prvek na to během pár mikrosekund zareaguje a začne
posílat data pouze po druhé trase. Software, který síť používá, nemá šanci
poznat, že se něco stalo.

V pondělí 12. 12. ve tři hodiny ráno došlo k odpojení obou datacenter od sebe a
nastal stav takzvaného split brainu. Každé z datacenter si myslelo, že to druhé
neběží. Stav, který lze stěží popsat jako ideální.

Resuscitovat polomrtvý Apache webserver se naučí každý sysdamin junior během pár
týdnů. Nahodit zpět propojení mezi datacentry, když vlastně nefunguje správně
síť ani na jedné straně, je trochu jiný level. Řešení nijak nepomáhají ani
opakované připomínky vaší šišinky, že máte spát.

Poté, co vás vzbudí externí monitoring (ten interní je mrtvý, protože je v
síti, která nefunguje), se snažíte zjistit, co se děje. Připojit se do VPN,
podívat se do monitoringu. Monitoring hlásí, že nejede. Možná spadla mašina s
monitoringem, říkáte si... jak postupně osaháváte jednotlivé servery, zjistíte,
že se dělí
do dvou skupin přesně podle datacenter. Přichází první pracovní hypotéza:
"Islámský stát
shodil letadlo na jedno z DC."
Důsledky: 1) projdeme všechno, aby to běželo jen v jednom DC, 2) jupí, míň
hardware na správu!

Heureka má svoje vlastní [AS][as]. V každém datacentru jsou dva routery (protože
pokud přijdete o konektivitu, tak neopravíte nic, ani problém s konektivitou).
Celé schema tak vypadá přibližně takto

![Schema](/assets/vanocni-nadilka/Routers.svg){: .center-image }

Rychlý test ukázal, že oba dva routery v druhém datacentru stále odpovídají.
Domněnka o bombardování tím padá a unavený mozek začíná chápat, že se stalo něco
hodně ošklivého. Podle všeho obě datacentra nejspíš jedou, ale nevidí na sebe.
Kontrola na hotline v datacentru potvrzuje, že neevidují přistání žádného
letadla na střeše.

Routovací protokol BGP, který realizuje IP konektivitu do internetu, pracuje tak,
že ohlašuje cílové sítě svým sousedům. Pokud máte čtyři routery, tak obvykle
propagují všechny čtyři do internetu jeden síťový prefix a pakety už někudy
protečou, je jedno přes který konkrétní router. O tom, který router je použit,
rozhoduje dle své libovůle odesílací router. Obvykle to však
dělá tak, že si jeden vybere a toho se drží, dokud nedojde k nějaké změně.
Router mého ISP si vybral jeden z routerů v prvním datacentru a toho se držel.
Proto jsem se připojil přes VPN do prvního datacentra. Zbývá vyřešit otázku, jak
se dostat do druhého, aby bylo možné analyzovat stav v něm.

Odpověď je jednoduchá. Najdi takový systém, který leží za routerem a který
odesílá data na router do druhého datacentra. Po chvilce pátraní se kolegovi
daří takový najít. Následuje zprovoznění přístupu přímo na statické adresy
routerů, čímž je možné se spojit do druhého datacentra bez nutnosti použít
nějakou speciální mezisíť.

V Heurece máme hodně serverů, ale zase jich není tolik, abychom se nevlezli do
dvou racků v každém datacentru. Když si odhadnete počet potenciálních
ethernetových přípojek v obou racích, zjístíte, že je
zvládne pokrýt jeden switch. Protože ale potřebujete redundanci, tak jste na
dvou switchích na každou lokalitu. Na výběr máte pár variant, jak pokrýt celou
síť a) do kruhu b) každý s každým c) chytré řešení.

V první variantě vytvoříte ze switchů kruh.

![Switche v kruhu](/assets/vanocni-nadilka/Switches_circle.svg){: .center-image }

Aby se nezbláznil traffic a nezačal
cyklit, tak nastavíte na komunikačních portech Spanning Tree Protocol. Switche
sice budou zapojené do kruhu, ale jedna z linek nebude využívána a logicky tak
budou tvořit šňůru o čtyřech uzlících.

Druhá varianta je jen komplikovanější
první. Její nevýhoda jsou další dva propoje mezi datacentry.

![Switche do kříže](/assets/vanocni-nadilka/Switches_cross.svg){: .center-image }

Chytré řešení spočívá v použití chytrého hardware. Heureka vlastní čtyři switche
[Cisco Nexus 5596-T][nexus]. Nejlepší způsob jak propojit server se switchem
po dvou kabelech je použít LACP. V Cisco hantýrce se tomu říká PortChannel, v
Linuxu se jedná o bonding (LACP mode). Protistrany si pravidelně posílají
kontrolní rámce, aby se domluvily, která linka má jak fungovat a data nakonec
chodí po obou dvou. Pokud některá z linek spadne, data proudí už jen po jedné.
Nexusy umí ale ještě jeden trik navíc. PortChannel přes dva switche, kdy každý z
portů je na jiném switchi. V Cisco hantýrce se jedná o virtuální PortChannel,
zkráceně vPC. Zapojení do vPC předchází trochu hrůzostrašnější konfigurace, ale
ve výsledku je pak server připojen jedním kabelem na dva různé switche, aniž by o
tom tušil. Pokud umře nejenom linka, ale dokonce celý switch, server je stále
připojený do sítě.

Z pohledu serverů tak máme v každém datacentru jen jeden switch. Software není
schopný rozlišit kudy chodí, ani že se jedná o dva fyzicky oddělené síťové
prvky. vPC se dá použít nejenom mezi serverem a switchem, ale i mezi switchem a
switchem. Takže spojit dvě datacentra je teď jednodušší, neboť v každém je
vlastně jen "jeden" switch, který potřebuje jednu virtuální linku na switch vedlejší.
Fyzicky jsou switche zapojeny do kruhu, ale logicky se jedná o dva switche
spojené jedním kabelem.

![Switche single linka](/assets/vanocni-nadilka/Switches_single.svg){: .center-image }

V důsledku tak není potřeba Spanning Tree, data fyzicky
tečou všemi linkami a nejdelší cesta narozdíl od prvního zapojení je maximálně
dva hopy (lokální switch + remote switch).

Nakolik je vPC efektivní způsob jak zjednodušit síť, tak má jeden problém. Při
první inicializaci vPC je potřeba nahodit všechny fyzické linky. Switche si musí
ověřit, že je celé propojení v rozumně definovaném stavu. Pak už může dojít k
libovolnému přepínání.

Tři dny před výpadkem došlo ke třem chybám od dvou různých lidí, které mělo za
následek fyzické odpojení jedné z optických tras. Záhy poté si monitoring poznamenal
novou hodnotu stavu portu, ale kvůli chybně nastavené podmínce vyhodnocení
problému nevygeneroval žádný alert. Oba dva switche změnu stavu portu odeslaly
na logovací server, kde byl vyveden report a odeslán síťaři. Přestože u nás
obvykle nedochází k častým změnám na portech, několik dní předtím docházelo k
údržbě na jednom ze serverů a jeho opakovaným restartům a znovu připojením do
sítě. Report se tak podařilo v záplavě dalších přehlédnout.

Nicméně i nadále Heureka jela a vše bylo v pořádku. Až do pondělí ve tři hodiny
ráno, kdy došlo k další lidské chybě. Při rutinním přepojování technik omylem na
chvíli odpojil propoj, který realizoval doposud funkční druhou linku mezi
datacentry Heureky. Chybu zjistil poměrně záhy, takže ostatní zákazníci sdílející
stejné vlákno zaznamenali pouze krátký flap (nahoru a dolů) linky a to bylo vše.
V případě Heureky bylo odpojení ale natolik dlouhé, že se vPC kanál dostal do
výchozího neinicializovaného stavu. I po znovupropojení se switche nebyly
schopné znovu domluvit s druhou stranou.

Switche bývají obvykle vybaveny sériovou linkou, protože když už se vám podaří
odříznout switch od sítě, tak je to jediný způsob, jak se na něj připojit.
Protože máme čtyři routery, které jediné jsou vidět z internetu, když
potenciálně zkolabuje vnitřní síť, tak dává smysl mít sériovou linku
připojenou z každého switche na korespondující router. Po alespoň částečném
obnovení připojení do druhého datacentra se tak dalo rovnou přihlásit na switche
a zjistit, že obě dvě linky mezi DC jsou skutečně mrtvé. Pokus o nahození
selhal. Z logu bylo patrné, že jedna z linek umřela o dva dny dříve. Telefonát s
obsluhou datacentra zajišťujícího optický propoj potvrdil, že nemají hlášený
žádný síťový výpadek. První vina tedy padla na optické transceivery, které se
nedávno měnily s přechodem na novou technologii svícení. Sehnat ve tři hodiny
ráno náhradní transceiver není úplně rychlá záležitost. Závěr byl tedy jasný.
Došlo ke split brainu mezi datacentry a oprava potrvá docela dlouho.

Část týmu si vzala na starost rozběhnutí co nejvíce služeb v datacentru, kde
běžel hlavní databázový master. Druhá část týmu šla vypnout BGP propagaci v
druhém datacentru a tím se ujistit, že všechen traffic poteče do správné půlky.
Další na řadě bylo přijít na to, jak narychlo získat alespoň nějakou
konektivitu mezi půlkami.

Všechny čtyři routery jsou připojené do jednoho peeringového centra, každý přes
10Gbps linku. Propustnost je tedy teoreticky stejná jako na interním propoji.
Řešení se tedy nabízí samo. Zabalit veškerý síťový provoz do IP trafficu a
posílat jej přes peeringovou síť. Na podobné hrátky se používá [GRE][gre]
protokol, kterým se dají simulovat L1 kabely nad IP vrstvou. Zbývalo vybrat dva
routery, nakonfigurovat na nich GRE interface reprezentující linku na druhý
router, jeden z kabelů vedoucích ze switche do routeru izolovat a pustit na něj
všechny VLANy a všechno to spojit dohromady na obou routerech. Heureka!

Bohužel trafic sice chodil, ale docházelo k pravidelným výpadkům, takže linka
byla nepoužitelná. V tuto chvíli se už naštěstí podařilo dostat do
provozuschopného stavu Heureku v prvním datacentru. Tým jedna zabodoval. Nápady
na spojení s druhým však došly.

Nevíš-li si rady, najdi zkušenějšího člověka. Poslední varianta bylo najít a
vzbudit technika, který má na starosti správu optických linek a najít s ním
nějaké řešení. Protože už pomalu svítalo, podařilo se to docela brzy. Ukázalo
se, že náhradní modul existuje, a tedy půjde nahodit nejspíše jednu z tras.
Následoval odjezd do datacentra a proměřování signálu. Jedna z linek byla
skutečně opticky nepropustná, druhá ale fungovala. Došlo tedy k
výměně transceiverů na druhé lince, ale spojení stále odmítalo naskočit.
Zdůvodnění na switchi dávalo tušit, že problém bude právě ve vPC configuraci.
Jedna nezálohovaná linka je lepší, než žádná, tudíž došlo velmi rychle k
překonfigurování portů na obou stranách a po několika hodinách úsilí se obě
strany sítě zase setkaly.

Split brain není hezká situace, ale většina systémů si s ním u nás docela
poradila. Buďto neběžela vůbec nebo byla v read-only stavu. Ten zbytek jsme
museli dát v následujících hodinách manuálně do pořádku, což bylo výrazně
jednodušší než řešení předchozího problému.

Popsaný případ je nádherná ukázka kumulování lidské chyby až nakonec celková
masa chyb dokáže překročit technickou bariéru, která měla zamezit vzniku
fatálního problému. Závěr z post mortem analýzy výstižně popisuje celou událost:

> Šance na souběh těchto dvou problémů se limitně blíží nule. Přesto tento stav
> nastal.

[as]: https://apps.db.ripe.net/search/lookup.html?source=ripe&key=AS59871&type=aut-num
[nexus]: http://www.cisco.com/c/en/us/products/switches/nexus-5596t-switch/index.html
[gre]: https://en.wikipedia.org/wiki/Generic_Routing_Encapsulation
