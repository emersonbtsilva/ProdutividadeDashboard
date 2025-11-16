# 📱 Dashboard de Produtividade

Um aplicativo React Native moderno e completo para gerenciamento de tarefas e análise de produtividade, desenvolvido com as melhores práticas e tecnologias atuais.

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)

## 👥 Equipe de Desenvolvimento

- **Emerson Batista da Silva** - RM96288
- **Lucas Fernandes Marabini Gaspar** - RM98814

*Projeto desenvolvido para a disciplina de Advanced Programming & Mobile Development*

## ✨ Funcionalidades

### 🚀 Core Features
- ✅ **Gerenciamento Completo de Tarefas** (CRUD)
- 📊 **Dashboard Visual Interativo** com gráficos dinâmicos
- 🔍 **Sistema de Filtros Avançado** (status, prioridade, categoria, busca textual)
- 📱 **Persistência Local** com AsyncStorage
- ⚡ **Interface Responsiva** e otimizada

### 📈 Analytics & Insights
- 📊 **Gráfico de Pizza** - Distribuição por status
- 📈 **Gráfico de Barras** - Análise por prioridade
- 🎯 **Métricas de Produtividade** - Taxa de conclusão, tarefas atrasadas
- 💡 **Insights Inteligentes** - Sugestões personalizadas baseadas nos dados
- 🏆 **Estatísticas Detalhadas** - Total, concluídas, pendentes, por categoria

### 🎨 UX/UI Avançado
- 🎯 **Categorização** (Trabalho, Pessoal, Estudos, Saúde, Outros)
- ⭐ **Sistema de Prioridades** (Baixa, Média, Alta, Urgente)
- 📅 **Gestão de Datas** (criação, atualização, vencimento)
- 🔄 **Pull-to-Refresh** para sincronização
- ⚠️ **Tratamento Robusto de Erros** com feedback visual
- 🔍 **Busca em Tempo Real** com debounce

## 🏗️ Arquitetura & Stack Tecnológica

### **Frontend & Mobile**
- **React Native 0.75.5** - Framework principal
- **Expo 54** - Toolchain e build system
- **TypeScript** - Tipagem estática e IntelliSense
- **React Navigation 7** - Navegação nativa

### **Visualização de Dados**
- **react-native-svg-charts** - Gráficos interativos
- **react-native-svg** - Elementos SVG customizados

### **Gerenciamento de Estado & Dados**
- **Custom Hooks** - Lógica de negócio reutilizável
- **AsyncStorage** - Persistência local segura
- **Optimistic Updates** - UX responsiva

### **Qualidade & Testes**
- **Jest** - Framework de testes unitários
- **ESLint** - Análise estática de código
- **TypeScript Strict Mode** - Validação de tipos rigorosa

## 📂 Estrutura do Projeto

```
ProdutividadeDashboard/
├── 📱 App.tsx                    # Entry point
├── 📋 index.ts                   # Expo registration
├── 🎨 src/
│   ├── 🧩 components/           # Componentes reutilizáveis
│   │   ├── ProductivityChart.tsx     # Dashboard analytics
│   │   ├── TaskForm.tsx             # Formulário de tarefas
│   │   ├── TaskList.tsx             # Lista interativa
│   │   ├── TaskFilters.tsx          # Sistema de filtros
│   │   └── *.styles.ts              # Estilos modulares
│   ├── 🎯 hooks/               # Custom Hooks
│   │   └── useTasks.ts             # Lógica principal de tarefas
│   ├── 📊 models/              # Tipos e interfaces
│   │   └── Task.ts                 # Modelo de dados completo
│   ├── 🗂️ services/            # Camada de serviços
│   │   └── storage.ts              # AsyncStorage com error handling
│   ├── 🛠️ utils/               # Utilitários
│   │   └── validation.ts           # Validações e sanitização
│   ├── 🎨 styles/              # Design system
│   │   └── global.ts               # Cores e tipografia
│   ├── ⚙️ constants/           # Configurações
│   │   └── config.ts               # Constantes da aplicação
│   ├── 🧪 __tests__/          # Testes automatizados
│   │   ├── setup.ts                # Configuração Jest
│   │   ├── utils/                  # Testes de utilitários
│   │   └── services/               # Testes de serviços
│   ├── 🧭 navigation/          # Navegação
│   └── 📱 screens/            # Telas da aplicação
└── 🔧 Configurações (package.json, tsconfig.json, etc.)
```

## 🚀 Instalação & Execução

### **Pré-requisitos**
- Node.js (v18 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Dispositivo físico com Expo Go ou emulador Android/iOS

### **1. Clone o Repositório**
```bash
git clone https://github.com/emersonbtsilva/ProdutividadeDashboard.git
cd ProdutividadeDashboard
```

### **2. Instale as Dependências**
```bash
npm install
# ou
yarn install
```

### **3. Inicie o Projeto**
```bash
npm start
# ou
expo start
```

### **4. Execute em Dispositivo/Emulador**

#### **📱 Dispositivo Físico**
- Escaneie o QR code com o app **Expo Go**
- Android: Expo Go app
- iOS: Câmera nativa

#### **🖥️ Emulador**
- Android: Pressione `a` no terminal
- iOS: Pressione `i` no terminal  
- Web: Pressione `w` no terminal

## 📊 Funcionalidades Técnicas Avançadas

### **🔒 Segurança & Validação**
- Sanitização de entradas
- Validação de tipos em runtime
- Tratamento de erros gracioso
- Limites de dados (1000 tarefas, 100 chars título)

### **⚡ Performance**
- Memoização de cálculos pesados
- Debounce em buscas (300ms)
- Optimistic updates
- Lazy loading de componentes

### **🔄 Gestão de Estado**
- Estado local com hooks otimizados
- Sincronização automática com storage
- Rollback em caso de erro
- Cache de filtros

### **📱 UX Nativo**
- Pull-to-refresh nativo
- Haptic feedback
- Transições suaves
- Indicadores de loading contextual

