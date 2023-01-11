
const writer = require("./json-writer");

test("Write Simple", () => {
    const obj = writer.write({ "username": "admin" }, "password", "test");
    expect( obj ).toEqual({ "username": "admin", "password": "test" });
});

test("Write Nested", () => {
    const obj = writer.write({ 
        "account": { 
            "username": "admin" 
        }
    }, "account.password", "test");
    expect( obj ).toEqual({ "account": { "username": "admin", "password": "test" }});
});

test("Write Simple with . in Field", () => {
    const obj = writer.write({ 
        "account": { 
            "username": "admin" 
        }
    }, "account.password", "test", false);
    expect( obj ).toEqual({ "account": { "username": "admin"},  "account.password": "test" });
});

test("Write Array", () => {
    const obj = writer.write({ 
        "accounts": [
            { "username": "admin" }
        ]
    }, "accounts[0].password", "test");
    expect( obj ).toEqual({ 
        "accounts": [
            { "username": "admin", "password": "test" },
        ]
    });
});