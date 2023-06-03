# based image yang akan digunakan
FROM node:lts-hydrogen

# path di container dimana berisi codingan kita (path bebas sesuai kesepakatan bersama)
WORKDIR /users

# untuk set ENV dalam aplikasi kita
ENV PORT=4001
ENV DB_URI=mongodb+srv://ch2nosql:sosissapi@ojan.f0dsdhi.mongodb.net/
ENV DB_NAME=ch2nosql
ENV NODE_ENV=production
# copy deps yang ada di apps ke WORKDIR
COPY ["package.json", "package-lock.json*", "./"]

# Install npm & Mengapus cache
RUN npm install 

# copy semua file & folder ke WORKDIR
COPY . .

# execute apps: production
CMD ["npm", "run", "start"]