describe("Unitime", () => {
    const Unitime = require("../dist/Unitime");
    const incorrectInputs = ["", " ", "  ", "test", undefined, NaN, null];
    const strings = ["0", "1", "100", "100e2"];
    const ints = [0, 1, 100, 100e2];
    const negativeInputs = [-1, -100, -100e2];

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

        it("should support importing as a class", () => {
            expect(Unitime.s).toBeDefined();
        });

        it("should support destructuring", () => {
            expect(s).toBeDefined();
        });

        it("should export all time units", () => {
            units.forEach(unit => {
                expect(unit).toBeDefined();
            });
        });
        
        describe("unit", () => {
            it("should take integers", () => {
                units.forEach(unit => {
                    ints.forEach(int => {
                        expect(() => unit(int)).not.toThrow();
                    });
                });
            });

            it("should take a numbers as strings", () => {
                units.forEach(unit => {
                    strings.forEach(string => {
                        expect(() => unit(string)).not.toThrow();
                    });
                });
                expect(ms("100").millis()).toEqual(100);
            });

            it("should support template literals", () => {
                units.forEach(unit => {
                    expect(unit`0`).toBeDefined();
                    expect(unit`1`).toBeDefined();
                    expect(unit`100`).toBeDefined();
                    expect(unit`100e2`).toBeDefined();
                });
            });

            it("should throw on non-numeric values", () => {
                units.forEach(unit => {
                    incorrectInputs.forEach(input => {
                        expect(() => unit(input)).toThrow();
                    });
                });
            });

            it("should accept negative values", () => {
                units.forEach(unit => {
                    negativeInputs.forEach(input => {
                        expect(() => unit(input)).not.toThrow();
                    });
                });
                expect(ms(-100).millis()).toEqual(-100);
            });

            it("should expose converters as attached functions", () => {
                units.forEach(unit => {
                    expect(unit(1)).toEqual(convertable);
                });
            });

            describe("converter", () => {
                const converters = [
                    "nanos",
                    "micros",
                    "millis",
                    "seconds",
                    "minutes",
                    "hours",
                    "days"
                ];

                converters.forEach(converter => {
                    it(`should support ${converter}()`, () => {
                        units.forEach(unit => {
                            expect(unit(1)[converter]).toBeDefined();
                        });
                    });
                });

                it("should throw on unrecognized converters", () => {
                    incorrectInputs.forEach(input => {
                        units.forEach(unit => {
                            expect(() => unit(1)[input]()).toThrow();
                        });
                    });
                });
            });
        });
    });

    describe("instanced mode", () => {
        const targets = [ "ns", "us", "ms", "s", "min", "h", "d"];

        it("should export \"to\" as a builder function", () => {
            expect(typeof Unitime.to).toBe("function");
        });

        it("should support destructuring", () => {
            targets.forEach(target => {
                const { ns, us, ms, s, min, h, d } = Unitime.to(target);
                const units = [ ns, us, ms, s, min, h, d];
                units.forEach(unit => {
                    expect(unit).toBeDefined();
                });
            });
        });

        it("should support direct use", () =>{
            targets.forEach(target => {
                const instance = Unitime.to(target);
                targets.forEach(converter => {
                    expect(instance[converter]).toBeDefined();
                });
            });
        });
        
        describe("target", () => {
            targets.forEach(target => {
                it(`should support "${target}"`, () => {
                    expect(Unitime.to(target)).toBeDefined();
                    expect(() => Unitime.to(target)).not.toThrow();
                });
            });
    
            it("should not accept incorrect targets", () => {
                incorrectInputs.forEach(input => {
                    expect(() => Unitime.to(input)).toThrow();
                });
            });

            it("should support template literals", () => {
                targets.forEach(target => {
                    const { ns, us, ms, s, min, h, d } = Unitime.to(target);
                    const units = [ ns, us, ms, s, min, h, d];
                    units.forEach(unit => {
                        expect(unit`0`).toBeDefined();
                        expect(unit`1`).toBeDefined();
                        expect(unit`100`).toBeDefined();
                        expect(unit`100e2`).toBeDefined();
                    });
                });
            });
        });
    });
    
    describe("validity", () => {
        const { ns, us, ms, s, min, h, d } = require("../dist/Unitime");
        const units = [ ns, us, ms, s, min, h, d];
        const lookup = {
            nanos: ns,
            micros: us,
            millis: ms,
            seconds: s,
            minutes: min,
            hours: h,
            days: d
        };

        it("should convert to nanos correctly", () => {
            for (let t = 0; t < 88888; t++) {
                expect(t*1000000000*60*60*24).toEqual(Math.round(d(t).nanos()));
                expect(t*1000000000*60*60).toEqual(Math.round(h(t).nanos()));
                expect(t*1000000000*60).toEqual(Math.round(min(t).nanos()));
                expect(t*1000000000).toEqual(Math.round(s(t).nanos()));
                expect(t*1000000).toEqual(Math.round(ms(t).nanos()));
                expect(t*1000).toEqual(Math.round(us(t).nanos()));
                expect(t).toEqual(Math.round(ns(t).nanos()));
            } 
        });

        it("should convert to micros correctly", () => {
            for (let t = 0; t < 88888; t++) {
                expect(t*1000000*60*60*24).toEqual(Math.round(d(t).micros()));
                expect(t*1000000*60*60).toEqual(Math.round(h(t).micros()));
                expect(t*1000000*60).toEqual(Math.round(min(t).micros()));
                expect(t*1000000).toEqual(Math.round(s(t).micros()));
                expect(t*1000).toEqual(Math.round(ms(t).micros()));
                expect(t).toEqual(Math.round(us(t).micros()));
                expect(t).toEqual(Math.round(ns(t).micros()*1000));
            }
        });

        it("should convert to millis correctly", () => {
            for (let t = 0; t < 88888; t++) {
                expect(t*1000*60*60*24).toEqual(Math.round(d(t).millis()));
                expect(t*1000*60*60).toEqual(Math.round(h(t).millis()));
                expect(t*1000*60).toEqual(Math.round(min(t).millis()));
                expect(t*1000).toEqual(Math.round(s(t).millis()));
                expect(t).toEqual(Math.round(ms(t).millis()));
                expect(t).toEqual(Math.round(us(t).millis()*1000));
                expect(t).toEqual(Math.round(ns(t).millis()*1000000));
            }
        });

        it("should convert to seconds correctly", () => {
            for (let t = 0; t < 88888; t++) {
                expect(t*60*60*24).toEqual(Math.round(d(t).seconds()));
                expect(t*60*60).toEqual(Math.round(h(t).seconds()));
                expect(t*60).toEqual(Math.round(min(t).seconds()));
                expect(t).toEqual(Math.round(s(t).seconds()));
                expect(t).toEqual(Math.round(ms(t).seconds()*1000));
                expect(t).toEqual(Math.round(us(t).seconds()*1000000));
                expect(t).toEqual(Math.round(ns(t).seconds()*1000000000));
            }
        });

        it("should convert to minutes correctly", () => {
            for (let t = 0; t < 88888; t++) {
                expect(t*60*24).toEqual(Math.round(d(t).minutes()));
                expect(t*60).toEqual(Math.round(h(t).minutes()));
                expect(t).toEqual(Math.round(min(t).minutes()));
                expect(t).toEqual(Math.round(s(t).minutes()*60));
                expect(t).toEqual(Math.round(ms(t).minutes()*1000*60));
                expect(t).toEqual(Math.round(us(t).minutes()*1000000*60));
                expect(t).toEqual(Math.round(ns(t).minutes()*1000000000*60));
            }
        });

        it("should convert to hours correctly", () => {
            for (let t = 0; t < 88888; t++) {
                expect(t*24).toEqual(Math.round(d(t).hours()));
                expect(t).toEqual(Math.round(h(t).hours()));
                expect(t).toEqual(Math.round(min(t).hours()*60));
                expect(t).toEqual(Math.round(s(t).hours()*60*60));
                expect(t).toEqual(Math.round(ms(t).hours()*1000*60*60));
                expect(t).toEqual(Math.round(us(t).hours()*1000000*60*60));
                expect(t).toEqual(Math.round(ns(t).hours()*1000000000*60*60));
            }
        });

        it("should convert to days correctly", () => {
            for (let t = 0; t < 88888; t++) {
                expect(t).toEqual(Math.round(d(t).days()));
                expect(t).toEqual(Math.round(h(t).days()*24));
                expect(t).toEqual(Math.round(min(t).days()*60*24));
                expect(t).toEqual(Math.round(s(t).days()*60*60*24));
                expect(t).toEqual(Math.round(ms(t).days()*1000*60*60*24));
                expect(t).toEqual(Math.round(us(t).days()*1000000*60*60*24));
                expect(t).toEqual(Math.round(ns(t).days()*1000000000*60*60*24));
            }
        });

        Object.entries(lookup).forEach(([converter, target]) => {
            it(`should saturate ${converter} correctly`, () => {
                units.forEach(unit => {
                    const ratio = unit(1).nanos() / target(1).nanos();
                    if (ratio >= 1) {
                        const max = Number.MAX_VALUE / ratio;
                        [0, 1, -1, max, -max].forEach(value => {
                            expect(unit(value)[converter]()).toEqual(value * ratio);
                        });
                        expect(unit(Number.MAX_VALUE)[converter]()).toEqual(Number.MAX_VALUE);
                    }
                });
            });
        });
    });

});
