import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'react-redux';
import configure from './store';

import DeleteItem from './AppComponents/DeleteItem';
import EpisodeEdit from './AppComponents/EpisodeEdit';

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
          <table className="table table-hover">
              <thead className="elegant-color">
              <tr>
                  <td>Nom</td>
                  <td>Code</td>
                  <td>Note</td>
                  <td></td>
                  <td></td>
              </tr>
              </thead>
              <tbody className="colorTable">
              {this.state.episodes.map(episode =>
                  <tr class={episode.id}>
                      <td>{episode.name}</td>
                      <td>{episode.code}</td>
                      <td>{episode.note}</td>
                      <td>
                        <DeleteItem idEpisode={episode.id}/>
                      </td>
                      <td>
                        <Link className="btn btn-outline-warning waves-effect" to={`/menu/${episode.id}`}><i className="fa fa-edit mr-1"></i> EDIT</Link>
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
        <form className="elegant-color formDesign" onSubmit={this.handleSubmit}>
            <label>NAME
              <input id="name" className="form-control" type="text" value={this.state.name} onChange={this.handleChangeName} />
            </label>
            <label>CODE
              <input id="code" className="form-control" type="text" value={this.state.code} onChange={this.handleChangeCode} />
            </label>
            <label>NOTE
              <input id="note" className="form-control" type="text" value={this.state.note} onChange={this.handleChangeNote}/>
            </label>
            <button className="btn btn-outline-warning waves-effect" type="submit">ADD</button>
        </form>
        )
    }
};

class deleteItemComponent extends React.Component {

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
          <button type="button" className="" onClick={() => this.deleteAction()}>
              <span>X</span>
          </button>
        );
    }
}

class Menu extends React.Component {

    constructor(props) {
        super(props);
    }


    render(){
        return(
          <nav className="menu mb-1 navbar navbar-expand-lg navbar-dark cyan">

          </nav>
        );
    }
}

class AppComponent extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
        <div>
          <EpisodesList/>
        </div>
        );
    }
};

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                  <div>
                        <Route exact={true} path="/menu" component={formulaire}></Route>
                        <Route exact={true} path="/menu" component={ListEpisodes}></Route>
                        <Route exact={true} path="/menu/:id" component={EpisodeEdit} />
                  </div>
                </Router>
            </Provider>
        );
    }
};
