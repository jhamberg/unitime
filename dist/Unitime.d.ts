interface Convertable {
    nanos(): Number;
    micros(): Number;
    millis(): Number;
    seconds(): Number;
    minutes(): Number;
    hours(): Number;
    days(): Number;
}
declare class Unitime {
    private converter;
    static ns(input: any): Convertable;
    static us(input: any): Convertable;
    static ms(input: any): Convertable;
    static s(input: any): Convertable;
    static min(input: any): Convertable;
    static h(input: any): Convertable;
    static d(input: any): Convertable;
    ns: (input: any) => number;
    us: (input: any) => number;
    ms: (input: any) => number;
    s: (input: any) => number;
    min: (input: any) => number;
    h: (input: any) => number;
    d: (input: any) => number;
    static to(unit: any): Unitime;
    private constructor();
}
export = Unitime;
