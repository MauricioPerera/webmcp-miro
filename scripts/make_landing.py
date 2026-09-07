import sys

HTML_CONTENT = r'''<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Miro WebMCP — Pizarra Visual 100% Client-Side con IA Nativa</title>
  <meta name="description" content="Clon de Miro 100% client-side desplegable en GitHub Pages. Soporte nativo para agentes de IA mediante FastWebMCP, Tailwind CSS, HTMX y metodología KDD.">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Miro WebMCP — Pizarra Visual 100% Client-Side con IA Nativa">
  <meta property="og:description" content="Pizarra colaborativa para humanos y agentes de IA. Cero backend, máxima privacidad y 10 herramientas WebMCP registradas.">
  <meta property="og:url" content="https://mauricioperera.github.io/webmcp-miro/">
  
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23F59E0B'><path d='M4 4h4v16H4V4zm6 4h4v12h-4V8zm6 4h4v8h-4v-8z'/></svg>">
  
  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

  <!-- Tailwind CSS 3.4.17 CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace']
          },
          colors: {
            brand: {
              50: '#EEF2FF',
              100: '#E0E7FF',
              200: '#C7D2FE',
              500: '#6366F1',
              600: '#4F46E5',
              700: '#4338CA',
              900: '#312E81'
            }
          }
        }
      }
    };
  </script>

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    .gradient-hero {
      background: radial-gradient(circle at 50% 10%, rgba(99, 102, 241, 0.12) 0%, transparent 60%);
    }
    .card-hover {
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .dot-pattern {
      background-image: radial-gradient(#CBD5E1 1px, transparent 1px);
      background-size: 20px 20px;
    }
    .dark .dot-pattern {
      background-image: radial-gradient(#334155 1px, transparent 1px);
      background-size: 20px 20px;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">

  <!-- Navigation Bar -->
  <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Logo -->
      <a href="index.html" class="flex items-center gap-2.5 group">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md shadow-amber-400/20 group-hover:scale-105 transition-transform">
          <svg class="w-5 h-5 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h4v16H4V4zm6 4h4v12h-4V8zm6 4h4v8h-4v-8z"/>
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            Miro <span class="text-indigo-600 dark:text-indigo-400 font-black">WebMCP</span>
          </span>
          <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">100% Client-Side</span>
        </div>
      </a>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
        <a href="#features" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Características</a>
        <a href="#demo" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Demo en Vivo</a>
        <a href="#webmcp" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Herramientas WebMCP</a>
        <a href="#templates" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Plantillas</a>
        <a href="#kdd" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Arquitectura KDD</a>
      </nav>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3">
        <a href="https://github.com/MauricioPerera/webmcp-miro" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-all">
          <i data-lucide="github" class="w-4 h-4"></i>
          <span>GitHub</span>
        </a>

        <a href="app.html" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <span>Abrir Pizarra</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative overflow-hidden pt-12 pb-20 gradient-hero border-b border-slate-200/60 dark:border-slate-800/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Badges -->
      <div class="flex flex-wrap items-center justify-center gap-2 mb-6">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Estándar WebMCP Chrome 149+ & Fallback
        </span>

        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
          100% Client-Side (Zero Backend)
        </span>

        <a href="https://webmcp.com/sites/mauricioperera.github.io" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors">
          <i data-lucide="award" class="w-3.5 h-3.5 text-amber-500"></i>
          WebMCP Directory Verified (Grade B+ Solid)
        </a>
      </div>

      <!-- Headline & Pitch -->
      <div class="text-center max-w-4xl mx-auto mb-10">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15] mb-6">
          La Pizarra Visual Infinita con <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">IA Nativa</span> en tu Navegador
        </h1>
        <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
          Un clon de <strong>Miro 100% estático</strong> que se ejecuta por completo en el cliente. Crea diagramas de flujo, notas adhesivas, mapas mentales y arquitecturas de software sin servidores ni bases de datos. 
          Controlable por ti de forma fluida o por <strong>agentes de IA autónomos</strong> vía el estándar emergente <strong>WebMCP</strong>.
        </p>
      </div>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <a href="app.html" class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <i data-lucide="sparkles" class="w-5 h-5"></i>
          <span>Lanzar Pizarra Completa</span>
        </a>

        <a href="#demo" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all">
          <i data-lucide="play" class="w-4 h-4 text-indigo-500"></i>
          <span>Probar Playground Aquí</span>
        </a>

        <a href="https://github.com/MauricioPerera/webmcp-miro" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 transition-all">
          <i data-lucide="code-2" class="w-5 h-5"></i>
          <span>Código & Contratos KDD</span>
        </a>
      </div>

      <!-- Trust Metrics Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16 text-center">
        <div class="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur shadow-sm">
          <div class="text-3xl font-black text-indigo-600 dark:text-indigo-400">0 ms</div>
          <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Latencia de Servidor</div>
        </div>
        <div class="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur shadow-sm">
          <div class="text-3xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
          <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Privacidad Local</div>
        </div>
        <div class="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur shadow-sm">
          <div class="text-3xl font-black text-amber-500">10</div>
          <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Herramientas WebMCP</div>
        </div>
        <div class="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur shadow-sm">
          <div class="text-3xl font-black text-pink-600 dark:text-pink-400">33 / 33</div>
          <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Pruebas Verificadas</div>
        </div>
      </div>

      <!-- Live Interactive Demo Playground -->
      <div id="demo" class="max-w-6xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        <!-- Interactive Preview Header -->
        <div class="px-6 py-4 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-rose-500"></span>
            <span class="w-3 h-3 rounded-full bg-amber-500"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span class="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono">demo-whiteboard.live — Playground en Vivo</span>
          </div>

          <!-- Quick Actions -->
          <div class="flex flex-wrap items-center gap-2">
            <button id="hero-btn-sticky" class="px-2.5 py-1.5 text-xs font-semibold bg-amber-100 text-amber-900 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1">
              <i data-lucide="sticky-note" class="w-3.5 h-3.5"></i>
              <span>+ Nota</span>
            </button>
            <button id="hero-btn-flowchart" class="px-2.5 py-1.5 text-xs font-semibold bg-indigo-100 text-indigo-900 hover:bg-indigo-200 rounded-lg transition-colors flex items-center gap-1">
              <i data-lucide="git-branch" class="w-3.5 h-3.5"></i>
              <span>Flowchart</span>
            </button>
            <button id="hero-btn-mindmap" class="px-2.5 py-1.5 text-xs font-semibold bg-purple-100 text-purple-900 hover:bg-purple-200 rounded-lg transition-colors flex items-center gap-1">
              <i data-lucide="network" class="w-3.5 h-3.5"></i>
              <span>Mindmap</span>
            </button>
            <button id="hero-btn-architecture" class="px-2.5 py-1.5 text-xs font-semibold bg-emerald-100 text-emerald-900 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1">
              <i data-lucide="cpu" class="w-3.5 h-3.5"></i>
              <span>Arquitectura</span>
            </button>
            <button id="hero-btn-clear" class="px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
              Limpiar
            </button>
            <a href="app.html" class="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1">
              <span>Pantalla Completa</span>
              <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        </div>

        <!-- Canvas Container -->
        <div class="relative w-full h-[520px] bg-slate-50 dark:bg-slate-950 overflow-hidden dot-pattern">
          <canvas id="hero-canvas" class="w-full h-full block cursor-crosshair"></canvas>
          
          <!-- Floating notification badge -->
          <div class="absolute left-4 bottom-4 z-10 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Arrastra figuras o usa los botones para probar el motor en tiempo real.</span>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mb-3">Herramientas & Experiencia</h2>
        <p class="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
          Diseñado con el detalle de Miro, la ligereza de Tailwind y la autonomía de WebMCP.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Feature 1 -->
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 card-hover">
          <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
            <i data-lucide="sticky-note" class="w-6 h-6"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Notas Adhesivas Pasteles</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            6 colores pasteles estilo Miro, auto-ajuste de texto multilínea, sombras volumétricas y edición en línea instantánea.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 card-hover">
          <div class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
            <i data-lucide="git-commit" class="w-6 h-6"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Conectores Inteligentes</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Flechas rectas, ortogonales y curvas Bézier. Se anclan dinámicamente a los bordes y actualizan sus trayectorias al mover figuras.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 card-hover">
          <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
            <i data-lucide="shapes" class="w-6 h-6"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">8 Figuras Geométricas</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Rectángulos redondeados, círculos, diamantes de decisión, cilindros de bases de datos, triángulos, nubes y estrellas.
          </p>
        </div>

        <!-- Feature 4 -->
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 card-hover">
          <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
            <i data-lucide="frame" class="w-6 h-6"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Marcos Contenedores</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Organiza secciones con Frames. Al arrastrar un marco contenedor, todos los elementos encerrados se desplazan sincrónicamente.
          </p>
        </div>

        <!-- Feature 5 -->
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 card-hover">
          <div class="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5">
            <i data-lucide="pen-tool" class="w-6 h-6"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Dibujo Libre & Resaltador</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Trazo suavizado cuadrático para dibujo manual, resaltador fluorescente con modo de fusión y borrador de trazos precisos.
          </p>
        </div>

        <!-- Feature 6 -->
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 card-hover">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
            <i data-lucide="map" class="w-6 h-6"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Minimap Radar & Zoom 400%</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Radar flotante interactivo para navegar lienzos gigantes, zoom centrado en puntero desde 15% hasta 400% y encuadre automático.
          </p>
        </div>

        <!-- Feature 7 -->
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 card-hover">
          <div class="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5">
            <i data-lucide="history" class="w-6 h-6"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Historial & Persistencia</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Pila de 50 estados Undo/Redo con atajos estándar (Ctrl+Z / Ctrl+Y) y guardado automático resiliente en LocalStorage.
          </p>
        </div>

        <!-- Feature 8 -->
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 card-hover">
          <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
            <i data-lucide="download" class="w-6 h-6"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Exportación PNG, SVG & JSON</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Exporta imágenes nítidas de alta resolución (DPR escalado), archivos vectoriales SVG editables o respaldos JSON completos.
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- WebMCP Tools Section -->
  <section id="webmcp" class="py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 mb-3">
          Estándar Emergente W3C WebMCP
        </span>
        <h2 class="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
          10 Herramientas Registradas para Agentes de IA
        </h2>
        <p class="text-slate-600 dark:text-slate-400 mt-4 text-base">
          Cualquier agente de IA compatible (Claude, GPT, Gemini o extensiones de navegador con el origin trial de Chrome 149+) puede inspeccionar, dibujar y manipular la pizarra de manera autónoma con contratos de esquema estrictos.
        </p>
      </div>

      <!-- Tools Table & Inspector -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- Left: List of 10 Tools -->
        <div class="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
            <span class="font-bold text-sm text-slate-900 dark:text-white font-mono">document.modelContext.tools</span>
            <span class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">10 Registradas</span>
          </div>

          <div class="divide-y divide-slate-200/70 dark:divide-slate-800/70 font-mono text-xs">
            <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">whiteboard_create_sticky_note</span>
                <p class="text-slate-500 font-sans text-xs mt-0.5">Crea notas adhesivas pasteles con texto y coordenadas (x, y).</p>
              </div>
              <span class="text-slate-400 shrink-0 font-mono text-[11px]">(text, color?, x?, y?)</span>
            </div>

            <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">whiteboard_create_shape</span>
                <p class="text-slate-500 font-sans text-xs mt-0.5">Genera figuras geométricas (círculo, rectángulo, diamante, etc.).</p>
              </div>
              <span class="text-slate-400 shrink-0 font-mono text-[11px]">(shapeType, text?, x?, y?)</span>
            </div>

            <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">whiteboard_create_connector</span>
                <p class="text-slate-500 font-sans text-xs mt-0.5">Enlaza figuras con flechas reactivas inteligentes.</p>
              </div>
              <span class="text-slate-400 shrink-0 font-mono text-[11px]">(fromId, toId, label?, style?)</span>
            </div>

            <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">whiteboard_create_frame</span>
                <p class="text-slate-500 font-sans text-xs mt-0.5">Crea un contenedor de sección con título.</p>
              </div>
              <span class="text-slate-400 shrink-0 font-mono text-[11px]">(title, x?, y?, width?, height?)</span>
            </div>

            <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">whiteboard_generate_diagram</span>
                <p class="text-slate-500 font-sans text-xs mt-0.5">Genera diagramas completos (kanban, flowchart, mindmap, arquitectura) en una sola llamada.</p>
              </div>
              <span class="text-slate-400 shrink-0 font-mono text-[11px]">(diagramType, title?)</span>
            </div>

            <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">whiteboard_get_board_state</span>
                <p class="text-slate-500 font-sans text-xs mt-0.5">Permite al agente inspeccionar todos los elementos y coordenadas.</p>
              </div>
              <span class="text-slate-400 shrink-0 font-mono text-[11px]">() => BoardState</span>
            </div>

            <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">whiteboard_update_elements</span>
                <p class="text-slate-500 font-sans text-xs mt-0.5">Modifica propiedades atómicas (texto, color, posición).</p>
              </div>
              <span class="text-slate-400 shrink-0 font-mono text-[11px]">(id | ids, text?, color?, x?, y?)</span>
            </div>

            <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">whiteboard_delete_elements</span>
                <p class="text-slate-500 font-sans text-xs mt-0.5">Elimina elementos por IDs y desvincula conectores en cascada.</p>
              </div>
              <span class="text-slate-400 shrink-0 font-mono text-[11px]">(ids: string[])</span>
            </div>

            <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">whiteboard_clear_board</span>
                <p class="text-slate-500 font-sans text-xs mt-0.5">Limpia el lienzo completo registrando el cambio en el historial.</p>
              </div>
              <span class="text-slate-400 shrink-0 font-mono text-[11px]">() => { success }</span>
            </div>

            <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">whiteboard_zoom_to_fit</span>
                <p class="text-slate-500 font-sans text-xs mt-0.5">Enfoca y encuadra automáticamente todo el contenido en pantalla.</p>
              </div>
              <span class="text-slate-400 shrink-0 font-mono text-[11px]">() => { zoom }</span>
            </div>
          </div>
        </div>

        <!-- Right: AI Journey Test Card -->
        <div class="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-900/60 shadow-xl flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">WebMCP Directory Test</span>
            </div>

            <h3 class="text-xl font-black mb-3">Veredicto Oficial: PASSED</h3>
            <p class="text-sm text-slate-300 leading-relaxed mb-6">
              WebMCP Directory ejecutó una prueba autónoma en vivo sobre el despliegue de GitHub Pages. Un agente resolvió la tarea en <strong>2 segundos con 3 llamadas a herramientas</strong>:
            </p>

            <div class="bg-black/50 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 mb-6 space-y-2">
              <div class="text-emerald-400">✓ whiteboard_clear_board()</div>
              <div class="text-emerald-400">✓ whiteboard_generate_diagram({ diagramType: 'mindmap' })</div>
              <div class="text-emerald-400">✓ whiteboard_zoom_to_fit()</div>
              <div class="text-slate-400 text-[11px] pt-1 border-t border-slate-800">Goal reached in 2s • 100% Success</div>
            </div>
          </div>

          <a href="https://webmcp.com/sites/mauricioperera.github.io" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/30">
            <span>Ver Ficha en WebMCP Directory</span>
            <i data-lucide="external-link" class="w-4 h-4"></i>
          </a>
        </div>

      </div>

    </div>
  </section>

  <!-- Starter Templates Section -->
  <section id="templates" class="py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mb-3">Plantillas de Inicio</h2>
        <p class="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
          Comienza en 1 clic con diagramas listos para usar
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Template 1: Kanban -->
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between card-hover">
          <div>
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 font-bold">
              <i data-lucide="columns-3" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">Tablero Kanban</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Columnas To Do, In Progress y Done organizadas en Frames con notas de colores pasteles.
            </p>
          </div>
          <a href="app.html?template=kanban" class="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all">
            <span>Usar Plantilla</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </a>
        </div>

        <!-- Template 2: Flowchart -->
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between card-hover">
          <div>
            <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 font-bold">
              <i data-lucide="git-branch" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">Diagrama de Flujo</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Nodos de inicio, pasos de proceso, diamantes de decisión y flechas ortogonales guiadas.
            </p>
          </div>
          <a href="app.html?template=flowchart" class="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all">
            <span>Usar Plantilla</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </a>
        </div>

        <!-- Template 3: Mindmap -->
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between card-hover">
          <div>
            <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 font-bold">
              <i data-lucide="network" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">Mapa Mental</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Concepto nuclear central conectado radialmente a ideas hijas con flechas curvas fluidas.
            </p>
          </div>
          <a href="app.html?template=mindmap" class="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all">
            <span>Usar Plantilla</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </a>
        </div>

        <!-- Template 4: Architecture -->
        <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between card-hover">
          <div>
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 font-bold">
              <i data-lucide="cpu" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">Arquitectura Cloud</h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Componentes frontend, puente de herramientas FastWebMCP, almacenamiento y flujos de datos.
            </p>
          </div>
          <a href="app.html?template=architecture" class="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all">
            <span>Usar Plantilla</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </a>
        </div>

      </div>

    </div>
  </section>

  <!-- KDD Methodology & Quality Gates Section -->
  <section id="kdd" class="py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 mb-3">
          Metodología Knowledge-Driven Development (KDD)
        </span>
        <h2 class="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
          "Si no se puede verificar entonces no funciona"
        </h2>
        <p class="text-slate-600 dark:text-slate-400 mt-4 text-base">
          Desarrollado según la metodología KDD de Mauricio Perera. Cada módulo de arquitectura está modelado en nodos OKF y sellado mediante contratos CCDD con hashes criptográficos SHA256 inmutables.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-1">11 Nodos OKF</div>
          <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">knowledge/</div>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Especificación de arquitectura para canvas 2D, transformaciones de viewport, modelo de estados, runtime WebMCP y diseño de interfaz.
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">5 Contratos CCDD</div>
          <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">knowledge/contracts/</div>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Contratos de tareas con presupuestos de líneas, límites ciclomáticos y hashes de pruebas congelados (tests_sha256).
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="text-2xl font-black text-amber-500 mb-1">0 Dependencias</div>
          <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Python & Node Scripts</div>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Validadores de gates de calidad autónomos que ejecutan pruebas unitarias y de estrés en CI/CD (Ubuntu + Windows).
          </p>
        </div>

      </div>

    </div>
  </section>

  <!-- CTA Banner Section -->
  <section class="py-20 bg-indigo-600 text-white text-center">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl sm:text-4xl font-black tracking-tight mb-4">
        ¿Listo para dibujar con humanos y agentes de IA?
      </h2>
      <p class="text-indigo-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
        Sin inicios de sesión, sin configuración, sin servidores. Todo se ejecuta de manera segura en tu navegador con persistencia en tu propio almacenamiento local.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <a href="app.html" class="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-2xl shadow-xl hover:scale-105 transition-all">
          <span>Abrir Pizarra Ahora</span>
          <i data-lucide="arrow-right" class="w-5 h-5"></i>
        </a>
        <a href="https://github.com/MauricioPerera/webmcp-miro" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-7 py-4 text-base font-semibold text-white bg-indigo-700/80 hover:bg-indigo-700 rounded-2xl border border-indigo-400/40 transition-all">
          <i data-lucide="star" class="w-5 h-5 text-amber-300"></i>
          <span>Dar Estrella en GitHub</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
          <svg class="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h4v16H4V4zm6 4h4v12h-4V8zm6 4h4v8h-4v-8z"/>
          </svg>
        </div>
        <span class="font-bold text-white tracking-tight">Miro WebMCP</span>
        <span class="text-xs text-slate-600 font-mono">v1.0.0</span>
      </div>

      <div class="flex flex-wrap items-center gap-6 text-xs font-medium">
        <a href="app.html" class="hover:text-white transition-colors">Pizarra</a>
        <a href="https://mauricioperera.github.io/fastwebmcp/" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">FastWebMCP</a>
        <a href="https://webmcp.com" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">WebMCP Standard</a>
        <a href="https://github.com/MauricioPerera/KDD" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">KDD Framework</a>
        <a href="https://github.com/MauricioPerera/webmcp-miro" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">Repositorio</a>
      </div>

      <div class="text-xs text-slate-600">
        Creado con KDD por <a href="https://github.com/MauricioPerera" target="_blank" class="text-slate-400 hover:text-white underline">Mauricio Perera</a>.
      </div>
    </div>
  </footer>

  <!-- Interactive Hero Playground Engine Script -->
  <script type="module">
    import { BoardStore } from './src/board-store.js';
    import { CanvasEngine } from './src/canvas-engine.js';
    import { registerBoardWebMcpTools } from './src/webmcp-board-tools.js';

    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
      const store = new BoardStore('hero-preview-board');
      const engine = new CanvasEngine(canvas, store);

      // Register the 10 WebMCP tools on the landing page too so any AI scanner or agent detects them!
      registerBoardWebMcpTools(store);

      // Populate hero demo with initial colorful layout
      const s1 = store.addElement({
        type: 'shape',
        shapeType: 'rounded-rectangle',
        text: 'Human Brainstorming',
        x: 60,
        y: 80,
        width: 170,
        height: 70,
        fillColor: '#FFFFFF'
      }, false);

      const s2 = store.addElement({
        type: 'shape',
        shapeType: 'diamond',
        text: 'FastWebMCP Bridge',
        x: 290,
        y: 65,
        width: 160,
        height: 100,
        fillColor: '#FEF08A'
      }, false);

      const s3 = store.addElement({
        type: 'shape',
        shapeType: 'circle',
        text: 'AI Agent (WebMCP)',
        x: 510,
        y: 80,
        width: 150,
        height: 70,
        fillColor: '#E0E7FF',
        strokeColor: '#4338CA'
      }, false);

      const sticky = store.addElement({
        type: 'sticky',
        text: '✨ 100% Client-Side\nNo backend required!\nReady for AI agents.',
        x: 700,
        y: 60,
        width: 170,
        height: 150,
        color: '#BBF7D0'
      }, false);

      store.addElement({
        type: 'connector',
        fromId: s1.id,
        toId: s2.id,
        label: 'UI Events',
        style: 'orthogonal'
      }, false);

      store.addElement({
        type: 'connector',
        fromId: s2.id,
        toId: s3.id,
        label: 'Tool Dispatch',
        style: 'orthogonal'
      }, false);

      store.addElement({
        type: 'connector',
        fromId: s3.id,
        toId: sticky.id,
        label: 'Generate Note',
        style: 'curved'
      }, false);

      store.zoomToFit(canvas.clientWidth || 900, canvas.clientHeight || 500);

      // Wire quick action buttons
      document.getElementById('hero-btn-sticky')?.addEventListener('click', () => {
        store.addElement({
          type: 'sticky',
          text: 'Nueva Nota ' + Math.floor(Math.random() * 100),
          x: 100 + Math.random() * 300,
          y: 150 + Math.random() * 200,
          width: 160,
          height: 140
        });
      });

      document.getElementById('hero-btn-flowchart')?.addEventListener('click', () => {
        const reg = window.__WEBMCP_REGISTRY__;
        if (reg && reg.has('whiteboard_generate_diagram')) {
          store.clearBoard();
          reg.get('whiteboard_generate_diagram').execute({ diagramType: 'flowchart' });
        }
      });

      document.getElementById('hero-btn-mindmap')?.addEventListener('click', () => {
        const reg = window.__WEBMCP_REGISTRY__;
        if (reg && reg.has('whiteboard_generate_diagram')) {
          store.clearBoard();
          reg.get('whiteboard_generate_diagram').execute({ diagramType: 'mindmap' });
        }
      });

      document.getElementById('hero-btn-architecture')?.addEventListener('click', () => {
        const reg = window.__WEBMCP_REGISTRY__;
        if (reg && reg.has('whiteboard_generate_diagram')) {
          store.clearBoard();
          reg.get('whiteboard_generate_diagram').execute({ diagramType: 'architecture' });
        }
      });

      document.getElementById('hero-btn-clear')?.addEventListener('click', () => {
        store.clearBoard();
      });

      // Expose for testing
      window.__HERO_WHITEBOARD__ = { store, engine };
    }

    // Initialize Lucide Icons
    lucide.createIcons();
  </script>
</body>
</html>
'''

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(HTML_CONTENT)
print("index.html successfully generated!")
