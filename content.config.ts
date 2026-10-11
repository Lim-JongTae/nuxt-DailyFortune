import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    // 10천간 백과사전 스키마
    cheongan: defineCollection({
      type: 'page',
      source: 'ko/saju/cheongan/*.md',
      schema: z.object({
        title: z.string(),
        code: z.string(),
        hanja: z.string(),
        element: z.string(),
        polarity: z.string(),
        symbol: z.string(),
        description: z.string()
      })
    }),

    // 12지간 백과사전 스키마
    jiji: defineCollection({
      type: 'page',
      source: 'ko/saju/jiji/*.md',
      schema: z.object({
        title: z.string(),
        code: z.string(),
        hanja: z.string(),
        animal: z.string(),
        element: z.string(),
        season: z.string(),
        time: z.string(),
        description: z.string()
      })
    }),

    // 10십신 백과사전 스키마
    shipsin: defineCollection({
      type: 'page',
      source: 'ko/saju/shipsin/*.md',
      schema: z.object({
        title: z.string(),
        code: z.string(),
        hanja: z.string(),
        category: z.string(),
        description: z.string()
      })
    }),

    // 60일주 종합 해설 스키마
    ilju: defineCollection({
      type: 'page',
      source: 'ko/saju/ilju/*.md',
      schema: z.object({
        title: z.string(),
        code: z.string(),
        cheongan: z.string(),
        jiji: z.string(),
        shipsin: z.string(),
        description: z.string(),
        keywords: z.array(z.string()).optional()
      })
    })
  }
})
