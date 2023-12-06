FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN  npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

ARG NEXT_PUBLIC_TG_TOKEN
ARG NEXT_PUBLIC_CHAT_ID
ARG NEXT_PUBLIC_SERVER_URL
RUN OUTPUT='standalone'\
    NEXT_PUBLIC_TG_TOKEN=${NEXT_PUBLIC_TG_TOKEN}\
    NEXT_PUBLIC_CHAT_ID=${NEXT_PUBLIC_CHAT_ID}\
    NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}\
    NEXT_PUBLIC_GOOGLE_ID=${NEXT_PUBLIC_GOOGLE_ID}\
    npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
