---
layout: post
title: "Homepage hackathon"
permalink: /homepage-hackathon/
date: 2019-05-21 14:12:00 +0200
author: Jiří Vích
tags: [hackathon, homepage]
categories: [blog, meetupy_a_konference, design]
---

Sotva na Ještědu roztál poslední sníh, vyrazili jsme s vývojem pracovat mimo naši komfortní zónu. Zaklapli jsme notebooky, sbalili pár věcí a nasedli do aut směr chalupa vzdálená jen několik kilometrů od Mácháče. Z kanceláře rovnou do divočiny!

## Promyšlený plán a přípravy

Celá akce měla promyšlený plán. Deset vývojářů, dva scrum masteři, dva produkťáci a jeden SEO analytik **vytvoří za dva dny zbrusu novou domovskou stránku Heureky,** která bude responzivní a plně funkční. Byla to pořádná výzva!

Po příjezdu jsme rozpálili gril s pravou polskou hovězí argentinou, popili pár piv a pustili se do plánování. Z předem připraveného návrhu, který prošel cestou product discovery, bylo potřeba vysekat samostatně funkční celky a ze všech vývojářů jsme museli postavit tři až čtyři funkční a efektivní týmy. Povedlo se!

![relax před chalupou](/assets/homepage-hackathon/hackathon-1.jpg)

## Začínáme makat!

Následující den jsme zasedli k počítačům, rozběhali základní skeleton a začaly se dít věci. Tým jedna pracoval na hlavičce, odděloval vyhledávací pole do nového karuselu, tým dva ladil backend a frontend pro výpis kategorií a tým tři se pustil do jednotlivých bloků stránky. Postupně se to formovalo a byla to jízda!

Další ráno jsme začali prezentací výsledků z předchozího dne, synchronizovali jsme se v tom, co je potřeba dodělat a šli jsme na věc.

![makáme o sto šest](/assets/homepage-hackathon/hackathon-3.jpg)

## Jakou jsme zvolili technologii?

Homepage je naše vizitka a je nutné, aby se načítala rychle. Rozhodli jsme se jít cestou generování statických stránek, k čemuž jsme použili generátor [Hugo](https://gohugo.io/). Celá stránka je responzivní a Selenium testy hlídají, že homepage obsahuje to, co má. Vyleštěný CI proces se pak stará o deploy do našeho kubernetes clusteru.

## A výsledek?

Pracovali jsme spolu, pracovali jsme odděleně. Pracovali jsme v kuchyni, v obýváku, venku na lavici. Pracovali jsme ve dne, v noci. Pracovali jsme o sto šest pro jednu jedinou věc. **Pracovali jsme pro novou homepage!**

![prezentujeme výsledky](/assets/homepage-hackathon/hackathon-2.jpg)

Povedlo se! Novou homepage jsme po krátkém AB testu nasadili na mobilní Heureku! Nyní budeme ladit poslední detaily a brzy ji vypustíme i na desktop.

**Akce tohoto typu vnáší do našich týmů energii, rozbíjí kancelářský stereotyp a stmelují lidi.** Máme je rádi.

![nová homepage](/assets/homepage-hackathon/heureka-1.png)
![nová mobilní homepage](/assets/homepage-hackathon/heureka-2.png){: width="300px"}
