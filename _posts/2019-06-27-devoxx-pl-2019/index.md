---
layout: post
title: "Devoxx PL 2019"
permalink: /devoxx-pl-2019/
date: 2019-06-27 09:00:00 +0200
author: Honza Haering
tags: [konference, devoxx]
categories: [blog, meetupy_a_konference]
---

Zdá se, že jsme se letos rozhodli zmapovat, jak to jde organizátorům z Devoxx. Takže zatímco Geňa si vzal na mušku [londýnskou mutaci](/devoxx-uk-2019/), já se jel nachytřit nízkorozpočtově (tak určitě) do polského Krakova na [Devoxx Poland](https://www.devoxx.pl/).
Hned zpočátku se mi potvrdilo, že jsem si vybral dobře, protože nejčastěji používaným termínem přednášek bylo "well, it depends". Přednášející nebyli zkrátka žádní zelenáči, kteří vám hustí do hlavy jedno ultimátní řešení.

Tematický záběr byl kromě toho velký, od metodologie vývoje, přes architekturu, bezpečnost, big data, cloud & infrastrukturu. Technologicky byla společným jmenovatelem Java, 
ale pokud o ní člověk ví jen to, že dostala jméno podle Javascriptu, vůbec to nevadí, většina přednášek byla natolik obecných, že nebylo potřeba vědět nic víc.

![ICE Krakov](/assets/devoxx-pl-2019/ICE_Krakov.jpg)

Nejradši si vybírám přednášky s větší mírou abstrakce - jednak se v nich bývá hodně přesahů a informací "mezi řádky", jednak je vetší šance, že se trefí do problémů, které řešíme i my v Heurece. Což se mi víc než potvrdilo.

## Agilní až za hrob

V Heurece jsme nedávno prošli důležitou změnou struktury vývojových týmů - rozdělili jsme se důsledně podle jednotlivých produktových oblastí (vertikálně) a upustili od jakéhokoliv dělení podle technologie (horizontaálního).
Udělali jsme si na to téma loni jednodenní workshop, kde jsme právě Heureku na jednotlivé oblasti rozkrájeli.
[Julien Lavigne]() představil zajímavé [řešení problému](https://medium.com/@julien.lavigne/continuous-reteaming-and-self-selection-cbe0df69a9a7) s malou flexibilitou takových produktových týmů, které nedokáží z hlediska své kapacity reagovat na rychle se měnící byznys priority. 
Zavedli si zkrátka hodně podobné workshopy pravidelně každého čvrt roku. 
Workshop za účasti vývojářů, produkťáků, ale také stakeholderů má minimum pevně daných pravidel, jako například že všechna práce musí být na konci rozdělena, nebo že v každém týmu se musí změnit alespoň jeden člen, naopak alespoň jeden musí zůstat.
...

## Mikro s rozumem

Výtečný řečník [Nathaniel Schutta](http://www.ntschutta.io/) ve své úvaze [Responsible Microservices](https://content.pivotal.io/blog/should-that-be-a-microservice-keep-these-six-factors-in-mind) 
pěkně shrnul nebezpečí bezhlavého přepisu veškerého kódu do mikroslužeb. Ty, jakkoliv mohou být dobrým řešením, přináší vyšší úroveň komplexity, která navíc nemusí být vyvážena benefity.
Uvedl 6 faktorů, díky kterým můžeme rozlišovat, zda má smysl danou část separovat do mikroslužby. Je to např. četnost změn dané části systému - čím vyšší, tím větší smysl dává mít ji zvlášť. 
Dalšími poměrně zjevnými faktory je odlišná škálovatelnost či možnost volby optimální technologie.
Myslím, že i když jsme se v Heurece vydali jednoznačně směrem k architektuře mikroslužeb, měli bychom se zároveň neustále ptát, zda a proč danou doménu separovat a jestli by se jí nakonec lépe nedařilo jako součásti většího celku.

## Keptn
Andreas Grabner z Dynatrace [https://www.slideshare.net/grabnerandi/shipping-code-like-a-keptn-continuous-delivery-automated-operations-on-k8s] představil rozrůstající se opensource projekt [Keptn](https://keptn.sh/), který
si dává za cíl vyřešit narůstající složitost systémů pro nasazení a provozování jednotlivých částí systému. Byl primárně vyvíjen pro kubernetes, ale postupně bude podporovat i další cloudová řešení jako Openshift.
Jádrem je event-driven operátor, který umožňuje pomocí deklarativního přístupu odpojit vaše aplikace od implementačních detailů vašeho CI/CD systému. Kromě fáze `Continous deployment` se zaměřuje také na 
fázi následnou, tj. `Automated operations`. V praxi tedy nejen, že dokáže ohlídat, že se vaše aplikace, které neprojdou testovací fázi, nedostanou ze staging na produkci. Kromě toho je napojen i na produkční
monitoring a dokáže automaticky sjednávat nápravu, pokud se metriky dotanou do červených čísel.

## Event sourcing 

David Schmitz [Eventsourcing – You are doing it wrong](https://koenighotze.de/assets/media/2018-09-06/eventsourcing-you-are-doing-it-wrong.pdf)

## Mikro frontendy

David Leitner [Micro Frontends – a Strive for Fully Verticalized](https://speakerdeck.com/duffleit/microfrontends-f5b07c7f-392b-4e73-b788-2806ba7341d3?slide=35) se zabýval tématem, který také hýbe Heurekou - aplikací principu mikroslužeb na frontend, neboli mikrofrontendy.
V zásadě existují 3 možnosti, jak integrovat několik SPA aplikací do jedné stránky:
- build time integration ([monorepo](https://medium.com/@brockreece/from-monolith-to-monorepo-19d78ffe9175)) 
- server side integration - to je cesta po které jsme se vydali my s naší vlastní integrační proxy, ale existují i opensource řešení jako [Mosaic](https://www.mosaic9.org/)
- runtime integration - neboli poskládání všeho v prohlížeči. Jedním ze zmiňovaných nástrojů je [singl-spa](https://single-spa.js.org/). Jako prerekvizitu pro tento způsob integrace webu David zmínil metodologii [Immutable Web Apps](https://immutablewebapps.org/), což je v podstatě rozšíření myšlenek [Twelve-Factor App](https://12factor.net/) do světa frontendu.

## A co Krakov?

Co Krakov, ptáte se? Jestli jste tam ještě nebyli, musíte tam! Je to krásný, historický a přitom velkorysý a nenucený město, s hospodou, barem nebo kavárnou doslova v každým druhým domě.
Židovská diskotéka na dvoře synagogy pak byla příjemnou třešničkou na dortu.

![Jewish disco party](/assets/devoxx-pl-2019/Jewish_disco.jpg)
