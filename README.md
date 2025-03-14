# DBS2 projekt

## Task list

- [x] cca. 10 tabulek navrženého datového modelu (individuální domluva)
- [x] alespoň jeden číselník – viz. například https://cs.wikipedia.org/wiki/%C4%8C%C3%ADseln%C3%ADk
- [x] alespoň tři pohledy. které budou volány z aplikace
- [ ] alespoň tři funkce různého typu s odpovídající složitostí
- [ ] alespoň tři uložené procedury
- [ ] alespoň dva triggery
- [ ] alespoň jedna transakce s ošetřeným chováním při rollbacku
- [x] použití indexů na neklíčové sloupce
- [x] použití kompozitních primárních klíčů
- [x] vyzkoušet si použití datového typu JSON v moderních relačních databázích (rozumné použití včetně filtrace nad těmito sloupci může ovlivnit počet požadovaných databázových tabulek, případně odpuštění jednoho ze zde uvedených požadavků – záleží na domluvě se cvičícím)
- [x] v databázovém serveru bude vytvořen uživatel s potřebnými právy pouze k databázovým objektům, které pro správný běh aplikace potřebuje – tzn. root (admin) účet nebude aplikací používán, vč. omezení přístupu pouze z potřebné IP adresy
- [x] doporučené rozjetí projektu v Dockeru pomocí docker-compose – bude zajištěna inicializace struktury databáze a nahrání dat při startu
- [x] verzování vývoje pomocí Gitu
- [ ] vhodným způsobem zajistit ukládání obrázků, které budou v aplikaci načteny a zobrazeny
- [ ] aplikace bude využívat minimálně 2 plnohodnotné formuláře (např. ošetření vstupních polí, apod.) pro vytváření nebo modifikaci dat v tabulkách

## Commands

### NextJS

```
docker compose --profile postgres --profile nextjs up --watch
```

```
docker container run -i --name node-temp -t --rm -v .:/app -w /app node:22.14.0 COMMAND
```

### Postgres

```
docker compose --profile postgres --profile pgadmin4 up -d
```
