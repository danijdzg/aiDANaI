import { addDays, addWeeks, addMonths, addYears } from 'https://cdn.jsdelivr.net/npm/date-fns@2.29.3/+esm'
        // =================================================================================
        // MIGRATION SCRIPT HELPER
        // =================================================================================
        /* 
            IMPORTANTE: GUÍA DE MIGRACIÓN DE DATOS PARA PAGINACIÓN

            Esta nueva versión de la aplicación requiere una estructura de datos diferente en Firestore
            para poder funcionar correctamente. Necesitas ejecutar una migración UNA SOLA VEZ
            para tu cuenta.

            CÓMO MIGRAR:
            1.  **HAZ UNA COPIA DE SEGURIDAD:** Antes de nada, ve a Ajustes -> Copia de Seguridad -> Exportar JSON.
            2.  **INICIA SESIÓN:** Asegúrate de haber iniciado sesión en la aplicación en tu navegador.
            3.  **ABRE LA CONSOLA:** Abre las herramientas de desarrollador de tu navegador (normalmente con F12 o Cmd+Opt+J)
                y ve a la pestaña "Consola".
            4.  **EJECUTA EL SCRIPT:** Pega la siguiente línea de código en la consola y presiona Enter:
                
                migrateDataToSubcollections()

            5.  **ESPERA:** El script tardará un momento en procesar todos tus datos. La consola te
                avisará cuando haya terminado con "¡MIGRACIÓN COMPLETADA!".
            6.  **RECARGA LA APP:** Recarga la página (F5 o Cmd+R). Tu aplicación ahora usará la nueva
                estructura de datos y la paginación.

            El script de migración está definido más abajo en este mismo fichero (`migrateDataToSubcollections`).
        */
       
        // =================================================================================
        // 0. INTERNATIONALIZATION (I18N)
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
                
                // INICIO CAMBIO: Ayuda en Inglés
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

                // INICIO CAMBIO: Ayuda en Español
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

        /**
         * Función principal de traducción.
         * @param {string} key - La clave del string a traducir.
         * @param {object} replacements - Un objeto con valores para reemplazar placeholders.
         * @returns {string} El string traducido.
         */
        const t = (key, replacements = {}) => {
            const lang = translations[currentLanguage] || translations.es;
            let text = lang[key] || translations.es[key] || `[${key}]`;

            for (const placeholder in replacements) {
                text = text.replace(`{${placeholder}}`, replacements[placeholder]);
            }
            return text;
        };
        
        // =================================================================================
        // 1. STATE & GLOBAL VARIABLES (CORREGIDO)
        // =================================================================================
        
        // --- CONSTANTES DE LA APLICACIÓN ---
        // INICIO CAMBIO: Reestructuración de constantes de página para el nuevo modelo de 4 pestañas
        const PAGE_IDS = {
            INICIO: 'inicio-page',
            PATRIMONIO: 'patrimonio-page',
            ANALISIS: 'analisis-page',
            CONFIGURACION: 'configuracion-page',
            MOVIMIENTOS_FULL: 'movimientos-page-full', // Vista especial para el historial completo
        };
        // FIN CAMBIO
		// ... Al inicio del script, junto a las otras constantes
		const THEMES = {
			'default': { name: 'Amoled Futurista', icon: 'dark_mode' },
			'ocean': { name: 'Océano Profundo', icon: 'bedtime' },
            'magma': { name: 'Magma Oscuro', icon: 'local_fire_department' },
            'daylight': { name: 'Luz Diurna', icon: 'light_mode' },
            'quartz': { name: 'Cuarzo Claro', icon: 'wb_sunny' }
		};
        const quotesData = [ { "cita": "Los inversores conservadores duermen bien.", "autor": "Benjamin Graham" }, { "cita": "Nunca asciendas a alguien que no ha cometido errores, porque si lo haces, estás ascendiendo a alguien que nunca ha hecho nada.", "autor": "Benjamin Graham" }, { "cita": "Si se han hecho los deberes antes de comprar una acción, el momento de venderla es: normalmente, nunca.", "autor": "Benjamin Graham" }, { "cita": "Mientras que el entusiasmo é necesario para conseguir grandes logros en cualquier lugar, en Wall Street suele conducir al desastre.", "autor": "John Templeton" }, { "cita": "Sin tener fe en el futuro, nadie invertiría. Para ser inversor, debes creer en un mañana mejor.", "autor": "John Templeton" }, { "cita": "Las cuatro palabras más caras de nuestro lenguaje son: 'Esta vez es diferente'.", "autor": "John Templeton" }, { "cita": "Céntrate en el valor porque la mayoría de los inversores se fijan en perspectivas y tendencias.", "autor": "Peter Lynch" }, { "cita": "El éxito es un proceso de búsqueda continua de respuestas a nuevas preguntas.", "autor": "Peter Lynch" }, { "cita": "Conoce en lo que inviertes, y por qué.", "autor": "Peter Lynch" }, { "cita": "Cuando vendes en momentos de desesperación, siempre vendes barato.", "autor": "Peter Lynch" }, { "cita": "Una persona que posee una propiedad y tiene una participación en la empresa probablemente trabajará más duro, se sentirá más feliz y hará un mejor trabajo que otra que no tiene nada.", "autor": "Peter Lynch" }, { "cita": "El riesgo viene de no saber lo que se está haciendo.", "autor": "Warren Buffett" }, { "cita": "Cuesta 20 años construir una reputación y 5 minutos destruirla. Si piensas sobre ello, harás las cosas de manera diferente.", "autor": "Warren Buffett" }, { "cita": "En el mundo de los negocios, el espejo retrovisor está siempre más claro que el parabrisas.", "autor": "Warren Buffett" }, { "cita": "La inversión más importante que puedes hacer es en uno mismo.", "autor": "Warren Buffett" }, { "cita": "Sé temeroso cuando otros sean avariciosos, sé avaricioso cuando otros sean temerosos.", "autor": "Warren Buffett" }, { "cita": "Sé consciente de lo que no sabes. Siéntete a gusto entendiendo tus errores y debilidades.", "autor": "Charlie Munger" }, { "cita": "Para hacer dinero en los mercados, tienes que pensar diferente y ser humilde.", "autor": "Charlie Munger" }, { "cita": "El principal problema del inversor, e incluso su peor enemigo, es probablemente él mismo", "autor": "Benjamin Graham" }, { "cita": "Las personas que no pueden controlar sus emociones no son aptas para obtener beneficios mediante la inversión", "autor": "Benjamin Graham" }, { "cita": "Trato de comprar acciones en los negocios que son tan maravillosos que un tonto podría manejarlos. Tarde o temprano uno lo hará", "autor": "Warren Buffett" }, { "cita": "Un inversor debería actuar como si tuviera una tarjeta con solo 20 decisiones (de compra) para tomar a lo largo de su vida", "autor": "Warren Buffett" }, { "cita": "Regla número 1: nunca pierdas dinero. Regla número 2: nunca olvides la regla número 1", "autor": "Warren Buffett" }, { "cita": "Se gana dinero descontando lo obvio y apostando a lo inesperado", "autor": "George Soros" }, { "cita": "El problema no es lo que uno no sabe, sino lo que uno cree que sabe estando equivocado", "autor": "George Soros" }, { "cita": "Si invertir es entretenido, si te estás divirtiendo, probablemente no estés ganando dinero. Las buenas inversiones son aburridas", "autor": "George Soros" }, { "cita": "Se puede perder dinero a corto plazo, pero necesitas del largo plazo para ganar dinero", "autor": "Peter Lynch" }, { "cita": "La mejor empresa para comprar puede ser alguna que ya tienes en cartera", "autor": "Peter Lynch" }, { "cita": "La clave para ganar dinero con las acciones es no tenerles miedo", "autor": "Peter Lynch" }, { "cita": "Los mercados alcistas nacen en el pesimismo, crecen en el escepticismo, maduran en el optimismo y mueren en la euforia", "autor": "John Templeton" }, { "cita": "El momento de máximo pesimismo es el mejor para comprar y el momento de máximo optimismo es el mejor para vender", "autor": "John Templeton" }, { "cita": "Un inversor que tiene todas las respuestas ni siquiera entiende las preguntas", "autor": "John Templeton" }, { "cita": "La inversión es un negocio a largo plazo donde la paciencia marca la rentabilidad", "autor": "Francisco García Paramés" }, { "cita": "¿Cuándo vendemos un valor? Respondemos siempre: cuando haya una oportunidad mejor. Ese es nuestro objetivo permanente, mejorar la cartera cada día", "autor": "Francisco García Paramés" }, { "cita": "Lo que en la Bolsa saben todos, no me interesa", "autor": "André Kostolany" }, { "cita": "No sirve para nada proclamar la verdad en economía o recomendar cosas útiles. Es la mejor manera de hacerse enemigos", "autor": "André Kostolany" }, { "cita": "Un inversionista pierde la capacidad de raciocinio cuando gana los primeros diez mil dólares. A partir de entonces se convierte en un pelele fácilmente manipulable", "autor": "André Kostolany" }, { "cita": "Comprar títulos, acciones de empresas, tomarse unas pastillas para dormir durante 20/30 años y cuando uno despierta, ¡voilà! es millonario", "autor": "André Kostolany" }, { "cita": "No sé si los próximos 1.000 puntos del Dow Jones serán hacia arriba o hacia abajo, pero estoy seguro de que los próximos 10.000 serán hacia arriba", "autor": "Peter Lynch" }, { "cita": "El destino de un inversor lo marca su estómago , no su cerebro", "autor": "Peter Lynch" }, { "cita": "No siga mis pasos porque aun en el caso de que acierte al comprar usted no sabrá cuando vendo", "autor": "Peter Lynch" }, { "cita": "Calcule las 'ganancias del dueño' para conseguir una reflexión verdadera del valor", "autor": "Warren Buffett" }, { "cita": "Busque compañías con altos márgenes de beneficio", "autor": "Warren Buffett" }, { "cita": "Invierta siempre para el largo plazo", "autor": "Warren Buffett" }, { "cita": "El consejo de que 'usted nunca quiebra tomando un beneficio' es absurdo", "autor": "Warren Buffett" }, { "cita": "¿El negocio tiene una historia de funcionamiento constante?", "autor": "Warren Buffett" }, { "cita": "Recuerde que el mercado de valores es maníaco-depresivo", "autor": "Benjamin Graham" }, { "cita": "Compre un negocio, no alquile la acción", "autor": "Warren Buffett" }, { "cita": "Mientras más absurdo sea el comportamiento del mercado mejor será la oportunidad para el inversor metódico", "autor": "Benjamin Graham" }, { "cita": "Se puede perder dinero a corto plazo, pero usted sigue siendo un idiota", "autor": "Joel Greenblatt" }, { "cita": "Los mercados alcistas no tienen resistencia y los bajistas no tienen soporte", "autor": "Ed Downs" }, { "cita": "El pánico causa que vendas en el bajón, y la codicia causa que compres cerca a la cima", "autor": "Stan Weinstein" }, { "cita": "Las dos grandes fuerzas que mueven los mercados son la codicia y el miedo", "autor": "Anónimo" }, { "cita": "Todo lo que sube baja y todo lo que baja sube", "autor": "Anónimo" }, { "cita": "Si no sientes miedo en el momento de comprar es que estás comprando mal", "autor": "Anónimo" }, { "cita": "Que el último duro lo gane otro", "autor": "Anónimo" }, { "cita": "La clave para hacer dinero en acciones es no asustarse de ellas", "autor": "Peter Lynch" }, { "cita": "El precio es lo que pagas, el valor es lo que recibes", "autor": "Warren Buffett" }, { "cita": "No es necesario hacer cosas extraordinarias para conseguir resultados extraordinarios", "autor": "Warren Buffett" }, { "cita": "Alguien está sentado en la sombra hoy porque alguien plantó un árbol mucho tiempo atrás", "autor": "Warren Buffett" }, { "cita": "Únicamente cuando la marea baja, descubres quién ha estado nadando desnudo", "autor": "Warren Buffett" }, { "cita": "No tenemos que ser más inteligentes que el resto, tenemos que ser más disciplinados que el resto", "autor": "Warren Buffett" }, { "cita": "Si compras cosas que no necesitas, pronto tendrás que vender cosas que necesitas", "autor": "Warren Buffett" }, { "cita": "Nunca inviertas en un negocio que no puedas entender", "autor": "Warren Buffett" }, { "cita": "El tiempo es amigo de las empresas maravillosas y enemigo de las mediocres", "autor": "Warren Buffett" }, { "cita": "Nuestro periodo de espera favorito es para siempre", "autor": "Warren Buffett" }, { "cita": "Wall Street es el único lugar al que las personas van en un Rolls-Royce, para recibir asesoría de quienes toman el metro", "autor": "Warren Buffett" }, { "cita": "Llega un momento en el que debes empezar a hacer lo que realmente quieres. Busca un trabajo que te guste y saltarás de la cama cada mañana con fuerza", "autor": "Warren Buffett" }, { "cita": "Es siempre mejor pasar el tiempo con gente mejor que tú. Escoge asociados cuyo comportamiento es mejor que el tuyo e irás en esa dirección", "autor": "Warren Buffett" }, { "cita": "Toma 20 años en construir una reputación y 5 minutos en arruinarla. Si piensas sobre ello, harás las cosas de forma diferente", "autor": "Warren Buffett" }, { "cita": "No importa el talento o los esfuerzos, hay cosas que llevan tiempo. No puedes producir un bebé en un mes dejando embarazadas a 9 mujeres", "autor": "Warren Buffett" }, { "cita": "Las oportunidades aparecen pocas veces. Cuando llueva oro sal a la calle con un cesto grande y no con un dedal", "autor": "Warren Buffett" }, { "cita": "La gente siempre me pregunta dónde deberían trabajar y yo siempre les digo que vayan a trabajar con aquellos a los que más admiran", "autor": "Warren Buffett" }, { "cita": "¿Cuándo hay que vender una acción? Pues cuando tengamos una oportunidad mejor a la vista", "autor": "Francisco García Paramés" }, { "cita": "Nunca acudo a las OPV, me gusta estar en las empresas que pueden ser opadas por competidores, no en las salidas a bolsa", "autor": "Francisco García Paramés" }, { "cita": "Si en el mercado hay más tontos que papel, la bolsa va a subir, si hay más papel que tontos, la bolsa baja", "autor": "André Kostolany" }, { "cita": "No persiga nunca una acción, tenga paciencia que la próxima oportunidad va a llegar con toda seguridad", "autor": "André Kostolany" }, { "cita": "Lo que todos saben en la bolsa, no nos interesa a los especuladores", "autor": "André Kostolany" }, { "cita": "Las inversiones exitosas consisten en saber gestionar el riesgo, no en evitarlo.", "autor": "Benjamin Graham" }, { "cita": "Una gran compañía no es una buena inversión si pagas mucho por la acción", "autor": "Benjamin Graham" }, { "cita": "A veces es mejor pensar una hora sobre el dinero que dedicar una semana a trabajar para obtenerlo.", "autor": "André Kostolany" }, { "cita": "En la Bolsa, con frecuencia, hay que cerrar los ojos para ver mejor.", "autor": "André Kostolany" }, { "cita": "Si la inversión es entretenida, si te estás divirtiendo, es probable que no estés ganando dinero. Una buena inversión es aburrida.", "autor": "George Soros" }, { "cita": "Las burbujas del mercado de valores no crecen de la nada. Tienen una base sólida en la realidad, pero la realidad está distorsionada por un malentendido.", "autor": "George Soros" }, { "cita": "Nunca digas que no puedes permitirte algo. Esa es la aptitud de un hombre pobre. Pregúntate cómo permitírtelo.", "autor": "Robert Kiyosaki" }, { "cita": "Una diferencia importante es que los ricos compran los lujos al final, mientras que los pobres y la clase media tienden a comprar los lujos primero.", "autor": "Robert Kiyosaki" }, { "cita": "Mantén tus activos bajo mínimos, reduce los pasivos y, con mucha disciplina, ve construyendo una base de activos sólida.", "autor": "Robert Kiyosaki" }, { "cita": "No ahorres lo que queda después de gastar, sino gasta lo que queda después de ahorrar.", "autor": "Warren Buffett" }, { "cita": "El riesgo viene de no saber lo que estás haciendo.", "autor": "Warren Buffett" }, { "cita": "Sea temeroso cuando otros son codiciosos, y sea codicioso cuando otros son temerosos.", "autor": "Warren Buffett" }, { "cita": "No compres cosas que no necesitas, con dinero que no tienes, para impresionar a gente que no te importa.", "autor": "Dave Ramsey" } ];
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
        // --- ESTADO GLOBAL Y DE PAGINACIÓN ---
		let currentUser = null, unsubscribeListeners = [], db = getInitialDb(), deselectedAccountTypesFilter = new Set();
		let intelligentIndex = new Map();
		// Cerca de tus otras variables globales, como currentUser, db, etc.
		let syncState = 'synced'; // Posibles estados: 'synced', 'syncing', 'error'	
        let isOffBalanceMode = false;
        let descriptionIndex = {};
		let globalSearchDebounceTimer = null;
		let newMovementIdToHighlight = null;
		let unsubscribeRecientesListener = null
        const originalButtonTexts = new Map();
        let conceptosChart = null, liquidAssetsChart = null, detailInvestmentChart = null, informesChart = null;
        let currentTourStep = 0;
        let lastScrollTop = null;
        
        // --- ESTADO PARA EL ASISTENTE DE IMPORTACIÓN DE JSON ---
        let jsonWizardState = {
            file: null,
            data: null,
            preview: {
                counts: {},
                meta: {}
            }
        };
        
        // --- Variables para la paginación de movimientos ---
		const MOVEMENTS_PAGE_SIZE = 200;
        let lastVisibleMovementDoc = null; 
        let isLoadingMoreMovements = false; 
        let allMovementsLoaded = false; 
        
        let runningBalancesCache = null; // Caché para los saldos corrientes.
		let recentMovementsCache = [];
        
        const vList = {
			scrollerEl: null, sizerEl: null, contentEl: null, items: [], itemMap: [], 
			heights: {}, 
			renderBuffer: 10, lastRenderedRange: { start: -1, end: -1 }, isScrolling: null
		};
        
        const calculatorState = {
            displayValue: '0', // Always use period for decimal internally
            waitingForNewValue: true,
            targetInput: null,
        };

        let activeMovementFilter = null;
        let descriptionSuggestionDebounceTimer = null; 
        const DESCRIPTION_SUGGESTION_LIMIT = 5; 
        
        // =================================================================================
        // 2.1. HELPERS DE SEGURIDAD PARA EL PIN
        // =================================================================================

        /**
         * Convierte un PIN en un hash SHA-256 seguro para su almacenamiento.
         * @param {string} pin - El PIN de 4 dígitos.
         * @returns {Promise<string>} El hash en formato hexadecimal.
         */
        const hashPin = async (pin) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(pin);
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        };

        /**
         * Verifica si un PIN introducido coincide con un hash almacenado.
         * @param {string} pin - El PIN introducido por el usuario.
         * @param {string} storedHash - El hash guardado en localStorage.
         * @returns {Promise<boolean>} True si coinciden, false si no.
         */
        const verifyPin = async (pin, storedHash) => {
            const newHash = await hashPin(pin);
            return newHash === storedHash;
        };

		// Añade esta nueva función en tu sección de UI UTILITIES & HELPERS

const updateSyncStatusIcon = () => {
    const iconEl = select('sync-status-icon');
    if (!iconEl) return;

    let iconName = '';
    let iconTitle = '';
    let iconClass = '';

    switch (syncState) {
        case 'syncing':
            iconName = `<span class="sync-icon-spinner">sync</span>`; // Usamos un span interno para la animación
            iconTitle = 'Sincronizando datos con la nube...';
            iconClass = 'sync-status--syncing';
            break;
        case 'error':
            iconName = 'cloud_off';
            iconTitle = 'Error de conexión. Tus cambios se guardan localmente y se sincronizarán al recuperar la conexión.';
            iconClass = 'sync-status--error';
            break;
        case 'synced':
        default:
            iconName = 'cloud_done';
            iconTitle = 'Todos los datos están guardados y sincronizados en la nube.';
            iconClass = 'sync-status--synced';
            break;
    }
    
    iconEl.innerHTML = iconName;
    iconEl.title = iconTitle;
    iconEl.className = `material-icons ${iconClass}`;
};
                const buildDescriptionIndex = () => {
            descriptionIndex = {}; // Reset index
            if (!db.movimientos || db.movimientos.length === 0) return;

            // Para mejorar el rendimiento, solo indexamos los movimientos más recientes
            const movementsToIndex = db.movimientos.slice(0, 500); 

            movementsToIndex.forEach(mov => {
                const desc = mov.descripcion.trim().toLowerCase();
                if (desc.length > 3) { // Solo indexar descripciones significativas
                    if (!descriptionIndex[desc]) {
                        descriptionIndex[desc] = {
                            conceptoId: mov.conceptoId,
                            count: 0
                        };
                    }
                    descriptionIndex[desc].count++;
                }
            });
        };
               
                // =================================================================================
        // 1.5 ONBOARDING INTERACTIVO (NUEVA IMPLEMENTACIÓN)
        // =================================================================================
        const onboardingState = {
            isActive: false,
            currentStep: 0,
            hasCreatedAccount: false // Flag para seguir el progreso
        };

        const onboardingSteps = [
            {
                title: '¡Bienvenido/a a tu Asistente Financiero!',
                content: 'Vamos a configurar tus finanzas en 3 sencillos pasos. Primero, crearemos tu cuenta principal (ej: tu banco o tu cartera).',
                position: 'center',
                // CORREGIDO: Ahora navegamos a la página de Ajustes, que es donde está el siguiente botón.
                setup: () => navigateTo(PAGE_IDS.CONFIGURACION, true), 
            },
            {
                element: 'button[data-action="manage-cuentas"]',
                page: PAGE_IDS.CONFIGURACION, // La acción nos llevará a esta página
                title: 'Paso 1: Crea tu Primera Cuenta',
                content: 'Pulsa aquí para ir al gestor de cuentas. Desde allí podrás añadir, editar y organizar todas tus fuentes de dinero.',
                position: 'bottom-right',
                waitForAction: 'manage-cuentas' // La app esperará a que el usuario haga clic aquí
            },
            {
                element: '#add-cuenta-form button[type="submit"]',
                title: 'Añade los Detalles',
                content: 'Rellena el nombre (ej: "BBVA") y el tipo (ej: "Banco"), y luego pulsa "Añadir Cuenta".',
                position: 'top',
                // Este paso es especial, espera a que se cree una cuenta, no un clic
                waitForAction: 'account-created' 
            },
            {
                element: '#fab-add-movimiento',
                page: PAGE_IDS.INICIO,
                title: 'Paso 2: Registra tu Primer Gasto',
                content: '¡Perfecto! Ahora que tienes una cuenta, vamos a registrar tu primer movimiento. Pulsa el botón `+` para empezar.',
                position: 'top-left',
                waitForAction: 'add-movement'
            },
            {
                element: '#save-movimiento-btn',
                title: 'Completa los Datos',
                content: 'Introduce una cantidad (ej: -10 para un gasto de 10€), una descripción y pulsa "Guardar".',
                position: 'top',
                waitForAction: 'movement-created'
            },
            {
                element: '#ledger-toggle-btn',
                page: PAGE_IDS.INICIO,
                title: 'Función PRO: Contabilidad Dual',
                content: 'Este botón te permite cambiar a una contabilidad "B" separada, ideal para proyectos o pequeños negocios. ¡Explórala cuando quieras!',
                position: 'bottom'
            },
            {
                title: '¡Todo Listo!',
                content: 'Has completado la configuración inicial. Ya tienes el control total de tus finanzas. ¡Explora la app y descubre todo su potencial!',
                position: 'center'
            }
        ];
        const startOnboarding = () => {
            if (onboardingState.isActive) return;
            console.log("Iniciando Onboarding Interactivo...");
            onboardingState.isActive = true;
            onboardingState.currentStep = 0;
            onboardingState.hasCreatedAccount = false;
            select('onboarding-tour').classList.add('onboarding-overlay--visible');
            showOnboardingStep(onboardingState.currentStep);
        };

        const endOnboarding = () => {
            if (!onboardingState.isActive) return;
            console.log("Finalizando Onboarding.");
            onboardingState.isActive = false;
            select('onboarding-tour').classList.remove('onboarding-overlay--visible');
            localStorage.setItem('onboardingCompleted_v2', 'true'); // Usamos una nueva clave para no entrar en conflicto con el tour viejo
        };

        const advanceOnboarding = async () => {
            if (!onboardingState.isActive) return;
            
            const currentStepConfig = onboardingSteps[onboardingState.currentStep];
            if (currentStepConfig.cleanup) await currentStepConfig.cleanup();

            onboardingState.currentStep++;
            if (onboardingState.currentStep >= onboardingSteps.length) {
                endOnboarding();
            } else {
                showOnboardingStep(onboardingState.currentStep);
            }
        };

        const showOnboardingStep = async (stepIndex) => {
            const step = onboardingSteps[stepIndex];
            if (!step) { endOnboarding(); return; }

            // 1. Ejecutar la configuración previa
            if (step.setup) await step.setup();

            // Esperar a que la UI se estabilice (ej: después de una navegación)
            await wait(250);

            const stepBox = select('onboarding-step-box');
            const highlightBox = select('onboarding-highlight');
            
            select('onboarding-title').textContent = step.title;
            select('onboarding-content').innerHTML = step.content;

            const nextBtn = select('onboarding-next-btn');
            const prevBtn = select('onboarding-prev-btn');
            const skipBtn = select('onboarding-skip-btn');
            
            // Si el paso espera una acción del usuario, ocultamos el botón "Siguiente"
            if (step.waitForAction) {
                nextBtn.classList.add('hidden');
            } else {
                nextBtn.classList.remove('hidden');
                nextBtn.textContent = (stepIndex === onboardingSteps.length - 1) ? 'Finalizar' : 'Siguiente';
            }
            prevBtn.classList.add('hidden'); // Simplificamos: no hay botón "Anterior" en el flujo interactivo.
            skipBtn.style.visibility = 'visible';

            const targetElement = step.element ? select(step.element) : select('app-root');
            if (targetElement) {
                // Lógica de posicionamiento (igual que antes)
                 const rect = targetElement.getBoundingClientRect();
                highlightBox.style.display = 'block';
                highlightBox.style.width = `${rect.width + 8}px`;
                highlightBox.style.height = `${rect.height + 8}px`;
                highlightBox.style.top = `${rect.top - 4}px`;
                highlightBox.style.left = `${rect.left - 4}px`;
                
                const boxRect = stepBox.getBoundingClientRect();
                const margin = 16;
                let top, left;
            
                switch (step.position) {
                    case 'top': top = rect.top - boxRect.height - margin; left = rect.left + (rect.width / 2) - (boxRect.width / 2); break;
                    case 'bottom': top = rect.bottom + margin; left = rect.left + (rect.width / 2) - (boxRect.width / 2); break;
                    case 'top-left': top = rect.top - boxRect.height - margin; left = rect.right - boxRect.width; break;
                    case 'bottom-right': top = rect.bottom + margin; left = rect.left + rect.width - boxRect.width; break;
                    case 'center': top = (window.innerHeight / 2) - (boxRect.height / 2); left = (window.innerWidth / 2) - (boxRect.width / 2); highlightBox.style.display = 'none'; break;
                    default: top = rect.bottom + margin; left = rect.left + (rect.width / 2) - (boxRect.width / 2);
                }
                
                stepBox.style.top = `${Math.max(margin, Math.min(top, window.innerHeight - boxRect.height - margin))}px`;
                stepBox.style.left = `${Math.max(margin, Math.min(left, window.innerWidth - boxRect.width - margin))}px`;

            } else {
                 console.warn("Elemento del onboarding no encontrado:", step.element);
                 highlightBox.style.display = 'none';
            }
        };
        
        
        
        // =================================================================================
        // 2. FIREBASE & DATA HANDLING (REFACTORIZADO PARA PAGINACIÓN Y CONSULTAS EFICIENTES)
        // =================================================================================
        firebase.initializeApp(firebaseConfig);
        const fbAuth = firebase.auth();
        fbAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        const fbDb = firebase.firestore();
        
        fbDb.enablePersistence({synchronizeTabs: true}).catch(err => {
            if (err.code == 'failed-precondition') showToast('Modo offline no disponible (múltiples pestañas).', 'warning');
            else if (err.code == 'unimplemented') showToast('Navegador no soporta modo offline.', 'warning');
        });
        
        // --- NUEVOS ASISTENTES DE FIRESTORE ---
        // REEMPLAZA tu función saveDoc con esta:
async function saveDoc(collectionName, docId, data, btn = null) {
    if (!currentUser) { showToast("Error: No hay usuario.", "danger"); return; }
    if (btn) setButtonLoading(btn, true);

    syncState = 'syncing';
    updateSyncStatusIcon();

    try {
        const docRef = fbDb.collection('users').doc(currentUser.uid).collection(collectionName).doc(docId);
        await docRef.set(data, { merge: true });
        
        // Espera a que los datos se confirmen en el servidor (opcional pero recomendado para precisión)
        await fbDb.waitForPendingWrites();

        syncState = 'synced';
        
    } catch (error) {
        console.error(`Error guardando en ${collectionName}:`, error);
        showToast("Error al guardar.", "danger");
        syncState = 'error';
    } finally {
        if (btn) setButtonLoading(btn, false);
        updateSyncStatusIcon();
    }
}


        /**
         * Actualiza el saldo de una cuenta de forma atómica.
         * @param {string} cuentaId - El ID de la cuenta a actualizar.
         * @param {number} amountInCents - La cantidad a sumar (positivo para ingresos, negativo para gastos).
         */
        async function updateAccountBalance(cuentaId, amountInCents) {
            if (!currentUser || !cuentaId || typeof amountInCents !== 'number') {
                console.error("Argumentos inválidos para updateAccountBalance");
                return;
            }

            try {
                const accountRef = fbDb.collection('users').doc(currentUser.uid).collection('cuentas').doc(cuentaId);
                // FieldValue.increment es una operación atómica del lado del servidor.
                // Es la forma más segura y eficiente de actualizar contadores.
                await accountRef.update({
                    saldo: firebase.firestore.FieldValue.increment(amountInCents)
                });
            } catch (error) {
                console.error(`Error al actualizar saldo de la cuenta ${cuentaId}:`, error);
                showToast("Error crítico: no se pudo actualizar el saldo.", "danger");
            }
        }
        
/**
 * Script de migración de un solo uso para calcular y guardar el saldo inicial
 * en cada documento de cuenta. EJECUTAR UNA SOLA VEZ DESDE LA CONSOLA.
 */
async function migrateBalancesToAccounts() {
    if (!currentUser) {
        console.error("Debes iniciar sesión para ejecutar la migración.");
        return;
    }
    console.log("🚀 Iniciando migración de saldos...");

    // Usamos fbDb, que es nuestra instancia de Firestore en el cliente.
    const userRef = fbDb.collection('users').doc(currentUser.uid);

    // 1. Obtener todas las cuentas y resetear sus saldos a 0.
    const cuentasSnapshot = await userRef.collection('cuentas').get();
    const cuentas = {};
    cuentasSnapshot.forEach(doc => {
        cuentas[doc.id] = { ref: doc.ref, saldo: 0 };
    });

            const movimientosSnapshot = await userRef.collection('movimientos').get();
            console.log(`Procesando ${movimientosSnapshot.size} movimientos...`);
            movimientosSnapshot.forEach(doc => {
                const mov = doc.data();
                if (mov.tipo === 'traspaso') {
                    if (cuentas[mov.cuentaOrigenId]) cuentas[mov.cuentaOrigenId].saldo -= mov.cantidad;
                    if (cuentas[mov.cuentaDestinoId]) cuentas[mov.cuentaDestinoId].saldo += mov.cantidad;
                } else {
                    if (cuentas[mov.cuentaId]) cuentas[mov.cuentaId].saldo += mov.cantidad;
                }
            });

            const batch = fbDb.batch(); 
            for (const cuentaId in cuentas) {
                const cuentaData = cuentas[cuentaId];
                batch.update(cuentaData.ref, { saldo: cuentaData.saldo });
            }

            await batch.commit();
            console.log(`🎉 ¡Migración completada! Se actualizaron los saldos de ${Object.keys(cuentas).length} cuentas.`);
            alert("¡Migración de saldos completada! La aplicación ahora usará los saldos en tiempo real. Por favor, recarga la página para ver los cambios.");
        }
        window.migrateBalancesToAccounts = migrateBalancesToAccounts;
        
        async function deleteDoc(collectionName, docId) {
    if (!currentUser) { showToast("Error: No hay usuario.", "danger"); return; }
    
    syncState = 'syncing';
    updateSyncStatusIcon();

    try {
        await fbDb.collection('users').doc(currentUser.uid).collection(collectionName).doc(docId).delete();
        await fbDb.waitForPendingWrites();
        syncState = 'synced';
    } catch (error) {
        console.error(`Error borrando de ${collectionName}:`, error);
        showToast("Error al borrar.", "danger");
        syncState = 'error';
    } finally {
        updateSyncStatusIcon();
    }
}
        
        // --- FUNCIÓN DE CARGA PRINCIPAL REFACTORIZADA ---
        async function loadCoreData(uid) {
            // Limpia listeners anteriores si existen
            unsubscribeListeners.forEach(unsub => unsub());
            unsubscribeListeners = [];
            
            const userRef = fbDb.collection('users').doc(uid);

            const collectionsToLoad = ['cuentas', 'conceptos', 'presupuestos', 'recurrentes', 'inversiones_historial', 'inversion_cashflows'];

            collectionsToLoad.forEach(collectionName => {
            const unsubscribe = userRef.collection(collectionName).onSnapshot(snapshot => {
                db[collectionName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                if (['cuentas', 'conceptos'].includes(collectionName)) {
                    populateAllDropdowns();
                }
                
                if (collectionName === 'cuentas' && select(PAGE_IDS.INICIO)?.classList.contains('view--active')) {
                    _renderRecientesFromCache();
                }

                // =================================================================================
                // INICIO DE LA NUEVA MODIFICACIÓN
                // =================================================================================
                // Si los datos de 'recurrentes' han cambiado y estamos en la página de Inicio,
                // forzamos una re-renderización del widget de recurrentes pendientes.
                if (collectionName === 'recurrentes' && select(PAGE_IDS.INICIO)?.classList.contains('view--active')) {
                    renderPendingRecurrents();
                }
                // =================================================================================
                // FIN DE LA NUEVA MODIFICACIÓN
                // =================================================================================

                if (collectionName === 'cuentas' && select(PAGE_IDS.PATRIMONIO)?.classList.contains('view--active')) {
                    renderPatrimonioPage();
                }
            }, error => {
                console.error(`Error escuchando la colección ${collectionName}: `, error);
                showToast(`Error al cargar ${collectionName}.`, "danger");
            });
            unsubscribeListeners.push(unsubscribe);
        });

            const unsubConfig = userRef.onSnapshot(doc => {
                db.config = doc.exists && doc.data().config ? doc.data().config : getInitialDb().config;
                localStorage.setItem('skipIntro', db.config?.skipIntro || 'false');
                loadConfig(); // Aplicar config a la UI
            }, error => {
                console.error("Error escuchando la configuración del usuario: ", error);
                showToast("Error al cargar la configuración.", "danger");
            });
            unsubscribeListeners.push(unsubConfig);
			                        
            buildDescriptionIndex();
            startMainApp();
        };

        const checkAuthState = () => {
            // Primero, revisamos si hay un PIN configurado para este dispositivo
            const storedPinHash = localStorage.getItem('pinUserHash');
            const storedEmail = localStorage.getItem('pinUserEmail');

            if (storedPinHash && storedEmail) {
                // Si hay PIN, mostramos la pantalla de PIN en lugar de esperar a Firebase
                showPinLoginScreen(storedEmail);
            }

            // El listener de Firebase sigue funcionando en segundo plano
            fbAuth.onAuthStateChanged((user) => {
                if (user) {
                    currentUser = user;
                    // Si el usuario ya está logueado y no había PIN, cargamos la app
                    // Si había PIN y ya lo introdujo, esta parte se ejecutará igualmente para cargar los datos
                    if (!storedPinHash) {
                         loadCoreData(user.uid);
                    }
                } else {
                    currentUser = null;
                    unsubscribeListeners.forEach(unsub => unsub());
                    unsubscribeListeners = [];
                    db = getInitialDb();
                    // Si no hay PIN configurado, mostramos el login normal
                    if (!storedPinHash) {
                        showLoginScreen();
                    }
                }
            });
        };

        // =================================================================================
        // 2.5. LÓGICA DE MOVIMIENTOS RECURRENTES
        // =================================================================================
        const calculateNextDueDate = (currentDueDate, frequency) => {
            const d = new Date(currentDueDate);
            d.setHours(12, 0, 0, 0); 
        
            switch (frequency) {
                case 'daily': return addDays(d, 1);
                case 'weekly': return addWeeks(d, 1);
                case 'monthly': return addMonths(d, 1);
                case 'yearly': return addYears(d, 1);
                default: return d;
            }
        };
        
        // =================================================================================
		// 3. UI UTILITIES & HELPERS
		// =================================================================================
		const select = (id) => document.getElementById(id);
		const selectAll = (s) => document.querySelectorAll(s);
		const selectOne = (s) => document.querySelector(s);
        
        const applyStaticTranslations = () => {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                el.textContent = t(key);
            });
             document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.dataset.i18nPlaceholder;
                el.placeholder = t(key);
            });
            document.querySelectorAll('[data-i18n-title]').forEach(el => {
                const key = el.dataset.i18nTitle;
                el.title = t(key);
            });
        };

		const chunkArray = (array, size) => {
			const chunks = [];
			for (let i = 0; i < array.length; i += size) {
				chunks.push(array.slice(i, i + size));
			}
			return chunks;
		};

		const measureListItemHeights = () => {
			const container = select('movimientos-list-container');
			if (!container) return;

            const tempTransaction = document.createElement('div');
            tempTransaction.style.position = 'absolute';
            tempTransaction.style.visibility = 'hidden';
            tempTransaction.style.zIndex = '-1';
            tempTransaction.innerHTML = renderVirtualListItem({
                type: 'transaction',
                movement: { id: 'temp', fecha: new Date().toISOString(), cantidad: -1000, descripcion: 'Medición', tipo: 'movimiento', cuentaId: '1', conceptoId: '1' }
            });
            container.appendChild(tempTransaction);
            vList.heights.transaction = tempTransaction.offsetHeight;
            container.removeChild(tempTransaction);

            const tempTransfer = document.createElement('div');
            tempTransfer.style.position = 'absolute';
            tempTransfer.style.visibility = 'hidden';
            tempTransfer.style.zIndex = '-1';
            tempTransfer.innerHTML = renderVirtualListItem({
                type: 'transaction',
                movement: { id: 'temp', fecha: new Date().toISOString(), cantidad: 5000, descripcion: 'Medición Traspaso', tipo: 'traspaso', cuentaOrigenId: '1', cuentaDestinoId: '2' }
            });
            container.appendChild(tempTransfer);
            vList.heights.transfer = tempTransfer.offsetHeight;
            container.removeChild(tempTransfer);

            const tempHeader = document.createElement('div');
            tempHeader.style.position = 'absolute';
            tempHeader.style.visibility = 'hidden';
            tempHeader.style.zIndex = '-1';
            tempHeader.innerHTML = renderVirtualListItem({
                type: 'date-header',
                date: new Date().toISOString().slice(0, 10),
                total: 12345
            });
            container.appendChild(tempHeader);
            vList.heights.header = tempHeader.offsetHeight;
            container.removeChild(tempHeader);

            console.log('Alturas de elementos medidas dinámicamente:', vList.heights);
        };
        const hapticFeedback = (type = 'light') => {
            if ('vibrate' in navigator) {
                try {
                    let pattern;
                    switch (type) {
                        case 'light':   pattern = 10; break;
                        case 'medium':  pattern = 25; break;
                        case 'success': pattern = [15, 60, 15]; break;
                        case 'warning': pattern = [30, 40, 30]; break;
                        case 'error':   pattern = [50, 50, 50]; break;
                        default:        pattern = 10;
                    }
                    navigator.vibrate(pattern);
                } catch (e) {}
            }
        };

        const parseDateStringAsUTC = (dateString) => {
            if (!dateString) return null;
            return new Date(dateString + 'T12:00:00Z');
        };

        const generateId = () => fbDb.collection('users').doc().id;
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const formatCurrency = (numInCents) => {
            const number = (numInCents || 0) / 100;
            return new Intl.NumberFormat(locales[currentLanguage], { style: 'currency', currency: 'EUR' }).format(number);
        };
        const toSentenceCase = (str) => {
			if (!str || typeof str !== 'string') return '';
			return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
		};
		const showToast = (message, type = 'default', duration = 3000) => {
            const c = select('toast-container'); if (!c) return;
            const t = document.createElement('div');
            t.className = `toast toast--${type}`;
            c.appendChild(t); 

            const fadeIn = t.animate([ { transform: 'translateY(20px) scale(0.95)', opacity: 0 }, { transform: 'translateY(0) scale(1)', opacity: 1 } ], { duration: 300, easing: 'ease-out' });
        
            fadeIn.onfinish = () => {
                t.textContent = message; 
                t.classList.add(`toast--${type}`); 
                if (type === 'danger' || type === 'error') hapticFeedback('error');
                else if (type === 'warning') hapticFeedback('warning');

                setTimeout(() => {
                    t.animate([ { opacity: 1 }, { opacity: 0 } ], { duration: 300, easing: 'ease-in' }).onfinish = () => t.remove();
                }, duration - 600);
            };
        };
        const setButtonLoading = (btn, isLoading, text = 'Cargando...') => {
            if (!btn) return;
            if (isLoading) { if (!originalButtonTexts.has(btn)) originalButtonTexts.set(btn, btn.innerHTML); btn.setAttribute('disabled', 'true'); btn.classList.add('btn--loading'); btn.innerHTML = `<span class="spinner"></span> <span>${text}</span>`;
            } else { btn.removeAttribute('disabled'); btn.classList.remove('btn--loading'); if (originalButtonTexts.has(btn)) { btn.innerHTML = originalButtonTexts.get(btn); originalButtonTexts.delete(btn); } }
        };
        const displayError = (id, msg) => { const err = select(`${id}-error`); if (err) { err.textContent = msg; err.setAttribute('role', 'alert'); } const inp = select(id); if (inp) inp.classList.add('form-input--invalid'); };
        const clearError = (id) => { const err = select(`${id}-error`); if (err) { err.textContent = ''; err.removeAttribute('role'); } const inp = select(id); if (inp) inp.classList.remove('form-input--invalid'); };
        const clearAllErrors = (formId) => { const f = select(formId); if (!f) return; f.querySelectorAll('.form-error').forEach((e) => e.textContent = ''); f.querySelectorAll('.form-input--invalid').forEach(e => e.classList.remove('form-input--invalid')); };
        const animateCountUp = (el, end, duration = 700, formatAsCurrency = true, prefix = '', suffix = '') => {
            if (!el) return;
            const start = parseFloat(el.dataset.currentValue || '0');
            const endValue = end / 100;
            if (start === endValue || !el.offsetParent) { el.textContent = formatAsCurrency ? formatCurrency(end) : `${prefix}${end}${suffix}`; el.dataset.currentValue = String(endValue); return; }
            el.dataset.currentValue = String(endValue); let startTime = null;
            const step = (timestamp) => { if (!startTime) startTime = timestamp; const p = Math.min((timestamp - startTime) / duration, 1); const current = p * (end - start*100) + start*100; el.textContent = formatAsCurrency ? formatCurrency(current) : `${prefix}${current.toFixed(2)}${suffix}`; if (p < 1) requestAnimationFrame(step); else el.textContent = formatAsCurrency ? formatCurrency(end) : `${prefix}${end/100}${suffix}`; };
            requestAnimationFrame(step);
        };
        const escapeHTML = str => (str ?? '').replace(/[&<>"']/g, match => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[match]);
        
        const parseCurrencyString = (str) => {
            if (typeof str !== 'string' || !str.trim()) return NaN;
            
            let cleanStr = str.replace(/[€$£\s]/g, '');

            const hasComma = cleanStr.includes(',');
            const hasPeriod = cleanStr.includes('.');

            if (hasComma && hasPeriod) {
                if (cleanStr.lastIndexOf(',') > cleanStr.lastIndexOf('.')) {
                    cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
                } else {
                    cleanStr = cleanStr.replace(/,/g, '');
                }
            } else if (hasComma) {
                cleanStr = cleanStr.replace(',', '.');
            }
            
            return parseFloat(cleanStr);
        };
		
        // =================================================================================
        // 4. APP INITIALIZATION & AUTH
        // =================================================================================
        const initApp = async () => {
            document.documentElement.lang = currentLanguage;
            applyStaticTranslations();
            setupTheme();
			const savedTheme = localStorage.getItem('appTheme') || 'default';
			document.body.dataset.theme = savedTheme;
            attachEventListeners();
            
            const intro = select('introScreen'), quoteContainer = select('quoteContainer');
            if (localStorage.getItem('skipIntro') === 'true') { if (intro) intro.remove(); } 
            else if (intro && quoteContainer && quotesData.length) {
                const r = quotesData[Math.floor(Math.random() * quotesData.length)];
                const quoteTextEl = select('quoteText');
                const quoteAuthorEl = select('quoteAuthor');
                if(quoteTextEl) quoteTextEl.textContent = `"${r.cita}"`;
                if(quoteAuthorEl) quoteAuthorEl.textContent = `— ${r.autor}`;
                await wait(2500); quoteContainer.classList.add('visible');
                await wait(4000); (intro).style.opacity = '0';
                await wait(750); intro.remove();
            } else if (intro) { intro.remove(); }
            
            checkAuthState();
        };
		window.addEventListener('online', () => {
    console.log("Conexión recuperada. Sincronizando...");
    syncState = 'syncing';
    updateSyncStatusIcon();
    setTimeout(() => {
        syncState = 'synced';
        updateSyncStatusIcon();
    }, 2500);
});

window.addEventListener('offline', () => {
    console.log("Se ha perdido la conexión.");
    syncState = 'error';
    updateSyncStatusIcon();
});
    const startMainApp = async () => {
        select('login-screen')?.classList.remove('login-view--visible');
        select('pin-login-screen')?.classList.remove('login-view--visible');
        select('app-root')?.classList.add('app-layout--visible');
        
        populateAllDropdowns();
        loadConfig();
        
        measureListItemHeights();
        
        updateSyncStatusIcon();
        buildIntelligentIndex();
        navigateTo(PAGE_IDS.INICIO, true);

        if (localStorage.getItem('onboardingCompleted_v2') !== 'true') {
            await wait(1000);
            startOnboarding();
        }
    };
        
    const showLoginScreen = () => {
        select('app-root')?.classList.remove('app-layout--visible');
        select('pin-login-screen')?.classList.remove('login-view--visible');
        select('login-screen')?.classList.add('login-view--visible');
    };

    const showPinLoginScreen = (email) => {
        select('app-root')?.classList.remove('app-layout--visible');
        select('login-screen')?.classList.remove('login-view--visible');
        const pinScreen = select('pin-login-screen');
        pinScreen?.classList.add('login-view--visible');
        
        select('pin-login-email').textContent = email;
        const pinContainer = select('pin-inputs-container');
        pinContainer.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const input = document.createElement('input');
            input.type = 'password';
            input.className = 'pin-input';
            input.id = `pin-input-${i}`;
            input.maxLength = 1;
            input.pattern = "[0-9]*";
            input.inputMode = "numeric";
            pinContainer.appendChild(input);
        }
        pinContainer.querySelector('#pin-input-0')?.focus();
    };

    const handlePinLogin = async (pin) => {
        const errorEl = select('pin-login-error');
        const storedPinHash = localStorage.getItem('pinUserHash');
        
        const isValid = await verifyPin(pin, storedPinHash);
        
        if (isValid) {
            errorEl.textContent = '';
            hapticFeedback('success');
            if (currentUser) {
                loadCoreData(currentUser.uid);
            } else {
                showToast('Tu sesión ha expirado, por favor inicia sesión de nuevo.', 'warning');
                handleForgotPin();
            }
        } else {
            errorEl.textContent = 'PIN incorrecto. Inténtalo de nuevo.';
            hapticFeedback('error');
            selectAll('.pin-input').forEach(input => input.value = '');
            select('#pin-input-0')?.focus();
        }
    };

    const handleForgotPin = () => {
        showConfirmationModal('Esto eliminará tu PIN guardado en este dispositivo y deberás iniciar sesión con tu contraseña. ¿Continuar?', () => {
            localStorage.removeItem('pinUserHash');
            localStorage.removeItem('pinUserEmail');
            select('pin-login-screen')?.classList.remove('login-view--visible');
            showLoginScreen();
            showToast('PIN eliminado. Por favor, inicia sesión.', 'info');
        }, '¿Olvidaste tu PIN?');
    };

    const showPinSetupModal = () => {
        const hasPin = !!localStorage.getItem('pinUserHash');
        const title = hasPin ? 'Cambiar PIN de Acceso' : 'Configurar PIN de Acceso';
        const buttonText = hasPin ? 'Cambiar PIN' : 'Guardar PIN';
        const html = `
            <p class="form-label" style="margin-bottom: var(--sp-3);">
                Introduce un PIN de 4 dígitos. Lo usarás para acceder rápidamente a tu cuenta en este dispositivo.
            </p>
            <form id="setup-pin-form">
                <div class="form-group">
                    <label for="new-pin" class="form-label">Nuevo PIN de 4 dígitos</label>
                    <input type="password" id="new-pin" class="form-input" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" required>
                </div>
                <div class="form-group">
                    <label for="confirm-pin" class="form-label">Confirma el nuevo PIN</label>
                    <input type="password" id="confirm-pin" class="form-input" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" required>
                </div>
                <div class="modal__actions" style="flex-direction: column; align-items: stretch; gap: 1rem;">
                     <button type="submit" class="btn btn--primary">${buttonText}</button>
                     ${hasPin ? '<button type="button" class="btn btn--danger" data-action="remove-pin">Eliminar PIN</button>' : ''}
                </div>
            </form>
        `;
        showGenericModal(title, html);
    };

        const handleLogin = (btn) => {
            const email = (select('login-email')).value.trim(), password = (select('login-password')).value, errEl = select('login-error'); clearAllErrors('login-form'); if(errEl) errEl.textContent = ''; let v = true;
            if (!email) { displayError('login-email', 'El correo es obligatorio.'); v = false; }
            if (!password) { displayError('login-password', 'La contraseña es obligatoria.'); v = false; }
            if (!v) return; setButtonLoading(btn, true, 'Iniciando...');
            fbAuth.signInWithEmailAndPassword(email, password).then(() => showToast(`¡Bienvenido/a de nuevo!`)).catch((err) => { setButtonLoading(btn, false); if (['auth/wrong-password', 'auth/user-not-found', 'auth/invalid-credential'].includes(err.code)) (errEl).textContent = 'Error: Credenciales incorrectas.'; else if (err.code === 'auth/invalid-email') displayError('login-email', 'Formato de correo no válido.'); else (errEl).textContent = 'Error al iniciar sesión.'; });
        };
        const handleRegister = (btn) => {
            const email = (select('login-email')).value.trim(), password = (select('login-password')).value, errEl = select('login-error'); clearAllErrors('login-form'); if(errEl) errEl.textContent = ''; let v = true;
            if (!email) { displayError('login-email', 'El correo es obligatorio.'); v = false; }
            if (password.length < 6) { displayError('login-password', 'La contraseña debe tener al menos 6 caracteres.'); v = false; }
            if (!v) return; setButtonLoading(btn, true, 'Registrando...');
            fbAuth.createUserWithEmailAndPassword(email, password).then(() => showToast(`¡Registro completado!`)).catch((err) => { setButtonLoading(btn, false); if (err.code == 'auth/weak-password') displayError('login-password', 'La contraseña debe tener al menos 6 caracteres.'); else if (err.code == 'auth/email-already-in-use') displayError('login-email', 'El correo ya está registrado.'); else if (err.code === 'auth/invalid-email') displayError('login-email', 'Formato de correo no válido.'); else (errEl).textContent = 'Error en el registro.'; });
        };
        const handleExitApp = () => {
            const exitScreen = select('exit-screen');
            if (exitScreen) {
                exitScreen.style.display = 'flex';
                setTimeout(() => exitScreen.style.opacity = '1', 50);
            }
        };
        
        // =================================================================================
        // 5. NAVIGATION & UI CONTROL (REESTRUCTURADO)
        // =================================================================================
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
			if (oldViewId === PAGE_IDS.INICIO && unsubscribeRecientesListener) {
				console.log("Saliendo de Inicio, desconectando el listener de recientes.");
				unsubscribeRecientesListener();
				unsubscribeRecientesListener = null;
    }
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
                [PAGE_IDS.ANALISIS]: { titleKey: 'title_analysis', render: renderAnalisisPage, actions: standardActions },
                [PAGE_IDS.CONFIGURACION]: { titleKey: 'title_settings', render: loadConfig, actions: standardActions },
                [PAGE_IDS.MOVIMIENTOS_FULL]: { titleKey: 'title_history', render: loadInitialMovements, actions: standardActions },
            };
            
            if (pageRenderers[pageId]) {
                 if (titleEl) { titleEl.textContent = t(pageRenderers[pageId].titleKey); }
                if (actionsEl) {
                    actionsEl.innerHTML = pageRenderers[pageId].actions;
                    applyStaticTranslations();
                }
                pageRenderers[pageId].render();
            }
            
            const mainScroller = selectOne('.app-layout__main'); if (mainScroller) mainScroller.scrollTop = 0;
            selectAll('.view').forEach(p => p.classList.remove('view--active'));
            select(pageId)?.classList.add('view--active');
            selectAll('.bottom-nav__item').forEach(b => b.classList.toggle('bottom-nav__item--active', b.dataset.page === pageId));
            
            fab?.classList.toggle('fab--visible', [PAGE_IDS.INICIO, PAGE_IDS.PATRIMONIO, PAGE_IDS.ANALISIS, PAGE_IDS.MOVIMIENTOS_FULL].includes(pageId));
        };
        
        const setupTheme = () => { 
            const gridColor = 'rgba(255, 255, 255, 0.1)';
            const textColor = '#FFFFFF';
            Chart.defaults.color = textColor; 
            Chart.defaults.borderColor = gridColor;
            Chart.register(ChartDataLabels);
        };
        
        // =================================================================================
        // 6. CORE LOGIC & CALCULATIONS (REFACTORIZADO PARA CONSULTAS EFICIENTES)
        // =================================================================================
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
                const singleIrrCashflows = []; if (capitalBase !== 0) singleIrrCashflows.push({ amount: -capitalBase, date: new Date(cuentaUnica.fechaCreacion) }); cashflows.forEach(cf => singleIrrCashflows.push({ amount: -cf.cantidad, date: new Date(cf.fecha) })); if (valorActual !== 0) { singleIrrCashflows.push({ amount: valorActual, date: new Date() }); } const irrUnico = calculateIRR(singleIrrCashflows);
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
        
        // =================================================================================
        // 7. RENDERING ENGINE & BUDGET FUNCTIONS
        // =================================================================================
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
            renderBudgetTracking(); 
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
    
    const allYearBudgets = (db.presupuestos || [])
        .filter(b => b.ano === year && db.conceptos.find(c => c.id === b.conceptoId));

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

    const expenseBudgets = allYearBudgets.filter(b => b.cantidad < 0);
    let totalBudgetedExpense = 0;
    const expenseDetails = expenseBudgets.map(budget => {
        const actualSpent = Math.abs(movements.filter(m => m.conceptoId === budget.conceptoId && m.cantidad < 0).reduce((sum, m) => sum + m.cantidad, 0));
        const budgetLimit = Math.abs(budget.cantidad);
        totalBudgetedExpense += budgetLimit;

        const rawPacePercentage = (budgetLimit > 0 && yearProgress > 0) ? ((actualSpent / budgetLimit) / (yearProgress / 100)) * 100 : (actualSpent > 0 ? 200 : 100);
        const pacePercentage = Math.min(rawPacePercentage, 200);

        let status;
        if (rawPacePercentage > 120) {
            status = { text: 'Excedido', icon: 'cancel', color: 'text-danger' };
        } else if (rawPacePercentage >= 80) {
            status = { text: 'Vas bien', icon: 'check_circle', color: 'text-info' };
        } else {
            status = { text: 'Ahorrando', icon: 'verified', color: 'text-positive' };
        }

        const projectedAnnualSpent = (daysPassed > 0) ? (actualSpent / daysPassed) * totalDaysInYear : 0;
        return { ...budget, actual: actualSpent, limit: budgetLimit, projected: projectedAnnualSpent, pacePercentage, status };
    });
    const totalProjectedExpense = expenseDetails.reduce((sum, b) => sum + b.projected, 0);

    const incomeBudgets = allYearBudgets.filter(b => b.cantidad >= 0);
    let totalBudgetedIncome = 0;
    const incomeDetails = incomeBudgets.map(budget => {
        const actualIncome = movements.filter(m => m.conceptoId === budget.conceptoId && m.cantidad > 0).reduce((sum, m) => sum + m.cantidad, 0);
        const budgetGoal = budget.cantidad;
        totalBudgetedIncome += budgetGoal;

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

        const projectedAnnualIncome = (daysPassed > 0) ? (actualIncome / daysPassed) * totalDaysInYear : 0;
        return { ...budget, actual: actualIncome, limit: budgetGoal, projected: projectedAnnualIncome, pacePercentage, status };
    });
    const totalProjectedIncome = incomeDetails.reduce((sum, b) => sum + b.projected, 0);

    const projectedNet = totalProjectedIncome - totalProjectedExpense;
    const kpiContainer = select('budget-kpi-container');
    kpiContainer.innerHTML = `
        <div class="kpi-item"><h4 class="kpi-item__label">Proyección Ingresos</h4><strong class="kpi-item__value text-positive">${formatCurrency(totalProjectedIncome)}</strong></div>
        <div class="kpi-item"><h4 class="kpi-item__label">Proyección Gastos</h4><strong class="kpi-item__value text-negative">${formatCurrency(totalProjectedExpense)}</strong></div>
        <div class="kpi-item"><h4 class="kpi-item__label">Proyección Neta Anual</h4><strong class="kpi-item__value ${projectedNet >= 0 ? 'text-positive' : 'text-negative'}">${formatCurrency(projectedNet)}</strong></div>
    `;
    renderBudgetTrendChart(monthlyIncomeData, monthlyExpenseData, totalBudgetedExpense / 12);

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
            renderGaugeChart(`gauge-chart-${b.id}`, b.pacePercentage, 100);
        });
    }, 50);
};

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

const renderGaugeChart = (canvasId, percentageConsumed, yearProgressPercentage) => {
    const ctx = select(canvasId)?.getContext('2d');
    if (!ctx) return;

    if (Chart.getChart(canvasId)) {
        Chart.getChart(canvasId).destroy();
    }

    const isAheadOfPace = percentageConsumed > yearProgressPercentage;
    
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
    
    const paceLinePlugin = {
        id: 'paceLine',
        afterDraw: chart => {
            const { ctx, chartArea } = chart;
            const angle = Math.PI + (Math.PI * yearProgressPercentage / 100);
            const cx = (chartArea.left + chartArea.right) / 2;
            const cy = (chartArea.top + chartArea.bottom) / 2 + 15;
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
    
    const colorSuccess = getComputedStyle(document.body).getPropertyValue('--c-success').trim();
    const colorDanger = getComputedStyle(document.body).getPropertyValue('--c-danger').trim();
    const colorWarning = getComputedStyle(document.body).getPropertyValue('--c-warning').trim();

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ingresos Mensuales',
                    data: incomeData,
                    backgroundColor: colorSuccess, 
                    borderRadius: 4,
                    order: 2
                },
                {
                    label: 'Gastos Mensuales',
                    data: expenseData,
                    backgroundColor: colorDanger, 
                    borderRadius: 4,
                    order: 3
                },
                {
                    type: 'line',
                    label: 'Promedio Gasto Presupuestado',
                    data: Array(12).fill(averageBudgetedExpense / 100),
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

const renderCuentas = async (targetContainerId, totalPatrimonio = 0) => {
    const container = select(targetContainerId);
    if (!container) return;
    
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
        const porcentajeGlobal = totalPatrimonio > 0 ? (typeBalance / totalPatrimonio) * 100 : 0;

        const accountsHtml = accountsInType.sort((a,b) => a.nombre.localeCompare(b.nombre)).map((c) => {
            const balance = saldos[c.id] || 0;
            const porcentajeGrupo = typeBalance > 0 ? (balance / typeBalance) * 100 : 0;
            const investmentIcon = c.esInversion ? `<span class="material-icons text-info" style="font-size: 14px; margin-left: var(--sp-2);" title="Cuenta de Portafolio">trending_up</span>` : '';
            
            return `
                <div class="modal__list-item" data-action="view-account-details" data-id="${c.id}" style="cursor: pointer; padding-left: 0; padding-right: 0;">
                    <div>
                        <span style="display: block; font-weight: 500;">${c.nombre}</span>
                        <small style="color: var(--c-on-surface-secondary); font-weight: 500;">${porcentajeGrupo.toFixed(1)}% del total de ${tipo}</small>
                    </div>
                    <div style="display: flex; align-items: center; gap: var(--sp-2);">${formatCurrency(balance)}${investmentIcon}<span class="material-icons" style="font-size: 18px; color: var(--c-on-surface-secondary);">chevron_right</span></div>
                </div>`;
        }).join('');
        
        if (!accountsHtml) return '';
        
        const icon = tipo==='EFECTIVO'?'payments':(tipo.includes('TARJETA')?'credit_card':(tipo==='AHORRO'?'savings':(tipo==='INVERSIÓN'?'trending_up':(tipo==='PROPIEDAD'?'domain':(tipo==='PRÉSTAMO'?'credit_score':'account_balance')))));
        
        return `
            <details class="accordion">
                <summary>
                    <span class="account-group__name"><span class="material-icons" style="vertical-align:bottom;font-size:16px;margin-right:8px">${icon}</span>${tipo}</span>
                    <div style="display:flex; align-items:center; gap:var(--sp-2);">
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
        
		 const renderInicioPage = () => {
    const container = select(PAGE_IDS.INICIO);
    if (!container) return;

    if (conceptosChart) {
        conceptosChart.destroy();
        conceptosChart = null;
    }

    container.innerHTML = `
        <div id="inicio-view-switcher" class="filter-pills" style="justify-content: center;">
            <button class="filter-pill filter-pill--active" data-action="set-inicio-view" data-view="recientes">Recientes</button>
            <button class="filter-pill" data-action="set-inicio-view" data-view="resumen">Resumen</button>
        </div>
        <div id="pending-recurrents-container"></div>
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
    
    populateAllDropdowns();
    select('filter-periodo')?.dispatchEvent(new Event('change')); 
    renderPendingRecurrents();
    renderInicioResumenView();
    renderInicioRecientesView();
};    
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
            
            updateDashboardData();
        };

        const _renderRecientesFromCache = async () => {
            const recientesContainer = select('inicio-view-recientes');
            if (!recientesContainer) return;
            
            const movsToDisplay = recentMovementsCache;
            
            if (movsToDisplay.length === 0) {
                recientesContainer.innerHTML = `<div class="empty-state" style="border: none; background: transparent;"><p>No hay movimientos recientes en esta contabilidad.</p></div>`;
                return;
            }

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
                
                group.movements.sort((a, b) => b.id.localeCompare(a.id));

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
            
            const pending = db.recurrentes
            .filter(r => {
                const nextDate = parseDateStringAsUTC(r.nextDate);
                const normalizedNextDate = new Date(Date.UTC(nextDate.getUTCFullYear(), nextDate.getUTCMonth(), nextDate.getUTCDate()));

                return normalizedNextDate <= today;
            })
            .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));

            if (pending.length === 0) {
                container.innerHTML = '';
                return;
            }

            const itemsHTML = pending.map(r => {
                const nextDate = new Date(r.nextDate + 'T12:00:00Z');
                const formattedDate = nextDate.toLocaleDateString(locales[currentLanguage], { day: '2-digit', month: 'short', year: 'numeric' });
                const amountClass = r.cantidad >= 0 ? 'text-positive' : 'text-negative';
                
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
                
                buildIntelligentIndex(recentMovementsCache);
                
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
                                    formatter: (v,c)=>{ let s=c.chart.data.datasets[0].data.reduce((a,b)=>a+b,0); return s > 0 ? (v*100/s).toFixed(0)+"%" : "0%"; }, 
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
        
        budgetYearSelect.addEventListener('change', renderBudgetTracking);
    }
    
    populateAllDropdowns();
    
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
            if (cId) {
                if (m.cuentaOrigenId === cId) { 
                    gastos += -m.cantidad;
                }
                if (m.cuentaDestinoId === cId) { 
                    ingresos += m.cantidad;
                }
            } else {
                const origenVisible = visibleAccountIds.has(m.cuentaOrigenId);
                const destinoVisible = visibleAccountIds.has(m.cuentaDestinoId);
                
                if (origenVisible && !destinoVisible) { 
                    gastos += -m.cantidad;
                }
                else if (!origenVisible && destinoVisible) { 
                    ingresos += m.cantidad;
                }
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
                
                conceptosChart = new Chart(chartCtx, { 
                    type: 'bar', 
                    data: { 
                        labels: sortedTotals.map(([id]) => toSentenceCase(db.conceptos.find((c) => c.id === id)?.nombre || '?')), 
                        datasets: [{ 
                            data: sortedTotals.map(([, data]) => data.total / 100), 
                            backgroundColor: sortedTotals.map(([, data]) => data.total >= 0 ? colorSuccess : colorDanger), 
                            borderRadius: 6, 
                            // Store concept IDs for click handling
                            conceptIds: sortedTotals.map(([id]) => id)
                        }] 
                    }, 
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        plugins: { 
                            legend: { display: false }, 
                            datalabels: { display: false } 
                        }, 
                        scales: { 
                            y: { ticks: { callback: (value) => `${value.toLocaleString(locales[currentLanguage])}` } } 
                        },
                        onClick: (e) => {
                            const activePoints = conceptosChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                            if (activePoints.length > 0) {
                                const firstPoint = activePoints[0];
                                const conceptId = conceptosChart.data.datasets[firstPoint.datasetIndex].conceptIds[firstPoint.index];
                                if (conceptId) {
                                    handleChartClick(conceptId);
                                }
                            }
                        }
                    } 
                });

                conceptListContainer.innerHTML = sortedTotals.length === 0 ? `<div class="empty-state" style="padding:16px 0; background:transparent; border:none;"><p>Sin datos para los filtros.</p></div>` : sortedTotals.map(([id, data]) => { const con = db.conceptos.find((c) => c.id === id); const t = data.total; return `<details class="accordion" style="background-color: var(--c-surface-variant);"><summary><span style="display: flex; align-items: center; gap: 8px;"><span class="material-icons" style="font-size: 18px;">${data.icon}</span>${toSentenceCase(con?.nombre || '?')}</span><span><strong class="${t >= 0 ? 'text-positive' : 'text-negative'}">${formatCurrency(t)}</strong><span class="material-icons accordion__icon">expand_more</span></span></summary><div class="accordion__content">${data.movements.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map((mov) => `<div class="transaction-card" data-action="edit-movement" data-id="${mov.id}" style="border:0;"><div class="transaction-card__content" style="padding: var(--sp-1) 0; "><div style="flex-grow:1;min-width:0;"><div class="transaction-card__row-2" style="font-size:0.75rem;">${new Date(mov.fecha).toLocaleDateString(locales[currentLanguage])} - ${escapeHTML(mov.descripcion)}</div></div><div class="transaction-card__amount ${mov.cantidad >= 0 ? 'text-positive' : 'text-negative'}">${formatCurrency(mov.cantidad)}</div></div></div>`).join('')}</div></details>`; }).join('');
            }
        };
        const handleChartClick = (conceptId) => {
            const concepto = db.conceptos.find(c => c.id === conceptId);
            if (!concepto) return;
        
            activeMovementFilter = {
                type: 'concept',
                id: conceptId,
                name: concepto.nombre
            };
        
            navigateTo(PAGE_IDS.MOVIMIENTOS_FULL);
        };
        const renderVirtualListItem = (item) => {
            if (item.type === 'date-header') {
                const dateObj = new Date(item.date + 'T12:00:00Z');
                const day = dateObj.toLocaleDateString(locales[currentLanguage], { weekday: 'short' }).toUpperCase().replace('.', '');
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
            const filterBar = select('movimientos-filter-bar');

            if (!vList.scrollerEl) {
                vList.scrollerEl = selectOne('.app-layout__main');
                vList.sizerEl = select('virtual-list-sizer');
                vList.contentEl = select('virtual-list-content');
            }
            if (!listContainer || !emptyEl || !vList.sizerEl || !vList.contentEl) return;
            
            listContainer.classList.remove('hidden');
            emptyEl.classList.add('hidden');
            
            if(activeMovementFilter) {
                filterBar.classList.remove('hidden');
                select('movimientos-filter-text').textContent = `Filtro: ${activeMovementFilter.name}`;
            } else {
                filterBar.classList.add('hidden');
            }

            lastVisibleMovementDoc = null;
            allMovementsLoaded = false;
            isLoadingMoreMovements = false;
            runningBalancesCache = null;
			db.movimientos = [];
            vList.items = [];
            vList.itemMap = [];
            vList.sizerEl.style.height = '0px';
            vList.contentEl.innerHTML = '';

            await loadMoreMovements(true);
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

                if (activeMovementFilter && activeMovementFilter.type === 'concept') {
                    query = query.where('conceptoId', '==', activeMovementFilter.id);
                }

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
        
        // ... (The rest of the JS code from the file, including all event listeners, modals, form handlers, etc.)
        // Ensure to include the entire script logic here.
        
        document.addEventListener('DOMContentLoaded', initApp);