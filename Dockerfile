FROM oven/bun:1.0.23

WORKDIR /code/

COPY prisma prisma
COPY src src
COPY package.json package.json
COPY bun.lockb bun.lockb
COPY tsconfig.json tsconfig.json
COPY .env .env

RUN bun install
RUN bun run migrate
RUN bun run build

CMD [ "bun", "run", "start" ]
