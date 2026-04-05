![Vite](https://img.shields.io/badge/vite-4.x-646CFF)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)

# ASCII Cam — Real-time Video to ASCII

High-performance ASCII renderer using Web Workers, zero-copy memory transfer and optimized Canvas batching.

Converte sua webcam em arte ASCII em tempo real diretamente no navegador, utilizando processamento paralelo e otimizações de baixo nível para manter alta performance mesmo em grids densos.

---

## Demo

https://ascii.murilod.dev/

---

## Como usar

1. Acesse a [demo](https://ascii.murilod.dev/) (ou rode localmente)
2. Conceda permissão para a câmera quando solicitado
3. Clique em **START CAMERA**
4. Ajuste os controles na barra lateral:
   - **Conjunto de caracteres** (personalizável)
   - **Tamanho da fonte** (afeta a resolução da grade)
   - **Contraste / Brilho**
   - **Cores** (liga/desliga)
5. Para parar, clique em **STOP CAMERA**

---

## Preview

![demo](./public/demo.gif)

---

## Features

- Renderização ASCII em tempo real via webcam  
- Processamento paralelo com Web Workers  
- Zero-copy data transfer (Transferable Objects)  
- Modo colorido opcional (**zero overhead quando desativado**)  
- Agrupamento por cor otimizado para reduzir chamadas de draw  
- Layout adaptativo baseado no tamanho da tela  
- Pipeline de renderização otimizado para alta taxa de FPS  

---

## Arquitetura e Decisões Técnicas

A engenharia do projeto foi fundamentada em três pilares: performance, eficiência de memória e separação de responsabilidades.

---

### 1. Processamento Paralelo (Web Workers)

Toda a lógica de processamento de imagem é executada em um Web Worker:

- Conversão RGB → luminância (Rec. 709)  
- Aplicação de brilho e contraste via LUT  
- Mapeamento direto para índice de caractere  
- Geração opcional de buffer de cor (Uint32Array)  

Isso mantém a Main Thread livre, evitando travamentos na interface mesmo sob alta carga de processamento.

---

### 2. Zero-Copy Data Transfer (Transferable Objects)

Para eliminar overhead de comunicação entre threads:

- Utilização de Transferable Objects  
- Uso de Uint8Array / Uint32Array  
- Transferência de ownership dos buffers (sem cópia)  
- Evita garbage collection por frame  

#### Bitwise Color Packing

As cores são compactadas em um inteiro de 32 bits:

```

0xRRGGBB

````

Isso reduz significativamente o volume de dados trafegados.

---

### 3. Otimização de Algoritmo (Contrast LUT)

Evita chamadas repetidas de `Math.pow` por pixel:

- Pré-cálculo em uma Look-Up Table (256 posições)  
- Acesso direto O(1) durante o processamento  

Resultado: redução significativa de uso de CPU por frame.

---

### 4. Layout Engine Adaptativo

O grid ASCII é calculado dinamicamente:

- Baseado no tamanho real do container  
- Mantém proporção correta (aspect ratio)  
- Responsivo (desktop e mobile)  

---

### 5. Render Pipeline Otimizado

O render no Canvas foi projetado para minimizar custo por frame:

- Redução de chamadas `fillText` via batching por cor  
- Construção de linhas em buffer antes do draw  
- Cache de cores (`Map<number, string>`)  
- Render monocromático extremamente barato quando cor está desativada  

---

### Responsabilidades

- `core/` → configuração global  
- `services/` → integração com APIs externas (camera, worker)  
- `render/` → lógica de layout e renderização  
- `worker.ts` → processamento de imagem (thread isolada)  
- `main.ts` → orquestração da aplicação  

---

## Desafios Técnicos

- Evitar bloqueio da Main Thread durante processamento de pixels  
- Reduzir transferência de memória entre threads  
- Minimizar chamadas de draw no Canvas (`fillText` batching)  
- Evitar recomputação cara por pixel (`Math.pow` → LUT)  
- Manter FPS estável em grids de alta densidade  
- Balancear qualidade visual versus performance  

---

## Tecnologias

- TypeScript  
- Vite  
- Canvas 2D API  
- Web Workers  

---

## Instalação

```bash
npm install
````

---

## Desenvolvimento

```bash
npm run dev
```

---

## Build

```bash
npm run build
```

---

## Contribuição

Pull requests são bem-vindos. Para mudanças grandes, abra uma issue primeiro.

---

## Licença

MIT © [Murilo](https://github.com/self1027) — veja o arquivo [LICENSE](LICENSE) para detalhes.
