---
layout: post
title: "Android Makers - Paris 2019"
permalink: /android-makers-paris-2019/
date: 2019-05-29 15:00:00 +0200
author: Jaroslav Jakoubě
tags: [android, konference, androidmakers2019]
categories: [blog]
imageUrl: /assets/2019-05-29-android_makers_paris/share.jpg
---

Ano, možná o tom ani nevíš, ale i Heureka má svou mobilní aplikaci a vlastní tým, který ji neustále vylepšuje.

Letos se celý náš androidí tým (já a kolega) rozhodl, že chceme vyzkoušet něco jiného než DroidCon v Londýně, 
a tak jsme se vydali do Paříže na konferenci AndroidMakers. 

Tato dvoudenní konference se celá konala v budově Le Beffroi de Montrouge ve čtyřech přednáškových sálech, 
u kterých byla velmi tématicky znázorněna kapacita míst. Po naplnění místnosti androiďáky, nebo na začátku prezentace, 
vždy stál jeden z pořadatelů před vstupem do místnosti a s přísným (ale omluvným) gestem už nikoho dovnitř nepustil. 
Osobně beru tento způsob jako naprosto perfektní, protože se tím minimalizoval jeden z nejčastějších rušivých elementů, 
a člověk se tak mohl v klidu soustředit na prezentaci.  

![Saly](/assets/2019-05-29-android_makers_paris/rooms.jpg)

Většina přednášek byla formou prezentací, ale bylo zde i pár workshopů, livecodingu a samozřejmě nesměla chybět 
skvělá dvojka Chet Haase a Romain Guy a jejich comedy talk. 
<br>Co jsem velice ocenil, byla mobilní apka určená 
pouze pro účely této konference, ve které bylo možné vytvořit seznam oblíbených přednášek, na které jsem pak před 
jejich začátkem byl upozorněn notifikací.

## Java je mrtvá, ať žije Kotlin

To, že se androidí svět přesouvá z Javy do Kotlinu je už dost rozšířený fakt, ale stále jsme na minulých 
konferencích zaznamenávali, že v Javě pořád někdo pracuje. Ale letos byla již konference plně kotlinizována 
a na žádné přednášce nebyla ani jedna ukázka kódu v Javě. Naopak na většině přednášek byly zdůrazňovány přednosti 
a nové featury Kotlinu, jako například lepší podpora coroutines, multiplatformní vývoj, jednoduché psaní UI testů atp.

![Kotlin](/assets/2019-05-29-android_makers_paris/kotlin.jpg)

## Jak je důležité míti App Bundle

Taky vás štve, jak se aplikace na storu pořád zvětšují? Nejste sami! Trápí to hodně lidí, zejména v místech 
s účtovaným připojením. Tuto problematiku řešil například Ben Weiss z Googlu ve své přednášce “Best practices for 
a modularized app”,  kde popisoval, jaký to může mít dopad například na počet instalací/odinstalací. 
Velice pěkně zde znázornil velikosti zabundlovaných aplikací pomocí Android App Bundle. Dále se zde zabýval 
rozdělováním aplikace do jednotlivých modulů, které ulehčí nejen vývoj, ale usnadní například použití Dynamic Features.

![Bundle](/assets/2019-05-29-android_makers_paris/bundle.jpg)

## To jsou blechy androidí, ty na web nejdou…

Některé přednášky byly věnovány frontendu a byla v nich řešena problematika animací a optimalizovaného vykreslování. 
Samozřejmě nemohla chybět prezentace “Constraint Layout 2.0”, ve které se Nicolas Roard a John Hoford předháněli, 
kdo udělá lepší animaci jen pomocí závislostí mezi jednotlivými komponentami. 

V ostatních přednáškách byl docela hojně využit nástroj Shape Shifter od Alexe Lockwooda. 
Jedná se o zajímavý projekt, pomocí kterého dokážete animovat libovolná SVG nebo Vector Drawable. 
Po nahrání zdrojového souboru lze upravit jednotlivé body/barvy, definovat jim cílové parametry, a tím vytvořit 
zamýšlenou animaci. Výsledek pak lze exportovat buď do Vector Drawable a přímo použít v Android apce, nebo do SVG 
setu/spritesheetu, který lze použít např. na webu. 

![Shapeshiffter](/assets/2019-05-29-android_makers_paris/shape_shifter.jpg)

## Vy jste se zase kochal, že jo, pane programátore?

Dostali jsme se i do města! Prošli jsme se po většině známých památek, viděli jsme ohořelý Noter Dame, 
prošli jsme se pod Eiffelovkou, potkali jsme protestující Žluté vesty… Prostě jaro v Paříži, jak má být.

![Louvre](/assets/2019-05-29-android_makers_paris/louvre.jpg)

## Konec hlášení
Asi bych se tady mohl rozepsat o hromadě dalších přednášek a nových poznatků, kterých jsme nabrali opravdu hodně, 
ale kdo by četl dlouhý článek, že?
Všechny přednášky byly nahrávány a měly by být k dispozici na webu [AndroidMakers](https://androidmakers.fr/schedule/).

## A pokud bych měl konferenci porovnat například s DroidConem…
__DroidCon London 2018:__ 
<br>\+ Londýn se mi líbí víc než Paříž
<br>\+ Lepší zázemí v Business Design Center
<br>\+ Víc stánků se sponzory - větší možnost si popovídat
<br>\- Přednášky bych očekával na vyšší úrovni
<br>\- Místy chaotická organizace

__AndroidMakers Paris 2019:__
<br>\+ Perfektně zorganizováno
<br>\+ Skvělé přednášky
<br>\+ Jednoduchá ale velice užitečná apka s programem
<br>\+ Livecoding prezentace
<br>\- Francouzsky umím maximálně pozdravit a “nepřednášející” anglicky moc neuměli
