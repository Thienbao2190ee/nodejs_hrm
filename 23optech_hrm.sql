-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th12 01, 2023 lúc 10:20 AM
-- Phiên bản máy phục vụ: 8.0.30
-- Phiên bản PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `23optech_hrm`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fullName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) NOT NULL,
  `accessToken` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `refreshToken` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createdAt` bigint NOT NULL,
  `updatedAt` bigint DEFAULT NULL,
  `generateOTP` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `email`, `fullName`, `password`, `accessToken`, `refreshToken`, `createdAt`, `updatedAt`, `generateOTP`) VALUES
(32, 'xuanmaihoang6@gmail.com', 'full name 4', '$2a$12$L8Y5rdnIhuNoc24jzw8Eyud0epadgdYQel5wttSEpBzVlz6M45aU.', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6ImZ1bGwgbmFtZSA0IiwiaWF0IjoxNzAxNDA0MjY4LCJleHAiOjE3MDM5OTYyNjh9.4nybQ4i7r7SsjuyJcW1YHRT2ssTiUR48PmvPwZLNIVg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6ImZ1bGwgbmFtZSA0IiwiaWF0IjoxNzAxNDA0MjY4LCJleHAiOjE3MTY5NTYyNjh9.RJHK-Ww96uxJdXrgVhvb2QHzC0C6h-xf-7HCAGg2cXM', 1701404269914, NULL, 417714),
(52, 'thienbao2190e@gmail.com', 'Lại Nguyễn Thiên Bảo', '$2a$12$RDXX5zS4jQ6lc6NQlXBs8.CeZ6rVeanhyn0Ce8yjxRDsoucRtdXQa', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IkzhuqFpIE5ndXnhu4VuIFRoacOqbiBC4bqjbyIsImlhdCI6MTcwMTQyMDI4MCwiZXhwIjoxNzA0MDEyMjgwfQ.wpS5TKdG5zLjXtUYWyQfp98WmAyJ8ncmEE4BIlUnR6Y', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjUyLCJpYXQiOjE3MDE0MjU5NTIsImV4cCI6MTcxNjk3Nzk1Mn0.TIZx2icxNvGrxic3SuvyxZ3mNSVID61RPC3pQviK-WU', 1701420283091, NULL, 556302);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
