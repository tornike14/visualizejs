import type { ProtoExample } from "./types";

export const EXAMPLES: ProtoExample[] = [
  {
    id: "object-create",
    title: "Object.create",
    kind: "object-create",
    description:
      "Object.create() creates a new object with a specified prototype. The new object delegates property lookups to its prototype.",
    codeLines: [
      { num: 1, text: "const animal = {" },
      { num: 2, text: "  eats: true," },
      { num: 3, text: '  walk() { console.log("walking"); }' },
      { num: 4, text: "};" },
      { num: 5, text: "" },
      { num: 6, text: "const rabbit = Object.create(animal);" },
      { num: 7, text: "rabbit.jumps = true;" },
      { num: 8, text: "" },
      { num: 9, text: "console.log(rabbit.jumps);" },
      { num: 10, text: "console.log(rabbit.eats);" },
      { num: 11, text: "rabbit.walk();" },
    ],
    steps: [
      {
        descriptionHtml:
          `An <code>animal</code> object is created with two own properties: <code>eats</code> and <code>walk</code>. Its prototype is <code>Object.prototype</code> (the default).`,
        activeLine: 1,
        doneLines: [],
        chain: [
          {
            label: "animal",
            properties: [
              { name: "eats", value: "true" },
              { name: "walk", value: "f()" },
            ],
            highlight: "active",
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `<code>Object.create(animal)</code> creates a new empty object <code>rabbit</code> whose <code>[[Prototype]]</code> points to <code>animal</code>. This is how delegation is established.`,
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        chain: [
          {
            label: "rabbit",
            properties: [],
            highlight: "active",
          },
          {
            label: "animal",
            properties: [
              { name: "eats", value: "true" },
              { name: "walk", value: "f()" },
            ],
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        activeLink: 0,
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `<code>rabbit.jumps = true</code> adds an <strong>own property</strong> directly on <code>rabbit</code>. This does not affect <code>animal</code> at all.`,
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        chain: [
          {
            label: "rabbit",
            properties: [{ name: "jumps", value: "true" }],
            highlight: "active",
            activeProperty: "jumps",
          },
          {
            label: "animal",
            properties: [
              { name: "eats", value: "true" },
              { name: "walk", value: "f()" },
            ],
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `<code>rabbit.jumps</code> is found directly on <code>rabbit</code> as an own property. No prototype lookup needed. Logs <code>true</code>.`,
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        chain: [
          {
            label: "rabbit",
            properties: [{ name: "jumps", value: "true" }],
            highlight: "found",
            activeProperty: "jumps",
          },
          {
            label: "animal",
            properties: [
              { name: "eats", value: "true" },
              { name: "walk", value: "f()" },
            ],
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        consoleOutput: ["true"],
      },
      {
        descriptionHtml:
          `<code>rabbit.eats</code> is not on <code>rabbit</code>, so the engine walks up the prototype chain. It finds <code>eats: true</code> on <code>animal</code>. Logs <code>true</code>.`,
        activeLine: 10,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        chain: [
          {
            label: "rabbit",
            properties: [{ name: "jumps", value: "true" }],
            highlight: "searching",
          },
          {
            label: "animal",
            properties: [
              { name: "eats", value: "true" },
              { name: "walk", value: "f()" },
            ],
            highlight: "found",
            activeProperty: "eats",
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        activeLink: 0,
        consoleOutput: ["true", "true"],
      },
      {
        descriptionHtml:
          `<code>rabbit.walk()</code> is not on <code>rabbit</code>, so the engine delegates to <code>animal</code> where <code>walk</code> is found. The method runs and logs <code>"walking"</code>. <strong>Key takeaway:</strong> objects inherit behavior through the prototype chain without copying.`,
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        chain: [
          {
            label: "rabbit",
            properties: [{ name: "jumps", value: "true" }],
            highlight: "searching",
          },
          {
            label: "animal",
            properties: [
              { name: "eats", value: "true" },
              { name: "walk", value: "f()" },
            ],
            highlight: "found",
            activeProperty: "walk",
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        activeLink: 0,
        consoleOutput: ["true", "true", "walking"],
      },
    ],
  },

  {
    id: "constructor",
    title: "new, instanceof & Inheritance",
    kind: "constructor",
    description:
      "See how 'new' wires prototypes, how 'instanceof' walks the chain, and how constructors can inherit from each other.",
    codeLines: [
      { num: 1, text: "function Animal(name) {" },
      { num: 2, text: "  this.name = name;" },
      { num: 3, text: "}" },
      { num: 4, text: "Animal.prototype.speak = function() {" },
      { num: 5, text: '  console.log(this.name + " makes a sound");' },
      { num: 6, text: "};" },
      { num: 7, text: "" },
      { num: 8, text: "function Dog(name, breed) {" },
      { num: 9, text: "  Animal.call(this, name);" },
      { num: 10, text: "  this.breed = breed;" },
      { num: 11, text: "}" },
      { num: 12, text: "Dog.prototype = Object.create(Animal.prototype);" },
      { num: 13, text: "Dog.prototype.constructor = Dog;" },
      { num: 14, text: "Dog.prototype.fetch = function() {" },
      { num: 15, text: '  console.log(this.name + " fetches!");' },
      { num: 16, text: "};" },
      { num: 17, text: "" },
      { num: 18, text: 'const rex = new Dog("Rex", "Labrador");' },
      { num: 19, text: "rex.fetch();" },
      { num: 20, text: "rex.speak();" },
      { num: 21, text: "console.log(rex instanceof Dog);" },
      { num: 22, text: "console.log(rex instanceof Animal);" },
    ],
    steps: [
      {
        descriptionHtml:
          `The <code>Animal</code> constructor is declared. Every function gets a <code>.prototype</code> object automatically - this will be the prototype of all <code>Animal</code> instances.`,
        activeLine: 1,
        doneLines: [],
        chain: [
          {
            label: "Animal.prototype",
            properties: [
              { name: "constructor", value: "Animal" },
            ],
            highlight: "active",
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `A <code>speak</code> method is added to <code>Animal.prototype</code>. Any object whose chain includes <code>Animal.prototype</code> will inherit this method.`,
        activeLine: 4,
        doneLines: [1, 2, 3],
        chain: [
          {
            label: "Animal.prototype",
            properties: [
              { name: "constructor", value: "Animal" },
              { name: "speak", value: "f()" },
            ],
            highlight: "active",
            activeProperty: "speak",
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `<code>Dog</code> is declared. Inside it, <code>Animal.call(this, name)</code> borrows <code>Animal</code>'s constructor logic - this is how the parent's instance setup runs for the child.`,
        activeLine: 8,
        doneLines: [1, 2, 3, 4, 5, 6, 7],
        chain: [
          {
            label: "Dog.prototype (original)",
            properties: [
              { name: "constructor", value: "Dog" },
            ],
            highlight: "active",
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `<code>Dog.prototype = Object.create(Animal.prototype)</code> is the key line. It replaces <code>Dog.prototype</code> with a new object whose <code>[[Prototype]]</code> is <code>Animal.prototype</code>. This links Dog into Animal's chain.`,
        activeLine: 12,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        chain: [
          {
            label: "Dog.prototype (new)",
            properties: [],
            highlight: "active",
          },
          {
            label: "Animal.prototype",
            properties: [
              { name: "constructor", value: "Animal" },
              { name: "speak", value: "f()" },
            ],
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        activeLink: 0,
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `We restore <code>Dog.prototype.constructor = Dog</code> (it was lost when we replaced the prototype) and add a <code>fetch</code> method. Dog-specific behavior lives here.`,
        activeLine: 14,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        chain: [
          {
            label: "Dog.prototype",
            properties: [
              { name: "constructor", value: "Dog" },
              { name: "fetch", value: "f()" },
            ],
            highlight: "active",
            activeProperty: "fetch",
          },
          {
            label: "Animal.prototype",
            properties: [
              { name: "constructor", value: "Animal" },
              { name: "speak", value: "f()" },
            ],
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `<code>new Dog("Rex", "Labrador")</code> creates <code>rex</code>. The <code>new</code> operator: (1) creates an empty object, (2) sets its <code>[[Prototype]]</code> to <code>Dog.prototype</code>, (3) runs the <code>Dog</code> constructor (which calls <code>Animal.call</code> to set <code>name</code>).`,
        activeLine: 18,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        chain: [
          {
            label: "rex",
            properties: [
              { name: "name", value: '"Rex"' },
              { name: "breed", value: '"Labrador"' },
            ],
            highlight: "active",
          },
          {
            label: "Dog.prototype",
            properties: [
              { name: "constructor", value: "Dog" },
              { name: "fetch", value: "f()" },
            ],
          },
          {
            label: "Animal.prototype",
            properties: [
              { name: "constructor", value: "Animal" },
              { name: "speak", value: "f()" },
            ],
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        activeLink: 0,
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `<code>rex.fetch()</code> - not on <code>rex</code>, found on <code>Dog.prototype</code>. Dog-specific methods live one level up. <code>this</code> is <code>rex</code>, so it logs <code>"Rex fetches!"</code>.`,
        activeLine: 19,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        chain: [
          {
            label: "rex",
            properties: [
              { name: "name", value: '"Rex"' },
              { name: "breed", value: '"Labrador"' },
            ],
            highlight: "searching",
          },
          {
            label: "Dog.prototype",
            properties: [
              { name: "constructor", value: "Dog" },
              { name: "fetch", value: "f()" },
            ],
            highlight: "found",
            activeProperty: "fetch",
          },
          {
            label: "Animal.prototype",
            properties: [
              { name: "constructor", value: "Animal" },
              { name: "speak", value: "f()" },
            ],
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        activeLink: 0,
        consoleOutput: ["Rex fetches!"],
      },
      {
        descriptionHtml:
          `<code>rex.speak()</code> - not on <code>rex</code>, not on <code>Dog.prototype</code>, but found on <code>Animal.prototype</code>. The chain walked <strong>two levels</strong> up. Inherited methods work seamlessly.`,
        activeLine: 20,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        chain: [
          {
            label: "rex",
            properties: [
              { name: "name", value: '"Rex"' },
              { name: "breed", value: '"Labrador"' },
            ],
            highlight: "searching",
          },
          {
            label: "Dog.prototype",
            properties: [
              { name: "constructor", value: "Dog" },
              { name: "fetch", value: "f()" },
            ],
            highlight: "searching",
          },
          {
            label: "Animal.prototype",
            properties: [
              { name: "constructor", value: "Animal" },
              { name: "speak", value: "f()" },
            ],
            highlight: "found",
            activeProperty: "speak",
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        activeLink: 1,
        consoleOutput: ["Rex fetches!", "Rex makes a sound"],
      },
      {
        descriptionHtml:
          `<code>rex instanceof Dog</code> - the engine checks: is <code>Dog.prototype</code> anywhere in <code>rex</code>'s chain? Yes, one level up. Returns <code>true</code>.`,
        activeLine: 21,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        chain: [
          {
            label: "rex",
            properties: [
              { name: "name", value: '"Rex"' },
              { name: "breed", value: '"Labrador"' },
            ],
            highlight: "searching",
          },
          {
            label: "Dog.prototype",
            properties: [
              { name: "constructor", value: "Dog" },
              { name: "fetch", value: "f()" },
            ],
            highlight: "found",
          },
          {
            label: "Animal.prototype",
            properties: [
              { name: "constructor", value: "Animal" },
              { name: "speak", value: "f()" },
            ],
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        activeLink: 0,
        consoleOutput: ["Rex fetches!", "Rex makes a sound", "true"],
      },
      {
        descriptionHtml:
          `<code>rex instanceof Animal</code> - is <code>Animal.prototype</code> in the chain? Yes, <strong>two</strong> levels up. Also <code>true</code>. <strong>Key takeaway:</strong> <code>instanceof</code> walks the full chain, so <code>rex</code> is an instance of both <code>Dog</code> and <code>Animal</code>.`,
        activeLine: 22,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
        chain: [
          {
            label: "rex",
            properties: [
              { name: "name", value: '"Rex"' },
              { name: "breed", value: '"Labrador"' },
            ],
            highlight: "searching",
          },
          {
            label: "Dog.prototype",
            properties: [
              { name: "constructor", value: "Dog" },
              { name: "fetch", value: "f()" },
            ],
            highlight: "searching",
          },
          {
            label: "Animal.prototype",
            properties: [
              { name: "constructor", value: "Animal" },
              { name: "speak", value: "f()" },
            ],
            highlight: "found",
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        activeLink: 1,
        consoleOutput: ["Rex fetches!", "Rex makes a sound", "true", "true"],
      },
    ],
  },

  {
    id: "shadowing",
    title: "Property Shadowing",
    kind: "lookup",
    description:
      "When an object has the same property name as its prototype, the own property shadows the inherited one.",
    codeLines: [
      { num: 1, text: "const base = {" },
      { num: 2, text: '  greeting: "Hello from base",' },
      { num: 3, text: '  farewell: "Goodbye from base",' },
      { num: 4, text: "};" },
      { num: 5, text: "" },
      { num: 6, text: "const child = Object.create(base);" },
      { num: 7, text: 'child.greeting = "Hello from child";' },
      { num: 8, text: "" },
      { num: 9, text: "console.log(child.greeting);" },
      { num: 10, text: "console.log(child.farewell);" },
      { num: 11, text: "delete child.greeting;" },
      { num: 12, text: "console.log(child.greeting);" },
    ],
    steps: [
      {
        descriptionHtml:
          `A <code>base</code> object is created with <code>greeting</code> and <code>farewell</code> properties.`,
        activeLine: 1,
        doneLines: [],
        chain: [
          {
            label: "base",
            properties: [
              { name: "greeting", value: '"Hello from base"' },
              { name: "farewell", value: '"Goodbye from base"' },
            ],
            highlight: "active",
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `<code>Object.create(base)</code> creates <code>child</code> with <code>base</code> as its prototype. <code>child</code> starts with no own properties.`,
        activeLine: 6,
        doneLines: [1, 2, 3, 4, 5],
        chain: [
          {
            label: "child",
            properties: [],
            highlight: "active",
          },
          {
            label: "base",
            properties: [
              { name: "greeting", value: '"Hello from base"' },
              { name: "farewell", value: '"Goodbye from base"' },
            ],
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        activeLink: 0,
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `Setting <code>child.greeting</code> creates an <strong>own property</strong> on <code>child</code>. This <strong>shadows</strong> the inherited <code>greeting</code> on <code>base</code> - it does not modify <code>base</code>.`,
        activeLine: 7,
        doneLines: [1, 2, 3, 4, 5, 6],
        chain: [
          {
            label: "child",
            properties: [
              { name: "greeting", value: '"Hello from child"' },
            ],
            highlight: "active",
            activeProperty: "greeting",
          },
          {
            label: "base",
            properties: [
              { name: "greeting", value: '"Hello from base"' },
              { name: "farewell", value: '"Goodbye from base"' },
            ],
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        consoleOutput: [],
      },
      {
        descriptionHtml:
          `<code>child.greeting</code> finds the own property on <code>child</code> first. The prototype's <code>greeting</code> is <strong>shadowed</strong> - never reached. Logs <code>"Hello from child"</code>.`,
        activeLine: 9,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8],
        chain: [
          {
            label: "child",
            properties: [
              { name: "greeting", value: '"Hello from child"' },
            ],
            highlight: "found",
            activeProperty: "greeting",
          },
          {
            label: "base",
            properties: [
              { name: "greeting", value: '"Hello from base"' },
              { name: "farewell", value: '"Goodbye from base"' },
            ],
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        consoleOutput: ["Hello from child"],
      },
      {
        descriptionHtml:
          `<code>child.farewell</code> is not on <code>child</code>, so the engine delegates to <code>base</code> and finds it there. Logs <code>"Goodbye from base"</code>.`,
        activeLine: 10,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        chain: [
          {
            label: "child",
            properties: [
              { name: "greeting", value: '"Hello from child"' },
            ],
            highlight: "searching",
          },
          {
            label: "base",
            properties: [
              { name: "greeting", value: '"Hello from base"' },
              { name: "farewell", value: '"Goodbye from base"' },
            ],
            highlight: "found",
            activeProperty: "farewell",
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        activeLink: 0,
        consoleOutput: ["Hello from child", "Goodbye from base"],
      },
      {
        descriptionHtml:
          `<code>delete child.greeting</code> removes the own property from <code>child</code>. The shadow is lifted - the inherited property on <code>base</code> is now reachable again.`,
        activeLine: 11,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        chain: [
          {
            label: "child",
            properties: [],
            highlight: "active",
          },
          {
            label: "base",
            properties: [
              { name: "greeting", value: '"Hello from base"' },
              { name: "farewell", value: '"Goodbye from base"' },
            ],
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        consoleOutput: ["Hello from child", "Goodbye from base"],
      },
      {
        descriptionHtml:
          `<code>child.greeting</code> now delegates to <code>base</code> since the shadow was removed. Logs <code>"Hello from base"</code>. <strong>Key takeaway:</strong> own properties shadow inherited ones; <code>delete</code> only removes own properties and can reveal the inherited version.`,
        activeLine: 12,
        doneLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        chain: [
          {
            label: "child",
            properties: [],
            highlight: "searching",
          },
          {
            label: "base",
            properties: [
              { name: "greeting", value: '"Hello from base"' },
              { name: "farewell", value: '"Goodbye from base"' },
            ],
            highlight: "found",
            activeProperty: "greeting",
          },
          {
            label: "Object.prototype",
            properties: [
              { name: "toString", value: "f()" },
              { name: "hasOwnProperty", value: "f()" },
            ],
          },
          { label: "null", properties: [] },
        ],
        activeLink: 0,
        consoleOutput: ["Hello from child", "Goodbye from base", "Hello from base"],
      },
    ],
  },
];
