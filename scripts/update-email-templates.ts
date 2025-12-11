import 'dotenv/config';

const PROJECT_REF = 'zppltubgadwwahsnammj';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

const emailStyles = `
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; }
    .header img { max-width: 180px; }
    .header h1 { color: #ffffff; margin: 15px 0 0 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .content h2 { color: #1e3a5f; margin-top: 0; font-size: 22px; }
    .content p { color: #444444; line-height: 1.6; font-size: 16px; }
    .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
    .button:hover { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); }
    .footer { background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e9ecef; }
    .footer p { color: #6c757d; font-size: 13px; margin: 5px 0; }
    .footer a { color: #1e3a5f; text-decoration: none; }
    .warning { background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 12px 16px; margin: 20px 0; }
    .warning p { color: #856404; margin: 0; font-size: 14px; }
  </style>
`;

const templates = {
  // Confirmation email (signup)
  confirmation: {
    subject: 'Confirme seu cadastro - Banco de Talentos GigaCandanga',
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${emailStyles}
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Banco de Talentos</h1>
      <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">GigaCandanga</p>
    </div>
    <div class="content">
      <h2>Confirme seu e-mail</h2>
      <p>Obrigado por se cadastrar no Banco de Talentos da GigaCandanga!</p>
      <p>Para ativar sua conta e acessar as oportunidades de estagio, clique no botao abaixo:</p>
      <p style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #f59e0b; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Confirmar E-mail</a>
      </p>
      <div class="warning">
        <p>Este link expira em 24 horas. Se voce nao solicitou este cadastro, ignore este e-mail.</p>
      </div>
    </div>
    <div class="footer">
      <p><strong>GigaCandanga</strong></p>
      <p>Instituicao de Ciencia e Tecnologia</p>
      <p>Infraestrutura de redes, conectividade e P&D</p>
    </div>
  </div>
</body>
</html>
    `,
  },

  // Password recovery email
  recovery: {
    subject: 'Recupere sua senha - Banco de Talentos GigaCandanga',
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${emailStyles}
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Banco de Talentos</h1>
      <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">GigaCandanga</p>
    </div>
    <div class="content">
      <h2>Recuperacao de Senha</h2>
      <p>Recebemos uma solicitacao para redefinir a senha da sua conta no Banco de Talentos.</p>
      <p>Clique no botao abaixo para criar uma nova senha:</p>
      <p style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #f59e0b; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Redefinir Senha</a>
      </p>
      <div class="warning">
        <p>Este link expira em 1 hora. Se voce nao solicitou a recuperacao de senha, ignore este e-mail - sua conta permanece segura.</p>
      </div>
    </div>
    <div class="footer">
      <p><strong>GigaCandanga</strong></p>
      <p>Instituicao de Ciencia e Tecnologia</p>
      <p>Infraestrutura de redes, conectividade e P&D</p>
    </div>
  </div>
</body>
</html>
    `,
  },

  // Magic link email
  magic_link: {
    subject: 'Seu link de acesso - Banco de Talentos GigaCandanga',
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${emailStyles}
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Banco de Talentos</h1>
      <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">GigaCandanga</p>
    </div>
    <div class="content">
      <h2>Link de Acesso</h2>
      <p>Clique no botao abaixo para acessar sua conta no Banco de Talentos:</p>
      <p style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #f59e0b; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Acessar Conta</a>
      </p>
      <div class="warning">
        <p>Este link expira em 1 hora e so pode ser usado uma vez.</p>
      </div>
    </div>
    <div class="footer">
      <p><strong>GigaCandanga</strong></p>
      <p>Instituicao de Ciencia e Tecnologia</p>
      <p>Infraestrutura de redes, conectividade e P&D</p>
    </div>
  </div>
</body>
</html>
    `,
  },

  // Invite email
  invite: {
    subject: 'Voce foi convidado - Banco de Talentos GigaCandanga',
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${emailStyles}
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Banco de Talentos</h1>
      <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">GigaCandanga</p>
    </div>
    <div class="content">
      <h2>Voce foi convidado!</h2>
      <p>A equipe da GigaCandanga convidou voce para participar do Banco de Talentos.</p>
      <p>Clique no botao abaixo para aceitar o convite e criar sua conta:</p>
      <p style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #f59e0b; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Aceitar Convite</a>
      </p>
      <div class="warning">
        <p>Este convite expira em 7 dias.</p>
      </div>
    </div>
    <div class="footer">
      <p><strong>GigaCandanga</strong></p>
      <p>Instituicao de Ciencia e Tecnologia</p>
      <p>Infraestrutura de redes, conectividade e P&D</p>
    </div>
  </div>
</body>
</html>
    `,
  },

  // Email change confirmation
  email_change: {
    subject: 'Confirme seu novo e-mail - Banco de Talentos GigaCandanga',
    content: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${emailStyles}
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Banco de Talentos</h1>
      <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">GigaCandanga</p>
    </div>
    <div class="content">
      <h2>Confirme seu novo e-mail</h2>
      <p>Voce solicitou a alteracao do e-mail da sua conta no Banco de Talentos.</p>
      <p>Clique no botao abaixo para confirmar seu novo endereco de e-mail:</p>
      <p style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #f59e0b; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Confirmar Novo E-mail</a>
      </p>
      <div class="warning">
        <p>Se voce nao solicitou esta alteracao, entre em contato conosco imediatamente.</p>
      </div>
    </div>
    <div class="footer">
      <p><strong>GigaCandanga</strong></p>
      <p>Instituicao de Ciencia e Tecnologia</p>
      <p>Infraestrutura de redes, conectividade e P&D</p>
    </div>
  </div>
</body>
</html>
    `,
  },
};

async function updateEmailTemplates() {
  if (!ACCESS_TOKEN) {
    console.error('Missing SUPABASE_ACCESS_TOKEN');
    process.exit(1);
  }

  console.log('Updating email templates for Giga Talentos...\n');

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Confirmation email
        mailer_subjects_confirmation: templates.confirmation.subject,
        mailer_templates_confirmation_content: templates.confirmation.content,
        
        // Recovery email
        mailer_subjects_recovery: templates.recovery.subject,
        mailer_templates_recovery_content: templates.recovery.content,
        
        // Magic link email
        mailer_subjects_magic_link: templates.magic_link.subject,
        mailer_templates_magic_link_content: templates.magic_link.content,
        
        // Invite email
        mailer_subjects_invite: templates.invite.subject,
        mailer_templates_invite_content: templates.invite.content,
        
        // Email change
        mailer_subjects_email_change: templates.email_change.subject,
        mailer_templates_email_change_content: templates.email_change.content,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error('Error:', response.status, text);
    process.exit(1);
  }

  console.log('Email templates updated successfully!');
  console.log('Templates configured:');
  console.log('  - Confirmation (signup)');
  console.log('  - Password recovery');
  console.log('  - Magic link');
  console.log('  - Invite');
  console.log('  - Email change');
}

updateEmailTemplates();
