const app = require("../app");
const request = require("supertest");
const { sequelize, User } = require("../models");
const { createSign, verifyToken } = require("../helpers/jwt");
const { queryInterface } = sequelize;

jest.setTimeout(2000);

const user1 = {
  fullName: "User Test",
  email: "user.test@mail.com",
  password: "123456",
  address: "Semarang",
  imageUrl:
    "https://images.unsplash.com/photo-1506795660198-e95c77602129?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
  phoneNumber: "082267580929",
};

const user2 = {
  fullName: "User Test 2",
  email: "user.test2@mail.com",
  password: "123456",
  address: "Semarang",
  imageUrl:
    "https://images.unsplash.com/photo-1506795660198-e95c77602129?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
  phoneNumber: "082267580929",
};

// afterEach(async () => {
//   await queryInterface.bulkDelete(`User`, null, {
//   truncate: true,
//   cascade: true,
//   restartIdentity: true,
//   });
// });

describe("User Routes Test", () => {
  describe("POST /signup - create new user", () => {
    test("201 Success signup - should create new User", (done) => {
      request(app)
        .post("/signup")
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(201);
          expect(body).toHaveProperty("message", expect.any(String));
          return done();
        });
    });

    test("400 Failed signup - should return error if fullName is null", (done) => {
      request(app)
        .post("/signup")
        .send({
          email: "user.test@mail.com",
          password: "123456",
          address: "Semarang",
          imageUrl:
            "https://images.unsplash.com/photo-1506795660198-e95c77602129?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
          phoneNumber: "082267580929",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "FullName is required");
          return done();
        });
    });

    test("400 Failed signup - should return error if email is null", (done) => {
      request(app)
        .post("/signup")
        .send({
          fullName: "User Test",
          password: "123456",
          address: "Semarang",
          imageUrl:
            "https://images.unsplash.com/photo-1506795660198-e95c77602129?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
          phoneNumber: "082267580929",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email is required");
          return done();
        });
    });

    test("400 Failed signup - should return error if email is already exists", (done) => {
      request(app)
        .post("/signup")
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "email must be unique");
          return done();
        });
    });

    test("400 Failed signup - should return error if wrong email format", (done) => {
      request(app)
        .post("/signup")
        .send({
          fullName: "User Test",
          email: "random",
          password: "123456",
          address: "Semarang",
          imageUrl:
            "https://images.unsplash.com/photo-1506795660198-e95c77602129?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
          phoneNumber: "082267580929",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Invalid email format");
          return done();
        });
    });

    test("400 Failed signup - should return error if password is null", (done) => {
      request(app)
        .post("/signup")
        .send({
          fullName: "User Test",
          email: "user.test@mail.com",
          address: "Semarang",
          imageUrl:
            "https://images.unsplash.com/photo-1506795660198-e95c77602129?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
          phoneNumber: "082267580929",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Password is required");
          return done();
        });
    });

    test("400 Failed signup - should return error if phone number is null", (done) => {
      request(app)
        .post("/signup")
        .send({
          fullName: "User Test",
          email: "user.test@mail.com",
          password: "123456",
          address: "Semarang",
          imageUrl:
            "https://images.unsplash.com/photo-1506795660198-e95c77602129?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "PhoneNumber is required");
          return done();
        });
    });
  });

  describe("POST /signin - user signin", () => {
    test("200 Success signin - should return access_token", (done) => {
      request(app)
        .post("/signin")
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body).toHaveProperty("message", expect.any(String));
          expect(body).toHaveProperty("access_token", expect.any(String));
          expect(body).toHaveProperty("id", expect.any(Number));
          return done();
        });
    });

    test("401 Failed signin - should return error", (done) => {
      request(app)
        .post("/signin")
        .send({
          email: "hello@mail.com",
          password: "salahpassword",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid email or password");
          return done();
        });
    });

    test("400 Failed signin when email is null - should return error", (done) => {
      request(app)
        .post("/signin")
        .send({
          password: "salahpassword",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Email is required");
          return done();
        });
    });

    test("400 Failed signin when password is null - should return error", (done) => {
      request(app)
        .post("/signin")
        .send({
          email: "hello@mail.com",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Password is required");
          return done();
        });
    });
  });

  describe("GET / - return data all user", () => {
    test("200 Success get user, return array", (done) => {
      request(app)
        .get("/")
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(200);
          expect(body).toHaveProperty("statusCode", expect.any(Number));
          expect(Array.isArray(body));
          expect(body.user.length).toBeGreaterThan(0);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
