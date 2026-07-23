# Landing — Loven (sites de casamento)

Landing de venda — plano único R$ 59,90/mês (cancele quando quiser).

Marca: **Loven** · Instagram: [@somosloven](https://instagram.com/somosloven)

## Domínio

- Landing: https://somosloven.com/
- Sites das noivas + painel: https://app.somosloven.com/
- Demo: https://app.somosloven.com/?site=sofiaelucas

## Fluxo

1. Cadastro na landing  
2. **Um único** checkout de Assinatura no Mercado Pago (R$ 59,90/mês)  
3. Webhook libera o site  

## Render (variáveis)

```text
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_NOTIFICATION_URL=https://site-casamento-backend-nrfb.onrender.com/api/webhooks/mercadopago
MERCADOPAGO_BACK_URL_SUCCESS=https://somosloven.com/sucesso.html
MERCADOPAGO_BACK_URL_FAILURE=https://somosloven.com/
MERCADOPAGO_VALOR_MENSAL=59.90
APP_SITE_PUBLIC_BASE_URL=https://app.somosloven.com
MERCADOPAGO_ADMIN_FRONT_URL=https://app.somosloven.com/admin/painel.html
```

A aplicação no Mercado Pago precisa do produto **Assinaturas**.

## DNS (Hostinger / registro)

| Host | Tipo | Destino |
|------|------|---------|
| `@` / `www` | A / CNAME | hospedagem da **landing** |
| `app` | CNAME | hospedagem dos **sites + painel** (GitHub Pages ou Hostinger) |
