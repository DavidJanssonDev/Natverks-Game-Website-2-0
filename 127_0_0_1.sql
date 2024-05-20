-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 20 maj 2024 kl 16:37
-- Serverversion: 10.4.28-MariaDB
-- PHP-version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `betyggshogandeprojektdb`
--
CREATE DATABASE IF NOT EXISTS `betyggshogandeprojektdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
USE `betyggshogandeprojektdb`;

-- --------------------------------------------------------

--
-- Tabellstruktur `users`
--

CREATE TABLE `users` (
  `id` int(255) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `online` tinyint(1) NOT NULL DEFAULT 0,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `score` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumpning av Data i tabell `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `online`, `deleted`, `created_at`, `score`) VALUES
(1, 'user_1', '$2b$04$AqZhCliSdvFyEsvDSCnjee0XxgSdbKc5xDJDRoWftVrhrwrSGupma', 0, 0, '2024-05-20 14:33:05', 50),
(2, 'user_2', '$2b$10$y9UGr2jzYKq3w9dp3MSN/egS7DWkUWpVhuNVOV0Blbv6ub1MStnQa', 0, 0, '2024-04-09 10:57:38', NULL),
(3, 'user_3', '$2b$09$.UlmWnJgvxAZ3LW3Gvu0pO41qdOCEAO48xrjRziMr/JgyiFVWrN.6', 0, 0, '2024-04-09 10:58:07', NULL),
(4, 'user_4', '$2b$04$EUDHsUSii/wzLkAEFqW6MOLH4PxHUtswW.AmsdWl1wgfrIwV62R6C', 0, 0, '2024-04-09 10:59:49', NULL),
(5, 'user_5', '$2b$04$ZeYn0SLrUAHVKzmOpCHYx.h.dgT.7mYBhFPJ8wXW4fTzeChDCcX8i', 0, 0, '2024-04-09 11:00:29', NULL),
(6, 'user_6', '$2b$04$j9.YRb1Ie2p45xW2mIz2heH3Q5iUtYs99ipffn9L9sYKFT1LHqKLe', 0, 0, '2024-04-09 11:02:54', NULL),
(7, 'user_7', '$2b$09$0ucf92R4LkFg841pw0rh9OPEcc89AVDimym5VIWIWu/O9Kp8hpnc6', 0, 0, '2024-04-09 11:03:37', NULL),
(8, 'user_8', '$2b$07$c2J3yJ4vg2cXMWumUqI.oOj6oV.5cJcpbGkxNhxg0fVCjRlNMKmsy', 0, 0, '2024-04-09 11:04:37', NULL),
(9, 'user_9', '$2b$08$eKGXlUhVHHUwuxRdptD8f.6l.SIDFIgSmx5S1EAtRfDFQslzok9vW', 0, 0, '2024-04-09 11:05:11', NULL),
(10, 'user_10', '$2b$09$zgXv9Jvg4iv1TYDfYNbsPujwdfC3E/vOzxHQeJeQKv9LtIiwhzNwW', 0, 0, '2024-04-09 11:05:48', NULL),
(11, 'user_11', '$2b$04$Akhb97qmx3CZU2xYexvBN.dIx2LiFh8E5CnSCAwcOD1zwdfJg8cRq', 0, 0, '2024-04-09 11:08:24', NULL);

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `users`
--
ALTER TABLE `users`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
