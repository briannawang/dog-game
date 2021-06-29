import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Dog(props) {
    const dogBreeds = ["G. Shep.", "Husky", "G. Ret.", "Corgi", "Shiba", "Dal.", "Pom.", "Bombay"]
    
    var audio = new Audio('/dog_bark.mp3');
    
    var randomInt = Math.random();

    if (randomInt < .2) {
        audio = new Audio('dog_bark.mp3');
    } else if (randomInt >= .2 && randomInt < .4) {
        audio = new Audio('dog_bark_2.mp3');
    } else if (randomInt >= .4 && randomInt < .6) {
        audio = new Audio('medium_bark.mp3');
    } else if (randomInt >= .6 && randomInt < .8) {
        audio = new Audio('dalmatian_bark.mp3');
    } else if (randomInt >= 0.8) {
        audio = new Audio('small_bark.mp3');
    }
    
    const playAudio = () => {
        audio.play();
    };
    
    return (
        <div className= "dogBox">
            <div className= "dog" id= {"dog" + (props.value+1)} onClick={playAudio}>
            </div>
            <h3>{dogBreeds[props.value]}</h3>
        </div>
    )
}

class DogBattle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            winners: [],
            history: [{
                dogIds: []
            }],
            revealOne: false,
            revealTwo: false,
            revealThree: false,
            revealFour: false,
            stepNumber: 0,
        };

        const dogIdsTemp = []

        for (let i = 0; i < 8; i++) {
            dogIdsTemp.push(i)
        }

        this.state.history[0].dogIds = dogIdsTemp.slice();

        for (let i = this.state.history[0].dogIds.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.state.history[0].dogIds[i];
            this.state.history[0].dogIds[i] = this.state.history[0].dogIds[j];
            this.state.history[0].dogIds[j] = temp;
        }
    }
    
    renderDog(i) {
        return (
            <Dog
                value={i}
            />
        )
    }

    dogMatch(round, dogOne, dogTwo) {
        return (
            <div className="bracket">
                <h2>{"Bracket " + round +  ": "}</h2>
                <div className="dogMatch">
                    {this.renderDog(dogOne)}
                    {this.renderDog(dogTwo)}
                </div>
            </div>
        )
    }

    winnerDog(dog) {
        return (
            <div className="bracket">
                <h2>{"Winner: "}</h2>
                <div className="winnerDog">
                    {this.renderDog(dog)}
                </div>
            </div>
        )
    }

    calculateWinner(winnerNum, dogArray) {
        for (let i = 0; i < winnerNum; i++)
            {if (Math.random() >= .5) {
                this.state.winners[i] = dogArray[i * 2]
            } else {
                this.state.winners[i] = dogArray[i * 2 + 1]
            }}
        for (let i = 0; i < this.state.winners.length; i++) {
            dogArray[i] = this.state.winners[i];
        }
    }

    handleClick = () => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const dogIds = current.dogIds.slice();

        this.setState({
            history: history.concat([{
              dogIds: dogIds,
            }]),
            stepNumber: history.length,
          });

        if (!this.state.revealOne) {
            this.setState({revealOne: true})
        } else if (this.state.revealOne && !this.state.revealTwo) {
            this.calculateWinner(4, dogIds)
            this.setState({revealTwo: true})
        } else if (this.state.revealOne && this.state.revealTwo  && !this.state.revealThree) {
            this.calculateWinner(2, dogIds)
            this.setState({revealThree: true})
        } else if (this.state.revealOne && this.state.revealTwo && this.state.revealThree) {
            this.calculateWinner(1, dogIds)
            this.setState({revealFour: true})
        }
    }

    roundOne() {
        const history = this.state.history;

        return (
            <div className= "roundBox roundOne">
            <h1>{"Round 1:"}</h1>
            <div className={"round"}>
                {this.dogMatch(1, history[1].dogIds[0], history[1].dogIds[1])}
                {this.dogMatch(2, history[1].dogIds[2], history[1].dogIds[3])}
                {this.dogMatch(3, history[1].dogIds[4], history[1].dogIds[5])}
                {this.dogMatch(4, history[1].dogIds[6], history[1].dogIds[7])}
            </div>
            <button
                onClick={this.handleClick}
            >
                Reveal Winners!
            </button>
        </div>
        )
    }

    roundTwo() {
        const history = this.state.history;

        return (
            <div className= "roundBox roundTwo">
            <h1>{"Round 2:"}</h1>
            <div className={"round"}>
                {this.dogMatch(1, history[2].dogIds[0], history[2].dogIds[1])}
                {this.dogMatch(2, history[2].dogIds[2], history[2].dogIds[3])}
            </div>
            <button
                onClick={this.handleClick}
            >
                Reveal Winners!
            </button>
        </div>
        )
    }

    roundThree() {
        const history = this.state.history;
        
        return (
            <div className= "roundBox roundThree">
            <h1>{"Round 3:"}</h1>
            <div className={"round"}>
                {this.dogMatch(1, history[3].dogIds[0], history[3].dogIds[1])}
            </div>
            <button
                onClick={this.handleClick}
            >
                Reveal Winner!
            </button>
        </div>
        )
    }

    roundFour() {
        const history = this.state.history;
        const refreshPage = ()=>{
            window.location.reload();
         }
       
        return (
            <div className= "roundBox roundFour">
            <h1>{"Round 4:"}</h1>
            <div className={"round"}>
                {this.winnerDog(history[4].dogIds[0])}
            </div>
            <div>
             <button className="reload" onClick={refreshPage}>Retry</button>
           </div>
            <h3 id="hidden">happy fathers day!</h3>
        </div>
        )
    }

    render() {
        const lineup = []

        for (let i = 0; i < this.state.history[0].dogIds.length; i++) {
            lineup.push(<div key={i}>{this.renderDog(this.state.history[0].dogIds[i])}</div>)
        }

        return (
            <div>
                <div className="introBox">
                    <div className="titleBox">
                        <div className="dogGif"></div>
                        <h1 id="title">DogFight</h1>
                    </div>
                    <div className="scrollButtonContainer">
                        <button className="scrollButton"></button>
                    </div>
                    
                </div>
                <div className= "roundBox">
                    <h1>{"Lineup:"}</h1>
                    <div className="lineup">
                        {lineup}
                    </div>
                    <button onClick={this.handleClick}>Start!</button>
                </div>
                {this.state.revealOne ? this.roundOne() : null}
                {this.state.revealTwo ? this.roundTwo() : null}
                {this.state.revealThree ? this.roundThree() : null}
                {this.state.revealFour ? this.roundFour() : null}
            </div>

        )
    }
}

ReactDOM.render(
    <DogBattle />,
    document.getElementById('root')
  );
