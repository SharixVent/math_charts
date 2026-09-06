# 📊 Math Charts - 2D & 3D Interactive Data & Chart Visualizer

<p align="center">
  <img src="public/logo.svg" alt="Math Charts" width="120" />
</p>

<p align="center">
  <b>Nowoczesne, wysoce responsywne narzędzie webowe do interaktywnej wizualizacji, modelowania i analizy wielowymiarowych wykresów w przestrzeni 2D oraz 3D.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-Ready-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

---

## 🚀 O Projekcie

**Math Charts** to aplikacja webowa do zaawansowanego modelowania, konfiguracji i generowania wykresów. Pozwala użytkownikowi na natychmiastowe przekładanie parametrów liczbowych na czytelne, dynamiczne reprezentacje graficzne - zarówno na płaszczyźnie, jak i w trójwymiarze.

Projekt został zbudowany z myślą o maksymalnej wydajności renderowania, czystości kodu oraz intuicyjnym UI.

---

## ✨ Kluczowe Możliwości

* 📐 **Wizualizacja Dual-Mode (2D / 3D)** – Płynne przełączanie i równoległa praca między rzutem płaskim (`Canva_2D`) a pełną sceną trójwymiarową (`Canva_3D`).
* 🧩 **Podział na Sektory** – Możliwość segmentacji przestrzeni roboczej (`Sectors`), ułatwiająca porównywanie i analizę wielu partii danych jednocześnie.
* ⚙️ **Konfigurator Parametrów w Czasie Rzeczywistym** – Elastyczne panele akordeonowe (`AccordionField`) i modularne pola (`FieldsData`), które natychmiast aktualizują widok wykresu.
* 💾 **Zapis i Odczyt Stanu (State Persistence)** – Eksport i import konfiguracji z pliku / pamięci lokalnej (`SaveLoad`), pozwalający na pracę z gotowymi szablonami.
* ⚡ **Nowoczesny UI/UX** – Czysty, modularny interfejs z dynamicznymi powiadomieniami (`Popup`) i przełącznikami trybów (`Switch`).

---

## 🛠️ Stack Technologiczny

| Technologia | Rola w projekcie |
| :--- | :--- |
| **React** | Deklaratywny interfejs użytkownika i architektura komponentowa |
| **TypeScript** | Ścisłe typowanie danych, interfejsów i logiki renderowania |
| **Vite** | Błyskawiczny dev server i optymalny bundler produkcyjny |
| **HTML5 Canvas / WebGL** | Wydajne renderowanie geometrii wykresów 2D oraz 3D |
| **CSS Modules / Custom Styling** | Spójny i nowoczesny design systemu |
| **ESLint** | Utrzymanie wysokiej jakości i standardów kodu |

---

## 📁 Architektura Projektu

```text
src/
├── components/
│   ├── accordionField/    # Zwijane sekcje parametrów wykresów
│   ├── buttons/           # Przyciski kontrolne (zapis/odczyt, switche)
│   ├── canva-2d/          # Silnik renderujący wykresy dwuwymiarowe
│   ├── canva-3d/          # Silnik rzutowania i manipulacji w 3D
│   ├── field/             # Pojedyncze pola formularzy danych
│   ├── fieldsData/        # Logika zarządzania zbiorami punktów
│   ├── popup/             # Modalne okna dialogowe i statusy
│   └── sectors/           # Podział obszaru roboczego na strefy
├── App.tsx                # Główny stan i montaż widoków
└── main.tsx               # Punkt wejścia aplikacji
```

---

## ⚡ Szybki Start

### Wymagania wstępne
* [Node.js](https://nodejs.org/) (wersja `>= 18.x`)
* Menedżer pakietów: `npm`, `yarn` lub `pnpm`

### Krok po kroku

1. **Sklonuj repozytorium:**
   ```bash
   git clone [https://github.com/SharixVent/Sharix.git](https://github.com/SharixVent/math_charts.git)
   cd math_charts
   ```

2. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

3. **Uruchom wersję deweloperską:**
   ```bash
   npm run dev
   ```
   Aplikacja odpali się lokalnie pod adresem: `http://localhost:5173/`

---

## 📦 Budowanie Produkcyjne

Aby przygotować zoptymalizowaną paczkę do wdrożenia (np. na GitHub Pages, Vercel, Netlify):

```bash
npm run build
```

Pliki produkcyjne znajdą się w katalogu `/dist`. Podgląd buildu:
```bash
npm run preview
```

---

## 📄 Licencja

Projekt udostępniany na licencji MIT. Zobacz plik [LICENSE](LICENSE) po więcej szczegółów.

# 📊 Math Charts – 2D & 3D Interactive Data & Chart Visualizer

<p align="center">
  <img src="public/logo.svg" alt="Math Charts" width="120" />
</p>

<p align="center">
  <b>A modern, highly responsive web tool for interactive visualization, modeling, and analysis of multidimensional charts in 2D and 3D space.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-Ready-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

---

## 🚀 About the Project

**Math Charts** is a web application designed for advanced chart modeling, configuration, and generation. It enables users to instantly translate numeric parameters into clear, dynamic graphical representations—both in planar and three-dimensional views.

The project was built with a strong focus on rendering performance, clean architecture, and intuitive UI.

---

## ✨ Key Features

* 📐 **Dual-Mode Visualization (2D / 3D)** – Seamless switching and parallel workflow between planar projection (`Canva_2D`) and a full 3D scene (`Canva_3D`).
* 🧩 **Sector Segmentation** – Divide the workspace into sectors (`Sectors`) to easily compare and analyze multiple datasets simultaneously.
* ⚙️ **Real-Time Parameter Configurator** – Flexible accordion panels (`AccordionField`) and modular inputs (`FieldsData`) that update chart views instantly.
* 💾 **State Persistence (Save / Load)** – Export and import configurations from files or local storage (`SaveLoad`), enabling seamless workflow with reusable templates.
* ⚡ **Modern UI/UX** – Clean, modular interface equipped with dynamic modals (`Popup`) and mode toggles (`Switch`).

---

## 🛠️ Tech Stack

| Technology | Role in Project |
| :--- | :--- |
| **React** | Declarative UI and component-based architecture |
| **TypeScript** | Strict typing for data structures, interfaces, and rendering logic |
| **Vite** | Fast development server and optimized production bundler |
| **HTML5 Canvas / WebGL** | High-performance 2D and 3D geometry rendering |
| **CSS Modules / Custom Styling** | Consistent and modern system styling |
| **ESLint** | Code quality enforcement and linting standards |

---

## 📁 Project Architecture

```text
src/
├── components/
│   ├── accordionField/    # Collapsible chart parameter sections
│   ├── buttons/           # Control buttons (save/load, switches)
│   ├── canva-2d/          # 2D chart rendering engine
│   ├── canva-3d/          # 3D projection and manipulation engine
│   ├── field/             # Individual form inputs
│   ├── fieldsData/        # Data point collection management logic
│   ├── popup/             # Modal dialogs and alerts
│   └── sectors/           # Workspace sectoring and layouts
├── App.tsx                # Main application state and layout orchestration
└── main.tsx               # Application entry point
```

---

## ⚡ Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) (version `>= 18.x`)
* Package manager: `npm`, `yarn`, or `pnpm`

### Step by Step

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/SharixVent/Sharix.git](https://github.com/SharixVent/math_charts.git)
   cd math_charts
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will run locally at: `http://localhost:5173/`

---

## 📦 Production Build

To bundle and optimize the application for deployment (e.g., GitHub Pages, Vercel, Netlify):

```bash
npm run build
```

Production-ready assets will be generated in the `/dist` directory. Preview the build:
```bash
npm run preview
```

---

## 📄 License

This project is open-source and available under the MIT License. See the [LICENSE](LICENSE) file for details.