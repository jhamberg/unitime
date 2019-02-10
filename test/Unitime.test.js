describe("Unitime", () => {
    const Unitime = require("../dist/Unitime");

    it("should be defined", () => {
        expect(Unitime).toBeDefined();
    });

    describe("static mode", () => {
        const { ns, us, ms, s, min, h, d } = require("../dist/Unitime");
        const units = [ ns, us, ms, s, min, h, d];
        const convertable = expect.objectContaining({
            nanos: expect.any(Function),
            micros: expect.any(Function),
            millis: expect.any(Function),
            seconds: expect.any(Function),
            minutes: expect.any(Function),
            hours: expect.any(Function),
            days: expect.any(Function)
        });
        const converters = [
            "nanos",
            "micros",
            "millis",
            "seconds",
            "minutes",
            "hours",
            "days"
        ];

        it("should support importing as a class", () => {
            expect(Unitime.s).toBeDefined();
        });

        it("should support destructuring", () => {
            expect(s).toBeDefined();
        });

        it("should export all time units", () => {
            units.forEach(unit => {
                expect(unit).toBeDefined();
            })
        });
        
        describe("unit", () => {
            it("should take integers", () => {
                const ints = [1, 100, 100e2];
                units.forEach(unit => {
                    ints.forEach(int => {
                        expect(() => unit(int)).not.toThrow();
                    });
                });
            });

            it("should take a numbers as strings", () => {
                const strings = ["1", "100", "100e2"]
                units.forEach(unit => {
                    strings.forEach(string => {
                        expect(() => unit(string)).not.toThrow();
                    });
                });
                expect(ms("100").millis()).toEqual(100);
            });

            it("should throw on non-numeric values", () => {
                const values = ["test", undefined, NaN];
                units.forEach(unit => {
                    values.forEach(value => {
                        expect(() => unit(value)).toThrow();
                    });
                });
            });

            it("should return converters as functions in an object", () => {
                units.forEach(unit => {
                    expect(unit(1)).toEqual(convertable);
                });
            });

            describe("converters", () => {
                converters.forEach(converter => {
                    it(`should support ${converter}()`, () => {
                        units.forEach(unit => {
                            expect(unit(1)[converter]).toBeDefined();
                        });
                    });
                });
            });
        });
    });

    describe("instanced mode", () => {
        const targets = [
            "ms",
            "us",
            "ms",
            "s",
            "min",
            "h",
            "d"
        ];

        targets.forEach(target => {
            it(`should support "${target}" as a target`, () => {
                expect(Unitime.to(target)).toBeDefined();
                expect(() => Unitime.to(target)).not.toThrow();
            });
        })
    });
})