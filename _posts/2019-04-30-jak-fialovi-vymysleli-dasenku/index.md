---
layout: post
title: "Jak Fialoví vymýšleli Dášenku, aneb nové párování nabídek"
permalink: /jak-fialovi-vymysleli-dasenku/
date: 2019-04-30 13:00:00 +0200
author: David Jetelina
tags: [ml, backend, architektura]
categories: [blog, kod]
---

Již hrozně dlouhou dobu jsme ve fialovém týmu věděli, že nás jednoho dne čeká
neuvěřitelně zábavný projekt. Před zhruba 2 lety pro něj vznikly podklady,
takže jediné co mu stálo v cestě byly priority. Hrozně rádi bychom se teď
pochlubili, že projekt se stal prioritou a teď bychom vám o něm chtěli něco říct!

## Lehký úvod do problematiky

Jeden z klíčových pilířů Heureky je umět říct, které nabídky eshopů patří
k sobě. Momentálně naše párování funguje tak, že vezmeme název produktu nabídky
(interně je produkt nadřazený objekt, na něj se vážou nabídky - konkrétní od
obchodů), kterou nám obchod poskytnul a zkoušíme najít shodu s jinou nabídkou.
Nad názvem sice provádíme nějaké operace, aby bylo jednodušší shodu najít,
ale úspěšnost aktuálního řešení není nijak valná. 
Navíc, párujeme nabídky na nabídky, aby manuální práce našich administrátorů 
potom nemusela být dvojí.

### Příklad

Nabídka `Aa` tvoří produkt `A`. Potom se objeví nabídka `Ab`, administrátor
rozhodne, že jde taky o produkt `A` a napáruje ho na nabídku `Aa`
(ze které byl vytvořen produkt A), i když má název trošku jiný.
Potom, když se objeví další nabídka `bA`, dokážeme říct, že je to stejná nabídka
jako `Ab`, napárovat ji k ní a skrz ní k produktu `A`.

Toto je jeden z důvodů, proč vyžadujeme od obchodů, aby dodržovaly pojmenování
produktů podle pravidel příslušné kategorie. I přes toto opatření je stále počet
produktů, které musí administrátoři párovat ručně obrovský.

Naše nové řešení snad přinese daleko více výhod, měříme a budeme měřit spoustu
aspektů, ale tady jsme na blogu HeurekaDevs, nikoliv HeurekaProductManagers,
takže si dovolím přejít dál.

## Vymýšlení nového řešení

Díky výše zmiňované přípravě jsme věděli, že chceme jít cestou Machine Learningu.
Laicky - chceme poslat do kouzelné krabičky pár produkt-nabídka a dostat zpátky
číslo, které řekne, na kolik si je krabička jistá, že jsou totožné.
Algoritmy pro shlukování by samy o sobě pravděpodobně nebyly dostatečně
přesné, proto je využijeme jen k výběru kandidátů. Stejně tak si nevystačíme
pouze s klasifikačními algoritmy, není úplně reálné párovat nabídku proti
všem produktům - vytahovat pro každou nabídku informace o všech milionech produktů
z databáze a následně nad tím vším ještě něco počítat je při takovém množství
prostě příliš drahá operace.

Abych nezapomněl, nové řešení nechceme nasazovat najednou z ničeho nic na celou
Heureku. Máme tedy ještě jeden menší problém, párovat novým způsobem pouze
jednu kategorii.

Dali jsme si tedy úvodní schůzku, k vymýšlení architektury MVPčka - našeho
velkého cíle pro tento kvartál - do začátku července.

Na začátku jsme si rozdělili jeden velký problém na 4 menší, tedy:

* Kandidáti pro klasifikaci
* Získávání dat
* Výpočet signálů nad daty pro každý pár (nabídka-kandidát)
* Klasifikace (a vyhodnocení)

Pak už nám zbývalo jen to nejkrásnější, vzít abstraktní problémy a rozvrhnout je
na komponenty, které musí zapadnout někam do stávajícího fungování.

Hrubý náčrt vypadal zhruba takto:

**Vstup**: ID nabídky

-> Služba pro výběr kandidátů (+ rozhodnutí, jestli patří do nového párování)

**Výstup**: ID nabídky - X ID produktů (kde X je počet kandidátů, které chceme získat)

```json
{
    "offerId": 352351,
    "productIds": [
        12312,
        412551,
        ...
    ]
}
```

-> Služba, která získá data a vypočítá z nich signály

**Výstup**: ID nabídky - ID produktu - vypočtené signály

```json
{
    "offerId": 352351,
    "productId": 412551,
    "signals": {
        "NameLevenshtein30": 0.85,
        "NameEquality": 0
        ...
    }
}
```

-> Klasifikační služba

-> ? (Akce s nabídkou - přidat k produktu, k manuálnímu rozhodnutí...)

navíc bokem služba pro kalibraci a vytváření magických krabiček :)

## Buzzwordy a technologie

Jedna věc nám byla hned jasná, pro výběr kandidátů využijeme ElasticSearch,
který nám zatím slouží k vyhledávání a filtrování. Konkrétní implementaci
dotazu, který zohlední ty správné atributy ještě nemáme, ale technicky
bychom neměli narazit na žádný problém.

Vzhledem k tomu, že v elasticu nemáme uložené kompletní dokumenty, ale pouze
jejich inverzní indexy, vrátí se nám zpět jen odpovídající IDčka. Na základě
nich vyhodnotíme, jestli se jedná o kategorii, která nás zajímá a buď pošleme
nabídku dál, nebo ji vrátíme ke zpracování starémů způsobu párování.

Vybírání kandidátů je jedna z nejkritičtějších částí celého řešení. Proto už teď
víme, že bude důležité měřit, jak funguje - pokud se nepovede na konci
napárovat automaticky, tak až někdo napáruje ručně, podívat se zpět, jestli
správný produkt vůbec mezi kandidáty byl.

Získávání dat a vypočítávání signálů není nijak komplikované, máme páry, dotaháme
si k nim z naší databáze všechny data, podle toho do které kategorie produkt patří,
nad nimi vypočítáme signály a nakonec to pošleme dál. Technicky je to
trochu zajímavější a rád bych šel do detailu, ale o tom snad někdy příště.

Klasifikační služba by také neměla být moc složitá - předpokládá, že
si bude moct sáhnout někam pro krabičku příslušné kategorie, které pošle signály
a dostane z ní výsledky - z toho vybere ten nejlepší a bude.

Celé to propojíme frontami/messagingem (momentálně to vypadá na NATS streaming),
abychom  mohli jednotlivé části škálovat nezávisle na sobě. Starému párování
ukradneme frontu, strčíme za ni službu pro kandidáty, která to starému párování
případně zase bude vracet.

Naschvál jsme se moc nevěnovali tvorbě krabiček, tedy tomu samotnému učení
všech těch strojů. Cíl je MVP, takže nám bude stačit vytvořit krabičku jednu,
pro naši kategorii. Fialový tým není až tak veliký, abychom toho za kvartál
stihli o moc víc (pojďte nám pomoct ;)), takže boj s učením je zatím odložen
na další kvartály.

## Závěr

To by byl výstup ze schůzky. To a naněkolikrát popsaná tabule se všemi možnými
detaily, vše řádně vyfoceno a komponenty rozebrány každým z nás, aby se z nich
staly úkoly do našich nastávajících sprintů.

... a tak jsme v týmu fialových vymysleli nejen DaSenku (Data and Signals),
ale celou architekturu MVP nového párování. Teď už to jen celé naprogramovat a uvidíme,
jestli jsme to vymysleli dobře, o což se tady rádi podělíme :)

