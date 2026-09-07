/**
 * 100% Client-Side Internationalization (i18n) Module
 * Supports Spanish (es), English (en), and Portuguese (pt).
 * Zero external dependencies, pure ES6 module.
 */

export const SUPPORTED_LANGS = ['es', 'en', 'pt'];
export const DEFAULT_LANG = 'es';
export const STORAGE_KEY = 'webmcp_miro_lang';

export const TRANSLATIONS = {
  es: {
    // Navigation & Global
    'nav.home': 'Inicio',
    'nav.features': 'Características',
    'nav.demo': 'Demo en Vivo',
    'nav.webmcp': 'Herramientas WebMCP',
    'nav.templates': 'Plantillas',
    'nav.kdd': 'Arquitectura KDD',
    'nav.github': 'GitHub',
    'nav.openApp': 'Abrir Pizarra',
    'nav.webmcpAgent': 'Agente WebMCP',
    'nav.export': 'Exportar',

    // Hero Section
    'hero.badge': '🚀 100% Client-Side & GitHub Pages',
    'hero.badgeMcp': 'WebMCP Estándar v1.0',
    'hero.titleLine1': 'Pizarra Visual Colaborativa',
    'hero.titleHighlight': 'Nativa para Agentes de IA',
    'hero.titleLine2': 'y Humanos Creativos',
    'hero.subtitle': 'Un clon moderno y ultrarrápido de Miro desplegable en GitHub Pages con cero servidores de backend. Diseñado bajo Knowledge-Driven Development (KDD) con soporte WebMCP para automatización total mediante IA.',
    'hero.ctaOpen': 'Iniciar Pizarra en Blanco',
    'hero.ctaGithub': 'Ver Código en GitHub',
    'hero.metric1': '0ms',
    'hero.metric1Label': 'Latencia de Backend (Estático)',
    'hero.metric2': '10',
    'hero.metric2Label': 'Herramientas WebMCP Listas',
    'hero.metric3': '60 FPS',
    'hero.metric3Label': 'Renderizado Vectorial en Canvas',
    'hero.metric4': '100%',
    'hero.metric4Label': 'Privacidad (Todo en Local)',

    // Hero Playground
    'playground.badge': 'Mini Canvas Interactivo',
    'playground.btnSticky': '+ Nota',
    'playground.btnFlowchart': 'Flowchart',
    'playground.btnMindmap': 'Mindmap',
    'playground.btnArchitecture': 'Arquitectura',
    'playground.btnClear': 'Limpiar',
    'playground.hint': '💡 Prueba hacer clic en los botones o arrastrar elementos en este lienzo en vivo.',

    // Features Section
    'features.badge': 'Capacidades de Vanguardia',
    'features.title': 'Todo lo que necesitas en una pizarra moderna',
    'features.subtitle': 'Diseñada desde cero para brindar una experiencia fluida e intuitiva tanto a usuarios humanos como a agentes autónomos.',
    'features.infiniteCanvasTitle': 'Lienzo Infinito 2D',
    'features.infiniteCanvasDesc': 'Pan fluido con rueda o espacio, zoom centrado en el cursor (15% a 400%), cuadrícula de puntos estilo Miro y minimapa interactivo.',
    'features.smartConnectorsTitle': 'Conectores Inteligentes',
    'features.smartConnectorsDesc': 'Flechas curvas, ortogonales y rectas que se acoplan magnéticamente a las formas y las siguen automáticamente al moverlas.',
    'features.webmcpNativeTitle': 'IA Nativa WebMCP',
    'features.webmcpNativeDesc': 'Integración oficial con el estándar WebMCP (webmcp.com) mediante FastWebMCP. Permite a modelos de lenguaje crear y editar tableros directamente.',
    'features.templatesTitle': 'Plantillas Instantáneas',
    'features.templatesDesc': 'Arranca en un clic con tableros Kanban, diagramas de flujo de decisiones, mapas mentales radiales o diagramas de arquitectura cloud.',
    'features.exportImportTitle': 'Exportación e Importación',
    'features.exportImportDesc': 'Descarga tus creaciones en imágenes PNG de alta resolución, vectores SVG escalables o copias de seguridad completas en formato JSON.',
    'features.kddEngineeredTitle': 'Ingeniería Rigurosa KDD',
    'features.kddEngineeredDesc': 'Desarrollado bajo Knowledge-Driven Development (OKF + CCDD), con compuertas de calidad deterministas y 0 dependencias frágiles.',

    // WebMCP Tools
    'webmcp.badge': 'WebMCP API Explorer',
    'webmcp.title': '10 Herramientas Registradas para Agentes de IA',
    'webmcp.subtitle': 'Cualquier agente con capacidad WebMCP (vía document.modelContext o consola integrada) puede invocar estas funciones.',
    'webmcp.toolSticky': 'Crea notas adhesivas en 6 tonos pastel con coordenadas x/y.',
    'webmcp.toolShape': 'Crea rectángulos, círculos, diamantes, cilindros y nubes.',
    'webmcp.toolConnector': 'Conecta dos elementos con flechas inteligentes dinámicas.',
    'webmcp.toolFrame': 'Crea contenedores de agrupación que mueven sus hijos.',
    'webmcp.toolDiagram': 'Genera diagramas completos (kanban, flowchart, mindmap, architecture).',
    'webmcp.toolState': 'Inspecciona la cantidad y atributos de elementos del tablero.',
    'webmcp.toolUpdate': 'Modifica texto, color o posición de uno o múltiples elementos.',
    'webmcp.toolDelete': 'Elimina elementos y limpia conexiones asociadas.',
    'webmcp.toolClear': 'Reinicia y limpia completamente el lienzo de la pizarra.',
    'webmcp.toolZoom': 'Centra y ajusta la cámara para encuadrar todos los elementos.',

    // Templates Section
    'templates.badge': 'Plantillas Listas para Usar',
    'templates.title': 'Comienza en segundos con diagramas preconfigurados',
    'templates.subtitle': 'Haz clic en cualquier plantilla para abrir directamente el espacio de trabajo con la estructura generada.',
    'templates.kanbanTitle': 'Tablero Kanban Ágil',
    'templates.kanbanDesc': 'Tres columnas (Por Hacer, En Progreso, Terminado) con notas adhesivas pastel para gestión ágil de proyectos.',
    'templates.flowchartTitle': 'Diagrama de Flujo',
    'templates.flowchartDesc': 'Flujo de proceso con nodo de inicio, bloque de decisión en diamante y flechas ortogonales conectadas.',
    'templates.mindmapTitle': 'Mapa Mental de Ideas',
    'templates.mindmapDesc': 'Nodo central radial con ramas conceptuales y conectores curvos dinámicos para sesiones de brainstorming.',
    'templates.architectureTitle': 'Arquitectura de Sistemas',
    'templates.architectureDesc': 'Diagrama con cliente navegador, gateway WebMCP, motor Canvas 2D y base de datos local.',
    'templates.launch': 'Lanzar Plantilla →',

    // KDD Section
    'kdd.badge': 'Metodología KDD',
    'kdd.title': '"Si no se puede verificar entonces no funciona"',
    'kdd.subtitle': 'Este proyecto fue construido aplicando rigurosamente el estándar Knowledge-Driven Development (KDD) de Mauricio Perera.',
    'kdd.rule1Title': 'OKF (Open Knowledge Format)',
    'kdd.rule1Desc': 'Base de conocimiento estructurada en markdown con metadatos YAML frontmatter y grafo de alcanzabilidad verificable.',
    'kdd.rule2Title': 'CCDD (Contract-Driven Development)',
    'kdd.rule2Desc': 'Contratos de tarea inmutables con hashes sha256 sellados sobre los tests y perímetro estricto touch_only.',
    'kdd.rule3Title': 'Zero-Assumption Architecture',
    'kdd.rule3Desc': 'Batería de pruebas automatizada que valida casos adversariales, límites de memoria y ataques XSS.',

    // Footer
    'footer.text': 'Miro WebMCP — Pizarra 100% Client-Side basada en KDD, FastWebMCP, Tailwind CSS y HTMX.',
    'footer.verified': 'Verificado con 23 pruebas unitarias y catalogado en webmcp.com.',

    // Whiteboard Canvas Toolbar
    'app.defaultTitle': 'Pizarra de Ideas y Arquitectura',
    'app.select': 'Seleccionar (V)',
    'app.pan': 'Mano / Pan (H o Espacio+arrastrar)',
    'app.sticky': 'Nota Adhesiva (S)',
    'app.shape': 'Formas Geométricas (R)',
    'app.text': 'Texto (T)',
    'app.connector': 'Flecha / Conector Inteligente (C)',
    'app.pen': 'Lápiz (P)',
    'app.highlighter': 'Marcador Resaltador',
    'app.eraser': 'Borrador',
    'app.frame': 'Contenedor / Marco (F)',
    'app.undo': 'Deshacer (Ctrl+Z)',
    'app.redo': 'Rehacer (Ctrl+Y)',
    'app.zoomIn': 'Acercar Zoom',
    'app.zoomOut': 'Alejar Zoom',
    'app.zoomReset': 'Restablecer Zoom a 100%',
    'app.zoomFit': 'Ajustar a la Pantalla (0)',
    'app.minimap': 'Alternar Minimapa',

    // Shapes sub-menu
    'shape.rect': 'Rectángulo',
    'shape.circle': 'Círculo',
    'shape.diamond': 'Rombo',
    'shape.triangle': 'Triángulo',
    'shape.cylinder': 'Base de Datos',
    'shape.cloud': 'Nube',

    // Context Bar
    'ctx.bringFront': 'Traer al Frente',
    'ctx.sendBack': 'Enviar al Fondo',
    'ctx.duplicate': 'Duplicar (Ctrl+D)',
    'ctx.delete': 'Eliminar (Supr)',

    // WebMCP Drawer
    'drawer.title': 'Consola de Agente IA WebMCP',
    'drawer.simulateCommands': 'Simular Comandos de Agente',
    'drawer.btnKanban': '📋 Generar Tablero Kanban',
    'drawer.btnArchitecture': '☁️ Arquitectura Cloud',
    'drawer.btnMindmap': '🧠 Mapa Mental de Agentes',
    'drawer.btnStickies': '💡 3 Notas de Estrategia',
    'drawer.directRunner': 'Ejecutor Directo de Herramientas',
    'drawer.selectTool': 'Seleccionar Herramienta:',
    'drawer.inputArgs': 'Argumentos de Entrada (JSON):',
    'drawer.executeBtn': 'Ejecutar Herramienta WebMCP',
    'drawer.outputResponse': 'Respuesta de Salida:',
    'drawer.awaiting': 'Esperando invocación...',
    'drawer.catalog': 'Catálogo de Herramientas Registradas',
    'drawer.badgeNative': 'WebMCP Nativo Activo',
    'drawer.badgeFallback': 'WebMCP Fallback Listo',

    // Modals
    'modal.templatesTitle': 'Elegir una Plantilla de Pizarra',
    'modal.exportTitle': 'Exportar o Importar Pizarra',
    'modal.pngTitle': 'Descargar Imagen PNG',
    'modal.pngDesc': 'Imagen rasterizada de alta resolución de los elementos.',
    'modal.svgTitle': 'Descargar Vector SVG',
    'modal.svgDesc': 'Formato vectorial escalable ideal para diseño y web.',
    'modal.jsonTitle': 'Exportar JSON de la Pizarra',
    'modal.jsonDesc': 'Copia de seguridad completa para migración o agentes.',
    'modal.importLabel': 'Importar desde archivo JSON:',
    'modal.importBtn': 'Seleccionar archivo',
  },

  en: {
    // Navigation & Global
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.demo': 'Live Demo',
    'nav.webmcp': 'WebMCP Tools',
    'nav.templates': 'Templates',
    'nav.kdd': 'KDD Architecture',
    'nav.github': 'GitHub',
    'nav.openApp': 'Open Board',
    'nav.webmcpAgent': 'WebMCP Agent',
    'nav.export': 'Export',

    // Hero Section
    'hero.badge': '🚀 100% Client-Side & GitHub Pages',
    'hero.badgeMcp': 'WebMCP Standard v1.0',
    'hero.titleLine1': 'Collaborative Visual Board',
    'hero.titleHighlight': 'Native for AI Agents',
    'hero.titleLine2': 'and Creative Humans',
    'hero.subtitle': 'A modern, ultra-fast Miro clone deployable on GitHub Pages with zero backend servers. Built under Knowledge-Driven Development (KDD) with WebMCP support for full AI automation.',
    'hero.ctaOpen': 'Start Blank Whiteboard',
    'hero.ctaGithub': 'View Code on GitHub',
    'hero.metric1': '0ms',
    'hero.metric1Label': 'Backend Latency (Static)',
    'hero.metric2': '10',
    'hero.metric2Label': 'WebMCP Tools Ready',
    'hero.metric3': '60 FPS',
    'hero.metric3Label': 'Vector Canvas Rendering',
    'hero.metric4': '100%',
    'hero.metric4Label': 'Privacy (Local Only)',

    // Hero Playground
    'playground.badge': 'Interactive Live Canvas',
    'playground.btnSticky': '+ Note',
    'playground.btnFlowchart': 'Flowchart',
    'playground.btnMindmap': 'Mindmap',
    'playground.btnArchitecture': 'Architecture',
    'playground.btnClear': 'Clear',
    'playground.hint': '💡 Try clicking the quick buttons or dragging items around this live canvas.',

    // Features Section
    'features.badge': 'State of the Art Capabilities',
    'features.title': 'Everything you need in a modern whiteboard',
    'features.subtitle': 'Engineered from scratch to deliver a seamless and intuitive workflow for both human designers and autonomous agents.',
    'features.infiniteCanvasTitle': 'Infinite 2D Canvas',
    'features.infiniteCanvasDesc': 'Smooth wheel or space pan, cursor-anchored zoom (15% to 400%), Miro dot grid and draggable radar minimap.',
    'features.smartConnectorsTitle': 'Smart Connectors',
    'features.smartConnectorsDesc': 'Curved, orthogonal, and straight arrows that magnetically attach to shapes and dynamically track when moved.',
    'features.webmcpNativeTitle': 'Native WebMCP AI',
    'features.webmcpNativeDesc': 'Official integration with the WebMCP standard (webmcp.com) via FastWebMCP. Allows language models to manipulate boards directly.',
    'features.templatesTitle': 'Instant 1-Click Templates',
    'features.templatesDesc': 'Kickstart with agile Kanban boards, decision flowcharts, radial mind maps, or system cloud architecture diagrams.',
    'features.exportImportTitle': 'Multi-Format Export & Import',
    'features.exportImportDesc': 'Download high-resolution PNG renders, scalable SVG vectors, or full lossless JSON board backups.',
    'features.kddEngineeredTitle': 'Rigorous KDD Engineering',
    'features.kddEngineeredDesc': 'Crafted strictly following Knowledge-Driven Development (OKF + CCDD), with deterministic quality gates and zero fragile dependencies.',

    // WebMCP Tools
    'webmcp.badge': 'WebMCP API Explorer',
    'webmcp.title': '10 Registered Tools for AI Agents',
    'webmcp.subtitle': 'Any agent with WebMCP capability (via document.modelContext or the built-in console) can call these tools.',
    'webmcp.toolSticky': 'Create sticky notes in 6 pastel tones with x/y coordinates.',
    'webmcp.toolShape': 'Create rectangles, circles, diamonds, cylinders, and clouds.',
    'webmcp.toolConnector': 'Connect two elements using dynamic smart arrows.',
    'webmcp.toolFrame': 'Create grouping containers that move nested children.',
    'webmcp.toolDiagram': 'Generate complete diagrams (kanban, flowchart, mindmap, architecture).',
    'webmcp.toolState': 'Query element count, board bounding box, and structures.',
    'webmcp.toolUpdate': 'Atomically update text, color, or coordinates of elements.',
    'webmcp.toolDelete': 'Delete elements and cascade cleanup associated connectors.',
    'webmcp.toolClear': 'Completely reset and wipe the whiteboard canvas.',
    'webmcp.toolZoom': 'Center and frame the camera to fit all board items.',

    // Templates Section
    'templates.badge': 'Pre-configured Templates',
    'templates.title': 'Get started in seconds with ready-made diagrams',
    'templates.subtitle': 'Click on any template card to open the workspace directly with the generated layout.',
    'templates.kanbanTitle': 'Agile Kanban Board',
    'templates.kanbanDesc': 'Three columns (To Do, In Progress, Done) with pastel sticky notes for agile sprint planning.',
    'templates.flowchartTitle': 'Flowchart Diagram',
    'templates.flowchartDesc': 'Process pipeline with start node, decision diamond, and connected orthogonal arrows.',
    'templates.mindmapTitle': 'Idea Mind Map',
    'templates.mindmapDesc': 'Radial central concept node with branching sub-topics and curved dynamic connectors for brainstorming.',
    'templates.architectureTitle': 'System Architecture',
    'templates.architectureDesc': 'Full-stack topology with browser client, WebMCP gateway, 2D canvas engine, and storage DB.',
    'templates.launch': 'Launch Template →',

    // KDD Section
    'kdd.badge': 'KDD Methodology',
    'kdd.title': '"If it cannot be verified, it does not work"',
    'kdd.subtitle': 'This project was engineered following Mauricio Perera\'s Knowledge-Driven Development (KDD) standard.',
    'kdd.rule1Title': 'OKF (Open Knowledge Format)',
    'kdd.rule1Desc': 'Structured markdown knowledge graph with YAML frontmatter metadata and verified reachability.',
    'kdd.rule2Title': 'CCDD (Contract-Driven Development)',
    'kdd.rule2Desc': 'Immutable task contracts with sealed test hashes and strict touch_only perimeter governance.',
    'kdd.rule3Title': 'Zero-Assumption Architecture',
    'kdd.rule3Desc': 'Deterministic test battery validating edge cases, memory limits, and hostile XSS injections.',

    // Footer
    'footer.text': 'Miro WebMCP — 100% Client-Side Whiteboard powered by KDD, FastWebMCP, Tailwind CSS, and HTMX.',
    'footer.verified': 'Verified with 23 unit tests and cataloged on webmcp.com.',

    // Whiteboard Canvas Toolbar
    'app.defaultTitle': 'Brainstorm & Architecture Board',
    'app.select': 'Select (V)',
    'app.pan': 'Hand / Pan (H or Space+drag)',
    'app.sticky': 'Sticky Note (S)',
    'app.shape': 'Geometric Shapes (R)',
    'app.text': 'Text (T)',
    'app.connector': 'Arrow / Smart Connector (C)',
    'app.pen': 'Pen (P)',
    'app.highlighter': 'Highlighter',
    'app.eraser': 'Eraser',
    'app.frame': 'Frame Container (F)',
    'app.undo': 'Undo (Ctrl+Z)',
    'app.redo': 'Redo (Ctrl+Y)',
    'app.zoomIn': 'Zoom In',
    'app.zoomOut': 'Zoom Out',
    'app.zoomReset': 'Reset Zoom to 100%',
    'app.zoomFit': 'Zoom to Fit (0)',
    'app.minimap': 'Toggle Minimap',

    // Shapes sub-menu
    'shape.rect': 'Rectangle',
    'shape.circle': 'Circle',
    'shape.diamond': 'Diamond',
    'shape.triangle': 'Triangle',
    'shape.cylinder': 'Database',
    'shape.cloud': 'Cloud',

    // Context Bar
    'ctx.bringFront': 'Bring to Front',
    'ctx.sendBack': 'Send to Back',
    'ctx.duplicate': 'Duplicate (Ctrl+D)',
    'ctx.delete': 'Delete (Del)',

    // WebMCP Drawer
    'drawer.title': 'WebMCP AI Agent Console',
    'drawer.simulateCommands': 'Simulate Agent Commands',
    'drawer.btnKanban': '📋 Generate Kanban Board',
    'drawer.btnArchitecture': '☁️ Cloud Architecture',
    'drawer.btnMindmap': '🧠 Agent Swarm Mindmap',
    'drawer.btnStickies': '💡 3 Strategy Stickies',
    'drawer.directRunner': 'Direct Tool Runner',
    'drawer.selectTool': 'Select Tool:',
    'drawer.inputArgs': 'Input Arguments (JSON):',
    'drawer.executeBtn': 'Execute WebMCP Tool',
    'drawer.outputResponse': 'Output Response:',
    'drawer.awaiting': 'Awaiting invocation...',
    'drawer.catalog': 'Registered Tools Catalog',
    'drawer.badgeNative': 'WebMCP Native Active',
    'drawer.badgeFallback': 'WebMCP Fallback Ready',

    // Modals
    'modal.templatesTitle': 'Choose a Whiteboard Template',
    'modal.exportTitle': 'Export or Import Board',
    'modal.pngTitle': 'Download PNG Image',
    'modal.pngDesc': 'High resolution raster image of all board elements.',
    'modal.svgTitle': 'Download SVG Vector',
    'modal.svgDesc': 'Scalable vector graphic format ideal for web & design.',
    'modal.jsonTitle': 'Export Board JSON',
    'modal.jsonDesc': 'Lossless backup for migration or AI agent restore.',
    'modal.importLabel': 'Import from JSON file:',
    'modal.importBtn': 'Select file',
  },

  pt: {
    // Navigation & Global
    'nav.home': 'Início',
    'nav.features': 'Recursos',
    'nav.demo': 'Demonstração',
    'nav.webmcp': 'Ferramentas WebMCP',
    'nav.templates': 'Modelos',
    'nav.kdd': 'Arquitetura KDD',
    'nav.github': 'GitHub',
    'nav.openApp': 'Abrir Quadro',
    'nav.webmcpAgent': 'Agente WebMCP',
    'nav.export': 'Exportar',

    // Hero Section
    'hero.badge': '🚀 100% Client-Side & GitHub Pages',
    'hero.badgeMcp': 'Padrão WebMCP v1.0',
    'hero.titleLine1': 'Quadro Visual Colaborativo',
    'hero.titleHighlight': 'Nativo para Agentes de IA',
    'hero.titleLine2': 'e Humanos Criativos',
    'hero.subtitle': 'Um clone moderno e ultrarrápido do Miro executável no GitHub Pages com zero servidores backend. Projetado sob Knowledge-Driven Development (KDD) com suporte WebMCP para automação total por IA.',
    'hero.ctaOpen': 'Iniciar Quadro em Branco',
    'hero.ctaGithub': 'Ver Código no GitHub',
    'hero.metric1': '0ms',
    'hero.metric1Label': 'Latência de Backend (Estático)',
    'hero.metric2': '10',
    'hero.metric2Label': 'Ferramentas WebMCP Prontas',
    'hero.metric3': '60 FPS',
    'hero.metric3Label': 'Renderização Vetorial no Canvas',
    'hero.metric4': '100%',
    'hero.metric4Label': 'Privacidade (100% Local)',

    // Hero Playground
    'playground.badge': 'Mini Canvas Interativo',
    'playground.btnSticky': '+ Nota',
    'playground.btnFlowchart': 'Fluxograma',
    'playground.btnMindmap': 'Mapa Mental',
    'playground.btnArchitecture': 'Arquitetura',
    'playground.btnClear': 'Limpar',
    'playground.hint': '💡 Experimente clicar nos botões rápidos ou arrastar itens neste canvas ao vivo.',

    // Features Section
    'features.badge': 'Recursos de Ponta',
    'features.title': 'Tudo o que você precisa em um quadro moderno',
    'features.subtitle': 'Projetado do zero para oferecer uma experiência fluida e intuitiva tanto para usuários humanos quanto para agentes autônomos.',
    'features.infiniteCanvasTitle': 'Canvas Infinito 2D',
    'features.infiniteCanvasDesc': 'Pan fluido com roda ou espaço, zoom ancorado no cursor (15% a 400%), grade de pontos estilo Miro e minimapa interativo.',
    'features.smartConnectorsTitle': 'Conectores Inteligentes',
    'features.smartConnectorsDesc': 'Setas curvas, ortogonais e retas que se conectam magneticamente a formas e as acompanham dinamicamente ao mover.',
    'features.webmcpNativeTitle': 'IA Nativa WebMCP',
    'features.webmcpNativeDesc': 'Integração oficial com o padrão WebMCP (webmcp.com) via FastWebMCP. Permite que modelos de linguagem criem e editem quadros diretamente.',
    'features.templatesTitle': 'Modelos em 1 Clique',
    'features.templatesDesc': 'Comece rápido com quadros Kanban, fluxogramas de decisão, mapas mentais radiais ou diagramas de arquitetura em nuvem.',
    'features.exportImportTitle': 'Exportação e Importação',
    'features.exportImportDesc': 'Baixe imagens PNG de alta resolução, vetores SVG escaláveis ou backups completos em formato JSON sem perda.',
    'features.kddEngineeredTitle': 'Engenharia Rigorosa KDD',
    'features.kddEngineeredDesc': 'Desenvolvido sob Knowledge-Driven Development (OKF + CCDD), com portões de qualidade determinísticos e zero dependências frágeis.',

    // WebMCP Tools
    'webmcp.badge': 'Explorador de API WebMCP',
    'webmcp.title': '10 Ferramentas Registradas para Agentes de IA',
    'webmcp.subtitle': 'Qualquer agente com capacidade WebMCP (via document.modelContext ou console integrado) pode invocar estas funções.',
    'webmcp.toolSticky': 'Cria notas adesivas em 6 tons pastel com coordenadas x/y.',
    'webmcp.toolShape': 'Cria retângulos, círculos, losangos, cilindros e nuvens.',
    'webmcp.toolConnector': 'Conecta dois elementos com setas inteligentes dinâmicas.',
    'webmcp.toolFrame': 'Cria contêineres de agrupamento que movem seus elementos filhos.',
    'webmcp.toolDiagram': 'Gera diagramas completos (kanban, flowchart, mindmap, architecture).',
    'webmcp.toolState': 'Consulta a contagem de elementos e estruturas do quadro.',
    'webmcp.toolUpdate': 'Modifica texto, cor ou posição de um ou múltiplos elementos.',
    'webmcp.toolDelete': 'Remove elementos e limpa automaticamente conectores associados.',
    'webmcp.toolClear': 'Limpa e redefine completamente o canvas do quadro.',
    'webmcp.toolZoom': 'Centraliza e ajusta a câmera para enquadrar todos os elementos.',

    // Templates Section
    'templates.badge': 'Modelos Pré-configurados',
    'templates.title': 'Comece em segundos com diagramas prontos',
    'templates.subtitle': 'Clique em qualquer cartão de modelo para abrir diretamente a área de trabalho com o layout gerado.',
    'templates.kanbanTitle': 'Quadro Kanban Ágil',
    'templates.kanbanDesc': 'Três colunas (A Fazer, Em Andamento, Concluído) com notas adesivas pastel para gestão ágil.',
    'templates.flowchartTitle': 'Diagrama de Fluxo',
    'templates.flowchartDesc': 'Fluxo de processo com nó de início, losango de decisão e setas ortogonais conectadas.',
    'templates.mindmapTitle': 'Mapa Mental de Ideias',
    'templates.mindmapDesc': 'Conceito central radial com ramificações e conectores curvos dinâmicos para sessões de brainstorming.',
    'templates.architectureTitle': 'Arquitetura de Sistemas',
    'templates.architectureDesc': 'Diagrama com cliente web, gateway WebMCP, motor Canvas 2D e banco de dados local.',
    'templates.launch': 'Lançar Modelo →',

    // KDD Section
    'kdd.badge': 'Metodologia KDD',
    'kdd.title': '"Se não pode ser verificado, então não funciona"',
    'kdd.subtitle': 'Este projeto foi construído aplicando rigorosamente o padrão Knowledge-Driven Development (KDD) de Mauricio Perera.',
    'kdd.rule1Title': 'OKF (Open Knowledge Format)',
    'kdd.rule1Desc': 'Grafo de conhecimento em markdown com metadados YAML frontmatter e alcançabilidade verificável.',
    'kdd.rule2Title': 'CCDD (Contract-Driven Development)',
    'kdd.rule2Desc': 'Contratos de tarefas imutáveis com hashes de teste selados e controle estrito touch_only.',
    'kdd.rule3Title': 'Zero-Assumption Architecture',
    'kdd.rule3Desc': 'Bateria de testes automatizada que valida cenários extremos, limites de memória e ataques XSS.',

    // Footer
    'footer.text': 'Miro WebMCP — Quadro 100% Client-Side baseado em KDD, FastWebMCP, Tailwind CSS e HTMX.',
    'footer.verified': 'Verificado com 23 testes unitários e catalogado no webmcp.com.',

    // Whiteboard Canvas Toolbar
    'app.defaultTitle': 'Quadro de Ideias e Arquitetura',
    'app.select': 'Selecionar (V)',
    'app.pan': 'Mão / Pan (H ou Espaço+arrastar)',
    'app.sticky': 'Nota Adesiva (S)',
    'app.shape': 'Formas Geométricas (R)',
    'app.text': 'Texto (T)',
    'app.connector': 'Seta / Conector Inteligente (C)',
    'app.pen': 'Caneta (P)',
    'app.highlighter': 'Marcador de Texto',
    'app.eraser': 'Borracha',
    'app.frame': 'Quadro / Contêiner (F)',
    'app.undo': 'Desfazer (Ctrl+Z)',
    'app.redo': 'Refazer (Ctrl+Y)',
    'app.zoomIn': 'Aproximar Zoom',
    'app.zoomOut': 'Afastar Zoom',
    'app.zoomReset': 'Redefinir Zoom para 100%',
    'app.zoomFit': 'Ajustar à Tela (0)',
    'app.minimap': 'Alternar Minimapa',

    // Shapes sub-menu
    'shape.rect': 'Retângulo',
    'shape.circle': 'Círculo',
    'shape.diamond': 'Losango',
    'shape.triangle': 'Triângulo',
    'shape.cylinder': 'Banco de Dados',
    'shape.cloud': 'Nuvem',

    // Context Bar
    'ctx.bringFront': 'Traer para Frente',
    'ctx.sendBack': 'Enviar para Trás',
    'ctx.duplicate': 'Duplicar (Ctrl+D)',
    'ctx.delete': 'Excluir (Del)',

    // WebMCP Drawer
    'drawer.title': 'Console do Agente IA WebMCP',
    'drawer.simulateCommands': 'Simular Comandos do Agente',
    'drawer.btnKanban': '📋 Gerar Quadro Kanban',
    'drawer.btnArchitecture': '☁️ Arquitetura Cloud',
    'drawer.btnMindmap': '🧠 Mapa Mental de Agentes',
    'drawer.btnStickies': '💡 3 Notas de Estratégia',
    'drawer.directRunner': 'Executor Direto de Ferramentas',
    'drawer.selectTool': 'Selecionar Ferramenta:',
    'drawer.inputArgs': 'Argumentos de Entrada (JSON):',
    'drawer.executeBtn': 'Executar Ferramenta WebMCP',
    'drawer.outputResponse': 'Resposta de Saída:',
    'drawer.awaiting': 'Aguardando invocação...',
    'drawer.catalog': 'Catálogo de Ferramentas Registradas',
    'drawer.badgeNative': 'WebMCP Nativo Ativo',
    'drawer.badgeFallback': 'WebMCP Fallback Pronto',

    // Modals
    'modal.templatesTitle': 'Escolha um Modelo de Quadro',
    'modal.exportTitle': 'Exportar ou Importar Quadro',
    'modal.pngTitle': 'Baixar Imagem PNG',
    'modal.pngDesc': 'Imagem rasterizada em alta resolução dos elementos do quadro.',
    'modal.svgTitle': 'Baixar Vetor SVG',
    'modal.svgDesc': 'Formato vetorial escalável ideal para design e web.',
    'modal.jsonTitle': 'Exportar JSON do Quadro',
    'modal.jsonDesc': 'Backup completo sem perdas para migração ou agentes.',
    'modal.importLabel': 'Importar de arquivo JSON:',
    'modal.importBtn': 'Selecionar arquivo',
  }
};

/**
 * Get active language from localStorage, browser, or default fallback.
 */
export function getLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) {
      return saved;
    }
    const navLang = (navigator.language || '').toLowerCase().split('-')[0];
    if (SUPPORTED_LANGS.includes(navLang)) {
      return navLang;
    }
  } catch (e) {
    // Ignore storage issues in isolated environments
  }
  return DEFAULT_LANG;
}

/**
 * Translate a key into target language with graceful fallback.
 */
export function t(key, lang = null) {
  const activeLang = lang && SUPPORTED_LANGS.includes(lang) ? lang : getLanguage();
  const dict = TRANSLATIONS[activeLang] || TRANSLATIONS[DEFAULT_LANG];
  if (dict && dict[key] !== undefined) {
    return dict[key];
  }
  // Fallback to default language
  if (TRANSLATIONS[DEFAULT_LANG] && TRANSLATIONS[DEFAULT_LANG][key] !== undefined) {
    return TRANSLATIONS[DEFAULT_LANG][key];
  }
  return key;
}

/**
 * Set active language, persist to storage, and notify listeners.
 */
export function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    // Ignore
  }

  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    applyTranslations(document, lang);
    updateLanguageSwitcherUI(lang);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('whiteboard:lang-changed', {
      detail: { lang }
    }));
  }
}

/**
 * Automatically update DOM nodes with data-i18n attributes.
 */
export function applyTranslations(root = document, lang = null) {
  if (!root) return;
  const currentLang = lang || getLanguage();

  // Elements with inner text translation
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key, currentLang);
    if (translation) {
      el.textContent = translation;
    }
  });

  // Elements with title/tooltip translation
  root.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const translation = t(key, currentLang);
    if (translation) {
      el.setAttribute('title', translation);
    }
  });

  // Elements with placeholder translation
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translation = t(key, currentLang);
    if (translation) {
      el.setAttribute('placeholder', translation);
    }
  });
}

/**
 * Renders or synchronizes language selector component state.
 */
export function updateLanguageSwitcherUI(activeLang) {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('.lang-switcher-btn').forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === activeLang) {
      btn.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
      btn.classList.remove('text-slate-600', 'dark:text-slate-400', 'hover:text-slate-900', 'dark:hover:text-white');
    } else {
      btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
      btn.classList.add('text-slate-600', 'dark:text-slate-400', 'hover:text-slate-900', 'dark:hover:text-white');
    }
  });
}

/**
 * Initializes language listeners on page load.
 */
export function initI18n() {
  if (typeof document === 'undefined') return;

  const initialLang = getLanguage();
  document.documentElement.lang = initialLang;

  // Bind click handlers on any language switcher buttons
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const chosenLang = btn.getAttribute('data-lang');
      if (chosenLang && SUPPORTED_LANGS.includes(chosenLang)) {
        setLanguage(chosenLang);
      }
    });
  });

  applyTranslations(document, initialLang);
  updateLanguageSwitcherUI(initialLang);
}

// Auto-run if loaded directly in browser document
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initI18n());
  } else {
    initI18n();
  }
}
