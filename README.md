# Landing — Site de Casamento (RK Sites)

Landing de venda — plano único R$ 59,90/mês (permanência mínima 6 meses).

## URL (GitHub Pages)

https://eukevytosdev.github.io/site-casamento-landing/

## Fluxo

1. Cadastro na landing  
2. **Um único** checkout de Assinatura no Mercado Pago (R$ 59,90/mês)  
3. Webhook libera o site  

## Render (variáveis)

```text
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_NOTIFICATION_URL=https://site-casamento-backend-nrfb.onrender.com/api/webhooks/mercadopago
MERCADOPAGO_BACK_URL_SUCCESS=https://eukevytosdev.github.io/site-casamento-landing/sucesso.html
MERCADOPAGO_BACK_URL_FAILURE=https://eukevytosdev.github.io/site-casamento-landing/
MERCADOPAGO_VALOR_MENSAL=59.90
```

A aplicação no Mercado Pago precisa do produto **Assinaturas**.
