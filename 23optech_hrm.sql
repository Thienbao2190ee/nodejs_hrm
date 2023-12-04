-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th12 04, 2023 lúc 04:55 AM
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
-- Cấu trúc bảng cho bảng `tbl_hrm`
--

CREATE TABLE `tbl_hrm` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `gender` tinyint NOT NULL,
  `birth` bigint NOT NULL,
  `hometown` varchar(255) NOT NULL,
  `createdAt` bigint DEFAULT NULL,
  `updatedAt` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_hrm`
--

INSERT INTO `tbl_hrm` (`id`, `name`, `phone`, `email`, `gender`, `birth`, `hometown`, `createdAt`, `updatedAt`) VALUES
(4, 'lại Nguyễn Thiên Bảo', '908011419', 'thienbao2190@gmail.com', 0, 1095783324, '51/9, Khu phố an thuận 1, Phường 7, TP Tân An, Long An', 1701508816913, 1701582041768),
(7, 'lại Nguyễn Hoàng Long', '0908011419', 'thienbao3@gmail.com', 0, 1095783324, '51/9, Khu phố an thuận 1, Phường 7, TP Tân An, Long An', 1701582746691, NULL),
(8, 'lại Nguyễn Hoàng Long', '0908011419', 'thienbao4@gmail.com', 0, 1095783324, '51/9, Khu phố an thuận 1, Phường 7, TP Tân An, Long An', 1701582818535, NULL),
(9, 'lại Nguyễn Thiên Bảo', '0908011429', 'thienbao5@gmail.com', 0, 1095783324, '51/9, Khu phố an thuận 1, Phường 7, TP Tân An, Long An', 1701583585868, 1701583936921);

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
(52, 'thienbao2190e@gmail.com', 'Lại Nguyễn Thiên Bảo', '$2a$12$RDXX5zS4jQ6lc6NQlXBs8.CeZ6rVeanhyn0Ce8yjxRDsoucRtdXQa', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IkzhuqFpIE5ndXnhu4VuIFRoacOqbiBC4bqjbyIsImlhdCI6MTcwMTQyMDI4MCwiZXhwIjoxNzA0MDEyMjgwfQ.wpS5TKdG5zLjXtUYWyQfp98WmAyJ8ncmEE4BIlUnR6Y', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjUyLCJpYXQiOjE3MDE0MjU5NTIsImV4cCI6MTcxNjk3Nzk1Mn0.TIZx2icxNvGrxic3SuvyxZ3mNSVID61RPC3pQviK-WU', 1701420283091, NULL, 556302),
(53, 'nagisaizumi.4869@gamil.com', 'Lại Nguyễn Hoàng Long', '$2a$12$jiy6rz4109IOmj0.EsU48eVR9Xafil6ZTCIZo/.Ieme4C/jdDIdPW', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IkzhuqFpIE5ndXnhu4VuIEhvw6BuZyBMb25nIiwiaWF0IjoxNzAxNTAyMTE1LCJleHAiOjE3MDQwOTQxMTV9.ncBv7-kFbVsbxtvOKQYkhmsgYb6hknciaAphCpEg2Ck', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IkzhuqFpIE5ndXnhu4VuIEhvw6BuZyBMb25nIiwiaWF0IjoxNzAxNTAyMTE1LCJleHAiOjE3MTcwNTQxMTV9.tzp6FvC7fmhxmfvStz9QC5n-dCNylkWnZRTbf9Hf7BE', 1701502118966, NULL, 637952),
(54, 'nagisaizumi4869@gamil.com', 'Lại Nguyễn Hoàng Long', '$2a$12$40kku0ypEdKYU8Li7kKxWexM471CcUtayFzkmsyc6CvdLbQ13Ziom', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IkzhuqFpIE5ndXnhu4VuIEhvw6BuZyBMb25nIiwiaWF0IjoxNzAxNTAyMTk0LCJleHAiOjE3MDQwOTQxOTR9.P2_5zNc57p18FPIVGD954Q_AFzETrSzajzUkRAP5rBQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IkzhuqFpIE5ndXnhu4VuIEhvw6BuZyBMb25nIiwiaWF0IjoxNzAxNTAyMTk0LCJleHAiOjE3MTcwNTQxOTR9.IxGEW6QL_QDAVvvWQNW0EGP_pkIp53uCme7SSB9aMs0', 1701502197091, NULL, 502061),
(55, 'thay.phuc.mat.hip@gmail.com', 'Lại Nguyễn Hoàng Long', '$2a$12$VImCTv6QDbDvhZLZDBvOzONI6W8K09xM5VnKHY0bxnk1Adt4PfkSu', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6IkzhuqFpIE5ndXnhu4VuIEhvw6BuZyBMb25nIiwiaWF0IjoxNzAxNTAyMjc0LCJleHAiOjE3MDQwOTQyNzR9.XIDg5MmoVmSqzL0ZJQoLtgl6kY84zln1KztIn0CcPZU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjU1LCJpYXQiOjE3MDE1MDI2NDIsImV4cCI6MTcxNzA1NDY0Mn0.wfYDL222lna_4yybS6NhLnn-lPIKG_W1vDqf5Lv0kZo', 1701502278395, NULL, 133098),
(56, 'hongnhunghongnhung250304@gamil.com', 'Nguyễn Thị Hồng Nhung', '$2a$12$vOE2BzpjAsquhPD2IHDgAONwZyKh7KT52RiLWknrGYkyljbvdwrMO', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6Ik5ndXnhu4VuIFRo4buLIEjhu5NuZyBOaHVuZyIsImlhdCI6MTcwMTUwMjgzNSwiZXhwIjoxNzA0MDk0ODM1fQ.HAwuPdHOgPuUWOWBDtIAvnbeOtHEbOilJ9VFb1aJ700', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6Ik5ndXnhu4VuIFRo4buLIEjhu5NuZyBOaHVuZyIsImlhdCI6MTcwMTUwMjgzNSwiZXhwIjoxNzE3MDU0ODM1fQ.5qiXhDCrY-akliiIj70R9l4vVpWk_BzHpevKDNldlXo', 1701502839942, NULL, 178385),
(57, 'hongnhung250304@gamil.com', 'Nguyễn Thị Hồng Nhung', '$2a$12$cs.akFCNx0DfhwItPNyYb.2EiL9GyLRe1IqoEvuoIXwxZcnwTWnoK', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6Ik5ndXnhu4VuIFRo4buLIEjhu5NuZyBOaHVuZyIsImlhdCI6MTcwMTUwMjkwMywiZXhwIjoxNzA0MDk0OTAzfQ.NYBls7qAabNTbie3uPWWITVI0-YUrVqDivuML2nxPSc', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6Ik5ndXnhu4VuIFRo4buLIEjhu5NuZyBOaHVuZyIsImlhdCI6MTcwMTUwMjkwMywiZXhwIjoxNzE3MDU0OTAzfQ.UrVnLFcqW0ZQksv0sCVnuhlQUg2LX_Z6JKLItBj5UVc', 1701502906708, NULL, 143616),
(58, 'nn608482@gmail.com', 'Nguyễn Thị Hồng Nhung', '$2a$12$F.60lKc1xt0WnPVFp.MFK.GRnPQTTGSmB4NVyix/7JpOxi8okBla.', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6Ik5ndXnhu4VuIFRo4buLIEjhu5NuZyBOaHVuZyIsImlhdCI6MTcwMTUwMzA0MiwiZXhwIjoxNzA0MDk1MDQyfQ.LdsFkGaSsc7CL6x2Uf8L2mxTQmKbdMMRjjMTDzQdFks', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6Ik5ndXnhu4VuIFRo4buLIEjhu5NuZyBOaHVuZyIsImlhdCI6MTcwMTUwMzA0MiwiZXhwIjoxNzE3MDU1MDQyfQ.sshZaLpRCpRGyYWmGeROJIhyzgb_a4UUyxUDgmuEroo', 1701503045965, NULL, 848259);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `tbl_hrm`
--
ALTER TABLE `tbl_hrm`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `tbl_hrm`
--
ALTER TABLE `tbl_hrm`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
