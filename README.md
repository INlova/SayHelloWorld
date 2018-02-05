# SayHelloWorld

What to know how to say "Hello" in Japan?
Or ask for help in Mexico?

This tiny application will show you what your phrase looks like in different countries.

## How to use

Open [Live demo](https://maryzam.github.io/SayHelloWorld/) or [Download](https://github.com/maryzam/SayHelloWorld.git) the app and run locally.

Enter a word or phrase to the input field at the top of the page.

Hover a place on the World map to get a local version for this phrase (translate it to the official language of the selected country).

![demo](https://raw.githubusercontent.com/maryzam/SayHelloWorld/master/assets/images/demo-say-hello.gif)

In case if threre is more than one official language you'll get translation only to the first one.

If the language is not supported by Yandex.Translate than you'll get an origin phrase.

## Dependencies

### Core
- [D3.js](https://d3js.org/) - to create a custom world map
- [Yandex.Translate](https://tech.yandex.ru/translate/) - to translate an entered text dynamically

### Testing
- [Tape](https://github.com/substack/tape) javascript library for unit testing

## License

MIT


