const fs = require('fs');
const chalk = require('chalk');

const error = chalk.bgRed.black;
const succes = chalk.bgGreenBright.black;

const getNotes = () => {
    return "Your Notes .......";
};

const addNote = (title, body) => {
    const notes = loadNotes();

    const duplicateNote = notes.find((note) => note.title == title);


    // debugger

    if (!duplicateNote) {
        notes.push({
            title: title,
            body: body
        });

        saveNotes(notes);
        console.log(succes("New Note Added"));
    } else {
        console.log(error('Title already taken !'));
    }

};

const removeNote = (title) => {
    const notes = loadNotes();
    const updatedNotes = notes.filter((note) => note.title !== title);

    if (updatedNotes.length === notes.length) {
        console.log(error('Desired Title Not Found'));
    } else {
        saveNotes(updatedNotes);
        console.log(succes('Successfully Removed Note'));
    }
};

const listNotes = () => {
    const notes = loadNotes();
    if (notes.length === 0) {
        console.log(error('No Notes Found'));
    } else {
        console.log(chalk.yellow('Your Notes:'));
        notes.forEach(note => {
            console.log(note);
        });
    }
};

const readNote = (title) => {
    const notes = loadNotes();

    const foundNote = notes.find((note) => note.title == title);

    if (foundNote) {
        console.log(chalk.magenta(title));
        console.log(foundNote.body);
    } else {
        console.log(error('No Note found for this title'));
    }
};

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes);
    fs.writeFileSync('notes.json', dataJSON);
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

module.exports = {
    getNotes: getNotes,
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes,
    readNote: readNote
};