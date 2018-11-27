# Asgard UI

Esse é o projeto que fornece uma Web UI para o projeto Asgard. Essa interfacce é um fork do projeto Marathin UI + um conjunto de plugin
que implementa o que é necessário para termos:

* Isolamento total, ou seja, múltiplos times podem usar a mesma UI mas cada time só pode ver/modificar suas próprias aplicações. Cada time roda suas tarefas em servidores pŕoprios, totalmente isolados dos demais times.
* Autenticação via oauth2 (+JWT). Atualmente apenas o oauth2 do Google é suportado.
* Autorização, ou seja, poder darmos permissões finas a cada usuário de cada time.
* Quaisquer outras features que acharmos úteis e que não estejam incluídas no projeto original.

## Como esse projeto é desenvolvido

A ideia principal é implementar **todas** as novas funcionalidades com plugins para o projeto original. Se um plugin não for possível de escrever, então submetemos um PR no projeto
original mudando o core para que seja possível escrever esse plugin.

Dois exemplos desse tipo de mudança onde já abrimos PR foram:

* https://github.com/mesosphere/marathon-ui/pull/813
* https://github.com/mesosphere/marathon-ui/pull/819


## Como adicionar novos plugins para a UI

Apesar dos plugins pertencerem à UI o código de cada um deles é servido pela [Asgard API](https://github.com/B2W-BIT/asgard-api/). Quando a App ReacJS da UI boota,
ele volta na API e carrega todos os plugins adicionais.


Para adicionar novos plugins o `main.js` do plugin deve ser comitado em `/static/plugins/<plugin-id>/main.js`
Alteramos o arquivo [asgard-api/app.py](https://github.com/B2W-BIT/asgard-api/blob/master/hollowman/app.py#L88) e adicionamos uma nova chamada a `register_plugin(<plugin-id>)`

Isso é o mínimo necessário para que esse novo plugin esteja disponível para a UI.


O README original do projeto Marathon UI está aqui: [original-README.md](original-README.md).

## Changelog

### 0.20.0
 * Depreciando as opções HTTP, TCP, COMMAND como tipo de healthcheck validos. Deixando apenas MESOS_HTTP, MESOS_TCP e MESOS_HTTPS. Default: MESOS_HTTP.

### 0.19.0

 * Adicionado botoes de Download do stdout/stderr na aba Debug de uma Asgard App;
