# based image yang akan digunakan
FROM node:lts-hydrogen

# path di container dimana berisi codingan kita (path bebas sesuai kesepakatan bersama)
WORKDIR /orchestrator

# untuk set ENV dalam aplikasi kita
ENV PORT=4000
ENV NODE_ENV=development
ENV URL_USERS=http://localhost:4001
ENV URL_APP=http://localhost:4002
ENV REDIS_URL=redis://default:hzGRhIykbol52mmeAgUO4oGl7tgYFGrs@redis-12350.c252.ap-southeast-1-1.ec2.cloud.redislabs.com:12350
ENV REDIS_PORT=12350

# copy deps yang ada di apps ke WORKDIR
COPY ["package.json", "package-lock.json*", "./"]

# Install npm & Mengapus cache
RUN npm install 

# copy semua file & folder ke WORKDIR
COPY . .

# execute apps: production
CMD ["npm", "run", "start"]