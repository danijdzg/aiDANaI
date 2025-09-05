import { addDays, addWeeks, addMonths, addYears } from 'https://cdn.jsdelivr.net/npm/date-fns@2.29.3/+esm'

// =================================================================================
// (El código anterior, desde la importación hasta el inicio de startMovementForm, va aquí)
// =================================================================================

const translations = {
    // ENGLISH
    en: {
        // Nav & Titles
        nav_home: "Home",
        nav_wealth: "Wealth",
        nav_analysis: "Analysis",
        nav_settings: "Settings",
        title_home: "Home",
        title_wealth: "Wealth",
        title_analysis: "Analysis",
        title_settings: "Settings",
        title_history: "Transaction History",

        // Login
        login_welcome: "Welcome Back",
        login_tagline: "Log in to take control of your finances.",
        login_email_placeholder: "Email address",
        login_password_placeholder: "Password",
        login_forgot_password: "Forgot your password?",
        login_button: "Log In",
        login_no_account: "Don't have an account?",
        login_register_link: "Sign up here",
        
        // Settings
        settings_account_and_prefs: "Account & Preferences",
        settings_user_account: "User Account",
        settings_logged_in_as: "Logged in as:",
        settings_logout: "Log Out",
        settings_delete_account: "Delete My Account Permanently",
        settings_appearance: "Appearance",
        settings_language: "Language",
        settings_theme_selector: "Theme Selector",
        settings_general: "General Settings",
        settings_startup_options: "Startup Options",
        settings_skip_intro: "Skip intro and quote on app start",
        settings_save_config: "Save Settings",
        settings_data_management: "Data Management",
        settings_recalculate_balances: "Recalculate Account Balances",
        settings_backup: "Backup & Restore",
        settings_backup_warning: "Importing a JSON or CSV file will replace all your current data. It is recommended to export first to have a backup.",
        settings_export_json: "Export JSON",
        settings_import_json: "Import JSON",
        settings_import_csv: "Import CSV",
        settings_delete_all_data: "Delete All Data",

        // Tooltips
        tooltip_toggle_ledger: "Switch between Personal (A) and Secondary (B) ledger",
        tooltip_add_movement: "Add Transaction",
        tooltip_close: "Close",
        tooltip_manage_concepts: "Manage Categories",
        tooltip_manage_accounts: "Manage Accounts",
        tooltip_save_movement: "Save Transaction",
        tooltip_delete: "Delete",
        tooltip_duplicate: "Duplicate",
        tooltip_export_json: "Export a full backup in JSON format.",
        tooltip_import_json: "Import from a JSON backup file.",
        
        // Forms & Modals
        form_type_movement: "Income/Expense",
        form_type_transfer: "Transfer",
        form_amount: "Amount (expense as negative)",
        form_amount_placeholder: "e.g.: -2.50",
        form_description: "Description",
        form_description_placeholder: "e.g.: Weekly groceries",
        form_source_account: "Source Account",
        form_destination_account: "Destination Account",
        form_show_all_accounts: "Show accounts from both ledgers (A & B)",
        form_schedule_recurrent: "Schedule as recurrent?",
        form_frequency: "Frequency",
        form_next_execution: "Next execution",
        form_ends_on: "Ends on (optional)",
        form_date: "Date",
        
        // Frequencies
        freq_daily: "Daily",
        freq_weekly: "Weekly",
        freq_monthly: "Monthly",
        freq_yearly: "Annual",

        // Empty States
        empty_history_title: "Your history starts here",
        empty_history_text: "Press the `+` button to add your first income or expense.",
        budget_empty_title: "Define Your Financial Plan",
        budget_empty_text: "Set spending limits and income goals to take control of your year. Get started now!",
        budget_empty_cta: "Create Budgets",

        // Search
        search_placeholder: "Search across the app...",
        search_empty_title: "Find everything",
        search_empty_text: "Search for transactions, accounts, or categories. <br>Shortcut: <strong>Cmd/Ctrl + K</strong>",
        
        // Tour
        tour_skip: "Skip",
        tour_previous: "Previous",
        tour_next: "Next",

        // Common Words
        common_accounts: "Accounts",
        common_concepts: "Categories",
        common_recurrent: "Recurrent",
        common_account: "Account",
        common_concept: "Category",
        common_save: "Save",
        common_back: "Back",
        common_finish: "Finish",
        common_import_replace: "Import and Replace",
        common_importing: "Importing...",
        common_importing_desc: "We are saving your data. Please do not close this window.",
        common_irreversible: "Warning:",
        common_irreversible_desc: "This action is irreversible.",
        
        // JSON Wizard
        json_wizard_title: "JSON Import Wizard",
        json_wizard_step1_title: "Step 1: Select your backup",
        json_wizard_step1_desc: "Drag and drop the <code>.json</code> file or click to select it. Importing will replace <strong>all</strong> of your current data.",
        json_wizard_dropzone: "Drag your file here or click",
        json_wizard_step2_title: "Step 2: Review and confirm",
        json_wizard_step2_desc: "We have analyzed your file. If the data is correct, press 'Import' to replace your current data.",
        import_complete_title: "Import Complete!",

        // Customize Panel
        customize_panel_title: "Customize Dashboard",
        customize_panel_desc: "Enable, disable, and reorder the elements you want to see on your dashboard.",
        customize_panel_save: "Save Changes",
        
        help_title: "The Ultimate User Guide",
        help_content: `
            <div style="text-align: center; margin-bottom: var(--sp-4);">
                <span class="material-icons" style="font-size: 48px; color: var(--c-primary);">school</span>
                <h3>Welcome to Your Financial Command Center!</h3>
            </div>
            <p>Hello! Get ready to take control of your money like never before. This guide is designed to make you an expert on your own finances by explaining every corner of the app in a clear and engaging way. Let's dive in!</p>
            
            <h3 style="border-top: 1px solid var(--c-outline); padding-top: var(--sp-3); margin-top: var(--sp-4);"><span class="material-icons" style="font-size: 1.2em; vertical-align: bottom; margin-right: 8px;">explore</span>A Tour of the New Interface</h3>
            <p>We've organized the app into four main tabs to make everything more intuitive. Think of them as the departments of your personal financial company:</p>
            
            <details class="accordion" style="margin-bottom: var(--sp-2);" open>
                <summary><span class="material-icons" style="margin-right:8px">home</span><strong>1. Home: Your Daily Operations Center</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>This is where you'll spend most of your time. It's the pulse of your daily financial activity. You have two great views:</p>
                    <ul>
                        <li><strong>"Recents" View:</strong> Like your social media feed, but for your money. Instantly see your latest expenses, income, and transfers. Perfect for knowing what happened today or yesterday.</li>
                        <li><strong>"Summary" View:</strong> Want to know how the month is going? Switch to this view for a high-level analysis with:
                            <ul>
                                <li><strong>KPIs (Key Performance Indicators):</strong> Your income, expenses, and most importantly, the <strong>net balance</strong>. It even tells you if you're doing better or worse than last month!</li>
                                <li><strong>Charts by Category:</strong> A visual and super easy-to-understand breakdown of where your money is going (food, leisure, bills...) and where it's coming from.</li>
                            </ul>
                        </li>
                    </ul>
                    <p><strong>Practical example:</strong> You've just started the month. You use the "Recents" view to log your grocery shopping. Mid-month, you switch to "Summary" to see if you're overspending on "Restaurants" and adjust your plans for the coming weeks.</p>
                </div>
            </details>
                            
            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary><span class="material-icons" style="margin-right:8px">account_balance</span><strong>2. Wealth: Your Financial Snapshot</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>This section is your "wealth snapshot." It shows you everything you have and where you have it, giving you a clear view of your overall financial health.</p>
                    <ul>
                        <li><strong>Net Worth:</strong> The most important number, right at the top. It tells you the total value of your assets.</li>
                        <li><strong>Account List:</strong> Here you'll see all your accounts (banks, cash, cards...) grouped by type. You can use the filters to, for example, only see the money you have in banks.</li>
                        <li><strong>Investment Portfolio:</strong> A premium section for your investment assets. It not only tells you their value but also how they are performing.</li>
                    </ul>
                    <p><strong>Practical example:</strong> You want to know how much "liquid" money you have available. You go to Wealth, filter to see only "Bank" and "Cash," and the "Net Worth" number gives you the answer instantly.</p>
                </div>
            </details>
            
            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary><span class="material-icons" style="margin-right:8px">analytics</span><strong>3. Analysis: The Strategist's Lab</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>This is where you put on your strategist hat. You look at the past to make better decisions for the future.</p>
                    <ul>
                        <li><strong>Budgets:</strong> Your battle plan! Define how much you want to spend (or earn) in each category for the year. The app will show you with progress bars whether you're sticking to the plan or need to tighten your belt.</li>
                        <li><strong>Custom Reports:</strong> You're the detective of your finances. Want to know how much you spent on gas last quarter using only a specific credit card? Here you can generate that report with charts and all.</li>
                    </ul>
                    <p><strong>Practical example:</strong> You create a budget of €200/month for "Leisure." At the end of the month, in the Budgets section, you see you've spent €250. The progress bar will be red, alerting you that you've gone over by 25%.</p>
                </div>
            </details>

            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary><span class="material-icons" style="margin-right:8px">settings</span><strong>4. Settings: The Engine Room</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);"><p>The control center. Here you customize the app (try the color themes!), manage your base data (create/edit Accounts and Categories), and, very importantly, make your backups.</p></div>
            </details>

            <h3 style="border-top: 1px solid var(--c-outline); padding-top: var(--sp-3); margin-top: var(--sp-4);"><span class="material-icons" style="font-size: 1.2em; vertical-align: bottom; margin-right: 8px;">stars</span>Star Features You Should Know</h3>

            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary>🚀 <strong>Dual Ledger (A/B): Your Secret Superpower</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);"><p>The <strong>[A]/[B]</strong> button in the top-left corner is magic. It lets you maintain two completely separate ledgers. It's like having two apps in one.</p>
                <p><strong>Example use case:</strong></p>
                <ul>
                    <li><strong>Ledger A (Personal):</strong> Manage your salary, daily expenses, savings... your life.</li>
                    <li><strong>Ledger B (Project):</strong> Manage the income and expenses of a small business, a homeowners' association, or the planning of a group trip. Everything separate and organized!</li>
                </ul>
                </div>
            </details>

            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary>🔍 <strong>Global Search (Shortcut: Ctrl/Cmd + K)</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);"><p>Don't remember where you recorded Saturday's dinner? Press the magnifying glass icon (or the keyboard shortcut) and type "dinner." The search will instantly show you that transaction, the related account, and the category. It's the fastest way to find anything!</p></div>
            </details>

            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary>📈 <strong>PRO Investment Tracking</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>This takes your finances to the next level. In <strong>Settings > Data Management > Accounts</strong>, you can mark an account as an "investment." By doing so, the app will start calculating professional metrics for it in the Wealth tab:</p>
                    <ul>
                        <li><strong>P&L (Profit & Loss):</strong> Tells you exactly how much money you've gained or lost, both in euros and as a percentage.</li>
                        <li><strong>IRR (Internal Rate of Return):</strong> The ultimate indicator. It tells you the real <strong>annualized</strong> return of your investment, considering not only the final value but also when and how much money you've put in or taken out.</li>
                    </ul>
                </div>
            </details>
            
            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary>🔄 <strong>Smart CSV Import</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>Coming from another app or have your data in a spreadsheet? No problem! Go to <strong>Settings > Backup & Restore > Import CSV</strong>. You just need a file with 5 columns:</p>
                    <code>DATE;ACCOUNT;CATEGORY;AMOUNT;DESCRIPTION</code>
                    <p>The app is very smart and will work its magic for you:</p>
                    <ul>
                        <li>If an account or category doesn't exist, it creates it automatically!</li>
                        <li><strong>PRO Tip:</strong> If you put <code>TRANSFER</code> in the CATEGORY column, the app will look for a transaction with the same date and opposite amount in another account and match them as a transfer.</li>
                        <li><strong>PRO Tip 2:</strong> Use the CATEGORY <code>INITIAL</code> to set the starting balance of an account. For example: "01/01/2025;My Bank;INITIAL;1500;Initial balance for the year".</li>
                    </ul>
                </div>
            </details>

            <p style="text-align: center; margin-top: var(--sp-5); font-style: italic; color: var(--c-on-surface-secondary);">Explore, record, and take ultimate control of your financial future!</p>
        `,
    },
    
    // FRENCH
    fr: {
        // Nav & Titles
        nav_home: "Accueil",
        nav_wealth: "Patrimoine",
        nav_analysis: "Analyse",
        nav_settings: "Réglages",
        title_home: "Accueil",
        title_wealth: "Patrimoine",
        title_analysis: "Analyse",
        title_settings: "Réglages",
        title_history: "Historique des Transactions",

        // Login
        login_welcome: "Bon Retour",
        login_tagline: "Connectez-vous pour prendre le contrôle de vos finances.",
        login_email_placeholder: "Adresse e-mail",
        login_password_placeholder: "Mot de passe",
        login_forgot_password: "Mot de passe oublié ?",
        login_button: "Se Connecter",
        login_no_account: "Pas de compte ?",
        login_register_link: "Inscrivez-vous ici",
        
        // Settings
        settings_account_and_prefs: "Compte et Préférences",
        settings_user_account: "Compte Utilisateur",
        settings_logged_in_as: "Connecté en tant que :",
        settings_logout: "Se Déconnecter",
        settings_delete_account: "Supprimer Mon Compte Définitivement",
        settings_appearance: "Apparence",
        settings_language: "Langue",
        settings_theme_selector: "Sélecteur de Thème",
        settings_general: "Réglages Généraux",
        settings_startup_options: "Options de Démarrage",
        settings_skip_intro: "Passer l'intro et la citation au démarrage",
        settings_save_config: "Enregistrer les Réglages",
        settings_data_management: "Gestion des Données",
        settings_recalculate_balances: "Recalculer les Soldes des Comptes",
        settings_backup: "Sauvegarde",
        settings_backup_warning: "L'importation d'un fichier JSON ou CSV remplacera toutes vos données actuelles. Il est recommandé d'exporter d'abord pour avoir une sauvegarde.",
        settings_export_json: "Exporter JSON",
        settings_import_json: "Importer JSON",
        settings_import_csv: "Importer CSV",
        settings_delete_all_data: "Supprimer Toutes les Données",

        // Tooltips
        tooltip_toggle_ledger: "Basculer entre la comptabilité Personnelle (A) et Secondaire (B)",
        tooltip_add_movement: "Ajouter une Transaction",
        tooltip_close: "Fermer",
        tooltip_manage_concepts: "Gérer les Catégories",
        tooltip_manage_accounts: "Gérer les Comptes",
        tooltip_save_movement: "Enregistrer la Transaction",
        tooltip_delete: "Supprimer",
        tooltip_duplicate: "Dupliquer",
        tooltip_export_json: "Exporter une sauvegarde complète au format JSON.",
        tooltip_import_json: "Importer depuis un fichier de sauvegarde JSON.",
        
        // Forms & Modals
        form_type_movement: "Revenu/Dépense",
        form_type_transfer: "Virement",
        form_amount: "Montant (dépense en négatif)",
        form_amount_placeholder: "ex: -2,50",
        form_description: "Description",
        form_description_placeholder: "ex: Courses de la semaine",
        form_source_account: "Compte Source",
        form_destination_account: "Compte Destinataire",
        form_show_all_accounts: "Afficher les comptes des deux comptabilités (A et B)",
        form_schedule_recurrent: "Planifier comme récurrent ?",
        form_frequency: "Fréquence",
        form_next_execution: "Prochaine exécution",
        form_ends_on: "Se termine le (optionnel)",
        form_date: "Date",
        
        // Frequencies
        freq_daily: "Quotidienne",
        freq_weekly: "Hebdomadaire",
        freq_monthly: "Mensuelle",
        freq_yearly: "Annuelle",

        // Empty States
        empty_history_title: "Votre historique commence ici",
        empty_history_text: "Appuyez sur le bouton `+` pour ajouter votre premier revenu ou dépense.",
        budget_empty_title: "Définissez Votre Plan Financier",
        budget_empty_text: "Fixez des limites de dépenses et des objectifs de revenus pour prendre le contrôle de votre année. Commencez maintenant !",
        budget_empty_cta: "Créer des Budgets",

        // Search
        search_placeholder: "Rechercher dans toute l'application...",
        search_empty_title: "Trouvez tout",
        search_empty_text: "Recherchez des transactions, comptes ou catégories. <br>Raccourci : <strong>Cmd/Ctrl + K</strong>",

        // Tour
        tour_skip: "Passer",
        tour_previous: "Précédent",
        tour_next: "Suivant",

        // Common Words
        common_accounts: "Comptes",
        common_concepts: "Catégories",
        common_recurrent: "Récurrents",
        common_account: "Compte",
        common_concept: "Catégorie",
        common_save: "Enregistrer",
        common_back: "Retour",
        common_finish: "Terminer",
        common_import_replace: "Importer et Remplacer",
        common_importing: "Importation...",
        common_importing_desc: "Nous sauvegardons vos données. Veuillez ne pas fermer cette fenêtre.",
        common_irreversible: "Attention :",
        common_irreversible_desc: "Cette action est irréversible.",

        // JSON Wizard
        json_wizard_title: "Assistant d'Importation JSON",
        json_wizard_step1_title: "Étape 1 : Sélectionnez votre sauvegarde",
        json_wizard_step1_desc: "Glissez-déposez le fichier <code>.json</code> ou cliquez pour le sélectionner. L'importation remplacera <strong>toutes</strong> vos données actuelles.",
        json_wizard_dropzone: "Glissez votre fichier ici ou cliquez",
        json_wizard_step2_title: "Étape 2 : Vérifiez et confirmez",
        json_wizard_step2_desc: "Nous avons analysé votre fichier. Si les données sont correctes, appuyez sur 'Importer' pour remplacer vos données actuelles.",
        import_complete_title: "Importation Terminée !",
        
        // Customize Panel
        customize_panel_title: "Personnaliser le Tableau de Bord",
        customize_panel_desc: "Activez, désactivez et réorganisez les éléments que vous souhaitez voir sur votre tableau de bord.",
        customize_panel_save: "Enregistrer les Modifications",

        help_title: "Le Guide Utilisateur Ultime",
        help_content: `
            <div style="text-align: center; margin-bottom: var(--sp-4);">
                <span class="material-icons" style="font-size: 48px; color: var(--c-primary);">school</span>
                <h3>Bienvenue dans votre Centre de Commandement Financier !</h3>
            </div>
            <p>Bonjour ! Préparez-vous à prendre le contrôle de votre argent comme jamais auparavant. Ce guide est conçu pour faire de vous un expert de vos propres finances en expliquant chaque recoin de l'application de manière claire et engageante. C'est parti !</p>
            
            <h3 style="border-top: 1px solid var(--c-outline); padding-top: var(--sp-3); margin-top: var(--sp-4);"><span class="material-icons" style="font-size: 1.2em; vertical-align: bottom; margin-right: 8px;">explore</span>Un Tour de la Nouvelle Interface</h3>
            <p>Nous avons organisé l'application en quatre onglets principaux pour rendre tout plus intuitif. Considérez-les comme les départements de votre entreprise financière personnelle :</p>
            
            <details class="accordion" style="margin-bottom: var(--sp-2);" open>
                <summary><span class="material-icons" style="margin-right:8px">home</span><strong>1. Accueil : Votre Centre d'Opérations Quotidien</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>C'est ici que vous passerez le plus de temps. C'est le pouls de votre activité financière quotidienne. Vous disposez de deux vues géniales :</p>
                    <ul>
                        <li><strong>Vue "Récents" :</strong> Comme votre fil d'actualité sur les réseaux sociaux, mais pour votre argent. Voyez instantanément vos dernières dépenses, revenus et virements. Parfait pour savoir ce qui s'est passé aujourd'hui ou hier.</li>
                        <li><strong>Vue "Résumé" :</strong> Vous voulez savoir comment se passe le mois ? Passez à cette vue pour une analyse de haut niveau avec :
                            <ul>
                                <li><strong>KPIs (Indicateurs Clés de Performance) :</strong> Vos revenus, vos dépenses et, le plus important, le <strong>solde net</strong>. Il vous indique même si vous faites mieux ou moins bien que le mois dernier !</li>
                                <li><strong>Graphiques par Catégorie :</strong> Une répartition visuelle et super facile à comprendre de l'destination de votre argent (nourriture, loisirs, factures...) et de sa provenance.</li>
                            </ul>
                        </li>
                    </ul>
                    <p><strong>Exemple pratique :</strong> Vous venez de commencer le mois. Vous utilisez la vue "Récents" pour enregistrer vos courses. À la mi-mois, vous passez à "Résumé" pour voir si vous dépensez trop en "Restaurants" et ajuster vos plans pour les semaines à venir.</p>
                </div>
            </details>
                            
            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary><span class="material-icons" style="margin-right:8px">account_balance</span><strong>2. Patrimoine : Votre Cliché Financier</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>Cette section est votre "cliché de richesse". Elle vous montre tout ce que vous possédez et où vous le possédez, vous donnant une vision claire de votre santé financière globale.</p>
                    <ul>
                        <li><strong>Valeur Nette :</strong> Le chiffre le plus important, tout en haut. Il vous indique la valeur totale de vos actifs.</li>
                        <li><strong>Liste des Comptes :</strong> Ici, vous verrez tous vos comptes (banques, espèces, cartes...) regroupés par type. Vous pouvez utiliser les filtres pour, par exemple, ne voir que l'argent que vous avez en banque.</li>
                        <li><strong>Portefeuille d'Investissement :</strong> Une section premium pour vos actifs d'investissement. Elle vous indique non seulement leur valeur, mais aussi leur performance.</li>
                    </ul>
                    <p><strong>Exemple pratique :</strong> Vous voulez savoir combien d'argent "liquide" vous avez de disponible. Vous allez dans Patrimoine, filtrez pour ne voir que "Banque" et "Espèces", et le chiffre de la "Valeur Nette" vous donne la réponse instantanément.</p>
                </div>
            </details>
            
            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary><span class="material-icons" style="margin-right:8px">analytics</span><strong>3. Analyse : Le Laboratoire du Stratège</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>C'est ici que vous mettez votre casquette de stratège. Vous regardez le passé pour prendre de meilleures décisions pour l'avenir.</p>
                    <ul>
                        <li><strong>Budgets :</strong> Votre plan de bataille ! Définissez combien vous voulez dépenser (ou gagner) dans chaque catégorie pour l'année. L'application vous montrera avec des barres de progression si vous respectez le plan ou si vous devez vous serrer la ceinture.</li>
                        <li><strong>Rapports Personnalisés :</strong> Vous êtes le détective de vos finances. Vous voulez savoir combien vous avez dépensé en essence le trimestre dernier en utilisant uniquement une carte de crédit spécifique ? Ici, vous pouvez générer ce rapport avec des graphiques et tout.</li>
                    </ul>
                    <p><strong>Exemple pratique :</strong> Vous créez un budget de 200€/mois pour les "Loisirs". À la fin du mois, dans la section Budgets, vous voyez que vous avez dépensé 250€. La barre de progression sera rouge, vous avertissant que vous avez dépassé de 25%.</p>
                </div>
            </details>

            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary><span class="material-icons" style="margin-right:8px">settings</span><strong>4. Réglages : La Salle des Machines</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);"><p>Le centre de contrôle. Ici, vous personnalisez l'application (essayez les thèmes de couleurs !), gérez vos données de base (créer/modifier des Comptes et Catégories), et, très important, faites vos sauvegardes.</p></div>
            </details>

            <h3 style="border-top: 1px solid var(--c-outline); padding-top: var(--sp-3); margin-top: var(--sp-4);"><span class="material-icons" style="font-size: 1.2em; vertical-align: bottom; margin-right: 8px;">stars</span>Fonctionnalités Clés à Connaître</h3>

            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary>🚀 <strong>Comptabilité Double (A/B) : Votre Super-pouvoir Secret</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);"><p>Le bouton <strong>[A]/[B]</strong> dans le coin supérieur gauche est magique. Il vous permet de tenir deux comptabilités complètement séparées. C'est comme avoir deux applications en une.</p>
                <p><strong>Exemple d'utilisation :</strong></p>
                <ul>
                    <li><strong>Comptabilité A (Personnelle) :</strong> Gérez votre salaire, vos dépenses quotidiennes, votre épargne... votre vie.</li>
                    <li><strong>Comptabilité B (Projet) :</strong> Gérez les revenus et les dépenses d'une petite entreprise, d'une association de propriétaires, ou l'organisation d'un voyage de groupe. Tout est séparé et organisé !</li>
                </ul>
                </div>
            </details>

            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary>🔍 <strong>Recherche Globale (Raccourci : Ctrl/Cmd + K)</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);"><p>Vous ne vous souvenez plus où vous avez noté le dîner de samedi ? Appuyez sur l'icône de la loupe (ou le raccourci clavier) et tapez "dîner". La recherche vous montrera instantanément cette transaction, le compte associé et la catégorie. C'est le moyen le plus rapide de trouver n'importe quoi !</p></div>
            </details>

            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary>📈 <strong>Suivi PRO des Investissements</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>Cela amène vos finances au niveau supérieur. Dans <strong>Réglages > Gestion des Données > Comptes</strong>, vous pouvez marquer un compte comme "investissement". Ce faisant, l'application commencera à calculer des métriques professionnelles pour celui-ci dans l'onglet Patrimoine :</p>
                    <ul>
                        <li><strong>P&L (Profits et Pertes) :</strong> Vous indique exactly combien d'argent vous avez gagné ou perdu, en euros et en pourcentage.</li>
                        <li><strong>TRI (Taux de Rentabilité Interne) :</strong> L'indicateur ultime. Il vous indique le rendement <strong>annualisé</strong> réel de votre investissement, en tenant compte non seulement de la valeur finale, mais aussi du moment et du montant des entrées et sorties de capitaux.</li>
                    </ul>
                </div>
            </details>
            
            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary>🔄 <strong>Importation Intelligente depuis CSV</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>Vous venez d'une autre application ou vous avez vos données dans une feuille de calcul ? Pas de problème ! Allez dans <strong>Réglages > Sauvegarde > Importer CSV</strong>. Vous avez juste besoin d'un fichier avec 5 colonnes :</p>
                    <code>DATE;COMPTE;CATÉGORIE;MONTANT;DESCRIPTION</code>
                    <p>L'application est très intelligente et fera de la magie pour vous :</p>
                    <ul>
                        <li>Si un compte ou une catégorie n'existe pas, elle le crée automatiquement !</li>
                        <li><strong>Astuce PRO :</strong> Si vous mettez <code>VIREMENT</code> dans la colonne CATÉGORIE, l'application recherchera une transaction avec la même date et un montant opposé dans un autre compte et les associera comme un virement.</li>
                        <li><strong>Astuce PRO 2 :</strong> Utilisez la CATÉGORIE <code>INITIAL</code> pour définir le solde de départ d'un compte. Par exemple : "01/01/2025;Ma Banque;INITIAL;1500;Solde initial de l'année".</li>
                    </ul>
                </div>
            </details>

            <p style="text-align: center; margin-top: var(--sp-5); font-style: italic; color: var(--c-on-surface-secondary);">Explorez, enregistrez et prenez le contrôle ultime de votre avenir financier !</p>
        `,
    },

    // SPANISH (DEFAULT)
    es: {
            // Nav & Titles
        nav_home: "Inicio",
        nav_wealth: "Patrimonio",
        nav_analysis: "Análisis",
        nav_settings: "Ajustes",
        title_home: "Inicio",
        title_wealth: "Patrimonio",
        title_analysis: "Análisis",
        title_settings: "Ajustes",
        title_history: "Historial de Movimientos",

        // Login
        login_welcome: "Bienvenido de nuevo",
        login_tagline: "Inicia sesión para controlar tus finanzas.",
        login_email_placeholder: "Correo electrónico",
        login_password_placeholder: "Contraseña",
        login_forgot_password: "¿Olvidaste tu contraseña?",
        login_button: "Iniciar Sesión",
        login_no_account: "¿No tienes una cuenta?",
        login_register_link: "Regístrate aquí",
        
        // Settings
        settings_account_and_prefs: "Cuenta y Preferencias",
        settings_user_account: "Cuenta de Usuario",
        settings_logged_in_as: "Sesión iniciada como:",
        settings_logout: "Cerrar Sesión",
        settings_delete_account: "Eliminar Mi Cuenta Permanentemente",
        settings_appearance: "Apariencia",
        settings_language: "Idioma",
        settings_theme_selector: "Selector de Tema",
        settings_general: "Configuración General",
        settings_startup_options: "Opciones de Arranque",
        settings_skip_intro: "Omitir intro y cita al iniciar la app",
        settings_save_config: "Guardar Configuración",
        settings_data_management: "Gestión de Datos",
        settings_recalculate_balances: "Recalcular Saldos de Cuentas",
        settings_backup: "Copia de Seguridad",
        settings_backup_warning: "La importación de JSON o CSV reemplazará todos los datos actuales. Se recomienda exportar primero para tener una copia de seguridad.",
        settings_export_json: "Exportar JSON",
        settings_import_json: "Importar JSON",
        settings_import_csv: "Importar CSV",
        settings_delete_all_data: "Borrar Todos los Datos",

        // Tooltips
        tooltip_toggle_ledger: "Cambiar entre contabilidad Personal (A) y Secundaria (B)",
        tooltip_add_movement: "Añadir Movimiento",
        tooltip_close: "Cerrar",
        tooltip_manage_concepts: "Gestionar Conceptos",
        tooltip_manage_accounts: "Gestionar Cuentas",
        tooltip_save_movement: "Guardar Movimiento",
        tooltip_delete: "Borrar",
        tooltip_duplicate: "Duplicar",
        tooltip_export_json: "Exportar una copia de seguridad completa en formato JSON.",
        tooltip_import_json: "Importar desde un archivo de seguridad JSON.",
        
        // Forms & Modals
        form_type_movement: "Ingreso/Gasto",
        form_type_transfer: "Traspaso",
        form_amount: "Cantidad (gasto en negativo)",
        form_amount_placeholder: "Ej: -2,50",
        form_description: "Descripción",
        form_description_placeholder: "Ej: Compra semanal",
        form_source_account: "Cuenta Origen",
        form_destination_account: "Cuenta Destino",
        form_show_all_accounts: "Mostrar cuentas de ambas contabilidades (A y B)",
        form_schedule_recurrent: "¿Programar como recurrente?",
        form_frequency: "Frecuencia",
        form_next_execution: "Próxima ejecución",
        form_ends_on: "Finaliza el (opcional)",
        form_date: "Fecha",
        
        // Frequencies
        freq_daily: "Diaria",
        freq_weekly: "Semanal",
        freq_monthly: "Mensual",
        freq_yearly: "Anual",

        // Empty States
        empty_history_title: "Tu historial empieza aquí",
        empty_history_text: "Pulsa el botón `+` para añadir tu primer ingreso o gasto.",
        budget_empty_title: "Define tu Plan Financiero",
        budget_empty_text: "Establece límites de gasto y metas de ingreso para tomar el control de tu año. ¡Empieza ahora!",
        budget_empty_cta: "Crear Presupuestos",

        // Search
        search_placeholder: "Buscar en toda la app...",
        search_empty_title: "Encuéntralo todo",
        search_empty_text: "Busca movimientos, cuentas o conceptos. <br>Atajo: <strong>Cmd/Ctrl + K</strong>",

        // Tour
        tour_skip: "Saltar",
        tour_previous: "Anterior",
        tour_next: "Siguiente",
        
        // Common Words
        common_accounts: "Cuentas",
        common_concepts: "Conceptos",
        common_recurrent: "Recurrentes",
        common_account: "Cuenta",
        common_concept: "Concepto",
        common_save: "Guardar",
        common_back: "Atrás",
        common_finish: "Finalizar",
        common_import_replace: "Importar y Reemplazar",
        common_importing: "Importando...",
        common_importing_desc: "Estamos guardando tus datos. Por favor, no cierres esta ventana.",
        common_irreversible: "Atención:",
        common_irreversible_desc: "Esta acción es irreversible.",

        // JSON Wizard
        json_wizard_title: "Asistente de Importación JSON",
        json_wizard_step1_title: "Paso 1: Selecciona tu copia de seguridad",
        json_wizard_step1_desc: "Arrastra y suelta el archivo <code>.json</code> o haz clic para seleccionarlo. La importación reemplazará <strong>todos</strong> tus datos actuales.",
        json_wizard_dropzone: "Arrastra tu archivo aquí o haz clic",
        json_wizard_step2_title: "Paso 2: Revisa y confirma",
        json_wizard_step2_desc: "Hemos analizado tu archivo. Si los datos son correctos, pulsa 'Importar' para reemplazar tus datos actuales.",
        import_complete_title: "¡Importación Completada!",

        // Customize Panel
        customize_panel_title: "Personalizar Panel",
        customize_panel_desc: "Activa, desactiva y reordena los elementos que quieres ver en tu panel de control.",
        customize_panel_save: "Guardar Cambios",

        help_title: "Guía de Usuario Definitiva",
        help_content: `
            <div style="text-align: center; margin-bottom: var(--sp-4);">
                <span class="material-icons" style="font-size: 48px; color: var(--c-primary);">school</span>
                <h3>¡Bienvenido a tu Centro de Mando Financiero!</h3>
            </div>
            <p>¡Hola! Prepárate para tomar el control de tu dinero como nunca antes. Esta guía está diseñada para convertirte en un experto de tus propias finanzas, explicando cada rincón de la aplicación de una forma clara y entretenida. ¡Vamos allá!</p>
            
            <h3 style="border-top: 1px solid var(--c-outline); padding-top: var(--sp-3); margin-top: var(--sp-4);"><span class="material-icons" style="font-size: 1.2em; vertical-align: bottom; margin-right: 8px;">explore</span>Un Paseo por la Nueva Interfaz</h3>
            <p>Hemos organizado la aplicación en cuatro pestañas principales para que todo sea más intuitivo. Piensa en ellas como los departamentos de tu empresa financiera personal:</p>
            
            <details class="accordion" style="margin-bottom: var(--sp-2);" open>
                <summary><span class="material-icons" style="margin-right:8px">home</span><strong>1. Inicio: Tu Centro de Operaciones Diario</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>Aquí es donde pasarás la mayor parte del tiempo. Es el pulso de tu actividad financiera diaria. Tienes dos vistas geniales:</p>
                    <ul>
                        <li><strong>Vista "Recientes":</strong> Como el feed de tus redes sociales, pero con tu dinero. Verás al instante tus últimos gastos, ingresos y traspasos. Es perfecta para saber qué ha pasado hoy o ayer.</li>
                        <li><strong>Vista "Resumen":</strong> ¿Quieres saber cómo va el mes? Cambia a esta vista y obtendrás un análisis de alto nivel con:
                            <ul>
                                <li><strong>KPIs (Indicadores Clave):</strong> Tus ingresos, gastos y, lo más importante, el <strong>saldo neto</strong>. ¡Incluso te dice si vas mejor o peor que el mes pasado!</li>
                                <li><strong>Gráficos por Concepto:</strong> Un desglose visual y súper fácil de entender sobre a dónde se va tu dinero (comida, ocio, facturas...) y de dónde viene.</li>
                            </ul>
                        </li>
                    </ul>
                    <p><strong>Ejemplo práctico:</strong> Acabas de empezar el mes. Usas la vista "Recientes" para registrar tu compra del súper. A mitad de mes, cambias a "Resumen" para ver si estás gastando más de la cuenta en "Restaurantes" y ajustar tus planes para las próximas semanas.</p>
                </div>
            </details>
                            
            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary><span class="material-icons" style="margin-right:8px">account_balance</span><strong>2. Patrimonio: Tu Fotografía Financiera</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>Esta sección es tu "foto de la riqueza". Te muestra todo lo que tienes y dónde lo tienes, dándote una visión clara de tu salud financiera global.</p>
                    <ul>
                        <li><strong>Patrimonio Neto:</strong> El número más importante, arriba del todo. Te dice el valor total de tus posesiones.</li>
                        <li><strong>Listado de Cuentas:</strong> Aquí verás todas tus cuentas (bancos, efectivo, tarjetas...) agrupadas por tipo. Puedes usar los filtros para, por ejemplo, ver solo el dinero que tienes en bancos.</li>
                        <li><strong>Cartera de Inversión:</strong> Un apartado de lujo para tus activos de inversión. No solo te dice cuánto valen, sino cómo están rindiendo.</li>
                    </ul>
                    <p><strong>Ejemplo práctico:</strong> Quieres saber cuánto dinero "líquido" tienes disponible. Vas a Patrimonio, filtras para ver solo "Banco" y "Efectivo", y el número de "Patrimonio Neto" te dará la respuesta al instante.</p>
                </div>
            </details>
            
            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary><span class="material-icons" style="margin-right:8px">analytics</span><strong>3. Análisis: El Laboratorio del Estratega</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>Aquí es donde te pones el sombrero de estratega. Miras al pasado para tomar mejores decisiones en el futuro.</p>
                    <ul>
                        <li><strong>Presupuestos:</strong> ¡Tu plan de batalla! Define cuánto quieres gastar (o ingresar) en cada categoría durante el año. La app te mostrará con barras de progreso si te estás ciñendo al plan o si necesitas apretarte el cinturón.</li>
                        <li><strong>Informes Personalizados:</strong> Eres el detective de tus finanzas. ¿Quieres saber cuánto gastaste en gasolina el trimestre pasado usando solo una tarjeta de crédito específica? Aquí puedes generar ese informe con gráficos y todo.</li>
                    </ul>
                    <p><strong>Ejemplo práctico:</strong> Creas un presupuesto de 200€ al mes para "Ocio". A final de mes, en la sección de Presupuestos, ves que has gastado 250€. La barra de progreso estará en rojo, avisándote de que te has pasado un 25%.</p>
                </div>
            </details>

            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary><span class="material-icons" style="margin-right:8px">settings</span><strong>4. Ajustes: La Sala de Máquinas</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);"><p>El centro de control. Aquí personalizas la app (¡prueba los temas de colores!), gestionas tus datos base (crear/editar Cuentas y Conceptos) y, muy importante, haces tus copias de seguridad.</p></div>
            </details>

            <h3 style="border-top: 1px solid var(--c-outline); padding-top: var(--sp-3); margin-top: var(--sp-4);"><span class="material-icons" style="font-size: 1.2em; vertical-align: bottom; margin-right: 8px;">stars</span>Funciones Estrella que Debes Conocer</h3>

            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary>🚀 <strong>Contabilidad Dual (A/B): Tu Superpoder Secreto</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);"><p>El botón <strong>[A]/[B]</strong> de la esquina superior izquierda es mágico. Te permite llevar dos contabilidades totalmente separadas. Es como tener dos aplicaciones en una.</p>
                <p><strong>Ejemplo de uso:</strong></p>
                <ul>
                    <li><strong>Contabilidad A (Personal):</strong> Gestionas tu nómina, tus gastos diarios, tus ahorros... tu vida.</li>
                    <li><strong>Contabilidad B (Proyecto):</strong> Gestionas los ingresos y gastos de un pequeño negocio, de las cuentas de la comunidad de vecinos, o de la organización de un viaje en grupo. ¡Todo separado y ordenado!</li>
                </ul>
                </div>
            </details>

            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary>🔍 <strong>Búsqueda Global (Atajo: Ctrl/Cmd + K)</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);"><p>¿No recuerdas dónde apuntaste la cena del sábado? Pulsa el icono de la lupa (o el atajo de teclado) y escribe "cena". La búsqueda te mostrará al instante ese movimiento, la cuenta relacionada y el concepto. ¡Es la forma más rápida de encontrar cualquier cosa!</p></div>
            </details>

            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary>📈 <strong>Seguimiento PRO de Inversiones</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>Esto lleva tus finanzas al siguiente nivel. En <strong>Ajustes > Gestión de Datos > Cuentas</strong>, puedes marcar una cuenta como "de inversión". Al hacerlo, la app empezará a calcular métricas profesionales para ella en la pestaña de Patrimonio:</p>
                    <ul>
                        <li><strong>P&L (Ganancias y Pérdidas):</strong> Te dice exactamente cuánto dinero has ganado o perdido, tanto en euros como en porcentaje.</li>
                        <li><strong>TIR (Tasa Interna de Retorno):</strong> El indicador definitivo. Te dice la rentabilidad <strong>anualizada</strong> real de tu inversión, teniendo en cuenta no solo el valor final, sino cuándo y cuánto dinero has ido metiendo o sacando.</li>
                    </ul>
                </div>
            </details>
            
            <details class="accordion" style="margin-bottom: var(--sp-2);">
                <summary>🔄 <strong>Importación Inteligente desde CSV</strong></summary>
                <div class="accordion__content" style="padding-top: var(--sp-2);">
                    <p>¿Vienes de otra app o tienes tus datos en una hoja de cálculo? ¡No hay problema! Ve a <strong>Ajustes > Copia de Seguridad > Importar CSV</strong>. Solo necesitas un archivo con 5 columnas:</p>
                    <code>FECHA;CUENTA;CONCEPTO;IMPORTE;DESCRIPCIÓN</code>
                    <p>La app es muy lista y hará magia por ti:</p>
                    <ul>
                        <li>Si una cuenta o concepto no existe, ¡lo crea automáticamente!</li>
                        <li><strong>Truco PRO:</strong> Si en la columna CONCEPTO pones <code>TRASPASO</code>, la app buscará un movimiento de la misma fecha e importe contrario en otra cuenta y los emparejará como una transferencia.</li>
                        <li><strong>Truco PRO 2:</strong> Usa el CONCEPTO <code>INICIAL</code> para establecer el saldo de partida de una cuenta. Por ejemplo: "01/01/2025;Mi Banco;INICIAL;1500;Saldo inicial del año".</li>
                    </ul>
                </div>
            </details>

            <p style="text-align: center; margin-top: var(--sp-5); font-style: italic; color: var(--c-on-surface-secondary);">¡Explora, registra y toma el control definitivo de tu futuro financiero!</p>
        `,
    }
};
let currentLanguage = localStorage.getItem('appLanguage') || 'es';
const locales = { es: 'es-ES', en: 'en-US', fr: 'fr-FR' };

const t = (key, replacements = {}) => {
    const lang = translations[currentLanguage] || translations.es;
    let text = lang[key] || translations.es[key] || `[${key}]`;

    for (const placeholder in replacements) {
        text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    }
    return text;
};

// ... (Resto de las constantes y variables globales como antes) ...

const PAGE_IDS = {
    INICIO: 'inicio-page',
    PATRIMONIO: 'patrimonio-page',
    ANALISIS: 'analisis-page',
    CONFIGURACION: 'configuracion-page',
    MOVIMIENTOS_FULL: 'movimientos-page-full',
};
const THEMES = {
    'default': { name: 'Amoled Futurista', icon: 'dark_mode' },
    'ocean': { name: 'Océano Profundo', icon: 'bedtime' },
    'magma': { name: 'Magma Oscuro', icon: 'local_fire_department' },
    'daylight': { name: 'Luz Diurna', icon: 'light_mode' },
    'quartz': { name: 'Cuarzo Claro', icon: 'wb_sunny' }
};
const quotesData = [ /* ... (el array de citas va aquí, sin cambios) ... */ ];
const firebaseConfig = { apiKey: "AIzaSyAp-t-2qmbvSX-QEBW9B1aAJHBESqnXy9M", authDomain: "cuentas-aidanai.firebaseapp.com", projectId: "cuentas-aidanai", storageBucket: "cuentas-aidanai.appspot.com", messagingSenderId: "58244686591", appId: "1:58244686591:web:85c87256c2287d350322ca" };
const AVAILABLE_WIDGETS = {
    'kpi-summary': { title: 'Resumen de KPIs', description: 'Ingresos, gastos y saldo neto del periodo.', icon: 'summarize' },
    'concept-totals': { title: 'Totales por Concepto', description: 'Gráfico y lista detallada de gastos/ingresos por concepto.', icon: 'bar_chart' }
};
const DEFAULT_DASHBOARD_WIDGETS = ['kpi-summary', 'concept-totals'];
const getInitialDb = () => ({
    cuentas: [], 
    conceptos: [], 
    movimientos: [], 
    presupuestos: [],
    recurrentes: [],
    inversiones_historial: [],
    inversion_cashflows: [],
    config: { 
        skipIntro: false,
        dashboardWidgets: DEFAULT_DASHBOARD_WIDGETS
    } 
});

let currentUser = null, unsubscribeListeners = [], db = getInitialDb(), deselectedAccountTypesFilter = new Set();
let intelligentIndex = new Map();
let syncState = 'synced';
let isOffBalanceMode = false;
let descriptionIndex = {};
let globalSearchDebounceTimer = null;
let newMovementIdToHighlight = null;
let unsubscribeRecientesListener = null
const originalButtonTexts = new Map();
let conceptosChart = null, liquidAssetsChart = null, detailInvestmentChart = null, informesChart = null;
let currentTourStep = 0;
let lastScrollTop = null;
let jsonWizardState = { file: null, data: null, preview: { counts: {}, meta: {} } };
const MOVEMENTS_PAGE_SIZE = 200;
let lastVisibleMovementDoc = null; 
let isLoadingMoreMovements = false; 
let allMovementsLoaded = false; 
let runningBalancesCache = null;
let recentMovementsCache = [];
const vList = {
    scrollerEl: null, sizerEl: null, contentEl: null, items: [], itemMap: [], 
    heights: {}, 
    renderBuffer: 10, lastRenderedRange: { start: -1, end: -1 }, isScrolling: null
};
const calculatorState = {
    displayValue: '0',
    waitingForNewValue: true,
    targetInput: null,
};
const onboardingState = {
    isActive: false,
    currentStep: 0,
    hasCreatedAccount: false
};
const onboardingSteps = [ /* ... (el array de pasos del onboarding va aquí, sin cambios) ... */ ];

// =================================================================================
// (Todas las funciones de ayuda como hashPin, updateSyncStatusIcon, saveDoc, etc., hasta navigateTo, se mantienen igual)
// ...
// =================================================================================

// =================================================================================
// 7. RENDERING ENGINE & MODIFICACIONES CLAVE
// =================================================================================

// **INICIO DE LA CORRECCIÓN**

const renderAnalisisPage = () => {
    const container = select(PAGE_IDS.ANALISIS);
    if (!container) return;

    // 1. Inyectar el HTML de la estructura de la página de Análisis
    container.innerHTML = `
        <!-- Bloque 1: Presupuestos-->
        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);">
                        <span class="material-icons">request_quote</span>
                        <span>Presupuestos</span>
                    </h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-4);">
                        <div class="form-group" style="flex-grow: 1; margin: 0;">
                            <label for="budget-year-selector" class="form-label" style="margin: 0;">Año del Presupuesto</label>
                            <select id="budget-year-selector" class="form-select"></select>
                        </div>
                        <button data-action="update-budgets" class="btn btn--secondary" style="margin-left: var(--sp-3);">
                            <span class="material-icons" style="font-size: 16px;">edit_calendar</span>
                            <span>Gestionar</span>
                        </button>
                    </div>
                    <div id="annual-budget-dashboard">
                        <div id="budget-kpi-container" class="kpi-grid"></div>
                        <div class="card" style="margin-top: var(--sp-4);">
                            <h3 class="card__title"><span class="material-icons">trending_up</span>Tendencia Ingresos y Gastos</h3>
                            <div class="card__content">
                                <div class="chart-container" style="height: 220px;"><canvas id="budget-trend-chart"></canvas></div>
                            </div>
                        </div>
                        <div id="budget-details-list" style="margin-top: var(--sp-4);"></div>
                    </div>
                    <div id="budget-init-placeholder" class="empty-state hidden">
                        <span class="material-icons">edit_calendar</span>
                        <h3 id="budget-placeholder-title" data-i18n="budget_empty_title">Define tu Plan Financiero</h3>
                        <p id="budget-placeholder-text" data-i18n="budget_empty_text">Establece límites de gasto y metas de ingreso para tomar el control de tu año. ¡Empieza ahora!</p>
                        <button data-action="update-budgets" class="btn btn--primary" style="margin-top: var(--sp-4);">
                            <span class="material-icons" style="font-size: 16px;">add_circle_outline</span>
                            <span data-i18n="budget_empty_cta">Crear Presupuestos</span>
                        </button>
                    </div>
                </div>
            </details>
        </div>

        <!-- Bloque 2: Portafolio-->
        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);">
                        <span class="material-icons">edit_note</span>
                        <span>Portafolio</span>
                    </h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" id="analisis-inversiones-container" style="padding: var(--sp-3) var(--sp-4);"></div>
            </details>
        </div>

        <!-- Bloque 3: Informes-->
        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);">
                        <span class="material-icons">assessment</span>
                        <span>Informes</span>
                    </h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                    <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
                        <div class="form-group">
                            <label for="informe-fecha-inicio" class="form-label">Desde</label>
                            <input type="date" id="informe-fecha-inicio" class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="informe-fecha-fin" class="form-label">Hasta</label>
                            <input type="date" id="informe-fecha-fin" class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="filter-cuenta-informe" class="form-label">Cuenta</label>
                            <select id="filter-cuenta-informe" class="form-select"></select>
                        </div>
                        <div class="form-group">
                            <label for="filter-concepto-informe" class="form-label">Concepto</label>
                            <select id="filter-concepto-informe" class="form-select"></select>
                        </div>
                    </div>
                    <button data-action="apply-informe-filters" class="btn btn--primary btn--full" style="margin-top: var(--sp-2);">Generar Informe</button>

                    <div id="informe-results-container" class="hidden" style="margin-top: var(--sp-4);">
                        <div id="informe-kpi-container" class="kpi-grid"></div>
                        <div class="chart-container" style="margin-top: var(--sp-4);"><canvas id="informes-chart"></canvas></div>
                    </div>
                    <div id="empty-informes" class="empty-state" style="border: none; background: transparent; padding-top: var(--sp-4);">
                        <span class="material-icons">query_stats</span>
                        <h3>Define tus parámetros</h3>
                        <p>Selecciona un rango de fechas para generar tu informe personalizado.</p>
                    </div>
                </div>
            </details>
        </div>
    `;
    
    // 2. Poblar los dropdowns AHORA que el HTML existe
    populateAllDropdowns();
    
    // 3. Renderizar el contenido dinámico de cada sección
    renderBudgetTracking();
    renderInversionesPage('analisis-inversiones-container');
    
    // 4. Añadir listener para el selector de año de presupuesto
    const budgetYearSelect = select('budget-year-selector');
    if (budgetYearSelect) {
        budgetYearSelect.addEventListener('change', renderBudgetTracking);
    }
};

const renderConfiguracionPage = () => {
    const container = select(PAGE_IDS.CONFIGURACION);
    if (!container) return;
    
    // 1. Inyectar el HTML de la estructura de la página de Ajustes
    container.innerHTML = `
        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);">
                        <span class="material-icons">person_outline</span>
                        <span data-i18n="settings_account_and_prefs">Cuenta y Preferencias</span>
                    </h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                    <h3 class="card__title" style="margin-top: 0; font-size: var(--fs-base); padding: 0;">
                        <span class="material-icons">account_circle</span>
                        <span data-i18n="settings_user_account">Cuenta de Usuario</span>
                    </h3>
                    <div class="modal__list-item" style="padding-left: 0; padding-right: 0; margin-top: var(--sp-2);">
                        <span data-i18n="settings_logged_in_as">Sesión iniciada como:</span>
                        <strong id="config-user-email">cargando...</strong>
                    </div>
                    <button data-action="logout" class="btn btn--danger btn--full" style="margin-top: var(--sp-4);">
                        <span class="material-icons" style="font-size: 16px;">logout</span>
                        <span data-i18n="settings_logout">Cerrar Sesión</span>
                    </button>
                    <button data-action="delete-account" class="btn btn--danger btn--full" style="margin-top: var(--sp-2); background-color: var(--c-black); border: 1px solid var(--c-danger);">
                        <span class="material-icons" style="font-size: 16px;">delete_forever</span>
                        <span data-i18n="settings_delete_account">Eliminar Mi Cuenta Permanentemente</span>
                    </button>
                </div>
            </details>
        </div>

        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
            <summary>
                <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);">
                    <span class="material-icons">security</span>
                    <span>Seguridad y Acceso</span>
                </h3>
                <span class="material-icons accordion__icon">expand_more</span>
            </summary>
                <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                <button id="setup-pin-btn" data-action="setup-pin" class="btn btn--secondary btn--full">
                    <span class="material-icons" style="font-size: 16px;">pin</span>
                    <span id="setup-pin-btn-text">Configurar PIN de Acceso</span>
                </button>
                <p class="form-label" style="margin-top: var(--sp-2); font-size: var(--fs-xs);">
                    Configura un PIN de 4 dígitos para acceder más rápido en este dispositivo.
                </p>
            </div>
        </details>
    </div>
        
        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);">
                        <span class="material-icons">language</span><span data-i18n="settings_language">Idioma</span>
                    </h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                    <h3 class="card__title" style="margin-top: 0; font-size: var(--fs-base); padding: 0;">
                        <span class="material-icons">translate</span><span data-i18n="settings_language">Idioma</span>
                    </h3>
                    <div id="language-selector" class="form-group" style="margin-top: var(--sp-3);"></div>
                </div>
            </details>
        </div>

        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);">
                        <span class="material-icons">palette</span><span data-i18n="settings_appearance">Apariencia</span>
                    </h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                    <h3 class="card__title" style="margin-top: 0; font-size: var(--fs-base); padding: 0;">
                        <span class="material-icons">color_lens</span><span data-i18n="settings_theme_selector">Selector de Tema</span>
                    </h3>
                    <div id="theme-selector" class="form-group" style="margin-top: var(--sp-3);"></div>
                </div>
            </details>
        </div>

        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);">
                        <span class="material-icons">badge</span><span data-i18n="settings_general">Configuración General</span>
                    </h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                    <h3 class="card__title" style="margin-top: var(--sp-5); font-size: var(--fs-base); padding: 0;">
                        <span class="material-icons">rocket_launch</span><span data-i18n="settings_startup_options">Opciones de Arranque</span>
                    </h3>
                    <div class="form-checkbox-group" style="margin-top: var(--sp-2);">
                        <input type="checkbox" id="config-skip-intro" />
                        <label for="config-skip-intro" data-i18n="settings_skip_intro">Omitir intro y cita al iniciar la app</label>
                    </div>
                    <button data-action="save-config" class="btn btn--primary btn--full" style="margin-top: var(--sp-4);" data-i18n="settings_save_config">Guardar Configuración</button>
                </div>
            </details>
        </div>

        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);">
                        <span class="material-icons">edit_note</span><span data-i18n="settings_data_management">Gestión de Datos</span>
                    </h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                    <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
                        <button data-action="manage-cuentas" class="btn btn--secondary"><span class="material-icons" style="font-size: 16px;">account_balance</span><span data-i18n="common_accounts">Cuentas</span></button>
                        <button data-action="manage-conceptos" class="btn btn--secondary"><span class="material-icons" style="font-size: 16px;">category</span><span data-i18n="common_concepts">Conceptos</span></button>
                        <button data-action="manage-recurrentes" class="btn btn--secondary"><span class="material-icons" style="font-size: 16px;">event_repeat</span><span data-i18n="common_recurrent">Recurrentes</span></button>
                        <button data-action="update-budgets" class="btn btn--secondary"><span class="material-icons" style="font-size: 16px;">edit_calendar</span><span>Presupuestos</span></button>
                    </div>
                    <button data-action="recalculate-balances" class="btn btn--primary btn--full" style="margin-top: var(--sp-4);">
                        <span class="material-icons" style="font-size: 16px;">calculate</span>
                        <span data-i18n="settings_recalculate_balances">Recalcular Saldos de Cuentas</span>
                    </button>
                </div>
            </details>
        </div>

        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);">
                        <span class="material-icons">backup</span><span data-i18n="settings_backup">Copia de Seguridad</span>
                    </h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                    <p style="font-size: var(--fs-sm); color: var(--c-on-surface-secondary); margin-bottom: var(--sp-4);" data-i18n="settings_backup_warning">La importación de JSON o CSV reemplazará todos los datos actuales. Se recomienda exportar primero para tener una copia de seguridad.</p>
                    <div class="form-grid">
                        <button data-action="export-data" class="btn btn--secondary" data-i18n-title="tooltip_export_json" title="Exportar una copia de seguridad completa en formato JSON."><span class="material-icons" style="font-size: 16px;">save</span><span data-i18n="settings_export_json">Exportar JSON</span></button>
                        <button data-action="export-csv" class="btn btn--secondary"><span class="material-icons" style="font-size: 16px;">grid_on</span>Exportar CSV</button>
                        <button data-action="import-data" class="btn btn--secondary" data-i18n-title="tooltip_import_json" title="Importar desde un archivo de seguridad JSON."><span class="material-icons" style="font-size: 16px;">file_upload</span><span data-i18n="settings_import_json">Importar JSON</span></button>
                        <button data-action="import-csv" class="btn btn--secondary"><span class="material-icons" style="font-size: 16px;">upload_file</span><span data-i18n="settings_import_csv">Importar CSV</span></button>
                    </div>
                    <input type="file" id="import-file-input" class="hidden" accept=".json,application/json" />
                    <button data-action="clear-data" class="btn btn--danger btn--full" style="margin-top: var(--sp-4);" data-i18n="settings_delete_all_data">Borrar Todos los Datos</button>
                </div>
            </details>
        </div>
    `;

    // 2. Llamar a la función `loadConfig` para poblar los datos
    loadConfig();
    
    // 3. Volver a aplicar traducciones para los nuevos elementos
    applyStaticTranslations();
};

const loadConfig = () => { 
    const skipIntroCheckbox = select('config-skip-intro');
    if (skipIntroCheckbox) {
        skipIntroCheckbox.checked = !!db.config?.skipIntro; 
    }
    
    const userEmailEl = select('config-user-email'); 
    if (userEmailEl && currentUser) {
        userEmailEl.textContent = currentUser.email;
    }
    
    const setupPinBtnText = select('setup-pin-btn-text');
    if(setupPinBtnText) {
        setupPinBtnText.textContent = localStorage.getItem('pinUserHash') ? 'Cambiar PIN de Acceso' : 'Configurar PIN de Acceso';
    }

    renderLanguageSelector();
    renderThemeSelector();
};

// ... (El resto del código, como `navigateTo` y otras funciones, sigue aquí)
// MODIFICACIÓN FINAL: Actualizar `navigateTo` para usar las nuevas funciones de renderizado

const navigateTo = (pageId, isInitial = false) => {
    if (!isInitial) hapticFeedback('light');
    
    const oldViewId = document.querySelector('.view--active')?.id;
    if (oldViewId === PAGE_IDS.PATRIMONIO && liquidAssetsChart) {
        liquidAssetsChart.destroy();
        liquidAssetsChart = null;
    }
    if (oldViewId === PAGE_IDS.INICIO && conceptosChart) {
        conceptosChart.destroy();
        conceptosChart = null;
    }
    if (oldViewId === PAGE_IDS.ANALISIS && informesChart) {
        informesChart.destroy();
        informesChart = null;
    }
    if (oldViewId === PAGE_IDS.INICIO && unsubscribeRecientesListener) {
        console.log("Saliendo de Inicio, desconectando el listener de recientes.");
        unsubscribeRecientesListener();
        unsubscribeRecientesListener = null;
    }

    const titleEl = select('top-bar-title'), actionsEl = select('top-bar-actions'), leftEl = select('top-bar-left-button'), fab = select('fab-add-movimiento');
    
    const standardActions = `
        <button data-action="global-search" class="icon-btn" data-i18n-title="search_placeholder" title="Búsqueda Global (Cmd/Ctrl+K)" aria-label="Búsqueda Global"><span class="material-icons">search</span></button>
        <button data-action="help" class="icon-btn" data-i18n-title="nav_help" title="Ayuda" aria-label="Ayuda"><span class="material-icons">help_outline</span></button> 
        <button data-action="exit" class="icon-btn" data-i18n-title="nav_exit" title="Salir" aria-label="Salir de la aplicación"><span class="material-icons">exit_to_app</span></button>`;
    
    const inicioActions = `
        <button data-action="configure-dashboard" class="icon-btn" data-i18n-title="customize_panel_title" title="Personalizar Panel" aria-label="Personalizar Panel"><span class="material-icons">tune</span></button>
        ${standardActions}`;
    
    if (pageId === PAGE_IDS.MOVIMIENTOS_FULL) {
        leftEl.innerHTML = `<button class="icon-btn" data-action="navigate" data-page="${PAGE_IDS.INICIO}" aria-label="Volver a Inicio"><span class="material-icons">arrow_back_ios</span></button>`;
    } else {
        leftEl.innerHTML = `<button id="ledger-toggle-btn" class="btn btn--secondary" data-action="toggle-ledger" data-i18n-title="tooltip_toggle_ledger" title="Cambiar Contabilidad">${isOffBalanceMode ? 'B' : 'A'}</button>`;
    }

    const pageRenderers = {
        [PAGE_IDS.INICIO]: { titleKey: 'title_home', render: renderInicioPage, actions: inicioActions },
        [PAGE_IDS.PATRIMONIO]: { titleKey: 'title_wealth', render: renderPatrimonioPage, actions: standardActions },
        [PAGE_IDS.ANALISIS]: { titleKey: 'title_analysis', render: renderAnalisisPage, actions: standardActions }, // CORREGIDO
        [PAGE_IDS.CONFIGURACION]: { titleKey: 'title_settings', render: renderConfiguracionPage, actions: standardActions }, // CORREGIDO
        [PAGE_IDS.MOVIMIENTOS_FULL]: { titleKey: 'title_history', render: loadInitialMovements, actions: standardActions },
    };
    
    if (pageRenderers[pageId]) {
        if (titleEl) { titleEl.textContent = t(pageRenderers[pageId].titleKey); }
        if (actionsEl) {
            actionsEl.innerHTML = pageRenderers[pageId].actions;
        }
        pageRenderers[pageId].render();
        applyStaticTranslations(); // Re-apply for new buttons and content
    }
    
    const mainScroller = selectOne('.app-layout__main'); if (mainScroller) mainScroller.scrollTop = 0;
    selectAll('.view').forEach(p => p.classList.remove('view--active'));
    select(pageId)?.classList.add('view--active');
    selectAll('.bottom-nav__item').forEach(b => b.classList.toggle('bottom-nav__item--active', b.dataset.page === pageId));
    
    fab?.classList.toggle('fab--visible', [PAGE_IDS.INICIO, PAGE_IDS.PATRIMONIO, PAGE_IDS.ANALISIS, PAGE_IDS.MOVIMIENTOS_FULL].includes(pageId));
};

// **FIN DE LA CORRECCIÓN**

// ... (El resto del código desde `setupTheme` hasta el final del archivo se mantiene exactamente igual que en la respuesta anterior)

const setupTheme = () => { 
const gridColor = 'rgba(255, 255, 255, 0.1)';
const textColor = '#FFFFFF';
Chart.defaults.color = textColor; 
Chart.defaults.borderColor = gridColor;
Chart.register(ChartDataLabels);
};
const buildIntelligentIndex = (movementsSource = db.movimientos) => {
    intelligentIndex.clear(); 
    if (!movementsSource || movementsSource.length === 0) return;

    const sortedMovements = [...movementsSource].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    for (const mov of sortedMovements) {
        if (mov.tipo === 'movimiento' && mov.descripcion) {
            const key = mov.descripcion.trim().toLowerCase();
            if (!intelligentIndex.has(key)) {
                intelligentIndex.set(key, {
                    conceptoId: mov.conceptoId,
                    cuentaId: mov.cuentaId
                });
            }
        }
    }
    console.log(`Índice inteligente actualizado con ${intelligentIndex.size} entradas.`);
};


const getVisibleAccounts = () => (db.cuentas || []).filter(c => !!c.offBalance === isOffBalanceMode);
const getLiquidAccounts = () => getVisibleAccounts().filter((c) => !['PROPIEDAD', 'PRÉSTAMO'].includes((c.tipo || '').trim().toUpperCase()));
const getAllSaldos = () => {
    const saldos = {};
    (db.cuentas || []).forEach(cuenta => {
        saldos[cuenta.id] = cuenta.saldo || 0;
    });
    return saldos;
};
async function fetchAllMovementsForBalances() {
    if (!currentUser) return [];
    const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection('movimientos').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
const fetchAllMovementsForSearch = async () => {
    if (!currentUser) return [];
    try {
        const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection('movimientos').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al obtener todos los movimientos para la búsqueda:", error);
        showToast("Error al realizar la búsqueda en la base de datos.", "danger");
        return []; 
    }
};
const getSaldos = async () => {
    const visibleAccounts = getVisibleAccounts();
    const saldos = {};
    visibleAccounts.forEach(cuenta => {
        saldos[cuenta.id] = cuenta.saldo || 0;
    });
    return saldos;
};

const getFilteredMovements = async (forComparison = false) => {
if (!currentUser) return { current: [], previous: [], label: '' };

const visibleAccountIds = getVisibleAccounts().map(c => c.id);
if (visibleAccountIds.length === 0) {
return { current: [], previous: [], label: '' };
}

const p = select('filter-periodo')?.value || 'mes-actual';
const cId = select('filter-cuenta')?.value;
const coId = select('filter-concepto')?.value;
let sDate, eDate, prevSDate, prevEDate, now = new Date();

switch (p) {
case 'mes-actual':
    sDate = new Date(now.getFullYear(), now.getMonth(), 1);
    eDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    prevSDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    prevEDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    break;
case 'año-actual':
    sDate = new Date(now.getFullYear(), 0, 1);
    eDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    prevSDate = new Date(now.getFullYear() - 1, 0, 1);
    prevEDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
    break;
case 'custom':
    sDate = select('filter-fecha-inicio')?.value ? parseDateStringAsUTC(select('filter-fecha-inicio').value) : null;
    eDate = select('filter-fecha-fin')?.value ? parseDateStringAsUTC(select('filter-fecha-fin').value) : null;
    
    if (eDate) {
        eDate.setUTCHours(23, 59, 59, 999);
    }
    prevSDate = null; prevEDate = null;
    break;
default: sDate = null; eDate = null; prevSDate = null; prevEDate = null; break;
}

const fetchMovements = async (startDate, endDate) => {
    if (!startDate || !endDate) return [];
    
    let baseQuery = fbDb.collection('users').doc(currentUser.uid).collection('movimientos')
        .where('fecha', '>=', startDate.toISOString())
        .where('fecha', '<=', endDate.toISOString());
    
    let movements = await fetchMovementsInChunks(baseQuery, 'cuentaId', cId ? [cId] : visibleAccountIds);

    if (coId) {
        movements = movements.filter(m => m.conceptoId === coId);
    }

    if(cId) {
        movements = movements.filter(m => {
            return m.cuentaId === cId || m.cuentaOrigenId === cId || m.cuentaDestinoId === cId;
        });
    }
    return movements;
};

const currentMovs = await fetchMovements(sDate, eDate);
if (!forComparison) return currentMovs;

const prevMovs = await fetchMovements(prevSDate, prevEDate);
const comparisonLabel = p === 'mes-actual' ? 'vs mes ant.' : (p === 'año-actual' ? 'vs año ant.' : '');
return { current: currentMovs, previous: prevMovs, label: comparisonLabel };
};
// ... y así sucesivamente hasta el final del archivo.
const calculateIRR = (cashflows) => {
    if (cashflows.length < 2) return 0;
    const sortedCashflows = [...cashflows].sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstDate = sortedCashflows[0].date;
    const npv = (rate) => { let total = 0; for (const flow of sortedCashflows) { const years = (flow.date.getTime() - firstDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000); total += flow.amount / Math.pow(1 + rate, years); } return total; };
    const derivative = (rate) => { let total = 0; for (const flow of sortedCashflows) { const years = (flow.date.getTime() - firstDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000); if (years > 0) { total -= years * flow.amount / Math.pow(1 + rate, years + 1); } } return total; };
    let guess = 0.1; const maxIterations = 100; const tolerance = 1e-7;
    for (let i = 0; i < maxIterations; i++) {
        const npvValue = npv(guess); const derivativeValue = derivative(guess); if (Math.abs(derivativeValue) < tolerance) break; const newGuess = guess - npvValue / derivativeValue; if (Math.abs(newGuess - guess) <= tolerance) { return newGuess; } guess = newGuess; }
    return 0;
};

const calculatePortfolioPerformance = async (cuentaId = null) => {
    const investmentAccounts = getVisibleAccounts().filter(c => c.esInversion && (cuentaId ? c.id === cuentaId : true));
    if (investmentAccounts.length === 0) { return { valorActual: 0, capitalInvertido: 0, pnlAbsoluto: 0, pnlPorcentual: 0, irr: 0 }; }
    const saldos = await getSaldos(); let totalValor = 0; let totalCapitalInvertido = 0; let allIrrCashflows = [];
    investmentAccounts.forEach(cuenta => {
        const capitalBase = saldos[cuenta.id] || 0; const cashflows = (db.inversion_cashflows || []).filter(cf => cf.cuentaId === cuenta.id); const netCashflow = cashflows.reduce((sum, cf) => sum + cf.cantidad, 0); const capitalInvertido = capitalBase + netCashflow;
        const valoraciones = (db.inversiones_historial || []).filter(v => v.cuentaId === cuenta.id).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()); 
        const valorActual = valoraciones.length > 0 ? valoraciones[0].valor : capitalInvertido;
        totalValor += valorActual; totalCapitalInvertido += capitalInvertido;
        const irrCashflows = []; if (capitalBase !== 0) { irrCashflows.push({ amount: -capitalBase, date: new Date(cuenta.fechaCreacion) }); } cashflows.forEach(cf => { irrCashflows.push({ amount: -cf.cantidad, date: new Date(cf.fecha) }); }); if (valorActual !== 0) { irrCashflows.push({ amount: valorActual, date: new Date() }); }
        allIrrCashflows.push(...irrCashflows);
    });
    const pnlAbsoluto = totalValor - totalCapitalInvertido; const pnlPorcentual = totalCapitalInvertido !== 0 ? (pnlAbsoluto / totalCapitalInvertido) * 100 : 0;
    if (cuentaId) {
        const cuentaUnica = investmentAccounts[0]; const capitalBase = saldos[cuentaUnica.id] || 0; const cashflows = (db.inversion_cashflows || []).filter(cf => cf.cuentaId === cuentaUnica.id); const netCashflow = cashflows.reduce((sum, cf) => sum + cf.cantidad, 0); const capitalInvertido = capitalBase + netCashflow; const valoraciones = (db.inversiones_historial || []).filter(v => v.cuentaId === cuentaUnica.id).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()); 
        const valorActual = valoraciones.length > 0 ? valoraciones[0].valor : capitalInvertido; 
        const pnlAbsolutoUnico = valorActual - capitalInvertido; const pnlPorcentualUnico = capitalInvertido !== 0 ? (pnlAbsolutoUnico / capitalInvertido) * 100: 0;
        const singleIrrCashflows = []; if (capitalBase !== 0) singleIrrCashflows.push({ amount: -capitalBase, date: new Date(cuentaUnica.fechaCreacion) }); cashflows.forEach(cf => singleIrrCashflows.push({ amount: -cf.cantidad, date: new Date(cf.fecha) })); if (valorActual !== 0) singleIrrCashflows.push({ amount: valorActual, date: new Date() }); const irrUnico = calculateIRR(singleIrrCashflows);
        return { valorActual: valorActual, capitalInvertido: capitalInvertido, pnlAbsoluto: pnlAbsolutoUnico, pnlPorcentual: pnlPorcentualUnico, irr: irrUnico };
    }
    const irrGlobal = calculateIRR(allIrrCashflows); return { valorActual: totalValor, capitalInvertido: totalCapitalInvertido, pnlAbsoluto, pnlPorcentual, irr: irrGlobal };
};

const processMovementsForRunningBalance = async (movements, forceRecalculate = false) => {
    if (!runningBalancesCache || forceRecalculate) {
        runningBalancesCache = getAllSaldos();
    }

    const sortedMovements = [...movements].sort((a, b) => {
        const dateComparison = new Date(b.fecha) - new Date(a.fecha);
        if (dateComparison !== 0) {
            return dateComparison;
        }
        return b.id.localeCompare(a.id);
    });

    for (const mov of sortedMovements) {
        if (mov.tipo === 'traspaso') {
            if (!runningBalancesCache.hasOwnProperty(mov.cuentaOrigenId)) {
                runningBalancesCache[mov.cuentaOrigenId] = 0;
            }
            if (!runningBalancesCache.hasOwnProperty(mov.cuentaDestinoId)) {
                runningBalancesCache[mov.cuentaDestinoId] = 0;
            }

            mov.runningBalanceOrigen = runningBalancesCache[mov.cuentaOrigenId];
            mov.runningBalanceDestino = runningBalancesCache[mov.cuentaDestinoId];

            runningBalancesCache[mov.cuentaOrigenId] += mov.cantidad;
            runningBalancesCache[mov.cuentaDestinoId] -= mov.cantidad;

        } else { 
            if (!runningBalancesCache.hasOwnProperty(mov.cuentaId)) {
                runningBalancesCache[mov.cuentaId] = 0;
            }

            mov.runningBalance = runningBalancesCache[mov.cuentaId];
            runningBalancesCache[mov.cuentaId] -= mov.cantidad;
        }
    }
};

const populateAllDropdowns = () => {
    const visibleAccounts = getVisibleAccounts();
    const populate = (id, data, nameKey, valKey='id', all=false, none=false) => {
        const el = select(id); if (!el) return; const currentVal = el.value;
        let opts = all ? '<option value="">Todos</option>' : ''; if (none) opts += '<option value="">Ninguno</option>';
        [...data].sort((a,b) => (a[nameKey]||"").localeCompare(b[nameKey]||"")).forEach(i => opts += `<option value="${i[valKey]}">${i[nameKey]}</option>`);
        el.innerHTML = opts; el.value = Array.from(el.options).some(o=>o.value===currentVal) ? currentVal : (el.options?.value || "");
    };
    populate('movimiento-cuenta', visibleAccounts, 'nombre', 'id', false, true);
    
    populateTraspasoDropdowns();
    
    populate('filter-cuenta', visibleAccounts, 'nombre', 'id', true); 
    populate('movimiento-concepto', db.conceptos, 'nombre', 'id', false, true); 
    populate('filter-concepto', db.conceptos, 'nombre', 'id', true);
    const budgetYearSelect = select('budget-year-selector'); if(budgetYearSelect) { const currentVal = budgetYearSelect.value; const currentYear = new Date().getFullYear(); let years = new Set([currentYear]); (db.presupuestos || []).forEach((p) => years.add(p.ano)); budgetYearSelect.innerHTML = [...years].sort((a,b) => b-a).map(y => `<option value="${y}">${y}</option>`).join(''); if(currentVal && [...years].some(y => y == parseInt(currentVal))) budgetYearSelect.value = currentVal; else budgetYearSelect.value = String(currentYear); }
    
    populate('filter-cuenta-informe', visibleAccounts, 'nombre', 'id', true);
    populate('filter-concepto-informe', db.conceptos, 'nombre', 'id', true);
};
const populateTraspasoDropdowns = () => {
            const showAll = select('traspaso-show-all-accounts-toggle')?.checked;
            const accountsToList = showAll ? (db.cuentas || []) : getVisibleAccounts();
            
            const populate = (id, data, none = false) => {
                const el = select(id); if (!el) return;
                const currentVal = el.value;
                let opts = none ? '<option value="">Ninguno</option>' : '';
                data.sort((a,b) => a.nombre.localeCompare(b.nombre)).forEach(i => opts += `<option value="${i.id}">${i.nombre}</option>`);
                el.innerHTML = opts;
                if (Array.from(el.options).some(o => o.value === currentVal)) {
                    el.value = currentVal;
                } else {
                    el.value = el.options?.value || "";
                }
            };

            populate('movimiento-cuenta-origen', accountsToList, true);
            populate('movimiento-cuenta-destino', accountsToList, true);
        };
        
               
        const handleUpdateBudgets = () => {
    hapticFeedback('light');

    const initialHtml = `
        <div class="form-group" style="margin-bottom: var(--sp-4);">
            <label for="budget-year-selector-modal" class="form-label">Selecciona el año para gestionar:</label>
            <select id="budget-year-selector-modal" class="form-select"></select>
        </div>
        <div id="budgets-form-container">
            <div class="empty-state" style="background:transparent; border:none; padding-top:0;">
                <p>Selecciona un año para empezar.</p>
            </div>
        </div>`;
    showGenericModal('Gestionar Presupuestos Anuales', initialHtml);

    const renderYearForm = (year) => {
        const container = select('budgets-form-container');
        if (!container) return;

        const budgetsForYear = (db.presupuestos || []).filter(p => p.ano === year);
        const conceptsWithBudget = new Set(budgetsForYear.map(b => b.conceptoId));

        let formHtml = `<form id="update-budgets-form" novalidate>
            <p class="form-label" style="margin-bottom: var(--sp-3)">
                Introduce el límite anual. Usa <b>valores positivos para metas de ingreso</b> y <b>valores negativos para límites de gasto</b>. Deja en blanco o en 0 si no quieres presupuestar un concepto.
            </p>
            <div style="max-height: 45vh; overflow-y: auto; padding-right: var(--sp-2);">`;

        db.conceptos
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
            .forEach(c => {
                const budget = budgetsForYear.find(b => b.conceptoId === c.id);
                const currentAmount = budget ? (budget.cantidad / 100).toFixed(2).replace('.', ',') : '';
                const placeholder = conceptsWithBudget.has(c.id) ? '' : '0,00';
                formHtml += `
                    <div class="form-group">
                        <label for="budget-input-${c.id}" class="form-label" style="font-weight: 600;">${c.nombre}</label>
                        <input type="text" id="budget-input-${c.id}" data-concept-id="${c.id}" class="form-input" inputmode="decimal" value="${currentAmount}" placeholder="${placeholder}">
                    </div>`;
            });
        
        formHtml += `</div><div class="modal__actions"><button type="submit" class="btn btn--primary btn--full">Guardar Cambios para ${year}</button></div></form>`;
        container.innerHTML = formHtml;
        
        select('update-budgets-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            setButtonLoading(btn, true, 'Guardando...');

            const inputs = e.target.querySelectorAll('input[data-concept-id]');
            const batch = fbDb.batch();

            for (const input of inputs) {
                const conceptoId = input.dataset.conceptId;
                const amountValue = parseCurrencyString(input.value);
                
                if (isNaN(amountValue)) continue;

                const newAmountInCents = Math.round(amountValue * 100);
                let budget = (db.presupuestos || []).find(b => b.ano === year && b.conceptoId === conceptoId);
                
                if (budget) {
                    const ref = fbDb.collection('users').doc(currentUser.uid).collection('presupuestos').doc(budget.id);
                    if (newAmountInCents !== 0) {
                        batch.update(ref, { cantidad: newAmountInCents });
                    } else {
                        batch.delete(ref);
                    }
                } else if (newAmountInCents !== 0) {
                    const newId = generateId();
                    const ref = fbDb.collection('users').doc(currentUser.uid).collection('presupuestos').doc(newId);
                    batch.set(ref, { id: newId, ano: year, conceptoId: conceptoId, cantidad: newAmountInCents });
                }
            }

            await batch.commit();
            setButtonLoading(btn, false);
            hideModal('generic-modal');
            hapticFeedback('success');
            showToast(`Presupuestos de ${year} actualizados.`);
            
            // ================== LÍNEA AÑADIDA PARA LA SOLUCIÓN ==================
            // Ahora, volvemos a renderizar la sección de presupuestos para reflejar los cambios.
            renderBudgetTracking(); 
            // ====================================================================

        });
    };

    setTimeout(() => {
        const yearSelect = select('budget-year-selector-modal');
        if (!yearSelect) return;
        
        const currentYear = new Date().getFullYear();
        let years = new Set([currentYear, currentYear + 1]);
        (db.presupuestos || []).forEach(p => years.add(p.ano));
        
        yearSelect.innerHTML = `<option value="">Seleccionar...</option>` + 
            [...years].sort((a, b) => b - a).map(y => `<option value="${y}">${y}</option>`).join('');
        
        yearSelect.addEventListener('change', (e) => {
            const selectedYear = parseInt(e.target.value, 10);
            if (selectedYear) {
                renderYearForm(selectedYear);
            } else {
                select('budgets-form-container').innerHTML = `<div class="empty-state" style="background:transparent; border:none; padding-top:0;"><p>Selecciona un año para empezar.</p></div>`;
            }
        });
    }, 0);
};
        
	   const renderBudgetTracking = async () => {
    const dashboardContainer = select('annual-budget-dashboard');
    const placeholder = select('budget-init-placeholder');
    const yearSelector = select('budget-year-selector');
    if (!dashboardContainer || !placeholder || !yearSelector) return;
    
    const year = parseInt(yearSelector.value, 10);
    
    // ================== CORRECCIÓN 1: FILTRAR CONCEPTOS "S/N" ==================
    // Nos aseguramos de que solo procesamos presupuestos cuyo concepto todavía existe.
    const allYearBudgets = (db.presupuestos || [])
        .filter(b => b.ano === year && db.conceptos.find(c => c.id === b.conceptoId));
    // ==========================================================================

    if (allYearBudgets.length === 0) {
        dashboardContainer.classList.add('hidden');
        placeholder.classList.remove('hidden');
        select('budget-placeholder-title').textContent = `Configurar Presupuestos ${year}`;
        select('budget-placeholder-text').textContent = `Aún no has definido metas de ingreso o límites de gasto para el año ${year}.`;
        return;
    }
    
    dashboardContainer.classList.remove('hidden');
    placeholder.classList.add('hidden');

    const { percentage: yearProgress, daysPassed, daysRemaining, totalDaysInYear } = getYearProgress();
    
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    let baseQuery = fbDb.collection('users').doc(currentUser.uid).collection('movimientos')
        .where('fecha', '>=', startDate.toISOString())
        .where('fecha', '<=', endDate.toISOString())
        .where('tipo', '==', 'movimiento');
    
    const visibleAccountIds = getVisibleAccounts().map(c => c.id);
    const movements = await fetchMovementsInChunks(baseQuery, 'cuentaId', visibleAccountIds);
    
    const monthlyIncomeData = {};
    const monthlyExpenseData = {};
    movements.forEach(mov => {
        const month = new Date(mov.fecha).getMonth();
        if (mov.cantidad > 0) {
            monthlyIncomeData[month] = (monthlyIncomeData[month] || 0) + mov.cantidad;
        } else {
            monthlyExpenseData[month] = (monthlyExpenseData[month] || 0) + Math.abs(mov.cantidad);
        }
    });

    // --- Procesamiento para GASTOS ---
    const expenseBudgets = allYearBudgets.filter(b => b.cantidad < 0);
    let totalBudgetedExpense = 0;
    const expenseDetails = expenseBudgets.map(budget => {
        const actualSpent = Math.abs(movements.filter(m => m.conceptoId === budget.conceptoId && m.cantidad < 0).reduce((sum, m) => sum + m.cantidad, 0));
        const budgetLimit = Math.abs(budget.cantidad);
        totalBudgetedExpense += budgetLimit;

        // ================== CORRECCIÓN 2 y 3: LÓGICA DE RITMO Y ESTADO (GASTOS) ==================
        const rawPacePercentage = (budgetLimit > 0 && yearProgress > 0) ? ((actualSpent / budgetLimit) / (yearProgress / 100)) * 100 : (actualSpent > 0 ? 200 : 100);
        const pacePercentage = Math.min(rawPacePercentage, 200); // Se capa a 200% para que el medidor no se salga de control

        let status;
        if (rawPacePercentage > 120) {
            status = { text: 'Excedido', icon: 'cancel', color: 'text-danger' };
        } else if (rawPacePercentage >= 80) {
            status = { text: 'Vas bien', icon: 'check_circle', color: 'text-info' };
        } else {
            status = { text: 'Ahorrando', icon: 'verified', color: 'text-positive' };
        }
        // ========================================================================================

        const projectedAnnualSpent = (daysPassed > 0) ? (actualSpent / daysPassed) * totalDaysInYear : 0;
        return { ...budget, actual: actualSpent, limit: budgetLimit, projected: projectedAnnualSpent, pacePercentage, status };
    });
    const totalProjectedExpense = expenseDetails.reduce((sum, b) => sum + b.projected, 0);

    // --- Procesamiento para INGRESOS ---
    const incomeBudgets = allYearBudgets.filter(b => b.cantidad >= 0);
    let totalBudgetedIncome = 0;
    const incomeDetails = incomeBudgets.map(budget => {
        const actualIncome = movements.filter(m => m.conceptoId === budget.conceptoId && m.cantidad > 0).reduce((sum, m) => sum + m.cantidad, 0);
        const budgetGoal = budget.cantidad;
        totalBudgetedIncome += budgetGoal;

        // ================== CORRECCIÓN 2 y 3: LÓGICA DE RITMO Y ESTADO (INGRESOS) ==================
        const rawPacePercentage = (budgetGoal > 0 && yearProgress > 0) ? ((actualIncome / budgetGoal) / (yearProgress / 100)) * 100 : (actualIncome > 0 ? 200 : 0);
        const pacePercentage = Math.min(rawPacePercentage, 200);

        let status;
        if (rawPacePercentage > 120) {
            status = { text: 'Superado', icon: 'rocket_launch', color: 'text-positive' };
        } else if (rawPacePercentage >= 80) {
            status = { text: 'Vas bien', icon: 'check_circle', color: 'text-info' };
        } else {
            status = { text: 'Por debajo del objetivo', icon: 'trending_down', color: 'text-warning' };
        }
        // ==========================================================================================

        const projectedAnnualIncome = (daysPassed > 0) ? (actualIncome / daysPassed) * totalDaysInYear : 0;
        return { ...budget, actual: actualIncome, limit: budgetGoal, projected: projectedAnnualIncome, pacePercentage, status };
    });
    const totalProjectedIncome = incomeDetails.reduce((sum, b) => sum + b.projected, 0);

    // --- KPIs y Gráfico (sin cambios) ---
    const projectedNet = totalProjectedIncome - totalProjectedExpense;
    const kpiContainer = select('budget-kpi-container');
    kpiContainer.innerHTML = `
        <div class="kpi-item"><h4 class="kpi-item__label">Proyección Ingresos</h4><strong class="kpi-item__value text-positive">${formatCurrency(totalProjectedIncome)}</strong></div>
        <div class="kpi-item"><h4 class="kpi-item__label">Proyección Gastos</h4><strong class="kpi-item__value text-negative">${formatCurrency(totalProjectedExpense)}</strong></div>
        <div class="kpi-item"><h4 class="kpi-item__label">Proyección Neta Anual</h4><strong class="kpi-item__value ${projectedNet >= 0 ? 'text-positive' : 'text-negative'}">${formatCurrency(projectedNet)}</strong></div>
    `;
    renderBudgetTrendChart(monthlyIncomeData, monthlyExpenseData, totalBudgetedExpense / 12);

    // --- Renderizado de Listas (actualizado para usar los nuevos datos) ---
    const listContainer = select('budget-details-list');
    let listHtml = '';

    if (incomeDetails.length > 0) {
        listHtml += `<h4 style="margin-top: var(--sp-5);">Metas de Ingresos</h4>`;
        listHtml += incomeDetails.sort((a, b) => (a.projected / (a.limit || 1)) - (b.projected / (b.limit || 1))).map(b => {
            const concepto = db.conceptos.find(c => c.id === b.conceptoId);
            return `
            <div class="card" style="margin-bottom: var(--sp-3);"><div class="card__content" style="padding: var(--sp-3);">
                <div style="display: grid; grid-template-columns: 80px 1fr; gap: var(--sp-4); align-items: center;">
                    <div style="position: relative; width: 80px; height: 55px;"><canvas id="gauge-chart-${b.id}"></canvas><div style="position: absolute; top: 65%; left: 50%; transform: translate(-50%, -50%); text-align: center; font-weight: 800; font-size: var(--fs-lg);">${b.pacePercentage.toFixed(0)}<span style="font-size: 0.7em;">%</span></div></div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--sp-2);"><h4 style="font-size: var(--fs-base); font-weight: 700;">${concepto?.nombre}</h4><span class="${b.status.color}" style="font-weight: 600; font-size: var(--fs-xs); display:flex; align-items:center; gap: 4px;"><span class="material-icons" style="font-size: 14px;">${b.status.icon}</span> ${b.status.text}</span></div>
                        <div style="font-size: var(--fs-sm);"><strong>Ingresado:</strong> ${formatCurrency(b.actual)} de ${formatCurrency(b.limit)}</div>
                        <div style="font-size: var(--fs-sm); font-weight: 600;"><strong>Proyección:</strong> <span class="${b.projected >= b.limit ? 'text-positive' : 'text-danger'}">${formatCurrency(b.projected)}</span></div>
                    </div>
                </div>
            </div></div>`;
        }).join('');
    }
    
    if (expenseDetails.length > 0) {
        listHtml += `<h4 style="margin-top: var(--sp-5);">Límites de Gasto</h4>`;
        listHtml += expenseDetails.sort((a, b) => (b.projected / (b.limit || 1)) - (a.projected / (a.limit || 1))).map(b => {
            const concepto = db.conceptos.find(c => c.id === b.conceptoId);
            return `
            <div class="card" style="margin-bottom: var(--sp-3);"><div class="card__content" style="padding: var(--sp-3);">
                <div style="display: grid; grid-template-columns: 80px 1fr; gap: var(--sp-4); align-items: center;">
                    <div style="position: relative; width: 80px; height: 55px;"><canvas id="gauge-chart-${b.id}"></canvas><div style="position: absolute; top: 65%; left: 50%; transform: translate(-50%, -50%); text-align: center; font-weight: 800; font-size: var(--fs-lg);">${b.pacePercentage.toFixed(0)}<span style="font-size: 0.7em;">%</span></div></div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--sp-2);"><h4 style="font-size: var(--fs-base); font-weight: 700;">${concepto?.nombre}</h4><span class="${b.status.color}" style="font-weight: 600; font-size: var(--fs-xs); display:flex; align-items:center; gap: 4px;"><span class="material-icons" style="font-size: 14px;">${b.status.icon}</span> ${b.status.text}</span></div>
                        <div style="font-size: var(--fs-sm);"><strong>Gastado:</strong> ${formatCurrency(b.actual)} de ${formatCurrency(b.limit)}</div>
                        <div style="font-size: var(--fs-sm); font-weight: 600;"><strong>Proyección:</strong> <span class="${b.projected > b.limit ? 'text-danger' : 'text-positive'}">${formatCurrency(b.projected)}</span></div>
                    </div>
                </div>
            </div></div>`;
        }).join('');
    }
    
    listContainer.innerHTML = listHtml;

    setTimeout(() => {
        [...incomeDetails, ...expenseDetails].forEach(b => {
            // Pasamos el nuevo pacePercentage al medidor visual
            renderGaugeChart(`gauge-chart-${b.id}`, b.pacePercentage, 100); // El segundo parámetro es el ritmo (100% es el objetivo)
        });
    }, 50);
};


        // =================================================================================
        // 7.5. INVESTMENT & REPORT PAGE RENDERING
        // =================================================================================
        const renderLanguageSelector = () => {
            const container = select('language-selector');
            if (!container) return;
            const languages = { es: 'Español 🇪🇸', en: 'English 🇬🇧', fr: 'Français 🇫🇷' };
            container.innerHTML = Object.entries(languages).map(([id, name]) => `
                <div class="form-checkbox-group">
                    <input type="radio" id="lang-${id}" name="language-option" value="${id}" ${currentLanguage === id ? 'checked' : ''}>
                    <label for="lang-${id}">${name}</label>
                </div>
            `).join('');
        };
        const renderThemeSelector = () => {
    const container = select('theme-selector');
    if (!container) return;

    const currentTheme = document.body.dataset.theme || 'default';
    
    container.innerHTML = Object.entries(THEMES).map(([id, theme]) => `
        <div class="form-checkbox-group">
            <input type="radio" id="theme-${id}" name="theme-option" value="${id}" ${currentTheme === id ? 'checked' : ''}>
            <label for="theme-${id}" style="display: flex; align-items: center; gap: var(--sp-2);">
                <span class="material-icons" style="font-size: 18px;">${theme.icon}</span>
                ${theme.name}
            </label>
        </div>
    `).join('');
};
		const renderInversionesPage = async (targetContainerId) => {
            const container = select(targetContainerId);
            if(!container) return;

            const investmentAccounts = getVisibleAccounts().filter((c) => c.esInversion);

            if (investmentAccounts.length === 0) {
                container.innerHTML = `<div id="empty-investments" class="empty-state" style="margin-top: var(--sp-4);">
                        <span class="material-icons">rocket_launch</span>
                        <h3>¿Listo para despegar?</h3>
                        <p>Para empezar, ve a 'Ajustes' > 'Gestión de Datos' > 'Cuentas' y marca tus cuentas de inversión.</p>
                    </div>`;
                return;
            }

            const globalPerformance = await calculatePortfolioPerformance(null);
            const pnlClassGlobal = globalPerformance.pnlAbsoluto >= 0 ? 'text-positive' : 'text-negative';
            const irrClassGlobal = globalPerformance.irr >= 0 ? 'text-positive' : 'text-negative';
            
            const assetCardsPromises = investmentAccounts.map(async (cuenta) => {
                const performance = await calculatePortfolioPerformance(cuenta.id);
                const pnlClass = performance.pnlAbsoluto >= 0 ? 'text-positive' : 'text-negative';
                const irrClass = performance.irr >= 0 ? 'text-positive' : 'text-negative';
                return `
                    <div class="investment-asset-card" data-action="view-investment-detail" data-id="${cuenta.id}">
                        <div class="investment-asset-card__header">
                            <div>
                                <h3 class="investment-asset-card__name">${cuenta.nombre}</h3>
                                <small style="color: var(--c-on-surface-secondary);">${cuenta.tipo}</small>
                            </div>
                            <div>
                                <div class="investment-asset-card__value">${formatCurrency(performance.valorActual)}</div>
                                <div class="investment-asset-card__pnl ${pnlClass}">${performance.pnlAbsoluto >= 0 ? '+' : ''}${formatCurrency(performance.pnlAbsoluto)} (${performance.pnlPorcentual.toFixed(2)}%)</div>
                                <div class="investment-asset-card__pnl ${irrClass}" style="font-weight: 600;">TIR: ${(performance.irr * 100).toFixed(2)}%</div>
                            </div>
                        </div>
                    </div>`;
            });
            const assetCardsHTML = (await Promise.all(assetCardsPromises)).join('');

            container.innerHTML = `
                <div id="investment-global-kpis">
                    <div class="kpi-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: var(--sp-3);">
                        <div class="kpi-item"><h4 class="kpi-item__label">Valor Total</h4><strong class="kpi-item__value">${formatCurrency(globalPerformance.valorActual)}</strong></div>
                        <div class="kpi-item"><h4 class="kpi-item__label">Capital Total</h4><strong class="kpi-item__value">${formatCurrency(globalPerformance.capitalInvertido)}</strong></div>
				</div>
                    <div class="kpi-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                        <div class="kpi-item"><h4 class="kpi-item__label">P&L (€)</h4><strong class="kpi-item__value ${pnlClassGlobal}">${globalPerformance.pnlAbsoluto >= 0 ? '+' : ''}${formatCurrency(globalPerformance.pnlAbsoluto)}</strong></div>
                        <div class="kpi-item"><h4 class="kpi-item__label">P&L (%)</h4><strong class="kpi-item__value ${pnlClassGlobal}">${globalPerformance.pnlPorcentual.toFixed(2)}%</strong></div>
                        <div class="kpi-item"><h4 class="kpi-item__label">TIR Anualizada</h4><strong class="kpi-item__value ${irrClassGlobal}">${(globalPerformance.irr * 100).toFixed(2)}%</strong></div>
                    </div>
                </div>
                 <div class="card card--no-bg" style="padding:0; margin-top: var(--sp-4);">
                     <div class="form-grid">
                        <button class="btn btn--secondary" data-action="manage-investment-accounts"><span class="material-icons" style="font-size:16px;">checklist</span>Gestionar Activos</button>
                        <button class="btn btn--secondary" data-action="add-aportacion"><span class="material-icons" style="font-size:16px;">add_card</span>Aportar/Retirar</button>
                    </div>
                </div>
                <div id="investment-assets-list">${assetCardsHTML}</div>
            `;
        };
        
        const renderInvestmentAccountDetail = async (cuentaId) => {
            const cuenta = getVisibleAccounts().find((c) => c.id === cuentaId);
            if (!cuenta) { renderPatrimonioPage(); return; }
            
            // Esta función ahora abre un modal en lugar de reemplazar la vista.
            let detailHTML = `<div id="investment-detail-content" style="padding-top: var(--sp-3);"></div>`;
            showGenericModal(cuenta.nombre, detailHTML);

            const detailContainer = select('investment-detail-content');
            
            if (detailInvestmentChart) detailInvestmentChart.destroy();
            
            const performance = await calculatePortfolioPerformance(cuentaId);
            const pnlClass = performance.pnlAbsoluto >= 0 ? 'text-positive' : 'text-negative';
            const irrClass = performance.irr >= 0 ? 'text-positive' : 'text-negative';
            
            const cashflows = (db.inversion_cashflows || []).filter((cf) => cf.cuentaId === cuentaId).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
            const valoraciones = (db.inversiones_historial || []).filter((v) => v.cuentaId === cuentaId).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        
            detailContainer.innerHTML = `
                <div class="kpi-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="kpi-item"><h4 class="kpi-item__label">Valor Actual</h4><strong class="kpi-item__value">${formatCurrency(performance.valorActual)}</strong></div>
                    <div class="kpi-item"><h4 class="kpi-item__label">Capital Invertido</h4><strong class="kpi-item__value">${formatCurrency(performance.capitalInvertido)}</strong></div>
                    <div class="kpi-item"><h4 class="kpi-item__label">P&L Absoluto</h4><strong class="kpi-item__value ${pnlClass}">${performance.pnlAbsoluto >= 0 ? '+' : ''}${formatCurrency(performance.pnlAbsoluto)}</strong></div>
                    <div class="kpi-item"><h4 class="kpi-item__label">TIR Anualizada</h4><strong class="kpi-item__value ${irrClass}">${(performance.irr * 100).toFixed(2)}%</strong></div>
                </div>
                <div class="card">
                    <h3 class="card__title"><span class="material-icons">show_chart</span>Evolución</h3>
                    <div class="card__content">
                        <div class="chart-container" style="height: 200px; margin-bottom: 0;"><canvas id="detail-investment-chart"></canvas></div>
                    </div>
                </div>
                <div class="card">
                    <h3 class="card__title"><span class="material-icons">history</span>Historial</h3>
                    <div class="card__content" id="investment-detail-timeline" style="padding-top: 0;"></div>
                </div>`;
        
            setTimeout(async () => {
                const ctx = (select('detail-investment-chart'))?.getContext('2d');
                if (ctx) {
                    const saldos = await getSaldos();
                    const capitalBase = saldos[cuentaId] || 0;
                    let runningCapital = capitalBase;
                    const capitalData = [{ x: new Date(cuenta.fechaCreacion || Date.now()).getTime(), y: capitalBase / 100 }];
                    cashflows.forEach((cf) => { runningCapital += cf.cantidad; capitalData.push({ x: new Date(cf.fecha).getTime(), y: runningCapital / 100 }); });
                    const valoracionData = valoraciones.map((v) => ({ x: new Date(v.fecha).getTime(), y: v.valor / 100 }));
                    detailInvestmentChart = new Chart(ctx, { type: 'line', data: { datasets: [ { label: 'Valor Activo', data: valoracionData, borderColor: 'var(--c-primary)', backgroundColor: 'rgba(0, 122, 255, 0.2)', tension: 0.1, fill: true }, { label: 'Capital Invertido', data: capitalData, borderColor: 'var(--c-info)', stepped: true, fill: false } ] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, datalabels: { display: false } }, scales: { x: { type: 'time', time: { unit: 'month' } }, y: { ticks: { callback: (value) => `€${value.toLocaleString(locales[currentLanguage])}` } } } } });
                }
            }, 50);
            
            const timelineContainer = select('investment-detail-timeline');
            const timelineItems = [ ...valoraciones.map((v) => ({...v, type: 'valoracion'})), ...cashflows.map((c) => ({...c, type: c.cantidad > 0 ? 'aportacion' : 'reembolso'})) ].sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            if (timelineContainer) {
                if (timelineItems.length === 0) {
                    timelineContainer.innerHTML = `<p style="text-align:center; padding: var(--sp-3) 0; color: var(--c-on-surface-secondary);">No hay historial para este activo.</p>`;
                } else {
                    timelineContainer.innerHTML = timelineItems.map((item) => {
                        let icon, text, amount, amountClass = '';
                        const date = new Date(item.fecha).toLocaleDateString(locales[currentLanguage], { day: '2-digit', month: 'short', year: 'numeric' });
                        switch (item.type) {
                            case 'valoracion': icon = 'check_circle_outline'; text = 'Valoración'; amount = formatCurrency((item).valor); amountClass = 'text-info'; break;
                            case 'aportacion': icon = 'add_circle_outline'; text = `Aportación ${(item).notas ? `(${(item).notas})` : ''}`; amount = `+${formatCurrency((item).cantidad)}`; amountClass = 'text-positive'; break;
                            case 'reembolso': icon = 'remove_circle_outline'; text = `Reembolso ${(item).notas ? `(${(item).notas})` : ''}`; amount = `${formatCurrency((item).cantidad)}`; amountClass = 'text-negative'; break;
                        }
                        return `
                            <div class="investment-timeline-item" data-id="${item.id}" data-cuenta-id="${cuentaId}">
                                <div class="investment-timeline-item__icon ${amountClass}"><span class="material-icons">${icon}</span></div>
                                <div class="investment-timeline-item__details">
                                    <div class="investment-timeline-item__description">${text}</div>
                                    <div class="investment-timeline-item__date">${date}</div>
                                </div>
                                <div class="investment-timeline-item__amount ${amountClass}">${amount}</div>
                            </div>`;
                    }).join('');
                }
            }
        };

        const renderInformesPage = async () => {
            const resultsContainer = select('informe-results-container');
            const emptyState = select('empty-informes');
            const kpiContainer = select('informe-kpi-container');
            const chartCtx = select('informes-chart')?.getContext('2d');
        
            if (!resultsContainer || !emptyState || !chartCtx || !kpiContainer) return;
            if (informesChart) { informesChart.destroy(); }
            
            const fechaInicioVal = select('informe-fecha-inicio').value;
            const fechaFinVal = select('informe-fecha-fin').value;
            
            // Usamos los filtros globales de la app
            const cuentaId = select('filter-cuenta-informe').value;
            const conceptoId = select('filter-concepto-informe').value;
        
            if (!fechaInicioVal || !fechaFinVal) {
                resultsContainer.classList.add('hidden');
                emptyState.classList.remove('hidden');
                return;
            }
        
            const fechaInicio = parseDateStringAsUTC(fechaInicioVal);
            const fechaFin = parseDateStringAsUTC(fechaFinVal);
            
            const visibleAccountIds = getVisibleAccounts().map(c => c.id);
            if (visibleAccountIds.length === 0) {
                showToast('No hay cuentas seleccionadas en esta contabilidad.', 'info');
                resultsContainer.classList.add('hidden');
                emptyState.classList.remove('hidden');
                (emptyState.querySelector('p')).textContent = "No hay cuentas visibles para generar el informe.";
                return;
            }
        
            let baseQuery = fbDb.collection('users').doc(currentUser.uid).collection('movimientos')
                .where('fecha', '>=', fechaInicio.toISOString())
                .where('fecha', '<=', fechaFin.toISOString())
                .where('tipo', '==', 'movimiento');

            if (conceptoId) {
                baseQuery = baseQuery.where('conceptoId', '==', conceptoId);
            }
            
            const accountIdsToQuery = cuentaId ? [cuentaId] : visibleAccountIds;
            const movimientos = await fetchMovementsInChunks(baseQuery, 'cuentaId', accountIdsToQuery);
            
            if (movimientos.length === 0) {
                showToast('No se encontraron movimientos para los filtros seleccionados.', 'info');
                resultsContainer.classList.add('hidden');
                emptyState.classList.remove('hidden');
                (emptyState.querySelector('p')).textContent = "No hay datos para este informe. Prueba a cambiar los filtros.";
                return;
            }
            
        
            resultsContainer.classList.remove('hidden');
            emptyState.classList.add('hidden');
            
            const datosAgrupados = movimientos.reduce((acc, mov) => {
                const fecha = new Date(mov.fecha);
                const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
                if (!acc[clave]) {
                    acc[clave] = { ingresos: 0, gastos: 0 };
                }

                if (mov.tipo === 'movimiento') {
                    if (mov.cantidad > 0) {
                        acc[clave].ingresos += mov.cantidad;
                    } else {
                        acc[clave].gastos += mov.cantidad;
                    }
                } else if (mov.tipo === 'traspaso') {
                    if (cuentaId) { 
                        if (mov.cuentaDestinoId === cuentaId) {
                            acc[clave].ingresos += mov.cantidad;
                        }
                        if (mov.cuentaOrigenId === cuentaId) {
                            acc[clave].gastos -= mov.cantidad;
                        }
                    }
                }
                return acc;
            }, {});
        
            const etiquetas = Object.keys(datosAgrupados).sort();
            const datosIngresos = etiquetas.map(clave => datosAgrupados[clave].ingresos / 100);
            const datosGastos = etiquetas.map(clave => Math.abs(datosAgrupados[clave].gastos / 100));
        
            const etiquetasFormateadas = etiquetas.map(clave => {
                const [year, month] = clave.split('-');
                return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(locales[currentLanguage], { month: 'short', year: '2-digit' });
            });
            
            const totalIngresos = datosIngresos.reduce((sum, val) => sum + (val * 100), 0);
            const totalGastos = datosGastos.reduce((sum, val) => sum + (val * 100), 0);
            const neto = totalIngresos - totalGastos;
            
            kpiContainer.innerHTML = `
                <div class="kpi-item"><h4 class="kpi-item__label">Total Ingresos</h4><strong class="kpi-item__value text-positive">${formatCurrency(totalIngresos)}</strong></div>
                <div class="kpi-item"><h4 class="kpi-item__label">Total Gastos</h4><strong class="kpi-item__value text-negative">${formatCurrency(-totalGastos)}</strong></div>
                <div class="kpi-item"><h4 class="kpi-item__label">Resultado Neto</h4><strong class="kpi-item__value ${neto >= 0 ? 'text-positive' : 'text-negative'}">${formatCurrency(neto)}</strong></div>
            `;
        
            informesChart = new Chart(chartCtx, {
                type: 'line',
                data: {
                    labels: etiquetasFormateadas,
                    datasets: [
                        { label: 'Ingresos', data: datosIngresos, borderColor: getComputedStyle(document.body).getPropertyValue('--c-success'), backgroundColor: 'rgba(48, 209, 88, 0.2)', fill: true, tension: 0.3, pointBackgroundColor: getComputedStyle(document.body).getPropertyValue('--c-success') },
                        { label: 'Gastos', data: datosGastos, borderColor: getComputedStyle(document.body).getPropertyValue('--c-danger'), backgroundColor: 'rgba(255, 59, 48, 0.2)', fill: true, tension: 0.3, pointBackgroundColor: getComputedStyle(document.body).getPropertyValue('--c-danger') }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, ticks: { callback: (value) => formatCurrency(value * 100).replace(/\s/g, '') } } },
                    plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (c) => `${c.dataset.label || ''}: ${formatCurrency(c.parsed.y * 100)}` } }, datalabels: { display: false } }
                }
            });
        };
        
        const renderVirtualListItem = (item) => {
            if (item.type === 'date-header') {
                const dateObj = new Date(item.date + 'T12:00:00Z');
                const day = dateObj.toLocaleDateString(locales[currentLanguage], { weekday: 'short' }).toUpperCase().replace('.', '');
                // MODIFICADO: Cambiado a 'numeric' para mostrar el año completo (aaaa)
                const dateStr = dateObj.toLocaleDateString(locales[currentLanguage], { day: '2-digit', month: '2-digit', year: 'numeric' });

                return `
                    <div class="movimiento-date-header">
                        <span>${day} ${dateStr}</span>
                        <span>${formatCurrency(item.total)}</span>
                    </div>
                `;
            }

            const m = item.movement;
            let highlightClass = '';
            if (m.id === newMovementIdToHighlight) {
                highlightClass = 'highlight-animation';
                newMovementIdToHighlight = null;
            }

            // MODIFICADO: Cambiado a 'numeric' para mostrar siempre el formato dd/mm/aaaa
            const formattedDate = new Date(m.fecha).toLocaleDateString(locales[currentLanguage], { day: '2-digit', month: '2-digit', year: 'numeric' });
            let indicatorClass = '';
            
            if (m.tipo === 'traspaso') indicatorClass = 'transaction-card__indicator--transfer';
            else if (m.cantidad >= 0) indicatorClass = 'transaction-card__indicator--income';
            else indicatorClass = 'transaction-card__indicator--expense';

            if (m.tipo === 'traspaso') {
                const origen = db.cuentas.find(c => c.id === m.cuentaOrigenId);
                const destino = db.cuentas.find(c => c.id === m.cuentaDestinoId);
                return `
                    <div class="transaction-card ${highlightClass}" data-action="edit-movement" data-id="${m.id}">
                        <div class="transaction-card__indicator ${indicatorClass}"></div>
                        <div class="transaction-card__content">
                            <div class="transaction-card__details">
                                <div class="transaction-card__concept">${escapeHTML(m.descripcion) || 'Traspaso'}</div>
                                <!-- MODIFICADO: Aseguramos el formato dd/mm/aaaa también aquí -->
                                <div class="transaction-card__description">${formattedDate}</div>
                                <div class="transaction-card__transfer-details">
                                    <div class="transaction-card__transfer-row">
                                        <span><span class="material-icons">arrow_upward</span> ${origen?.nombre || '?'}</span>
                                        <span class="transaction-card__balance">${formatCurrency(m.runningBalanceOrigen)}</span>
                                    </div>
                                    <div class="transaction-card__transfer-row">
                                        <span><span class="material-icons">arrow_downward</span> ${destino?.nombre || '?'}</span>
                                        <span class="transaction-card__balance">${formatCurrency(m.runningBalanceDestino)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="transaction-card__figures">
                                <div class="transaction-card__amount text-info">${formatCurrency(m.cantidad)}</div>
                            </div>
                        </div>
                    </div>`;
            } else {
                const cuenta = db.cuentas.find(c => c.id === m.cuentaId);
                const concept = db.conceptos.find(c => c.id === m.conceptoId);
                const amountClass = m.cantidad >= 0 ? 'text-positive' : 'text-negative';
                return `
                    <div class="transaction-card ${highlightClass}" data-action="edit-movement" data-id="${m.id}">
                        <div class="transaction-card__indicator ${indicatorClass}"></div>
                        <div class="transaction-card__content">
                            <div class="transaction-card__details">
                                <div class="transaction-card__row-1">${toSentenceCase(concept?.nombre || 'S/C')}</div>
                                <!-- Esta línea ahora usará automáticamente el nuevo formato dd/mm/aaaa de la variable 'formattedDate' -->
                                <div class="transaction-card__row-2">${formattedDate} • ${escapeHTML(m.descripcion)}</div>
                            </div>
                            <div class="transaction-card__figures">
                                <div class="transaction-card__amount ${amountClass}">${formatCurrency(m.cantidad)}</div>
                                <div class="transaction-card__balance">${formatCurrency(m.runningBalance)}</div>
                                <div class="transaction-card__row-2" style="text-align: right;">${escapeHTML(cuenta?.nombre || 'S/C')}</div>
                            </div>
                        </div>
                    </div>`;
            }
        };
        
        const renderVisibleItems = () => {
            if (!vList.scrollerEl || !vList.contentEl) return; 
            const scrollTop = vList.scrollerEl.scrollTop;
            const containerHeight = vList.scrollerEl.clientHeight;
            let startIndex = -1, endIndex = -1;
            
            for (let i = 0; i < vList.itemMap.length; i++) {
                const item = vList.itemMap[i];
                if (startIndex === -1 && item.offset + item.height > scrollTop) {
                    startIndex = Math.max(0, i - vList.renderBuffer);
                }
                if (endIndex === -1 && item.offset + item.height > scrollTop + containerHeight) {
                    endIndex = Math.min(vList.itemMap.length - 1, i + vList.renderBuffer);
                    break;
                }
            }
            if (startIndex === -1 && vList.items.length > 0) startIndex = 0;
            if (endIndex === -1) endIndex = vList.itemMap.length - 1;
            
            if (startIndex === vList.lastRenderedRange.start && endIndex === vList.lastRenderedRange.end) return;
            
            let visibleHtml = ''; 
            for (let i = startIndex; i <= endIndex; i++) {
                if (vList.items[i]) visibleHtml += renderVirtualListItem(vList.items[i]);
            }
            vList.contentEl.innerHTML = visibleHtml; 
            const offsetY = vList.itemMap[startIndex]?.offset || 0; 
            vList.contentEl.style.transform = `translateY(${offsetY}px)`; 
            vList.lastRenderedRange = { start: startIndex, end: endIndex };
        };
        
        const loadInitialMovements = async () => {
            const emptyEl = select('empty-movimientos'), listContainer = select('movimientos-list-container');
            if (!vList.scrollerEl) {
                vList.scrollerEl = selectOne('.app-layout__main');
                vList.sizerEl = select('virtual-list-sizer');
                vList.contentEl = select('virtual-list-content');
            }
            if (!listContainer || !emptyEl || !vList.sizerEl || !vList.contentEl) return;
            
            listContainer.classList.remove('hidden');
            emptyEl.classList.add('hidden');
            
            lastVisibleMovementDoc = null;
            allMovementsLoaded = false;
            isLoadingMoreMovements = false;
            runningBalancesCache = null;
			db.movimientos = []; // Clear local movements cache
            vList.items = [];
            vList.itemMap = [];
            vList.sizerEl.style.height = '0px';
            vList.contentEl.innerHTML = '';

            await loadMoreMovements(true); // Perform the initial load
        };

        const filterMovementsByLedger = (movements) => {
            const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));
            if (visibleAccountIds.size === 0) return [];
            
            return movements.filter(m => {
                if (m.tipo === 'traspaso') {
                    return visibleAccountIds.has(m.cuentaOrigenId) || visibleAccountIds.has(m.cuentaDestinoId);
                } else {
                    return visibleAccountIds.has(m.cuentaId);
                }
            });
        };

        	async function fetchMovementsPage(startAfterDoc = null) {
            if (!currentUser) return [];
            try {
                let query = fbDb.collection('users').doc(currentUser.uid).collection('movimientos')
                    .orderBy('fecha', 'desc');

                if (startAfterDoc) {
                    query = query.startAfter(startAfterDoc);
                }

                query = query.limit(MOVEMENTS_PAGE_SIZE);
                const snapshot = await query.get();

                if (snapshot.empty) {
                    allMovementsLoaded = true;
                    return [];
                }

                lastVisibleMovementDoc = snapshot.docs[snapshot.docs.length - 1];

                if (snapshot.docs.length < MOVEMENTS_PAGE_SIZE) {
                    allMovementsLoaded = true;
                }
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            } catch (error) {
                console.error("Error al obtener los movimientos:", error);
                showToast("Error al cargar los movimientos.", "danger");
                return [];
            }
        }
		const loadMoreMovements = async (isInitial = false) => {
            if (isLoadingMoreMovements || allMovementsLoaded) {
                return;
            }
        
            isLoadingMoreMovements = true;
            const loader = select('list-loader');
            if (loader) loader.classList.remove('hidden');
        
            try {
                let keepFetching = true;
        
                while (keepFetching && !allMovementsLoaded) {
                    const newMovs = await fetchMovementsPage(lastVisibleMovementDoc);
        
                    if (newMovs.length === 0) {
                        allMovementsLoaded = true;
                        keepFetching = false;
                        continue;
                    }
        
                    const filteredMovs = filterMovementsByLedger(newMovs);
        
                    if (filteredMovs.length > 0) {
                        await processMovementsForRunningBalance(filteredMovs);
                        db.movimientos = [...db.movimientos, ...filteredMovs];
                        updateVirtualList(filteredMovs, false);
                        keepFetching = false;
                    }
                }
        
            } catch (error) {
                console.error("Error al cargar más movimientos:", error);
                showToast("No se pudieron cargar más movimientos.", "danger");
            } finally {
                isLoadingMoreMovements = false;
                if (loader) loader.classList.add('hidden');
        
                if (isInitial && db.movimientos.length === 0) {
                     select('movimientos-list-container')?.classList.add('hidden');
                     select('empty-movimientos')?.classList.remove('hidden');
                }
            }
        };
        
        const updateVirtualList = (newItemsChunk, replace = false) => {
            if (replace) {
                db.movimientos = [];
            }
        
            const grouped = {};
            (db.movimientos || []).forEach(mov => {
                const dateKey = mov.fecha.slice(0, 10);
                if (!grouped[dateKey]) {
                    grouped[dateKey] = { movements: [], total: 0 };
                }
                grouped[dateKey].movements.push(mov);
                
                if (mov.tipo === 'traspaso') {
                    const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));
                    const origenVisible = visibleAccountIds.has(mov.cuentaOrigenId);
                    const destinoVisible = visibleAccountIds.has(mov.cuentaDestinoId);
                    if (origenVisible && !destinoVisible) {
                        grouped[dateKey].total -= mov.cantidad;
                    } else if (!origenVisible && destinoVisible) {
                        grouped[dateKey].total += mov.cantidad;
                    }
                } else {
                    grouped[dateKey].total += mov.cantidad;
                }
            });

            vList.items = [];
            vList.itemMap = [];
            let currentHeight = 0;
            const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

            for (const dateKey of sortedDates) {
                const group = grouped[dateKey];
        
                vList.items.push({ type: 'date-header', date: dateKey, total: group.total });
                vList.itemMap.push({ height: vList.heights.header, offset: currentHeight });
                currentHeight += vList.heights.header;
        
                for (const mov of group.movements) {
                    const itemHeight = mov.tipo === 'traspaso' ? vList.heights.transfer : vList.heights.transaction;
                    vList.items.push({ type: 'transaction', movement: mov });
                    vList.itemMap.push({ height: itemHeight, offset: currentHeight });
                    currentHeight += itemHeight;
                }
            }
            
            if (vList.sizerEl) {
                vList.sizerEl.style.height = `${currentHeight}px`;
            }
            
            vList.lastRenderedRange = { start: -1, end: -1 };
            renderVisibleItems();
            
            buildDescriptionIndex(); 
        };
		// AÑADE ESTAS NUEVAS FUNCIONES A TU SCRIPT

/**
 * Calcula el progreso del año actual.
 * @returns {object} Un objeto con el porcentaje del año transcurrido, días pasados y restantes.
 */
const getYearProgress = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const year = now.getFullYear();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDaysInYear = isLeap ? 366 : 365;

    return {
        percentage: (dayOfYear / totalDaysInYear) * 100,
        daysPassed: dayOfYear,
        daysRemaining: totalDaysInYear - dayOfYear,
        totalDaysInYear: totalDaysInYear
    };
};

/**
 * Renderiza un gráfico de medidor (gauge) en un canvas.
 * @param {string} canvasId - El ID del elemento canvas.
 * @param {number} percentageConsumed - El porcentaje del presupuesto ya gastado.
 * @param {number} yearProgressPercentage - El porcentaje del año que ha transcurrido.
 */
const renderGaugeChart = (canvasId, percentageConsumed, yearProgressPercentage) => {
    const ctx = select(canvasId)?.getContext('2d');
    if (!ctx) return;

    // Destruir instancia anterior si existe para evitar conflictos
    if (Chart.getChart(canvasId)) {
        Chart.getChart(canvasId).destroy();
    }

    const isAheadOfPace = percentageConsumed > yearProgressPercentage;
    
    // Colores dinámicos
    const spentColor = isAheadOfPace ? 'var(--c-danger)' : 'var(--c-primary)';
    const remainingColor = 'var(--c-surface-variant)';

    const data = {
        datasets: [{
            data: [
                Math.min(percentageConsumed, 100),
                Math.max(0, 100 - Math.min(percentageConsumed, 100))
            ],
            backgroundColor: [spentColor, remainingColor],
            borderColor: 'var(--c-surface)',
            borderWidth: 2,
        }]
    };
    
    // El "pin" o marcador del ritmo del año
    const paceLinePlugin = {
        id: 'paceLine',
        afterDraw: chart => {
            const { ctx, chartArea } = chart;
            const angle = Math.PI + (Math.PI * yearProgressPercentage / 100);
            const cx = (chartArea.left + chartArea.right) / 2;
            const cy = (chartArea.top + chartArea.bottom) / 2 + 15; // Ajuste para centrar mejor
            const radius = chart.outerRadius;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + radius * Math.sin(angle), cy + radius * Math.cos(angle));
            ctx.strokeStyle = 'var(--c-success)';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
        }
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            rotation: -90,
            circumference: 180,
            cutout: '70%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
                datalabels: { display: false }
            }
        },
        plugins: [paceLinePlugin]
    });
};

const renderBudgetTrendChart = (monthlyIncomeData, monthlyExpenseData, averageBudgetedExpense) => {
    const canvasId = 'budget-trend-chart';
    const ctx = select(canvasId)?.getContext('2d');
    if (!ctx) return;

    if (Chart.getChart(canvasId)) {
        Chart.getChart(canvasId).destroy();
    }

    const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const incomeData = labels.map((_, i) => (monthlyIncomeData[i] || 0) / 100);
    const expenseData = labels.map((_, i) => (monthlyExpenseData[i] || 0) / 100);
    
    // ================== INICIO DE LA CORRECCIÓN DE COLOR ==================
    // Obtenemos el valor de color actual directamente desde el CSS del body.
    // El .trim() es importante para eliminar espacios en blanco que puedan dar problemas.
    const colorSuccess = getComputedStyle(document.body).getPropertyValue('--c-success').trim();
    const colorDanger = getComputedStyle(document.body).getPropertyValue('--c-danger').trim();
    const colorWarning = getComputedStyle(document.body).getPropertyValue('--c-warning').trim();
    // =================== FIN DE LA CORRECCIÓN DE COLOR ====================

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ingresos Mensuales',
                    data: incomeData,
                    // Usamos la variable de JavaScript con el color ya resuelto
                    backgroundColor: colorSuccess, 
                    borderRadius: 4,
                    order: 2
                },
                {
                    label: 'Gastos Mensuales',
                    data: expenseData,
                    // Usamos la variable de JavaScript con el color ya resuelto
                    backgroundColor: colorDanger, 
                    borderRadius: 4,
                    order: 3
                },
                {
                    type: 'line',
                    label: 'Promedio Gasto Presupuestado',
                    data: Array(12).fill(averageBudgetedExpense / 100),
                    // Usamos la variable de JavaScript con el color ya resuelto
                    borderColor: colorWarning,
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    order: 1,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { callback: value => `€${value}` } },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false },
                datalabels: { display: false }
            }
        }
    });
};

		// =================================================================================
        // INICIO DE LA VERSIÓN MEJORADA DE renderCuentas
        // =================================================================================
        const renderCuentas = async (targetContainerId, totalPatrimonio = 0) => { // CAMBIO: Aceptamos el total del patrimonio
            const container = select(targetContainerId);
            if (!container) return;

            // 3. Se elimina la definición local de `getAllSaldos` y se llama a la función global.
            //    La llamada ya no necesita `await` porque la nueva función global es síncrona.
			 const saldos = getAllSaldos();
            const allAccounts = getVisibleAccounts();
            const allAccountTypes = [...new Set(allAccounts.map((c) => toSentenceCase(c.tipo || 'S/T')))];
            const filteredAccountTypes = new Set(allAccountTypes.filter(t => !deselectedAccountTypesFilter.has(t)));

            const accountsByType = allAccounts.reduce((acc, c) => {
                const tipo = toSentenceCase(c.tipo || 'S/T');
                if (!acc[tipo]) acc[tipo] = [];
                acc[tipo].push(c);
                return acc;
            }, {});
            
            const resumenHTML = Object.keys(accountsByType).sort().map(tipo => {
                if (!filteredAccountTypes.has(tipo)) return '';
                
                const accountsInType = accountsByType[tipo];
                const typeBalance = accountsInType.reduce((sum, account) => sum + (saldos[account.id] || 0), 0);

                // AÑADIDO: Cálculo del porcentaje global para el tipo de cuenta
                const porcentajeGlobal = totalPatrimonio > 0 ? (typeBalance / totalPatrimonio) * 100 : 0;

                const accountsHtml = accountsInType.sort((a,b) => a.nombre.localeCompare(b.nombre)).map((c) => {
                    const balance = saldos[c.id] || 0;
                    
                    // AÑADIDO: Cálculo del porcentaje local para la cuenta individual
                    const porcentajeGrupo = typeBalance > 0 ? (balance / typeBalance) * 100 : 0;
                    
                    const investmentIcon = c.esInversion ? `<span class="material-icons text-info" style="font-size: 14px; margin-left: var(--sp-2);" title="Cuenta de Portafolio">trending_up</span>` : '';
                    
                    // CAMBIO: Se añade el span con el porcentaje del grupo
                    return `
                        <div class="modal__list-item" data-action="view-account-details" data-id="${c.id}" style="cursor: pointer; padding-left: 0; padding-right: 0;">
                            <div>
                                <span style="display: block; font-weight: 500;">${c.nombre}</span>
                                <!-- AÑADIDO: Span para mostrar el porcentaje del grupo -->
                                <small style="color: var(--c-on-surface-secondary); font-weight: 500;">${porcentajeGrupo.toFixed(1)}% del total de ${tipo}</small>
                            </div>
                            <div style="display: flex; align-items: center; gap: var(--sp-2);">${formatCurrency(balance)}${investmentIcon}<span class="material-icons" style="font-size: 18px; color: var(--c-on-surface-secondary);">chevron_right</span></div>
                        </div>`;
                }).join('');
                
                if (!accountsHtml) return '';
                
                const icon = tipo==='EFECTIVO'?'payments':(tipo.includes('TARJETA')?'credit_card':(tipo==='AHORRO'?'savings':(tipo==='INVERSIÓN'?'trending_up':(tipo==='PROPIEDAD'?'domain':(tipo==='PRÉSTAMO'?'credit_score':'account_balance')))));
                
                // CAMBIO: Se añade el span con el porcentaje global en el resumen del grupo
                return `
                    <details class="accordion">
                        <summary>
                            <span class="account-group__name"><span class="material-icons" style="vertical-align:bottom;font-size:16px;margin-right:8px">${icon}</span>${tipo}</span>
                            <div style="display:flex; align-items:center; gap:var(--sp-2);">
                                <!-- AÑADIDO: Span para mostrar el porcentaje global -->
                                <small style="color: var(--c-on-surface-tertiary); font-weight: 600; margin-right: var(--sp-2);">${porcentajeGlobal.toFixed(1)}%</small>
                                <span class="account-group__balance">${formatCurrency(typeBalance)}</span>
                                <span class="material-icons accordion__icon">expand_more</span>
                            </div>
                        </summary>
                        <div class="accordion__content">${accountsHtml}</div>
                    </details>`;
            }).join('');

            container.innerHTML = `<div class="accordion-wrapper">${resumenHTML}</div>`;
        };
        // =================================================================================
        // FIN DE LA VERSIÓN MEJORADA
        // =================================================================================
                
        
        const loadConfig = () => { 
            (select('config-skip-intro')).checked = !!db.config?.skipIntro; 
            const userEmailEl = select('config-user-email'); 
            if (userEmailEl && currentUser) userEmailEl.textContent = currentUser.email;
            
            const setupPinBtnText = select('setup-pin-btn-text');
            if(setupPinBtnText) {
                setupPinBtnText.textContent = localStorage.getItem('pinUserHash') ? 'Cambiar PIN de Acceso' : 'Configurar PIN de Acceso';
            }

            renderLanguageSelector();
			renderThemeSelector();
        };
        
        // =================================================================================
        // 7.6. DASHBOARD RENDERING (REESTRUCTURADO)
        // =================================================================================
		 const renderInicioPage = () => {
    const container = select(PAGE_IDS.INICIO);
    if (!container) return;

    if (conceptosChart) {
        conceptosChart.destroy();
        conceptosChart = null;
    }

    // 1. Se genera todo el HTML de la página de inicio.
    container.innerHTML = `
        <div id="inicio-view-switcher" class="filter-pills" style="justify-content: center;">
            <button class="filter-pill filter-pill--active" data-action="set-inicio-view" data-view="recientes">Recientes</button>
            <button class="filter-pill" data-action="set-inicio-view" data-view="resumen">Resumen</button>
        </div>

        <!-- El contenedor de recurrentes ahora está aquí arriba -->
        <div id="pending-recurrents-container"></div>

        <!-- El contenedor de movimientos recientes viene después -->
        <div id="inicio-view-recientes"></div>

		<div id="inicio-view-resumen" class="hidden">
            <div class="card card--no-bg" id="dashboard-filters-widget">
                <div class="accordion-wrapper">
                    <details class="accordion">
                        <summary><h3 class="card__title" style="margin: 0; padding: 0; color: var(--c-on-surface);"><span class="material-icons">filter_list</span>Filtros</h3><span class="material-icons accordion__icon">expand_more</span></summary>
                        <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                            <div class="form-group">
                                <label for="filter-periodo" class="form-label">Periodo</label>
                                <select id="filter-periodo" class="form-select">
                                    <option value="mes-actual" selected>Mes Actual</option>
                                    <option value="año-actual">Año Actual</option>
                                    <option value="custom">Personalizado</option>
                                </select>
                            </div>
                            
                            <div id="custom-date-filters" class="form-grid hidden" style="margin-bottom: var(--sp-3);">
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label for="filter-fecha-inicio" class="form-label">Desde</label>
                                    <input type="date" id="filter-fecha-inicio" class="form-input" />
                                </div>
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label for="filter-fecha-fin" class="form-label">Hasta</label>
                                    <input type="date" id="filter-fecha-fin" class="form-input" />
                                </div>
                            </div>

                            <div class="form-grid">
                                <div class="form-group"><label for="filter-cuenta" class="form-label">Cuenta</label><select id="filter-cuenta" class="form-select"></select></div>
                                <div class="form-group"><label for="filter-concepto" class="form-label">Concepto</label><select id="filter-concepto" class="form-select"></select></div>
                            </div>
                            <button data-action="apply-filters" class="btn btn--primary btn--full">Aplicar Filtros</button>
                        </div>
                    </details>
                </div>
            </div>
            <section id="kpi-container" class="kpi-grid" aria-label="Indicadores clave de rendimiento"></section>
            
            <div id="resumen-content-container"></div>
        </div>
    `;
    
    // === INICIO DE LA CORRECCIÓN CLAVE ===
    // 2. Inmediatamente después de crear el HTML, poblamos los dropdowns.
    populateAllDropdowns();
    
    // 3. Disparamos el evento 'change' para asegurar que el filtro de fecha personalizado se muestre u oculte correctamente.
    select('filter-periodo')?.dispatchEvent(new Event('change')); 
    renderPendingRecurrents();
    // 4. Finalmente, renderizamos el contenido de las subvistas.
    renderInicioResumenView();
    renderInicioRecientesView();
    // === FIN DE LA CORRECCIÓN CLAVE ===
};    
	 // =================================================================================
        // INICIO: CORRECCIÓN DE FUNCIONES DE RENDERIZADO FALTANTES
        // =================================================================================
        const renderDashboardKpiSummary = () => {
            return `<div class="kpi-item"><h4 class="kpi-item__label">Ingresos</h4><strong id="kpi-ingresos-value" class="kpi-item__value text-positive skeleton" data-current-value="0">+0,00 €</strong><div id="kpi-ingresos-comparison" class="kpi-item__comparison"></div></div>
                    <div class="kpi-item"><h4 class="kpi-item__label">Gastos</h4><strong id="kpi-gastos-value" class="kpi-item__value text-negative skeleton" data-current-value="0">0,00 €</strong><div id="kpi-gastos-comparison" class="kpi-item__comparison"></div></div>
                    <div class="kpi-item"><h4 class="kpi-item__label">Saldo Neto</h4><strong id="kpi-saldo-value" class="kpi-item__value skeleton" data-current-value="0">0,00 €</strong><div id="kpi-saldo-comparison" class="kpi-item__comparison"></div></div>`;
        };
        
        const renderDashboardConceptTotals = () => {
            return `
                <div class="card card--no-bg" id="concept-totals-widget">
                    <div class="accordion-wrapper">
                        <details class="accordion" open>
                            <summary><h3 class="card__title" style="margin: 0; padding: 0; color: var(--c-on-surface);"><span class="material-icons">category</span>Totales por Concepto</h3><span class="material-icons accordion__icon">expand_more</span></summary>
                            <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);"><div class="chart-container" style="height: 240px; margin-bottom: var(--sp-2);"><canvas id="conceptos-chart"></canvas></div><div id="concepto-totals-list">${Array(3).fill('<div class="skeleton" style="height: 48px; margin-bottom: 2px;"></div>').join('')}</div></div>
                        </details>
                    </div>
                </div>`;
        };
        // =================================================================================
        // FIN: CORRECCIÓN DE FUNCIONES
        // =================================================================================
        const renderInicioResumenView = () => {
            const widgetOrder = db.config.dashboardWidgets || DEFAULT_DASHBOARD_WIDGETS;
            const resumenContentContainer = select('resumen-content-container');
            const kpiContainer = select('kpi-container');

            if(!resumenContentContainer || !kpiContainer) return;

            kpiContainer.innerHTML = renderDashboardKpiSummary();
            resumenContentContainer.innerHTML = widgetOrder.map(widgetId => {
                if (widgetId === 'concept-totals') return renderDashboardConceptTotals();
                return '';
            }).join('');
            
            // =================================================================================
            // INICIO CORRECCIÓN: Llamamos a la carga de datos aquí para asegurar que se muestren
            // los datos del mes actual al cargar la vista de resumen.
            // =================================================================================
            updateDashboardData();
            // =================================================================================
            // FIN CORRECCIÓN
            // =================================================================================
        };

        // =================================================================================
        // NUEVA FUNCIÓN HELPER PARA RENDERIZAR
        // Esta función solo se encarga de pintar el HTML a partir de una lista de movimientos.
        // =================================================================================
        const _renderRecientesFromCache = async () => {
            const recientesContainer = select('inicio-view-recientes');
            if (!recientesContainer) return;
            
            // Usamos la variable global 'recentMovementsCache' como fuente de verdad.
            const movsToDisplay = recentMovementsCache;
            
            if (movsToDisplay.length === 0) {
                recientesContainer.innerHTML = `<div class="empty-state" style="border: none; background: transparent;"><p>No hay movimientos recientes en esta contabilidad.</p></div>`;
                return;
            }

            // Forzamos el recálculo de saldos con los datos más frescos.
            await processMovementsForRunningBalance(movsToDisplay, true); 

            const grouped = {};
            const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));
            movsToDisplay.forEach(mov => {
                const dateKey = mov.fecha.slice(0, 10);
                if (!grouped[dateKey]) {
                    grouped[dateKey] = { movements: [], total: 0 };
                }
                grouped[dateKey].movements.push(mov);
                if (mov.tipo === 'traspaso') {
                    const origenVisible = visibleAccountIds.has(mov.cuentaOrigenId);
                    const destinoVisible = visibleAccountIds.has(mov.cuentaDestinoId);
                    if (origenVisible && !destinoVisible) { grouped[dateKey].total -= mov.cantidad; }
                    else if (!origenVisible && destinoVisible) { grouped[dateKey].total += mov.cantidad; }
                } else {
                    grouped[dateKey].total += mov.cantidad;
                }
            });

            let html = '';
            const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
            for (const dateKey of sortedDates) {
                const group = grouped[dateKey];
                html += renderVirtualListItem({ type: 'date-header', date: dateKey, total: group.total });
                
                // =================================================================================
                // INICIO DE LA CORRECCIÓN: Línea añadida para ordenar los movimientos dentro del día
                // =================================================================================
                group.movements.sort((a, b) => b.id.localeCompare(a.id));
                // =================================================================================
                // FIN DE LA CORRECCIÓN
                // =================================================================================

                for (const mov of group.movements) {
                    html += renderVirtualListItem({ type: 'transaction', movement: mov });
                }
            }
            html += `<div style="text-align: center; margin-top: var(--sp-4);"><button class="btn btn--secondary" data-action="navigate" data-page="${PAGE_IDS.MOVIMIENTOS_FULL}">Ver todos los movimientos</button></div>`;
            recientesContainer.innerHTML = html;
        };
		 const renderPendingRecurrents = () => {
            const container = select('pending-recurrents-container');
            if (!container || !db.recurrentes) return;

            const now = new Date();
            const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            
            // =================================================================================
            // INICIO DEL CAMBIO: La lógica del filtro es ahora la inversa.
            // Buscamos todas las plantillas cuya próxima fecha de ejecución es HOY o ANTERIOR.
            // =================================================================================
            const pending = db.recurrentes
            .filter(r => {
                const nextDate = parseDateStringAsUTC(r.nextDate);
                const normalizedNextDate = new Date(Date.UTC(nextDate.getUTCFullYear(), nextDate.getUTCMonth(), nextDate.getUTCDate()));

                // La nueva condición: muestra todo lo que esté vencido.
                return normalizedNextDate <= today;
            })
            .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));
            // =================================================================================
            // FIN DEL CAMBIO
            // =================================================================================

            if (pending.length === 0) {
                container.innerHTML = '';
                return;
            }

            const itemsHTML = pending.map(r => {
                const nextDate = new Date(r.nextDate + 'T12:00:00Z');
                const formattedDate = nextDate.toLocaleDateString(locales[currentLanguage], { day: '2-digit', month: 'short', year: 'numeric' }); // Año completo para mayor claridad
                const amountClass = r.cantidad >= 0 ? 'text-positive' : 'text-negative';
                
                // Pequeño cambio en el texto para reflejar que está "pendiente"
                const dateText = `Pendiente desde: ${formattedDate}`;

                return `
                <div class="transaction-card" id="pending-recurrente-${r.id}" style="background-color: color-mix(in srgb, var(--c-warning) 10%, transparent);">
                    <div class="transaction-card__indicator transaction-card__indicator--recurrent"></div>
                    <div class="transaction-card__content">
                        <div class="transaction-card__details">
                            <div class="transaction-card__row-1">${escapeHTML(r.descripcion)}</div>
                            <div class="transaction-card__row-2" style="font-weight: 600; color: var(--c-warning);">${dateText}</div>
                        </div>
                        <div class="transaction-card__figures" style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                            <strong class="transaction-card__amount ${amountClass}">${formatCurrency(r.cantidad)}</strong>
                            <button class="btn btn--primary" data-action="confirm-recurrent" data-id="${r.id}" style="padding: 4px 8px; font-size: 0.7rem;">
                                <span class="material-icons" style="font-size: 14px;">check</span>Añadir Ahora
                            </button>
                        </div>
                    </div>
                </div>
                `;
            }).join('');

            container.innerHTML = `
                <div class="card card--no-bg accordion-wrapper" style="margin-top: var(--sp-4);">
                    <details class="accordion" open>
                        <summary>
                            <h3 class="card__title" style="margin: 0; padding: 0; color: var(--c-on-surface);">
                                <span class="material-icons">event_repeat</span>
                                Operaciones Recurrentes Pendientes
                            </h3>
                            <span class="material-icons accordion__icon">expand_more</span>
                        </summary>
                        <div class="accordion__content" style="padding: 0 var(--sp-2) var(--sp-2) var(--sp-2);">${itemsHTML}</div>
                    </details>
                </div>
            `;
        };
// =================================================================================
// FUNCIÓN MODIFICADA
// Ahora, esta función solo se encarga de OBTENER los datos y guardarlos en el caché.
// =================================================================================
const renderInicioRecientesView = async () => {
            const recientesContainer = select('inicio-view-recientes');
            if (!recientesContainer) return;
            
            if (unsubscribeRecientesListener) {
                unsubscribeRecientesListener();
            }

            recientesContainer.innerHTML = `<div class="skeleton" style="height: 200px;"></div>`;

            const RECIENTES_COUNT = 30;
            const query = fbDb.collection('users').doc(currentUser.uid).collection('movimientos')
                .orderBy('fecha', 'desc')
                .limit(RECIENTES_COUNT);

            unsubscribeRecientesListener = query.onSnapshot(async (snapshot) => {
                const allRecentMovs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                recentMovementsCache = filterMovementsByLedger(allRecentMovs);
                
                // === INICIO DE LA CORRECCIÓN ===
                // Aquí, después de actualizar la caché, reconstruimos el índice de inteligencia
                // usando la caché como fuente de datos.
                buildIntelligentIndex(recentMovementsCache);
                // === FIN DE LA CORRECCIÓN ===
                
                _renderRecientesFromCache();

            }, (error) => {
                console.error("Error en el listener de movimientos recientes:", error);
                recientesContainer.innerHTML = `<p class="text-danger">Error al cargar movimientos.</p>`;
            });
        };
                const renderPatrimonioPage = async () => {
            const container = select(PAGE_IDS.PATRIMONIO);
            if(!container) return;

            const visibleAccounts = getVisibleAccounts();
            const saldos = await getSaldos();
            
            const allAccountTypes = [...new Set(visibleAccounts.map((c) => toSentenceCase(c.tipo || 'S/T')))].sort();
            const filteredAccountTypes = new Set(allAccountTypes.filter(t => !deselectedAccountTypesFilter.has(t)));
            
            const totalFiltrado = visibleAccounts.reduce((sum, c) => {
                const tipo = toSentenceCase(c.tipo || 'S/T');
                if (filteredAccountTypes.has(tipo)) {
                    return sum + (saldos[c.id] || 0);
                }
                return sum;
            }, 0);

            const pillsHTML = allAccountTypes.map(t => `<button class="filter-pill ${!deselectedAccountTypesFilter.has(t) ? 'filter-pill--active' : ''}" data-action="toggle-account-type-filter" data-type="${t}">${t}</button>`).join('') || `<p style="font-size:var(--fs-xs); color:var(--c-on-surface-secondary)">No hay cuentas en esta vista.</p>`;

            container.innerHTML = `
                 <div class="card" style="border: none; background: transparent;">
                    <div class="kpi-item" style="text-align: left; padding: var(--sp-4); background: none; border: none;">
                        <h4 class="kpi-item__label" style="text-align: left;">Patrimonio Neto (Seleccionado)</h4>
                        <strong id="patrimonio-total-balance" class="kpi-item__value" style="font-size: var(--fs-xl);"></strong>
                    </div>
                </div>
                <div class="card card--no-bg accordion-wrapper">
                    <details class="accordion"open>
                        <summary>
                            <h3 class="card__title" style="margin: 0; padding: 0; color: var(--c-on-surface);"><span class="material-icons">filter_alt</span>Filtros</h3>
                            <span class="material-icons accordion__icon">expand_more</span>
                        </summary>
                        <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                            <h3 class="card__title" style="font-size: var(--fs-base); color: var(--c-on-surface-secondary); margin-bottom: var(--sp-2); padding: 0;">Filtro por tipo de cuenta</h3>
                            <div class="form-group">
                                <div id="filter-account-types-pills" class="filter-pills">${pillsHTML}</div>
                            </div>
                        </div>
                    </details>
                </div>
                <div class="accordion-wrapper">
                    <details class="accordion" open>
                        <summary><h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);"><span class="material-icons">account_balance_wallet</span>Cuentas</h3><span class="material-icons accordion__icon">expand_more</span></summary>
                        <div class="accordion__content" style="padding: 0;" id="patrimonio-cuentas-container"></div>
                    </details>
                </div>
                <div class="card card--no-bg accordion-wrapper">
                    <div id="liquid-assets-chart-container" class="hidden" style="margin-bottom: 0;">
                         <details class="accordion" open>
                            <summary>
                                <h3 class="card__title" style="margin: 0; padding: 0; color: var(--c-on-surface);"><span class="material-icons">donut_small</span>Distribución de Activos Líquidos</h3>
                                <span class="material-icons accordion__icon">expand_more</span>
                            </summary>
                            <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                                <div class="chart-container" style="height: 200px; margin-bottom: 0;">
                                    <canvas id="liquid-assets-chart"></canvas>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>`;
            
            animateCountUp(select('patrimonio-total-balance'), totalFiltrado);
            
            renderCuentas('patrimonio-cuentas-container', totalFiltrado);
            
            const chartContainer = select(`liquid-assets-chart-container`);
            const chartCtx = (select(`liquid-assets-chart`))?.getContext('2d');
            if (chartCtx && chartContainer) {
                if(liquidAssetsChart) liquidAssetsChart.destroy();
                const saldosPorTipoChart = {};
                getLiquidAccounts().filter((c) => filteredAccountTypes.has(toSentenceCase(c.tipo || 'S/T'))).forEach((c) => {
                    const tipo = toSentenceCase(c.tipo || 'S/T');
                    saldosPorTipoChart[tipo] = (saldosPorTipoChart[tipo] || 0) + (saldos[c.id] || 0);
                });
                const chartData = Object.entries(saldosPorTipoChart).filter(([,saldo]) => saldo > 0);
                if (chartData.length > 0) {
                    chartContainer.classList.remove('hidden');
                    liquidAssetsChart = new Chart(chartCtx, {
                        type: 'pie',
                        data: {
                            labels: chartData.map(([tipo]) => tipo),
                            datasets: [{ data: chartData.map(([, saldo]) => saldo / 100), backgroundColor: ['#007AFF', '#30D158', '#FFD60A', '#FF3B30', '#C084FC', '#4ECDC4'], borderColor: getComputedStyle(document.body).getPropertyValue('--c-background'), borderWidth: 4 }]
                        },
                        options: {
                            responsive: true, maintainAspectRatio: false,
                            plugins: { 
                                legend: { display: true, position: 'bottom', labels: { boxWidth: 12, padding: 15 } }, 
                                datalabels: { 
                                    // ================== INICIO DE LA LÍNEA CORREGIDA ==================
                                    formatter: (v,c)=>{ let s=c.chart.data.datasets[0].data.reduce((a,b)=>a+b,0); return s > 0 ? (v*100/s).toFixed(0)+"%" : "0%"; }, 
                                    // =================== FIN DE LA LÍNEA CORREGIDA ====================
                                    color: '#fff', 
                                    font: { weight: 'bold', size: 10 } 
                                }
                            }
                        }
                    });
                } else {
                    chartContainer.classList.add('hidden');
                }
            }
        };
        
		 const renderAnalisisPage = () => {
    const container = select(PAGE_IDS.ANALISIS);
    if(!container) return;

    // Obtenemos la estructura HTML del paso 2.1
    // (Asegúrate de haber pegado el HTML nuevo en el body)
    // El HTML ya debería estar en el DOM en este punto.

    // Poblamos los dropdowns de AÑOS para la sección de presupuestos
    const budgetYearSelect = select('budget-year-selector');
    if (budgetYearSelect) {
        const currentYear = new Date().getFullYear();
        let years = new Set([currentYear]);
        (db.presupuestos || []).forEach(p => years.add(p.ano));
        
        const currentVal = budgetYearSelect.value;
        budgetYearSelect.innerHTML = [...years].sort((a, b) => b - a).map(y => `<option value="${y}">${y}</option>`).join('');
        
        if (currentVal && [...years].some(y => y == parseInt(currentVal))) {
            budgetYearSelect.value = currentVal;
        } else {
            budgetYearSelect.value = String(currentYear);
        }
        
        // Añadimos un listener para que se actualice el dashboard al cambiar de año
        budgetYearSelect.addEventListener('change', renderBudgetTracking);
    }
    
    // Poblamos todos los demás dropdowns (para los informes, etc.)
    populateAllDropdowns();
    
    // Renderizamos el contenido inicial de cada sección
    renderBudgetTracking();
    renderInversionesPage('analisis-inversiones-container');
};
        
        const updateDashboardData = async () => {
            const { current, previous, label } = await getFilteredMovements(true);
            const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));
            const kpiContainer = select('kpi-container');
            const conceptListContainer = select('concepto-totals-list');
            const chartCtx = select('conceptos-chart')?.getContext('2d');
            const cId = select('filter-cuenta')?.value;
        
            const calculateTotals = (movs) => {
    let ingresos = 0, gastos = 0;
    movs.forEach(m => {
        if (m.tipo === 'movimiento') { 
            if (m.cantidad > 0) ingresos += m.cantidad; 
            else gastos += m.cantidad; 
        } 
        else if (m.tipo === 'traspaso') {
            // Si hay una cuenta específica seleccionada en el filtro
            if (cId) {
                // === INICIO DE LA CORRECCIÓN LÓGICA ===
                // Un traspaso que sale de la cuenta seleccionada es un GASTO para esa cuenta.
                if (m.cuentaOrigenId === cId) { 
                    gastos += -m.cantidad; // Lo añadimos como un valor negativo
                }
                // Un traspaso que entra a la cuenta seleccionada es un INGRESO para esa cuenta.
                if (m.cuentaDestinoId === cId) { 
                    ingresos += m.cantidad;
                }
                // === FIN DE LA CORRECCIÓN LÓGICA ===
            } else { // Si se están viendo "Todas las cuentas"
                const origenVisible = visibleAccountIds.has(m.cuentaOrigenId);
                const destinoVisible = visibleAccountIds.has(m.cuentaDestinoId);
                
                // Solo contamos el traspaso si representa una entrada/salida neta del patrimonio visible.
                if (origenVisible && !destinoVisible) { 
                    gastos += -m.cantidad; // Sale dinero del conjunto de cuentas visibles.
                }
                else if (!origenVisible && destinoVisible) { 
                    ingresos += m.cantidad; // Entra dinero al conjunto de cuentas visibles.
                }
                // Si origen y destino son visibles, es un movimiento interno y no afecta a los totales.
            }
        }
    });
    return { ingresos, gastos };
};
        
            const currentTotals = calculateTotals(current);
            const previousTotals = calculateTotals(previous);
            
            if (kpiContainer) {
                selectAll('#kpi-container .skeleton').forEach(el => el.classList.remove('skeleton'));
                
                const getComparisonHTML = (currentVal, prevVal, comparisonLabel, lowerIsBetter = false) => {
                    if (!comparisonLabel || prevVal === 0) return '';
                    const isImprovement = lowerIsBetter ? (currentVal < prevVal) : (currentVal > prevVal);
                    const diff = (currentVal - prevVal) / Math.abs(prevVal) * 100;
                    const diffClass = isImprovement ? 'text-positive' : 'text-negative';
                    const icon = isImprovement ? 'arrow_upward' : 'arrow_downward';
                    return `<span class="${diffClass}"><span class="material-icons" style="font-size: 12px; vertical-align: middle;">${icon}</span> ${Math.abs(diff).toFixed(0)}%</span> <span style="color:var(--c-on-surface-secondary)">${comparisonLabel}</span>`;
                };

                const saldoActual = currentTotals.ingresos + currentTotals.gastos;
                const saldoAnterior = previousTotals.ingresos + previousTotals.gastos;
        
                animateCountUp(select('kpi-ingresos-value'), currentTotals.ingresos);
                select('kpi-ingresos-comparison').innerHTML = getComparisonHTML(currentTotals.ingresos, previousTotals.ingresos, label);
                animateCountUp(select('kpi-gastos-value'), currentTotals.gastos);
                select('kpi-gastos-comparison').innerHTML = getComparisonHTML(Math.abs(currentTotals.gastos), Math.abs(previousTotals.gastos), label, true);
                
                const kpiSaldoValueEl = select('kpi-saldo-value');
                if (kpiSaldoValueEl) {
                    kpiSaldoValueEl.classList.remove('text-positive', 'text-negative');
                    kpiSaldoValueEl.classList.add(saldoActual >= 0 ? 'text-positive' : 'text-negative');
                    animateCountUp(kpiSaldoValueEl, saldoActual);
                }
                select('kpi-saldo-comparison').innerHTML = getComparisonHTML(saldoActual, saldoAnterior, label);
            }
        
            if (conceptosChart) conceptosChart.destroy();
            if (conceptListContainer && chartCtx) {
                const cTots = current.reduce((a, m) => { if (m.tipo === 'movimiento' && m.conceptoId) { if (!a[m.conceptoId]) a[m.conceptoId] = { total: 0, movements: [], icon: db.conceptos.find((c) => c.id === m.conceptoId)?.icon || 'label' }; a[m.conceptoId].total += m.cantidad; a[m.conceptoId].movements.push(m); } return a; }, {});
                const sortedTotals = Object.entries(cTots).sort(([, a], [, b]) => a.total - b.total);
                const colorSuccess = getComputedStyle(document.body).getPropertyValue('--c-chart-positive').trim(), colorDanger = getComputedStyle(document.body).getPropertyValue('--c-danger').trim();
                conceptosChart = new Chart(chartCtx, { type: 'bar', data: { labels: sortedTotals.map(([id]) => toSentenceCase(db.conceptos.find((c) => c.id === id)?.nombre || '?')), datasets: [{ data: sortedTotals.map(([, data]) => data.total / 100), backgroundColor: sortedTotals.map(([, data]) => data.total >= 0 ? colorSuccess : colorDanger), borderRadius: 6, }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, datalabels: { display: false } }, scales: { y: { ticks: { callback: (value) => `${value.toLocaleString(locales[currentLanguage])}` } } } } });
                conceptListContainer.innerHTML = sortedTotals.length === 0 ? `<div class="empty-state" style="padding:16px 0; background:transparent; border:none;"><p>Sin datos para los filtros.</p></div>` : sortedTotals.map(([id, data]) => { const con = db.conceptos.find((c) => c.id === id); const t = data.total; return `<details class="accordion" style="background-color: var(--c-surface-variant);"><summary><span style="display: flex; align-items: center; gap: 8px;"><span class="material-icons" style="font-size: 18px;">${data.icon}</span>${toSentenceCase(con?.nombre || '?')}</span><span><strong class="${t >= 0 ? 'text-positive' : 'text-negative'}">${formatCurrency(t)}</strong><span class="material-icons accordion__icon">expand_more</span></span></summary><div class="accordion__content">${data.movements.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map((mov) => `<div class="transaction-card" data-action="edit-movement" data-id="${mov.id}" style="border:0;"><div class="transaction-card__content" style="padding: var(--sp-1) 0; "><div style="flex-grow:1;min-width:0;"><div class="transaction-card__row-2" style="font-size:0.75rem;">${new Date(mov.fecha).toLocaleDateString(locales[currentLanguage])} - ${escapeHTML(mov.descripcion)}</div></div><div class="transaction-card__amount ${mov.cantidad >= 0 ? 'text-positive' : 'text-negative'}">${formatCurrency(mov.cantidad)}</div></div></div>`).join('')}</div></details>`; }).join('');
            }
        };
        
        // =================================================================================
        // 8. MODAL & FORM HANDLING
        // =================================================================================
		let suggestionDebounceTimer = null;
        const handleDescriptionSuggestion = () => {
            clearTimeout(suggestionDebounceTimer);
            suggestionDebounceTimer = setTimeout(() => {
                const descriptionInput = select('movimiento-descripcion');
                const conceptoSelect = select('movimiento-concepto');
                const cuentaSelect = select('movimiento-cuenta');

                if (!descriptionInput || !conceptoSelect || !cuentaSelect) return;

                const query = descriptionInput.value.trim().toLowerCase();

                // No hacemos nada si el texto es muy corto
                if (query.length < 4) return;

                // Buscamos una coincidencia exacta en nuestro índice
                const suggestion = intelligentIndex.get(query);

                if (suggestion) {
                    // Si encontramos una, aplicamos los valores a los desplegables
                    if (suggestion.conceptoId) {
                        conceptoSelect.value = suggestion.conceptoId;
                        // Aplicamos el feedback visual
                        conceptoSelect.parentElement.classList.add('field-highlighted');
                        setTimeout(() => conceptoSelect.parentElement.classList.remove('field-highlighted'), 1000);
                    }
                    if (suggestion.cuentaId) {
                        cuentaSelect.value = suggestion.cuentaId;
                        // Aplicamos el feedback visual
                        cuentaSelect.parentElement.classList.add('field-highlighted');
                        setTimeout(() => cuentaSelect.parentElement.classList.remove('field-highlighted'), 1000);
                    }
                }
            }, 350); // Un pequeño retardo (debounce) para no ejecutar en cada tecla
        };
        const showModal=(id)=>{
            const m = select(id);
            if (m) {
                const mainScroller = selectOne('.app-layout__main');
                if (mainScroller) { 
					lastScrollTop = mainScroller.scrollTop;
				}
				m.classList.add('modal-overlay--active');
                if(!id.includes('calculator')){
                    const f = m.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (f) (f).focus();
                }
            }
        };

        const hideModal=(id)=>{
            const m = select(id);
            if(m) m.classList.remove('modal-overlay--active');

            const mainScroller = selectOne('.app-layout__main');
            if (mainScroller && lastScrollTop !== null) {
                requestAnimationFrame(() => {
				    mainScroller.scrollTop = lastScrollTop;
                    lastScrollTop = null;
                });
            }
        };

        const showGenericModal=(title,html)=>{(select('generic-modal-title')).textContent=title;(select('generic-modal-body')).innerHTML=html;showModal('generic-modal');};
        const showConfirmationModal=(msg, onConfirm, title="Confirmar Acción")=>{ hapticFeedback('medium'); const id='confirmation-modal';document.getElementById(id)?.remove(); const overlay=document.createElement('div');overlay.id=id;overlay.className='modal-overlay modal-overlay--active'; overlay.innerHTML=`<div class="modal" role="alertdialog" style="border-radius:var(--border-radius-lg)"><div class="modal__header"><h3 class="modal__title">${title}</h3></div><div class="modal__body"><p>${msg}</p><div style="display:flex;gap:var(--sp-3);margin-top:var(--sp-4);"><button class="btn btn--secondary btn--full" data-action="close-modal" data-modal-id="confirmation-modal">Cancelar</button><button class="btn btn--danger btn--full" data-action="confirm-action">Sí, continuar</button></div></div></div>`; document.body.appendChild(overlay); (overlay.querySelector('[data-action="confirm-action"]')).onclick=()=>{hapticFeedback('medium');onConfirm();overlay.remove();}; (overlay.querySelector('[data-action="close-modal"]')).onclick=()=>overlay.remove(); };
        
        const showAccountMovementsModal = async (cId) => {
            const cuenta = getVisibleAccounts().find((c) => c.id === cId);
            if (!cuenta) return;

            showGenericModal(`Movimientos de ${cuenta.nombre}`, `<div style="text-align:center; padding: var(--sp-5);"><span class="spinner"></span><p style="margin-top: var(--sp-3);">Cargando historial...</p></div>`);

            try {
                const movsRef = fbDb.collection('users').doc(currentUser.uid).collection('movimientos');
                
                const regularMovsQuery = movsRef.where('cuentaId', '==', cId).get();
                const originTransfersQuery = movsRef.where('cuentaOrigenId', '==', cId).get();
                const destinationTransfersQuery = movsRef.where('cuentaDestinoId', '==', cId).get();

                const [regularSnapshot, originSnapshot, destinationSnapshot] = await Promise.all([
                    regularMovsQuery, originTransfersQuery, destinationTransfersQuery
                ]);

                const allMovements = new Map();
                const processSnapshot = (snapshot) => {
                    snapshot.forEach(doc => {
                        allMovements.set(doc.id, { id: doc.id, ...doc.data() });
                    });
                };
                processSnapshot(regularSnapshot);
                processSnapshot(originSnapshot);
                processSnapshot(destinationSnapshot);

                const sortedMovements = Array.from(allMovements.values())
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

                let runningBalanceInCents = cuenta.saldo || 0;

                for (const mov of sortedMovements) {
                    if (mov.tipo === 'traspaso') {
                        const otraCuentaId = mov.cuentaOrigenId === cId ? mov.cuentaDestinoId : mov.cuentaOrigenId;
                        const otraCuenta = db.cuentas.find(c => c.id === otraCuentaId);
                        
                        if (mov.cuentaOrigenId === cId) {
                            mov.runningBalanceOrigen = runningBalanceInCents;
                            mov.runningBalanceDestino = otraCuenta?.saldo || 0;
                        } else {
                            mov.runningBalanceOrigen = otraCuenta?.saldo || 0;
                            mov.runningBalanceDestino = runningBalanceInCents;
                        }
                    } else {
                        mov.runningBalance = runningBalanceInCents;
                    }
                    
                    if (mov.tipo === 'traspaso') {
                        if (mov.cuentaOrigenId === cId) {
                            runningBalanceInCents += mov.cantidad;
                        }
                        if (mov.cuentaDestinoId === cId) {
                            runningBalanceInCents -= mov.cantidad;
                        }
                    } else {
                        runningBalanceInCents -= mov.cantidad;
                    }
                }

                const html = sortedMovements.length === 0 
                    ? `<div class="empty-state" style="background:transparent; border:none;">...</div>` 
                    : `<div class="movements-modal-container">
                           ${sortedMovements.map((m) => renderVirtualListItem({type: 'transaction', movement: m})).join('')}
                       </div>`;

                const modalBody = select('generic-modal-body');
                if (modalBody) {
                    modalBody.innerHTML = html;
                }

            } catch (error) {
                console.error("Error al obtener los movimientos de la cuenta:", error);
                showToast("No se pudo cargar el historial de la cuenta.", "danger");
                const modalBody = select('generic-modal-body');
                if (modalBody) {
                    modalBody.innerHTML = `<p class="text-danger" style="text-align:center;">Ha ocurrido un error al cargar los datos.</p>`;
                }
            }
        };
        
        const setMovimientoFormType = (type) => {
            hapticFeedback('light');
            const isTraspaso = type === 'traspaso';

            select('movimiento-fields').classList.toggle('hidden', isTraspaso);
            select('traspaso-fields').classList.toggle('hidden', !isTraspaso);

            select('form-movimiento-title').textContent = isTraspaso ? t('form_type_transfer') : t('form_type_movement');
            
            select('mov-type-btn-movimiento').classList.toggle('filter-pill--active', !isTraspaso);
            select('mov-type-btn-traspaso').classList.toggle('filter-pill--active', isTraspaso);

            // --- INICIO DE LA NUEVA MODIFICACIÓN ---
            // Si se selecciona 'traspaso', se autocompleta la descripción si está vacía.
            if (isTraspaso) {
                const descripcionInput = select('movimiento-descripcion');
                if (descripcionInput && descripcionInput.value.trim() === '') {
                    descripcionInput.value = 'Traspaso';
                }
            }
            // --- FIN DE LA NUEVA MODIFICACIÓN ---
        };

                const startMovementForm = (id = null, isRecurrent = false) => {
            hapticFeedback('medium');
            const form = select('form-movimiento');
            form.reset();
            clearAllErrors(form.id);
            populateAllDropdowns();

            setMovimientoFormType('movimiento'); 
            
            let data = null;
            let mode = 'new';
            const collectionName = isRecurrent ? 'recurrentes' : 'movimientos';
            
            // =================================================================================
            // INICIO DE LA CORRECCIÓN
            // Ahora buscamos en la fuente de datos correcta y añadimos un fallback a la caché.
            // =================================================================================
            if (id) {
                const dataSource = isRecurrent ? db.recurrentes : db.movimientos;
                data = dataSource.find(item => item.id === id);

                // Si no lo encontramos en la fuente principal Y NO es recurrente, buscamos en la caché de recientes.
                if (!data && !isRecurrent) {
                    data = recentMovementsCache.find(item => item.id === id);
                }
                
                if (data) { // Solo cambiamos el modo si encontramos datos
                   mode = isRecurrent ? 'edit-recurrent' : 'edit-single';
                }
            }
            // =================================================================================
            // FIN DE LA CORRECCIÓN
            // =================================================================================
        
			select('movimiento-mode').value = mode;
            select('movimiento-id').value = id || '';
        
            if (data?.tipo === 'traspaso') {
                setMovimientoFormType('traspaso');
            }
        
            select('form-movimiento-title').textContent = id && data ? (data?.tipo === 'traspaso' ? 'Editar Traspaso' : 'Editar Movimiento') : 'Añadir Movimiento';
            select('movimiento-cantidad').value = data ? `${(data.cantidad / 100).toLocaleString(locales[currentLanguage], { minimumFractionDigits: 2 })}` : '';
            
            const fecha = data?.fecha ? new Date(data.fecha) : new Date();
            select('movimiento-fecha').value = new Date(fecha.getTime() - (fecha.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
            select('movimiento-descripcion').value = data?.descripcion || '';
        
            if (data?.tipo === 'traspaso') {
                select('movimiento-cuenta-origen').value = data?.cuentaOrigenId || '';
                select('movimiento-cuenta-destino').value = data?.cuentaDestinoId || '';
            } else {
                select('movimiento-cuenta').value = data?.cuentaId || '';
                select('movimiento-concepto').value = data?.conceptoId || '';
            }
        
            const recurrenteCheckbox = select('movimiento-recurrente');
            const recurrentOptions = select('recurrent-options');
            if (mode === 'edit-recurrent' && data) { // Añadido chequeo de 'data'
                recurrenteCheckbox.checked = true;
                select('recurrent-frequency').value = data.frequency;
                select('recurrent-next-date').value = data.nextDate;
                select('recurrent-end-date').value = data.endDate || '';
                recurrentOptions.classList.remove('hidden');
            } else {
                recurrenteCheckbox.checked = false;
                recurrentOptions.classList.add('hidden');
            }
            
            select('delete-movimiento-btn').classList.toggle('hidden', !id || !data);
            select('delete-movimiento-btn').dataset.isRecurrent = isRecurrent;
            select('duplicate-movimiento-btn').classList.toggle('hidden', !(mode === 'edit-single' && data));
            
            showModal('movimiento-modal');
        };

									   
        let calculatorKeyboardHandler = null; // Declare in global scope

        const showCalculator = (targetInput) => {
            calculatorState.targetInput = targetInput;
            const currentValue = targetInput.value.trim();
            const parsedValue = parseCurrencyString(currentValue);

            if (!isNaN(parsedValue)) {
                calculatorState.displayValue = String(parsedValue); // Store with dot internally
            } else {
                calculatorState.displayValue = '0';
            }
            calculatorState.waitingForNewValue = true;
            updateCalculatorDisplay();

            // === INICIO DEL CAMBIO ===
            // 1. Definimos la función que manejará las pulsaciones del teclado
            calculatorKeyboardHandler = (e) => {
                // Evita que el evento se propague si ya ha sido manejado por otro sitio
                if (e.defaultPrevented) return;

                const key = e.key; // La tecla que se ha pulsado

                // Mapeamos las teclas del teclado a las acciones de la calculadora
                if (key >= '0' && key <= '9') {
                    handleCalculatorInput(key);
                    e.preventDefault(); // Evita el comportamiento por defecto de la tecla (ej. scroll)
                } else if (key === '.' || key === ',') {
                    handleCalculatorInput('comma');
                    e.preventDefault();
                } else if (key === 'Backspace') {
                    handleCalculatorInput('backspace');
                    e.preventDefault();
                } else if (key === 'Enter') {
                    handleCalculatorInput('done');
                    e.preventDefault();
                } else if (key === 'Escape') {
                    hideCalculator(); // Cierra la calculadora con la tecla Escape
                    e.preventDefault();
                } else if (key === '-') {
                    handleCalculatorInput('sign'); // Para el signo +/-
                    e.preventDefault();
                } else if (key.toUpperCase() === 'C') { // Para la tecla 'C' de borrar
                    handleCalculatorInput('clear');
                    e.preventDefault();
                }
            };
            // 2. Añadimos el "escuchador de eventos" al documento entero
            // Esto asegura que la calculadora capture las teclas sin importar dónde esté el foco
            document.addEventListener('keydown', calculatorKeyboardHandler);
            // === FIN DEL CAMBIO ===

            showModal('calculator-modal');
        };
        
        const hideCalculator = () => {
            hideModal('calculator-modal');
            calculatorState.targetInput = null;

            // === INICIO DEL CAMBIO ===
            // Eliminamos el escuchador de eventos del teclado cuando la calculadora se cierra
            if (calculatorKeyboardHandler) {
                document.removeEventListener('keydown', calculatorKeyboardHandler);
                calculatorKeyboardHandler = null; // Limpiamos la variable
            }
            // === FIN DEL CAMBIO ===
        };
        
                
        const handleCalculatorInput = (key) => {
            hapticFeedback('light');
            let { displayValue, waitingForNewValue } = calculatorState;
			// Removed: let calculatorKeyboardHandler = null; // This was redeclaring the global variable
            
            switch(key) {
                case 'done': 
                    hapticFeedback('medium'); 
                    if (calculatorState.targetInput) {
                        const finalValue = parseFloat(displayValue) || 0;
                        // Format with comma for Spanish locale in the input field
                        calculatorState.targetInput.value = finalValue.toLocaleString(locales[currentLanguage], { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });
                    }
                    hideCalculator(); 
                    return;
                case 'comma': 
                    if (!displayValue.includes('.')) { 
                        displayValue += '.'; 
                    } 
                    waitingForNewValue = false;
                    break;
                case 'clear': 
                    displayValue = '0'; 
                    waitingForNewValue = true; 
                    break;
                case 'backspace': 
                    displayValue = displayValue.slice(0, -1);
                    if (displayValue === '' || displayValue === '-') { // Handle case where only '-' is left
                        displayValue = '0';
                        waitingForNewValue = true;
                    }
                    break;
                case 'sign': 
                    if (displayValue !== '0') { 
                        displayValue = displayValue.startsWith('-') ? displayValue.slice(1) : `-${displayValue}`; 
                    } 
                    break;
                default:
                    if (waitingForNewValue || displayValue === '0' && key !== '0') { 
                        displayValue = key; 
                        waitingForNewValue = false; 
                    } else if (displayValue === '0' && key === '0') {
                        // If current display is '0' and user types '0', keep it '0'
                        displayValue = '0';
                    }
                    else { 
                        displayValue += key; 
                    } 
                    break;
            }
            
            calculatorState.displayValue = displayValue; // Still with dot internally
            calculatorState.waitingForNewValue = waitingForNewValue;
            updateCalculatorDisplay();
        };

        const updateCalculatorDisplay = () => {
            const display = select('calculator-display');
            if (display) { 
                // Display with comma for UI
                display.textContent = parseFloat(calculatorState.displayValue).toLocaleString(locales[currentLanguage], { 
                    minimumFractionDigits: calculatorState.displayValue.includes('.') ? calculatorState.displayValue.split('.').length : 0,
                    maximumFractionDigits: 20 // Allow many decimal places for calculator display
                }); 
            }
            if (calculatorState.targetInput) {
                const numValue = parseFloat(calculatorState.displayValue) || 0;
                // Update target input value with comma, formatted to 2 decimal places and no grouping
                calculatorState.targetInput.value = numValue.toLocaleString(locales[currentLanguage], { 
                    useGrouping: false,
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                });
            }
        };

        const showGlobalSearchModal = () => {
            hapticFeedback('medium');
            showModal('global-search-modal');
            setTimeout(() => {
                const input = select('global-search-input');
                input.focus();
                input.value = '';
                input.dispatchEvent(new Event('input'));
            }, 100);
        };
        
        // =================================================================================
        // INICIO: BÚSQUEDA GLOBAL MEJORADA (CONSULTA DIRECTA A BBDD)
        // =================================================================================
        const performGlobalSearch = async (query) => { // AÑADIDO: La función ahora es 'async'
            const resultsContainer = select('global-search-results');
            if (!query || query.trim().length < 2) {
                resultsContainer.innerHTML = `<div class="empty-state" style="background:transparent; border: none;"><span class="material-icons">manage_search</span><h3 data-i18n="search_empty_title">Encuéntralo todo</h3><p data-i18n="search_empty_text">Busca movimientos, cuentas o conceptos. <br>Atajo: <strong>Cmd/Ctrl + K</strong></p></div>`;
                return;
            }

            // AÑADIDO: Mostramos un indicador de carga mientras se busca en la BBDD
            resultsContainer.innerHTML = `<div style="text-align: center; padding: var(--sp-5);"><span class="spinner"></span><p style="margin-top: var(--sp-2);">Buscando en toda tu base de datos...</p></div>`;
            
            const queryLower = query.toLowerCase();
            let resultsHtml = '';
            const MAX_RESULTS_PER_GROUP = 10; // Aumentamos un poco el límite de resultados

            // --- Búsqueda en Movimientos (Mejorada) ---
            // AÑADIDO: Llamamos a nuestra nueva función para obtener TODOS los movimientos
            const allMovements = await fetchAllMovementsForSearch();

            const movs = allMovements
                .map(m => {
                    const concepto = db.conceptos.find(c => c.id === m.conceptoId)?.nombre || '';
                    let cuentaInfo = '';
                    if (m.tipo === 'traspaso') {
                        const origen = db.cuentas.find(c => c.id === m.cuentaOrigenId)?.nombre || '';
                        const destino = db.cuentas.find(c => c.id === m.cuentaDestinoId)?.nombre || '';
                        cuentaInfo = `${origen} ${destino}`;
                    } else {
                        cuentaInfo = db.cuentas.find(c => c.id === m.cuentaId)?.nombre || '';
                    }
                    const fecha = new Date(m.fecha).toLocaleDateString(locales[currentLanguage], { day: 'numeric', month: 'long', year: 'numeric' });
                    const importe = (m.cantidad / 100).toLocaleString(locales[currentLanguage]);
                    const searchableText = `${m.descripcion} ${concepto} ${cuentaInfo} ${fecha} ${importe}`.toLowerCase();
                    return { movement: m, text: searchableText };
                })
                .filter(item => item.text.includes(queryLower))
                .sort((a, b) => new Date(b.movement.fecha) - new Date(a.movement.fecha))
                .slice(0, MAX_RESULTS_PER_GROUP)
                .map(item => item.movement);

            if (movs.length > 0) {
                resultsHtml += `<div class="search-result-group__title">Movimientos Encontrados</div>`;
                movs.forEach(m => {
                    const concepto = db.conceptos.find(c => c.id === m.conceptoId)?.nombre || '';
                    const amountClass = m.cantidad >= 0 ? 'text-positive' : 'text-negative';
                    resultsHtml += `
                        <button class="search-result-item" data-action="search-result-movimiento" data-id="${m.id}">
                            <span class="material-icons search-result-item__icon">receipt_long</span>
                            <div class="search-result-item__details" style="flex-grow: 1;">
                                <p>${escapeHTML(m.descripcion)}</p>
                                <small>${new Date(m.fecha).toLocaleDateString(locales[currentLanguage])} • ${escapeHTML(concepto)}</small>
                            </div>
                            <strong class="${amountClass}">${formatCurrency(m.cantidad)}</strong>
                        </button>`;
                });
            }
        
            // --- Búsqueda en Cuentas y Conceptos (sin cambios en la lógica) ---
            const cuentas = (db.cuentas || []).filter(c => c.nombre.toLowerCase().includes(queryLower) || c.tipo.toLowerCase().includes(queryLower)).slice(0, MAX_RESULTS_PER_GROUP);
            if (cuentas.length > 0) {
                resultsHtml += `<div class="search-result-group__title">Cuentas</div>`;
                cuentas.forEach(c => { resultsHtml += `<button class="search-result-item" data-action="search-result-cuenta" data-id="${c.id}"><span class="material-icons search-result-item__icon">account_balance_wallet</span><div class="search-result-item__details"><p>${escapeHTML(c.nombre)}</p><small>${escapeHTML(c.tipo)}</small></div></button>`; });
            }
        
            const conceptos = (db.conceptos || []).filter(c => c.nombre.toLowerCase().includes(queryLower)).slice(0, MAX_RESULTS_PER_GROUP);
            if (conceptos.length > 0) {
                resultsHtml += `<div class="search-result-group__title">Conceptos</div>`;
                conceptos.forEach(c => { resultsHtml += `<button class="search-result-item" data-action="search-result-concepto" data-id="${c.id}"><span class="material-icons search-result-item__icon">label</span><div class="search-result-item__details"><p>${escapeHTML(c.nombre)}</p></div></button>`; });
            }
        
            if (!resultsHtml) {
                resultsHtml = `<div class="empty-state" style="background:transparent; border: none;"><span class="material-icons">search_off</span><h3>Sin resultados</h3><p>No se encontró nada para "${escapeHTML(query)}".</p></div>`;
            }
            resultsContainer.innerHTML = resultsHtml;
        };
        // =================================================================================
        // FIN: BÚSQUEDA GLOBAL MEJORADA
        // =================================================================================

        // =================================================================================
        // 9. FORM HANDLERS & MODAL CONTENT
        // =================================================================================
		 const showHelpModal = () => {
    const helpHTML = t('help_content');
    showGenericModal(t('help_title'), helpHTML);
};
        
        const showConceptosModal = () => { 
            const html = `
                <form id="add-concepto-form" novalidate style="margin-bottom: var(--sp-4);">
                    <div class="form-grid"><div class="form-group" style="grid-column: 1 / -1;"><label for="new-concepto-nombre" class="form-label">Nombre del Concepto</label><input type="text" id="new-concepto-nombre" class="form-input" placeholder="Ej: Nómina" required></div></div>
                    <button type="submit" class="btn btn--primary btn--full">Añadir Concepto</button>
                </form>
                <hr style="border-color: var(--c-outline); opacity: 0.5;"><h4 style="margin-top: var(--sp-4); margin-bottom: var(--sp-2); font-size: var(--fs-base); color: var(--c-on-surface-secondary);">Conceptos Existentes</h4><div id="conceptos-modal-list"></div>`; 
            showGenericModal('Gestionar Conceptos', html); 
            renderConceptosModalList(); 
        };
        
        const renderConceptosModalList = () => { 
            const list = select('conceptos-modal-list'); 
            if (!list) return; 
            list.innerHTML = (db.conceptos || []).length === 0 
                ? `<p style="font-size:var(--fs-sm); color:var(--c-on-surface-secondary); text-align:center; padding: var(--sp-4) 0;">No hay conceptos.</p>` 
                : [...db.conceptos].sort((a,b) => a.nombre.localeCompare(b.nombre)).map((c) => `<div id="concepto-item-${c.id}" class="modal__list-item"><div style="display: flex; align-items: center; gap: 12px; flex-grow: 1; min-width: 0;"><span class="material-icons" style="color: var(--c-primary);">${c.icon || 'label'}</span><span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(c.nombre)}</span></div><div style="display: flex; align-items: center; gap: var(--sp-1); flex-shrink: 0;"><button class="icon-btn" data-action="edit-concepto" data-id="${c.id}" title="Editar Concepto"><span class="material-icons">edit_note</span></button><button class="icon-btn" data-action="delete-concepto" data-id="${c.id}" title="Eliminar Concepto"><span class="material-icons">delete_outline</span></button></div></div>`).join(''); 
        };
        
        const showConceptoEditForm = (id) => {
            const itemContainer = select(`concepto-item-${id}`);
            const concepto = db.conceptos.find(c => c.id === id);
            if (!itemContainer || !concepto) return;
            itemContainer.innerHTML = `
                <form class="inline-edit-form" data-id="${id}" novalidate>
                    <div class="form-group" style="margin-bottom: 0;"><label class="form-label" for="edit-concepto-nombre-${id}">Nombre</label><input type="text" id="edit-concepto-nombre-${id}" class="form-input" value="${escapeHTML(concepto.nombre)}" required></div>
                    <div style="display:flex; justify-content: flex-end; gap: var(--sp-2); align-items: center; margin-top: var(--sp-2);"><button type="button" class="btn btn--secondary" data-action="cancel-edit-concepto">Cancelar</button><button type="button" class="btn btn--primary" data-action="save-edited-concepto" data-id="${id}">Guardar</button></div>
                </form>`;
            select(`edit-concepto-nombre-${id}`).focus();
        };
        const handleSaveEditedConcept = async (id, btn) => {
            const nombreInput = select(`edit-concepto-nombre-${id}`);
            const nombre = nombreInput.value.trim();
            if (!nombre) { showToast('El nombre es obligatorio.', 'warning'); nombreInput.classList.add('form-input--invalid'); return; }
            
            await saveDoc('conceptos', id, { nombre }, btn);
			hapticFeedback('success');
			showToast('Concepto actualizado.');
			renderConceptosModalList();
        };

        const showCuentasModal = () => { 
            const existingAccountTypes = [...new Set((db.cuentas || []).map(c => c.tipo))].sort();
            const datalistOptions = existingAccountTypes.map(type => `<option value="${type}"></option>`).join('');
            const html = `
            <form id="add-cuenta-form" novalidate>
                <div class="form-group"><label for="new-cuenta-nombre" class="form-label">Nombre de la Cuenta</label><input type="text" id="new-cuenta-nombre" class="form-input" placeholder="Ej: Cartera personal" required></div>
                <div class="form-group"><label for="new-cuenta-tipo" class="form-label">Tipo de Cuenta</label><input type="text" id="new-cuenta-tipo" class="form-input" list="tipos-cuenta-list" placeholder="Ej: Banco, Cripto, Fintech..." required><datalist id="tipos-cuenta-list">${datalistOptions}</datalist></div>
                <button type="submit" class="btn btn--primary btn--full" style="margin-top: var(--sp-3)">Añadir Cuenta</button>
            </form>
            <hr style="margin: var(--sp-4) 0; border-color: var(--c-outline); opacity: 0.5;"><h4 style="margin-top: var(--sp-4); margin-bottom: var(--sp-2); font-size: var(--fs-base); color: var(--c-on-surface-secondary);">Cuentas Existentes</h4><div id="cuentas-modal-list"></div>`; 
            showGenericModal('Gestionar Cuentas', html); 
            renderCuentasModalList(); 
        };
    
        const renderCuentasModalList = () => {
            const list = select('cuentas-modal-list');
            if (!list) return;
            list.innerHTML = (db.cuentas || []).length === 0 
                ? `<p style="font-size:var(--fs-sm); color:var(--c-on-surface-secondary); text-align:center; padding: var(--sp-4) 0;">No hay cuentas.</p>`
                : [...db.cuentas].sort((a,b) => a.nombre.localeCompare(b.nombre)).map((c) => `
                    <div class="modal__list-item" id="cuenta-item-${c.id}">
                    <div style="display: flex; flex-direction: column; flex-grow: 1; min-width: 0;"><span style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(c.nombre)}</span><small style="color: var(--c-on-surface-secondary); font-size: var(--fs-xs);">${toSentenceCase(escapeHTML(c.tipo))}</small></div>
                    <div style="display: flex; align-items: center; gap: var(--sp-1); flex-shrink: 0;"><div class="form-switch-group" style="gap: var(--sp-2);"><label for="offbalance-toggle-${c.id}" style="font-size: var(--fs-xs); color: var(--c-on-surface-secondary);" title="Marcar como 'Contabilidad B'">B</label><label class="form-switch"><input type="checkbox" id="offbalance-toggle-${c.id}" data-action="toggle-off-balance" data-id="${c.id}" ${c.offBalance ? 'checked' : ''}><span class="slider"></span></label></div><button class="icon-btn" data-action="edit-cuenta" data-id="${c.id}" title="Editar Cuenta"><span class="material-icons">edit_note</span></button><button class="icon-btn" data-action="delete-cuenta" data-id="${c.id}" title="Eliminar Cuenta"><span class="material-icons">delete_outline</span></button></div>
                    </div>`).join('');
        };
    
        const showAccountEditForm = (id) => {
            const itemContainer = select(`cuenta-item-${id}`);
            const cuenta = db.cuentas.find(c => c.id === id);
            if (!itemContainer || !cuenta) return;
            itemContainer.innerHTML = `
                <form class="inline-edit-form" data-id="${id}" novalidate>
                    <div class="form-grid">
                                                <div class="form-group" style="margin-bottom: 0;"><label class="form-label" for="edit-cuenta-nombre-${id}">Nombre</label><input type="text" id="edit-cuenta-nombre-${id}" class="form-input" value="${escapeHTML(cuenta.nombre)}" required></div>
                        <div class="form-group" style="margin-bottom: 0;"><label class="form-label" for="edit-cuenta-tipo-${id}">Tipo</label><input type="text" id="edit-cuenta-tipo-${id}" class="form-input" list="tipos-cuenta-list" value="${escapeHTML(cuenta.tipo)}" required></div>
                    </div>
                    <div style="display:flex; justify-content: flex-end; gap: var(--sp-2); align-items: center; margin-top: var(--sp-2);"><button type="button" class="btn btn--secondary" data-action="cancel-edit-cuenta">Cancelar</button><button type="button" class="btn btn--primary" data-action="save-edited-cuenta" data-id="${id}">Guardar</button></div>
                </form>`;
            select(`edit-cuenta-nombre-${id}`).focus();
        };
    
        const handleSaveEditedAccount = async (id, btn) => {
            const nombreInput = select(`edit-cuenta-nombre-${id}`);
            const tipoInput = select(`edit-cuenta-tipo-${id}`);
            const nombre = nombreInput.value.trim();
            const tipo = toSentenceCase(tipoInput.value.trim());
        
            if (!nombre || !tipo) { showToast('El nombre y el tipo no pueden estar vacíos.', 'warning'); if (!nombre) nombreInput.classList.add('form-input--invalid'); if (!tipo) tipoInput.classList.add('form-input--invalid'); return; }
            
            await saveDoc('cuentas', id, { nombre, tipo }, btn);
            hapticFeedback('success');
            showToast('Cuenta actualizada.');
            renderCuentasModalList();
        };

        const showRecurrentesModal = () => {
            let html = `<p class="form-label" style="margin-bottom: var(--sp-3);">Aquí puedes ver y gestionar tus operaciones programadas. Se crearán automáticamente en su fecha de ejecución.</p><div id="recurrentes-modal-list"></div>`;
            showGenericModal('Gestionar Movimientos Recurrentes', html);
            renderRecurrentesModalList();
        };

        const renderRecurrentesModalList = () => {
            const list = select('recurrentes-modal-list');
            if (!list) return;
            const recurrentes = [...(db.recurrentes || [])].sort((a,b) => new Date(a.nextDate) - new Date(b.nextDate));
            list.innerHTML = recurrentes.length === 0 
                ? `<div class="empty-state" style="background:transparent; padding:var(--sp-4) 0; border: none;"><span class="material-icons">event_repeat</span><h3>Sin operaciones programadas</h3><p>Puedes crear una al añadir un nuevo movimiento.</p></div>`
                : recurrentes.map(r => {
                    const nextDate = new Date(r.nextDate).toLocaleDateString(locales[currentLanguage], { day: '2-digit', month: 'short', year: 'numeric' });
                    const frequencyMap = { daily: 'Diaria', weekly: 'Semanal', monthly: 'Mensual', yearly: 'Anual' };
                    const amountClass = r.cantidad >= 0 ? 'text-positive' : 'text-negative';
                    const icon = r.cantidad >= 0 ? 'south_west' : 'north_east';
                    return `
                    <div class="modal__list-item" id="recurrente-item-${r.id}">
                        <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1; min-width: 0;">
                            <span class="material-icons ${amountClass}" style="font-size: 20px;">${icon}</span>
                        <div style="display: flex; flex-direction: column; min-width: 0;">
                                <span style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(r.descripcion)}</span>
                                <small style="color: var(--c-on-surface-secondary); font-size: var(--fs-xs);">Próximo: ${nextDate} (${frequencyMap[r.frequency]})</small>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: var(--sp-1); flex-shrink: 0;">
                            <strong class="${amountClass}" style="margin-right: var(--sp-2);">${formatCurrency(r.cantidad)}</strong>
                            <button class="icon-btn" data-action="edit-recurrente" data-id="${r.id}" title="Editar Recurrente"><span class="material-icons">edit</span></button>
                        </div>
                    </div>`
                }).join('');
        };

        // =================================================================================
        // 9.5. DASHBOARD CONFIGURATION MODAL LOGIC
        // =================================================================================
        const showDashboardConfigModal = () => {
            const listContainer = select('dashboard-widget-list');
            if (!listContainer) return;
            
            const currentWidgets = db.config.dashboardWidgets || DEFAULT_DASHBOARD_WIDGETS;
            const currentWidgetSet = new Set(currentWidgets);
            
            const widgetItems = currentWidgets.map(widgetId => {
                const widget = AVAILABLE_WIDGETS[widgetId];
                return { id: widgetId, html: createWidgetConfigItem(widgetId, widget, true) };
            });

            Object.keys(AVAILABLE_WIDGETS).forEach(widgetId => {
                if (!currentWidgetSet.has(widgetId)) {
                    const widget = AVAILABLE_WIDGETS[widgetId];
                    widgetItems.push({ id: widgetId, html: createWidgetConfigItem(widgetId, widget, false) });
                }
            });

            listContainer.innerHTML = widgetItems.map(item => item.html).join('');
            
            setupDragAndDrop();
            showModal('dashboard-config-modal');
        };

        const createWidgetConfigItem = (id, widget, isActive) => {
            return `
                <div class="widget-config-item" draggable="true" data-widget-id="${id}">
                    <span class="material-icons drag-handle">drag_indicator</span>
                    <div class="widget-config-item__details">
                        <div class="widget-config-item__title">${widget.title}</div>
                        <div class="widget-config-item__desc">${widget.description}</div>
                    </div>
                    <label class="form-switch">
                        <input type="checkbox" ${isActive ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>`;
        };

        const setupDragAndDrop = () => {
            const container = select('dashboard-widget-list');
            let draggingElement = null;

            container.addEventListener('dragstart', e => {
                draggingElement = e.target.closest('.widget-config-item');
                if (draggingElement) { setTimeout(() => draggingElement.classList.add('dragging'), 0); }
            });

            container.addEventListener('dragend', e => {
                if (draggingElement) { draggingElement.classList.remove('dragging'); draggingElement = null; }
            });

            container.addEventListener('dragover', e => {
                e.preventDefault();
                const target = e.target.closest('.widget-config-item');
                if (target && target !== draggingElement) {
                    const rect = target.getBoundingClientRect();
                    const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
                    if (next) { container.insertBefore(draggingElement, target.nextSibling); } 
                    else { container.insertBefore(draggingElement, target); }
                }
            });
        };

        const handleSaveDashboardConfig = (btn) => {
            setButtonLoading(btn, true);
            const widgetItems = selectAll('#dashboard-widget-list .widget-config-item');
            
            const newWidgetOrder = Array.from(widgetItems)
                .filter(item => item.querySelector('input[type="checkbox"]').checked)
                .map(item => item.dataset.widgetId);

            db.config.dashboardWidgets = newWidgetOrder;
            
            const userRef = fbDb.collection('users').doc(currentUser.uid);
            userRef.set({ config: db.config }, { merge: true }).then(() => {
                setButtonLoading(btn, false);
                hideModal('dashboard-config-modal');
                hapticFeedback('success');
                showToast('Panel actualizado.');
                renderInicioPage();
            }).catch(err => {
                setButtonLoading(btn, false);
                showToast('Error al guardar la configuración.', 'danger');
            });
        };
        const showManageInvestmentAccountsModal = () => {
            const visibleAccounts = getVisibleAccounts().sort((a, b) => a.nombre.localeCompare(b.nombre));
            let formHtml = `
            <form id="manage-investment-accounts-form" novalidate>
                <p class="form-label" style="margin-bottom: var(--sp-3);">
                    Selecciona las cuentas que quieres que formen parte de tu portafolio de inversión. Estas aparecerán en la sección "Portafolio" para un seguimiento detallado de su rentabilidad.
                </p>
                <div style="max-height: 40vh; overflow-y: auto; padding: var(--sp-2); background: var(--c-surface-variant); border-radius: var(--border-radius-md);">`;

            if (visibleAccounts.length > 0) {
                formHtml += visibleAccounts.map(c => `
                    <div class="form-checkbox-group modal__list-item" style="padding: var(--sp-2);">
                        <input type="checkbox" id="investment-toggle-${c.id}" value="${c.id}" ${c.esInversion ? 'checked' : ''}>
                        <label for="investment-toggle-${c.id}" style="flex-grow: 1;">${escapeHTML(c.nombre)} <small>(${toSentenceCase(c.tipo)})</small></label>
                    </div>
                `).join('');
            } else {
                formHtml += `<p class="empty-state" style="background: transparent; border: none;">No hay cuentas en la contabilidad actual para configurar.</p>`;
            }

            formHtml += `
                </div>
                <div class="modal__actions">
                    <button type="submit" class="btn btn--primary btn--full">Guardar Selección</button>
                </div>
            </form>`;

            showGenericModal('Gestionar Activos de Inversión', formHtml);
        };

        // =================================================================================
        // 10. EVENT LISTENERS & HANDLERS
        // =================================================================================
		           const attachEventListeners = () => {

            const handleDeleteAllData = async (btn) => {
                if (!currentUser) return;
                setButtonLoading(btn, true, 'Borrando...');
                showToast('Iniciando borrado... Esto puede tardar unos segundos.', 'info', 5000);
                const collectionsToDelete = ['movimientos', 'cuentas', 'conceptos', 'presupuestos', 'recurrentes', 'inversiones_historial', 'inversion_cashflows'];
                try {
                    for (const collectionName of collectionsToDelete) {
                        const collectionRef = fbDb.collection('users').doc(currentUser.uid).collection(collectionName);
                        let snapshot;
                        do {
                            snapshot = await collectionRef.limit(400).get();
                            if (snapshot.empty) break;
                            const batch = fbDb.batch();
                            snapshot.docs.forEach(doc => batch.delete(doc.ref));
                            await batch.commit();
                        } while (!snapshot.empty);
                    }
                    await fbDb.collection('users').doc(currentUser.uid).set({ config: getInitialDb().config });
                    hapticFeedback('success');
                    showToast('¡Todos tus datos han sido eliminados! La aplicación se reiniciará.', 'info', 4000);
                    setTimeout(() => location.reload(), 4000);
                } catch (error) {
                    console.error("Error al borrar todos los datos:", error);
                    showToast("Ocurrió un error grave durante el borrado.", "danger");
                    setButtonLoading(btn, false);
                }
            };

            const handleDeleteAccount = async (btn) => {
                if (!currentUser) return;
                showConfirmationModal('Vas a eliminar tu cuenta PERMANENTEMENTE. Todos tus datos serán borrados y no podrás recuperarlos. Esta acción es irreversible.', async () => {
                    setButtonLoading(btn, true, 'Eliminando...');
                    showToast('Eliminando todos tus datos...', 'info', 4000);
                    try {
                        const collectionsToDelete = ['movimientos', 'cuentas', 'conceptos', 'presupuestos', 'recurrentes', 'inversiones_historial', 'inversion_cashflows'];
                        for (const collectionName of collectionsToDelete) {
                            const collectionRef = fbDb.collection('users').doc(currentUser.uid).collection(collectionName);
                            let snapshot;
                            do {
                                snapshot = await collectionRef.limit(400).get();
                                if (snapshot.empty) break;
                                const batch = fbDb.batch();
                                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                                await batch.commit();
                            } while (!snapshot.empty);
                        }
                        await fbDb.collection('users').doc(currentUser.uid).delete();
                        showToast('Datos eliminados. Eliminando usuario...', 'info', 3000);
                        await fbAuth.currentUser.delete();
                    } catch (error) {
                        console.error("Error al eliminar la cuenta:", error);
                        if (error.code === 'auth/requires-recent-login') {
                            showToast('Por seguridad, debes haber iniciado sesión recientemente. Por favor, cierra sesión y vuelve a entrar antes de eliminar tu cuenta.', 'danger', 8000);
                        } else {
                            showToast('Ocurrió un error al eliminar tu cuenta.', 'danger');
                        }
                        setButtonLoading(btn, false);
                    }
                }, '¿Eliminar Cuenta Permanentemente?');
            };
            
			document.body.addEventListener('change', e => {
                if (e.target.name === 'theme-option') {
                    const newTheme = e.target.value;
                    document.body.dataset.theme = newTheme;
                    localStorage.setItem('appTheme', newTheme);
                    hapticFeedback('light');

                    if (conceptosChart) conceptosChart.destroy();
                    if (liquidAssetsChart) liquidAssetsChart.destroy();
                    if (informesChart) informesChart.destroy();
                    
                    const activePageId = document.querySelector('.view--active')?.id;
                    if (activePageId) {
                        navigateTo(activePageId, true);
                    }
                }
                if (e.target.name === 'language-option') {
                    currentLanguage = e.target.value;
                    localStorage.setItem('appLanguage', currentLanguage);
                    document.documentElement.lang = currentLanguage;
                    applyStaticTranslations();
                    hapticFeedback('light');
                     const activePageId = document.querySelector('.view--active')?.id;
                    if (activePageId) {
                        navigateTo(activePageId, true);
                    }
                }
            });
            
            document.body.addEventListener('click', async (e) => {
                const target = e.target;
                const actionTarget = target.closest('[data-action]');
                
                const suggestionsBox = select('description-suggestions');
            if (suggestionsBox && suggestionsBox.style.display === 'block' && !target.closest('#movimiento-descripcion') && !target.closest('#description-suggestions')) {
                suggestionsBox.style.display = 'none';
            }

            const modalOverlay = target.closest('.modal-overlay');
            if (modalOverlay && target === modalOverlay && !modalOverlay.id.includes('calculator') && !modalOverlay.id.includes('onboarding')) return hideModal(modalOverlay.id);
            if (!actionTarget) return; 

            // ===== INICIO DE LA CORRECCIÓN =====
            // Declaramos las variables aquí, al principio, para que estén disponibles en todo el listener.
            const { action, id, page, type, modalId, view } = actionTarget.dataset;
            const btn = actionTarget.closest('button');

            // Ahora la lógica del onboarding puede acceder a 'action' sin problemas.
            if (onboardingState.isActive) {
                const currentStepConfig = onboardingSteps[onboardingState.currentStep];
                if (currentStepConfig.waitForAction && action === currentStepConfig.waitForAction) {
                    advanceOnboarding();
                }
            }
            // ===== FIN DE LA CORRECCIÓN =====
            
            const actions = {
				'confirm-recurrent': async (event) => {
    const actionTarget = event.target.closest('[data-action]');
    if (!actionTarget) return;

    const { id } = actionTarget.dataset;
    const btn = actionTarget.closest('button');
    if (!id || !btn) return;

    try {
        setButtonLoading(btn, true);

        const recurrente = db.recurrentes.find(r => r.id === id);
        if (!recurrente) {
            showToast('Error: No se encontró la operación recurrente.', 'danger');
            return;
        }

        const fechaDeEjecucion = parseDateStringAsUTC(recurrente.nextDate);
        const newMovement = {
            id: generateId(),
            fecha: fechaDeEjecucion.toISOString(),
            cantidad: recurrente.cantidad,
            descripcion: recurrente.descripcion,
            tipo: recurrente.tipo,
            cuentaId: recurrente.cuentaId,
            conceptoId: recurrente.conceptoId,
            cuentaOrigenId: recurrente.cuentaOrigenId,
            cuentaDestinoId: recurrente.cuentaDestinoId,
            sourceRecurrenceId: recurrente.id
        };

        const newNextDate = calculateNextDueDate(fechaDeEjecucion, recurrente.frequency);
        const newNextDateString = newNextDate.toISOString().slice(0, 10);

        const batch = fbDb.batch();
        const movRef = fbDb.collection('users').doc(currentUser.uid).collection('movimientos').doc(newMovement.id);
        const recRef = fbDb.collection('users').doc(currentUser.uid).collection('recurrentes').doc(id);

        batch.set(movRef, newMovement);
        batch.update(recRef, { nextDate: newNextDateString });
        
        if (newMovement.tipo === 'traspaso') {
            await updateAccountBalance(newMovement.cuentaOrigenId, -newMovement.cantidad);
            await updateAccountBalance(newMovement.cuentaDestinoId, newMovement.cantidad);
        } else {
            await updateAccountBalance(newMovement.cuentaId, newMovement.cantidad);
        }
        
        await batch.commit();
        
        hapticFeedback('success');
        showToast('Movimiento programado añadido.');
        
        const pendingItem = select(`pending-recurrente-${id}`);
        if(pendingItem) {
            pendingItem.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            pendingItem.style.opacity = '0';
            pendingItem.style.transform = 'scale(0.95)';
            setTimeout(() => pendingItem.remove(), 300);
        }

    } catch (error) {
        console.error("Error al confirmar el movimiento recurrente:", error);
        showToast("No se pudo añadir el movimiento. Revisa tu conexión.", "danger");

    } finally {
        setButtonLoading(btn, false);
    }
},

    'navigate': () => navigateTo(page),
    'help': showHelpModal,
    'exit': handleExitApp,
	'forgot-password': (e) => {
    e.preventDefault();
    const email = prompt("Por favor, introduce el correo electrónico de tu cuenta para restablecer la contraseña:");
    if (email) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                showToast('Se ha enviado un correo para restablecer tu contraseña.', 'info', 5000);
            })
            .catch((error) => {
                console.error("Error al enviar correo de recuperación:", error);
                if (error.code === 'auth/user-not-found') {
                    showToast('No se encontró ninguna cuenta con ese correo.', 'danger');
                } else {
                    showToast('Error al intentar restablecer la contraseña.', 'danger');
                }
            });
    }
},
'show-register': (e) => {
    e.preventDefault();
    const mainButton = document.querySelector('#login-form button[data-action="login"]');
    handleRegister(mainButton);
},
    'import-csv': showCsvImportWizard,
    'toggle-ledger': async () => {
        hapticFeedback('medium');
        isOffBalanceMode = !isOffBalanceMode;
        document.body.dataset.ledgerMode = isOffBalanceMode ? 'B' : 'A';
        const activePage = selectOne('.view--active')?.id || PAGE_IDS.INICIO;
        navigateTo(activePage, false);
        showToast(`Mostrando Contabilidad ${isOffBalanceMode ? 'B' : 'A'}.`, 'info');
    },
    'toggle-off-balance': async () => {
        const checkbox = target.closest('input[type="checkbox"]'); if (!checkbox) return;
        hapticFeedback('light');
        await saveDoc('cuentas', checkbox.dataset.id, { offBalance: checkbox.checked });
    },
    'apply-filters': () => { hapticFeedback('light'); updateDashboardData(); },
    'apply-informe-filters': () => { hapticFeedback('light'); renderInformesPage(); },
    'add-movement': () => startMovementForm(),
    'edit-movement': async () => {
        if (select('generic-modal')?.classList.contains('modal-overlay--active')) {
            hideModal('generic-modal');
        }
        
        let movementData = db.movimientos.find(m => m.id === id);
        if (!movementData) {
            movementData = recentMovementsCache.find(m => m.id === id);
        }

        if (!movementData && id) {
            try {
                const movRef = fbDb.collection('users').doc(currentUser.uid).collection('movimientos').doc(id);
                const doc = await movRef.get();
                if (doc.exists) {
                    movementData = { id: doc.id, ...doc.data() };
                    if (!db.movimientos.some(m => m.id === id)) {
                        db.movimientos.push(movementData);
                    }
                } else {
                    showToast('Error: No se encontró el movimiento.', 'danger');
                    return;
                }
            } catch (error) {
                console.error("Error al obtener el movimiento:", error);
                showToast('No se pudo cargar el movimiento para editar.', 'danger');
                return;
            }
        }
        
        startMovementForm(id, false);
    },			
    'edit-recurrente': () => { hideModal('generic-modal'); startMovementForm(id, true); },
    'delete-movement-from-modal': () => {
        const isRecurrent = (actionTarget.dataset.isRecurrent === 'true');
        const idToDelete = select('movimiento-id').value;
        const collection = isRecurrent ? 'recurrentes' : 'movimientos';
        const message = isRecurrent ? '¿Seguro que quieres eliminar esta operación recurrente?' : '¿Seguro que quieres eliminar este movimiento?';
        
        showConfirmationModal(message, async () => {
            if (!isRecurrent) {
                const movRef = fbDb.collection('users').doc(currentUser.uid).collection('movimientos').doc(idToDelete);
                const doc = await movRef.get();

                if (doc.exists) {
                    const movToDelete = doc.data();
                    if (movToDelete.tipo === 'traspaso') {
                        await updateAccountBalance(movToDelete.cuentaOrigenId, movToDelete.cantidad);
                        await updateAccountBalance(movToDelete.cuentaDestinoId, -movToDelete.cantidad);
                                                            } else {
                        await updateAccountBalance(movToDelete.cuentaId, -movToDelete.cantidad);
                                                            }
                    recentMovementsCache = recentMovementsCache.filter(m => m.id !== idToDelete);
                }
            }
            await deleteDoc(collection, idToDelete);
            hideModal('movimiento-modal');
            hapticFeedback('success');
            showToast('Operación eliminada.');
            
            const currentPage = select('.view--active')?.id;
            if (currentPage === PAGE_IDS.INICIO) {
                _renderRecientesFromCache();
                updateDashboardData();
            } else if (currentPage === PAGE_IDS.MOVIMIENTOS_FULL) {
                loadInitialMovements();
            }
        });
    },
    'delete-concepto': async () => { 
        const movsCheck = await fbDb.collection('users').doc(currentUser.uid).collection('movimientos').where('conceptoId', '==', id).limit(1).get();
        if(!movsCheck.empty) { showToast("Concepto en uso, no se puede borrar.","warning"); return; }
        showConfirmationModal('¿Seguro que quieres eliminar este concepto?', async () => { 
            await deleteDoc('conceptos', id);
            hapticFeedback('success'); 
            showToast("Concepto eliminado.");
        }); 
    },
    'delete-cuenta': async () => { 
        const movsCheck = await fbDb.collection('users').doc(currentUser.uid).collection('movimientos').where('cuentaId', '==', id).limit(1).get();
        if(!movsCheck.empty) { showToast("Cuenta con movimientos, no se puede borrar.","warning",3500); return; }
        showConfirmationModal('¿Seguro que quieres eliminar esta cuenta?', async () => {
            await deleteDoc('cuentas', id);
            hapticFeedback('success');
            showToast("Cuenta eliminada.");
        });
    },
    'close-modal': () => {
        if ((modalId === 'generic-modal' || target.closest('.modal-overlay')?.id === 'generic-modal') && detailInvestmentChart) {
            detailInvestmentChart.destroy();
            detailInvestmentChart = null;
        }
        hideModal(modalId || target.closest('.modal-overlay').id);
    },
    'manage-conceptos': showConceptosModal,
    'manage-cuentas': showCuentasModal,
    'manage-recurrentes': showRecurrentesModal,
    'view-account-details': () => showAccountMovementsModal(id),
    'save-config': () => handleSaveConfig(btn),
    'export-data': () => handleExportData(btn),
	'export-csv': () => handleExportCsv(btn), // <-- AÑADIR ESTA LÍNEA
    'import-data': () => showImportJSONWizard(),
    'clear-data': () => {
        showConfirmationModal('¿Seguro que quieres borrar TODOS tus datos financieros? Esta acción es irreversible.', () => {
            showConfirmationModal('Esta es tu última oportunidad. ¿Estás absolutamente seguro?', () => {
                handleDeleteAllData(actionTarget.closest('button'));
            }, 'Confirmación Final');
        });
    },
    'toggle-account-type-filter': () => { 
        hapticFeedback('light'); 
        if(deselectedAccountTypesFilter.has(type)) { 
            deselectedAccountTypesFilter.delete(type); 
        } else { 
            deselectedAccountTypesFilter.add(type); 
        } 
        renderPatrimonioPage();
    },
    'create-budgets': () => handleCreateBudgets(btn),
    'update-budgets': handleUpdateBudgets,
    'logout': () => showConfirmationModal('¿Seguro que quieres cerrar la sesión?', () => { fbAuth.signOut().then(() => { showToast('Sesión cerrada correctamente.'); }).catch(() => { showToast('Error al cerrar sesión.', 'danger'); }); }, 'Cerrar Sesión'),
    'delete-account': () => handleDeleteAccount(actionTarget.closest('button')),
    'view-investment-detail': () => renderInvestmentAccountDetail(id),
    'manage-investment-accounts': showManageInvestmentAccountsModal,
    'add-aportacion': () => showAportacionModal(),
    'global-search': showGlobalSearchModal,
    'search-result-movimiento': () => { hideModal('global-search-modal'); startMovementForm(id, false); },
    'search-result-cuenta': () => { hideModal('global-search-modal'); showCuentasModal(); setTimeout(() => select(`cuenta-item-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200); },
    'search-result-concepto': () => { hideModal('global-search-modal'); showConceptosModal(); setTimeout(() => select(`concepto-item-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200); },
    'edit-concepto': () => showConceptoEditForm(id),
    'cancel-edit-concepto': renderConceptosModalList,
    'save-edited-concepto': () => handleSaveEditedConcept(id, btn),
    'edit-cuenta': () => showAccountEditForm(id),
    'cancel-edit-cuenta': renderCuentasModalList,
    'save-edited-cuenta': () => handleSaveEditedAccount(id, btn),
    'duplicate-movement': () => handleDuplicateMovement(),
    'start-onboarding-tour': startOnboarding, // CORREGIDO: Llama a la nueva función
'end-tour': endOnboarding,               // CORREGIDO: Llama a la nueva función de finalización
'next-tour-step': advanceOnboarding,     // CORREGIDO: Llama a la nueva función para avanzar
// 'prev-tour-step' se ha eliminado porque el nuevo tour no tiene botón de "Anterior"
'configure-dashboard': showDashboardConfigModal,
    'save-dashboard-config': () => handleSaveDashboardConfig(btn),
    'set-movimiento-type': () => setMovimientoFormType(type),
    'set-inicio-view': () => {
        hapticFeedback('light');
        const isResumen = view === 'resumen';
        selectAll('#inicio-view-switcher .filter-pill').forEach(pill => pill.classList.remove('filter-pill--active'));
        actionTarget.classList.add('filter-pill--active');
        select('inicio-view-resumen').classList.toggle('hidden', !isResumen);
        select('inicio-view-recientes').classList.toggle('hidden', isResumen);

        if (isResumen) {
            updateDashboardData();
        }
    },
    'recalculate-balances': () => {
        showConfirmationModal(
            'Esta acción leerá todo tu historial de transacciones para recalcular y corregir el saldo de cada una de tus cuentas. Es útil si sospechas que hay errores en los saldos. ¿Quieres continuar?',
            () => recalculateAllAccountBalances(actionTarget.closest('button')),
            'Confirmar Recálculo de Saldos'
        );
    },
    'json-wizard-back-2': () => goToJSONStep(1),
    'json-wizard-import-final': () => handleFinalJsonImport(btn),
    'toggle-traspaso-accounts-filter': () => populateTraspasoDropdowns(),
    'setup-pin': showPinSetupModal,
    'show-full-login': handleForgotPin,
    'remove-pin': () => {
        showConfirmationModal('¿Seguro que quieres eliminar el PIN de este dispositivo?', () => {
            localStorage.removeItem('pinUserHash');
            localStorage.removeItem('pinUserEmail');
            hideModal('generic-modal');
            showToast('PIN eliminado.', 'info');
            select('setup-pin-btn-text').textContent = 'Configurar PIN de Acceso';
        });
    },
};    
if (actions[action]) actions[action](e);
            });

            document.body.addEventListener('submit', (e) => {
                e.preventDefault();
                const target = e.target;
                const submitter = e.submitter;
                const handlers = {
                    'login-form': () => handleLogin(submitter),
                    'form-movimiento':() => handleSaveMovement(target, submitter),
                    'add-concepto-form':() => handleAddConcept(submitter),
                    'add-cuenta-form':() => handleAddAccount(submitter),
                    'manage-investment-accounts-form':() => handleSaveInvestmentAccounts(target, submitter),
                    'form-aportacion': () => handleSaveAportacion(target, submitter),
                    'setup-pin-form': async () => {
                        const newPin = select('new-pin').value;
                        const confirmPin = select('confirm-pin').value;
                    
                        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
                            showToast('El PIN debe ser de 4 dígitos numéricos.', 'warning');
                            return;
                        }
                        if (newPin !== confirmPin) {
                            showToast('Los PINs no coinciden.', 'warning');
                            return;
                        }
                    
                        const hashedPin = await hashPin(newPin);
                        localStorage.setItem('pinUserHash', hashedPin);
                        localStorage.setItem('pinUserEmail', currentUser.email);
                        
                        hideModal('generic-modal');
                        showToast('¡PIN configurado con éxito!', 'info');
                        select('setup-pin-btn-text').textContent = 'Cambiar PIN de Acceso';
                    },
                };
                if(handlers[target.id]) handlers[target.id]();
            });

            document.body.addEventListener('input', (e) => {
                const id=(e.target).id;
                if(id && select(`${id}-error`)) clearError(id);
				if (id === 'movimiento-descripcion') {
                    handleDescriptionSuggestion();
                }
            });

            document.body.addEventListener('focusin', (e) => {
                if (e.target.matches('.pin-input')) {
                    handlePinInputInteraction();
                }
                if (e.target.matches('.input-amount-calculator')) {
                    showCalculator(e.target);
                }
            });
            
            document.addEventListener('change', e => {
                const target = e.target;
                if (target.id === 'filter-periodo') { select('custom-date-filters')?.classList.toggle('hidden', target.value !== 'custom'); }
                if (target.id === 'movimiento-recurrente') { select('recurrent-options').classList.toggle('hidden', !target.checked); if(target.checked && !select('recurrent-next-date').value) { select('recurrent-next-date').value = select('movimiento-fecha').value; } }
            });

            select('import-file-input')?.addEventListener('change', (e) => { if(e.target.files) handleJSONFileSelect(e.target.files); });
            select('calculator-grid')?.addEventListener('click', (e) => { const btn = e.target.closest('button'); if(btn && btn.dataset.key) handleCalculatorInput(btn.dataset.key); });
            
            const searchInput = select('global-search-input');
            searchInput?.addEventListener('input', () => { clearTimeout(globalSearchDebounceTimer); globalSearchDebounceTimer = setTimeout(() => { performGlobalSearch(searchInput.value); }, 250); });

            document.body.addEventListener('keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); e.stopPropagation(); showGlobalSearchModal(); }
                const tourOverlay = select('onboarding-tour');
                if(tourOverlay.classList.contains('onboarding-overlay--visible')) {
                    if(e.key === 'ArrowRight') nextTourStep();
                    else if (e.key === 'ArrowLeft') prevTourStep();
                    else if (e.key === 'Escape') endTour();
                }
            });

            const mainScroller = selectOne('.app-layout__main');
            mainScroller?.addEventListener('scroll', () => {
                if (!select(PAGE_IDS.MOVIMIENTOS_FULL)?.classList.contains('view--active')) return;
                const { scrollTop, scrollHeight, clientHeight } = mainScroller;
                if (scrollHeight - scrollTop - clientHeight < 400) {
                    loadMoreMovements();
                }
            });
            
            const dropZone = select('json-drop-zone');
            dropZone?.addEventListener('click', () => select('import-file-input').click());
            dropZone?.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('drag-over'); });
            dropZone?.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('drag-over'); });
            dropZone?.addEventListener('drop', (e) => { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('drag-over'); const file = e.dataTransfer.files; if (file) handleJSONFileSelect(file); });
        
        };

        const handlePinInputInteraction = () => {
            const inputs = selectAll('.pin-input');
            inputs.forEach((input, index) => {
                input.addEventListener('input', () => {
                    if (input.value.length >= 1 && index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                    const pin = Array.from(inputs).map(i => i.value).join('');
                    if (pin.length === 4) {
                        handlePinLogin(pin);
                    }
                });
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !input.value && index > 0) {
                        inputs[index - 1].focus();
                    }
                });
            });
        };

        const showImportJSONWizard = () => {
            jsonWizardState = { file: null, data: null, preview: { counts: {}, meta: {} } };
            goToJSONStep(1);
            select('json-file-error').textContent = '';
            select('json-drop-zone-text').textContent = 'Arrastra tu archivo aquí o haz clic';
            showModal('json-import-wizard-modal');
        };

        const goToJSONStep = (stepNumber) => {
            selectAll('.json-wizard-step').forEach(step => step.style.display = 'none');
            const targetStep = select(`json-wizard-step-${stepNumber}`);
            if (targetStep) targetStep.style.display = 'flex';
        };

        const handleJSONFileSelect = (file) => {
            const errorEl = select('json-file-error');
            errorEl.textContent = '';

            if (!file.type.includes('json')) {
                errorEl.textContent = 'Error: El archivo debe ser de tipo .json.';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    let data = JSON.parse(event.target.result);
                    let dataToAnalyze = data;

                    if (data.meta && data.data) {
                        jsonWizardState.preview.meta = data.meta;
                        dataToAnalyze = data.data;
                    } else {
                        jsonWizardState.preview.meta = { appName: 'Cuentas (Formato Antiguo)', exportDate: 'N/A' };
                    }

                    if (!dataToAnalyze.cuentas || !dataToAnalyze.conceptos || !dataToAnalyze.movimientos) {
                        throw new Error("El archivo no tiene la estructura de una copia de seguridad válida.");
                    }

                    jsonWizardState.data = dataToAnalyze;
                    
                    const counts = {};
                    for (const key in dataToAnalyze) {
                        if (Array.isArray(dataToAnalyze[key])) {
                            counts[key] = dataToAnalyze[key].length;
                        }
                    }
                    jsonWizardState.preview.counts = counts;
                    
                    renderJSONPreview();
                    goToJSONStep(2);

                } catch (error) {
                    console.error("Error al procesar el archivo JSON:", error);
                    errorEl.textContent = `Error: ${error.message}`;
                }
            };
            reader.readAsText(file);
        };

        const renderJSONPreview = () => {
            const previewList = select('json-preview-list');
            const { counts } = jsonWizardState.preview;
            
            const friendlyNames = {
                cuentas: 'Cuentas', conceptos: 'Conceptos', movimientos: 'Movimientos',
                presupuestos: 'Presupuestos', recurrentes: 'Recurrentes',
                inversiones_historial: 'Historial de Inversión', inversion_cashflows: 'Flujos de Capital'
            };
            
            let html = '';
            for(const key in counts) {
                if(counts[key] > 0) {
                    html += `<li><span class="material-icons">check_circle</span> <strong>${counts[key]}</strong> ${friendlyNames[key] || key}</li>`;
                }
            }
            
            previewList.innerHTML = html || `<li><span class="material-icons">info</span>El archivo parece estar vacío.</li>`;
        };

        const handleFinalJsonImport = async (btn) => {
            goToJSONStep(3);
            setButtonLoading(btn, true, 'Importando...');
            select('json-import-progress').style.display = 'block';
            select('json-import-result').style.display = 'none';

            try {
                const dataToImport = jsonWizardState.data;
                const collectionsToClear = ['cuentas', 'conceptos', 'movimientos', 'presupuestos', 'recurrentes', 'inversiones_historial', 'inversion_cashflows'];

                for (const collectionName of collectionsToClear) {
                    const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection(collectionName).get();
                    if (snapshot.empty) continue;
                    let batch = fbDb.batch();
                    let count = 0;
                    for (const doc of snapshot.docs) {
                        batch.delete(doc.ref);
                        count++;
                        if (count >= 450) { await batch.commit(); batch = fbDb.batch(); count = 0; }
                    }
                    if(count > 0) await batch.commit();
                }
                
                for (const collectionName of Object.keys(dataToImport)) {
                    const items = dataToImport[collectionName];
                    if (Array.isArray(items) && items.length > 0) {
                        let batch = fbDb.batch();
                        let count = 0;
                        for (const item of items) {
                            if (item.id) {
                                const docRef = fbDb.collection('users').doc(currentUser.uid).collection(collectionName).doc(item.id);
                                batch.set(docRef, item);
                                count++;
                                if (count >= 450) { await batch.commit(); batch = fbDb.batch(); count = 0; }
                            }
                        }
                        if(count > 0) await batch.commit();
                    } else if (collectionName === 'config') {
                        await fbDb.collection('users').doc(currentUser.uid).set({ config: items }, { merge: true });
                    }
                }
                
                select('json-import-progress').style.display = 'none';
                select('json-import-result').style.display = 'block';
                select('json-result-message').textContent = `Se han importado los datos correctamente. La aplicación se recargará.`;
                hapticFeedback('success');
                
                setTimeout(() => location.reload(), 4000);

            } catch (error) {
                console.error("Error durante la importación final:", error);
                showToast("Error crítico durante la importación.", "danger", 5000);
                select('json-result-title').textContent = '¡Error en la Importación!';
                select('json-result-message').textContent = `Ocurrió un error. Por favor, revisa la consola e inténtalo de nuevo.`;
                select('json-import-result .material-icons').style.color = 'var(--c-danger)';
                setButtonLoading(btn, false);
            }
        };

        const handleDuplicateMovement = () => {
            hapticFeedback('medium');
            select('movimiento-mode').value = 'new';
            select('movimiento-id').value = '';
            select('form-movimiento-title').textContent = 'Duplicar Movimiento';
            select('delete-movimiento-btn').classList.add('hidden');
            select('duplicate-movimiento-btn').classList.add('hidden');
            const today = new Date();
            select('movimiento-fecha').value = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
            showToast('Datos duplicados. Ajusta y guarda.', 'info');
        };

            const handleSaveMovement = async (form, btn) => {
            clearAllErrors(form.id);
            let isValid = true;
            const type = select('mov-type-btn-traspaso').classList.contains('filter-pill--active') ? 'traspaso' : 'movimiento';
            const cantidadValue = parseCurrencyString(select('movimiento-cantidad').value);

            if (isNaN(cantidadValue)) { displayError('movimiento-cantidad', 'La cantidad no es válida.'); isValid = false; }
            if (!select('movimiento-fecha').value) { displayError('movimiento-fecha', 'La fecha es obligatoria.'); isValid = false; }
            
            // --- INICIO DE LA MODIFICACIÓN 1: Validación ajustada ---
            // La descripción solo es obligatoria si NO es un traspaso.
            if (type !== 'traspaso' && !select('movimiento-descripcion').value.trim()) { 
                displayError('movimiento-descripcion', 'La descripción es obligatoria.'); 
                isValid = false; 
            }
            // --- FIN DE LA MODIFICACIÓN 1 ---

            if (type === 'movimiento') {
                if (!select('movimiento-concepto').value) { displayError('movimiento-concepto', 'Elige un concepto.'); isValid = false; }
                if (!select('movimiento-cuenta').value) { displayError('movimiento-cuenta', 'Elige una cuenta.'); isValid = false; }
            } else {
                const origen = select('movimiento-cuenta-origen').value;
                const destino = select('movimiento-cuenta-destino').value;
                if (!origen) { displayError('movimiento-cuenta-origen', 'Elige cuenta origen.'); isValid = false; }
                if (!destino) { displayError('movimiento-cuenta-destino', 'Elige cuenta destino.'); isValid = false; }
                if (origen && destino && origen === destino) { displayError('movimiento-cuenta-destino', 'Las cuentas no pueden ser iguales.'); isValid = false; }
            }
            if (!isValid) { hapticFeedback('error'); showToast('Por favor, revisa los campos marcados en rojo.', 'warning'); return; }
            
            setButtonLoading(btn, true);

            const mode = select('movimiento-mode').value;
            const movementId = select('movimiento-id').value || generateId();
            let oldMovementData = null;

            if (mode.includes('edit')) {
                const oldDocRef = fbDb.collection('users').doc(currentUser.uid).collection('movimientos').doc(movementId);
                const doc = await oldDocRef.get();
                if (doc.exists) {
                    oldMovementData = doc.data();
                }
            }
            
            const newMovementData = {
                id: movementId,
                cantidad: Math.round(cantidadValue * 100),
                // --- INICIO DE LA MODIFICACIÓN 2: Lógica de valor por defecto ---
                // Si es un traspaso y la descripción está vacía, se usa "Traspaso". De lo contrario, se usa el valor del input.
                descripcion: (type === 'traspaso' && select('movimiento-descripcion').value.trim() === '') ? 'Traspaso' : select('movimiento-descripcion').value.trim(),
                // --- FIN DE LA MODIFICACIÓN 2 ---
                tipo: type,
                fecha: parseDateStringAsUTC(select('movimiento-fecha').value).toISOString(),
                cuentaId: select('movimiento-cuenta').value,
                conceptoId: select('movimiento-concepto').value,
                cuentaOrigenId: select('movimiento-cuenta-origen').value,
                cuentaDestinoId: select('movimiento-cuenta-destino').value,
            };
            if (newMovementData.tipo === 'traspaso') { newMovementData.cantidad = Math.abs(newMovementData.cantidad); }

            const isRecurrent = select('movimiento-recurrente').checked;
            
            let saldosPrevios = {};

            if (isRecurrent) {
                const recurrentData = { ...newMovementData, frequency: select('recurrent-frequency').value, nextDate: select('recurrent-next-date').value, endDate: select('recurrent-end-date').value || null };
                await saveDoc('recurrentes', movementId, recurrentData);
            } else {
                let balanceUpdates = [];

               if (oldMovementData) { 
                    if (oldMovementData.tipo === 'traspaso') {
                        balanceUpdates.push({ cuentaId: oldMovementData.cuentaOrigenId, amount: oldMovementData.cantidad }); 
                        balanceUpdates.push({ cuentaId: oldMovementData.cuentaDestinoId, amount: -oldMovementData.cantidad });
                    } else {
                        balanceUpdates.push({ cuentaId: oldMovementData.cuentaId, amount: -oldMovementData.cantidad });
                    }
                }
                
                if (newMovementData.tipo === 'traspaso') {
                    balanceUpdates.push({ cuentaId: newMovementData.cuentaOrigenId, amount: -newMovementData.cantidad });
                    balanceUpdates.push({ cuentaId: newMovementData.cuentaDestinoId, amount: newMovementData.cantidad });
                } else {
                    balanceUpdates.push({ cuentaId: newMovementData.cuentaId, amount: newMovementData.cantidad });
                }

                if (newMovementData.tipo === 'traspaso') {
                    const cuentaOrigen = db.cuentas.find(c => c.id === newMovementData.cuentaOrigenId);
                    const cuentaDestino = db.cuentas.find(c => c.id === newMovementData.cuentaDestinoId);
                    saldosPrevios.origen = cuentaOrigen?.saldo || 0;
                    saldosPrevios.destino = cuentaDestino?.saldo || 0;
                } else {
                    const cuenta = db.cuentas.find(c => c.id === newMovementData.cuentaId);
                    saldosPrevios.cuenta = cuenta?.saldo || 0;
                }
                
                const finalUpdates = balanceUpdates.reduce((acc, up) => {
                    if (up.cuentaId) {
                        acc[up.cuentaId] = (acc[up.cuentaId] || 0) + up.amount;
                    }
                    return acc;
                }, {});

                const updatePromises = Object.entries(finalUpdates).map(([cuentaId, amount]) => updateAccountBalance(cuentaId, amount));

                await Promise.all([
                    saveDoc('movimientos', movementId, newMovementData),
                    ...updatePromises
                ]);
                
                }
            
            if (mode.includes('new') && !isRecurrent) {
                newMovementIdToHighlight = movementId;
            }
            
            setButtonLoading(btn, false);
			hideModal('movimiento-modal');
			hapticFeedback('success');
			showToast(mode === 'new' ? 'Movimiento guardado.' : 'Movimiento actualizado.');
			// ===== INICIO: LÓGICA DE ONBOARDING INTERACTIVO =====
        if (onboardingState.isActive && onboardingSteps[onboardingState.currentStep].waitForAction === 'movement-created') {
            advanceOnboarding();
        }
        // ===== FIN: LÓGICA DE ONBOARDING INTERACTIVO =====
			buildIntelligentIndex();

            if (mode.includes('edit')) {
                db.movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                await processMovementsForRunningBalance(db.movimientos, true);
            }

		if (!isRecurrent) {
        const currentPage = select('.view--active')?.id;
        if(currentPage === PAGE_IDS.INICIO) {

            select('inicio-view-recientes').classList.remove('hidden');
            select('inicio-view-resumen').classList.add('hidden');
            const recientesPill = select('button[data-view="recientes"]');
            const resumenPill = select('button[data-view="resumen"]');
            if (recientesPill && resumenPill) {
                recientesPill.classList.add('filter-pill--active');
                resumenPill.classList.remove('filter-pill--active');
            }
            
            updateDashboardData();
            
        } else if (currentPage === PAGE_IDS.MOVIMIENTOS_FULL) {
            loadInitialMovements();
        }
    }
};

        const handleAddConcept = async (btn) => { 
            const nombre = toSentenceCase((select('new-concepto-nombre')).value.trim());
            if (!nombre) { showToast('El nombre es obligatorio.', 'warning'); return; } 
            const newId = generateId();
            await saveDoc('conceptos', newId, { id: newId, nombre, icon: 'label' }, btn);
            hapticFeedback('success'); 
            showToast('Concepto añadido.');
            (select('add-concepto-form')).reset(); 
        };
        const handleAddAccount = async (btn) => { 
            const nombre = (select('new-cuenta-nombre')).value.trim(); 
            const tipo = toSentenceCase((select('new-cuenta-tipo')).value.trim()); 
            if (!nombre || !tipo) { showToast('El nombre y el tipo son obligatorios.', 'warning'); return; } 
            const newId = generateId();
            await saveDoc('cuentas', newId, { id: newId, nombre, tipo, saldo: 0, esInversion: false, offBalance: isOffBalanceMode, fechaCreacion: new Date().toISOString() }, btn);
            hapticFeedback('success'); 
            showToast('Cuenta añadida.');
            (select('add-cuenta-form')).reset(); 
        };
        const handleSaveConfig = async (btn) => { 
            setButtonLoading(btn, true);
            const newConfig = { skipIntro: select('config-skip-intro').checked, dashboardWidgets: db.config.dashboardWidgets || DEFAULT_DASHBOARD_WIDGETS };
            await fbDb.collection('users').doc(currentUser.uid).set({ config: newConfig }, { merge: true });
            localStorage.setItem('skipIntro', String(newConfig.skipIntro));
            setButtonLoading(btn, false);
            hapticFeedback('success'); showToast('Configuración guardada.'); 
        };

                 const handleExportData = async (btn) => {
            if (!currentUser) { showToast("No hay usuario autenticado.", "danger"); return; }
            setButtonLoading(btn, true, 'Exportando...');
            try {
                const dataPayload = {};
                const collections = ['cuentas', 'conceptos', 'movimientos', 'presupuestos', 'recurrentes', 'inversiones_historial', 'inversion_cashflows'];
                
                for (const collectionName of collections) {
                    const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection(collectionName).get();
                    dataPayload[collectionName] = snapshot.docs.map(doc => doc.data());
                }
                dataPayload.config = db.config;

                const exportObject = {
                    meta: {
                        appName: "Cuentas aiDANaI",
                        version: "2.0.0",
                        exportDate: new Date().toISOString()
                    },
                    data: dataPayload
                };
                
                const jsonString = JSON.stringify(exportObject, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cuentas_aidanai_backup_${new Date().toISOString().slice(0,10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast("Exportación JSON completada.", "info");
            } catch (error) {
                console.error("Error al exportar datos:", error);
                showToast("Error durante la exportación.", "danger");
            } finally {
                setButtonLoading(btn, false);
            }
        };
		const formatDateForCsv = (isoDateString) => {
            if (!isoDateString) return '';
            const date = new Date(isoDateString);
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();
            return `${day}/${month}/${year}`;
        };

        const handleExportCsv = async (btn) => {
            if (!currentUser) { showToast("No hay usuario autenticado.", "danger"); return; }
            setButtonLoading(btn, true, 'Exportando...');
            
            try {
                // 1. Obtener todos los datos necesarios
                const allMovements = await fetchAllMovementsForSearch(); // Reutilizamos esta función para obtener todo
                const allCuentas = db.cuentas;
                const allConceptos = db.conceptos;

                const cuentasMap = new Map(allCuentas.map(c => [c.id, c]));
                const conceptosMap = new Map(allConceptos.map(c => [c.id, c]));

                let csvRows = [];
                const csvHeader = ['FECHA', 'CUENTA', 'CONCEPTO', 'IMPORTE', 'DESCRIPCIÓN'];
                csvRows.push(csvHeader.join(';'));
                
                // 2. Calcular y añadir las filas de Saldo Inicial
                for (const cuenta of allCuentas) {
                    const movementsOfAccount = allMovements.filter(m => {
                        return (m.tipo === 'movimiento' && m.cuentaId === cuenta.id) ||
                               (m.tipo === 'traspaso' && m.cuentaOrigenId === cuenta.id) ||
                               (m.tipo === 'traspaso' && m.cuentaDestinoId === cuenta.id);
                    });

                    const balanceChange = movementsOfAccount.reduce((sum, m) => {
                        if (m.tipo === 'movimiento') return sum + m.cantidad;
                        if (m.tipo === 'traspaso' && m.cuentaOrigenId === cuenta.id) return sum - m.cantidad;
                        if (m.tipo === 'traspaso' && m.cuentaDestinoId === cuenta.id) return sum + m.cantidad;
                        return sum;
                    }, 0);
                    
                    const initialBalance = (cuenta.saldo || 0) - balanceChange;
                    
                    if (initialBalance !== 0) {
                        const cuentaNombre = `${cuenta.offBalance ? 'N-' : ''}${cuenta.nombre}`;
                        const importeStr = (initialBalance / 100).toLocaleString('es-ES', { useGrouping: false, minimumFractionDigits: 2 });
                        const fechaCreacion = cuenta.fechaCreacion ? formatDateForCsv(cuenta.fechaCreacion) : '01/01/2025';

                        csvRows.push([fechaCreacion, `"${cuentaNombre}"`, 'INICIAL', importeStr, '"Saldo Inicial"'].join(';'));
                    }
                }
                
                // 3. Procesar todos los movimientos
                const sortedMovements = allMovements.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

                for (const mov of sortedMovements) {
                    const fecha = formatDateForCsv(mov.fecha);
                    const descripcion = `"${mov.descripcion.replace(/"/g, '""')}"`; // Escapar comillas dobles
                    const importeStr = (mov.cantidad / 100).toLocaleString('es-ES', { useGrouping: false, minimumFractionDigits: 2 });

                    if (mov.tipo === 'traspaso') {
                        const cuentaOrigen = cuentasMap.get(mov.cuentaOrigenId);
                        const cuentaDestino = cuentasMap.get(mov.cuentaDestinoId);
                        
                        if (cuentaOrigen && cuentaDestino) {
                            // Crear dos filas, una por cada lado del traspaso
                            const nombreOrigen = `${cuentaOrigen.offBalance ? 'N-' : ''}${cuentaOrigen.nombre}`;
                            const nombreDestino = `${cuentaDestino.offBalance ? 'N-' : ''}${cuentaDestino.nombre}`;
                            const importeNegativo = (-mov.cantidad / 100).toLocaleString('es-ES', { useGrouping: false, minimumFractionDigits: 2 });
                            
                            csvRows.push([fecha, `"${nombreOrigen}"`, 'TRASPASO', importeNegativo, descripcion].join(';'));
                            csvRows.push([fecha, `"${nombreDestino}"`, 'TRASPASO', importeStr, descripcion].join(';'));
                        }
                    } else { // Movimiento normal
                        const cuenta = cuentasMap.get(mov.cuentaId);
                        const concepto = conceptosMap.get(mov.conceptoId);

                        if (cuenta && concepto && concepto.nombre !== 'Saldo Inicial') {
                            const nombreCuenta = `${cuenta.offBalance ? 'N-' : ''}${cuenta.nombre}`;
                            csvRows.push([fecha, `"${nombreCuenta}"`, `"${concepto.nombre}"`, importeStr, descripcion].join(';'));
                        }
                    }
                }

                // 4. Crear y descargar el archivo
                const csvString = csvRows.join('\r\n');
                const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' }); // BOM para compatibilidad con Excel
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cuentas_aidanai_export_${new Date().toISOString().slice(0,10)}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast("Exportación CSV completada.", "info");
                
            } catch (error) {
                console.error("Error al exportar datos a CSV:", error);
                showToast("Error durante la exportación a CSV.", "danger");
            } finally {
                setButtonLoading(btn, false);
            }
        };
        // =================================================================================
        // INICIO BLOQUE CSV
        // =================================================================================
        const csv_parseDate = (dateString) => {
            if (!dateString) return null;
            const parts = dateString.split('/');
            if (parts.length !== 3) return null;
            const day = parseInt(parts, 10);
            const month = parseInt(parts, 10) - 1;
            const year = parseInt(parts, 10);
            if (isNaN(day) || isNaN(month) || isNaN(year) || year < 1970) return null;
            return new Date(Date.UTC(year, month, day, 12, 0, 0));
        };

        const csv_parseCurrency = (currencyString) => {
            if (typeof currencyString !== 'string' || !currencyString) return 0;
            const number = parseFloat(
                currencyString
                .replace('€', '')
                .trim()
                .replace(/\./g, '')
                .replace(',', '.')
            );
            return isNaN(number) ? 0 : Math.round(number * 100);
        };

        const csv_inferType = (name) => {
            const upperName = name.toUpperCase();
            if (upperName.includes('TARJETA')) return { tipo: 'Tarjeta', esInversion: false };
            if (upperName.includes('EFECTIVO')) return { tipo: 'Efectivo', esInversion: false };
            if (upperName.includes('PENSIÓN')) return { tipo: 'Pensión', esInversion: true };
            if (upperName.includes('LETRAS')) return { tipo: 'Renta Fija', esInversion: true };
            if (['FONDO', 'FONDOS'].some(t => upperName.includes(t))) return { tipo: 'Fondos', esInversion: true };
            if (['TRADEREPUBLIC', 'MYINVESTOR', 'DEGIRO', 'INTERACTIVEBROKERS', 'INDEXACAPITAL', 'COINBASE', 'CRIPTAN', 'KRAKEN', 'BIT2ME', 'N26', 'FREEDOM24', 'DEBLOCK', 'BBVA', 'CIVISLEND', 'HOUSERS', 'URBANITAE', 'MINTOS', 'HAUSERA'].some(b => upperName.includes(b))) return { tipo: 'Broker', esInversion: true };
            if (upperName.includes('NARANJA') || upperName.includes('AHORRO')) return { tipo: 'Ahorro', esInversion: false };
            return { tipo: 'Banco', esInversion: false };
        };

        const csv_processFile = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const csvData = event.target.result.replace(/^\uFEFF/, '');
                        const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '' && line.includes(';'));
                        if (lines.length <= 1) {
                            showToast("El archivo CSV está vacío o solo contiene la cabecera.", "warning");
                            return resolve(null);
                        }
                        
                        lines.shift();

                        let rowCount = 0, initialCount = 0;
                        const cuentasMap = new Map();
                        const conceptosMap = new Map();
                        const movimientos = [];
                        const potentialTransfers = [];
                        
                        for (const line of lines) {
                            rowCount++;
                            const columns = line.split(';').map(c => c.trim().replace(/"/g, ''));
                            const [fechaStr, cuentaStr, conceptoStr, importeStr, descripcion = ''] = columns;

                            if (!fechaStr || !cuentaStr || !conceptoStr || !importeStr) {
                                console.warn(`Línea inválida o incompleta #${rowCount + 1}. Saltando...`, line);
                                continue;
                            }
                            
                            const fecha = csv_parseDate(fechaStr);
                            if (!fecha) {
                                 console.warn(`Fecha inválida en la fila ${rowCount + 1}: ${fechaStr}`);
                                 continue;
                            }

                            const conceptoLimpio = conceptoStr.trim().toUpperCase().replace(/\s*;-$/, '');
                            const offBalance = cuentaStr.startsWith('N-');
                            const nombreCuentaLimpio = cuentaStr.replace(/^(D-|N-)/, '');
                            const cantidad = csv_parseCurrency(importeStr);

                            if (!cuentasMap.has(nombreCuentaLimpio)) {
                                const { tipo, esInversion } = csv_inferType(nombreCuentaLimpio);
                                cuentasMap.set(nombreCuentaLimpio, { id: generateId(), nombre: nombreCuentaLimpio, tipo, saldo: 0, esInversion, offBalance, fechaCreacion: new Date(Date.UTC(2025, 0, 1)).toISOString() });
                            }

                            if (conceptoLimpio === 'INICIAL') {
                                initialCount++;
                                if (!conceptosMap.has('SALDO INICIAL')) conceptosMap.set('SALDO INICIAL', { id: generateId(), nombre: 'Saldo Inicial', icon: 'account_balance' });
                                movimientos.push({ id: generateId(), fecha: fecha.toISOString(), cantidad, descripcion: descripcion || 'Existencia Inicial', tipo: 'movimiento', cuentaId: cuentasMap.get(nombreCuentaLimpio).id, conceptoId: conceptosMap.get('SALDO INICIAL').id });
                                continue;
                            }

                            if (conceptoLimpio && conceptoLimpio !== 'TRASPASO' && !conceptosMap.has(conceptoLimpio)) {
                                conceptosMap.set(conceptoLimpio, { id: generateId(), nombre: toSentenceCase(conceptoLimpio), icon: 'label' });
                            }
                            
                            if (conceptoLimpio === 'TRASPASO') {
                                potentialTransfers.push({ fecha, nombreCuenta: nombreCuentaLimpio, cantidad, descripcion, originalRow: rowCount });
                            } else {
                                movimientos.push({ id: generateId(), fecha: fecha.toISOString(), cantidad, descripcion, tipo: 'movimiento', cuentaId: cuentasMap.get(nombreCuentaLimpio).id, conceptoId: conceptosMap.get(conceptoLimpio)?.id || null });
                            }
                        }

                        let matchedTransfersCount = 0;
                        let unmatchedTransfers = [];
                        const transferGroups = new Map();
                        potentialTransfers.forEach(t => {
                            const key = `${t.fecha.getTime()}_${Math.abs(t.cantidad)}`;
                            if (!transferGroups.has(key)) transferGroups.set(key, []);
                            transferGroups.get(key).push(t);
                        });

                        transferGroups.forEach((group) => {
                            const gastos = group.filter(t => t.cantidad < 0);
                            const ingresos = group.filter(t => t.cantidad > 0);
                            while (gastos.length > 0 && ingresos.length > 0) {
                                const Gasto = gastos.pop();
                                const Ingreso = ingresos.pop();
                                movimientos.push({ id: generateId(), fecha: Gasto.fecha.toISOString(), cantidad: Math.abs(Gasto.cantidad), descripcion: Gasto.descripcion || Ingreso.descripcion || 'Traspaso', tipo: 'traspaso', cuentaOrigenId: cuentasMap.get(Gasto.nombreCuenta).id, cuentaDestinoId: cuentasMap.get(Ingreso.nombreCuenta).id });
                                matchedTransfersCount++;
                            }
                            unmatchedTransfers.push(...gastos, ...ingresos);
                        });

                        const finalData = { cuentas: Array.from(cuentasMap.values()), conceptos: Array.from(conceptosMap.values()), movimientos, presupuestos: [], recurrentes: [], inversiones_historial: [], inversion_cashflows: [], config: getInitialDb().config };
                        const totalMovements = movimientos.filter(m => m.tipo === 'movimiento' && m.conceptoId !== conceptosMap.get('SALDO INICIAL')?.id).length;

                        resolve({
                            jsonData: finalData,
                            stats: { rowCount, accounts: cuentasMap.size, concepts: conceptosMap.size, movements: totalMovements, transfers: matchedTransfersCount, initials: initialCount, unmatched: unmatchedTransfers.length }
                        });

                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
                reader.readAsText(file, 'ISO-8859-1');
            });
        };

        const showCsvImportWizard = () => {
            const wizardHTML = `
            <div id="csv-wizard-content">
                <!-- PASO 1: SUBIDA DE ARCHIVO -->
                <div id="csv-wizard-step-1" class="json-wizard-step">
                    <h4>Paso 1: Selecciona tu archivo CSV</h4>
                    <p class="form-label" style="margin-bottom: var(--sp-3);">
                        Columnas requeridas: <code>FECHA;CUENTA;CONCEPTO;IMPORTE;DESCRIPCIÓN</code>.
                        <br><strong>Atención:</strong> La importación reemplazará <strong>todos</strong> tus datos actuales.
                    </p>
                    <div id="csv-drop-zone" class="upload-area">
                        <p>Arrastra tu archivo <code>.csv</code> aquí o <strong>haz clic para seleccionarlo</strong>.</p>
                        <span id="csv-file-name" class="file-name" style="color: var(--c-success); font-weight: 600; margin-top: 1rem; display: block;"></span>
                    </div>
                    <div id="csv-file-error" class="form-error" style="text-align: center; margin-top: var(--sp-3);"></div>
                    <div class="modal__actions">
                        <button id="csv-process-btn" class="btn btn--primary btn--full" disabled>Analizar Archivo</button>
                    </div>
                </div>

                <!-- PASO 2: VISTA PREVIA Y CONFIRMACIÓN -->
                <div id="csv-wizard-step-2" class="json-wizard-step" style="display: none;">
                    <h4>Paso 2: Revisa y confirma</h4>
                    <p class="form-label" style="margin-bottom: var(--sp-3);">Hemos analizado tu archivo. Si los datos son correctos, pulsa "Importar" para reemplazar tus datos actuales.</p>
                    <div class="results-log" style="display: block; margin-top: 0;">
                        <h2>Resultados del Análisis</h2>
                        <ul id="csv-preview-list"></ul>
                    </div>
                    <div class="form-error" style="margin-top: var(--sp-2); text-align: center;"><strong>Atención:</strong> Esta acción es irreversible.</div>
                    <div class="modal__actions" style="justify-content: space-between;">
                        <button id="csv-wizard-back-btn" class="btn btn--secondary">Atrás</button>
                        <button id="csv-wizard-import-final" class="btn btn--danger"><span class="material-icons">warning</span>Importar y Reemplazar</button>
                    </div>
                </div>

                <!-- PASO 3: PROGRESO Y RESULTADO -->
                <div id="csv-wizard-step-3" class="json-wizard-step" style="display: none; justify-content: center; align-items: center; text-align: center; min-height: 250px;">
                    <div id="csv-import-progress">
                        <span class="spinner" style="width: 48px; height: 48px; border-width: 4px;"></span>
                        <h4 style="margin-top: var(--sp-4);">Importando...</h4>
                        <p>Borrando datos antiguos e importando los nuevos. Por favor, no cierres esta ventana.</p>
                    </div>
                     <div id="csv-import-result" style="display: none;">
                        <span class="material-icons" style="font-size: 60px; color: var(--c-success);">task_alt</span>
                        <h4 id="csv-result-title" style="margin-top: var(--sp-2);"></h4>
                        <p id="csv-result-message"></p>
                        <div class="modal__actions" style="justify: center;">
                            <button class="btn btn--primary" data-action="close-modal" data-modal-id="generic-modal">Finalizar</button>
                        </div>
                     </div>
                </div>
            </div>`;

            showGenericModal('Asistente de Importación CSV', wizardHTML);

            setTimeout(() => {
                let csvFile = null;
                let processedData = null;
                const wizardContent = select('csv-wizard-content');
                if (!wizardContent) return;

                const goToStep = (step) => {
                    wizardContent.querySelectorAll('.json-wizard-step').forEach(s => s.style.display = 'none');
                    wizardContent.querySelector(`#csv-wizard-step-${step}`).style.display = 'flex';
                };

                const fileInput = document.createElement('input');
                fileInput.type = 'file'; fileInput.accept = '.csv, text/csv'; fileInput.className = 'hidden';
                wizardContent.appendChild(fileInput);

                const handleFileSelection = (file) => {
                    const nameEl = select('csv-file-name'), processBtn = select('csv-process-btn'), errorEl = select('csv-file-error');
                    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
                        csvFile = file;
                        nameEl.textContent = `Archivo: ${file.name}`;
                        processBtn.disabled = false;
                        errorEl.textContent = '';
                    } else {
                        csvFile = null;
                        nameEl.textContent = 'Por favor, selecciona un archivo .csv válido.';
                        processBtn.disabled = true;
                    }
                };
                
                const dropZone = select('csv-drop-zone');
                dropZone.addEventListener('click', () => fileInput.click());
                fileInput.addEventListener('change', () => handleFileSelection(fileInput.files));
                dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
                dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
                dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('drag-over'); handleFileSelection(e.dataTransfer.files); });

                select('csv-process-btn').addEventListener('click', async (e) => {
                    if (!csvFile) return;
                    const btn = e.target;
                    setButtonLoading(btn, true, 'Analizando...');
                    try {
                        const result = await csv_processFile(csvFile);
                        if (result) {
                            processedData = result.jsonData;
                            const { stats } = result;
                            const previewList = select('csv-preview-list');
                            let html = `
                                <li><span class="label">Filas Válidas Leídas</span><span class="value">${stats.rowCount}</span></li>
                                <li><span class="label">Cuentas a Crear</span><span class="value success">${stats.accounts}</span></li>
                                <li><span class="label">Conceptos a Crear</span><span class="value success">${stats.concepts}</span></li>
                                <li><span class="label">Saldos Iniciales</span><span class="value">${stats.initials}</span></li>
                                <li><span class="label">Movimientos (Ingreso/Gasto)</span><span class="value">${stats.movements}</span></li>
                                <li><span class="label">Transferencias Emparejadas</span><span class="value">${stats.transfers}</span></li>
                                <li><span class="label">Transferencias sin Pareja</span><span class="value ${stats.unmatched > 0 ? 'danger' : 'success'}">${stats.unmatched}</span></li>
                            `;
                            previewList.innerHTML = html;
                            goToStep(2);
                        }
                    } catch (error) {
                        console.error("Error al procesar CSV:", error);
                        select('csv-file-error').textContent = `Error: ${error.message}`;
                    } finally {
                        setButtonLoading(btn, false);
                    }
                });

                select('csv-wizard-back-btn').addEventListener('click', () => goToStep(1));
                select('csv-wizard-import-final').addEventListener('click', (e) => {
                    if (processedData) handleFinalCsvImport(e.target, processedData, goToStep);
                });
            }, 0);
        };

        const handleFinalCsvImport = async (btn, dataToImport, goToStep) => {
            goToStep(3);
            setButtonLoading(btn, true, 'Importando...');

            try {
                const collectionsToClear = ['cuentas', 'conceptos', 'movimientos', 'presupuestos', 'recurrentes', 'inversiones_historial', 'inversion_cashflows'];

                for (const collectionName of collectionsToClear) {
                    const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection(collectionName).get();
                    if (snapshot.empty) continue;
                    let batch = fbDb.batch();
                    let count = 0;
                    for (const doc of snapshot.docs) {
                        batch.delete(doc.ref);
                        count++;
                        if (count >= 450) { await batch.commit(); batch = fbDb.batch(); count = 0; }
                    }
                    if (count > 0) await batch.commit();
                }
                
                for (const collectionName of Object.keys(dataToImport)) {
                    const items = dataToImport[collectionName];
                    if (Array.isArray(items) && items.length > 0) {
                        let batch = fbDb.batch();
                        let count = 0;
                        for (const item of items) {
                            if (item.id) {
                                const docRef = fbDb.collection('users').doc(currentUser.uid).collection(collectionName).doc(item.id);
                                batch.set(docRef, item);
                                count++;
                                if (count >= 450) { await batch.commit(); batch = fbDb.batch(); count = 0; }
                            }
                        }
                        if (count > 0) await batch.commit();
                    } else if (collectionName === 'config') {
                        await fbDb.collection('users').doc(currentUser.uid).set({ config: items }, { merge: true });
                    }
                }
                
                const resultEl = select('csv-import-result');
                select('csv-import-progress').style.display = 'none';
                resultEl.style.display = 'block';
                resultEl.querySelector('#csv-result-title').textContent = '¡Importación Completada!';
                resultEl.querySelector('#csv-result-message').textContent = 'Los datos se han importado correctamente. La aplicación se recargará.';
                
                hapticFeedback('success');
                showToast('¡Importación completada!', 'info', 4000);
                setTimeout(() => location.reload(), 4500);

            } catch (error) {
                console.error("Error en importación final desde CSV:", error);
                showToast("Error crítico durante la importación.", "danger", 5000);
                const resultEl = select('csv-import-result');
                select('csv-import-progress').style.display = 'none';
                resultEl.style.display = 'block';
                resultEl.querySelector('#csv-result-title').textContent = '¡Error en la Importación!';
                resultEl.querySelector('#csv-result-message').textContent = 'Ocurrió un error. Revisa la consola e inténtalo de nuevo.';
                resultEl.querySelector('.material-icons').style.color = 'var(--c-danger)';
                setButtonLoading(btn, false);
            }
        };
        // =================================================================================
        // FIN BLOQUE CSV
        // =================================================================================

        const recalculateAllAccountBalances = async (btn) => {
            if (!currentUser) {
                showToast("Debes iniciar sesión para realizar esta acción.", "danger");
                return;
            }

            setButtonLoading(btn, true, 'Auditando...');
            showToast("Iniciando recálculo de saldos... Esto puede tardar un momento.", 'info', 4000);

            try {
                const userRef = fbDb.collection('users').doc(currentUser.uid);
                const cuentasRef = userRef.collection('cuentas');
                const movimientosRef = userRef.collection('movimientos');

                const cuentasSnapshot = await cuentasRef.get();
                const newBalances = {};
                cuentasSnapshot.forEach(doc => {
                    newBalances[doc.id] = 0;
                });

                const movimientosSnapshot = await movimientosRef.get();
                console.log(`Procesando ${movimientosSnapshot.size} movimientos para el recálculo.`);

                movimientosSnapshot.forEach(doc => {
                    const mov = doc.data();
                    if (mov.tipo === 'traspaso') {
                        if (newBalances.hasOwnProperty(mov.cuentaOrigenId)) {
                            newBalances[mov.cuentaOrigenId] -= mov.cantidad;
                        }
                        if (newBalances.hasOwnProperty(mov.cuentaDestinoId)) {
                            newBalances[mov.cuentaDestinoId] += mov.cantidad;
                        }
                    } else { // tipo 'movimiento'
                        if (newBalances.hasOwnProperty(mov.cuentaId)) {
                            newBalances[mov.cuentaId] += mov.cantidad;
                        }
                    }
                });

                const batch = fbDb.batch();
                for (const cuentaId in newBalances) {
                    const cuentaRef = cuentasRef.doc(cuentaId);
                    batch.update(cuentaRef, { saldo: newBalances[cuentaId] });
                }
                
                await batch.commit();

                hapticFeedback('success');
                showToast("¡Auditoría completada! Todos los saldos han sido recalculados y actualizados.", "info", 5000);
                
                loadCoreData(currentUser.uid);

            } catch (error) {
                console.error("Error crítico durante el recálculo de saldos:", error);
                showToast("Ocurrió un error grave durante el recálculo. Revisa la consola.", "danger");
            } finally {
                setButtonLoading(btn, false);
            }
        };    

        const handleSaveInvestmentAccounts = async (form, btn) => {
            setButtonLoading(btn, true);
            const selectedIds = new Set(Array.from(form.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value));
            const batch = fbDb.batch();
            db.cuentas.forEach(c => {
                const ref = fbDb.collection('users').doc(currentUser.uid).collection('cuentas').doc(c.id);
                batch.update(ref, { esInversion: selectedIds.has(c.id) });
            });
            await batch.commit();
            setButtonLoading(btn, false);
            hideModal('generic-modal');
            hapticFeedback('success');
            showToast('Portafolio actualizado.');
        };
		const showAportacionModal = (cuentaId = null) => {
            const investmentAccounts = getVisibleAccounts().filter(c => c.esInversion);
            if (investmentAccounts.length === 0) {
                showToast('Primero debes marcar al menos una cuenta como activo de inversión.', 'warning', 4000);
                return;
            }
            
            const fechaISO = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
            
            const accountsOptions = investmentAccounts
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map(c => `<option value="${c.id}" ${cuentaId === c.id ? 'selected' : ''}>${escapeHTML(c.nombre)}</option>`)
                .join('');

            let formHtml = `
            <form id="form-aportacion" novalidate>
                <p class="form-label" style="margin-bottom: var(--sp-3);">
                    Registra una entrada (aportación, positivo) o salida (retiro, negativo) de capital en uno de tus activos. Esto es crucial para calcular correctamente la rentabilidad (TIR).
                </p>
                <div class="form-group">
                    <label for="aportacion-cuenta" class="form-label">Activo de Inversión</label>
                    <select id="aportacion-cuenta" class="form-select">${accountsOptions}</select>
                </div>
                <div class="form-group">
                    <label for="aportacion-cantidad" class="form-label">Cantidad (retiro en negativo)</label>
                    <input type="text" id="aportacion-cantidad" class="form-input input-amount-calculator" readonly required placeholder="Ej: -250,50 para un retiro">
                </div>
                <div class="form-group">
                    <label for="aportacion-fecha" class="form-label">Fecha</label>
                    <input type="date" id="aportacion-fecha" class="form-input" value="${fechaISO}" required>
                </div>
                <div class="form-group">
                    <label for="aportacion-notas" class="form-label">Notas (Opcional)</label>
                    <input type="text" id="aportacion-notas" class="form-input" placeholder="Ej: Aportación periódica">
                </div>
                <div class="modal__actions">
                    <button type="submit" class="btn btn--primary">Guardar</button>
                </div>
            </form>`;

            showGenericModal('Registrar Aportación/Retiro', formHtml);
        };
        const handleSaveAportacion = async (form, btn) => {
             setButtonLoading(btn, true);
            const cuentaId = select('aportacion-cuenta').value;
            const cantidad = parseCurrencyString(select('aportacion-cantidad').value);
            const fecha = select('aportacion-fecha').value;
            const notas = select('aportacion-notas').value.trim();

            if (!cuentaId || isNaN(cantidad) || !fecha) {
                showToast('Completa todos los campos requeridos.', 'warning');
                setButtonLoading(btn, false);
                return;
            }
            
            const newId = generateId();
            const newCashflow = {
                id: newId,
                cuentaId,
                cantidad: Math.round(cantidad * 100),
                fecha: parseDateStringAsUTC(fecha).toISOString(),
                notas
            };
            
            await saveDoc('inversion_cashflows', newId, newCashflow);
            setButtonLoading(btn, false);
            hideModal('generic-modal');
            hapticFeedback('success');
            showToast('Operación de capital registrada.');
            // Volvemos a renderizar la pestaña de patrimonio para actualizar los cálculos
            renderPatrimonioPage();
        };

        async function migrateDataToSubcollections() {
            if (!currentUser) { console.error("No hay usuario logueado."); return; }
            console.log("🚀 Iniciando migración para el usuario:", currentUser.uid);
            try {
                const userDocRef = fbDb.collection('users').doc(currentUser.uid);
                const doc = await userDocRef.get();
                if (!doc.exists || !doc.data().db) { console.warn("No se encontró el campo 'db' para migrar."); return; }
                const oldDb = doc.data().db;
                console.log("Datos antiguos encontrados. Procediendo...");
                let batch = fbDb.batch();
                let operations = 0;
                const commitBatch = async () => { await batch.commit(); console.log(`Lote de ${operations} op. completado.`); batch = fbDb.batch(); operations = 0; };
                const collectionsToMigrate = ['cuentas', 'conceptos', 'movimientos', 'presupuestos', 'recurrentes', 'inversiones_historial', 'inversion_cashflows'];
                for (const collectionName of collectionsToMigrate) {
                    if (oldDb[collectionName] && Array.isArray(oldDb[collectionName])) {
                        console.log(`- Migrando ${oldDb[collectionName].length} docs a '${collectionName}'...`);
                        for (const item of oldDb[collectionName]) {
                            const docRef = userDocRef.collection(collectionName).doc(item.id);
                            batch.set(docRef, item);
                            operations++;
                            if (operations >= 400) await commitBatch();
                        }
                    }
                }
                if (operations > 0) await commitBatch();
                console.log("✅ Subcolecciones creadas. Actualizando documento principal...");
                await userDocRef.set({ config: oldDb.config || getInitialDb().config }, { merge: false });
                console.log("🎉 ¡MIGRACIÓN COMPLETADA! Por favor, recarga la aplicación.");
                alert("¡Migración completada! Recarga la página.");
            } catch (error) {
                console.error("❌ ERROR DURANTE LA MIGRACIÓN:", error);
                alert("Ocurrió un error durante la migración. Revisa la consola.");
            }
        }
        window.migrateDataToSubcollections = migrateDataToSubcollections;

        document.addEventListener('DOMContentLoaded', initApp);
		
		// =================================================================================
        // FUNCIONES DE AYUDA PARA CONSULTAS AVANZADAS (CÓDIGO ESENCIAL)
        // =================================================================================

        /**
         * Ejecuta múltiples consultas 'in' para superar el límite de 10 elementos de Firestore.
         * @param {firebase.firestore.Query} baseQuery - La consulta base sin el filtro 'in'.
         * @param {string} field - El campo por el que filtrar (ej. 'cuentaId').
         * @param {Array<string>} ids - El array de IDs (puede tener más de 10).
         * @returns {Promise<Array<Object>>} Una promesa que resuelve a un array con todos los documentos encontrados.
         */
        const fetchMovementsInChunks = async (baseQuery, field, ids) => {
            if (ids.length === 0) {
                return [];
            }
            // Dividimos el array de IDs en trozos de 10
            const idChunks = chunkArray(ids, 10);
            
            // Creamos una promesa de consulta para cada trozo
            const queryPromises = idChunks.map(chunk => {
                return baseQuery.where(field, 'in', chunk).get();
            });

            // Esperamos a que todas las consultas se completen
            const querySnapshots = await Promise.all(queryPromises);

            // Unimos los resultados de todas las consultas en un solo array
            let movements = [];
            querySnapshots.forEach(snapshot => {
                snapshot.forEach(doc => {
                    movements.push({ id: doc.id, ...doc.data() });
                });
            });

            return movements;
        };