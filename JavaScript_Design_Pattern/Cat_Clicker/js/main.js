var model = {
    currentCat: null,
    cats: [{
        name: 'one',
        src: 'images/cat1.jpg',
        count: 0
    }, {
        name: 'two',
        src: 'images/cat2.jpg',
        count: 0
    }, {
        name: 'three',
        src: 'images/cat3.jpg',
        count: 0
    }]
};

var octopus = {
    init: function() {
        model.currentCat = model.cats[0];
        catView.init();
        catListView.init();
    },
    getCurrentCat: function() {
        return model.currentCat;
    },
    getCats: function() {
        return model.cats;
    },
    setCurrentCat: function(cat) {
        model.currentCat = cat;
        catView.render();
    },
    incrementCounter: function() {
        model.currentCat.count++;
        catView.render();
    }
};

var catListView = {
    init: function() {
        this.catLiElem = document.getElementById('cat-list');
        this.render();
    },
    render: function() {
        this.catLiElem.innerHTML = '';
        var cats = octopus.getCats();
        for (var i = 0; i < cats.length; i++) {
            var elem = document.createElement('li');
            elem.textContent = cats[i].name;

            elem.addEventListener('click', (function(cat) {
                return function() {
                    octopus.setCurrentCat(cat)
                }
            })(cats[i]));
            this.catLiElem.appendChild(elem);
        }
    }
};

var catView = {
    init: function() {
        this.catElem = document.getElementById('cat');
        this.catNameElem = document.getElementById('cat-name');
        this.catCountElem = document.getElementById('cat-count');
        this.catImgElem = document.getElementById('cat-image');
        this.catElem.addEventListener('click', function(cat) {
            octopus.incrementCounter();
        });
        this.render();
    },
    render: function() {
        var currentCat = octopus.getCurrentCat();
        this.catNameElem.textContent = currentCat.name;
        this.catCountElem.textContent = currentCat.count;
        this.catImgElem.src = currentCat.src;
    }
};

octopus.init();
