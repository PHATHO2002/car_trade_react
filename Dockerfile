# Chọn image Node.js chính thức làm base image
FROM node:16

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Thiết lập NODE_ENV là docker
ENV NODE_ENV=docker

# Build ứng dụng React
# Các biến môi trường sẽ được nhúng vào trong quá trình build
RUN npm run build

# Mở cổng 3000 cho ứng dụng
EXPOSE 3000

# Lệnh để chạy ứng dụng React
CMD ["npm", "start"]
