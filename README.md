# Reptile Shop Website

A full-stack web application for selling reptiles online.
This project allows users to browse reptiles, place orders, and make online payments, while administrators can manage reptiles, customers, and vouchers.

## Main Features

**Customer**

* Browse reptiles
* View reptile details
* Add to cart and place orders
* Pay online with **VNPAY Sandbox**
* View order history

**Admin**

* Manage reptiles
* Manage customers
* Manage vouchers
* Handle payments and refunds

## Tech Stack

**Backend**

* Spring Boot 3
* Java 17
* Hibernate / JPA
* Spring Data Specifications
* Flyway

**Frontend**

* React
* SCSS Modules

**Database**

* MySQL

**Security**

* JWT authentication

**Other**

* Docker for containerization
* VNPAY Sandbox integration for payment and refund

## Run the Project

Backend

```
cd be-shop-pet
mvn spring-boot:run
```

Frontend

```
cd fe-shop-pet-main
npm install
npm run dev
```
