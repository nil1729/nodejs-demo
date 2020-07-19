const fs = require('fs');
const chalk = require('chalk');

const error = chalk.bgRed.black;
const success = chalk.bgGreenBright.black;

const addNote = (title, body) => {
    const notes = loadNotes();
    const duplicateNote = notes.find((note) => note.title == title);
    if (!duplicateNote) {
        notes.push({
            title: title,
            body: body
        });
        saveNotes(notes);
        console.log(success("New Note Added"));
    } else {
        console.log(error('Title Already Taken'));
    }
};

const removeNote = (title) => {
    const notes = loadNotes();
    const notesToKeep = notes.filter((note) => note.title !== title);

    if (notesToKeep.length === notes.length) {
        console.log(error('No Note Found For this Title'));
    } else {
        saveNotes(notesToKeep);
        console.log(success('Note removed for this Title'));
    }
};

const listNotes = () => {
    const notes = loadNotes();
    if (notes.length === 0) {
        console.log(error('No Note Found'));
    } else {
        console.log(chalk.inverse('Your Notes'));
        notes.forEach(note => {
            console.log(note);
        });
    }
};

const readNote = (title) => {
    const notes = loadNotes();
    const desiredNote = notes.find((note) => note.title === title);

    if (desiredNote) {
        console.log(chalk.magenta(desiredNote.title));
        console.log(desiredNote.body);
    } else {
        console.log(error('No Note Found For this title'));
    }
};

const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('notes.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
};

const saveNotes = (notes) => {
    fs.writeFileSync('notes.json', JSON.stringify(notes));
};


module.exports = {
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes,
    readNote: readNote
};