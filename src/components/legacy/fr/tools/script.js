[
  {
    "name": "Réformes GST de Prochaine Génération",
    "description": "Explorez des idées et des ressources sur les réformes GST à venir et leur impact sur les entreprises en Inde.",
    "url": "https://online-tools.ni18.in/tools/next-gen-gst-reforms/"
  },
  {
    "name": "Outil Utilitaire d'Image Gratuit en Ligne",
    "description": "Modifiez, redimensionnez, compressez et convertissez des images facilement — tout cela dans votre navigateur, gratuitement.",
    "url": "https://online-tools.ni18.in/tools/free-online-image-utility-tool/"
  },
  {
    "name": "Analyseur de Texte Tout-en-Un",
    "description": "Analysez, comptez et améliorez votre contenu textuel avec cet outil d'analyse de texte intelligent et gratuit.",
    "url": "https://online-tools.ni18.in/tools/all-in-one-text-analyzer/"
  },
  {
    "name": "Outil de Comparaison JSON",
    "description": "Comparez deux fichiers JSON côte à côte et trouvez les différences instantanément avec cet outil convivial pour les développeurs.",
    "url": "https://online-tools.ni18.in/tools/json-comparison-tool/"
  },
  {
    "name": "Visualiseur JSON Pro",
    "description": "Visualisez des structures de données JSON complexes dans un format arborescent facile à comprendre.",
    "url": "https://online-tools.ni18.in/tools/json-visualizer-pro/"
  },
  {
    "name": "Test de Beauté IA",
    "description": "Laissez l'IA analyser votre photo et prédire des scores de beauté pour le plaisir et le divertissement.",
    "url": "https://online-tools.ni18.in/fr/tools/ai-beauty-test/"
  },
  {
    "name": "Jeu Devinez le Logo",
    "description": "Testez vos connaissances avec ce jeu amusant de devinettes de logos propulsé par l'IA.",
    "url": "https://online-tools.ni18.in/tools/guess-the-logo/"
  },
  {
    "name": "Comparaison de Texte en Ligne",
    "description": "Comparez facilement deux blocs de texte et mettez en évidence les différences en temps réel.",
    "url": "https://online-tools.ni18.in/tools/online-text-compare/"
  },
  {
    "name": "Convertisseur PX en REM",
    "description": "Convertissez rapidement des valeurs de pixels en unités rem pour une conception web responsive.",
    "url": "https://online-tools.ni18.in/tools/px-to-rem-converter/"
  },
  {
    "name": "Calculatrice d'Amour IA",
    "description": "Découvrez votre score de compatibilité en utilisant une calculatrice d'amour amusante propulsée par l'IA.",
    "url": "https://online-tools.ni18.in/tools/ai-love-calculator/"
  },
  {
    "name": "Générateur d'En-tête d'Authentification de Base",
    "description": "Générez instantanément des en-têtes d'authentification de base encodés en Base64 pour des tests d'API sécurisés.",
    "url": "https://online-tools.ni18.in/tools/basic-authentication-header-generator/"
  },
  {
    "name": "Convertisseur REM en PX",
    "description": "Convertissez les unités rem en valeurs de pixels pour des ajustements précis de conception front-end.",
    "url": "https://online-tools.ni18.in/tools/rem-to-px-converter/"
  },
  {
    "name": "Générateur de Vœux de Bonne Année",
    "description": "Créez et partagez des vœux de Bonne Année personnalisés avec des noms dynamiques et des animations festives.",
    "url": "https://online-tools.ni18.in/tools/happy-new-year/"
  }
]

// 1. Load Data from the JSON script tag for improved maintainability
    let toolsData = [];
    try {
      const dataElement = document.getElementById('toolDataJson');
      if (dataElement && dataElement.textContent) {
        toolsData = JSON.parse(dataElement.textContent.trim());
      }
    } catch (e) {
      console.error("Error parsing tool data:", e);
    }

    const toolsContainer = document.getElementById('toolsContainer');
    const noResultsMessage = document.getElementById('noResults');

    /**
     * Renders the given array of tools into the DOM.
     * @param {Array<Object>} tools - The array of tool objects to render.
     */
    function renderTools(tools) {
      toolsContainer.innerHTML = ''; // Clear existing cards

      if (tools.length === 0) {
        noResultsMessage.classList.remove('hidden');
        // A11y Improvement: Announce the change to screen readers
        toolsContainer.setAttribute('aria-busy', 'false');
        noResultsMessage.setAttribute('aria-live', 'assertive');

        return;
      } else {
        noResultsMessage.classList.add('hidden');
        noResultsMessage.setAttribute('aria-live', 'off');
      }

      // A11y Improvement: Set aria-busy while content is being updated
      toolsContainer.setAttribute('aria-busy', 'true');

      tools.forEach(tool => {
        const toolCard = document.createElement('div');
        // A11y Improvement: role="article" for each feed item
        toolCard.setAttribute('role', 'article');
        toolCard.className = 'bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1 border border-gray-100';

        // Tool Name (Clickable link)
        const nameLink = document.createElement('a');
        nameLink.href = tool.url;
        nameLink.target = '_blank';
        // A11y Improvement: Add title attribute for clarity on link action
        nameLink.title = `Allez sur le site web de ${tool.name} (ouvre dans un nouvel onglet)`;
        nameLink.className = 'text-xl font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer transition duration-150';
        nameLink.textContent = tool.name;

        // Tool Description
        const descriptionPara = document.createElement('p');
        descriptionPara.className = 'mt-2 text-gray-500 text-sm';
        descriptionPara.textContent = tool.description;

        // Append elements to the card
        toolCard.appendChild(nameLink);
        toolCard.appendChild(descriptionPara);

        toolsContainer.appendChild(toolCard);
      });
      // A11y Improvement: Reset aria-busy once content is rendered
      toolsContainer.setAttribute('aria-busy', 'false');
    }

    /**
     * Filters the tools data based on the search input value and re-renders the list.
     */
    function filterTools() {
      const searchTerm = document.getElementById('toolSearch').value.toLowerCase().trim();

      const filteredTools = toolsData.filter(tool => {
        const nameMatch = tool.name.toLowerCase().includes(searchTerm);
        const descriptionMatch = tool.description.toLowerCase().includes(searchTerm);
        // Return true if the search term is found in either the name or the description
        return nameMatch || descriptionMatch;
      });

      renderTools(filteredTools);
    }

    // 3. Initial Load: Render all tools when the script loads
    document.addEventListener('DOMContentLoaded', () => {
      renderTools(toolsData);
    });
