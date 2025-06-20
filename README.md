# Elec App ModKeys

Este projeto é um aplicativo de desktop criado com [Electron](https://www.electronjs.org/) e [TypeScript](https://www.typescriptlang.org/) que exibe na tela um overlayer sempre que algumas teclas modificadoras são pressionadas (como Shift, Ctrl, Alt, Caps Lock e a tecla Command/Windows). 

O objetivo é fornecer uma indicação visual que ajuda em demonstrações, gravações de tutorial ou situações em que se deseja mostrar quais teclas modificadoras estão sendo utilizadas.

## Índice

- [Recursos](#recursos)
- [Requisitos](#requisitos)
- [Instalação](#instalacao)
- [Execução](#execucao)
- [Build](#build)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuicao)
- [Licença](#licenca)

## Recursos

- Overlay simples exibindo a tecla modificadora pressionada.
- Configuração de duração, opacidade, fonte, tamanho e posição diretamente no menu da bandeja do sistema.
- As preferências escolhidas são salvas automaticamente e restauradas ao abrir o aplicativo.
- Opção no menu para restaurar as configurações padrão.
- Suporte a Windows, macOS e Linux.

## Requisitos

- [Node.js](https://nodejs.org/) v18 ou superior.
- NPM (geralmente instalado junto com o Node.js).

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <repo>
cd elec-app-modkeys
npm install
```

## Execução

Para compilar o projeto e iniciar o aplicativo:

```bash
npm start
```

Isso realiza o build do TypeScript e em seguida abre o Electron. É possível executar no modo de desenvolvimento usando:

```bash
npm run dev
```

As preferências são armazenadas em um arquivo `overlay-config.json` dentro da
pasta de dados do usuário. Esse arquivo é carregado automaticamente na próxima
execução.

## Build

Para apenas gerar os arquivos JavaScript em `dist/` (sem iniciar o Electron):

```bash
npm run build
```

Para gerar instaladores para o sistema operacional atual execute:

```bash
npm run dist
```

Esse comando utiliza o **electron-builder**. O repositório possui um fluxo de GitHub Actions que executa o `electron-builder` em cada merge na branch `main`, criando uma *release* no GitHub com os pacotes gerados para cada sistema operacional. O workflow usa o token `TOKEN` configurado nas configurações do repositório.
Nas máquinas Linux, é gerado apenas o formato **AppImage**, evitando a dependência do `snapcraft`.

## Estrutura do Projeto

```
elec-app-modkeys/
├─ src/             # Código TypeScript principal
│  ├─ main.ts       # Inicializa o Electron e módulos auxiliares
│  ├─ overlayWindow.ts # Criação e exibição do overlay
│  ├─ keyListener.ts   # Captura de teclas modificadoras via uiohook
│  ├─ tray.ts          # Menu de bandeja para configurações
│  └─ config.ts        # Objeto de configuração compartilhado
├─ overlay.html    # Interface HTML do overlay
├─ package.json    # Scripts e dependências do projeto
├─ tsconfig.json   # Configuração do TypeScript
└─ dist/           # Arquivos gerados após `npm run build`
```

## Contribuição

Sinta-se à vontade para abrir _issues_ e enviar _pull requests_. Toda ajuda é bem-vinda!

## Licença

Este projeto é licenciado sob a licença [ISC](https://opensource.org/licenses/ISC).

