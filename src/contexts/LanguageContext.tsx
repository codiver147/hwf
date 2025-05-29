
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.overview': 'Aperçu du système de gestion des dons HWF',
    'dashboard.totalClients': 'Total Clients',
    'dashboard.activeVolunteers': 'Bénévoles Actifs',
    'dashboard.inventoryItems': 'Articles en Stock',
    'dashboard.pendingRequests': 'Requêtes en Cours',
    'dashboard.monthlyStats': 'Nouveaux Clients et Bénévoles par Mois',
    'dashboard.recentActivity': 'Activités Récentes',
    // Common
    'common.loading': 'Chargement...',
    'common.unknown': 'Inconnu',
    'common.request': 'Requête',
    'common.for': 'pour',
    'common.status': 'Statut',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.actions': 'Actions',
    'common.filters': 'Filtres',
    'common.areYouSure': 'Êtes-vous sûr?',
    'common.saving': 'Enregistrement...',
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.clients': 'Clients',
    'nav.volunteers': 'Bénévoles',
    'nav.teams': 'Équipes',
    'nav.inventory': 'Inventaire',
    'nav.categories': 'Catégories',
    'nav.requests': 'Requêtes',
    'nav.skills': 'Compétences',
    // Auth
    'auth.logout': 'Déconnexion',
    'auth.settings': 'Paramètres',
    'auth.administrator': 'Administrateur',
    'auth.volunteer': 'Bénévole',
    // Headers
    'header.backToClients': 'Retour aux Clients',
    'header.backToVolunteers': 'Retour aux Bénévoles',
    'header.backToInventory': 'Retour à l\'Inventaire',
    'header.backToRequests': 'Retour aux Requêtes',
    'header.backToTeams': 'Retour aux Équipes',
    'header.backHome': 'Retour à l\'accueil',
    // Actions
    'actions.addClient': 'Ajouter un Client',
    'actions.addVolunteer': 'Ajouter un Bénévole',
    'actions.addInventory': 'Ajouter un Article',
    'actions.addRequest': 'Ajouter une Requête',
    'actions.addTeam': 'Ajouter une Équipe',
    'actions.updateStatus': 'Mettre à jour le statut',
    'actions.cancel': 'Annuler',
    'actions.update': 'Mettre à jour',
    'actions.search': 'Rechercher',
    'actions.delete': 'Supprimer',
    'actions.save': 'Enregistrer',
    // Pages
    'pages.clients.title': 'Clients',
    'pages.clients.addNew': 'Ajouter un Nouveau Client',
    'pages.clients.information': 'Informations du Client',
    'pages.volunteers.title': 'Bénévoles',
    'pages.volunteers.manage': 'Gérez les informations et les assignations des bénévoles',
    'pages.volunteers.addNew': 'Ajouter un Nouveau Bénévole',
    'pages.volunteers.information': 'Informations du Bénévole',
    'pages.inventory.title': 'Inventaire',
    'pages.inventory.manage': 'Gérer les articles de dons et les niveaux de stock',
    'pages.inventory.addNew': 'Ajouter un Nouvel Article',
    'pages.inventory.information': 'Informations de l\'Article',
    'pages.requests.title': 'Requêtes',
    'pages.requests.addNew': 'Nouvelle Requête',
    'pages.requests.information': 'Détails de la Requête',
    'pages.teams.title': 'Équipes',
    'pages.notFound.title': 'Page non trouvée',
    'pages.notFound.description': 'La page que vous recherchez n\'existe pas ou a été déplacée.',
    // Status
    'status.new': 'Nouveau',
    'status.inProgress': 'En cours',
    'status.processing': 'En traitement',
    'status.scheduled': 'Planifié',
    'status.completed': 'Terminé',
    'status.cancelled': 'Annulé',
    'status.active': 'Actif',
    'status.inactive': 'Inactif',
    // Priority
    'priority.low': 'Basse',
    'priority.medium': 'Moyenne',
    'priority.high': 'Haute',
    'priority.urgent': 'Urgente',
    // Inventory
    'inventory.list': 'Liste d\'inventaire',
    'inventory.item': 'Article',
    'inventory.category': 'Catégorie',
    'inventory.condition': 'État',
    'inventory.quantity': 'Quantité',
    'inventory.location': 'Emplacement',
    'inventory.available': 'Disponible',
    'inventory.unavailable': 'Indisponible',
    'inventory.search': 'Rechercher dans l\'inventaire...',
    'inventory.noItems': 'Aucun article trouvé.',
    'inventory.errorLoading': 'Impossible de charger les articles de l\'inventaire',
    'inventory.itemDeleted': 'Article supprimé avec succès',
    'inventory.errorDeleting': 'Impossible de supprimer l\'article',
    'inventory.deleteConfirmation': 'Cette action ne peut pas être annulée. Cela supprimera définitivement l\'article d\'inventaire.',
    // Categories
    'categories.manage': 'Gérer les catégories d\'inventaire pour une meilleure organisation',
    'categories.list': 'Liste des catégories',
    'categories.name': 'Nom de la catégorie',
    'categories.description': 'Description',
    'categories.addNew': 'Nouvelle catégorie',
    'categories.search': 'Rechercher des catégories...',
    'categories.noResults': 'Aucune catégorie trouvée.',
    'categories.errorLoading': 'Impossible de charger les catégories',
    'categories.deleted': 'Catégorie supprimée avec succès',
    'categories.errorDeleting': 'Impossible de supprimer la catégorie. Elle est peut-être utilisée par des articles d\'inventaire.',
    'categories.deleteTitle': 'Supprimer la catégorie',
    'categories.deleteConfirmation': 'Êtes-vous sûr de vouloir supprimer cette catégorie? Cette action ne peut pas être annulée.',
    'categories.delete': 'Supprimer la catégorie',
    'categories.information': 'Informations de la catégorie',
    'categories.addDescription': 'Ajoutez une nouvelle catégorie pour organiser votre inventaire',
    'categories.namePlaceholder': 'Entrez le nom de la catégorie',
    'categories.descriptionPlaceholder': 'Entrez la description de la catégorie',
    'categories.addSuccess': 'Catégorie ajoutée avec succès',
    'categories.errorAdding': 'Erreur lors de l\'ajout de la catégorie',
  },
  en: {
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Helping With Furniture',
    'dashboard.totalClients': 'Total Clients',
    'dashboard.activeVolunteers': 'Active Volunteers',
    'dashboard.inventoryItems': 'Inventory Items',
    'dashboard.pendingRequests': 'Pending Requests',
    'dashboard.monthlyStats': 'New Clients and Volunteers by Month',
    'dashboard.recentActivity': 'Recent Activity',
    // Common
    'common.loading': 'Loading...',
    'common.unknown': 'Unknown',
    'common.request': 'Request',
    'common.for': 'for',
    'common.status': 'Status',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.actions': 'Actions',
    'common.filters': 'Filters',
    'common.areYouSure': 'Are you sure?',
    'common.saving': 'Saving...',
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.clients': 'Clients',
    'nav.volunteers': 'Volunteers',
    'nav.teams': 'Teams',
    'nav.inventory': 'Inventory',
    'nav.categories': 'Categories',
    'nav.requests': 'Requests',
    'nav.skills': 'Skills',
    // Auth
    'auth.logout': 'Log out',
    'auth.settings': 'Settings',
    'auth.administrator': 'Administrator',
    'auth.volunteer': 'Volunteer',
    // Headers
    'header.backToClients': 'Back to Clients',
    'header.backToVolunteers': 'Back to Volunteers',
    'header.backToInventory': 'Back to Inventory',
    'header.backToRequests': 'Back to Requests',
    'header.backToTeams': 'Back to Teams',
    'header.backHome': 'Back to Home',
    // Actions
    'actions.addClient': 'Add Client',
    'actions.addVolunteer': 'Add Volunteer',
    'actions.addInventory': 'Add Item',
    'actions.addRequest': 'Add Request',
    'actions.addTeam': 'Add Team',
    'actions.updateStatus': 'Update Status',
    'actions.cancel': 'Cancel',
    'actions.update': 'Update',
    'actions.search': 'Search',
    'actions.delete': 'Delete',
    'actions.save': 'Save',
    // Pages
    'pages.clients.title': 'Clients',
    'pages.clients.addNew': 'Add New Client',
    'pages.clients.information': 'Client Information',
    'pages.volunteers.title': 'Volunteers',
    'pages.volunteers.manage': 'Manage volunteer information and assignments',
    'pages.volunteers.addNew': 'Add New Volunteer',
    'pages.volunteers.information': 'Volunteer Information',
    'pages.inventory.title': 'Inventory',
    'pages.inventory.manage': 'Manage donation items and stock levels',
    'pages.inventory.addNew': 'Add New Item',
    'pages.inventory.information': 'Item Information',
    'pages.requests.title': 'Requests',
    'pages.requests.addNew': 'New Request',
    'pages.requests.information': 'Request Details',
    'pages.teams.title': 'Teams',
    'pages.notFound.title': 'Page Not Found',
    'pages.notFound.description': 'The page you are looking for doesn\'t exist or has been moved.',
    // Status
    'status.new': 'New',
    'status.inProgress': 'In Progress',
    'status.processing': 'Processing',
    'status.scheduled': 'Scheduled',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    // Priority
    'priority.low': 'Low',
    'priority.medium': 'Medium',
    'priority.high': 'High',
    'priority.urgent': 'Urgent',
    // Inventory
    'inventory.list': 'Inventory List',
    'inventory.item': 'Item',
    'inventory.category': 'Category',
    'inventory.condition': 'Condition',
    'inventory.quantity': 'Quantity',
    'inventory.location': 'Location',
    'inventory.available': 'Available',
    'inventory.unavailable': 'Unavailable',
    'inventory.search': 'Search inventory...',
    'inventory.noItems': 'No items found.',
    'inventory.errorLoading': 'Failed to load inventory items',
    'inventory.itemDeleted': 'Item deleted successfully',
    'inventory.errorDeleting': 'Failed to delete item',
    'inventory.deleteConfirmation': 'This action cannot be undone. This will permanently delete the inventory item.',
    // Categories
    'categories.manage': 'Manage inventory categories for better organization',
    'categories.list': 'Category List',
    'categories.name': 'Category Name',
    'categories.description': 'Description',
    'categories.addNew': 'New Category',
    'categories.search': 'Search categories...',
    'categories.noResults': 'No categories found.',
    'categories.errorLoading': 'Failed to load categories',
    'categories.deleted': 'Category deleted successfully',
    'categories.errorDeleting': 'Failed to delete category. It may be in use by inventory items.',
    'categories.deleteTitle': 'Delete Category',
    'categories.deleteConfirmation': 'Are you sure you want to delete this category? This action cannot be undone.',
    'categories.delete': 'Delete Category',
    'categories.information': 'Category Information',
    'categories.addDescription': 'Add a new category to organize your inventory',
    'categories.namePlaceholder': 'Enter category name',
    'categories.descriptionPlaceholder': 'Enter category description',
    'categories.addSuccess': 'Category added successfully',
    'categories.errorAdding': 'Failed to add category',
  }
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Get saved language from localStorage or default to 'fr'
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'fr';
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const currentTranslations = translations[language] as Record<string, string>;
    return currentTranslations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
