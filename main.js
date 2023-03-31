var app = new Vue({
    el: '#app',
    data: {
        deck: [],
        cardsOnBoard: [],
        cardsOnBoardCount: 0,
        allCardsOnBoard: [],
        selectedCards: [],
        setsOnBoard: [],
        foundSets: [],
        score: 0,
        cardForms: ['oval', 'romb', 'tilda'],
        cardColors: ['red', 'green', 'blue'],
        cardShading: ['fill', 'bar', 'line'],
        cardNumbers: 3,
    },
    computed: {
    },
    methods: {
        startGame(){
            this.makeDeck();
            this.shuffle(this.deck);
            this.dealStart();
            this.checkAll();
        },
        checkAll(){
            this.getAllCardsOnBoard();
            this.setsOnBoard = [];
            for (let first = 0; first < this.allCardsOnBoard.length - 2; first++) {
                for (let second = first + 1; second < this.allCardsOnBoard.length - 1; second++) {
                    for (let third = second + 1; third < this.allCardsOnBoard.length; third++) {
                        let cards = [this.allCardsOnBoard[first], this.allCardsOnBoard[second], this.allCardsOnBoard[third]]
                        if (this.isSet(cards)){
                            this.setsOnBoard.push(cards);
                        }
                    }
                }
            }
            console.log(this.setsOnBoard);
        },
        getAllCardsOnBoard(){
            let cards = [];
            for (let x = 0; x < this.cardsOnBoard.length; x++) {
                for (let y = 0; y < this.cardsOnBoard[x].length; y++) {
                    cards.push(this.cardsOnBoard[x][y]);
                }
            }
            this.allCardsOnBoard = cards;
        },
        showSet(){
            for (let i = 0; i < this.setsOnBoard[0].length; i++) {
                this.setsOnBoard[0][i].help = true;
            }
        },
        makeDeck(){
            this.deck = [];
            this.cardsOnBoard = [];
            this.cardsOnBoardCount = 0;
            this.setsOnBoard = [];
            for (let cardFormIndex = 0; cardFormIndex < this.cardForms.length; ++cardFormIndex) {
                for (let cardColorIndex = 0; cardColorIndex < this.cardColors.length; ++cardColorIndex) {
                    for (let cardShadingIndex = 0; cardShadingIndex < this.cardShading.length; ++cardShadingIndex) {
                        for (let cardNumberIndex = 0; cardNumberIndex < this.cardNumbers; ++cardNumberIndex) {
                            this.deck.push({
                                form: this.cardForms[cardFormIndex],
                                color: this.cardColors[cardColorIndex],
                                shading: this.cardShading[cardShadingIndex],
                                number: cardNumberIndex + 1,
                                isSelected: false,
                                x: null,
                                y: null,
                                help: false,
                                class: "icon-" + this.cardForms[cardFormIndex] + "-" + this.cardShading[cardShadingIndex]
                            });
                        }
                    }
                }
            }
        },
        dealStart(){
            for (let x = 0; x < 3; x++) {
                this.cardsOnBoard[x] = [];
                for (let y = 0; y < 4; y++) {
                    this.dealCardOnBoard(x, y);
                }
            }
        },
        dealMore(){
            if (this.cardsOnBoardCount < 21 && this.deck.length >= 3){
                let y = this.cardsOnBoard[0].length;
                for (let x = 0; x < 3; x++) {
                    this.dealCardOnBoard(x, y);
                }
                this.checkAll();
            }
        },
        dealCardOnBoard(x, y){
            this.cardsOnBoard[x][y] = this.deck[0];
            this.deck.splice(0, 1);
            this.cardsOnBoardCount++;
        },
        selectCard(card, x, y){
            card.isSelected = !card.isSelected;
            if (card.isSelected){
                card.x = x;
                card.y = y;
                this.selectedCards.push(card);
                if (this.selectedCards.length === 3){
                    if (this.isSet(this.selectedCards)){
                        this.removeSetFromBoard();
                        this.clearSelected();
                        if (this.cardsOnBoardCount < 12){
                            this.dealMore();
                        }
                    }
                    else {
                        window.alert("Это не сет!");
                        this.clearSelected();
                        if (this.score > 0) this.score--;
                    }
                }
            }
            else{
                this.selectedCards.splice(this.selectedCards.indexOf(card, 0), 1);
            }
        },
        removeSetFromBoard(){
            let setCards = [];
            for (let i = 0; i < this.selectedCards.length; i++) {
                this.cardsOnBoard[this.selectedCards[i].x][this.selectedCards[i].y] = null;
                this.cardsOnBoardCount--;
                setCards.push(this.selectedCards[i]);
            }
            this.foundSets.unshift(setCards);
            this.score++;
            this.checkAll();
        },
        clearSelected(){
            for (let i = 0; i < this.selectedCards.length; i++) {
                this.selectedCards[i].isSelected = false;
            }
            this.selectedCards = [];
        },
        isSet(cards){
            if (this.isSetProp(cards, 'form')){
                if (this.isSetProp(cards, 'color')){
                    if (this.isSetProp(cards, 'shading')){
                        if (this.isSetProp(cards, 'number')){
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        isSetProp(cards, prop){
            if ((cards[0][prop] === cards[1][prop] && cards[0][prop] === cards[2][prop]) ||
                (cards[0][prop] !== cards[1][prop] && cards[0][prop] !== cards[2][prop] && cards[1][prop] !== cards[2][prop])){
                return true;
            }
            return  false;
        },
        shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
    }
})