export type Language = "en" | "pt";

export const translations = {
  // Sidebar Navigation
  "nav.dashboard": { en: "Dashboard", pt: "Painel" },
  "nav.facilities": { en: "Facilities", pt: "Instalações" },
  "nav.assets": { en: "Assets", pt: "Ativos" },
  "nav.mocRequests": { en: "MOC Requests", pt: "Solicitações MOC" },
  "nav.riskAnalysis": { en: "Risk Analysis", pt: "Análise de Risco" },
  "nav.workOrders": { en: "Work Orders", pt: "Ordens de Serviço" },
  "nav.reports": { en: "Reports", pt: "Relatórios" },
  "nav.standards": { en: "Standards & Links", pt: "Normas e Links" },
  "nav.helpCenter": { en: "Help Center", pt: "Central de Ajuda" },
  "nav.administration": { en: "Administration", pt: "Administração" },
  "nav.userManagement": { en: "User Management", pt: "Gestão de Usuários" },

  // Sidebar
  "sidebar.collapse": { en: "Collapse", pt: "Recolher" },
  "sidebar.expand": { en: "Expand", pt: "Expandir" },
  "sidebar.lightMode": { en: "Light Mode", pt: "Modo Claro" },
  "sidebar.darkMode": { en: "Dark Mode", pt: "Modo Escuro" },
  "sidebar.managementOfChange": { en: "Management of Change", pt: "Gestão de Mudanças" },

  // TopBar
  "topbar.search": { en: "Search facilities, assets, MOCs...", pt: "Buscar instalações, ativos, MOCs..." },
  "topbar.myAccount": { en: "My Account", pt: "Minha Conta" },
  "topbar.profileSettings": { en: "Profile Settings", pt: "Configurações de Perfil" },
  "topbar.signOut": { en: "Sign Out", pt: "Sair" },
  "topbar.teamMember": { en: "Team Member", pt: "Membro da Equipe" },

  // Auth page
  "auth.welcome": { en: "Welcome", pt: "Bem-vindo" },
  "auth.subtitle": { en: "Sign in to your account or create a new one", pt: "Entre na sua conta ou crie uma nova" },
  "auth.signIn": { en: "Sign In", pt: "Entrar" },
  "auth.signUp": { en: "Sign Up", pt: "Cadastrar" },
  "auth.email": { en: "Email", pt: "E-mail" },
  "auth.password": { en: "Password", pt: "Senha" },
  "auth.confirmPassword": { en: "Confirm Password", pt: "Confirmar Senha" },
  "auth.fullName": { en: "Full Name", pt: "Nome Completo" },
  "auth.forgotPassword": { en: "Forgot password?", pt: "Esqueceu a senha?" },
  "auth.enterEmail": { en: "Enter your email", pt: "Digite seu e-mail" },
  "auth.enterPassword": { en: "Enter your password", pt: "Digite sua senha" },
  "auth.createPassword": { en: "Create a password", pt: "Crie uma senha" },
  "auth.confirmYourPassword": { en: "Confirm your password", pt: "Confirme sua senha" },
  "auth.enterFullName": { en: "Enter your full name", pt: "Digite seu nome completo" },
  "auth.signingIn": { en: "Signing in...", pt: "Entrando..." },
  "auth.creatingAccount": { en: "Creating account...", pt: "Criando conta..." },
  "auth.createAccount": { en: "Create Account", pt: "Criar Conta" },
  "auth.termsNotice": { en: "By continuing, you agree to our Terms of Service and Privacy Policy.", pt: "Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade." },
  "auth.platform": { en: "Management of Change Platform", pt: "Plataforma de Gestão de Mudanças" },

  // Forgot / Reset password
  "auth.forgotPasswordTitle": { en: "Forgot Password", pt: "Esqueceu a Senha" },
  "auth.forgotPasswordDesc": { en: "Enter your email and we'll send you a reset link", pt: "Digite seu e-mail e enviaremos um link de redefinição" },
  "auth.sendResetLink": { en: "Send Reset Link", pt: "Enviar Link" },
  "auth.sending": { en: "Sending...", pt: "Enviando..." },
  "auth.backToSignIn": { en: "Back to Sign In", pt: "Voltar para Login" },
  "auth.setNewPassword": { en: "Set New Password", pt: "Definir Nova Senha" },
  "auth.setNewPasswordDesc": { en: "Enter your new password below", pt: "Digite sua nova senha abaixo" },
  "auth.newPassword": { en: "New Password", pt: "Nova Senha" },
  "auth.enterNewPassword": { en: "Enter new password", pt: "Digite a nova senha" },
  "auth.confirmNewPassword": { en: "Confirm new password", pt: "Confirme a nova senha" },
  "auth.updatePassword": { en: "Update Password", pt: "Atualizar Senha" },
  "auth.updating": { en: "Updating...", pt: "Atualizando..." },

  // Success / error messages
  "auth.accountCreated": { en: "Account created! Please check your email to verify your account before signing in.", pt: "Conta criada! Verifique seu e-mail para confirmar sua conta antes de entrar." },
  "auth.resetLinkSent": { en: "Password reset link sent! Please check your email.", pt: "Link de redefinição enviado! Verifique seu e-mail." },
  "auth.passwordUpdated": { en: "Password updated successfully! Redirecting...", pt: "Senha atualizada com sucesso! Redirecionando..." },
  "auth.invalidCredentials": { en: "Invalid email or password. Please try again.", pt: "E-mail ou senha inválidos. Tente novamente." },
  "auth.emailNotConfirmed": { en: "Please verify your email address before signing in.", pt: "Verifique seu e-mail antes de entrar." },
  "auth.alreadyRegistered": { en: "This email is already registered. Please sign in instead.", pt: "Este e-mail já está cadastrado. Faça login." },
} as const;

export type TranslationKey = keyof typeof translations;
