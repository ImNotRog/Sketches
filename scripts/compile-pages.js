// Because programmers are lazy :D


const fs = require('fs');

const prevpages = JSON.parse ( fs.readFileSync("./data/pages.json") );

const pages = new Map();

for(const prevpage of prevpages) {
    const { name, description, tags } = prevpage;
    pages.set(prevpage.link, {
        name,
        description,
        tags
    })
}

/**
 * 
 * @param {string[]} path 
 * @param {fs.Dirent} mydirent 
 */
function writeIntoPages(path,mydirent) {
    // Wow, an implementation of DFS in the wild!

    const dirpath = `./${path.join('/')}`

    const children = fs.readdirSync(dirpath, { withFileTypes: true });

    let contains = new Map();
    for(const a of [`index.html`,`sketch.js`]) {
        contains.set(a, false)
    }

    for(const dirent of children) {
        if(dirent.isDirectory()) writeIntoPages([...path, dirent.name],  dirent);
        
        if(contains.has(dirent.name)) {
            contains.set(dirent.name, true);
        }
    }

    for(const key of contains.keys()) {
        if(!contains.get(key)) {
            // Not an active p5js directory
            return;
        }
    }

    // Already have it!
    if(pages.has(dirpath)) return;

    // Add to pages.json!
    const dirname = mydirent.name;
    const words = dirname.split(/[ -]/g);
    let newwords = [];
    for(const word of words) {
        newwords.push(word.charAt(0).toUpperCase() + word.slice(1));
    }
    const name = newwords.join(" ");

    const tags = path.slice(1,-1);

    pages.set(dirpath, {
        name,
        tags,
        description: ``
    })
} 

writeIntoPages(["sketches"])

let writeobj = [];
for(const link of pages.keys()) {
    const { name, description, tags } = pages.get(link);
    writeobj.push({
        name,
        link,
        description,
        tags
    })
}

fs.writeFileSync("./data/pages.json", JSON.stringify(writeobj));
