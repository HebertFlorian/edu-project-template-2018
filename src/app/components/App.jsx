import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'react-redux';
import configure from './store';

const store = configure();

class ListEpisodes extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            episodes: []
        };
    }

    componentDidMount(){
        fetch('/api/episodes',{
            method: 'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json()
            })
            .then(dataJson =>{
                this.setState({episodes:dataJson})
            })
    }



    render() {
        return(
            <table>
                <thead>
                <tr>
                    <td>Nom</td>
                    <td>Code</td>
                    <td>Note</td>
                </tr>
                </thead>
                <tbody>
                {this.state.episodes.map(episode =>
                    <tr key={episode.id }>
                        <td>{episode.name}</td>
                        <td>{episode.code}</td>
                        <td>{episode.note}</td>
                        <td>
                            <deleteItem episodeId={episode.id}/>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        );
    }
};

class formulaire extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            code: '',
            note: '',

        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeCode = this.handleChangeCode.bind(this);
        this.handleChangeNote = this.handleChangeNote.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeName(event) {
        let state = this.state;
        state.name = event.target.value;
        this.setState(state);
    }

    handleChangeCode(event) {
        let state = this.state;
        state.code = event.target.value;
        this.setState(state);
    }

    handleChangeNote(event) {
        let state = this.state;
        state.note = event.target.value;
        this.setState(state);
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch('/api/episodes',{
            method:'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name:this.state.name,
                code:this.state.code,
                note:this.state.note
            })
        }).then((response)=>{
            if (response.status >= 400) {
                 throw new Error("Bad response from server");
            }
            if (response.status == 201) {
                console.log("bien envoyé")
                window.location.reload();
            }
            window.location.reload();
        })
    }

    render() {
        return(
        <form onSubmit={this.handleSubmit}>
            <label>
                name:
                <input type="text" value={this.state.name} onChange={this.handleChangeName} />
            </label>
            <label>
                code:
                <input type="text" value={this.state.code} onChange={this.handleChangeCode} />
            </label>
            <label>
                note:
                <input type="text" value={this.state.note} onChange={this.handleChangeNote}/>
            </label>
            <input type="submit" value="Submit" />
        </form>
        )
    }
};

class deleteItem extends React.Component {

    constructor(props) {
        super(props);
    }

    deleteAction(){
        fetch("/api/episodes/" + this.props, {
            method: "DELETE"
        })
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error("Error from server");
                } else {
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.error(error);
                window.location.reload();
            });
    }

    render(){
        return(
            <button type="button" onClick={this.deleteAction}>
                <span>X</span>
            </button>
        );
    }
}

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                  <div>
                        <Route path="/" component={ListEpisodes}></Route>
                        <Route path="/" component={formulaire}></Route>

                  </div>
                </Router>
            </Provider>
        );
    }
};
