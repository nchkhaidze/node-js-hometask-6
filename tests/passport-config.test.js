const { serializeHandler, deserializeHandler } = require("../passport-config");

jest.mock("../db");
const db = require("../db");

jest.mock("jsonwebtoken");
const jwt = require("jsonwebtoken");

const done = jest.fn();

db.User.updateOne.mockImplementation(({ username }, { jwt }) => { 
    return new Promise((resolve) => {
       if (username !== "nikita_chkhaidze@epam.com") {
           resolve();
       }
       done(null, { username: "nikita_chkhaidze@epam.com", password: "nikita_chkhaidze", jwt: "asdasdqr234324" });
       resolve({ n: 1, nModified: 1, ok: 1 });
    });
})

jwt.sign.mockImplementation(({username}, secret) => {
    return "asdasdqr234324";
}); 

const user = { username: "nikita_chkhaidze@epam.com", password: "nikita_chkhaidze" };

describe("serializer test suite", () => {
    test("serializeHandler should call done with updated user object", async () => {
        await serializeHandler(user, done);
        expect(done.mock.calls[0][0]).toBe(null);
        expect(done.mock.calls[0][1]).toStrictEqual({ username: "nikita_chkhaidze@epam.com", password: "nikita_chkhaidze", jwt: "asdasdqr234324" });
    });

    test("deserializeHandler should call done with user object", async () => {
        await deserializeHandler({ username: "nikita_chkhaidze@epam.com", password: "nikita_chkhaidze", jwt: "asdasdqr234324" }, done);
        expect(done.mock.calls[1][0]).toBe(null);
        expect(done.mock.calls[1][1]).toStrictEqual({ username: "nikita_chkhaidze@epam.com", password: "nikita_chkhaidze", jwt: "asdasdqr234324" });
    });
});