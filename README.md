# Landing — Loven (sites de casamento)

Landing de venda — plano único R$ 59,90/mês (cancele quando quiser).

Marca: **Loven** · Instagram: [@somosloven](https://instagram.com/somosloven)

## Domínios

| Uso | Domínio |
|-----|---------|
| Landing (venda) | https://somosloven.com.br/ |
| Sites das noivas + painel | https://app.somosloven.com.br/ |
| Demo | https://app.somosloven.com.br/?site=sofiaelucas |
| Casamento Rafa & Kevin | https://rafaekevin.com.br/ |

## Fluxo

1. Cadastro na landing  
2. **Um único** checkout de Assinatura no Mercado Pago (R$ 59,90/mês)  
3. Webhook libera o site  

## Render (variáveis)

```text
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_NOTIFICATION_URL=https://site-casamento-backend-nrfb.onrender.com/api/webhooks/mercadopago
MERCADOPAGO_BACK_URL_SUCCESS=https://somosloven.com.br/sucesso.html
MERCADOPAGO_BACK_URL_FAILURE=https://somosloven.com.br/
MERCADOPAGO_VALOR_MENSAL=59.90
APP_SITE_PUBLIC_BASE_URL=https://app.somosloven.com.br
MERCADOPAGO_ADMIN_FRONT_URL=https://app.somosloven.com.br/admin/painel.html
```

## DNS

| Host | Tipo | Destino |
|------|------|---------|
| `@` / `www` (somosloven.com.br) | A / CNAME | **landing** |
| `app` (app.somosloven.com.br) | CNAME | **sites + painel** |
| `rafaekevin.com.br` | — | só o casamento de vocês (não misturar com a Loven) |
