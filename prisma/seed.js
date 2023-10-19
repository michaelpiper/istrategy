import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

await Promise.all([
    // migrate provider
    prisma.provider.upsert(
        {
            where: {
              provider_code: "flutterwave"
            },
            create:{
                provider_code: "flutterwave",
                provider_name: "Flutterwave"
            },update:{}
        }
    ),
    prisma.provider.upsert(
        {
            where: {
              provider_code: "stripe"
            },
            create:{
                provider_code: "stripe",
                provider_name: "Stripe"
            },update:{}
        }
    ),
    prisma.provider.upsert(
        {
            where: {
              provider_code: "paystack"
            },
            create:{
                provider_code: "paystack",
                provider_name: "Paystack"
            },update:{}
        }
    ),
    // migrate currency
    prisma.currency.upsert(
        {
            where: {
                currency_code: "USD"
            },
            create:{
                currency_code: "USD",
                currency_name: "US \"Dollar\""
            },update:{}
        }
    ),
    prisma.currency.upsert(
        {
            where: {
                currency_code: "GBP"
            },
            create:{
                currency_code: "GBP",
                currency_name: "EU \"Pounds\""
            },update:{}
        }
    ),
    prisma.currency.upsert(
        {
            where: {
                currency_code: "EUR"
            },
            create:{
                currency_code: "EUR",
                currency_name: "EU \"Euro\""
            },update:{}
        }
    ),
    prisma.currency.upsert(
        {
            where: {
              currency_code: "CHF"
            },
            create:{
                currency_code: "CHF",
                currency_name: "Swiss \"Swiss\""
            },
            update:{}
        }
    )
])
