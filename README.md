# Landing — Loven (sites de casamento)

Landing de venda — plano único R$ 59,90/mês (cancele quando quiser).

Marca: **Loven** · Instagram: [@somosloven](https://instagram.com/somosloven)

## Domínios

| Uso | URL |
|-----|-----|
| Landing (venda) | https://somosloven.com.br/ |
| Site da noiva | https://somosloven.com.br/nome-do-casal |
| Demo | https://somosloven.com.br/sofiaelucas |
| Painel | https://somosloven.com.br/admin/ |
| Casamento Rafa & Kevin | https://rafaekevin.com.br/ |

## Fluxo

1. Cadastro na landing  
2. Checkout de assinatura  
3. Webhook libera o site em `somosloven.com.br/{slug}`

## Render (variáveis)

```text
APP_SITE_PUBLIC_BASE_URL=https://somosloven.com.br
MERCADOPAGO_ADMIN_FRONT_URL=https://somosloven.com.br/admin/painel.html
MERCADOPAGO_BACK_URL_SUCCESS=https://somosloven.com.br/sucesso.html
MERCADOPAGO_BACK_URL_FAILURE=https://somosloven.com.br/
```

## Hospedagem (mesmo domínio)

Na Hostinger (ou similar), a **landing** fica na raiz e o **convite** também — o `.htaccess` do front redireciona `/slug` para o `index.html` do convite. Pastas `admin/`, `imagens/`, `musicas/` não são tratadas como slug.
