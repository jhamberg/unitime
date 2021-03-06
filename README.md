# Unitime - Simplified time units

[![NPM Version][npm-version]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Code Coverage][coveralls-badge]][coveralls-url]
[![License][license-badge]][license-url]

Unitime is a lightweight JavaScript utility module which provides powerful, human-readable functions for converting various time units. The project was inspired by Java's [TimeUnit](https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/TimeUnit.html) by [Doug Lea](http://g.oswego.edu/).

## Human-readable, yet concise

```js
const { h, ms } = require("unitime");

h`720`.days();  // evaluates to 7
ms`3`.nanos();  // evaluates to 3000000
```

## Installation
```bash
npm install unitime
```

## Description
Unitime provides lightweight methods for converting between different units of time with a human-readable syntax. The idea is reducing the mental load caused by interpreting complex time declarations like `24*60*60*1000` or `86400000` which both describe the number of milliseconds in a single day. Using this library you can simply write `d(1)`, or `` d`1` `` if you prefer [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

Time formats that are currently supported are:
- Nanoseconds (ns)
- Microseconds (us)
- Milliseconds (ms)
- Seconds (s)
- Minutes (min)
- Hours (h)
- Days (d)

You can specify the target format on initialization to make the code even more concise. This is especially useful when writing configuration files in JavaScript:

```js
const { d, h } = require("unitime").to("ms")

const config = {
    duration: d`7`, // evaluates to 604800000
    interval: h`12` // evaluates to 43200000
}
```

The library is written entirely in [Typescript](https://www.typescriptlang.org/).

## Usage examples

### Convert to a predefined time unit
You can predefine the target unit by using `.to(unit)` when initializing:

```js
const { ns, s } = require("unitime").to("ms")

ns`100`; // 0.0001
s(1000); // 1000000
```

### Convert to any time unit
You can also individually decide the target unit for each variable:
```js
const { ns, s } = require("unitime")

ns`100`.millis(); // 0.0001
s(100).minutes(); // 1.6666666666666667
```

## License
This work by [Jonatan Hamberg](https://www.cs.helsinki.fi/u/hajo/) is licensed under the [MIT License](https://tldrlegal.com/license/mit-license).

[npm-version]: https://img.shields.io/npm/v/unitime.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/unitime
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[travis-badge]: https://img.shields.io/travis/jhamberg/unitime/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/jhamberg/unitime
[coveralls-badge]: https://img.shields.io/coveralls/jhamberg/unitime/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/jhamberg/unitime?branch=master