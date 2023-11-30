-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th10 30, 2023 lúc 10:23 AM
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
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fullName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) NOT NULL,
  `accessToken` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `refreshToken` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createdAt` bigint NOT NULL,
  `updatedAt` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `account`, `fullName`, `password`, `accessToken`, `refreshToken`, `createdAt`, `updatedAt`) VALUES
(10, 'User 2', 'full name 2', '$2a$12$tBgw82c/nkWcga.WvvrZHugKOiHazv9D0E5LcWckfqZNTz3yug1sO', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6ImZ1bGwgbmFtZSAyIiwiaWF0IjoxNzAxMzI5MDc3LCJleHAiOjE3MDM5MjEwNzd9.Xl0JOxi7f9gvD06Zl5zuSKPHyk7_rgI2gRsdM1THlOY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6ImZ1bGwgbmFtZSAyIiwiaWF0IjoxNzAxMzI5MDc3LCJleHAiOjE3MTY4ODEwNzd9.LYYp-JxjJ8RPJYS3-oEwOEhkgRayOk2gBQabqaO9AD4', 1701329077330, NULL),
(11, 'User 1', 'full name 1', '$2a$12$HSY2jOcaMrPg7frITFmTVO66A/5blTWU8a7hiNn0gbXZRpl/B/ttO', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6ImZ1bGwgbmFtZSAxIiwiaWF0IjoxNzAxMzI5MTQ2LCJleHAiOjE3MDM5MjExNDZ9._1dX-C8joU-M2UzLrFFhySV-XMIsfuDC_6Rn87kObyE', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6ImZ1bGwgbmFtZSAxIiwiaWF0IjoxNzAxMzI5MTQ2LCJleHAiOjE3MTY4ODExNDZ9.0ElqSLJIzWhyGVFDqqFr3qM9i6rWkTJ4ATxIhA9Bobs', 1701329146676, NULL),
(12, 'User 3', 'full name 3', '$2a$12$CAScQws6f/SRPzETjI7AmeQYSdnH8Foctx0aW53V73y/WXX6FJ.7a', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6ImZ1bGwgbmFtZSAzIiwiaWF0IjoxNzAxMzI5MjIxLCJleHAiOjE3MDM5MjEyMjF9.rWtNGYyeXeVItlcqAKspZgnwll9zvm9ngGYUwHiYvPw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjEyLCJpYXQiOjE3MDEzMzg2MzMsImV4cCI6MTcxNjg5MDYzM30.NtSeT7soXGm3zUKFCusEgkCy7qoXc1_Zsg46j1VXUCw', 1701329221433, NULL),
(13, 'User 4', 'full name 4', '$2a$12$RceWJe1MRmjzP/GTwo5TTeotqVWMe913V3ElqSvse/PawEpP6st.W', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6ImZ1bGwgbmFtZSA0IiwiaWF0IjoxNzAxMzI5NDQ0LCJleHAiOjE3MDM5MjE0NDR9.NKqx2o5nF_6tzC8lrdYT75UzVb1Cuy67PLR8j5Zl35Q', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjEzLCJpYXQiOjE3MDEzMzg1MDgsImV4cCI6MTcxNjg5MDUwOH0.000yMq4weglgfnd0ywd6xdGhZb4q0zKv8BjkhxXueTc', 1701329444782, NULL),
(14, 'User 6', 'full name 4', '$2a$12$ZvGb1s.7uvAsX8ETQ1v.AOUmeMjYEFAmPMeD4iTb2ucgu9wV/SX06', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6ImZ1bGwgbmFtZSA0IiwiaWF0IjoxNzAxMzM4NjIxLCJleHAiOjE3MDM5MzA2MjF9.E6iR5FhAXPd6NR5DSsVBSq09lObDafc1uh_L9oUFQ7E', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6ImZ1bGwgbmFtZSA0IiwiaWF0IjoxNzAxMzM4NjIxLCJleHAiOjE3MTY4OTA2MjF9.4-gfi6xVuebJhYvQQoHZlnxmamsgSbzB3-mzGRZdFbE', 1701338621858, NULL);

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
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
