const app = require("../app");
const request = require("supertest");
const { sequelize, Food  } = require("../models");
const { queryInterface } = sequelize;

jest.setTimeout(1000);

let dataFood = require("../data/foods.json");
let foods = dataFood.food.map((el) => {
    el.createdAt = el.updatedAt = new Date();
    return el;
});

const user_access_token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJyZXNjdWVmb29kQGdtYWlsLmNvbSIsImlhdCI6MTY2NzY0OTE1Mn0.Sqkgx312hBggjPziUR-QqYZD4mf8Le70OfR_HEyjhG0";

// beforeEach(async () => {
//     await queryInterface.bulkInsert("Food", foods);
// });

// afterEach(async () => {
//     await queryInterface.bulkDelete(`Food`, null, {
//     truncate: true,
//     cascade: true,
//     restartIdentity: true,
//     });
// });

describe("Food Routes Test", () => {
    describe("GET /food - return data all foods", () => {
        test("200 Success get all foods data, return array", (done) => {
        request(app)
            .get("/food")
            .set({access_token: user_access_token})
            .then((response) => {
                const { body, status } = response;
                expect(status).toBe(200);
                expect(body[0]).toBeInstanceOf(Object);
                expect(body[0].Category).toBeInstanceOf(Object);
                expect(body[0].Restaurant).toBeInstanceOf(Object);
                done();
            })
            .catch((err) => {
                done(err);
            });
        });

        test("401 Failed get foods with invalid token - should return error unauthorized", (done) => {
            request(app)
                .get("/food")
                .set("access_token", "ini invalid token")
                .then((response) => {
                    const { body, status } = response;
                    expect(status).toBe(401);
                    expect(body).toHaveProperty("message", "Invalid token");
                    return done();
                })
                .catch((err) => {
                    done(err)
                })
        });
    });

    describe("GET /food/:id - return data food by Id", () => {
        test("200 Success get one food data, return object", (done) => {
        request(app)
            .get("/food/1")
            .set({access_token: user_access_token})
            .then((response) => {
                const { body, status } = response;
                expect(status).toBe(200);
                expect(body).toBeInstanceOf(Object);
                expect(body).toHaveProperty("id", expect.any(Number));
                expect(body.Category).toBeInstanceOf(Object);
                expect(body.Restaurant).toBeInstanceOf(Object);
                done();
            })
            .catch((err) => {
                done(err);
            });
        });

        test("404 Failed get one food data, return error", (done) => {
            request(app)
                .get("/food/100")
                .set({access_token: user_access_token})
                .then((response) => {
                    const { body, status } = response;
                    expect(status).toBe(404);
                    expect(body).toHaveProperty("message", "Id or data not found");
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        test("401 Failed get one food with invalid token - should return error unauthorized", (done) => {
            request(app)
                .get("/food/1")
                .set("access_token", "ini invalid token")
                .then((response) => {
                    const { body, status } = response;
                    expect(status).toBe(401);
                    expect(body).toHaveProperty("message", "Invalid token");
                    return done();
                })
                .catch((err) => {
                    done(err)
                })
        });
    });


    });