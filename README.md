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

## Build

Para apenas gerar os arquivos JavaScript em `dist/` (sem iniciar o Electron):

```bash
npm run build
```

Atualmente não há configuração para empacotar o aplicativo em instaladores. Caso deseje distribuir, você pode utilizar ferramentas como [electron-builder](https://www.electron.build/) ou [electron-forge](https://www.electronforge.io/) adicionando as configurações necessárias.

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

