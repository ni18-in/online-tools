// Blog catalog. Posts live at /blogs/<slug>.html (literal .html, per the URL contract).
// 6 are indexed (in sitemap); ai-love-calculator + face-beauty-test are noindex (excluded).
import { SITE_URL, SITE_NAME, abs } from './site';
import type { HreflangLink, Props as SeoProps } from '../components/Seo.astro';
import type { Locale } from './i18n';

export interface BlogPost {
  slug: string; // filename without .html
  title: string;
  description: string;
  keywords: string;
  category: string;
  datePublished: string;
  dateModified: string;
  image: string;
  author: string;
  noindex?: boolean;
  i18n?: {
    es?: {
      slug: string;
      title: string;
      description: string;
      keywords: string;
      category?: string;
    };
    fr?: {
      slug: string;
      title: string;
      description: string;
      keywords: string;
      category?: string;
    };
  };
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'oauth-2-1-jwt-security-privacy-2026',
    title: 'OAuth 2.1 Specs 2026: Debug JWT Tokens Privately',
    description: 'With August 2026 OAuth 2.1 specs enforcing strict token validation and PKCE, debug JWT payloads 100% client-side with zero cloud uploads or leaks.',
    keywords: 'OAuth 2.1 JWT security 2026, jwt debugger pro, client-side jwt decoder, zero trust token inspection, oauth 2.1 compliance 2026, ni18',
    category: 'Privacy & Security',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/oauth-2-1-jwt-security-privacy-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'seguridad-jwt-oauth-2-1-privacidad-2026',
        title: 'Normas OAuth 2.1 2026: Depura Tokens JWT en Privado',
        description: 'Ante las especificaciones OAuth 2.1 de agosto de 2026, depura cargas JWT 100% en local sin subir tokens a servidores externos. Gratis y seguro.',
        keywords: 'seguridad jwt oauth 2 1 2026, depurador jwt pro, decodificador jwt cliente, inspeccion tokens zero trust, cumplimiento oauth 2 1 2026, ni18',
        category: 'Privacidad y Seguridad'
      },
      fr: {
        slug: 'securite-jwt-oauth-2-1-confidentialite-2026',
        title: 'Spécifications OAuth 2.1 2026 : Déboguer vos JWT en Privé',
        description: 'Avec la norme OAuth 2.1 d\'août 2026, décodez et inspectez vos jetons JWT 100% en local sans aucun téléversement. Outil gratuit et sécurisé.',
        keywords: 'securite jwt oauth 2 1 2026, debogueur jwt pro, decodeur jwt cote client, inspection jeton zero trust, conformite oauth 2 1 2026, ni18',
        category: 'Confidentialité & Sécurité'
      }
    }
  },
  {
    slug: 'safari-20-screen-capture-privacy-2026',
    title: 'Safari 20 Screen Capture Rules 2026: Record Privately',
    description: 'With Safari 20\'s August 2026 WebKit MediaCapture updates, record browser tabs 100% client-side with zero server uploads or leaks. Free and instant.',
    keywords: 'Safari 20 WebKit screen capture 2026, screen recorder pro, client-side screen recorder, zero upload screen recorder, browser screen capture privacy, ni18',
    category: 'Privacy & Security',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/safari-20-screen-capture-privacy-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'privacidad-captura-pantalla-safari-20-2026',
        title: 'Privacidad Captura de Pantalla Safari 20: Grabación Privada',
        description: 'Ante las normas MediaCapture de Safari 20 en agosto 2026, graba tu pantalla 100% local sin subir videos a servidores externos. Gratis y privado.',
        keywords: 'privacidad captura pantalla safari 20 2026, grabador de pantalla pro, grabador pantalla cliente, grabador sin descargas, ni18',
        category: 'Privacidad y Seguridad'
      },
      fr: {
        slug: 'confidentialite-capture-ecran-safari-20-2026',
        title: 'Safari 20 WebKit Capture d\'Écran 2026 : Enregistrement Privé',
        description: 'Avec les règles MediaCapture de Safari 20 d\'août 2026, enregistrez votre écran 100% côté client sans aucun téléversement. Gratuit et privé.',
        keywords: 'confidentialite capture ecran safari 20 2026, enregistreur d ecran pro, enregistreur ecran cote client, enregistrement ecran prive, ni18',
        category: 'Confidentialité & Sécurité'
      }
    }
  },
  {
    slug: 'ai-homework-mit-2026-grade-calculator',
    title: 'MIT AI Homework Report 2026: Universal Grade Calculator',
    description: 'With MIT\'s August 2026 report revealing AI completes 90%+ homework, universities are shifting course weighting. Recalculate your grade 100% client-side.',
    keywords: 'MIT AI homework report 2026, universal grade calculator, college grade calculator, weighted grade calculator, syllabus weight calculator, ni18',
    category: 'Calculator',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/ai-homework-mit-2026-grade-calculator-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'ia-tareas-mit-2026-calculadora-calificaciones',
        title: 'Informe IA Tareas MIT 2026: Calculadora Calificaciones',
        description: 'Ante el informe del MIT de agosto 2026 sobre IA en tareas, las universidades cambian la ponderación. Recalcula tus notas 100% local sin subir datos.',
        keywords: 'informe ia tareas mit 2026, calculadora de calificaciones universal, calculadora notas universidad, calculadora promedio ponderado, ni18',
        category: 'Calculadoras'
      },
      fr: {
        slug: 'ia-devoirs-mit-2026-calculateur-notes',
        title: 'Rapport IA Devoirs MIT 2026 : Calculateur de Notes',
        description: 'Face au rapport du MIT d\'août 2026 sur l\'IA et les devoirs, recalculer ses notes pondérées devient crucial. Outil 100% local sans téléversement.',
        keywords: 'rapport ia devoirs mit 2026, calculateur de notes universel, calculateur moyenne ponderee, calculateur note examen, ni18',
        category: 'Calculateurs'
      }
    }
  },
  {
    slug: 'css-container-queries-rem-to-px-2026',
    title: 'CSS Container Queries 2026: Convert REM to PX Online',
    description: 'With August 2026 CSS container queries & fluid typography, converting REM to PX is crucial for Figma design systems. Try our free 100% client-side tool.',
    keywords: 'css container queries 2026, rem to px converter, convert rem to px, fluid typography rem to px, design system rem converter, ni18',
    category: 'Developer',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/css-container-queries-rem-to-px-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'consultas-contenedor-css-rem-a-px-2026',
        title: 'Consultas Contenedor CSS 2026: Convierte REM a PX Gratis',
        description: 'Ante las consultas de contenedor CSS de agosto 2026, convierte REM a PX para sistemas Figma. Prueba nuestra herramienta 100% local y sin subir datos.',
        keywords: 'consultas de contenedor css 2026, convertir rem a px, convertidor rem a px, tipografia fluida rem px, sistema de diseno rem, ni18',
        category: 'Programación'
      },
      fr: {
        slug: 'conteneurs-css-conversion-rem-en-px-2026',
        title: 'Conteneurs CSS 2026 : Convertir REM en PX Gratuitement',
        description: 'Avec les conteneurs CSS d\'août 2026, convertissez REM en PX pour vos design systems. Essayez notre outil 100% en local, sans aucun téléversement.',
        keywords: 'conteneurs css 2026, convertir rem en px, convertisseur rem en px, typographie fluide rem px, design system rem, ni18',
        category: 'Développement'
      }
    }
  },
  {
    slug: 'ai-subtitle-drift-august-2026-resync-tool',
    title: 'Fix AI Subtitle Timestamp Drift Free (August 2026 Guide)',
    description: 'With August 2026 AI speech models causing SRT/VTT timecode drift, resync subtitles 100% client-side with zero data uploads.',
    keywords: 'ai subtitle drift 2026, subtitle resync tool, fix srt timing online, client-side srt sync, vtt timecode repair, ni18',
    category: 'Media',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/ai-subtitle-drift-august-2026-resync-tool-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'desfase-subtitulos-ia-agosto-2026-resincronizador',
        title: 'Corregir Desfase Subtítulos IA (Guía Agosto 2026)',
        description: 'Ante los desajustes de tiempo de los modelos de IA en agosto 2026, resincroniza archivos SRT/VTT 100% local sin subir archivos.',
        keywords: 'desfase subtitulos ia 2026, herramienta resincronizar subtitulos, reparar tiempo srt online, srt cliente local, corregir vtt, ni18',
        category: 'Media'
      },
      fr: {
        slug: 'decalage-sous-titres-ia-aout-2026-resynchronisation',
        title: 'Corriger Décalage Sous-Titres IA (Guide Août 2026)',
        description: 'Mises à jour IA d\'août 2026 : resynchronisez vos fichiers SRT et VTT 100% en local dans votre navigateur, sans téléversement.',
        keywords: 'decalage sous titres ia 2026, outil resynchroniser sous titres, corriger temps srt en ligne, srt cote client, reparation vtt, ni18',
        category: 'Média'
      }
    }
  },
  {
    slug: 'heic-vtf-game-asset-pipeline-2026',
    title: 'Convert HEIC to VTF Online: Game Asset Pipeline Guide (2026)',
    description: 'Convert iPhone HEIC textures to Valve VTF for Source engine mods 100% client-side with zero uploads in August 2026.',
    keywords: 'heic to vtf, convert heic to vtf, valve texture format 2026, source engine modding, client-side vtf converter, ni18',
    category: 'Media',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/heic-vtf-game-asset-pipeline-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'heic-vtf-pipeline-texturas-juegos-2026',
        title: 'Convertir HEIC a VTF Online: Texturas para Juegos 2026',
        description: 'Convierte texturas HEIC de iPhone a VTF de Valve para mods de Source 100% en local sin subir archivos en agosto 2026.',
        keywords: 'heic a vtf, convertir heic a vtf, valve texture format 2026, modding source engine, convertidor vtf cliente, ni18',
        category: 'Media'
      },
      fr: {
        slug: 'heic-vtf-pipeline-textures-jeux-2026',
        title: 'Convertir HEIC en VTF en Ligne : Guide Textures (2026)',
        description: 'Convertissez des textures HEIC iPhone en VTF Valve pour mods Source 100% en local sans téléversement en août 2026.',
        keywords: 'heic en vtf, convertir heic en vtf, valve texture format 2026, modding source engine, convertisseur vtf prive, ni18',
        category: 'Média'
      }
    }
  },
  {
    slug: 'chrome-privacy-sandbox-screen-recorder-2026',
    title: 'Chrome 2026 Privacy Sandbox Rules: Record Screen Privately',
    description: 'With Chrome\'s August 2026 Privacy Sandbox and storage partitioning updates, record browser tabs 100% client-side with zero data uploads.',
    keywords: 'Chrome Privacy Sandbox 2026, screen recorder pro, client-side screen recorder, zero upload screen recorder, privacy screen capture, ni18',
    category: 'Privacy & Security',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/chrome-privacy-sandbox-screen-recorder-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'privacidad-sandbox-chrome-grabador-pantalla-2026',
        title: 'Privacy Sandbox Chrome 2026: Graba Pantalla Privado',
        description: 'Ante las normas Privacy Sandbox de Chrome en agosto 2026, graba tu pantalla 100% local sin subir videos a servidores externos.',
        keywords: 'privacy sandbox chrome 2026, grabador de pantalla pro, grabador pantalla cliente, grabador sin descargas, privacidad captura, ni18',
        category: 'Privacidad y Seguridad'
      },
      fr: {
        slug: 'confidentialite-sandbox-chrome-enregistreur-ecran-2026',
        title: 'Privacy Sandbox Chrome 2026 : Enregistrement Privé',
        description: 'Avec les règles Privacy Sandbox d\'août 2026 sur Chrome, enregistrez votre écran 100% côté client sans aucun téléversement.',
        keywords: 'privacy sandbox chrome 2026, enregistreur d ecran pro, enregistreur ecran cote client, enregistrement ecran prive, ni18',
        category: 'Confidentialité & Sécurité'
      }
    }
  },
  {
    slug: 'w3c-responsive-design-px-to-rem-2026',
    title: 'W3C Responsive Design 2026: Convert PX to REM Online',
    description: 'With W3C\'s August 2026 accessibility guidelines penalizing fixed pixels, convert PX to REM 100% client-side with zero data uploads.',
    keywords: 'W3C responsive design 2026, convert px to rem, px to rem converter, css typography accessibility, fluid layout rem, ni18',
    category: 'Developer',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/w3c-responsive-design-px-to-rem-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'normas-diseno-responsivo-px-a-rem-2026',
        title: 'Diseño Responsivo W3C 2026: Convierte PX a REM Gratis',
        description: 'Ante las normas W3C de agosto 2026 sobre accesibilidad, convierte PX a REM 100% en local sin enviar datos a servidores externos.',
        keywords: 'diseno responsivo W3C 2026, convertir px a rem, convertidor px a rem, accesibilidad tipografia css, unidades rem, ni18',
        category: 'Programación'
      },
      fr: {
        slug: 'normes-design-responsif-px-en-rem-2026',
        title: 'Design Responsif W3C 2026 : Convertir PX en REM Privé',
        description: 'Avec les normes W3C d\'août 2026 sur l\'accessibilité, convertissez PX en REM 100% en local sans aucun téléversement de données.',
        keywords: 'design responsif W3C 2026, convertir px en rem, convertisseur px en rem, accessibilite typographie css, unites rem, ni18',
        category: 'Développement'
      }
    }
  },
  {
    slug: 'openapi-4-json-schema-2026-visualizer',
    title: 'OpenAPI 4.0 JSON Schema Release 2026: Visualizer Guide',
    description: 'With OpenAPI 4.0 and JSON Schema 2026 released in August 2026, inspect, format, and validate modern JSON payloads 100% client-side with zero data leaks.',
    keywords: 'OpenAPI 4.0 JSON schema 2026, json visualizer pro, client-side json validator, JSON schema 2026 guide, format json online, ni18',
    category: 'Developer',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/openapi-4-json-schema-2026-visualizer-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'openapi-4-esquema-json-2026-visualizador',
        title: 'Lanzamiento OpenAPI 4.0 Esquema JSON 2026: Guía Visualizador',
        description: 'Con OpenAPI 4.0 y Esquema JSON 2026 lanzados en agosto de 2026, inspecciona y valida payloads JSON 100% local sin subida de datos.',
        keywords: 'OpenAPI 4.0 esquema JSON 2026, visualizador json pro, validador json cliente, guia esquema JSON 2026, formatear json online, ni18',
        category: 'Programación'
      },
      fr: {
        slug: 'openapi-4-schema-json-2026-visualiseur',
        title: 'Lancement OpenAPI 4.0 Schema JSON 2026 : Guide Visualiseur',
        description: 'Avec OpenAPI 4.0 et Schema JSON 2026 publiés en août 2026, inspectez et validez vos payloads JSON 100% en local sans fuite de données.',
        keywords: 'OpenAPI 4.0 schema JSON 2026, visualiseur json pro, validateur json cote client, guide schema JSON 2026, formater json en ligne, ni18',
        category: 'Développement'
      }
    }
  },
  {
    slug: 'microsoft-edge-screen-capture-privacy-2026',
    title: 'Microsoft Edge Screen Capture Rules 2026: Record Screen Privately',
    description: 'With Microsoft Edge August 2026 screen capture policies, record browser tabs 100% client-side with zero cloud uploads or data leaks.',
    keywords: 'Microsoft Edge screen capture privacy 2026, screen recorder pro, client-side screen recorder, zero upload screen recorder, browser screen capture security, ni18',
    category: 'Privacy & Security',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/microsoft-edge-screen-capture-privacy-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'privacidad-captura-pantalla-microsoft-edge-2026',
        title: 'Captura de Pantalla Microsoft Edge 2026: Grabación Privada',
        description: 'Ante las normas de captura de Microsoft Edge en agosto de 2026, graba tu pantalla 100% local sin subir videos a servidores externos.',
        keywords: 'privacidad captura pantalla microsoft edge 2026, grabador de pantalla pro, grabador pantalla cliente, grabador sin descargas, ni18',
        category: 'Privacidad y Seguridad'
      },
      fr: {
        slug: 'confidentialite-capture-ecran-microsoft-edge-2026',
        title: 'Capture d\'Écran Microsoft Edge 2026 : Enregistrement Privé',
        description: 'Avec les règles Edge d\'août 2026, enregistrez votre écran 100% côté client sans aucun téléversement de données.',
        keywords: 'confidentialite capture ecran microsoft edge 2026, enregistreur d ecran pro, enregistreur ecran cote client, enregistrement ecran prive, ni18',
        category: 'Confidentialité & Sécurité'
      }
    }
  },
  {
    slug: 'eu-ai-act-august-2026-json-diff',
    title: 'EU AI Act August 2026: Compare AI JSON Payloads Private',
    description: 'With EU AI Act Article 50 transparency active in August 2026, compare and audit AI JSON payloads 100% client-side with zero data uploads.',
    keywords: 'EU AI Act August 2026 JSON compliance, json comparison tool, client-side json diff, ai transparency article 50, private json diff, ni18',
    category: 'Developer',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/eu-ai-act-august-2026-json-diff-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'eu-ai-act-agosto-2026-diferencia-json',
        title: 'EU AI Act Agosto 2026: Compara JSON de IA en Privado',
        description: 'Ante el Artículo 50 de la Ley de IA de la UE en agosto de 2026, compara y audita JSON de IA 100% local sin subir datos al servidor.',
        keywords: 'EU AI Act agosto 2026 cumplimiento json, comparador de json online, diferencia json cliente, transparencia ia articulo 50, diff json privado, ni18',
        category: 'Programación'
      },
      fr: {
        slug: 'loi-ia-ue-aout-2026-comparateur-json',
        title: 'Loi IA UE Août 2026 : Comparez vos JSON d\'IA en Privé',
        description: 'En raison de l\'article 50 de la loi sur l\'IA de l\'UE en août 2026, comparez vos structures JSON 100% en local sans téléversement.',
        keywords: 'loi ia ue aout 2026 conformite json, comparateur json en ligne, diff json cote client, transparence ia article 50, comparateur json prive, ni18',
        category: 'Développement'
      }
    }
  },
  {
    slug: 'ai-agent-markdown-to-word-august-2026',
    title: 'AI Agent Markdown to Word: Convert AI Reports Private (2026)',
    description: 'In August 2026, autonomous AI agents produce massive Markdown reports. Convert AI Markdown to Microsoft Word .docx 100% client-side with zero data uploads.',
    keywords: 'ai agent markdown to word, convert ai report to docx, chatgpt markdown converter 2026, client-side markdown to word, private markdown converter, ni18',
    category: 'Productivity',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/ai-agent-markdown-to-word-august-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'flujos-agentes-ia-markdown-a-word-local-agosto-2026',
        title: 'Convertir Markdown de Agentes IA a Word Local (Agosto 2026)',
        description: 'En agosto 2026, los agentes IA generan extensos informes Markdown. Convierte Markdown a Word (.docx) 100% en local y sin subir datos confidenciales.',
        keywords: 'agentes ia markdown a word, convertir informe ia a docx, convertidor markdown cliente 2026, convertir markdown a word privado, ni18',
        category: 'Productividad'
      },
      fr: {
        slug: 'flux-agents-ia-conversion-markdown-word-local-aout-2026',
        title: 'Convertir le Markdown des Agents IA en Word (Août 2026)',
        description: 'En août 2026, les agents IA produisent des rapports Markdown complexes. Convertissez le Markdown en Word (.docx) 100% en local sans aucun transfert.',
        keywords: 'agents ia markdown en word, convertir rapport ia en docx, convertisseur markdown prive 2026, conversion markdown word locale, ni18',
        category: 'Productivité'
      }
    }
  },
  {
    slug: 'cloudflare-kitesurf-ai-agent-browser-2026',
    title: 'Cloudflare Unveils Kitesurf: Audit AI Agent Code Diff Private',
    description: 'Cloudflare unveiled Kitesurf on August 9, 2026 for AI agents. Compare and audit AI generated code and text diffs 100% client-side with zero data uploads.',
    keywords: 'cloudflare kitesurf 2026, ai agent browser, online text compare, client-side diff tool, ai agent security, ni18',
    category: 'Productivity',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/cloudflare-kitesurf-ai-agent-browser-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'cloudflare-kitesurf-navegador-agentes-ia-2026',
        title: 'Cloudflare Kitesurf: Audita Cambios de Texto IA en Privado',
        description: 'Cloudflare presenta Kitesurf en agosto 2026. Compara y audita diferencias de código y texto generados por agentes IA 100% local sin subir datos.',
        keywords: 'cloudflare kitesurf 2026, navegador agentes ia, comparador de texto online, herramienta diff local, seguridad ia, ni18',
        category: 'Productividad'
      },
      fr: {
        slug: 'cloudflare-kitesurf-navigateur-agents-ia-2026',
        title: 'Cloudflare Kitesurf : Comparez le Code des Agents IA Privé',
        description: 'Cloudflare dévoile Kitesurf en août 2026. Comparez et vérifiez les différences de texte et de code des agents IA 100% en local sans aucun envoi.',
        keywords: 'cloudflare kitesurf 2026, navigateur agents ia, comparateur de texte en ligne, outil diff prive, securite agent ia, ni18',
        category: 'Productivité'
      }
    }
  },
  {
    slug: 'openai-agentic-ai-cyber-security-jwt-2026',
    title: 'OpenAI Model Pause: Client-Side JWT Security in August 2026',
    description: 'With OpenAI pausing frontier models over agentic cybersecurity threats, client-side JWT debugging keeps your auth tokens zero-risk and off distant servers.',
    keywords: 'openai model pause 2026, agentic ai cyber security, jwt debugger pro, client-side jwt decoder, token security 2026, ni18',
    category: 'Privacy & Security',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/openai-agentic-ai-cyber-security-jwt-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'seguridad-jwt-ia-agentica-openai-2026',
        title: 'Pausa de Modelos OpenAI: Seguridad JWT Cliente en Agosto 2026',
        description: 'Ante la pausa de modelos por amenazas cibernéticas de IA en agosto de 2026, depurar JWT de forma local protege tokens sin enviarlos a servidores.',
        keywords: 'pausa modelos openai 2026, ciberseguridad ia agentica, depurador jwt cliente, decodificar jwt seguro, seguridad tokens 2026, ni18',
        category: 'Privacidad y Seguridad'
      },
      fr: {
        slug: 'securite-jwt-ia-agentique-openai-2026',
        title: 'Pause Modèles OpenAI : Sécurité JWT Côté Client Août 2026',
        description: 'Suite à la pause des modèles OpenAI face aux risques cyber des agents IA en août 2026, débugger vos JWT en local protège vos jetons d\'accès.',
        keywords: 'pause meodeles openai 2026, cybersecurite ia agentique, debogueur jwt cote client, decodage jeton securise, securite token 2026, ni18',
        category: 'Confidentialité & Sécurité'
      }
    }
  },
  {
    slug: 'browser-privacy-api-basic-auth-2026',
    title: 'Browser Privacy API Changes 2026: Basic Auth Header Guide',
    description: 'Modern browser privacy updates in August 2026 affect HTTP Basic Auth. Learn how to generate secure headers 100% client-side with zero data uploads.',
    keywords: 'browser privacy api 2026, basic authentication header generator, HTTP basic auth security, client-side header generator, privacy sandbox 2026, ni18',
    category: 'Privacy & Security',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/browser-privacy-api-basic-auth-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'api-privacidad-navegador-autenticacion-basica-2026',
        title: 'Privacidad Navegadores 2026: Guía Encabezado Basic Auth',
        description: 'Las reglas de privacidad de los navegadores en agosto 2026 cambian la autenticación. Genera encabezados Basic Auth 100% local sin subir datos.',
        keywords: 'api privacidad navegador 2026, generador encabezado autenticacion basica, seguridad HTTP basic auth, encabezado cliente local, ni18',
        category: 'Privacidad y Seguridad'
      },
      fr: {
        slug: 'api-confidentialite-navigateur-authentification-base-2026',
        title: 'Confidentialité Navigateurs 2026 : Guide Auth de Base',
        description: 'Les mises à jour de confidentialité d\'août 2026 impactent l\'authentification. Générez vos en-têtes Basic Auth 100% en local sans téléversement.',
        keywords: 'api confidentialite navigateur 2026, generateur entete authentification basique, securite HTTP basic auth, entete cote client, ni18',
        category: 'Confidentialité & Sécurité'
      }
    }
  },
  {
    slug: 'agentic-ai-code-analysis-privacy-2026',
    title: 'Agentic AI Code Analysis Privacy 2026: Secure Text Analyzer',
    description: 'With August 2026 agentic AI coding updates, analyzing generated code and output payloads client-side prevents data leaks. Try our free text analyzer.',
    keywords: 'agentic ai code analysis 2026, text analyzer pro, client-side code analysis, ai agent security, secure text analyzer, ni18',
    category: 'Productivity',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/agentic-ai-code-analysis-privacy-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'analisis-codigo-ia-agente-privacidad-2026',
        title: 'Análisis Código IA Agente Privacidad 2026: Analizador Seguro',
        description: 'Con los agentes de IA de agosto 2026, analiza fragmentos de código y texto 100% en local sin subir datos confidenciales a la nube.',
        keywords: 'analisis codigo ia agente 2026, analizador de texto online, analisis de texto privado, seguridad ia agente, analizador cliente, ni18',
        category: 'Productividad'
      },
      fr: {
        slug: 'analyse-code-ia-agentique-confidentialite-2026',
        title: 'Analyse Code IA Agentique Confidentialité 2026 : Outil Sécurisé',
        description: 'Avec les agents IA d\'août 2026, analysez votre code et vos données 100% en local sans risquer de fuite sur un serveur distant.',
        keywords: 'analyse code ia agentique 2026, analyseur de texte en ligne, analyse texte prive, securite agent ia, analyseur cote client, ni18',
        category: 'Productivité'
      }
    }
  },
  {
    slug: 'next-gen-gst-reforms-august-2026',
    title: 'GST 2.0 Reforms August 2026: Tax Slab Changes & Calculator',
    description: 'India\'s GST 2.0 August 2026 reforms rationalized tax slabs to 5%, 18%, and 40%. Calculate updated GST rates instantly 100% client-side with zero data uploads.',
    keywords: 'GST 2.0 reforms August 2026, next gen gst calculator, GST rate rationalization, GST tax slabs 2026, client side tax calculator, ni18',
    category: 'Calculator',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/next-gen-gst-reforms-august-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'reformas-gst-2-0-guia-agosto-2026',
        title: 'Reformas GST 2.0 Agosto 2026: Nuevos Tramos y Calculadora',
        description: 'Las reformas GST 2.0 de agosto 2026 simplificaron los tramos al 5%, 18% y 40%. Calcula las nuevas tasas de forma 100% local y privada sin subir datos.',
        keywords: 'reformas GST 2.0 agosto 2026, calculadora GST proxima generacion, tramos impuestos GST 2026, calculadora fiscal cliente, ni18',
        category: 'Calculadoras'
      },
      fr: {
        slug: 'reformes-tps-gst-2-0-guide-aout-2026',
        title: 'Réformes TPS/GST 2.0 Août 2026 : Barèmes et Calculateur',
        description: 'Les réformes GST 2.0 d\'août 2026 simplifient les tranches à 5%, 18% et 40%. Calculez vos taxes 100% en local et en toute confidentialité sans envoi.',
        keywords: 'reformes GST 2.0 aout 2026, calculateur TPS nouvelle generation, baremes taxe GST 2026, calculateur fiscal prive, ni18',
        category: 'Calculateurs'
      }
    }
  },
  {
    slug: 'chatgpt-markdown-to-word-august-2026',
    title: 'Convert ChatGPT Markdown to Word Free (August 2026 Guide)',
    description: 'With August 2026 LLM and AI agent updates, converting ChatGPT Markdown to Microsoft Word .docx client-side protects data and saves time.',
    keywords: 'chatgpt markdown to word, convert markdown to docx, ai markdown converter, client-side markdown to word, markdown converter online, ni18',
    category: 'Productivity',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/chatgpt-markdown-to-word-august-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'convertir-markdown-chatgpt-a-word-agosto-2026',
        title: 'Convertir Markdown de ChatGPT a Word Gratis (Agosto 2026)',
        description: 'Con las mejoras de IA de agosto 2026, convierte Markdown de ChatGPT a Word (.docx) 100% en local sin subir datos a la nube.',
        keywords: 'convertir markdown a word, chatgpt a word, convertidor markdown docx, convertidor markdown cliente, herramientas ia, ni18',
        category: 'Productividad'
      },
      fr: {
        slug: 'convertir-markdown-chatgpt-en-word-aout-2026',
        title: 'Convertir Markdown ChatGPT en Word Gratuitement (Août 2026)',
        description: 'Mises à jour IA d\'août 2026 : convertissez le Markdown ChatGPT en Word .docx 100% en local, sans envoi de données.',
        keywords: 'convertir markdown en word, chatgpt en docx, convertisseur markdown gratuit, conversion markdown prive, outils ia, ni18',
        category: 'Productivité'
      }
    }
  },
  {
    slug: 'vtf-converter-webgl-august-2026',
    title: 'Convert VTF Online Free: WebGL & CS2 Texture Guide (2026)',
    description: 'Chrome August 2026 WebGL fixes demand secure gaming tools. Convert PNG/JPG to Valve VTF textures 100% client-side in your browser with zero uploads.',
    keywords: 'vtf converter online, convert png to vtf, valve texture format, webgl security 2026, source engine modding, client-side vtf converter, ni18',
    category: 'Media',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/vtf-converter-webgl-august-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'convertidor-vtf-webgl-agosto-2026',
        title: 'Convertidor VTF Online Gratis: Texturas WebGL y CS2',
        description: 'Las parches WebGL de agosto 2026 exigen seguridad. Convierte PNG/JPG a texturas VTF de Valve 100% localmente en tu navegador sin subir archivos.',
        keywords: 'convertidor vtf online, convertir png a vtf, valve texture format, seguridad webgl 2026, modding source engine, convertidor vtf cliente, ni18',
        category: 'Media'
      },
      fr: {
        slug: 'convertisseur-vtf-webgl-aout-2026',
        title: 'Convertisseur VTF en Ligne Gratuit : Guide WebGL (2026)',
        description: 'Mises à jour WebGL d\'août 2026 : convertissez vos PNG/JPG en textures VTF Valve 100% en local dans votre navigateur sans aucun téléversement.',
        keywords: 'convertisseur vtf en ligne, convertir png en vtf, valve texture format, securite webgl 2026, modding source engine, convertisseur vtf prive, ni18',
        category: 'Média'
      }
    }
  },
  {
    slug: 'chrome-web-store-privacy-policy-basic-auth',
    title: 'Chrome Web Store Privacy Policy 2026: Basic Auth Guide',
    description: 'Chrome Web Store August 2026 privacy policy mandates strict data collection rules. Generate HTTP Basic Auth headers 100% client-side with zero uploads.',
    keywords: 'chrome web store privacy policy 2026, basic authentication header generator, client-side basic auth, browser data privacy, API authentication, ni18',
    category: 'Developer',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/chrome-web-store-privacy-policy-basic-auth-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'politica-privacidad-chrome-web-store-autenticacion-basica',
        title: 'Privacidad Chrome Web Store 2026: Guía Autenticación Básica',
        description: 'La política de privacidad de agosto 2026 de Chrome Web Store exige rigor de datos. Genera encabezados Basic Auth 100% local sin subir credenciales.',
        keywords: 'politica privacidad chrome web store 2026, generador encabezado autenticacion basica, basic auth cliente, privacidad navegador, autenticacion api, ni18',
        category: 'Programación'
      },
      fr: {
        slug: 'politique-confidentialite-chrome-web-store-authentification-base',
        title: 'Confidentialité Chrome Web Store 2026 : Auth de Base',
        description: 'La politique d\'août 2026 de Chrome Web Store exige la transparence des données. Générez vos en-têtes Basic Auth 100% en local sans téléversement.',
        keywords: 'politique confidentialite chrome web store 2026, generateur entete authentification basique, basic auth cote client, confidentialite navigateur, authentification api, ni18',
        category: 'Développement'
      }
    }
  },
  {
    slug: 'web-performance-core-web-vitals-image-optimization-2026',
    title: 'Core Web Vitals 2026 Update: Compress & Convert Images Free',
    description: 'Chrome August 2026 Core Web Vitals updates demand faster LCP image loading. Compress and convert images 100% client-side with zero data uploads.',
    keywords: 'core web vitals 2026, image optimization, LCP optimization, free online image utility tool, convert images browser, web performance, ni18',
    category: 'Web Performance',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/web-performance-core-web-vitals-image-optimization-2026-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'optimizacion-imagenes-core-web-vitals-rendimiento-web-2026',
        title: 'Core Web Vitals 2026: Optimiza Imágenes Gratis en el Navegador',
        description: 'La actualización de Core Web Vitals de agosto 2026 exige mayor velocidad LCP. Comprime y convierte imágenes 100% localmente sin subir archivos.',
        keywords: 'core web vitals 2026, optimizacion de imagenes, optimizar LCP, herramienta de imagenes online, convertir imagenes navegador, rendimiento web, ni18',
        category: 'Rendimiento Web'
      },
      fr: {
        slug: 'optimisation-images-core-web-vitals-performance-web-2026',
        title: 'Core Web Vitals 2026 : Optimiser vos Images Gratuitement',
        description: 'La mise à jour Core Web Vitals d\'août 2026 exige un LCP ultrarapide. Compressez et convertissez vos images 100% en local dans votre navigateur.',
        keywords: 'core web vitals 2026, optimisation images, optimiser LCP, outil image en ligne gratuit, convertir images navigateur, performance web, ni18',
        category: 'Performance Web'
      }
    }
  },
  {
    slug: 'fastjson-vulnerability-json-security-guide',
    title: 'Fastjson RCE Bug CVE-2026-16723: Secure Your JSON Workflows Now',
    description: 'Learn about the critical Fastjson RCE vulnerability (CVE-2026-16723) in August 2026 and how to securely validate and diff JSON entirely client-side.',
    keywords: 'fastjson vulnerability, CVE-2026-16723, fastjson rce, secure json validator, json comparison tool, ni18',
    category: 'Developer',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    // No bespoke banner for this post; reuse the on-topic JSON tooling banner.
    image: `${SITE_URL}/assets/blog/json-visualizer-pro-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'guia-seguridad-json-vulnerabilidad-fastjson',
        title: 'Vulnerabilidad Fastjson CVE-2026-16723: Protege tus Flujos JSON',
        description: 'Descubre la vulnerabilidad crítica de Fastjson RCE (CVE-2026-16723) de agosto de 2026 y cómo validar y comparar JSON de forma segura 100% local.',
        keywords: 'vulnerabilidad fastjson, CVE-2026-16723, rce fastjson, validador json seguro, herramienta comparacion json, ni18',
        category: 'Programación'
      },
      fr: {
        slug: 'guide-securite-json-vulnerabilite-fastjson',
        title: 'Failles Fastjson RCE CVE-2026-16723 : Sécurisez vos Flux JSON',
        description: 'En savoir plus sur la faille critique Fastjson RCE (CVE-2026-16723) d\'août 2026 et comment valider et comparer des JSON 100% côté client de manière sécurisée.',
        keywords: 'faille fastjson, CVE-2026-16723, rce fastjson, validateur json securise, comparateur json en ligne, ni18',
        category: 'Développement'
      }
    }
  },
  {
    slug: 'screen-recorder-pro-guide',
    title: 'Record Screen with Audio Online Free — No Watermark',
    description: 'Record your screen, a browser window, or your webcam with audio directly in your browser. Free, client-side, no watermark, and zero uploads.',
    keywords: 'screen recorder online, free screen recorder no watermark, record screen with audio, browser screen recorder, private screen recorder',
    category: 'Productivity',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: '/assets/blog/screen-recorder-pro-guide-banner.jpg',
    author: 'ni18',
    i18n: {
      es: {
        slug: 'guia-screen-recorder-pro',
        title: 'Grabar Pantalla con Audio Gratis (Sin Marca de Agua)',
        description: 'Aprende a grabar tu pantalla, ventana o cámara web con audio directamente en tu navegador usando Screen Recorder Pro. Gratis, privado y sin marcas de agua.',
        keywords: 'grabar pantalla gratis, grabador de pantalla online, grabar pantalla con audio, grabador sin marca de agua, grabador de pantalla privado',
        category: 'Productividad'
      },
      fr: {
        slug: 'guide-screen-recorder-pro',
        title: 'Enregistrer son Écran avec le Son Gratuitement',
        description: 'Enregistrez votre écran, une fenêtre ou votre webcam avec le son directement dans votre navigateur. Gratuit, côté client et sans filigrane.',
        keywords: 'enregistrer son ecran gratuit, enregistreur d ecran en ligne, enregistrer ecran avec audio, enregistreur sans filigrane, enregistreur ecran prive',
        category: 'Productivité'
      }
    }
  },
  {
    slug: 'iphone-photo-fixer-guide',
    title: 'Convert HEIC to JPG on PC Free (Offline & Private)',
    description: 'Learn how to convert HEIC photos to JPG or PNG instantly on Windows PC using our free, offline, and private iPhone Photo Fixer tool.',
    keywords: 'heic to jpg, iphone photo fixer, convert heic, offline converter',
    category: 'Utility',
    datePublished: '2026-01-16T12:00:00+05:30',
    dateModified: '2026-01-16T12:00:00+05:30',
    image: '/assets/blog/iphone-photo-fixer-guide-banner.webp',
    author: 'ni18',
    i18n: {
      es: {
        slug: 'guia-iphone-photo-fixer',
        title: 'Cómo Convertir HEIC a JPG en PC Gratis (Local y Privado) - Guía',
        description: 'Aprende a convertir fotos HEIC a JPG o PNG al instante en Windows usando nuestra herramienta gratuita y local iPhone Photo Fixer.',
        keywords: 'heic a jpg, iphone photo fixer, convertir heic, convertidor offline',
        category: 'Utilidades'
      },
      fr: {
        slug: 'guide-iphone-photo-fixer',
        title: 'Convertir HEIC en JPG sur PC Gratuitement (Hors Ligne)',
        description: 'Découvrez comment convertir vos photos HEIC en JPG ou PNG instantanément sur Windows avec notre outil gratuit et local iPhone Photo Fixer.',
        keywords: 'heic en jpg, iphone photo fixer, convertir heic, convertisseur hors ligne',
        category: 'Utilitaire'
      }
    }
  },
  {
    slug: 'markdown-to-word-guide',
    title: 'How to Convert Markdown & ChatGPT to Word for Free (2026 Guide)',
    description: 'Learn how to convert Markdown files and ChatGPT responses to formatted Microsoft Word (.docx) documents instantly using our free online tool.',
    keywords: 'markdown to word, chatgpt to word, docx converter, markdown guide',
    category: 'Productivity',
    datePublished: '2026-01-11T12:00:00+05:30',
    dateModified: '2026-01-11T12:00:00+05:30',
    image: '/assets/blog/markdown-to-word-guide-banner.webp',
    author: 'ni18',
    i18n: {
      es: {
        slug: 'guia-convertir-markdown-a-word',
        title: 'Cómo Convertir Markdown y ChatGPT a Word Gratis (Guía 2026)',
        description: 'Aprende a convertir archivos Markdown y respuestas de ChatGPT en documentos Word (.docx) formateados con nuestra herramienta gratuita.',
        keywords: 'markdown a word, chatgpt a word, convertidor docx, guia markdown',
        category: 'Productividad'
      },
      fr: {
        slug: 'guide-convertir-markdown-en-word',
        title: 'Convertir Markdown et ChatGPT en Word Gratuitement',
        description: 'Apprenez à convertir des fichiers Markdown et des réponses ChatGPT en documents Microsoft Word (.docx) avec notre outil en ligne gratuit.',
        keywords: 'markdown en word, chatgpt en word, convertisseur docx, guide markdown',
        category: 'Productivité'
      }
    }
  },
  {
    slug: 'vtf-converter-guide',
    title: 'VTF Converter — Free Online Tool for Source Engine Mods',
    description: 'Convert images to Valve Texture Format (VTF) instantly with this free online tool. Perfect for CS:GO, TF2, and L4D2 modders.',
    keywords: 'vtf converter, valve texture format, source engine modding, texture tool',
    category: 'Development',
    datePublished: '2025-12-31T12:00:00+05:30',
    dateModified: '2025-12-31T12:00:00+05:30',
    image: '/assets/blog/vtf-converter-guide-banner.webp',
    author: 'ni18',
    i18n: {
      es: {
        slug: 'guia-convertidor-vtf',
        title: 'Conversión VTF: Herramienta Online para Modders',
        description: 'Convierte imágenes a Valve Texture Format (VTF) al instante de forma gratuita. Ideal para modders de CS:GO, TF2 y L4D2.',
        keywords: 'convertidor vtf, valve texture format, modding source engine, texturas vtf',
        category: 'Desarrollo'
      },
      fr: {
        slug: 'guide-convertisseur-vtf',
        title: 'Conversion VTF : Outil en Ligne pour Moddeurs Source',
        description: 'Convertissez des images en Valve Texture Format (VTF) instantanément avec cet outil gratuit. Parfait pour les moddeurs de CS:GO, TF2 et L4D2.',
        keywords: 'convertisseur vtf, valve texture format, modding source engine, outil texture',
        category: 'Développement'
      }
    }
  },
  {
    slug: 'px-to-rem-converter',
    title: 'Why Use REM Units — Free PX to REM Converter Guide',
    description: 'Learn why REM units are essential for modern, responsive web design and how our free PX to REM Converter can streamline your workflow.',
    keywords: 'px to rem, rem converter, responsive design, css units',
    category: 'Design',
    datePublished: '2025-11-23T15:14:00+05:30',
    dateModified: '2025-11-23T15:14:00+05:30',
    image: '/assets/blog/px-to-rem-converter-banner.webp',
    author: 'ni18',
    i18n: {
      es: {
        slug: 'convertidor-px-a-rem-guia',
        title: 'Por Qué Usar REM: Guía del Convertidor PX a REM',
        description: 'Descubre por qué las unidades REM son esenciales para el diseño web adaptativo y cómo nuestro convertidor PX a REM optimiza tu flujo de trabajo.',
        keywords: 'px a rem, convertidor rem, diseno responsivo, unidades css',
        category: 'Diseño'
      },
      fr: {
        slug: 'convertisseur-px-en-rem-guide',
        title: 'Pourquoi Utiliser les REM : Convertisseur PX en REM',
        description: 'Découvrez pourquoi les unités REM sont essentielles pour le design web adaptatif et comment notre convertisseur PX en REM simplifie votre travail.',
        keywords: 'px en rem, convertisseur rem, design adaptatif, unites css',
        category: 'Design'
      }
    }
  },
  {
    slug: 'json-visualizer-pro-tame-your-json-data',
    title: 'Introducing JSON Visualizer Pro: Tame Your JSON Data!',
    description: 'Discover JSON Visualizer Pro, a free online tool to easily view, format, minify, copy, and validate JSON data with features like tree view and undo/redo.',
    keywords: 'json visualizer, json formatter, json validator, developer tool',
    category: 'Developer',
    datePublished: '2025-04-12T13:14:00+05:30',
    dateModified: '2025-04-12T13:14:00+05:30',
    image: '/assets/blog/json-visualizer-pro-banner.webp',
    author: 'ni18',
    i18n: {
      es: {
        slug: 'json-visualizer-pro-doma-tus-datos-json',
        title: '¡Presentamos JSON Visualizer Pro: Doma tus Datos JSON!',
        description: 'Descubre JSON Visualizer Pro, una herramienta gratuita en línea para formatear, minificar, copiar y validar datos JSON fácilmente con vista de árbol.',
        keywords: 'visualizador json, formateador json, validador json, herramienta desarrollador',
        category: 'Programación'
      },
      fr: {
        slug: 'json-visualizer-pro-domptez-vos-donnees-json',
        title: 'Présentation de JSON Visualizer Pro : Domptez vos Données JSON !',
        description: 'Découvrez JSON Visualizer Pro, un outil gratuit en ligne pour visualiser, formater, minifier et valider des données JSON avec vue arborescente.',
        keywords: 'visualiseur json, formateur json, validateur json, outil developpement',
        category: 'Développement'
      }
    }
  },
  {
    slug: 'edit-images-like-pro-free-online-tool',
    title: 'Edit Images Like a Pro, Free — Online Image Editor',
    description: 'Learn how to edit images like a pro with a free online tool. Resize, crop, add text and more — no downloads, no cost, entirely in your browser.',
    keywords: 'image editor, free online tool, photo editing, resize image, crop image',
    category: 'Design',
    datePublished: '2025-04-05T18:00:00+05:30',
    dateModified: '2025-04-05T18:00:00+05:30',
    image: '/assets/blog/edit-images-pro-tool-banner.webp',
    author: 'ni18',
    i18n: {
      es: {
        slug: 'editar-imagenes-como-un-profesional-herramienta-gratuita-online',
        title: 'Edita Imágenes como un Pro Gratis: Editor Online',
        description: 'Aprende a editar imágenes como un profesional con una herramienta gratuita en línea en 2025. Redimensiona, recorta y optimiza fotos sin descargas ni costos.',
        keywords: 'editor de imagenes, herramienta online gratis, edicion de fotos, redimensionar imagen, recortar imagen',
        category: 'Diseño'
      },
      fr: {
        slug: 'edit-images-like-pro-free-online-tool',
        title: 'Éditez vos Images comme un Pro : Éditeur en Ligne',
        description: 'Apprenez à éditer des images comme un pro avec un outil en ligne gratuit et puissant en 2025. Redimensionnez, recadrez, ajoutez du texte et plus encore.',
        keywords: 'editeur d images, outil en ligne gratuit, retouche photo, redimensionner image, recadrer image',
        category: 'Design'
      }
    }
  },
  {
    slug: 'private-screen-recorder-no-software-guide',
    title: 'How to Record Screen Privately in Browser Without Software',
    description: 'Learn how to record your screen privately in any browser without software or extensions using our free, offline-ready Screen Recorder Pro tool.',
    keywords: 'private screen recording, record screen without software, browser screen recorder, online screen recorder, no extension screen recorder',
    category: 'Media',
    datePublished: '2026-03-04T12:00:00+05:30',
    dateModified: '2026-03-04T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/private-screen-recorder-no-software-guide-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'guia-grabador-pantalla-privado-sin-software',
        title: 'Cómo Grabar Pantalla Privado en el Navegador sin Software',
        description: 'Aprende cómo grabar tu pantalla de forma privada en el navegador sin instalar programas o extensiones con nuestro Screen Recorder Pro gratuito.',
        keywords: 'grabar pantalla sin software, grabador de pantalla online, grabar pantalla gratis navegador, grabador pantalla privado',
        category: 'Media'
      },
      fr: {
        slug: 'guide-enregistreur-ecran-prive-sans-logiciel',
        title: 'Comment Enregistrer son Écran Privé sans Logiciel',
        description: 'Apprenez à enregistrer votre écran de manière privée dans votre navigateur sans installer de logiciel ou d' + "'extension avec Screen Recorder Pro.",
        keywords: 'enregistrer ecran sans logiciel, enregistreur ecran en ligne, enregistreur ecran gratuit, enregistreur ecran prive',
        category: 'Média'
      }
    }
  },
  {
    slug: 'chrome-privacy-shift-jwt-debugger',
    title: 'Chrome\'s Privacy API Broke JWT Debugging — Here\'s the Fix',
    description: 'With Chrome\'s August 2026 privacy shift, client-side JWT debugging is now essential. Try our free browser tool—zero uploads, instant results.',
    keywords: 'chrome privacy update 2026, jwt debugger, client-side jwt, browser privacy api, developer tools',
    category: 'Developer',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/chrome-privacy-shift-jwt-debugger-banner.jpg`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'cambio-privacidad-chrome-depurador-jwt',
        title: 'La API de Privacidad de Chrome y JWT: la Solución',
        description: 'Con el cambio de privacidad de Chrome en agosto de 2026, la depuración de JWT del lado del cliente es esencial. Prueba nuestra herramienta gratuita.',
        keywords: 'actualizacion privacidad chrome 2026, depurador jwt, jwt lado del cliente, api privacidad navegador, herramientas desarrollador',
        category: 'Programación'
      },
      fr: {
        slug: 'changement-confidentialite-chrome-debogueur-jwt',
        title: 'L\'API de Confidentialité de Chrome et JWT : la Solution',
        description: 'Avec le changement de confidentialité de Chrome en août 2026, le débogage JWT côté client est essentiel. Essayez notre outil gratuit.',
        keywords: 'mise a jour confidentialite chrome 2026, debogueur jwt, jwt cote client, api confidentialite navigateur, outils developpement',
        category: 'Développement'
      }
    }
  },
  {
    slug: 'secure-basic-auth-header',
    title: 'Stop Leaking Credentials: Secure Basic Auth Header Guide',
    description: 'Protect your API keys from leak reports. Learn how to generate secure HTTP Basic Authentication headers 100% client-side in your browser.',
    keywords: 'basic authentication header, stop leaking credentials, secure basic auth, client-side header generator, http basic authentication',
    category: 'Developer',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/secure-basic-auth-header-banner.jpg`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'seguridad-encabezado-autenticacion-basica',
        title: 'Evita Fugas de Credenciales: Guía de Encabezado Basic Auth',
        description: 'Protege tus claves API contra filtraciones. Genera encabezados de autenticación básica HTTP 100% en el lado del cliente y de forma segura.',
        keywords: 'encabezado autenticacion basica, evitar fuga de credenciales, basic auth seguro, generador de encabezado cliente, autenticacion basica http',
        category: 'Programación'
      },
      fr: {
        slug: 'securite-entete-authentification-basique',
        title: 'Évitez les Fuites d\'Identifiants : Guide de l\'Entête Basic Auth',
        description: 'Protégez vos clés API des fuites de données. Générez des en-têtes d\'authentification Basic HTTP 100% côté client de manière sécurisée.',
        keywords: 'entete authentification basique, eviter fuite identifiants, basic auth securise, generateur entete cote client, authentification basique http',
        category: 'Développement'
      }
    }
  },
  {
    slug: 'chrome-firefox-heic-viewer-guide',
    title: 'How to Open and View HEIC Photos on Chrome & Firefox Free (2026)',
    description: 'Still unable to open HEIC files on Chrome or Firefox in August 2026? Learn how to view and convert iPhone HEIC photos online 100% privately.',
    keywords: 'open heic chrome, view heic firefox, how to view heic online, iphone heic viewer, free offline heic converter, ni18',
    category: 'Media',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    // No bespoke banner for this post; reuse the on-topic iPhone/HEIC photo banner.
    image: `${SITE_URL}/assets/blog/iphone-photo-fixer-guide-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'guia-visor-heic-chrome-firefox',
        title: 'Cómo Abrir y Ver Fotos HEIC en Chrome y Firefox Gratis (2026)',
        description: '¿Aún no puedes abrir archivos HEIC en Chrome o Firefox? Aprende a ver y convertir fotos HEIC de iPhone en línea de forma 100% privada.',
        keywords: 'abrir heic chrome, ver heic firefox, como ver heic online, visor heic iphone, convertidor heic offline gratis, ni18',
        category: 'Media'
      },
      fr: {
        slug: 'guide-visualisateur-heic-chrome-firefox',
        title: 'Ouvrir et Voir des Photos HEIC sur Chrome & Firefox',
        description: 'Impossible d\'ouvrir les fichiers HEIC sur Chrome ou Firefox ? Découvrez comment visualiser et convertir vos photos HEIC iPhone 100% en privé.',
        keywords: 'ouvrir heic chrome, voir heic firefox, comment voir heic en ligne, visualiseur heic iphone, convertisseur heic gratuit, ni18',
        category: 'Média'
      }
    }
  },
  {
    slug: 'google-august-2026-core-update-text-compare',
    title: 'Google August 2026 Core Update: Secure Text Compare Fix',
    description: 'Google\'s August 2026 Core Update demands E-E-A-T. Review content changes privately. Use our 100% client-side text compare tool to avoid leaks.',
    keywords: 'Google August 2026 Core Update, online text compare, client-side text analysis, content comparison tool, E-E-A-T content optimization, ni18',
    category: 'Productivity',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/google-august-2026-core-update-text-compare-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'actualizacion-core-google-agosto-2026-comparar-texto',
        title: 'Actualización de Google de Agosto 2026: Comparar Texto',
        description: 'La actualización de Google de agosto de 2026 exige E-E-A-T. Compara textos de forma 100% local y privada sin subir borradores a servidores externos.',
        keywords: 'actualizacion core google agosto 2026, comparador de texto en linea, analisis de texto local, herramienta de comparacion, optimizacion contenido, ni18',
        category: 'Productividad'
      },
      fr: {
        slug: 'mise-a-jour-core-google-aout-2026-comparer-texte',
        title: 'Mise à jour Google d\'Août 2026 : Comparateur de Texte',
        description: 'La mise à jour Google d\'août 2026 exige l\'E-E-A-T. Comparez vos textes 100% localement et en toute sécurité, sans aucun envoi vers un serveur externe.',
        keywords: 'mise a jour core google aout 2026, comparateur de texte en ligne, analyse de texte locale, outil de comparaison, optimisation de contenu, ni18',
        category: 'Productivité'
      }
    }
  },
  {
    slug: 'unix-epoch-timestamp-debugging-guide',
    title: 'Debugging Microservice Epoch Timestamps in August 2026',
    description: 'Diagnose millisecond vs nanosecond Unix timestamp drift across microservices. Convert and inspect timestamps 100% client-side with zero data leaks.',
    keywords: 'unix epoch timestamp debugging, convert epoch to date, unix timestamp converter, microservice timestamp drift, epoch converter, ni18',
    category: 'Developer',
    datePublished: '2026-08-09T12:00:00+05:30',
    dateModified: '2026-08-09T12:00:00+05:30',
    image: `${SITE_URL}/assets/blog/unix-epoch-timestamp-debugging-guide-banner.webp`,
    author: 'ni18',
    i18n: {
      es: {
        slug: 'guia-depuracion-marcas-tiempo-epoch-unix',
        title: 'Depuración de Marcas de Tiempo Epoch Unix en Microservicios',
        description: 'Diagnostica desfases de marcas de tiempo Unix en milisegundos y nanosegundos en microservicios. Convierte e inspecciona fechas 100% en local.',
        keywords: 'depuracion marca de tiempo epoch unix, convertir epoch a fecha, convertidor timestamp unix, desfase tiempo microservicios, convertidor epoch, ni18',
        category: 'Programación'
      },
      fr: {
        slug: 'guide-debogage-horodatage-epoch-unix',
        title: 'Débogage des Horodatages Epoch Unix dans les Microservices',
        description: 'Diagnostiquez les décalages d\'horodatage Unix en millisecondes et nanosecondes dans vos microservices. Convertissez vos dates 100% en local.',
        keywords: 'debogage horodatage epoch unix, convertir epoch en date, convertisseur timestamp unix, decalage temps microservices, convertisseur epoch, ni18',
        category: 'Développement'
      }
    }
  },
  // ---- noindex posts (excluded from sitemap) ----
  {
    slug: 'ai-love-calculator',
    title: 'AI Love Calculator: Test Your Compatibility Instant & Free',
    description: 'Check your love compatibility instantly with our AI Love Calculator. Free, fast, and accurate love test for couples and crushes. Try it now!',
    keywords: 'love calculator, ai love test, compatibility test, relationship score',
    category: 'Fun',
    datePublished: '2026-01-09T18:00:00+05:30',
    dateModified: '2026-01-09T18:00:00+05:30',
    image: '/assets/blog/ai-love-calculator-banner.jpg',
    author: 'ni18',
    noindex: true,
  },
  {
    slug: 'face-beauty-test',
    title: 'Face Beauty Test: How Attractive Are You? Check Your Score with AI',
    description: 'Discover your facial attractiveness score with our AI Face Beauty Test. Learn how it works, its benefits, and what your results mean. Try it now!',
    keywords: 'beauty test, face score, ai attractiveness, facial analysis',
    category: 'Fun',
    datePublished: '2026-01-06T18:00:00+05:30',
    dateModified: '2026-01-06T18:00:00+05:30',
    image: '/assets/blog/face-beauty-test-banner.jpg',
    author: 'ni18',
    noindex: true,
    i18n: {
      fr: {
        slug: 'ai-beauty-test-free-online',
        title: 'Test de Beauté IA : Découvrez Votre Score et Sosie Célébrité Gratuitement',
        description: 'Découvrez votre score d’attractivité faciale avec notre Test de Beauté IA. Apprenez comment cela fonctionne et ce que vos résultats signifient.',
        keywords: 'test de beaute, score du visage, attractivite ia, analyse faciale',
        category: 'Fun'
      }
    }
  },
];

export function blogUrl(slug: string, lang: Locale = 'en'): string {
  if (lang === 'es') {
    const post = blogPosts.find((p) => p.slug === slug);
    const esSlug = post?.i18n?.es?.slug || slug;
    return `${SITE_URL}/es/blogs/${esSlug}.html`;
  }
  if (lang === 'fr') {
    const post = blogPosts.find((p) => p.slug === slug);
    const frSlug = post?.i18n?.fr?.slug || slug;
    return `${SITE_URL}/fr/blogs/${frSlug}.html`;
  }
  return `${SITE_URL}/blogs/${slug}.html`;
}

export function indexedPosts(): BlogPost[] {
  return blogPosts.filter((p) => !p.noindex);
}

function blogPostingSchema(post: BlogPost, lang: Locale = 'en') {
  const title = lang === 'es' ? post.i18n?.es?.title : lang === 'fr' ? post.i18n?.fr?.title : post.title;
  const description = lang === 'es' ? post.i18n?.es?.description : lang === 'fr' ? post.i18n?.fr?.description : post.description;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title || post.title,
    description: description || post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    image: abs(post.image),
    url: blogUrl(post.slug, lang),
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/icons/android-chrome-192x192.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': blogUrl(post.slug, lang) },
  };
}

export function blogBreadcrumb(post: BlogPost, lang: Locale = 'en') {
  const homeLabel = lang === 'es' ? 'Inicio' : lang === 'fr' ? 'Accueil' : 'Home';
  const blogLabel = lang === 'es' ? 'Blog' : lang === 'fr' ? 'Blog' : 'Blog';
  const postTitle = lang === 'es' ? post.i18n?.es?.title : lang === 'fr' ? post.i18n?.fr?.title : post.title;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabel, item: `${SITE_URL}${lang === 'en' ? '' : '/' + lang}/` },
      { '@type': 'ListItem', position: 2, name: blogLabel, item: `${SITE_URL}${lang === 'en' ? '' : '/' + lang}/blogs/` },
      { '@type': 'ListItem', position: 3, name: postTitle || post.title },
    ],
  };
}

export function blogHreflang(post: BlogPost): HreflangLink[] {
  const links: HreflangLink[] = [{ hreflang: 'en', href: blogUrl(post.slug, 'en') }];
  if (post.i18n?.es) links.push({ hreflang: 'es', href: blogUrl(post.slug, 'es') });
  if (post.i18n?.fr) links.push({ hreflang: 'fr', href: blogUrl(post.slug, 'fr') });
  links.push({ hreflang: 'x-default', href: blogUrl(post.slug, 'en') });
  return links;
}

/** Full SEO props for a blog post page (canonical .html, robots, OG article, BlogPosting + Breadcrumb). */
export function blogSeo(post: BlogPost, lang: Locale = 'en'): SeoProps {
  const url = blogUrl(post.slug, lang);
  const title = lang === 'es' ? post.i18n?.es?.title : lang === 'fr' ? post.i18n?.fr?.title : post.title;
  const description = lang === 'es' ? post.i18n?.es?.description : lang === 'fr' ? post.i18n?.fr?.description : post.description;
  const keywords = lang === 'es' ? post.i18n?.es?.keywords : lang === 'fr' ? post.i18n?.fr?.keywords : post.keywords;
  const localeStr = lang === 'es' ? 'es_ES' : lang === 'fr' ? 'fr_FR' : 'en_US';
  return {
    title: title || post.title,
    description: description || post.description,
    keywords: keywords || post.keywords,
    canonical: url,
    robots: post.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1',
    hreflang: blogHreflang(post),
    og: {
      type: 'article',
      url,
      title: title || post.title,
      description: description || post.description,
      image: abs(post.image),
      siteName: SITE_NAME,
      locale: localeStr,
    },
    twitter: { card: 'summary_large_image', url, title: title || post.title, description: description || post.description, image: abs(post.image) },
    jsonLd: [blogPostingSchema(post, lang), blogBreadcrumb(post, lang)],
  };
}
