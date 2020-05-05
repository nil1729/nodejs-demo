// const fs = require('fs');

// fs.writeFileSync('notes.txt', 'My Name is Nilanjan');

// // ================ //

// fs.appendFileSync('notes.txt', ' Currently I am Studying about Node.JS!');


// const firstName = require('./utils.js');
// const add = require('./utils.js');

// const sum = add(3, 8);
// console.log(sum);

// const getNotes = require('./notes.js');

// console.log(getNotes());
// const chalk = require('chalk');
// const msg = chalk.green.bgCyan('Success');
// console.log(msg);
const notes = require('./notes.js');
const yargs = require('yargs');
// console.log(process.argv);

yargs.version('1.2.0');

yargs.command({
    command: 'add',
    describe: 'Add a new Note',
    builder: {
        title: {
            describe: 'Note Title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note Body',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.addNote(argv.title, argv.body);
    }
});

yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    builder: {
        title: {
            describe: 'The Note Title',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.removeNote(argv.title);
    }
});

yargs.command({
    command: 'list',
    describe: 'Print the list of notes',
    handler() {
        notes.listNotes();
    }
});

yargs.command({
    command: 'read',
    describe: 'Read a note',
    builder: {
        title: {
            describe: 'Title of the Note',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.readNote(argv.title);
    }
});
// console.log(yargs.argv);
yargs.parse();