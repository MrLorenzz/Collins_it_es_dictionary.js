/* global api */
class it_es_CollinsDict {
    constructor(options) {
        this.options = options;
        this.maxexample = 2;
        this.word = '';
    }

    async displayName() {
        let locale = await api.locale();
        if (locale.indexOf('ES') != -1) return 'Diccionario IT->ES Collins';
        return 'Collins IT->ES Dictionary';
    }

    setOptions(options) {
        this.options = options;
        this.maxexample = options.maxexample;
    }

    async findTerm(word) {
        this.word = word;
        let results = await this.findITESCN(word);
        return results;
    }

    async findITESCN(word) {
        let notes = [];
        if (!word) return notes; // return empty notes

        let base = 'https://www.collinsdictionary.com/dictionary/italian-spanish/';
        let url = base + encodeURIComponent(word);
        let doc = '';
        try {
            let data = await api.fetch(url);
            let parser = new DOMParser();
            doc = parser.parseFromString(data, 'text/html');
        } catch (err) {
            return [];
        }

        let definitions = [];
        let definitionElements = doc.querySelectorAll('.dictionary .sense .def');
        definitionElements.forEach(elem => {
            definitions.push(elem.innerText);
        });

        if (definitions.length > 0) {
            let css = this.renderCSS();
            notes.push({
                css,
                definitions,
            });
        } else {
            console.log('No definition found');
        }

        return notes;
    }

    renderCSS() {
        let css = '<style>A:link{TEXT-DECORATION:none}A:visited{TEXT-DECORATION:none}A:active{TEXT-DECORATION:none}A:hover{TEXT-DECORATION:none}</style>';
        return css;
    }
}
