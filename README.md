# ASCII Cam — Real-time Video to ASCII

Converte sua webcam em arte ASCII em tempo real diretamente no navegador, utilizando processamento paralelo e otimizações de baixo nível para manter alta performance mesmo em grids densos.

---

## Demo

https://ascii.murilod.dev/

---

## Preview

![demo](./public/demo.gif)

---

## Features

- Renderização ASCII em tempo real via webcam  
- Processamento paralelo com Web Workers  
- Transferência de memória zero-copy (Transferable Objects)  
- Modo colorido com agrupamento por cor otimizado  
- Layout adaptativo baseado no tamanho da tela  
- Pipeline de renderização otimizado para alta taxa de FPS  

---

## Arquitetura e Decisões Técnicas

A engenharia do projeto foi fundamentada em três pilares: performance, eficiência de memória e separação de responsabilidades.

### 1. Processamento Paralelo (Web Workers)

Toda a lógica de processamento de imagem — incluindo conversão de luminância (Rec. 709), aplicação de brilho e mapeamento de caracteres — é executada em um Web Worker.

Isso mantém a Main Thread livre, evitando travamentos na interface mesmo sob alta carga de processamento.

---

### 2. Transferência de Memória Zero-Copy

Para eliminar overhead de comunicação entre threads:

- Utilização de Transferable Objects  
- Uso de Uint8Array / Uint32Array  
- Transferência de ownership dos buffers (sem cópia)  

#### Bitwise Color Packing

As cores são compactadas em um inteiro de 32 bits:

```

0xRRGGBB

```

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

### Responsabilidades

- core/ → configuração global  
- services/ → integração com APIs externas (camera, worker)  
- render/ → lógica de layout e renderização  
- worker.ts → processamento de imagem (thread isolada)  
- main.ts → orquestração da aplicação  

---

## Desafios Técnicos

- Evitar gargalos na Main Thread durante processamento de imagem  
- Minimizar alocação de memória por frame  
- Manter FPS estável com grids grandes  
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
