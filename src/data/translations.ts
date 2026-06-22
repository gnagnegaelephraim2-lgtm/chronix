export type Language = 'en' | 'fr';

export const translations = {
  en: {
    // Portals & Shell
    appName: 'Chronix Pro',
    adminPortal: 'Admin Portal',
    workerPortal: 'Worker Portal',
    kioskPortal: 'Kiosk Clock-In',
    supervisorPortal: 'Supervisor Portal',
    toggleLanguage: 'Français',
    logout: 'Logout',
    welcomeBack: 'Welcome back,',
    selectPortal: 'Select Access Portal',
    enterPassword: 'Enter Password',
    enterPin: 'Enter 4-Digit PIN',
    submit: 'Submit',
    cancel: 'Cancel',

    // Admin Tabs & UI
    dashboard: 'Dashboard',
    workers: 'Workers',
    payroll: 'Payroll & Payments',
    announcements: 'Announcements',
    companySettings: 'Company Settings',

    // Admin Dashboard
    activeWorkers: 'Active Workers',
    hoursClocked: 'Hours Clocked (Month)',
    payrollDue: 'Total Payroll Due',
    expiringPermits: 'Expiring Permits (30d)',
    recentActivity: 'Recent Clock-In Activity',
    noActivity: 'No recent clock-in activity found.',
    quickStats: 'Quick Statistics Overview',
    realTimeFeed: 'Real-Time Clock Feed',

    // Worker Editor
    addWorker: 'Add New Worker',
    editWorker: 'Edit Worker Profile',
    workerDetails: 'Worker Details',
    firstName: 'First Name',
    lastName: 'Last Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    passportOrNcid: 'Passport / NCID Number',
    hourlyRate: 'Hourly Rate (MUR/hr)',
    department: 'Department',
    siteLocation: 'Site / Location',
    saveWorker: 'Save Worker Profile',
    deactivateWorker: 'Deactivate Worker',
    activateWorker: 'Activate Worker',

    // Permit Tracker
    permitTracker: 'Migrant Worker Permit Tracker',
    workPermitExpiry: 'Work Permit Expiry Date',
    entryPermitDetails: 'Entry Permit Details',
    studentPermitDetails: 'Student Permit / Visa Details',
    laborContractor: 'Labour Contractor Assignment',
    workCategories: 'Permitted Work Categories',
    permitWarning: 'Warning: Permit expires in less than 30 days!',
    permitExpired: 'Alert: Permit has expired!',
    noPermitsExpiring: 'All migrant worker permits are currently valid and up to date.',

    // Worker invitations
    inviteWorker: 'Invite Worker',
    inviteMethod: 'Select Invitation Method',
    inviteSuccess: 'Invitation simulated successfully!',
    inviteSmsMsg: 'Hi [Name], welcome to Chronix! Your temporary PIN is [PIN] and password is [Password]. Log in here: [Link]',
    sendInvite: 'Send Invitation Link',

    // Payroll & Reports
    processPayment: 'Process Payment',
    releasePayment: 'Release & Send Payroll',
    paymentHistory: 'Payment History',
    totalSalaryPaid: 'Total Salary Paid (All Time)',
    noPaymentHistory: 'No payments have been processed yet.',
    paymentSuccess: 'Payment released successfully to ',
    exportPdf: 'Export PDF Report',
    exportExcel: 'Export Excel Report',
    detailedPayroll: 'Detailed Payroll Report',
    grandTotal: 'Grand Total Payout',
    companyLogo: 'Company Logo URL',
    companyName: 'Company Name',
    reportDate: 'Report Generation Date',
    payrollFormula: 'Formula: Hours Worked * Hourly Rate',
    statusPaid: 'Paid',
    statusPending: 'Pending Release',

    // Announcements
    createAnnouncement: 'Publish Announcement',
    announcementTitle: 'Title',
    announcementContent: 'Message Content',
    announcementType: 'Announcement Category',
    typeShift: 'Shift Updates',
    typeNews: 'Company News',
    typeSafety: 'Safety Notices',
    typePayroll: 'Payroll Updates',
    typeUrgent: 'Urgent Alert',
    publishBtn: 'Broadcast Announcement',
    noAnnouncements: 'No announcements posted yet.',

    // Kiosk Clock-In
    kioskSetup: 'Kiosk Terminal Settings',
    selectKioskDept: 'Assign Kiosk to Department / Site',
    allDepartments: 'All Departments & Teams',
    clockInSuccess: 'Clocked In successfully!',
    clockOutSuccess: 'Clocked Out successfully!',
    kioskInstructions: 'Select your name or search, then choose verification method.',
    searchWorker: 'Search worker...',
    pinVerify: 'PIN Verification',
    passwordVerify: 'Password Verification',
    faceVerify: 'Face ID Scan',
    faceScanning: 'Scanning features... Keep face stable.',
    faceScanMatch: 'Face matching: 99.4% Match confirmed.',
    clockedInAt: 'Clocked in at',
    clockedOutAt: 'Clocked out at',

    // Supervisor Group Clock-In
    supervisorSelectCrew: 'Select Crew to Clock-In/Out',
    crewList: 'Crew List',
    bulkClockIn: 'Bulk Clock-In Selected',
    bulkClockOut: 'Bulk Clock-Out Selected',
    bulkClockSuccess: 'Bulk clock action processed for selected crew!',
    noWorkersSelected: 'Please select at least one worker.',

    // Worker Help & WhatsApp Support
    whatsappHelp: 'WhatsApp/SMS Help Support',
    helpCenter: 'Support Assistant',
    sendHelpMsg: 'Send Help Request',
    mockMessagePlaceholder: 'Type your message or select an issue below...',
    askLoginHelp: 'I cannot log in / lost my PIN',
    askPasswordReset: 'Request password reset message',
    askClockInTrouble: 'Trouble clocking in (no internet/phone dead)',
    chatbotResponse: 'Chronix Bot: SMS containing your login details has been resent to your registered number. For physical issues, please use the Kiosk Tablet at your workplace.',
    chatSuccess: 'Message sent via WhatsApp/SMS simulator!',
  },
  fr: {
    // Portals & Shell
    appName: 'Chronix Pro',
    adminPortal: 'Portail Admin',
    workerPortal: 'Portail Employé',
    kioskPortal: 'Pointage Kiosque',
    supervisorPortal: 'Portail Superviseur',
    toggleLanguage: 'English',
    logout: 'Déconnexion',
    welcomeBack: 'Bon retour,',
    selectPortal: 'Sélectionner le Portail d\'Accès',
    enterPassword: 'Entrer le mot de passe',
    enterPin: 'Entrer le code PIN à 4 chiffres',
    submit: 'Valider',
    cancel: 'Annuler',

    // Admin Tabs & UI
    dashboard: 'Tableau de bord',
    workers: 'Employés',
    payroll: 'Paie & Règlements',
    announcements: 'Annonces',
    companySettings: 'Configuration de l\'Entreprise',

    // Admin Dashboard
    activeWorkers: 'Employés Actifs',
    hoursClocked: 'Heures Pointées (Mois)',
    payrollDue: 'Total de la Paie Due',
    expiringPermits: 'Permis Expirant (30j)',
    recentActivity: 'Activité de Pointage Récente',
    noActivity: 'Aucune activité de pointage récente.',
    quickStats: 'Aperçu des Statistiques',
    realTimeFeed: 'Flux de Pointage en Temps Réel',

    // Worker Editor
    addWorker: 'Ajouter un Employé',
    editWorker: 'Modifier le Profil de l\'Employé',
    workerDetails: 'Détails de l\'Employé',
    firstName: 'Prénom',
    lastName: 'Nom',
    emailAddress: 'Adresse E-mail',
    phoneNumber: 'Numéro de Téléphone',
    passportOrNcid: 'Numéro de Passeport / NCID',
    hourlyRate: 'Taux Horaire (MUR/h)',
    department: 'Département',
    siteLocation: 'Site / Emplacement',
    saveWorker: 'Enregistrer le Profil',
    deactivateWorker: 'Désactiver l\'Employé',
    activateWorker: 'Activer l\'Employé',

    // Permit Tracker
    permitTracker: 'Suivi des Permis de Travail',
    workPermitExpiry: 'Expiration du Permis de Travail',
    entryPermitDetails: 'Détails du Permis d\'Entrée',
    studentPermitDetails: 'Détails du Permis d\'Étudiant',
    laborContractor: 'Affectation du Sous-traitant',
    workCategories: 'Catégories de Travail Autorisées',
    permitWarning: 'Attention: Le permis expire dans moins de 30 jours !',
    permitExpired: 'Alerte: Le permis a expiré !',
    noPermitsExpiring: 'Tous les permis des travailleurs migrants sont actuellement valides.',

    // Worker invitations
    inviteWorker: 'Inviter l\'Employé',
    inviteMethod: 'Méthode d\'Invitation',
    inviteSuccess: 'Invitation simulée avec succès !',
    inviteSmsMsg: 'Bonjour [Name], bienvenue sur Chronix ! Votre code PIN temporaire est [PIN] et votre mot de passe est [Password]. Connectez-vous ici: [Link]',
    sendInvite: 'Envoyer le Lien d\'Invitation',

    // Payroll & Reports
    processPayment: 'Traiter le Paiement',
    releasePayment: 'Valider & Envoyer la Paie',
    paymentHistory: 'Historique des Paiements',
    totalSalaryPaid: 'Salaire Total Versé',
    noPaymentHistory: 'Aucun paiement n\'a encore été traité.',
    paymentSuccess: 'Paiement effectué avec succès pour ',
    exportPdf: 'Exporter le Rapport PDF',
    exportExcel: 'Exporter le Rapport Excel',
    detailedPayroll: 'Rapport de Paie Détaillé',
    grandTotal: 'Montant Global Total',
    companyLogo: 'URL du Logo de l\'Entreprise',
    companyName: 'Nom de l\'Entreprise',
    reportDate: 'Date de Génération du Rapport',
    payrollFormula: 'Formule: Heures Pointées * Taux Horaire',
    statusPaid: 'Payé',
    statusPending: 'En attente',

    // Announcements
    createAnnouncement: 'Publier une Annonce',
    announcementTitle: 'Titre',
    announcementContent: 'Contenu du Message',
    announcementType: 'Catégorie d\'Annonce',
    typeShift: 'Mises à jour des Horaires',
    typeNews: 'Nouvelles de l\'Entreprise',
    typeSafety: 'Consignes de Sécurité',
    typePayroll: 'Mises à jour de la Paie',
    typeUrgent: 'Alerte Urgente',
    publishBtn: 'Diffuser l\'Annonce',
    noAnnouncements: 'Aucune annonce publiée pour le moment.',

    // Kiosk Clock-In
    kioskSetup: 'Configuration du Terminal Kiosque',
    selectKioskDept: 'Assigner le Kiosque au Site/Département',
    allDepartments: 'Tous les Départements & Équipes',
    clockInSuccess: 'Pointage Entrée Réussi !',
    clockOutSuccess: 'Pointage Sortie Réussi !',
    kioskInstructions: 'Sélectionnez votre nom ou cherchez, puis choisissez la méthode de validation.',
    searchWorker: 'Rechercher un employé...',
    pinVerify: 'Validation par PIN',
    passwordVerify: 'Validation par Mot de passe',
    faceVerify: 'Validation par Face ID',
    faceScanning: 'Analyse des traits... Restez stable face à la caméra.',
    faceScanMatch: 'Validation faciale: Correspondance de 99.4% confirmée.',
    clockedInAt: 'Entrée enregistrée à',
    clockedOutAt: 'Sortie enregistrée à',

    // Supervisor Group Clock-In
    supervisorSelectCrew: 'Sélectionner l\'Équipe à Pointer',
    crewList: 'Liste de l\'Équipe',
    bulkClockIn: 'Pointage Entrée Groupé',
    bulkClockOut: 'Pointage Sortie Groupé',
    bulkClockSuccess: 'Action de pointage groupé validée pour l\'équipe sélectionnée !',
    noWorkersSelected: 'Veuillez sélectionner au moins un employé.',

    // Worker Help & WhatsApp Support
    whatsappHelp: 'Aide & Support WhatsApp/SMS',
    helpCenter: 'Assistant Support',
    sendHelpMsg: 'Envoyer une Demande d\'Aide',
    mockMessagePlaceholder: 'Tapez votre message ou sélectionnez un problème ci-dessous...',
    askLoginHelp: 'Je n\'arrive pas à me connecter / PIN perdu',
    askPasswordReset: 'Demander un message de réinitialisation',
    askClockInTrouble: 'Problème de pointage (téléphone éteint / pas de réseau)',
    chatbotResponse: 'Bot Chronix: Un SMS contenant vos identifiants a été renvoyé à votre numéro enregistré. Si le problème est matériel, utilisez la Tablette Kiosque de votre entreprise.',
    chatSuccess: 'Message envoyé via le simulateur WhatsApp/SMS !',
  },
} as const;
export type TranslationKey = keyof typeof translations.en;
export type Translations = typeof translations.en;
export type TFunction = (key: TranslationKey, params?: Record<string, string>) => string;

export function getT(lang: Language): TFunction {
  return (key: TranslationKey, params?: Record<string, string>) => {
    let text: string = (translations[lang] as Record<string, string>)[key] || 
                       (translations['en'] as Record<string, string>)[key] || 
                       String(key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\[${k}\\]`, 'g'), v);
      });
    }
    return text;
  };
}
