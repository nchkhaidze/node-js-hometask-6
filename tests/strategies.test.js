const { authenticateUser, validateJWT } = require("../strategies");

jest.mock("../db");
const db = require("../db");

db.User.find.mockImplementation((searchObject) => {
    return new Promise((resolve) => {
        if (searchObject.username === "nikita_chkhaidze@epam.com" || searchObject.jwt === "asdasdqr234324") {
            resolve([{ username: "nikita_chkhaidze@epam.com", password: "nikita_chkhaidze", jwt: "asdasdqr234324" }]);
        }
        resolve([]);
    });
})

const done = jest.fn();
const user = "nikita_chkhaidze@epam.com";
const password = "nikita_chkhaidze";
const jwt = "asdasdqr234324";

describe("Strategies test suite", () => {
    test("authenticateUser should call done with 'User not found' if incorrect username is provided", async () => {
        await authenticateUser("invalid", "invalid", done);
        expect(done.mock.calls[0][0]).toBe("User not found")
    });

    test("authenticateUser should call done with 'Invalid password' if correct username is provided, but password is invalid", async () => {
        await authenticateUser(user, "invalid", done);
        expect(done.mock.calls[1][0]).toBe("Invalid password");
    });

    test("authenticateUser should call done with user object if correct username and password are provided", async () => {
        await authenticateUser(user, password, done);
        expect(done.mock.calls[2][0]).toBe(null);
        expect(done.mock.calls[2][1]).toStrictEqual({ username: "nikita_chkhaidze@epam.com", password: "nikita_chkhaidze", jwt: "asdasdqr234324" });
    });

    test("validateJWT should call done with 'Invalid JWT' if JWT is not found in the db", async () => {
        await validateJWT("invalid", done);
        expect(done.mock.calls[3][0]).toBe("Invalid JWT");
    });

    test("validateJWT should call done with user object if JWT is found in the db", async () => {
        await validateJWT(jwt, done);
        expect(done.mock.calls[4][0]).toBe(null);
        expect(done.mock.calls[4][1]).toStrictEqual({ username: "nikita_chkhaidze@epam.com", password: "nikita_chkhaidze", jwt: "asdasdqr234324" });
    });
})
