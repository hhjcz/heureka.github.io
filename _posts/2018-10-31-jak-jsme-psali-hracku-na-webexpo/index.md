---
layout: post
title: "Jak jsme psali hračku na WebExpo"
permalink: /jak-jsme-psali-hracku-na-webexpo/
date: 2018-10-31 15:00:00 +0200
author: Tomáš Bedřich
tags: [webexpo, webexpo2018, docker, python, flask]
categories: blog
---

Možná jsme se potkali na letošním WebExpu a možná ne. Ať už to bylo jakkoliv, na našem stánku jste si mohli zahrát rychlou programátorskou mini-soutěž o věcné ceny. Kromě samotných řešení, která byla občas opravdu kuriozní, je však zajímavé zmínit i způsob, jakým jsme vaše řešení vyhodnocovali.


## O co šlo?

Zadáním bylo napsat jednoduchý program dle těchto pravidel:

- Write a program that outputs numbers from 1 to 100 (both ends included).
- For multiples of 3 output `Fizz` instead of the number.
- For multiples of 5 output `Buzz` instead of the number.
- For multiples of both 3 and 5 output `FizzBuzz` instead of the number.

Vyhodnocovacím kritériem pak byla správnost a rychlost řešení.

Abychom umožnili soutěžit co nejširšímu spektru návštěvníků, rozhodli jsme se, že budeme podporovat hned několik skriptovacích jazyků: Python, PHP, Javascript i Ruby.

Ale pusťte si na svém počítači neznámý skript od náhodného podivína, ještě k tomu v jazyce, kterému vůbec nerozumíte (Ruby), že ano... Navíc jsme si říkali, že nás asi nebude bavit kontrolovat desítky řešení a radši se budeme lidem smát, že neumí celočíselně dělit. No, co s tím?


## Jak to všechno vyhodnotit?

Long story short: Docker.

Short story long: První nápad byl, že jednoduše lidi necháme psát skripty, budeme je spouštět pomocí interpretu daného jazyka a používat `diff` k porovnání se správným výsledkem. Jenže... Instalovat interprety pro každý jazyk; (ne)izolovat jejich běhové prostředí, atd. To nechcete.

Druhý nápad byl – uděláme to samé s pomocí Dockeru. To už je trochu lepší, dají se tam nastavit limity apod. Ale pořád to spuštění a porovnání je třeba udělat v shellu a ukazovat vývojářům otevřený shell je jak mávat jim červeným hadrem před očima. Takže to bylo třeba nějak "zabalit"...

Okej, uděláme webové rozhraní. Jednoduchá aplikace [ve Flasku](http://flask.pocoo.org/) s pracovním názvem _FizzBuzzTester_, která bude mít jednu textareu pro zdroják a jeden select box na výběr jazyka. Soutěžící si vybere jazyk, odešle řešení a Python na pozadí spustí něco jako `docker run -ti <jazyk> < <zdrojak>`, počká na výstup, zavolá `diff` oproti správnému řešení a zobrazí výsledek zpět do webové aplikace. To už začínalo vypadat použitelně. A když už jsme v tom, tak proč se nepřiučit něco nového?


![Webové rozhraní - zadání](/assets/jak-jsme-psali-hracku-na-webexpo/index.png)


## Já rád Docker, ty rád Docker...

V rámci "předoperačního vyšetření" jsme samozřejmě zabrousili do [dokumentace modulu subprocess](https://docs.python.org/3/library/subprocess.html) a mrkli jsme i na [komunitní alternativy](https://awesome-python.com/#processes) s tím, že by se alespoň dala vyzkoušet nějaká nová knihovna. Pořád to ale nebylo ono – ten mezikus v podobě spuštění `docker run ...` v shellu tam byl tak nějak navíc.

Druhá nehezká věc byla, že abychom mohli uvnitř Dokří aplikace (ano, píšeme aplikace v Dockeru) spouštět `docker run`, tak bychom museli rozchodit DinD (= "Docker in Docker"), v něm závislosti _FizzBuzzTesteru_ (Flask, gunicorn, ...), obětovat jednorožce a vykouřit WebExpo kadidlem. Přestože jsme na tohle všechno byli připraveni, tak na konci [jednoho chytrého článku](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/) se blýskla zmínka o Docker API. What? Docker je přece command-line nástroj, tak jaké API? [Tohle.](https://docs.docker.com/engine/api/latest/)

Takže se začala rodit myšlenka – co spustit _FizzBuzzTester_ v kontejneru a (jak radí ve výše zmíněném článku) zpřístupnit mu API jeho "rodiče" (v Docker terminologi "hosta")? Řešení návštěvníků pak budeme spouštět jako _sourozence_ (a nikoliv _potomky_) kontejneru, ve kterém běží testovací aplikace. Tím ušetříme výkon a vynecháme zbytečnou vrstvu shellu. Navíc po krátkém pohledání na webu lze najít [skvělou knihovnu pro Python](https://docker-py.readthedocs.io/en/stable/), která zlehka obaluje toto API. Nebudeme vás napínat – fungovalo to nad očekávání dobře. V konečném stavu jsme se doiterovali k něčemu takovému:

```python
# -----------------------------------------------------------------------------
# models/language.py

from dataclasses import dataclass


@dataclass(frozen=True)
class Language:
    id: int
    name: str
    version: str
    docker_image: str
    get_command: callable


LANGUAGES = [
    # always print newline on the end to flush output buffer
    Language(0, 'Python', '3.7', 'python:3.7-alpine', lambda source: [
        'python', '-u', '-c', source + '\nprint()'
    ]),
    # ... omitted Node.js & PHP ...
    Language(3, 'Ruby', '2.5', 'ruby:2.5-alpine', lambda source: [
        'ruby', '-e', source + '\nputs'
    ]),
]

# -----------------------------------------------------------------------------
# services/docker.py

from docker import DockerClient
from docker.errors import ContainerError

from fizzbuzztester.models import Language

_docker = None


def init_docker(app):
    global _docker
    _docker = DockerClient(base_url=app.config['DOCKER_SOCKET'])


def run(language: Language, source: str):
    command = language.get_command(source)

    try:
        output = _docker.containers.run(
            language.docker_image,
            command,
            remove=True,
            cap_drop=['ALL'],
            network_disabled=True,
            mem_limit='256m',
            pids_limit=10
        )
        return 0, output.decode('utf8').strip(), None
    except ContainerError as e:
        return e.exit_status, None, e.stderr.decode('utf8').strip()
```

## Pozlátko

Technicky funkční řešení však ještě bylo třeba navléct do nějakého rozumného obalu. Původní plán spouštění příkazu `diff` vzal za své s pokusem o smazání shellové mezivrstvy, tak ji tam přece nebudeme znovu přidávat kvůli tomuhle. A vzhledem k tomu, že jako kostru používáme webový framework Flask, bylo by hezké to vyřešit nějak web-friendly.

Nastal čas zúročit znalost obskurních modulů ze standardní výbavy Pythonu. Recept zněl jednoduše: vezměte [`difflib.HtmlDiff`](https://docs.python.org/3/library/difflib.html#difflib.HtmlDiff), přidejte referenční řešení, výstup z Docker kontejneru, špetku CSS a míchejte tak dlouho, dokud exit kód nebude 0. :) Zejména s tím CSS jsme trochu bojovali, ale nějak to dopadlo.

![Webové rozhraní - řešení](/assets/jak-jsme-psali-hracku-na-webexpo/result.png)


## Ono to žije!

Pokud se nebojíte, výsledek můžete vyzkoušet sami:

```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -p 8080:8080 --env FBT_SECRET_KEY=dev tomasbedrich/fizzbuzztester:latest
```

Jen pozor – pokud nemáte natažené Docker image, které _FizzBuzzTester_ používá, tak po kliknutí na "I'm feeling lucky" si chvíli počkáte. Nebo můžete předem udělat `for image in python:3.7-alpine php:7.2-alpine node:8.11-alpine ruby:2.5-alpine; do docker pull $image; done`.


## Proč to píšeme?

- Abyste věděli, že existuje [Docker API](https://docs.docker.com/engine/api/latest/).
- Abychom rozšířili povědomí o tom, že Python a [Flask](http://flask.pocoo.org/) jsou super.
- Abyste nezapomínali objevovat nové cestičky a nezakrňovali u zažitých postupů.
- Abychom ukázali, že práce v Heurece má trochu od každého. :)
