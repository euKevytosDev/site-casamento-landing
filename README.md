# Loven — Landing de venda

Landing da **Loven**, o produto que nasceu do site do nosso casamento: site de noivos por assinatura (R$ 59,90/mês, cancela quando quiser).

Instagram: [@somosloven](https://instagram.com/somosloven)

## O que essa landing resolve

Explicar o produto, captar cadastro e mandar a pessoa pro checkout. Depois do pagamento, o webhook libera o site em `somosloven.com.br/{slug}`.

Não é o convite em si — é a vitrine comercial. O convite (front dos convidados) e a API ficam em outros repositórios.

## Domínios

| Uso | URL |
|-----|-----|
| Landing | https://somosloven.com.br/ |
| Site da noiva | https://somosloven.com.br/nome-do-casal |
| Demo | https://somosloven.com.br/sofiaelucas |
| Painel | https://somosloven.com.br/admin/ |
| Nosso casamento | https://rafaekevin.com.br/ |

## Fluxo resumido

1. Pessoa se cadastra na landing  
2. Vai pro checkout (Mercado Pago)  
3. Webhook confirma o pagamento e libera o site no slug  

## Variáveis (Render / backend)

Essas URLs o back-end usa pra redirecionar e montar links públicos:

```text
APP_SITE_PUBLIC_BASE_URL=https://somosloven.com.br
MERCADOPAGO_ADMIN_FRONT_URL=https://somosloven.com.br/admin/painel.html
MERCADOPAGO_BACK_URL_SUCCESS=https://somosloven.com.br/sucesso.html
MERCADOPAGO_BACK_URL_FAILURE=https://somosloven.com.br/
```

## Hospedagem no mesmo domínio

Na Hostinger, landing e convite compartilham o domínio. O `.htaccess` do front trata `/slug` como site de casal; pastas tipo `admin/`, `imagens/` e `musicas/` não entram como slug.

## Repos relacionados

- Front do convite: [site-casamento](https://github.com/euKevytosDev/site-casamento)
- API: [site-casamento-backend](https://github.com/euKevytosDev/site-casamento-backend)

## Autor

Raian Kevin — [@euKevytosDev](https://github.com/euKevytosDev)
